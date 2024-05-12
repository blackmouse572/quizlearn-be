import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';

export class QuizCreateDto {
    @ApiProperty({
        example: faker.lorem.sentence(),
        required: true,
    })
    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(1000)
    @Type(() => String)
    readonly question: string;

    @ApiProperty({
        example: faker.lorem.sentences(),
        required: true,
    })
    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(1000)
    @Type(() => String)
    readonly answer: string;

    @ApiProperty({
        example: faker.lorem.sentence(),
        required: false,
    })
    @IsString()
    @IsOptional()
    @MinLength(1)
    @MaxLength(1000)
    @Type(() => String)
    readonly explaination?: string;

    quizbank: string;
}
