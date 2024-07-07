import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { DatabaseMongoObjectIdRepositoryAbstract } from 'src/common/database/abstracts/mongo/repositories/database.mongo.object-id.repository.abstract';
import { DatabaseModel } from 'src/common/database/decorators/database.decorator';
import { UserEntity } from 'src/modules/accounts/repository/entities/user.entity';
import {
    CommentDoc,
    CommentEnity,
} from 'src/modules/post/repository/comment.enity';
import { PostEntity } from 'src/modules/post/repository/post.entity';

@Injectable()
export class CommentRepository extends DatabaseMongoObjectIdRepositoryAbstract<
    CommentEnity,
    CommentDoc
> {
    constructor(
        @DatabaseModel(CommentEnity.name)
        private readonly commentEntity: Model<CommentEnity>
    ) {
        super(commentEntity, [
            {
                path: 'author',
                localField: 'author',
                foreignField: '_id',
                model: UserEntity.name,
            },
            {
                path: 'post',
                localField: 'post',
                foreignField: '_id',
                model: PostEntity.name,
            },
        ]);
    }
}
