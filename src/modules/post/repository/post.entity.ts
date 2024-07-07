import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { DatabaseMongoObjectIdEntityAbstract } from 'src/common/database/abstracts/mongo/entities/database.mongo.object-id.entity.abstract';
import { DatabaseEntity } from 'src/common/database/decorators/database.decorator';
import { UserDatabaseName } from 'src/modules/accounts/repository/entities/user.entity';
import { ClassroomDatabaseName } from 'src/modules/classroom/repository/entity/classroom.entity';
import { QuizBankDatabaseName } from 'src/modules/quizbank/repository/entities/quizbank.entity';

export const PostDatabaseName = 'posts';

@DatabaseEntity({ collection: PostDatabaseName })
export class PostEntity extends DatabaseMongoObjectIdEntityAbstract {
    @Prop({
        required: true,
        index: true,
        trim: true,
        type: String,
    })
    title: string;

    @Prop({
        required: true,
        trim: true,
        type: String,
    })
    content: string;

    @Prop({
        required: true,
        type: Types.ObjectId,
        ref: ClassroomDatabaseName,
    })
    classroom: string;

    @Prop({
        required: true,
        ref: UserDatabaseName,
        type: Types.ObjectId,
    })
    author: string;

    @Prop({
        required: false,
        type: Types.ObjectId,
        ref: QuizBankDatabaseName,
    })
    bankLink?: string;

    @Prop({
        required: false,
        type: [Types.ObjectId],
        ref: UserDatabaseName,
    })
    views?: string[];
}

export type PostDoc = PostEntity & Document;
export const PostSchema = SchemaFactory.createForClass(PostEntity);
