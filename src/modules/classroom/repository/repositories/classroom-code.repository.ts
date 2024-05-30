import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { DatabaseMongoObjectIdRepositoryAbstract } from 'src/common/database/abstracts/mongo/repositories/database.mongo.object-id.repository.abstract';
import { DatabaseModel } from 'src/common/database/decorators/database.decorator';
import { UserEntity } from 'src/modules/accounts/repository/entities/user.entity';
import {
    ClassroomCodeDoc,
    ClassroomCodeEntity,
} from 'src/modules/classroom/repository/entity/classroom-code.entity';

@Injectable()
export class ClassroomCodeRepository extends DatabaseMongoObjectIdRepositoryAbstract<
    ClassroomCodeEntity,
    ClassroomCodeDoc
> {
    constructor(
        @DatabaseModel(ClassroomCodeEntity.name)
        private readonly classroomEntity: Model<ClassroomCodeEntity>
    ) {
        super(classroomEntity, {
            path: 'generateBy',
            localField: 'generateBy',
            foreignField: '_id',
            model: UserEntity.name,
        });
    }
}
