import {
    BadRequestException,
    Body,
    Controller,
    ForbiddenException,
    Get,
    HttpCode,
    HttpStatus,
    InternalServerErrorException,
    NotFoundException,
    Patch,
    Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ClientSession, Connection } from 'mongoose';
import {
    AuthGoogleOAuth2Protected,
    AuthJwtAccessProtected,
    AuthJwtPayload,
    AuthJwtRefreshProtected,
    AuthJwtToken,
} from 'src/common/auth/decorators/auth.decorator';
import { IAuthPassword } from 'src/common/auth/interfaces/auth.interface';
import {
    AuthAccessPayloadSerialization,
    AuthGooglePayloadSerialization,
    AuthRefreshPayloadSerialization,
} from 'src/common/auth/serializations/auth.serialization';
import { AuthService } from 'src/common/auth/services/auth.service';
import { DatabaseConnection } from 'src/common/database/decorators/database.decorator';
import { IResponse } from 'src/common/helpers/interfaces/response.interface';
import {
    GetUser,
    UserAuthProtected,
    UserProtected,
} from 'src/modules/accounts/decorators/user.decorator';
import { UserForgotPasswordDto } from 'src/modules/accounts/dtos/user-forgot-password.dto';
import { UserLoginDto } from 'src/modules/accounts/dtos/user-login.dto';
import { UserChangePasswordDto } from 'src/modules/accounts/dtos/user-update-password.dto';
import { UserUpdateNameDto } from 'src/modules/accounts/dtos/user-update.dto';
import { UserVerifyDto } from 'src/modules/accounts/dtos/user-verify.dto';
import { UserDoc } from 'src/modules/accounts/repository/entities/user.entity';
import { UserService } from 'src/modules/accounts/services/account.service';

@ApiTags('modules.auth.user')
@Controller({
    version: '1',
    path: '/auth',
})
export class UserAuthController {
    awsS3Service: any;
    constructor(
        @DatabaseConnection() private readonly databaseConnection: Connection,
        private readonly userService: UserService,
        private readonly authService: AuthService
    ) {}

    @HttpCode(HttpStatus.OK)
    @Post('/login')
    async login(@Body() { email, password }: UserLoginDto): Promise<IResponse> {
        const user: UserDoc = await this.userService.findOneByEmail(email);
        if (!user) {
            throw new NotFoundException({
                statusCode: '404',
                message: 'user.error.notFound',
            });
        }

        const validate: boolean = await this.authService.validateUser(
            password,
            user.passwordHash
        );
        if (!validate) {
            throw new BadRequestException({
                statusCode: '401',
                message: 'user.error.passwordNotMatch',
            });
        } else if (user.isBan) {
            throw new ForbiddenException({
                statusCode: '403',
                message: 'user.error.blocked',
            });
        }

        const payload = {
            _id: user._id,
            email: user.email,
            username: user.username,
        };
        const expiresIn: number =
            await this.authService.getAccessTokenExpirationTime();
        const loginDate: Date = await this.authService.getLoginDate();
        const payloadAccessToken: AuthAccessPayloadSerialization =
            await this.authService.createPayloadAccessToken(payload, {
                loginWith: 'email',
                loginFrom: 'password',
                loginDate,
            });
        const payloadRefreshToken: AuthRefreshPayloadSerialization =
            await this.authService.createPayloadRefreshToken(
                payload._id,
                payloadAccessToken
            );

        const payloadEncryption = await this.authService.getPayloadEncryption();
        let payloadHashedAccessToken: AuthAccessPayloadSerialization | string =
            payloadAccessToken;
        let payloadHashedRefreshToken:
            | AuthRefreshPayloadSerialization
            | string = payloadRefreshToken;

        if (payloadEncryption) {
            payloadHashedAccessToken =
                await this.authService.encryptAccessToken(payloadAccessToken);
            payloadHashedRefreshToken =
                await this.authService.encryptRefreshToken(payloadRefreshToken);
        }

        const accessToken: string = await this.authService.createAccessToken(
            payloadHashedAccessToken
        );
        const refreshToken: string = await this.authService.createRefreshToken(
            payloadHashedRefreshToken
        );

        const userReponse = {
            ...user.toObject(),

            accessToken: {
                token: accessToken,
                expiresAt: expiresIn,
            },
            refreshToken: {
                token: refreshToken,
            },
        };

        return { data: userReponse };
    }

