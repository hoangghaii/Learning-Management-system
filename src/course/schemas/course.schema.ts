import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

import { Benefit, BenefitSchema } from './benefit.schema';
import { CourseData, CourseDataSchema } from './course-data.schema';
import { Prerequisty, PrerequistySchema } from './prerequisity.schema';
import { Review, ReviewSchema } from './review.schema';

export type CourseDocument = HydratedDocument<Course>;

@Schema()
export class Course extends Document {
  @Prop({
    type: [BenefitSchema],
  })
  benefits: Benefit[];

  @Prop({
    type: [CourseDataSchema],
  })
  courseData: CourseData[];

  @Prop({
    required: [true, 'Please enter course demo url'],
    type: String,
  })
  demoUrl: string;

  @Prop({
    required: [true, 'Please enter course description'],
    type: String,
  })
  description: string;

  @Prop({
    required: [true, 'Please enter course estimate price'],
    type: Number,
  })
  estimatePrice: number;

  @Prop({
    required: [true, 'Please enter course level'],
    type: String,
  })
  level: string;

  @Prop({
    required: [true, 'Please enter course name'],
    type: String,
  })
  name: string;

  @Prop({
    type: [PrerequistySchema],
  })
  prerequisites: Prerequisty[];

  @Prop({
    required: [true, 'Please enter course price'],
    type: Number,
  })
  price: number;

  @Prop({
    default: 0,
    type: Number,
  })
  purchased: number;

  @Prop({
    default: 0,
    type: Number,
  })
  rating: number;

  @Prop({
    type: [ReviewSchema],
  })
  reviews: Review[];

  @Prop({
    required: [true, 'Please enter course tags'],
    type: String,
  })
  tags: string;

  @Prop({
    required: [true, 'Please fill course thumnail'],
    type: String,
  })
  thumnail: string;
}

export const CourseSchema = SchemaFactory.createForClass(Course);

CourseSchema.loadClass(Course);
