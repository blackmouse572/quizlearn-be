import { UseGuards, applyDecorators } from '@nestjs/common';

export function AuthGoogleOAuth2Protected(): MethodDecorator {
    return applyDecorators(UseGuards(AuthGoogleOauth2Guard));
}

import {
    ExecutionContext,
    SetMetadata,
    createParamDecorator,
} from '@nestjs/common';
import { ROLE_TYPE_META_KEY } from 'src/common/auth/constants/auth.constants';
import { RolePayloadTypeGuard } from 'src/common/auth/decorators/role.payload.decorator';
import { AuthJwtAccessGuard } from 'src/common/auth/guards/jwt-access/jwt-access-token.guard';
import { AuthGoogleOauth2Guard } from 'src/common/auth/guards/jwt-google/jwt-googlee.guard';
import { AuthJwtRefreshGuard } from 'src/common/auth/guards/jwt-refresh/jwt-refresh-token.guard';
import { IRequestApp } from 'src/common/pagination/interfaces/request.interface';

export const AuthJwtPayload = createParamDecorator(
    <T>(data: string, ctx: ExecutionContext): T => {
        const { user } = ctx
            .switchToHttp()
            .getRequest<IRequestApp & { user: T }>();
        return data ? user[data] : user;
    }
);

export const AuthJwtToken = createParamDecorator(
    (data: string, ctx: ExecutionContext): string => {
        const { headers } = ctx.switchToHttp().getRequest<IRequestApp>();
        const { authorization } = headers;
        const authorizations: string[] = authorization.split(' ');

        return authorizations.length >= 2 ? authorizations[1] : undefined;
    }
);

export function AuthJwtAccessProtected(): MethodDecorator {
    return applyDecorators(UseGuards(AuthJwtAccessGuard));
}

export function AuthJwtUserAccessProtected(): MethodDecorator {
    return applyDecorators(
        UseGuards(AuthJwtAccessGuard, RolePayloadTypeGuard),
        SetMetadata(ROLE_TYPE_META_KEY, ['user'])
    );
}

export function AuthJwtAdminAccessProtected(): MethodDecorator {
    return applyDecorators(
        UseGuards(AuthJwtAccessGuard, RolePayloadTypeGuard),
        SetMetadata(ROLE_TYPE_META_KEY, ['admin'])
    );
}

export function AuthJwtRefreshProtected(): MethodDecorator {
    return applyDecorators(UseGuards(AuthJwtRefreshGuard));
}
