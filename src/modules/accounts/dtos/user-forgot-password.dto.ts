import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UserForgotPasswordDto {
    @ApiProperty({
        example: faker.internet.email(),
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    @Type(() => String)
    readonly email: string;
}

export class UserValidateResetToken extends UserForgotPasswordDto {
    @ApiProperty({
        example: faker.string.alphanumeric(6),
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(8)
    @Type(() => String)
    readonly pin: string;
}
