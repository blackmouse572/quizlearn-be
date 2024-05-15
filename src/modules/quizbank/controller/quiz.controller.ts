import {
    Body,
    Controller,
    ForbiddenException,
    Get,
    Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiAccessToken } from 'src/common/auth/decorators/api.access-token.decorator';
import { AuthJwtAccessProtected } from 'src/common/auth/decorators/auth.decorator';
import { GeminiService } from 'src/common/gemini/gemini.service';
import {
    GetUser,
    UserAuthProtected,
} from 'src/modules/accounts/decorators/user.decorator';
import { UserDoc } from 'src/modules/accounts/repository/entities/user.entity';
import { UserService } from 'src/modules/accounts/services/account.service';
import {
    GetQuizbank,
    QuizbankProtected,
} from 'src/modules/quizbank/decorator/quizbank.decorator';
import { QuizAiDto } from 'src/modules/quizbank/dtos/quiz-ai.dto';
import { QuizbankDoc } from 'src/modules/quizbank/repository/entities/quizbank.entity';
import { QuizService } from 'src/modules/quizbank/services/quiz.service';

@Controller('/quiz')
@ApiTags('modules.quizbank')
@ApiAccessToken()
export class QuizController {
    constructor(
        private readonly quizService: QuizService,
        private readonly userService: UserService,
        private readonly geminiService: GeminiService
    ) {}

    @ApiOperation({
        summary: 'Get all quizzes that belong to the quizbank',
        description: 'Get all quizzes that belong to the quizbank',
    })
    @Get('/:quizbank')
    @QuizbankProtected()
    async getManyQuizzes(@GetQuizbank() quizbank: QuizbankDoc) {
        const quizzes = await this.quizService.getQuizzesByQuizbankId(
            quizbank._id
        );

        return {
            data: quizzes,
            metadata: {
                totals: quizzes.length,
                take: quizzes.length,
                skip: 0,
                hasMore: false,
            },
        };
    }

    @ApiOperation({
        summary: "Generate answer for the quiz's question",
        description:
            "Use the AI to generate the answer for the quiz's question, user's ai count will be deducted",
    })
    @UserAuthProtected()
    @AuthJwtAccessProtected()
    @Post('/get-answer')
    async getAnswer(@GetUser() user: UserDoc, @Body() payload: QuizAiDto) {
        if (user.useAICount <= 0) {
            throw new ForbiddenException({
                statusCode: 403,
                message: 'You do not have enough AI count to use this feature',
            });
        }
        const restAiCount = user.useAICount - 1 < 0 ? 0 : user.useAICount - 1;
        this.userService.updateUserAICount(user, { useAICount: restAiCount });
        const prompt = `Context: You are a teacher and you are answer the question of the quiz. Your mission is to answer the question as best as you can. And give the reason why you choose that answer. Also, provide the source of the information.
        Here is the question:
        """
        ${payload.question}
        """`;

        return {
            data: await this.geminiService.generateText(prompt),
        };
    }

    @ApiOperation({
        summary: "Generate answer for the quiz's question",
        description:
            "Use the AI to generate the answer for the quiz's question, user's ai count will be deducted",
    })
    @UserAuthProtected()
    @AuthJwtAccessProtected()
    @Post('/text-only-input')
    async getCorrectAnswer(
        @GetUser() user: UserDoc,
        @Body() payload: QuizAiDto
    ) {
        if (user.useAICount <= 0) {
            throw new ForbiddenException({
                statusCode: 403,
                message: 'You do not have enough AI count to use this feature',
            });
        }
        const restAiCount = user.useAICount - 1 < 0 ? 0 : user.useAICount - 1;
        this.userService.updateUserAICount(user, { useAICount: restAiCount });
        const prompt = `Context: You are a teacher and you are validating the question and the answer of the quiz. Your mission is to answer to find the most correct answer from the belows. And give the reason why you choose that answer. Also, provide the source of the information.
        Here is the question:
        """
        ${payload.question}
        """
        Here is the answers:
        """
        ${payload.answer}
        """
        `;

        return {
            data: await this.geminiService.generateText(prompt),
        };
    }
}
