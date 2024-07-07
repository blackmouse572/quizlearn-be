import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import {
    IDatabaseCreateOptions,
    IDatabaseFindAllOptions,
    IDatabaseFindOneOptions,
    IDatabaseSaveOptions,
} from 'src/common/database/interfaces/database.interface';
import { UserDoc } from 'src/modules/accounts/repository/entities/user.entity';
import { CreatePostDto } from 'src/modules/post/dtos/create-post.dto';
import { IPostService } from 'src/modules/post/interfaces/post-service.interface';
import {
    IBasePostDoc,
    IQuizbankPostDoc,
} from 'src/modules/post/interfaces/post.interface';
import { PostDoc, PostEntity } from 'src/modules/post/repository/post.entity';
import { PostRepository } from 'src/modules/post/repository/repositories/post.repository';

@Injectable()
export class PostService implements IPostService {
    constructor(private readonly postRepository: PostRepository) {}
    updatePost(
        repostory: PostDoc,
        data: Record<string, any>,
        option?: IDatabaseCreateOptions<any>
    ): Promise<PostDoc> {
        return this.postRepository.updateOne(repostory.id, data, option);
    }
    deletePost(
        repostory: PostDoc,
        options?: IDatabaseSaveOptions
    ): Promise<PostDoc> {
        return this.postRepository.delete(repostory, options);
    }
    updatePostViews(
        repostory: PostDoc,
        userId: string,
        option?: IDatabaseCreateOptions<any>
    ): Promise<PostDoc> {
        const views = repostory.views;
        if (!views.includes(userId)) {
            views.push(userId);
        }
        return this.postRepository.updateOne(repostory.id, { views }, option);
    }
    getPostById(
        id: string,
        options?: IDatabaseFindOneOptions<any>
    ): Promise<PostDoc> {
        return this.postRepository.findOneById(id, options);
    }
    getPosts(
        find: Record<string, any>,
        options?: IDatabaseFindAllOptions<any>
    ): Promise<PostDoc[]> {
        return this.postRepository.findAll(find, {
            ...options,
            join: true,
        });
    }
    populateQuizbank<T extends PostDoc>(
        repostory: T
    ): Promise<IQuizbankPostDoc> {
        return repostory.populate('bankLink');
    }
    populateBasePost<T extends PostDoc>(repostory: T): Promise<IBasePostDoc> {
        return repostory.populate([
            {
                path: 'author',
                select: '-password -salt -verificationToken -resetToken',
            },
            { path: 'classroom' },
        ]) as any;
    }
    createPost(
        data: CreatePostDto,
        user: UserDoc,
        options?: IDatabaseCreateOptions
    ): Promise<PostDoc> {
        const post = new PostEntity();
        post.author = user._id;
        post.title = data.title;
        post.content = data.content;
        post.classroom = new Types.ObjectId(data.classroomId) as any;
        post.bankLink = new Types.ObjectId(data.bankLink) as any;

        return this.postRepository.create<PostEntity>(post, options);
    }

    total(
        find: Record<string, any>,
        options?: IDatabaseFindAllOptions<any>
    ): Promise<number> {
        return this.postRepository.getTotal(find, options);
    }
}
