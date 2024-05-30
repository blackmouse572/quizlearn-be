import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateClassroomDto {
    @IsString()
    @MinLength(3)
    @MaxLength(100)
    @ApiProperty({
        example: `${faker.person.fullName()}'s classroom'`,
        description: 'The name of the classroom',
    })
    className: string;

    @IsString()
    @MaxLength(1000)
    @ApiProperty({
        example: 'This is a description of the classroom',
        description: 'The description of the classroom',
    })
    description: string;

    @IsBoolean()
    @Type(() => Boolean)
    @ApiProperty({
        example: true,
        description: 'Allow student to invite other students',
    })
    isStudentAllowInvite: boolean;
}
