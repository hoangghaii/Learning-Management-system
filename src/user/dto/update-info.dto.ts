import { FileUploadedDto } from '@/common/dto/file-uploaded.dto';
import { UserRole } from '@/consts';
import { Transform, Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

export class UpdateInfoDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => FileUploadedDto)
  avatar: FileUploadedDto;

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
