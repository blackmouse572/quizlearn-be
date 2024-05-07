import {
    CanActivate,
    ExecutionContext,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { IRequestApp } from 'src/common/pagination/interfaces/request.interface';
import { UserDoc } from 'src/modules/accounts/repository/entities/user.entity';

@Injectable()
export class UserNotFoundGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const { __user } = context
            .switchToHttp()
            .getRequest<IRequestApp & { __user: UserDoc }>();

        if (!__user) {
            throw new NotFoundException({
                statusCode: '404',
                message: 'user.error.notFound',
            });
        }

        return true;
    }
}
