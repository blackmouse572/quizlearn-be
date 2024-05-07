import { PartialType } from '@nestjs/swagger';
import { CreatePaginationDto } from './create-pagination.dto';

export class UpdatePaginationDto extends PartialType(CreatePaginationDto) {}
