import { UserDto } from '@/auth/dto';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';

export class CommentItemDto {
  @IsString()
  @IsNotEmpty()
  comment: string;

  @ValidateNested()
  @Type(() => UserDto)
  user: UserDto;
}
