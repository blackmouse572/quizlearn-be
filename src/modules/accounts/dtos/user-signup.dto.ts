import { OmitType } from '@nestjs/swagger';
import { UserCreateDto } from 'src/modules/accounts/dtos/user-create.dto';

export class UserSignUpDto extends OmitType(UserCreateDto, [
    'role',
    'signUpFrom',
] as const) {}
