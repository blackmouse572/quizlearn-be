import {
    applyDecorators,
    createParamDecorator,
    ExecutionContext,
    UseGuards,
} from '@nestjs/common';
import { IRequestApp } from 'src/common/pagination/interfaces/request.interface';
import { ClassroombannedGuard } from 'src/modules/classroom/decorators/guards/classroom-banned.guard';
import { ClassroomMemberGuard } from 'src/modules/classroom/decorators/guards/classroom-member.guard';
import { ClassroomNotFoundGuard } from 'src/modules/classroom/decorators/guards/classroom-notfound.guard';
import { ClassroomPutToRequestGuard } from 'src/modules/classroom/decorators/guards/classroom.payload.guard';
import { ClassroomDoc } from 'src/modules/classroom/repository/entity/classroom.entity';

export const GetClassroom = createParamDecorator(
    <T>(returnPlain: boolean, ctx: ExecutionContext): T => {
        const { __classroom } = ctx
            .switchToHttp()
            .getRequest<IRequestApp & { __classroom: ClassroomDoc }>();
        return (returnPlain ? __classroom.toObject() : __classroom) as T;
    }
);

export function ClassroomProtected(): MethodDecorator {
    return applyDecorators(
        UseGuards(
            ClassroomPutToRequestGuard,
            ClassroomNotFoundGuard,
            ClassroomMemberGuard
        )
    );
}

export function ClassroomBannedProtected(): MethodDecorator {
    return applyDecorators(
        UseGuards(
            ClassroomPutToRequestGuard,
            ClassroomNotFoundGuard,
            ClassroomMemberGuard,
            ClassroombannedGuard
        )
    );
}
