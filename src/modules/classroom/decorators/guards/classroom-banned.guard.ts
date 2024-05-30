import {
    CanActivate,
    ExecutionContext,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { IRequestApp } from 'src/common/pagination/interfaces/request.interface';
import { UserDoc } from 'src/modules/accounts/repository/entities/user.entity';
import { ClassroomDoc } from 'src/modules/classroom/repository/entity/classroom.entity';

@Injectable()
export class ClassroombannedGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const { __classroom, __user } = context
            .switchToHttp()
            .getRequest<
                IRequestApp & { __classroom: ClassroomDoc; __user: UserDoc }
            >();

        const isBanned = __classroom.bannedAccountIds.some(
            (user) => user === __user._id.toString()
        );

        if (isBanned) {
            throw new NotFoundException({
                statusCode: '401',
                message: 'classroom.error.banned',
            });
        }

        return true;
    }
}
