import {
    applyDecorators,
    createParamDecorator,
    ExecutionContext,
    UseGuards,
} from '@nestjs/common';
import { IRequestApp } from 'src/common/pagination/interfaces/request.interface';
import { QuizbankAuthorGuard } from 'src/modules/quizbank/decorator/guards/quizbank-author.guard';
import { QuizbankNotFoundGuard } from 'src/modules/quizbank/decorator/guards/quizbank-notfound.guard';
import { QuizbankPutToRequestGuard } from 'src/modules/quizbank/decorator/guards/quizbank-payload.guard';
import { QuizbankDoc } from 'src/modules/quizbank/repository/entities/quizbank.entity';

export const GetQuizbank = createParamDecorator(
    <T>(returnPlain: boolean, ctx: ExecutionContext): T => {
        const { __quizbank } = ctx
            .switchToHttp()
            .getRequest<IRequestApp & { __quizbank: QuizbankDoc }>();
        return (returnPlain ? __quizbank.toObject() : __quizbank) as T;
    }
);

export function QuizbankProtected(): MethodDecorator {
    return applyDecorators(
        UseGuards(QuizbankPutToRequestGuard, QuizbankNotFoundGuard)
    );
}
export function QuizbankUpdateGuard(): MethodDecorator {
    return applyDecorators(
        UseGuards(
            QuizbankPutToRequestGuard,
            QuizbankNotFoundGuard,
            QuizbankAuthorGuard
        )
    );
}
