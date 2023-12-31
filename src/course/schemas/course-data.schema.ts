import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

import { Comment, CommentSchema } from './comment.schema';
import { Link, LinkSchema } from './link.schema';

export type CourseDataDocument = HydratedDocument<CourseData>;

@Schema({
  _id: false,
  versionKey: false,
})
export class CourseData extends Document {
  @Prop({
    required: [true, 'Please enter course data description'],
    type: String,
  })
  description: string;

  @Prop({
    required: false,
    type: [LinkSchema],
  })
  links: Link[] = [];

  @Prop({
    required: false,
    type: [CommentSchema],
  })
  questions: Comment[] = [];

  @Prop({
    required: [true, 'Please enter course data suggestion'],
    type: String,
  })
  suggestion: string;

  @Prop({
    required: [true, 'Please enter course data title'],
    type: String,
  })
  title: string;

  @Prop({
    required: [true, 'Please enter video length'],
    type: Number,
  })
  videoLength: number;

  @Prop({
    required: [true, 'Please enter video player'],
    type: String,
  })
  videoPlayer: string;

  @Prop({
    required: [true, 'Please enter video section'],
    type: String,
  })
  videoSection: string;

  @Prop({
    required: [true, 'Please enter video url'],
    type: String,
  })
  videoUrl: string;
}

export const CourseDataSchema = SchemaFactory.createForClass(CourseData);
