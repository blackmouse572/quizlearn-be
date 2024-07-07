import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { DatabaseMongoObjectIdEntityAbstract } from 'src/common/database/abstracts/mongo/entities/database.mongo.object-id.entity.abstract';
import { DatabaseEntity } from 'src/common/database/decorators/database.decorator';
import { UserDatabaseName } from 'src/modules/accounts/repository/entities/user.entity';
import { PostDatabaseName } from 'src/modules/post/repository/post.entity';

export const CommentDatabaseName = 'comments';

@DatabaseEntity({ collection: CommentDatabaseName })
export class CommentEnity extends DatabaseMongoObjectIdEntityAbstract {
    @Prop({
        required: true,
        trim: true,
        type: String,
    })
    content: string;

    @Prop({
        required: true,
        type: Types.ObjectId,
        ref: UserDatabaseName,
    })
    author: string;

    @Prop({
        required: true,
        default: [],
        type: [Types.ObjectId],
        ref: PostDatabaseName,
    })
    post: string;
}

export type CommentDoc = CommentEnity & Document;
export const CommentSchema = SchemaFactory.createForClass(CommentEnity);
