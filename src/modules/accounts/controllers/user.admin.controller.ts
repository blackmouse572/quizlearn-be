import {
    Body,
    ConflictException,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Patch,
    Post,
    Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthJwtAdminAccessProtected } from 'src/common/auth/decorators/auth.decorator';
import { IAuthPassword } from 'src/common/auth/interfaces/auth.interface';
import { AuthService } from 'src/common/auth/services/auth.service';
import {
    IResponse,
    IResponsePaging,
} from 'src/common/helpers/interfaces/response.interface';
import {
    PaginationQuery,
    PaginationQueryFilterEqualObjectId,
    PaginationQueryFilterInBoolean,
} from 'src/common/pagination/decorators/pagination.decorator';
import { PaginationListDto } from 'src/common/pagination/dto/pagination.list.dto';
import { PaginationService } from 'src/common/pagination/services/pagination.service';
import { RequestParamGuard } from 'src/lib/guards/request.decorator';
import {
    ENUM_USER_SIGN_UP_FROM,
    USER_DEFAULT_AVAILABLE_ORDER_BY,
    USER_DEFAULT_AVAILABLE_SEARCH,
    USER_DEFAULT_BLOCKED,
    USER_DEFAULT_ORDER_BY,
    USER_DEFAULT_ORDER_DIRECTION,
    USER_DEFAULT_PER_PAGE,
} from 'src/modules/accounts/constants/user.constant';
import { GetUser } from 'src/modules/accounts/decorators/user.decorator';
import { UserCreateDto } from 'src/modules/accounts/dtos/user-create.dto';
import { UserUpdateNameDto } from 'src/modules/accounts/dtos/user-update.dto';
import { UserRequestDto } from 'src/modules/accounts/dtos/user.req.dto';
import { UserDoc } from 'src/modules/accounts/repository/entities/user.entity';
import { UserService } from 'src/modules/accounts/services/account.service';

@ApiTags('modules.admin.user')
@Controller({
    version: '1',
    path: '/accounts',
})
export class UserAdminController {
    constructor(
        private readonly authService: AuthService,
        private readonly paginationService: PaginationService,
        private readonly userService: UserService
        // private readonly emailService: EmailService
    ) {}

    @AuthJwtAdminAccessProtected()
    @Get('/accounts')
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
    async get(@GetUser() user: UserDoc): Promise<IResponse> {
        return { data: user.toObject() };
    }

    @UserAdminInactiveDoc()
    @Response('user.inactive')
    @UserAdminUpdateInactiveGuard()
    @PolicyAbilityProtected({
        subject: ENUM_POLICY_SUBJECT.USER,
        action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.UPDATE],
    })
    @AuthJwtAdminAccessProtected()
    @ApiKeyPublicProtected()
    @RequestParamGuard(UserRequestDto)
    @Patch('/update/:user/inactive')
    async inactive(@GetUser() user: UserDoc): Promise<void> {
        await this.userService.inactive(user);

        return;
    }

    @UserAdminActiveDoc()
    @Response('user.active')
    @UserAdminUpdateActiveGuard()
    @PolicyAbilityProtected({
        subject: ENUM_POLICY_SUBJECT.USER,
        action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.UPDATE],
    })
    @AuthJwtAdminAccessProtected()
    @ApiKeyPublicProtected()
    @RequestParamGuard(UserRequestDto)
    @Patch('/update/:user/active')
    async active(@GetUser() user: UserDoc): Promise<void> {
        await this.userService.active(user);

        return;
    }

    @UserAdminBlockedDoc()
    @Response('user.blocked')
    @UserAdminUpdateBlockedGuard()
    @PolicyAbilityProtected({
        subject: ENUM_POLICY_SUBJECT.USER,
        action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.UPDATE],
    })
    @AuthJwtAdminAccessProtected()
    @ApiKeyPublicProtected()
    @RequestParamGuard(UserRequestDto)
    @Patch('/update/:user/blocked')
    async blocked(@GetUser() user: UserDoc): Promise<void> {
        await this.userService.blocked(user);

        return;
    }

    @UserAdminDeleteDoc()
    @Response('user.delete')
    @UserAdminDeleteGuard()
    @PolicyAbilityProtected({
        subject: ENUM_POLICY_SUBJECT.USER,
        action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.DELETE],
    })
    @AuthJwtAdminAccessProtected()
    @ApiKeyPublicProtected()
    @RequestParamGuard(UserRequestDto)
    @Delete('/delete/:user')
    async delete(@GetUser() user: UserDoc): Promise<void> {
        await this.userService.delete(user);

        return;
    }
}
