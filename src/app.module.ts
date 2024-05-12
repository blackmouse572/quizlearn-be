import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import Joi from 'joi';
import { AuthModule } from 'src/common/auth/auth.module';
import { DATABASE_CONNECTION_NAME } from 'src/common/database/constants/database.constraint';
import { DatabaseOptionsModule } from 'src/common/database/database.options.module';
import { DatabaseOptionsService } from 'src/common/database/service/database.options.service';
import { HelpersModule } from 'src/common/helpers/helpers.module';
import { AppLoggerMiddleware } from 'src/common/logger/middleware/request.logger';
import configs from 'src/configs';
import { ENUM_APP_ENVIROMENT } from 'src/lib/swagger.constraint';
import { AccountModule } from 'src/modules/accounts/account.module';
import { UserRepositoryModule } from 'src/modules/accounts/repository/user.repository.module';
import { EmailModule } from 'src/modules/email/email.module';
import { QuizbankModule } from 'src/modules/quizbank/quizbank.module';
import { QuizbankRepositoryModule } from 'src/modules/quizbank/repository/quizbank-repository.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
    imports: [
        ConfigModule.forRoot({
            load: configs,
            isGlobal: true,
            cache: true,
            envFilePath: ['.env'],
            expandVariables: true,
            validationSchema: Joi.object({
                APP_NAME: Joi.string().required(),
                APP_ENV: Joi.string()
                    .valid(...Object.values(ENUM_APP_ENVIROMENT))
                    .default('development')
                    .required(),

                DATABASE_HOST: Joi.string()
                    .default('mongodb://localhost:27017')
                    .required(),
                DATABASE_NAME: Joi.string().default('ack').required(),
                DATABASE_USER: Joi.string().allow(null, '').optional(),
                DATABASE_PASSWORD: Joi.string().allow(null, '').optional(),
                DATABASE_DEBUG: Joi.boolean().default(false).required(),
                DATABASE_OPTIONS: Joi.string().allow(null, '').optional(),

                AUTH_JWT_SUBJECT: Joi.string().required(),
                AUTH_JWT_AUDIENCE: Joi.string().required(),
                AUTH_JWT_ISSUER: Joi.string().required(),

                AUTH_JWT_ACCESS_TOKEN_SECRET_KEY: Joi.string()
                    .alphanum()
                    .min(5)
                    .max(50)
                    .required(),
                AUTH_JWT_ACCESS_TOKEN_EXPIRED: Joi.string()
                    .default('15m')
                    .required(),

                AUTH_JWT_REFRESH_TOKEN_SECRET_KEY: Joi.string()
                    .alphanum()
                    .min(5)
                    .max(50)
                    .required(),
                AUTH_JWT_REFRESH_TOKEN_EXPIRED: Joi.string()
                    .default('7d')
                    .required(),
                AUTH_JWT_REFRESH_TOKEN_NOT_BEFORE_EXPIRATION: Joi.string()
                    .default('15m')
                    .required(),

                AUTH_JWT_PAYLOAD_ENCRYPT: Joi.boolean()
                    .default(false)
                    .required(),
                AUTH_JWT_PAYLOAD_ACCESS_TOKEN_ENCRYPT_KEY: Joi.string()
                    .allow(null, '')
                    .min(20)
                    .max(50)
                    .optional(),
                AUTH_JWT_PAYLOAD_ACCESS_TOKEN_ENCRYPT_IV: Joi.string()
                    .allow(null, '')
                    .min(16)
                    .max(50)
                    .optional(),
                AUTH_JWT_PAYLOAD_REFRESH_TOKEN_ENCRYPT_KEY: Joi.string()
                    .allow(null, '')
                    .min(20)
                    .max(50)
                    .optional(),
                AUTH_JWT_PAYLOAD_REFRESH_TOKEN_ENCRYPT_IV: Joi.string()
                    .allow(null, '')
                    .min(16)
                    .max(50)
                    .optional(),
                CLOUDINARY_NAME: Joi.string().required(),
                CLOUDINARY_API_KEY: Joi.string().required(),
                CLOUDINARY_API_SECRET: Joi.string().required(),
            }),
            validationOptions: {
                allowUnknown: true,
                abortEarly: true,
            },
        }),
        MongooseModule.forRootAsync({
            connectionName: DATABASE_CONNECTION_NAME,
            imports: [DatabaseOptionsModule],
            inject: [DatabaseOptionsService],
            useFactory: (databaseOptionsService: DatabaseOptionsService) =>
                databaseOptionsService.createOptions(),
        }),
        AccountModule,
        AuthModule,
        HelpersModule,
        UserRepositoryModule,
        EmailModule,
        QuizbankRepositoryModule,
        QuizbankModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer): void {
        consumer.apply(AppLoggerMiddleware).forRoutes('*');
    }
}
