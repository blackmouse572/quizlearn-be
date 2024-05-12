import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    ArrayMinSize,
    IsArray,
    IsEnum,
    IsOptional,
    MaxLength,
    MinLength,
    ValidateNested,
} from 'class-validator';
import { QuizCreateDto } from 'src/modules/quizbank/dtos/quiz-create.dto';
import { ENUM_QUIZBANK_VISIBILITY } from 'src/modules/quizbank/repository/entities/quizbank.entity';

export class QuizbankCreateDto {
    @ApiProperty({
        example: faker.lorem.sentence(),
        required: true,
    })
    @MinLength(1)
    @MaxLength(1000)
    bankName: string;

    @ApiProperty({
        example: faker.lorem.sentences(),
        required: true,
    })
    @MinLength(1)
    @MaxLength(1000)
    @IsOptional()
    desciption?: string;

    @ApiProperty({
        example: [faker.lorem.sentence()],
        required: false,
    })
    @IsOptional()
    @IsArray()
    @Type(() => String)
    tags?: string[];

    @ApiProperty({
        example: ENUM_QUIZBANK_VISIBILITY.PUBLIC,
        required: true,
    })
    @IsEnum(ENUM_QUIZBANK_VISIBILITY)
    visibility: ENUM_QUIZBANK_VISIBILITY;

    @ApiProperty({
        example: [
            {
                question: faker.lorem.sentence(),
                answer: faker.lorem.sentences(),
            },
        ],
        required: true,
    })
    @IsArray()
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @Type(() => QuizCreateDto)
    quizes: QuizCreateDto[];

    author: string;
}
