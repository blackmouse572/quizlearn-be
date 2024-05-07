import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { ClassConstructor } from 'class-transformer';
import { REQUEST_PARAM_CLASS_DTOS_META_KEY } from 'src/lib/guards/request.constant';
import { RequestParamRawGuard } from 'src/lib/guards/request.guard';

export function RequestParamGuard(
    ...classValidation: ClassConstructor<any>[]
): MethodDecorator {
    return applyDecorators(
        UseGuards(RequestParamRawGuard),
        SetMetadata(REQUEST_PARAM_CLASS_DTOS_META_KEY, classValidation)
    );
}
