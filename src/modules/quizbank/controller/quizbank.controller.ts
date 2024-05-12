import {
    Body,
    Controller,
    Delete,
    Get,
    ParseIntPipe,
    Post,
    Put,
    Query,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ApiAccessToken } from 'src/common/auth/decorators/api.access-token.decorator';
import { AuthJwtAccessProtected } from 'src/common/auth/decorators/auth.decorator';
import {
    PaginationQuery,
    PaginationQueryFilterContain,
} from 'src/common/pagination/decorators/pagination.decorator';
import { PaginationListDto } from 'src/common/pagination/dto/pagination.list.dto';
import {
    GetUser,
    UserAuthProtected,
    UserProtected,
} from 'src/modules/accounts/decorators/user.decorator';
import { UserDoc } from 'src/modules/accounts/repository/entities/user.entity';
import {
    QUIZBANK_DEFAULT_AVAILABLE_ORDER_BY,
    QUIZBANK_DEFAULT_AVAILABLE_SEARCH,
    QUIZBANK_DEFAULT_ORDER_BY,
    QUIZBANK_DEFAULT_ORDER_DIRECTION,
    QUIZBANK_DEFAULT_PER_PAGE,
    QUIZBANK_SUBJECT_FIELD,
    QUIZBANK_SUBJECT_QUERY_FIELD,
} from 'src/modules/quizbank/constants/quizbank.constant';
import {
    GetQuizbank,
    QuizbankProtected,
    QuizbankUpdateGuard,
} from 'src/modules/quizbank/decorator/quizbank.decorator';
import { QuizbankCreateDto } from 'src/modules/quizbank/dtos/quizbank-create.dto';
import { IQuizbankDoc } from 'src/modules/quizbank/intefaces/quizbank.service.inteface';
import {
    ENUM_QUIZBANK_VISIBILITY,
    QuizbankDoc,
} from 'src/modules/quizbank/repository/entities/quizbank.entity';
import { QuizService } from 'src/modules/quizbank/services/quiz.service';
import { QuizbankService } from 'src/modules/quizbank/services/quizbank.service';

@Controller('/quizbank')
@ApiTags('modules.quizbank')
@ApiAccessToken()
export class QuizbankController {
    constructor(
        private readonly quizbankService: QuizbankService,
        private readonly quizService: QuizService
    ) {}

    @ApiOperation({
        summary: "Get account's quizbanks",
        description:
            'Get many quizbanks that belong to the account. This will ignore visibility',
    })
    @Get('/getmyquizbank')
    @UserAuthProtected()
    @AuthJwtAccessProtected()
    async getManyQuizbanks(
        @PaginationQuery(
            QUIZBANK_DEFAULT_PER_PAGE,
            QUIZBANK_DEFAULT_ORDER_BY,
            QUIZBANK_DEFAULT_ORDER_DIRECTION,
            QUIZBANK_DEFAULT_AVAILABLE_SEARCH,
            QUIZBANK_DEFAULT_AVAILABLE_ORDER_BY
        )
        { _search, _limit, _offset, _order }: PaginationListDto,
        @GetUser() user: UserDoc
    ) {
        const find: Record<string, any> = {
            ..._search,
            author: user._id,
        };

        const quizbanksPromise = this.quizbankService.findAll(find, {
            paging: { limit: _limit, offset: _offset },
            order: _order,
        });
        const totalPromise = this.quizbankService.getTotal(find, {
            paging: { limit: _limit, offset: _offset },
        });

        const [quizbanks, total] = await Promise.all([
            quizbanksPromise,
            totalPromise,
        ]);

        return {
            _pagination: {
                total,
                limit: _limit,
                offset: _offset,
            },
            data: quizbanks,
            metadata: {
                total,
                hasMore: total > _offset + 1,
                skip: _offset,
                take: _limit,
            },
        };
    }

    @Post('/')
    @ApiOperation({
        summary: 'Create new quizbank',
        description: 'Create quizbank with quizzes',
    })
    @UserAuthProtected()
    @AuthJwtAccessProtected()
    async createQuizbank(
        @GetUser() user: UserDoc,
        @Body() payload: QuizbankCreateDto
    ) {
        return this.quizbankService.createQuizbank(payload, user);
    }

