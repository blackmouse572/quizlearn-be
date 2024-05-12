import { IsNotEmpty, IsNumber, IsPositive, Max, Min } from 'class-validator';

export class QuizbankUpdateRatingDto {
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    @Min(1)
    @Max(5)
    star: number;
}
