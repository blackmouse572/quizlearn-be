import { Inject, Injectable, mixin, Type } from '@nestjs/common';
import { PipeTransform, Scope } from '@nestjs/common/interfaces';
import { REQUEST } from '@nestjs/core';
import { IRequestApp } from 'src/common/pagination/interfaces/request.interface';
import { PaginationService } from 'src/common/pagination/services/pagination.service';

export function PaginationPagingPipe(
    defaultPerPage: number
): Type<PipeTransform> {
    @Injectable({ scope: Scope.REQUEST })
    class MixinPaginationPagingPipe implements PipeTransform {
        constructor(
            @Inject(REQUEST) protected readonly request: IRequestApp,
            private readonly paginationService: PaginationService
        ) {}

        async transform(
            value: Record<string, any>
        ): Promise<Record<string, any>> {
            const perPage: number = this.paginationService.perPage(
                Number(value?.take ?? defaultPerPage)
            );
            const offset: number = Number(value?.skip ?? 0);

            const page: number = this.paginationService.page(
                Number(value?.page ?? 1)
            );

            this.request.__pagination = {
                ...this.request.__pagination,
                page,
                perPage,
            };

            return {
                ...value,
                page,
                perPage,
                _limit: perPage,
                _offset: offset,
            };
        }
    }

    return mixin(MixinPaginationPagingPipe);
}
