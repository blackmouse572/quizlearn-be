import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from 'src/common/database/constants/database.constraint';
import {
    ClassroomCodeEntity,
    ClassroomCodeSchema,
} from 'src/modules/classroom/repository/entity/classroom-code.entity';
import {
    ClassroomEntity,
    ClassroomSchema,
} from 'src/modules/classroom/repository/entity/classroom.entity';
import { ClassroomCodeRepository } from 'src/modules/classroom/repository/repositories/classroom-code.repository';
import { ClassroomRepository } from 'src/modules/classroom/repository/repositories/classroom.repository';

@Module({
    providers: [ClassroomRepository, ClassroomCodeRepository],
    exports: [ClassroomRepository, ClassroomCodeRepository],
    imports: [
        MongooseModule.forFeature(
            [
                {
                    name: ClassroomEntity.name,
                    schema: ClassroomSchema,
                },
                {
                    name: ClassroomCodeEntity.name,
                    schema: ClassroomCodeSchema,
                },
            ],
            DATABASE_CONNECTION_NAME
        ),
    ],
})
export class ClassroomRepositoryModule {}