    @Get('/get-by-subject')
    @ApiOperation({
        summary: 'Get quizbanks by subject',
        description: 'Get quizbanks by subject',
    })
    @ApiQuery({ name: QUIZBANK_SUBJECT_QUERY_FIELD, type: String })
    async getQuizbanksBySubject(
        @PaginationQuery(
            QUIZBANK_DEFAULT_PER_PAGE,
            QUIZBANK_DEFAULT_ORDER_BY,
            QUIZBANK_DEFAULT_ORDER_DIRECTION,
            QUIZBANK_DEFAULT_AVAILABLE_SEARCH,
            QUIZBANK_DEFAULT_AVAILABLE_ORDER_BY
        )
        { _search, _limit, _offset, _order }: PaginationListDto,

        @PaginationQueryFilterContain(
            QUIZBANK_SUBJECT_FIELD,
            QUIZBANK_SUBJECT_QUERY_FIELD
        )
        tag: Record<string, any>
    ) {
        const find = {
            ..._search,
            ...tag,
            visibility: ENUM_QUIZBANK_VISIBILITY.PUBLIC,
        };

        const quizbanksPromise = this.quizbankService.findAll(find, {
            paging: { limit: _limit, offset: _offset },
            order: _order,
        });

        const totalPromise = this.quizbankService.getTotal(find, {
            paging: { limit: _limit, offset: _offset },
        });

        const [quizbanks, total] = await Promise.all([
            quizbanksPromise,
            totalPromise,
        ]);

        return {
            _pagination: {
                total,
                limit: _limit,
                offset: _offset,
            },
            data: quizbanks,
            metadata: {
                total,
                hasMore: total > _offset + 1,
                skip: _offset,
                take: _limit,
            },
        };
    }

    @ApiOperation({
        summary: 'Get all quizbank related to quizbank',
        description: 'This only return quizbank that have same tags',
    })
    @Get('/:quizbank/related')
    @QuizbankProtected()
    async getRelatedQuizbanks(@GetQuizbank() quizbank: IQuizbankDoc) {
        const find = {
            tags: { $in: quizbank.tags },
            visibility: ENUM_QUIZBANK_VISIBILITY.PUBLIC,
        };

        return this.quizbankService.findAll(find);
    }

    @ApiOperation({
        summary: "Rate quizbank's quiz",
        description: "Rate quizbank's quiz",
    })
    @ApiQuery({
        name: 'star',
        type: Number,
        example: 5,
        required: true,
    })
    @UserProtected()
    @AuthJwtAccessProtected()
    @Post('rating/:quizbank')
    @QuizbankProtected()
    @ApiParam({ name: 'quizbank', type: String })
    async rateQuizbank(
        @GetQuizbank() quizbank: QuizbankDoc,
        @Query('star', ParseIntPipe) star: number,
        @GetUser() user: UserDoc
    ) {
        quizbank.rating.push({
            accountId: user.id,
            star: star,
        });

        return this.quizbankService.save(quizbank);
    }
    @ApiOperation({
        summary: 'Get quizbank by id',
        description: 'Get quizbank by id',
    })
    @ApiParam({ name: 'quizbank', type: String })
    @Get('/:quizbank')
    @QuizbankProtected()
    async getQuizbankById(@GetQuizbank() quizbank: IQuizbankDoc) {
        return quizbank;
    }

    @ApiOperation({
        summary: 'Update quizbank by id',
        description:
            'Update quizbank by id. Make sure re-provide all quizzes to update',
    })
    @ApiParam({ name: 'quizbank', type: String })
    @Put('/:quizbank')
    @QuizbankUpdateGuard()
    @UserProtected()
    @AuthJwtAccessProtected()
    async updateQuizbankById(
        @GetQuizbank() quizbank: QuizbankDoc,
        @GetUser() user: UserDoc,
        @Body() payload: QuizbankCreateDto
    ) {
        return this.quizbankService.saveWithQuizzes(payload, quizbank);
    }

    @ApiOperation({
        summary: 'Delete quizbank by id',
        description:
            'Delete quizbank by id. All quizzes that associated with this quizbank will be deleted',
    })
    @ApiParam({ name: 'quizbank', type: String })
    @Delete('/:quizbank')
    @QuizbankUpdateGuard()
    @UserProtected()
    @AuthJwtAccessProtected()
    async deleteQuizbankById(@GetQuizbank() quizbank: QuizbankDoc) {
        this.quizService.deleteQuizzesByQuizbankId(quizbank._id);
        return this.quizbankService.delete(quizbank);
    }
}
