import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { IRequestApp } from 'src/common/pagination/interfaces/request.interface';
import { UserDoc } from 'src/modules/accounts/repository/entities/user.entity';
import { IQuizbankDoc } from 'src/modules/quizbank/intefaces/quizbank.service.inteface';

@Injectable()
export class QuizbankAuthorGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const { __quizbank, __user } = context
            .switchToHttp()
            .getRequest<
                IRequestApp & { __quizbank: IQuizbankDoc; __user: UserDoc }
            >();

        if (__user.role === 'admin') return true;

        if (__quizbank.author.id !== __user.id) {
            throw new UnauthorizedException({
                statusCode: '401',
                message: 'quizbank.error.fobidden',
            });
        }

        return true;
    }
}
