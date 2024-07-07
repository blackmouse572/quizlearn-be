import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
    @ApiProperty({
        example: faker.lorem.sentence(),
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    readonly title: string;

    @ApiProperty({
        example: faker.lorem.paragraph(),
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    readonly content: string;

    @ApiProperty({
        example: '60b6f7b3b3f1f3b3b3f1f3b3',
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    readonly classroomId: string;

    @ApiProperty({
        example: '60b6f7b3b3f1f3b3b3f1f3b3',
        required: true,
    })
    @IsString()
    @IsOptional()
    @Type(() => String)
    readonly bankLink?: string;
}
