import { OmitType } from '@nestjs/swagger';
import { CreatePostDto } from 'src/modules/post/dtos/create-post.dto';

export class EditPostDto extends OmitType(CreatePostDto, ['classroomId']) {}
