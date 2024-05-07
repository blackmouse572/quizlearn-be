import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UserVerifyDto {
    @ApiProperty({
        example: faker.internet.email,
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    @Type(() => String)
    readonly email: string;

    @ApiProperty({
        example: faker.string.alphanumeric(50),
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    @MinLength(3)
    @Type(() => String)
    readonly token: string;
}
