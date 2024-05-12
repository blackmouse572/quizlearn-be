import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { IRequestApp } from 'src/common/pagination/interfaces/request.interface';
import { IQuizbankDoc } from 'src/modules/quizbank/intefaces/quizbank.service.inteface';
import { QuizbankService } from 'src/modules/quizbank/services/quizbank.service';

@Injectable()
export class QuizbankPutToRequestGuard implements CanActivate {
    constructor(private readonly quizbankService: QuizbankService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context
            .switchToHttp()
            .getRequest<IRequestApp & { __quizbank: IQuizbankDoc }>();
        const { quizbank } = request.params;

        const check = await this.quizbankService.findOneById(quizbank, {
            join: true,
        });
        request.__quizbank = check;

        return true;
    }
}
