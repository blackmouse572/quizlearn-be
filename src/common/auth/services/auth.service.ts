import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
    IAuthPassword,
    IAuthPayloadOptions,
} from 'src/common/auth/interfaces/auth.interface';
import {
    AuthAccessPayloadSerialization,
    AuthRefreshPayloadSerialization,
} from 'src/common/auth/serializations/auth.serialization';
import { IHelperGooglePayload } from 'src/common/helpers/interfaces/helper.google.interface';
import { HelperDateService } from 'src/common/helpers/services/helper.date.service';
import { HelperEncryptionService } from 'src/common/helpers/services/helper.encryption.service';
import { HelperGoogleService } from 'src/common/helpers/services/helper.google.service';
import { HelperHashService } from 'src/common/helpers/services/helper.hash.service';
import { HelperStringService } from 'src/common/helpers/services/helper.string.service';

@Injectable()
export class AuthService {
    private readonly accessTokenSecretKey: string;
    private readonly accessTokenExpirationTime: number;
    private readonly accessTokenEncryptKey: string;
    private readonly accessTokenEncryptIv: string;

    private readonly refreshTokenSecretKey: string;
    private readonly refreshTokenExpirationTime: number;
    private readonly refreshTokenEncryptKey: string;
    private readonly refreshTokenEncryptIv: string;

    private readonly payloadEncryption: boolean;
    private readonly prefixAuthorization: string;
    private readonly audience: string;
    private readonly issuer: string;
    private readonly subject: string;

    private readonly passwordExpiredIn: number;
    private readonly passwordSaltLength: number;

    constructor(
        private readonly helperHashService: HelperHashService,
        private readonly helperDateService: HelperDateService,
        private readonly helperStringService: HelperStringService,
        private readonly helperEncryptionService: HelperEncryptionService,
        private readonly helperGoogleService: HelperGoogleService,
        private readonly configService: ConfigService
    ) {
        this.accessTokenSecretKey = this.configService.get<string>(
            'auth.accessToken.secretKey'
        );
        this.accessTokenExpirationTime = this.configService.get<number>(
            'auth.accessToken.expirationTime'
        );
        this.accessTokenEncryptKey = this.configService.get<string>(
            'auth.accessToken.encryptKey'
        );
        this.accessTokenEncryptIv = this.configService.get<string>(
            'auth.accessToken.encryptIv'
        );

        this.refreshTokenSecretKey = this.configService.get<string>(
            'auth.refreshToken.secretKey'
        );
        this.refreshTokenExpirationTime = this.configService.get<number>(
            'auth.refreshToken.expirationTime'
        );
        this.refreshTokenEncryptKey = this.configService.get<string>(
            'auth.refreshToken.encryptKey'
        );
        this.refreshTokenEncryptIv = this.configService.get<string>(
            'auth.refreshToken.encryptIv'
        );

        this.payloadEncryption = this.configService.get<boolean>(
            'auth.payloadEncryption'
        );
        this.prefixAuthorization = this.configService.get<string>(
            'auth.prefixAuthorization'
        );
        this.subject = this.configService.get<string>('auth.subject');
        this.audience = this.configService.get<string>('auth.audience');
        this.issuer = this.configService.get<string>('auth.issuer');

        this.passwordExpiredIn = this.configService.get<number>(
            'auth.password.expiredIn'
        );
        this.passwordSaltLength = this.configService.get<number>(
            'auth.password.saltLength'
        );
    }

    async encryptAccessToken(
        payload: AuthAccessPayloadSerialization
    ): Promise<string> {
        return this.helperEncryptionService.aes256Encrypt(
            payload,
            this.accessTokenEncryptKey,
            this.accessTokenEncryptIv
        );
    }

    async decryptAccessToken({
        data,
    }: Record<string, any>): Promise<AuthAccessPayloadSerialization> {
        return this.helperEncryptionService.aes256Decrypt(
            data,
            this.accessTokenEncryptKey,
            this.accessTokenEncryptIv
        ) as AuthAccessPayloadSerialization;
    }

    async createAccessToken(
        payloadHashed: string | AuthAccessPayloadSerialization
    ): Promise<string> {
        return this.helperEncryptionService.jwtEncrypt(
            { data: payloadHashed },
            {
                secretKey: this.accessTokenSecretKey,
                expiredIn: this.accessTokenExpirationTime,
                audience: this.audience,
                issuer: this.issuer,
                subject: this.subject,
            }
        );
    }

