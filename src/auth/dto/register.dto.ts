import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class RegisterDto {
  @IsOptional()
  @IsString()
  avatar?: string;

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
