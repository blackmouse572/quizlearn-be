import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ApiAccessToken } from 'src/common/auth/decorators/api.access-token.decorator';
import { AuthJwtAccessProtected } from 'src/common/auth/decorators/auth.decorator';
import { IResponsePaging } from 'src/common/helpers/interfaces/response.interface';
import { PaginationQuery } from 'src/common/pagination/decorators/pagination.decorator';
import { PaginationListDto } from 'src/common/pagination/dto/pagination.list.dto';
import {
    GetUser,
    UserAuthProtected,
} from 'src/modules/accounts/decorators/user.decorator';
import { UserDoc } from 'src/modules/accounts/repository/entities/user.entity';
import {
    ClassroomProtected,
    GetClassroom,
} from 'src/modules/classroom/decorators/classroom-protected.decorator';
import { ClassroomDoc } from 'src/modules/classroom/repository/entity/classroom.entity';
import {
    POST_DEFAULT_AVAILABLE_ORDER_BY,
    POST_DEFAULT_AVAILABLE_SEARCH,
    POST_DEFAULT_ORDER_BY,
    POST_DEFAULT_ORDER_DIRECTION,
    POST_DEFAULT_PER_PAGE,
} from 'src/modules/post/constants/post.constants';
import { CreatePostDto } from 'src/modules/post/dtos/create-post.dto';
import { EditPostDto } from 'src/modules/post/dtos/edit-post.dto';
import { PostService } from 'src/modules/post/services/post.service';

@Controller('/post')
@ApiAccessToken()
export class PostController {
    constructor(private readonly postService: PostService) {}

    @ApiOperation({
        summary: 'Get all posts',
        description: "Get all posts that belong to the user's classroom",
    })
    @Get('/classroom/:classroom')
    @ClassroomProtected()
    @UserAuthProtected()
    @AuthJwtAccessProtected()
    async getAllPosts(
        @PaginationQuery(
            POST_DEFAULT_PER_PAGE,
            POST_DEFAULT_ORDER_BY,
            POST_DEFAULT_ORDER_DIRECTION,
            POST_DEFAULT_AVAILABLE_SEARCH,
            POST_DEFAULT_AVAILABLE_ORDER_BY
        )
        { _search, _limit, _offset, _order }: PaginationListDto,
        @GetClassroom() classroom: ClassroomDoc
    ) {
        const find: Record<string, any> = {
            ..._search,
            classroom: classroom._id,
        };
        const posts = await this.postService.getPosts(find, {
            paging: {
                limit: _limit,
                offset: _offset,
            },
            order: _order,
        });

        const total = await this.postService.total(find);
        console.log(posts);

        const res: IResponsePaging = {
            metadata: {
                total,
                limit: _limit,
                offset: _offset,
                hasMore: total > _offset + _limit,
            },
            _pagination: {
                total,
                totalPage: Math.ceil(total / _limit),
            },
            data: posts,
        };
        return res;
    }

    @ApiOperation({
        summary: 'Create new post',
        description: "Create new post that belong to the user's classroom",
    })
    @Post('/')
    @UserAuthProtected()
    @AuthJwtAccessProtected()
    async createPost(@Body() data: CreatePostDto, @GetUser() user: UserDoc) {
        const post = await this.postService.createPost(data, user);
        return post;
    }

    @ApiOperation({
        summary: 'Get post by id',
        description: 'Get post by id',
    })
    @Get('/:id')
    @UserAuthProtected()
    @AuthJwtAccessProtected()
    async getPostById(@GetUser() user: UserDoc, @Param('id') id: string) {
        const post = await this.postService.getPostById(id);
        return post;
    }

    @ApiOperation({
        summary: 'Edit post by id',
        description: 'Edit post by id',
    })
    @Put('/:id')
    @UserAuthProtected()
    @AuthJwtAccessProtected()
    async editPost(
        @GetUser() user: UserDoc,
        @Param('id') id: string,
        @Body() data: EditPostDto
    ) {
        const post = await this.postService.getPostById(id);
        if (!post) {
            throw new Error('Post not found');
        }

        if (post.author.toString() !== user._id.toString()) {
            throw new Error('Unauthorized');
        }

        post.title = data.title;
        post.content = data.content;
        post.bankLink = data.bankLink;
        await post.save();

        return post;
    }
}