    @AuthGoogleOAuth2Protected()
    @Get('/login/google')
    async loginGoogle(
        @AuthJwtPayload<AuthGooglePayloadSerialization>()
        { user: userPayload }: AuthGooglePayloadSerialization
    ): Promise<IResponse> {
        const user: UserDoc = await this.userService.findOneByEmail(
            userPayload.email
        );

        if (!user) {
            throw new NotFoundException({
                statusCode: '404',
                message: 'user.error.notFound',
            });
        } else if (user.isBan) {
            throw new ForbiddenException({
                statusCode: '403',
                message: 'user.error.blocked',
            });
        }

        const payload = {
            _id: user._id,
            email: user.email,
            username: user.username,
        };
        const loginDate: Date = await this.authService.getLoginDate();
        const expiresIn: number =
            await this.authService.getAccessTokenExpirationTime();
        const payloadAccessToken: AuthAccessPayloadSerialization =
            await this.authService.createPayloadAccessToken(payload, {
                loginWith: 'google',
                loginFrom: 'google',
                loginDate,
            });
        const payloadRefreshToken: AuthRefreshPayloadSerialization =
            await this.authService.createPayloadRefreshToken(
                payload._id,
                payloadAccessToken
            );

        const payloadEncryption = await this.authService.getPayloadEncryption();
        let payloadHashedAccessToken: AuthAccessPayloadSerialization | string =
            payloadAccessToken;
        let payloadHashedRefreshToken:
            | AuthRefreshPayloadSerialization
            | string = payloadRefreshToken;

        if (payloadEncryption) {
            payloadHashedAccessToken =
                await this.authService.encryptAccessToken(payloadAccessToken);
            payloadHashedRefreshToken =
                await this.authService.encryptRefreshToken(payloadRefreshToken);
        }

        const accessToken: string = await this.authService.createAccessToken(
            payloadHashedAccessToken
        );
        const refreshToken: string = await this.authService.createRefreshToken(
            payloadHashedRefreshToken
        );
        const userReponse = {
            ...user.toObject(),
            accessToken: {
                token: accessToken,
                expiresAt: expiresIn,
            },
            refreshToken: {
                token: refreshToken,
            },
        };
        return {
            data: userReponse,
        };
    }

    @UserAuthProtected()
    @UserProtected()
    @AuthJwtRefreshProtected()
    @HttpCode(HttpStatus.OK)
    @Post('/refresh-token')
    async refresh(
        @AuthJwtToken() refreshToken: string,
        @AuthJwtPayload<AuthRefreshPayloadSerialization>()
        refreshPayload: AuthRefreshPayloadSerialization,
        @GetUser() user: UserDoc
    ): Promise<IResponse> {
        const payload = {
            _id: user._id,
            email: user.email,
            username: user.username,
        };
        const expiresIn: number =
            await this.authService.getAccessTokenExpirationTime();
        const payloadAccessToken: AuthAccessPayloadSerialization =
            await this.authService.createPayloadAccessToken(payload, {
                loginDate: refreshPayload.loginDate,
                loginFrom: refreshPayload.loginFrom,
                loginWith: refreshPayload.loginWith,
            });

        const payloadEncryption = await this.authService.getPayloadEncryption();
        let payloadHashedAccessToken: AuthAccessPayloadSerialization | string =
            payloadAccessToken;

        if (payloadEncryption) {
            payloadHashedAccessToken =
                await this.authService.encryptAccessToken(payloadAccessToken);
        }

        const accessToken: string = await this.authService.createAccessToken(
            payloadHashedAccessToken
        );

        const userReponse = {
            ...user.toObject(),
            accessToken: {
                token: accessToken,
                expiresAt: expiresIn,
            },
        };

        return {
            data: userReponse,
        };
    }

