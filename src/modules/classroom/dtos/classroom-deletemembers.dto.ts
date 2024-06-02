import { IsArray, IsString } from 'class-validator';

export class ClassroomDeleteMembersDto {
    @IsArray()
    @IsString({ each: true })
    memberIds: string[];
}
