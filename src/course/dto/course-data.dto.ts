import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

import { CommentDto } from './comment.dto';
import { LinkDto } from './link.dto';

export class CourseDataDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @ValidateNested({ each: true })
  @Type(() => LinkDto)
  links: LinkDto[];

  @ValidateNested({ each: true })
  @Type(() => CommentDto)
  questions: CommentDto[];

  @IsString()
  @IsNotEmpty()
  suggestion: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @IsNotEmpty()
  videoLength: number;

  @IsString()
  @IsNotEmpty()
  videoPlayer: string;

  @IsString()
  @IsNotEmpty()
  videoSection: string;

  @IsString()
  @IsNotEmpty()
  videoUrl: string;
}
