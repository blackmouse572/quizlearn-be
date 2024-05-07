import { Inject, Injectable, mixin, Type } from '@nestjs/common';
import { PipeTransform, Scope } from '@nestjs/common/interfaces';
import { REQUEST } from '@nestjs/core';
import _ from 'lodash';
import { IRequestApp } from 'src/common/pagination/interfaces/request.interface';
import { PaginationService } from 'src/common/pagination/services/pagination.service';
export function PaginationFilterInBooleanPipe(
    field: string,
    defaultValue: boolean[],
    raw: boolean
): Type<PipeTransform> {
    @Injectable({ scope: Scope.REQUEST })
    class MixinPaginationFilterInBooleanPipe implements PipeTransform {
        constructor(
            @Inject(REQUEST) protected readonly request: IRequestApp,
            private readonly paginationService: PaginationService
        ) {}

        async transform(
            value: string
        ): Promise<Record<string, { $in: boolean[] }>> {
            let finalValue: boolean[] = defaultValue as boolean[];

            if (value) {
                finalValue = _.uniq(
                    value.split(',').map((val: string) => val === 'true')
                );
            }

            if (raw) {
                this.request.__filters = {
                    [field]: finalValue,
                };
            }
            return this.paginationService.filterIn<boolean>(field, finalValue);
        }
    }

    return mixin(MixinPaginationFilterInBooleanPipe);
}
