import { UserDto } from '@/auth/dto';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { CommentItemDto } from './comment-item.dto';
export class ReviewDto {
  @IsString()
  @IsNotEmpty()
  comment: string;

  @ValidateNested({ each: true })
  @Type(() => CommentItemDto)
  commentReply: CommentItemDto[];

  @IsNumber()
  @IsOptional()
  rating: number = 0;

  @ValidateNested()
  @Type(() => UserDto)
  user: UserDto;
}