    @UserProtected()
    @AuthJwtAccessProtected()
    @Patch('/change-password')
    async changePassword(
        @Body() body: UserChangePasswordDto,
        @GetUser() user: UserDoc
    ): Promise<void> {
        const passwordAttempt: boolean =
            await this.authService.getPasswordAttempt();
        const maxPasswordAttempt: number =
            await this.authService.getMaxPasswordAttempt();
        if (passwordAttempt && user.passwordAttempt >= maxPasswordAttempt) {
            throw new ForbiddenException({
                statusCode:
                    ENUM_USER_STATUS_CODE_ERROR.USER_PASSWORD_ATTEMPT_MAX_ERROR,
                message: 'user.error.passwordAttemptMax',
            });
        }

        const matchPassword: boolean = await this.authService.validateUser(
            body.oldPassword,
            user.password
        );
        if (!matchPassword) {
            await this.userService.increasePasswordAttempt(user);

            throw new BadRequestException({
                statusCode:
                    ENUM_USER_STATUS_CODE_ERROR.USER_PASSWORD_NOT_MATCH_ERROR,
                message: 'user.error.passwordNotMatch',
            });
        }

        const newMatchPassword: boolean = await this.authService.validateUser(
            body.newPassword,
            user.password
        );
        if (newMatchPassword) {
            throw new BadRequestException({
                statusCode:
                    ENUM_USER_STATUS_CODE_ERROR.USER_PASSWORD_NEW_MUST_DIFFERENCE_ERROR,
                message: 'user.error.newPasswordMustDifference',
            });
        }

        const session: ClientSession =
            await this.databaseConnection.startSession();
        session.startTransaction();

        try {
            await this.userService.resetPasswordAttempt(user, { session });

            const password: IAuthPassword =
                await this.authService.createPassword(body.newPassword);

            await this.userService.updatePassword(user, password, { session });

            await session.commitTransaction();
            await session.endSession();
        } catch (err: any) {
            await session.abortTransaction();
            await session.endSession();

            throw new InternalServerErrorException({
                statusCode: ENUM_ERROR_STATUS_CODE_ERROR.ERROR_UNKNOWN,
                message: 'http.serverError.internalServerError',
                _error: err.message,
            });
        }

        return;
    }

    @AuthJwtAccessProtected()
    @Get('/info')
    async info(
        @AuthJwtPayload<AuthAccessPayloadSerialization>()
        payload: AuthAccessPayloadSerialization
    ): Promise<IResponse> {
        return { data: payload };
    }

    @UserProtected()
    @AuthJwtAccessProtected()
    @Get('/profile')
    async profile(@GetUser() user: UserDoc): Promise<IResponse> {
        return { data: user.toObject() };
    }

    @UserProtected()
    @AuthJwtAccessProtected()
    @Patch('/profile/update')
    async updateProfile(
        @GetUser() user: UserDoc,
        @Body() body: UserUpdateNameDto
    ): Promise<void> {
        await this.userService.updateName(user, body);

        return;
    }

    @Post('/verify-email')
    @HttpCode(HttpStatus.OK)
    async verifyEmail(@Body() { email, token }: UserVerifyDto): Promise<void> {
        const user: UserDoc = await this.userService.findOneByEmail(email);
        if (!user) {
            throw new NotFoundException({
                statusCode: '404',
                message: 'user.error.notFound',
            });
        }

        if (user.verificationToken !== token) {
            throw new BadRequestException({
                statusCode: '400',
                message: 'user.error.tokenNotMatch',
            });
        }

        await this.userService.verify(user);

        return;
    }

    @HttpCode(HttpStatus.OK)
    @Post('/forgot-password')
    async forgotPassword(
        @Body() { email }: UserForgotPasswordDto
    ): Promise<void> {
        const user: UserDoc = await this.userService.findOneByEmail(email);
        if (!user) {
            throw new NotFoundException({
                statusCode: '404',
                message: 'user.error.notFound',
            });
        }

        const token: string =
            await this.authService.createForgotPasswordToken();
        const expires: Date =
            await this.authService.getForgotPasswordTokenExpires();

        await this.userService.updateResetToken(user, token, expires);

        return;
    }
}
