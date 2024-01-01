import { FileUploadedDto } from '@/common/dto/file-uploaded.dto';
import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { BenefitDto } from './benefit.dto';
import { CourseDataDto } from './course-data.dto';
import { ReviewDto } from './review.dto';

export class UpdateCourseDto {
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => BenefitDto)
  benefits: BenefitDto[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CourseDataDto)
  courseData: CourseDataDto[];

  @IsOptional()
  @IsString()
  demoUrl: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  estimatePrice: number;

  @IsOptional()
  @IsString()
  level: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => BenefitDto)
  prerequisites: BenefitDto[];

  @IsOptional()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsNumber()
  purchased: number = 0;

  @IsOptional()
  @IsNumber()
  rating: number = 0;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ReviewDto)
  reviews: ReviewDto[];

  @IsOptional()
  @IsString()
  tags: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => FileUploadedDto)
  thumnail: FileUploadedDto;
}
