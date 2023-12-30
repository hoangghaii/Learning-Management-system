import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

enum UserRole {
  ADMIN = 'admin',
  BLOGGER = 'blogger',
  USER = 'user',
}

export class UpdateInfoDto {
  @IsString()
  @IsOptional()
  avatar: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(6, {
    message: 'Your password must be longer than 6 characters',
  })
  name: string;

  @IsOptional()
  @Transform(({ value }) => ('' + value).toLowerCase())
  @IsEnum(UserRole)
  role: UserRole;
}
