import {
    BadRequestException,
    Body,
    Controller,
    Get,
    InternalServerErrorException,
    Param,
    Patch,
    Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ClientSession, Connection } from 'mongoose';
import { ApiAccessToken } from 'src/common/auth/decorators/api.access-token.decorator';
import { AuthJwtAccessProtected } from 'src/common/auth/decorators/auth.decorator';
import { IAuthPassword } from 'src/common/auth/interfaces/auth.interface';
import { AuthService } from 'src/common/auth/services/auth.service';
import { DatabaseConnection } from 'src/common/database/decorators/database.decorator';
import {
    GetUser,
    UserProtected,
} from 'src/modules/accounts/decorators/user.decorator';
import { UserChangePasswordDto } from 'src/modules/accounts/dtos/user-update-password.dto';
import { UserUpdateNameDto } from 'src/modules/accounts/dtos/user-update.dto';
import { UserDoc } from 'src/modules/accounts/repository/entities/user.entity';
import { UserService } from 'src/modules/accounts/services/account.service';
@Controller('/accounts')
@ApiTags('modules.personal.user')
@Controller({
    version: '1',
    path: '/accounts',
})
@ApiAccessToken()
export class UserPersonalController {
    constructor(
        @DatabaseConnection() private readonly databaseConnection: Connection,
        private readonly userService: UserService,
        private readonly authService: AuthService
    ) {}

    @UserProtected()
    @AuthJwtAccessProtected()
    @Get('/profile')
    async profile(@GetUser() user: UserDoc) {
        return user.toObject();
    }

    @UserProtected()
    @AuthJwtAccessProtected()
    @Patch('/change-password')
    async changePassword(
        @Body() body: UserChangePasswordDto,
        @GetUser() user: UserDoc
    ): Promise<void> {
        const matchPassword: boolean = await this.authService.validateUser(
            body.oldPassword,
            user.passwordHash
        );
        if (!matchPassword) {
            throw new BadRequestException({
                statusCode: '400',
                message: 'user.error.passwordNotMatch',
            });
        }

        const newMatchPassword: boolean = await this.authService.validateUser(
            body.newPassword,
            user.passwordHash
        );

        if (newMatchPassword) {
            throw new BadRequestException({
                statusCode: '400',
                message: 'user.error.newPasswordMustDifference',
            });
        }

        const session: ClientSession =
            await this.databaseConnection.startSession();
        session.startTransaction();

        try {
            const password: IAuthPassword =
                await this.authService.createPassword(body.newPassword);

            await this.userService.updatePassword(user, password, { session });

            await session.commitTransaction();
            await session.endSession();
        } catch (err: any) {
            await session.abortTransaction();
            await session.endSession();

            throw new InternalServerErrorException({
                statusCode: '500',
                message: 'http.serverError.internalServerError',
                _error: err.message,
            });
        }

        return;
    }

    @UserProtected()
    @AuthJwtAccessProtected()
    @Put(':id')
    async updateProfile(
        @Body() body: UserUpdateNameDto,
        @GetUser() user: UserDoc,
        @Param('id') id: string
    ) {
        let updateUser = await this.userService.findOneById<UserDoc>(id);
        if (user.id === updateUser.id || user.role === 'admin') {
            updateUser = await this.userService.updateName(updateUser, body);
            return updateUser.toObject();
        }

        throw new BadRequestException({
            statusCode: '401',
            message: 'user.error.notPermission',
        });
    }
}
