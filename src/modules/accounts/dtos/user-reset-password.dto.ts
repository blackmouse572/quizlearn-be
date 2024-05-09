import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UserResetPassword {
    @ApiProperty({
        description: 'Reset password token',
        example: `${faker.string.alphanumeric(8)}`,
        required: true,
    })
    @IsNotEmpty()
    @MinLength(8)
    readonly token: string;

    @ApiProperty({
        description: 'new password',
        example: `${faker.internet.password()}`,
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    readonly password: string;
}
