import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { DatabaseMongoObjectIdEntityAbstract } from 'src/common/database/abstracts/mongo/entities/database.mongo.object-id.entity.abstract';
import { DatabaseEntity } from 'src/common/database/decorators/database.decorator';
import { QuizBankDatabaseName } from 'src/modules/quizbank/repository/entities/quizbank.entity';

export const QuizDatabaseName = 'quizzes';

@DatabaseEntity({ collection: QuizDatabaseName })
export class QuizEntity extends DatabaseMongoObjectIdEntityAbstract {
    @Prop({
        required: true,
        index: true,
        minlength: 1,
        maxlength: 1000,
    })
    question: string;

    @Prop({
        required: true,
        index: true,
        minlength: 1,
        maxlength: 1000,
    })
    answer: string;

    @Prop({
        required: false,
        minlength: 1,
        maxlength: 1000,
    })
    explanation?: string;

    @Prop({
        required: true,
        type: Types.ObjectId,
        ref: QuizBankDatabaseName,
    })
    quizBank: string;
}

export const QuizSchema = SchemaFactory.createForClass(QuizEntity);

export type QuizDoc = QuizEntity & Document;

// compound index
QuizSchema.index({ question: 1, answer: 1 });
