import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { CreateClassroomDto } from 'src/modules/classroom/dtos/classroom-create.dto';

export class UpdateClassroomDto extends PartialType(CreateClassroomDto) {
    @IsString()
    @ApiProperty({
        example: '60e0a0c3c3b0f0001f000001',
        description: 'The id of the classroom',
    })
    id: string;
}
