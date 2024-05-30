import {
    Body,
    Controller,
    Delete,
    ForbiddenException,
    Get,
    Param,
    Post,
    Put,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiAccessToken } from 'src/common/auth/decorators/api.access-token.decorator';
import {
    AuthJwtAccessProtected,
    AuthJwtAdminAccessProtected,
} from 'src/common/auth/decorators/auth.decorator';
import { HelperHashService } from 'src/common/helpers/services/helper.hash.service';
import { PaginationQuery } from 'src/common/pagination/decorators/pagination.decorator';
import { PaginationListDto } from 'src/common/pagination/dto/pagination.list.dto';
import { PaginationService } from 'src/common/pagination/services/pagination.service';
import {
    GetUser,
    UserAuthProtected,
} from 'src/modules/accounts/decorators/user.decorator';
import {
    UserDoc,
    UserEntity,
} from 'src/modules/accounts/repository/entities/user.entity';
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
import { CreateClassroomDto } from 'src/modules/classroom/dtos/classroom-create.dto';
import { UpdateClassroomDto } from 'src/modules/classroom/dtos/classroom-update.dto';
import { IClassroomDoc } from 'src/modules/classroom/interfaces/classroom.interface';
import { ClassroomCodeDoc } from 'src/modules/classroom/repository/entity/classroom-code.entity';
import {
    ClassroomDoc,
    ClassroomEntity,
} from 'src/modules/classroom/repository/entity/classroom.entity';
import { ClassroomCodeService } from 'src/modules/classroom/services/classroom-code.service';
import { ClassroomService } from 'src/modules/classroom/services/classroom.service';
import { QuizbankCreateDto } from 'src/modules/quizbank/dtos/quizbank-create.dto';
import { QuizbankService } from 'src/modules/quizbank/services/quizbank.service';

@ApiTags('modules.classroom.classroom')
@ApiAccessToken()
@Controller({
    version: '1',
    path: '/classrooms',
})
export class ClassroomController {
    constructor(
        private readonly classroomService: ClassroomService,
        private readonly paginationService: PaginationService,
        private readonly hashService: HelperHashService,
        private readonly quizbankService: QuizbankService,
        private readonly classroomCodeService: ClassroomCodeService
    ) {}

    @AuthJwtAdminAccessProtected()
    @Get('/')
    @ApiOperation({
        summary: 'Get all classrooms',
        description: 'Get all classrooms',
    })
    async getAll(
        @PaginationQuery(
            CLASSROOM_DEFAULT_PER_PAGE,
            CLASSROOM_DEFAULT_ORDER_BY,
            CLASSROOM_DEFAULT_ORDER_DIRECTION,
            CLASSROOM_DEFAULT_AVAILABLE_SEARCH,
            CLASSROOM_DEFAULT_AVAILABLE_ORDER_BY
        )
        { _search, _limit, _offset, _order }: PaginationListDto
    ) {
        const find: Record<string, any> = {
            ..._search,
        };
        const classrooms = await this.classroomService.findAll(find, {
            paging: {
                limit: _limit,
                offset: _offset,
            },
            order: _order,
        });

        const total = await this.classroomService.total(find);

        const totalPage = this.paginationService.totalPage(total, _limit);

        return {
            _pagination: { total, totalPage },
            metadata: {
                total,
                limit: _limit,
                offset: _offset,
                order: _order,
            },
            data: classrooms,
        };
    }

    @Post('/')
    @ApiOperation({
        summary: 'Create a new classroom',
        description:
            'Create a new classroom, with the current user as the author.',
    })
    @UserAuthProtected()
    @AuthJwtAccessProtected()
    async create(@GetUser() user: UserDoc, @Body() data: CreateClassroomDto) {
        const classroom = new ClassroomEntity();
        classroom.className = data.className;
        classroom.description = data.description;
        classroom.author = user._id;

        const newClassroom = await this.classroomService.create(classroom);

        return newClassroom;
    }

    @Put('/update')
    @ApiOperation({
        summary: 'Update a classroom',
        description: 'Update a classroom',
    })
    @UserAuthProtected()
    @AuthJwtAccessProtected()
    async update(@Body() data: UpdateClassroomDto, @GetUser() user: UserDoc) {
        const classroom = await this.classroomService.findOne<IClassroomDoc>(
            {
                _id: data.id,
            },
            {
                join: [
                    {
                        path: 'author',
                        foreignField: '_id',
                        localField: 'author',
                        model: UserEntity.name,
                    },
                ],
            }
        );

        if (!classroom) {
            throw new ForbiddenException({
                statusCode: '403',
                message: 'classroom.error.not-found',
            });
        }

        if (classroom.author.id !== user._id.toString()) {
            throw new ForbiddenException({
                statusCode: '403',
                message: 'classroom.error.forbidden',
            });
        }

        classroom.className = data.className;
        classroom.description = data.description;
        classroom.isStudentAllowInvite = data.isStudentAllowInvite;

        return classroom.save();
    }
    @Post('/addquizbank/:classroomId')
    @ApiOperation({
        summary: 'Add a member to a classroom',
        description: 'Add new member to a classroom, you must be the author',
    })
    @ApiOperation({
        summary: 'Create new quizbank',
        description: 'Create quizbank with quizzes',
    })
    @UserAuthProtected()
    @AuthJwtAccessProtected()
    async addQuizbankToClassroom(
        @GetClassroom() classroom: ClassroomDoc,
        @Body() _quizbank: QuizbankCreateDto,
        @GetUser() user: UserDoc
    ) {
        const quizbank = await this.quizbankService.createQuizbank(
            _quizbank,
            user
        );

        classroom.bankIds.push(quizbank._id);
        await this.classroomService.save(classroom);

        return classroom;
    }

