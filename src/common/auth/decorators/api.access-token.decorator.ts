import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

export function ApiAccessToken() {
    return applyDecorators(ApiBearerAuth('accessToken'));
}

export function ApiRefreshToken() {
    return applyDecorators(ApiBearerAuth('refreshToken'));
}
