import { Controller, Get, Param, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthJwtAdminAccessProtected } from 'src/common/auth/decorators/auth.decorator';
import { AuthService } from 'src/common/auth/services/auth.service';
import { IResponsePaging } from 'src/common/helpers/interfaces/response.interface';
import {
    PaginationQuery,
    PaginationQueryFilterEqualObjectId,
    PaginationQueryFilterInBoolean,
} from 'src/common/pagination/decorators/pagination.decorator';
import { PaginationListDto } from 'src/common/pagination/dto/pagination.list.dto';
import { PaginationService } from 'src/common/pagination/services/pagination.service';
import { RequestParamGuard } from 'src/lib/guards/request.decorator';
import {
    USER_DEFAULT_AVAILABLE_ORDER_BY,
    USER_DEFAULT_AVAILABLE_SEARCH,
    USER_DEFAULT_BLOCKED,
    USER_DEFAULT_ORDER_BY,
    USER_DEFAULT_ORDER_DIRECTION,
    USER_DEFAULT_PER_PAGE,
} from 'src/modules/accounts/constants/user.constant';
import {
    UserAdminGetGuard,
    UserAdminUpdateInactiveGuard,
} from 'src/modules/accounts/decorators/admin.decorator';
import { GetUser } from 'src/modules/accounts/decorators/user.decorator';
import { UserRequestDto } from 'src/modules/accounts/dtos/user.req.dto';
import { UserDoc } from 'src/modules/accounts/repository/entities/user.entity';
import { UserService } from 'src/modules/accounts/services/account.service';
import { EmailService } from 'src/modules/email/services/email.service';

@ApiTags('modules.admin.user')
@Controller({
    version: '1',
    path: '/accounts',
})
export class UserAdminController {
    constructor(
        private readonly authService: AuthService,
        private readonly paginationService: PaginationService,
        private readonly userService: UserService,
        private readonly emailService: EmailService
    ) {}

    @AuthJwtAdminAccessProtected()
    @Get('/')
    async list(
        @PaginationQuery(
            USER_DEFAULT_PER_PAGE,
            USER_DEFAULT_ORDER_BY,
            USER_DEFAULT_ORDER_DIRECTION,
            USER_DEFAULT_AVAILABLE_SEARCH,
            USER_DEFAULT_AVAILABLE_ORDER_BY
        )
        { _search, _limit, _offset, _order }: PaginationListDto,
        @PaginationQueryFilterInBoolean('isBan', USER_DEFAULT_BLOCKED)
        isBan: Record<string, any>,
        @PaginationQueryFilterEqualObjectId('role')
        role: Record<string, any>
    ): Promise<IResponsePaging> {
        const find: Record<string, any> = {
            ..._search,
            ...isBan,
            ...role,
        };

        const users = await this.userService.findAll(find, {
            paging: {
                limit: _limit,
                offset: _offset,
            },
            order: _order,
        });
        const total: number = await this.userService.getTotal(find);
        const totalPage: number = this.paginationService.totalPage(
            total,
            _limit
        );

        return {
            _pagination: { total, totalPage },
            metadata: {
                total,
                hasMore: totalPage > _offset + 1,
                skip: _offset,
                take: _limit,
            },
            data: users,
        };
    }

    @UserAdminGetGuard()
    @AuthJwtAdminAccessProtected()
    @RequestParamGuard(UserRequestDto)
    @Get('/:user')
    async get(
        @GetUser() user: UserDoc,
        @Param('user') _user: string
    ): Promise<UserDoc> {
        if (user.id === _user) {
            return user;
        }

        return await this.userService.findOneById(_user);
    }

    @UserAdminUpdateInactiveGuard()
    @AuthJwtAdminAccessProtected()
    @RequestParamGuard(UserRequestDto)
    @Patch('/update/:user/inactive')
    async inactive(@GetUser() user: UserDoc): Promise<void> {
        await this.userService.inactive(user);

        return;
    }

    // @UserAdminUpdateActiveGuard()
    // @AuthJwtAdminAccessProtected()
    // @RequestParamGuard(UserRequestDto)
    // @Patch('/update/:user/active')
    // async active(@GetUser() user: UserDoc): Promise<void> {
    //     await this.userService.active(user);

    //     return;
    // }

    // @UserAdminUpdateBlockedGuard()
    // @AuthJwtAdminAccessProtected()
    // @RequestParamGuard(UserRequestDto)
    // @Patch('/update/:user/blocked')
    // async blocked(@GetUser() user: UserDoc): Promise<void> {
    //     await this.userService.blocked(user);

    //     return;
    // }

    // @UserAdminDeleteGuard()
    // @AuthJwtAdminAccessProtected()
    // @RequestParamGuard(UserRequestDto)
    // @Delete('/delete/:user')
    // async delete(@GetUser() user: UserDoc): Promise<void> {
    //     await this.userService.delete(user);

    //     return;
    // }
}
