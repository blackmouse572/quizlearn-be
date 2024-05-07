import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { NestApplication } from '@nestjs/core';

export default function useCors(app: NestApplication, options?: CorsOptions) {
    const allowedHeaders = [
        'Access-Control-Allow-Origin',
        'Access-Control-Origin',
        'Access-Control-Allow-Methods',
        'Content-Type',
        'Access-Control-Allow-Headers',
        'Access-Control-Allow-Credentials',
        'Access-Control-Expose-Headers',
        'Access-Control-Max-Age',
        'Access-Control-Request-Headers',
        'X-Api-Key',
        'x-api-key',
        'x-refresh-token',
        'Authorization',
    ];
    const allowedMethods = 'GET,HEAD,PUT,PATCH,POST,DELETE';

    app.enableCors({
        ...options,
        allowedHeaders,
        maxAge: 3600,
        methods: allowedMethods,
        credentials: true,
    });

    return;
}
