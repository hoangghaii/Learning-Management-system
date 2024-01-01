import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty } from 'class-validator';

enum UploadType {
  AVATAR = 'avatar',
  COURSE = 'course',
}

export class UploadDto {
  @IsNotEmpty()
  @Transform(({ value }) => ('' + value).toLowerCase())
  @IsEnum(UploadType)
  type: UploadType;
}
