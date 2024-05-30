import {
    CanActivate,
    ExecutionContext,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { IRequestApp } from 'src/common/pagination/interfaces/request.interface';
import { ClassroomDoc } from 'src/modules/classroom/repository/entity/classroom.entity';

@Injectable()
export class ClassroomNotFoundGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const { __classroom } = context
            .switchToHttp()
            .getRequest<IRequestApp & { __classroom: ClassroomDoc }>();

        if (!__classroom) {
            throw new NotFoundException({
                statusCode: '404',
                message: 'classroom.error.notFound',
            });
        }

        return true;
    }
}
