import { IntersectionType, PartialType } from '@nestjs/mapped-types';
import { NewsCreateDto } from './news-create.dto';
import { NewsIdDto } from './news-id.dto';

export class NewsUpdateDto extends IntersectionType(
  PartialType(NewsCreateDto),
  PartialType(NewsIdDto),
) {}
