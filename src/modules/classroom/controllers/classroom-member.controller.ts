import {
    Body,
    Controller,
    Delete,
    ForbiddenException,
    Get,
    NotFoundException,
    Param,
    Post,
    Put,
    Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiAccessToken } from 'src/common/auth/decorators/api.access-token.decorator';
import { AuthJwtAccessProtected } from 'src/common/auth/decorators/auth.decorator';
import { IResponsePaging } from 'src/common/helpers/interfaces/response.interface';
import { HelperHashService } from 'src/common/helpers/services/helper.hash.service';
import { PaginationQuery } from 'src/common/pagination/decorators/pagination.decorator';
import { PaginationListDto } from 'src/common/pagination/dto/pagination.list.dto';
import { PaginationService } from 'src/common/pagination/services/pagination.service';
import { RequestParamGuard } from 'src/lib/guards/request.decorator';
import { UserAdminUpdateUnBannedGuard } from 'src/modules/accounts/decorators/admin.decorator';
import {
    GetUser,
    UserAuthProtected,
} from 'src/modules/accounts/decorators/user.decorator';
import { UserRequestDto } from 'src/modules/accounts/dtos/user.req.dto';
import {
    UserDoc,
    UserEntity,
} from 'src/modules/accounts/repository/entities/user.entity';
import { UserService } from 'src/modules/accounts/services/account.service';
import {
    CLASSROOM_DEFAULT_AVAILABLE_ORDER_BY,
    CLASSROOM_DEFAULT_AVAILABLE_SEARCH,
    CLASSROOM_DEFAULT_ORDER_BY,
    CLASSROOM_DEFAULT_ORDER_DIRECTION,
    CLASSROOM_DEFAULT_PER_PAGE,
} from 'src/modules/classroom/constaints/classroom.constants';
import {
    ClassroomProtected,
    GetClassroom,
} from 'src/modules/classroom/decorators/classroom-protected.decorator';
import { ClassroomDeleteMembersDto } from 'src/modules/classroom/dtos/classroom-deletemembers.dto';
import { ClassroomDoc } from 'src/modules/classroom/repository/entity/classroom.entity';
import { ClassroomService } from 'src/modules/classroom/services/classroom.service';

@ApiTags('modules.classroom.member')
@ApiAccessToken()
@Controller({
    version: '1',
    path: '/classrooms',
})
export class ClassroomMemberController {
    constructor(
        private readonly classroomService: ClassroomService,
        private readonly paginationService: PaginationService,
        private readonly hashService: HelperHashService,
        private readonly userService: UserService
    ) {}

    @Get('/getCurrent')
    @UserAuthProtected()
    @AuthJwtAccessProtected()
    async getAllClassroomOfUser(
        @GetUser() user: UserDoc,
        @PaginationQuery(
            CLASSROOM_DEFAULT_PER_PAGE,
            CLASSROOM_DEFAULT_ORDER_BY,
            CLASSROOM_DEFAULT_ORDER_DIRECTION,
            CLASSROOM_DEFAULT_AVAILABLE_SEARCH,
            CLASSROOM_DEFAULT_AVAILABLE_ORDER_BY
        )
        { _search, _limit, _offset, _order }: PaginationListDto,
        @Query('isOwner') isOwner: boolean
    ) {
        let find: Record<string, any> = {};
        if (!isOwner) {
            find = {
                ..._search,
                $or: [{ accountIds: user._id }, { author: user._id }],
            };
        } else {
            find = {
                ..._search,
                author: user._id,
            };
        }
        const classrooms = await this.classroomService.findAll(find, {
            paging: {
                limit: _limit,
                offset: _offset,
            },
            order: _order,
            join: {
                path: 'author',
                localField: 'author',
                foreignField: '_id',
                model: UserEntity.name,
                // remove password, role, tokens
                select: '-password -role -verificationToken -useAICount -resetToken -resetTokenExpires',
            },
        });
        const total = await this.classroomService.total(find);

        const res: IResponsePaging = {
            metadata: {
                hasMore: _limit + _offset < total,
                totals: total,
            },
            _pagination: {
                total,
                totalPage: Math.ceil(total / _limit),
            },
            data: classrooms,
        };

        return res;
    }

    @Get('/get-all-member/:classroom')
    @ClassroomProtected()
    @UserAuthProtected()
    @AuthJwtAccessProtected()
    async getAllMember(
        @GetClassroom() classroom: ClassroomDoc,
        @Param('classroom') _: string,
        @PaginationQuery(
            CLASSROOM_DEFAULT_PER_PAGE,
            CLASSROOM_DEFAULT_ORDER_BY,
            CLASSROOM_DEFAULT_ORDER_DIRECTION,
            CLASSROOM_DEFAULT_AVAILABLE_SEARCH,
            CLASSROOM_DEFAULT_AVAILABLE_ORDER_BY
        )
        { _search, _limit, _offset, _order }: PaginationListDto
    ) {
        const { accountIds } =
            await this.classroomService.populateMembers(classroom);
        const total = accountIds.length;

        const students = accountIds.slice(_offset, _offset + _limit);

        const res: IResponsePaging = {
            metadata: {
                hasMore: false,
                totals: total,
                take: _limit,
                skip: _offset,
            },
            _pagination: {
                total,
                totalPage: 1,
            },
            data: students,
        };
        return res;
    }