    async validateAccessToken(token: string): Promise<boolean> {
        return this.helperEncryptionService.jwtVerify(token, {
            secretKey: this.accessTokenSecretKey,
            audience: this.audience,
            issuer: this.issuer,
            subject: this.subject,
        });
    }

    async payloadAccessToken(
        token: string
    ): Promise<AuthAccessPayloadSerialization> {
        return this.helperEncryptionService.jwtDecrypt(
            token
        ) as AuthAccessPayloadSerialization;
    }

    async encryptRefreshToken(
        payload: AuthRefreshPayloadSerialization
    ): Promise<string> {
        return this.helperEncryptionService.aes256Encrypt(
            payload,
            this.refreshTokenEncryptKey,
            this.refreshTokenEncryptIv
        );
    }

    async decryptRefreshToken({
        data,
    }: Record<string, any>): Promise<AuthRefreshPayloadSerialization> {
        return this.helperEncryptionService.aes256Decrypt(
            data,
            this.refreshTokenEncryptKey,
            this.refreshTokenEncryptIv
        ) as AuthRefreshPayloadSerialization;
    }

    async createRefreshToken(
        payloadHashed: string | AuthRefreshPayloadSerialization
    ): Promise<string> {
        return this.helperEncryptionService.jwtEncrypt(
            { data: payloadHashed },
            {
                secretKey: this.refreshTokenSecretKey,
                expiredIn: this.refreshTokenExpirationTime,
                audience: this.audience,
                issuer: this.issuer,
                subject: this.subject,
            }
        );
    }

    async validateRefreshToken(token: string): Promise<boolean> {
        return this.helperEncryptionService.jwtVerify(token, {
            secretKey: this.refreshTokenSecretKey,
            audience: this.audience,
            issuer: this.issuer,
            subject: this.subject,
        });
    }

    async payloadRefreshToken(
        token: string
    ): Promise<AuthRefreshPayloadSerialization> {
        return this.helperEncryptionService.jwtDecrypt(
            token
        ) as AuthRefreshPayloadSerialization;
    }

    async validateUser(
        passwordString: string,
        passwordHash: string
    ): Promise<boolean> {
        return this.helperHashService.bcryptCompare(
            passwordString,
            passwordHash
        );
    }

    async createPayloadAccessToken(
        user: Record<string, any>,
        { loginFrom, loginWith, loginDate }: IAuthPayloadOptions
    ): Promise<AuthAccessPayloadSerialization> {
        return {
            user,
            loginFrom,
            loginWith,
            loginDate,
        };
    }

    async createPayloadRefreshToken(
        _id: string,
        { loginFrom, loginWith, loginDate }: AuthAccessPayloadSerialization
    ): Promise<AuthRefreshPayloadSerialization> {
        return {
            user: { _id },
            loginFrom,
            loginWith,
            loginDate,
        };
    }

    async createSalt(length: number): Promise<string> {
        return this.helperHashService.randomSalt(length);
    }

    async createPassword(password: string): Promise<IAuthPassword> {
        const salt: string = await this.createSalt(this.passwordSaltLength);

        const passwordExpired: Date = this.helperDateService.forwardInSeconds(
            this.passwordExpiredIn
        );
        const passwordCreated: Date = this.helperDateService.create();
        const passwordHash = this.helperHashService.bcrypt(password, salt);
        return {
            passwordHash,
            passwordExpired,
            passwordCreated,
            salt,
        };
    }

    async createPasswordRandom(): Promise<string> {
        return this.helperStringService.random(15);
    }

    async checkPasswordExpired(passwordExpired: Date): Promise<boolean> {
        const today: Date = this.helperDateService.create();
        const passwordExpiredConvert: Date =
            this.helperDateService.create(passwordExpired);

        return today > passwordExpiredConvert;
    }

    async getLoginDate(): Promise<Date> {
        return this.helperDateService.create();
    }

    async getTokenType(): Promise<string> {
        return this.prefixAuthorization;
    }

    async getAccessTokenExpirationTime(): Promise<number> {
        return this.accessTokenExpirationTime;
    }

    async getIssuer(): Promise<string> {
        return this.issuer;
    }

    async getAudience(): Promise<string> {
        return this.audience;
    }

    async getSubject(): Promise<string> {
        return this.subject;
    }

    async getPayloadEncryption(): Promise<boolean> {
        return this.payloadEncryption;
    }

    async googleGetTokenInfo(
        accessToken: string
    ): Promise<IHelperGooglePayload> {
        return this.helperGoogleService.getTokenInfo(accessToken);
    }
}
