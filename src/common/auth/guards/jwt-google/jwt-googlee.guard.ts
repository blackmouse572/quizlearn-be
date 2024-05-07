import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from 'src/common/auth/services/auth.service';
import { IHelperGooglePayload } from 'src/common/helpers/interfaces/helper.google.interface';

@Injectable()
export class AuthGoogleOauth2Guard implements CanActivate {
    constructor(private readonly authService: AuthService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const { authorization } = request.headers;
        const acArr = authorization.split('Bearer ');
        if (acArr.length !== 2) {
            throw new UnauthorizedException({
                statusCode: '401',
                message: 'auth.error.googleSSO',
            });
        }

        const accessToken: string = acArr[1];

        try {
            const payload: IHelperGooglePayload =
                await this.authService.googleGetTokenInfo(accessToken);

            request.user = {
                user: {
                    email: payload.email,
                },
            };

            return true;
        } catch (err: any) {
            throw new UnauthorizedException({
                statusCode: '401',
                message: 'auth.error.googleSSO',
            });
        }
    }
}
