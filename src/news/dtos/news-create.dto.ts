import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateIf,
  IsNumberString,
} from 'class-validator';

export class NewsCreateDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @ValidateIf((o) => o.author)
  @IsString()
  author: string;

  @ValidateIf((o) => o.cover)
  @IsString()
  cover: string;

  @IsNotEmpty() //  Пример даты в формате ISO 8601 (YYYY-MM-DD hh:mm:ss) — 2021-08-09 18:31:42.
  @IsDateString()
  createdAt: string;

  @IsNotEmpty()
  // @IsNumber()
  @IsNumberString()
  authorId: number;

  @IsNotEmpty()
  @IsNumberString()
  categoryId: number;
}
