import { Inject, Injectable, mixin, Type } from '@nestjs/common';
import { PipeTransform, Scope } from '@nestjs/common/interfaces';
import { REQUEST } from '@nestjs/core';
import { ENUM_PAGINATION_FILTER_CASE_OPTIONS } from 'src/common/pagination/constants/pagination.enum.constant';
import { IPaginationFilterStringEqualOptions } from 'src/common/pagination/interfaces/pagination.interface';
import { IRequestApp } from 'src/common/pagination/interfaces/request.interface';
import { PaginationService } from 'src/common/pagination/services/pagination.service';

export function PaginationFilterEqualPipe(
    field: string,
    raw: boolean,
    options?: IPaginationFilterStringEqualOptions
): Type<PipeTransform> {
    @Injectable({ scope: Scope.REQUEST })
    class MixinPaginationFilterEqualPipe implements PipeTransform {
        constructor(
            @Inject(REQUEST) protected readonly request: IRequestApp,
            private readonly paginationService: PaginationService
        ) {}

        async transform(
            value: string
        ): Promise<Record<string, string | number>> {
            if (!value) {
                return undefined;
            }

            if (
                options?.case === ENUM_PAGINATION_FILTER_CASE_OPTIONS.UPPERCASE
            ) {
                value = value.toUpperCase();
            } else if (
                options?.case === ENUM_PAGINATION_FILTER_CASE_OPTIONS.LOWERCASE
            ) {
                value = value.toUpperCase();
            }

            if (options?.trim) {
                value = value.trim();
            }

            let finalValue: string | number = value;
            if (options?.isNumber) {
                finalValue = Number(value) || value;
            }

            if (raw) {
                return {
                    [field]: finalValue,
                };
            }

            return this.paginationService.filterEqual<string | number>(
                field,
                finalValue
            );
        }
    }

    return mixin(MixinPaginationFilterEqualPipe);
}
