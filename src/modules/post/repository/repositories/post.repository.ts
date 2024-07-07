import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { DatabaseMongoObjectIdRepositoryAbstract } from 'src/common/database/abstracts/mongo/repositories/database.mongo.object-id.repository.abstract';
import { DatabaseModel } from 'src/common/database/decorators/database.decorator';
import { UserEntity } from 'src/modules/accounts/repository/entities/user.entity';
import { ClassroomEntity } from 'src/modules/classroom/repository/entity/classroom.entity';
import { PostDoc, PostEntity } from 'src/modules/post/repository/post.entity';
import { QuizbankEntity } from 'src/modules/quizbank/repository/entities/quizbank.entity';

@Injectable()
export class PostRepository extends DatabaseMongoObjectIdRepositoryAbstract<
    PostEntity,
    PostDoc
> {
    constructor(
        @DatabaseModel(PostEntity.name)
        private readonly postEnity: Model<PostEntity>
    ) {
        super(postEnity, [
            {
                path: 'author',
                localField: 'author',
                foreignField: '_id',
                model: UserEntity.name,
            },
            {
                path: 'classroom',
                localField: 'classroom',
                foreignField: '_id',
                model: ClassroomEntity.name,
            },
            {
                path: 'bankLink',
                localField: 'bankLink',
                foreignField: '_id',
                model: QuizbankEntity.name,
            },
            {
                path: 'views',
                localField: 'views',
                foreignField: '_id',
                model: UserEntity.name,
            },
        ]);
    }
}
