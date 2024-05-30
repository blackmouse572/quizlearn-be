import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { IRequestApp } from 'src/common/pagination/interfaces/request.interface';
import { UserEntity } from 'src/modules/accounts/repository/entities/user.entity';
import { ClassroomDoc } from 'src/modules/classroom/repository/entity/classroom.entity';
import { ClassroomService } from 'src/modules/classroom/services/classroom.service';

@Injectable()
export class ClassroomPutToRequestGuard implements CanActivate {
    constructor(private readonly classroomService: ClassroomService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context
            .switchToHttp()
            .getRequest<IRequestApp & { __classroom: ClassroomDoc }>();
        const { classroom } = request.params;

        const check = await this.classroomService.findOneById(classroom, {
            join: {
                path: 'author',
                localField: 'author',
                foreignField: '_id',
                model: UserEntity.name,
                // remove password, role, tokens
                select: '-password -role -verificationToken -useAICount -resetToken -resetTokenExpires',
            },
        });
        request.__classroom = check;

        return true;
    }
}
