import { IsNotEmpty, IsString } from 'class-validator';

export class BenefitDto {
  @IsString()
  @IsNotEmpty()
  title: string;
}
