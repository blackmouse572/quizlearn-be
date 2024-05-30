import {
    CanActivate,
    ExecutionContext,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { IRequestApp } from 'src/common/pagination/interfaces/request.interface';
import { UserDoc } from 'src/modules/accounts/repository/entities/user.entity';
import { IClassroomDoc } from 'src/modules/classroom/interfaces/classroom.interface';

@Injectable()
export class ClassroomTeacherGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const { __classroom, __user } = context
            .switchToHttp()
            .getRequest<
                IRequestApp & { __classroom: IClassroomDoc; __user: UserDoc }
            >();

        const isAuthor = __classroom.author.id === __user._id.toString();

        // If user is not author or member of the classroom, throw an error
        if (isAuthor) {
            return true;
        }
        throw new NotFoundException({
            statusCode: '401',
            message: 'classroom.not-authorized',
        });
    }
}
