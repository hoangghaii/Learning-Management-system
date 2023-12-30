import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdatePasswordDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(6, {
    message: 'Your new password must be longer than 6 characters',
  })
  newPassword: string;

  @IsNotEmpty()
  @IsString()
  oldPassword: string;
}
