import { IsNotEmpty, IsString } from 'class-validator';

export class FileUploadedDto {
  @IsString()
  @IsNotEmpty()
  public_id: string;

  @IsString()
  @IsNotEmpty()
  url: string;
}
