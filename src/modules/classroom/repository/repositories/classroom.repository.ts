import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { DatabaseMongoObjectIdRepositoryAbstract } from 'src/common/database/abstracts/mongo/repositories/database.mongo.object-id.repository.abstract';
import { DatabaseModel } from 'src/common/database/decorators/database.decorator';
import { UserEntity } from 'src/modules/accounts/repository/entities/user.entity';
import { ClassroomCodeEntity } from 'src/modules/classroom/repository/entity/classroom-code.entity';
import {
    ClassroomDoc,
    ClassroomEntity,
} from 'src/modules/classroom/repository/entity/classroom.entity';
import { QuizbankEntity } from 'src/modules/quizbank/repository/entities/quizbank.entity';

@Injectable()
export class ClassroomRepository extends DatabaseMongoObjectIdRepositoryAbstract<
    ClassroomEntity,
    ClassroomDoc
> {
    constructor(
        @DatabaseModel(ClassroomEntity.name)
        private readonly classroomEntity: Model<ClassroomEntity>
    ) {
        super(classroomEntity, [
            {
                path: 'author',
                localField: 'author',
                foreignField: '_id',
                model: UserEntity.name,
            },
            {
                path: 'bankIds',
                localField: 'bankIds',
                foreignField: '_id',
                model: QuizbankEntity.name,
            },
            {
                path: 'classroomCodes',
                localField: 'classroomCodes',
                foreignField: '_id',
                model: ClassroomCodeEntity.name,
            },
            {
                path: 'accountIds',
                localField: 'accountIds',
                foreignField: '_id',
                model: UserEntity.name,
            },
        ]);
    }
}
