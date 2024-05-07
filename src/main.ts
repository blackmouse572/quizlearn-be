import { ValidationPipe } from '@nestjs/common';
import { Logger } from '@nestjs/common/services';
import { ConfigService } from '@nestjs/config';
import { NestApplication, NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import cookieParser from 'cookie-parser';
import 'reflect-metadata';
import useCors from 'src/lib/cors';
import initSwagger from 'src/lib/swagger';
import { ENUM_APP_ENVIROMENT } from 'src/lib/swagger.constraint';
import { AppModule } from './app.module';

async function bootstrap() {
    const app: NestApplication = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    const env: string = configService.get<string>('app.env');
    const prefix: string = configService.get<string>('app.prefix');
    const port: number = configService.get<number>('app.port');

    const logger = new Logger();
    process.env.NODE_ENV = env;

    await initSwagger(app);
    app.setGlobalPrefix(prefix);
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    app.use(cookieParser());
    useContainer(app.select(AppModule), { fallbackOnErrors: true });

    useCors(app, {
        origin:
            env === ENUM_APP_ENVIROMENT.PROD
                ? /^book-rent-(.+).vercel.app$/
                : 'http://localhost:5173',
    });
    await app.listen(port);

    logger.log('************************************');
    logger.log(`Server is running on ${await app.getUrl()}/${prefix}`);
    logger.log('************************************\n');
}
bootstrap();
