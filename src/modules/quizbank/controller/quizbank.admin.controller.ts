import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiAccessToken } from 'src/common/auth/decorators/api.access-token.decorator';
import { AuthJwtAccessProtected } from 'src/common/auth/decorators/auth.decorator';
import { PaginationQuery } from 'src/common/pagination/decorators/pagination.decorator';
import { PaginationListDto } from 'src/common/pagination/dto/pagination.list.dto';
import { UserAdminGetGuard } from 'src/modules/accounts/decorators/admin.decorator';
import {
    QUIZBANK_DEFAULT_AVAILABLE_ORDER_BY,
    QUIZBANK_DEFAULT_AVAILABLE_SEARCH,
    QUIZBANK_DEFAULT_ORDER_BY,
    QUIZBANK_DEFAULT_ORDER_DIRECTION,
    QUIZBANK_DEFAULT_PER_PAGE,
} from 'src/modules/quizbank/constants/quizbank.constant';
import { QuizService } from 'src/modules/quizbank/services/quiz.service';
import { QuizbankService } from 'src/modules/quizbank/services/quizbank.service';

@Controller('/quizbank')
@ApiTags('modules.admin.quizbank')
@ApiAccessToken()
export class QuizbankAdminController {
    constructor(
        private readonly quizbankService: QuizbankService,
        private readonly quizService: QuizService
    ) {}

    @Get('/')
    @AuthJwtAccessProtected()
    @UserAdminGetGuard()
    async getManyQuizbanks(
        @PaginationQuery(
            QUIZBANK_DEFAULT_PER_PAGE,
            QUIZBANK_DEFAULT_ORDER_BY,
            QUIZBANK_DEFAULT_ORDER_DIRECTION,
            QUIZBANK_DEFAULT_AVAILABLE_SEARCH,
            QUIZBANK_DEFAULT_AVAILABLE_ORDER_BY
        )
        { _search, _limit, _offset, _order }: PaginationListDto
    ) {
        const find: Record<string, any> = {
            ..._search,
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
}
