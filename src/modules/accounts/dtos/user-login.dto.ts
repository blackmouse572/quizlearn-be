import { IsString, MinLength } from 'class-validator';

export class UserLoginDto {
    @IsString()
    @MinLength(3)
    emailOrUsername: string;

    @IsString()
    @MinLength(6)
    password: string;
}
