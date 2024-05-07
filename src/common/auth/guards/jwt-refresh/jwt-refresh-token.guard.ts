import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AuthJwtRefreshGuard extends AuthGuard('jwtRefresh') {
    handleRequest<TUser = any>(err: Error, user: TUser, info: Error): TUser {
        if (err || !user) {
            throw new UnauthorizedException({
                statusCode: err && err.message === 'jwt expired' ? 401 : 403,
                message: 'auth.error.refreshTokenUnauthorized',
                _error: err ? err.message : info.message,
            });
        }

        return user;
    }
}
