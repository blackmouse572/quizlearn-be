import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { DatabaseMongoObjectIdRepositoryAbstract } from 'src/common/database/abstracts/mongo/repositories/database.mongo.object-id.repository.abstract';
import { DatabaseModel } from 'src/common/database/decorators/database.decorator';
import { UserEntity } from 'src/modules/accounts/repository/entities/user.entity';
import {
    QuizbankDoc,
    QuizbankEntity,
} from 'src/modules/quizbank/repository/entities/quizbank.entity';

@Injectable()
export class QuizbankRepository extends DatabaseMongoObjectIdRepositoryAbstract<
    QuizbankEntity,
    QuizbankDoc
> {
    constructor(
        @DatabaseModel(QuizbankEntity.name)
        private readonly QuizbankEntity: Model<QuizbankEntity>
    ) {
        super(QuizbankEntity, {
            path: 'author',
            localField: 'author',
            foreignField: '_id',
            model: UserEntity.name,
        });
    }
}
