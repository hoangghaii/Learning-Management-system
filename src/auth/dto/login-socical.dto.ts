import { FileUploadedDto } from '@/common/dto/file-uploaded.dto';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

export class LoginSocialDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => FileUploadedDto)
  avatar: FileUploadedDto;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(6, {
    message: 'Your password must be longer than 6 characters',
  })
  name: string;
}
