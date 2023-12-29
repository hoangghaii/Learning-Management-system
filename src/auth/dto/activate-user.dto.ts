import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ActivateUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(4, {
    message: 'Your activation code must be 4 characters',
  })
  code: string;

  @IsString()
  @IsNotEmpty()
  token: string;
}
