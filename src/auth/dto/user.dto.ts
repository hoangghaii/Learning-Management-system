import { FileUploadedDto } from '@/common/dto/file-uploaded.dto';
import { UserRole } from '@/consts';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

export class UserDto {
  @ValidateNested()
  @Type(() => FileUploadedDto)
  avatar: FileUploadedDto;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsBoolean()
  @IsOptional()
  isVerified: boolean = false;

  @IsString()
  @IsNotEmpty()
  @MaxLength(30, {
    message: 'Your name cannot exceed 30 characters',
  })
  name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(6, {
    message: 'Your password must be longer than 6 characters',
  })
  password: string;

  @IsOptional()
  @Transform(({ value }) => ('' + value).toLowerCase())
  @IsEnum(UserRole)
  role: UserRole = UserRole.USER;
}
