import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type PrerequistyDocument = HydratedDocument<Prerequisty>;

@Schema({
  _id: false,
  versionKey: false,
})
export class Prerequisty extends Document {
  @Prop({
    required: [true, 'Please enter your comment'],
    type: String,
  })
  title: string;
}

export const PrerequistySchema = SchemaFactory.createForClass(Prerequisty);
