import { UserDto } from '@/auth/dto';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';

import { CommentItemDto } from './comment-item.dto';

export class CommentDto {
  @IsString()
  @IsNotEmpty()
  comment: string;

  @ValidateNested({ each: true })
  @Type(() => CommentItemDto)
  commentReply: CommentItemDto[];

  @ValidateNested()
  @Type(() => UserDto)
  user: UserDto;
}
