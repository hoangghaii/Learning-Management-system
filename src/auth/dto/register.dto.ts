import { FileUploadedDto } from '@/common/dto/file-uploaded.dto';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

export class RegisterDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => FileUploadedDto)
  avatar: FileUploadedDto;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(6, {
    message: 'Your password must be longer than 6 characters',
  })
  password: string;
}
