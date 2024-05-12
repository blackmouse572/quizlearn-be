import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from 'src/common/database/constants/database.constraint';
import {
    QuizEntity,
    QuizSchema,
} from 'src/modules/quizbank/repository/entities/quiz.entity';
import {
    QuizbankEntity,
    QuizbankSchema,
} from 'src/modules/quizbank/repository/entities/quizbank.entity';
import { QuizRepository } from 'src/modules/quizbank/repository/repositories/quiz.repository';
import { QuizbankRepository } from 'src/modules/quizbank/repository/repositories/quizbank.repository';

@Module({
    providers: [QuizRepository, QuizbankRepository],
    exports: [QuizRepository, QuizbankRepository],
    imports: [
        MongooseModule.forFeature(
            [
                {
                    name: QuizEntity.name,
                    schema: QuizSchema,
                },
                {
                    name: QuizbankEntity.name,
                    schema: QuizbankSchema,
                },
            ],
            DATABASE_CONNECTION_NAME
        ),
    ],
})
export class QuizbankRepositoryModule {}
