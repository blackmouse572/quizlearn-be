import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsDate,
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';

export class UserCreateDto {
    @ApiProperty({
        example: faker.internet.email(),
        required: true,
    })
    @IsEmail()
    @IsNotEmpty()
    @MaxLength(100)
    @Type(() => String)
    readonly email: string;

    @ApiProperty({
        example: faker.person.firstName(),
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(100)
    @Type(() => String)
    readonly fullName: string;

    @ApiProperty({
        example: faker.image.avatar(),
        required: true,
    })
    @IsString()
    @IsOptional()
    @MinLength(1)
    @MaxLength(100)
    @Type(() => String)
    readonly avatar: string;

    @ApiProperty({
        example: faker.string.uuid(),
        required: true,
    })
    @IsNotEmpty()
    readonly role: 'admin' | 'user' = 'user';

    @ApiProperty({
        description: 'string password',
        example: `${faker.string.alphanumeric(5).toLowerCase()}${faker.string
            .alphanumeric(5)
            .toUpperCase()}@@!123`,
        required: true,
    })
    @IsNotEmpty()
    @MaxLength(50)
    readonly password: string;

    @IsString()
    @IsNotEmpty()
    readonly signUpFrom: string;

    @ApiProperty({
        example: faker.date.past(),
        required: false,
    })
    @IsDate()
    @Type(() => Date)
    @IsOptional()
    readonly dob?: Date;

    readonly useAICount: number;
}