    @Get('/classroom/:classroomId/quizbank')
    @UserAuthProtected()
    @AuthJwtAccessProtected()
    async getQuizbanksByClassroom(
        @GetClassroom() classroom: ClassroomDoc,
        @PaginationQuery(
            CLASSROOM_DEFAULT_PER_PAGE,
            CLASSROOM_DEFAULT_ORDER_BY,
            CLASSROOM_DEFAULT_ORDER_DIRECTION,
            CLASSROOM_DEFAULT_AVAILABLE_SEARCH,
            CLASSROOM_DEFAULT_AVAILABLE_ORDER_BY
        )
        { _search, _limit, _offset, _order }: PaginationListDto
    ) {
        const find: Record<string, any> = {
            ..._search,
            _id: { $in: classroom.bankIds },
        };

        const quizbanksPromise = this.quizbankService.findAll(find, {
            paging: { limit: _limit, offset: _offset },
            order: _order,
        });
        const totalPromise = this.quizbankService.getTotal(find, {
            paging: { limit: _limit, offset: _offset },
        });

        const [quizbanks, total] = await Promise.all([
            quizbanksPromise,
            totalPromise,
        ]);

        return {
            _pagination: {
                total,
                limit: _limit,
                offset: _offset,
            },
            data: quizbanks,
            metadata: {
                total,
                hasMore: total > _offset + 1,
                skip: _offset,
                take: _limit,
            },
        };
    }

    @Post('/generatecode/:classroom')
    @ApiOperation({
        summary: 'Generate a join code for a classroom',
        description:
            'Generate a one time join code for a classroom. This code can be used by students to join the classroom. The code will expire after 24 hours. If `isStudentAllowInvite` is set to `true`, students can invite other students to join the classroom using the code.',
    })
    @ClassroomProtected()
    @UserAuthProtected()
    @AuthJwtAccessProtected()
    async generateCode(
        @GetClassroom() classroom: IClassroomDoc,
        @GetUser() user: UserDoc,
        @Param('classroom') _: string
    ) {
        const isStudentAllowInvite = classroom.isStudentAllowInvite;
        if (
            !isStudentAllowInvite &&
            classroom.author.id !== user._id.toString()
        ) {
            throw new ForbiddenException({
                statusCode: '403',
                message: 'classroom.error.forbidden',
            });
        }

        const code = this.hashService.ramdomToken(6);
        const expireAt = new Date();
        expireAt.setHours(expireAt.getHours() + 24);

        const classroomCode = await this.classroomCodeService.create({
            code,
            expiredAt: expireAt,
            generateBy: user._id,
        });

        classroom.classroomCodes.push(classroomCode._id as any);
        classroom.save();

        return {
            code,
            expires: expireAt,
        };
    }

    @Post('/join/:code')
    @ApiOperation({
        summary: 'Join a classroom using a code',
        description:
            'Join a classroom using a code. The code must be generated by the classroom author or a student who has the permission to invite other students.',
    })
    @UserAuthProtected()
    @AuthJwtAccessProtected()
    async joinClassroom(@GetUser() user: UserDoc, @Param('code') code: string) {
        const classroomCode =
            await this.classroomCodeService.findOne<ClassroomCodeDoc>({
                code,
            });

        if (!classroomCode) {
            throw new ForbiddenException({
                statusCode: '404',
                message: 'classroom.error.code-not-found',
            });
        }

        const classroom = await this.classroomService.findOne<IClassroomDoc>(
            {
                classroomCodes: classroomCode._id,
                bannedAccountIds: { $nin: [user._id] },
            },
            {
                join: [
                    {
                        path: 'author',
                        foreignField: '_id',
                        localField: 'auhtor',
                        model: UserEntity.name,
                    },
                ],
            }
        );

        if (!classroom) {
            throw new ForbiddenException({
                statusCode: '403',
                message: 'classroom.error.classroom-not-found',
            });
        }

        if (classroom.author.id === user._id.toString()) {
            throw new ForbiddenException({
                statusCode: '403',
                message: 'classroom.error.author-cannot-join',
            });
        }

        classroom.accountIds.push(user._id);
        await classroom.save();

        return classroom;
    }

    @Delete('/:classroom')
    @ApiOperation({
        summary: 'Join a classroom using a code',
        description:
            'Join a classroom using a code. The code must be generated by the classroom author or a student who has the permission to invite other students.',
    })
    @ClassroomProtected()
    @UserAuthProtected()
    @AuthJwtAccessProtected()
    async deleteClassroom(@GetClassroom() classroom: ClassroomDoc) {
        await this.classroomService.delete(classroom);

        return {
            message: 'classroom.deleted',
        };
    }
}
