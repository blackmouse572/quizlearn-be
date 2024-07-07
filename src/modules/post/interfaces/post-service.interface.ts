import {
    IDatabaseCreateOptions,
    IDatabaseFindAllOptions,
    IDatabaseFindOneOptions,
    IDatabaseSaveOptions,
} from 'src/common/database/interfaces/database.interface';
import { UserDoc } from 'src/modules/accounts/repository/entities/user.entity';
import { CreatePostDto } from 'src/modules/post/dtos/create-post.dto';
import {
    IBasePostDoc,
    IQuizbankPostDoc,
} from 'src/modules/post/interfaces/post.interface';
import { PostDoc } from 'src/modules/post/repository/post.entity';

export interface IPostService {
    createPost(
        data: CreatePostDto,
        author: UserDoc,
        option?: IDatabaseCreateOptions
    ): Promise<PostDoc>;
    updatePost(
        repostory: PostDoc,
        data: Record<string, any>,
        option?: IDatabaseCreateOptions
    ): Promise<PostDoc>;
    deletePost(
        repostory: PostDoc,
        options?: IDatabaseSaveOptions
    ): Promise<PostDoc>;
    updatePostViews(
        repostory: PostDoc,
        userId: string,
        option?: IDatabaseCreateOptions
    ): Promise<PostDoc>;
    getPostById(
        id: string,
        options?: IDatabaseFindOneOptions
    ): Promise<PostDoc>;
    getPosts(
        find: Record<string, any>,
        options?: IDatabaseFindAllOptions
    ): Promise<PostDoc[]>;
    total(
        find: Record<string, any>,
        options?: IDatabaseFindAllOptions
    ): Promise<number>;
    populateQuizbank<T extends PostDoc>(
        repostory: T
    ): Promise<IQuizbankPostDoc>;
    populateBasePost<T extends PostDoc>(repostory: T): Promise<IBasePostDoc>;
}
