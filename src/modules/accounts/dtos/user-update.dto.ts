import { OmitType, PartialType } from '@nestjs/swagger';
import { UserCreateDto } from './user-create.dto';

export class UserUpdateNameDto extends PartialType(
    OmitType(UserCreateDto, [
        'role',
        'email',
        'password',
        'useAICount',
        'signUpFrom',
    ] as const)
) {}
