import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLE_TYPE_META_KEY } from 'src/common/auth/constants/auth.constants';
import { IRequestApp } from 'src/common/pagination/interfaces/request.interface';
@Injectable()
export class RolePayloadTypeGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredFor: string[] = this.reflector.getAllAndOverride<
            string[]
        >(ROLE_TYPE_META_KEY, [context.getHandler(), context.getClass()]);

        const { user } = context.switchToHttp().getRequest<IRequestApp>();
        const { type } = user.user;

        if (!requiredFor || type === 'admin') {
            return true;
        }

        const hasFor: boolean = requiredFor.includes(type);
        if (!hasFor) {
            throw new ForbiddenException({
                statusCode: '401',
                message: 'role.error.typeForbidden',
            });
        }
        return hasFor;
    }
}
