import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { DatabaseMongoObjectIdEntityAbstract } from 'src/common/database/abstracts/mongo/entities/database.mongo.object-id.entity.abstract';
import { DatabaseEntity } from 'src/common/database/decorators/database.decorator';
import { UserDatabaseName } from 'src/modules/accounts/repository/entities/user.entity';

export const QuizBankDatabaseName = 'quizbanks';

export enum ENUM_QUIZBANK_VISIBILITY {
    PUBLIC = 'public',
    PRIVATE = 'private',
    INVITE_ONLY = 'invite_only',
}

export interface Rating {
    star: number;
    accountId: string;
}

@DatabaseEntity({ collection: QuizBankDatabaseName })
export class QuizbankEntity extends DatabaseMongoObjectIdEntityAbstract {
    @Prop({
        required: true,
        index: true,
        trim: true,
        minlength: 1,
        maxlength: 1000,
        type: String,
    })
    bankName: string;

    @Prop({
        index: true,
        default: '',
        maxlength: 1000,
        trim: true,
        type: String,
    })
    desciption: string;

    @Prop({
        required: true,
        ref: UserDatabaseName,
        type: Types.ObjectId,
    })
    author: string;

    @Prop({
        required: true,
        type: String,
        enum: ENUM_QUIZBANK_VISIBILITY,
        default: ENUM_QUIZBANK_VISIBILITY.PUBLIC,
    })
    visibility: ENUM_QUIZBANK_VISIBILITY;

    @Prop({
        type: [{ star: Number, accountId: String }],
        default: [],
    })
    rating: Rating[];

    @Prop({
        type: [String],
        default: [],
    })
    tags: string[];
}

export const QuizbankSchema = SchemaFactory.createForClass(QuizbankEntity);
export type QuizbankDoc = QuizbankEntity & Document;

// compound index
QuizbankSchema.index({ bankName: 1, desciption: 1 });
