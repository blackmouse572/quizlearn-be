import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { DatabaseMongoObjectIdRepositoryAbstract } from 'src/common/database/abstracts/mongo/repositories/database.mongo.object-id.repository.abstract';
import { DatabaseModel } from 'src/common/database/decorators/database.decorator';
import {
    QuizDoc,
    QuizEntity,
} from 'src/modules/quizbank/repository/entities/quiz.entity';
import { QuizbankEntity } from 'src/modules/quizbank/repository/entities/quizbank.entity';

@Injectable()
export class QuizRepository extends DatabaseMongoObjectIdRepositoryAbstract<
    QuizEntity,
    QuizDoc
> {
    constructor(
        @DatabaseModel(QuizEntity.name)
        private readonly quizEntity: Model<QuizEntity>
    ) {
        super(quizEntity, {
            path: 'quizBank',
            localField: 'quizBank',
            foreignField: '_id',
            model: QuizbankEntity.name,
        });
    }
}
