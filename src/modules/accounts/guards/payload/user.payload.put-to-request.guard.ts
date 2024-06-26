import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { IRequestApp } from 'src/common/pagination/interfaces/request.interface';
import { UserDoc } from 'src/modules/accounts/repository/entities/user.entity';
import { UserService } from 'src/modules/accounts/services/account.service';

@Injectable()
export class UserPayloadPutToRequestGuard implements CanActivate {
    constructor(private readonly userService: UserService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context
            .switchToHttp()
            .getRequest<IRequestApp & { __user: UserDoc }>();
        const { user } = request.user;

        const check: UserDoc = await this.userService.findOneById(user._id);
        request.__user = check;

        return true;
    }
}
