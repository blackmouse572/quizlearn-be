/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiAccessToken } from 'src/common/auth/decorators/api.access-token.decorator';
import { AuthJwtAdminAccessProtected } from 'src/common/auth/decorators/auth.decorator';
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
    UserAdminUpdateBannedGuard,
    UserAdminUpdateUnBannedGuard,
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
@ApiAccessToken()
export class UserAdminController {
    constructor(
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

    @UserAdminUpdateBannedGuard()
    @AuthJwtAdminAccessProtected()
    @RequestParamGuard(UserRequestDto)
    @ApiOperation({
        summary: 'Ban user',
        description:
            "Ban user by id, if user is banned, user can't login to the system. Required user is verified and not banned",
        parameters: [
            {
                in: 'path',
                name: 'user',
                required: true,
                schema: {
                    type: 'string',
                },
            },
        ],
    })
    @Post('/ban/:user')
    async banUser(
        @GetUser() user: UserDoc,
        @Param('user') _: string
    ): Promise<UserDoc> {
        return this.userService.banned(user);
    }

    @UserAdminUpdateUnBannedGuard()
    @AuthJwtAdminAccessProtected()
    @RequestParamGuard(UserRequestDto)
    @ApiOperation({
        summary: 'Unban user',
        description:
            "Unban user by id, if user is banned, user can't login to the system. Required user is verified and banned",
        parameters: [
            {
                in: 'path',
                name: 'user',
                required: true,
                schema: {
                    type: 'string',
                },
            },
        ],
    })
    @Post('/unban/:user')
    async unbannedUser(
        @GetUser() user: UserDoc,
        @Param('user') _: string
    ): Promise<UserDoc> {
        return this.userService.unbanned(user);
    }
    @Post('/warning/:user')
    @ApiOperation({
        summary: 'Warning user',
        description:
            'Warning user by id, if user is already warned, user will be banned. Email will be sent to user.',
        parameters: [
            {
                in: 'path',
                name: 'user',
                required: true,
                schema: {
                    type: 'string',
                },
            },
        ],
    })
    async warnUser(
        @GetUser() user: UserDoc,
        @Param('user') _: string
    ): Promise<UserDoc> {
        const isWarning = this.userService.getIsWarned(user);
        if (isWarning) {
            this.emailService.sendBan(user);
            return this.userService.banned(user);
        } else {
            this.emailService.sendWarning(user);
            return this.userService.warningUser(user);
        }
    }

    @AuthJwtAdminAccessProtected()
    @Get('/ban/users')
    async listnBannedUsers(
        @PaginationQuery(
            USER_DEFAULT_PER_PAGE,
            USER_DEFAULT_ORDER_BY,
            USER_DEFAULT_ORDER_DIRECTION,
            USER_DEFAULT_AVAILABLE_SEARCH,
            USER_DEFAULT_AVAILABLE_ORDER_BY
        )
        { _search, _limit, _offset, _order }: PaginationListDto,
        @PaginationQueryFilterEqualObjectId('role')
        role: Record<string, any>
    ): Promise<IResponsePaging> {
        const find: Record<string, any> = {
            ..._search,
            ...role,
            isBan: true,
        };

        const users = await this.userService.findAll(find, {
            paging: {
                limit: _limit,
                offset: _offset,
            },
            order: _order,
            omit: ['passwordHash', 'verificationToken', 'resetToken'],
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
