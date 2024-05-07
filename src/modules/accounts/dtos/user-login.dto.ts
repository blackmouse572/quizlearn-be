import { PickType } from '@nestjs/swagger';
import { UserCreateDto } from 'src/modules/accounts/dtos/user-create.dto';

export class UserLoginDto extends PickType(UserCreateDto, [
    'email',
    'password',
] as const) {}
