import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class UserLoginDto {
    @IsString()
    @MinLength(3)
    @ApiProperty({
        description: 'Email or Username',
        example: 'ngocvlqt1995@gmail.com',
    })
    emailOrUsername: string;

    @IsString()
    @MinLength(6)
    @ApiProperty({
        description: 'Password',
        example: '123456aa',
    })
    password: string;
}
