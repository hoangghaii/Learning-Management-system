import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class LoginSocialDto {
  @IsNotEmpty()
  @IsString()
  avatar: string;

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
