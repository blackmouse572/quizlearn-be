import {
    CanActivate,
    ExecutionContext,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { IRequestApp } from 'src/common/pagination/interfaces/request.interface';
import { IQuizbankDoc } from 'src/modules/quizbank/intefaces/quizbank.service.inteface';
import { ENUM_QUIZBANK_VISIBILITY } from 'src/modules/quizbank/repository/entities/quizbank.entity';

@Injectable()
export class QuizbankPublicGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const { __quizbank } = context
            .switchToHttp()
            .getRequest<IRequestApp & { __quizbank: IQuizbankDoc }>();

        if (__quizbank.visibility !== ENUM_QUIZBANK_VISIBILITY.PUBLIC) {
            throw new NotFoundException({
                statusCode: '404',
                message: 'quizbank.error.notFound',
            });
        }

        return true;
    }
}
