import { Type } from 'class-transformer';
import { IsDate, IsString, MinLength } from 'class-validator';

export class CreateClassroomCodeDto {
    @IsString()
    @MinLength(3)
    code: string;

    @IsString()
    generateBy: string;

    @IsDate()
    @Type(() => Date)
    expiredAt: Date;
}
