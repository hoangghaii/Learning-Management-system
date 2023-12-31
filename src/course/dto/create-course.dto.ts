import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { BenefitDto } from './benefit.dto';
import { CourseDataDto } from './course-data.dto';
import { ReviewDto } from './review.dto';

export class CreateCourseDto {
  @ValidateNested({ each: true })
  @Type(() => BenefitDto)
  benefits: BenefitDto[];

  @ValidateNested({ each: true })
  @Type(() => CourseDataDto)
  courseData: CourseDataDto[];

  @IsNotEmpty()
  @IsString()
  demoUrl: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  estimatePrice: number;

  @IsNotEmpty()
  @IsString()
  level: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @ValidateNested({ each: true })
  @Type(() => BenefitDto)
  prerequisites: BenefitDto[];

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsNumber()
  purchased: number = 0;

  @IsOptional()
  @IsNumber()
  rating: number = 0;

  @ValidateNested({ each: true })
  @Type(() => ReviewDto)
  reviews: ReviewDto[];

  @IsNotEmpty()
  @IsString()
  tags: string;

  @IsNotEmpty()
  @IsString()
  thumnail: string;
}
