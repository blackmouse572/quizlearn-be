import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from 'src/common/database/constants/database.constraint';
import {
    CommentEnity,
    CommentSchema,
} from 'src/modules/post/repository/comment.enity';
import {
    PostEntity,
    PostSchema,
} from 'src/modules/post/repository/post.entity';
import { CommentRepository } from 'src/modules/post/repository/repositories/comment.repostory';
import { PostRepository } from 'src/modules/post/repository/repositories/post.repository';

@Module({
    providers: [CommentRepository, PostRepository],
    exports: [CommentRepository, PostRepository],
    imports: [
        MongooseModule.forFeature(
            [
                {
                    name: PostEntity.name,
                    schema: PostSchema,
                },
                {
                    name: CommentEnity.name,
                    schema: CommentSchema,
                },
            ],
            DATABASE_CONNECTION_NAME
        ),
    ],
})
export class PostRepositoryModule {}
