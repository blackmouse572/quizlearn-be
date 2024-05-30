import { Module } from '@nestjs/common';
import { HelpersModule } from 'src/common/helpers/helpers.module';
import { PaginationModule } from 'src/common/pagination/pagination.module';
import { AccountModule } from 'src/modules/accounts/account.module';
import { ClassroomMemberController } from 'src/modules/classroom/controllers/classroom-member.controller';
import { ClassroomController } from 'src/modules/classroom/controllers/classroom.controller';
import { ClassroomRepositoryModule } from 'src/modules/classroom/repository/classroom.repository.module';
import { ClassroomCodeService } from 'src/modules/classroom/services/classroom-code.service';
import { ClassroomService } from 'src/modules/classroom/services/classroom.service';
import { QuizbankModule } from 'src/modules/quizbank/quizbank.module';

@Module({
    providers: [ClassroomService, ClassroomCodeService],
    exports: [ClassroomService],
    imports: [
        ClassroomRepositoryModule,
        AccountModule,
        HelpersModule,
        PaginationModule,
        QuizbankModule,
    ],
    controllers: [ClassroomMemberController, ClassroomController],
})
export class ClassroomModule {}
