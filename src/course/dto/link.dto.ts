import { IsNotEmpty, IsString } from 'class-validator';

export class LinkDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  url: string;
}
