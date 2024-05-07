import {
    BadRequestException,
    CanActivate,
    ExecutionContext,
    Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IRequestApp } from 'src/common/pagination/interfaces/request.interface';
import { USER_BLOCKED_META_KEY } from 'src/modules/accounts/constants/user.constant';
import { UserDoc } from 'src/modules/accounts/repository/entities/user.entity';

@Injectable()
export class UserBanedGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const required: boolean[] = this.reflector.getAllAndOverride<boolean[]>(
            USER_BLOCKED_META_KEY,
            [context.getHandler(), context.getClass()]
        );

        if (!required) {
            return true;
        }

        const { __user } = context
            .switchToHttp()
            .getRequest<IRequestApp & { __user: UserDoc }>();

        if (!required.includes(__user.isBan)) {
            throw new BadRequestException({
                statusCode: '400',
                message: 'user.error.blocked',
            });
        }
        return true;
    }
}
