import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class QuizAiDto {
    @IsString()
    @MinLength(1)
    @ApiProperty({
        example: 'What is the capital city of Indonesia?',
        description: 'The question of the quiz',
    })
    question: string;

    @IsString()
    @MinLength(1)
    @ApiProperty({
        example: 'Jakarta',
        description: 'The answer of the quiz',
    })
    answer: string;

    explanation?: string;
}