    @RequestParamGuard(UserRequestDto)
    @UserAdminUpdateUnBannedGuard() // can use as author
    @ClassroomProtected()
    @UserAuthProtected()
    @AuthJwtAccessProtected()
    @Post('/removemember/:user/:classroom')
    async removeOneMember(
        @GetUser() user: UserDoc,
        @GetClassroom() classroom: ClassroomDoc,
        @Param('user') _: string,
        @Param('classroom') __: string
    ) {
        const isExist = classroom.accountIds.some(
            (member) => member.toString() === user._id.toString()
        );
        if (!isExist) {
            throw new NotFoundException({
                statusCode: 404,
                message: 'classroom.member.not-found',
            });
        }
        return this.classroomService.removeMember(classroom, user);
    }

    @ClassroomProtected()
    @UserAuthProtected()
    @AuthJwtAccessProtected()
    @Delete('/batchremovemember/:classroom')
    async removeManyMember(
        @GetClassroom() classroom: ClassroomDoc,
        @Body() body: ClassroomDeleteMembersDto,
        @Param('classroom') __: string
    ) {
        const isExist = classroom.accountIds.some((member) =>
            body.memberIds.includes(member.toString())
        );
        if (!isExist) {
            throw new NotFoundException({
                statusCode: 404,
                message: 'classroom.member.not-found',
            });
        }
        const users = await this.userService.findAll({
            find: {
                _id: { $in: body.memberIds },
            },
        });
        if (users.length !== body.memberIds.length) {
            throw new NotFoundException({
                statusCode: 404,
                message: 'classroom.member.not-found',
            });
        }
        return this.classroomService.removeManyMembers(classroom, users);
    }

    //ban user
    @Post('/:classroom/users')
    @ClassroomProtected()
    @UserAuthProtected()
    @AuthJwtAccessProtected()
    async banUser(
        @GetClassroom() classroom: ClassroomDoc,
        @Body() body: ClassroomDeleteMembersDto
    ) {
        const users = await this.userService.findAll({
            find: {
                _id: { $in: body.memberIds },
            },
        });
        return this.classroomService.banManyUser(classroom, users);
    }

    @Put('/:classroom/leave')
    @ApiOperation({
        summary: 'leave a classroom',
        description:
            'Leave a classroom, you can join again if you have the code',
    })
    @ClassroomProtected()
    @UserAuthProtected()
    @AuthJwtAccessProtected()
    async leave(
        @GetClassroom() classroom: ClassroomDoc,
        @GetUser() user: UserDoc
    ) {
        const isExist = classroom.accountIds.some(
            (member) => member.toString() === user._id.toString()
        );
        if (!isExist) {
            throw new ForbiddenException({
                statusCode: '403',
                message: 'classroom.error.notMember',
            });
        }

        classroom.accountIds = classroom.accountIds.filter(
            (member) => member.toString() !== user._id.toString()
        );
        await classroom.save();

        return {
            message: 'classroom.leave',
        };
    }

    //unban user
    @Put('/:classroom/users')
    @ClassroomProtected()
    @UserAuthProtected()
    @AuthJwtAccessProtected()
    async unbanUser(
        @GetClassroom() classroom: ClassroomDoc,
        @Body() body: ClassroomDeleteMembersDto
    ) {
        const users = await this.userService.findAll({
            find: {
                _id: { $in: body.memberIds },
            },
        });
        return this.classroomService.unbanManyUser(classroom, users);
    }
    @Get('/:classroom/users')
    @ClassroomProtected()
    @UserAuthProtected()
    @AuthJwtAccessProtected()
    async getBannedUser(
        @GetClassroom() classroom: ClassroomDoc,
        @Param('classroom') _: string,
        @PaginationQuery(
            CLASSROOM_DEFAULT_PER_PAGE,
            CLASSROOM_DEFAULT_ORDER_BY,
            CLASSROOM_DEFAULT_ORDER_DIRECTION,
            CLASSROOM_DEFAULT_AVAILABLE_SEARCH,
            CLASSROOM_DEFAULT_AVAILABLE_ORDER_BY
        )
        { _search, _limit, _offset, _order }: PaginationListDto
    ) {
        const { bannedAccountIds } =
            await this.classroomService.populateBankIds(classroom);
        const total = bannedAccountIds.length;
        const users = bannedAccountIds.slice(_offset, _offset + _limit);
        const res: IResponsePaging = {
            metadata: {
                hasMore: false,
                totals: total,
                take: _limit,
                skip: _offset,
            },
            _pagination: {
                total,
                totalPage: 1,
            },
            data: users as any,
        };
        return res;
    }

    @Get('/:classroom')
    @ClassroomProtected()
    @UserAuthProtected()
    @AuthJwtAccessProtected()
    async getClassroomDetails(@GetClassroom() classroom: ClassroomDoc) {
        return classroom;
    }
}
