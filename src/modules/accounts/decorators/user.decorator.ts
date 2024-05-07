import {
    applyDecorators,
    createParamDecorator,
    ExecutionContext,
    SetMetadata,
    UseGuards,
} from '@nestjs/common';
import { IRequestApp } from 'src/common/pagination/interfaces/request.interface';
import {
    USER_ACTIVE_META_KEY,
    USER_BLOCKED_META_KEY,
    USER_INACTIVE_PERMANENT_META_KEY,
} from 'src/modules/accounts/constants/user.constant';
import { UserPayloadPutToRequestGuard } from 'src/modules/accounts/guards/payload/user.payload.put-to-request.guard';
import { UserBanedGuard } from 'src/modules/accounts/guards/user.baned.guard';
import { UserNotFoundGuard } from 'src/modules/accounts/guards/user.not-found.guard';
import { UserVerifiedGuard } from 'src/modules/accounts/guards/user.verify.guard';
import { UserDoc } from 'src/modules/accounts/repository/entities/user.entity';

export const GetUser = createParamDecorator(
    <T>(returnPlain: boolean, ctx: ExecutionContext): T => {
        const { __user } = ctx
            .switchToHttp()
            .getRequest<IRequestApp & { __user: UserDoc }>();
        return (returnPlain ? __user.toObject() : __user) as T;
    }
);

export function UserProtected(): MethodDecorator {
    return applyDecorators(
        UseGuards(UserPayloadPutToRequestGuard, UserNotFoundGuard)
    );
}

export function UserAuthProtected(): MethodDecorator {
    return applyDecorators(
        UseGuards(UserBanedGuard, UserVerifiedGuard),
        SetMetadata(USER_INACTIVE_PERMANENT_META_KEY, [false]),
        SetMetadata(USER_BLOCKED_META_KEY, [false]),
        SetMetadata(USER_ACTIVE_META_KEY, [true])
    );
}
