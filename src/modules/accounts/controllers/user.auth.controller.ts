import {
    BadRequestException,
    Body,
    Controller,
    ForbiddenException,
    Get,
    HttpCode,
    HttpStatus,
    NotFoundException,
    Patch,
    Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Connection } from 'mongoose';
import {
    AuthGoogleOAuth2Protected,
    AuthJwtAccessProtected,
    AuthJwtPayload,
    AuthJwtRefreshProtected,
    AuthJwtToken,
} from 'src/common/auth/decorators/auth.decorator';
import {
    AuthAccessPayloadSerialization,
    AuthGooglePayloadSerialization,
    AuthRefreshPayloadSerialization,
} from 'src/common/auth/serializations/auth.serialization';
import { AuthService } from 'src/common/auth/services/auth.service';
import { DatabaseConnection } from 'src/common/database/decorators/database.decorator';
import {
    GetUser,
    UserAuthProtected,
    UserProtected,
} from 'src/modules/accounts/decorators/user.decorator';
import { UserForgotPasswordDto } from 'src/modules/accounts/dtos/user-forgot-password.dto';
import { UserLoginDto } from 'src/modules/accounts/dtos/user-login.dto';
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
    constructor(
        @DatabaseConnection() private readonly databaseConnection: Connection,
        private readonly userService: UserService,
        private readonly authService: AuthService
    ) {}

    @HttpCode(HttpStatus.OK)
    @Post('/login')
    async login(@Body() { email, password }: UserLoginDto) {
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

        const accessTokenExpiresAt = new Date().setSeconds(
            new Date().getSeconds() + expiresIn
        );
        const userReponse = {
            ...user.toObject(),

            accessToken: {
                token: accessToken,
                expiresAt: accessTokenExpiresAt,
            },
            refreshToken: {
                token: refreshToken,
            },
        };

        return userReponse;
    }

    @AuthGoogleOAuth2Protected()
    @Get('/login/google')
    async loginGoogle(
        @AuthJwtPayload<AuthGooglePayloadSerialization>()
        { user: userPayload }: AuthGooglePayloadSerialization
    ) {
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
        return userReponse;
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
    ) {
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

        return userReponse;
    }

    @AuthJwtAccessProtected()
    @Get('/info')
    async info(
        @AuthJwtPayload<AuthAccessPayloadSerialization>()
        payload: AuthAccessPayloadSerialization
    ) {
        return payload;
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
