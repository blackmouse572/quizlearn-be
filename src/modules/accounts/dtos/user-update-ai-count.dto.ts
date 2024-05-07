import { PickType } from '@nestjs/swagger';
import { UserCreateDto } from './user-create.dto';

export class UserUpdateAICountDto extends PickType(UserCreateDto, [
    'useAICount',
] as const) {}
