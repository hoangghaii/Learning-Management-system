import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type LinkDocument = HydratedDocument<Link>;

@Schema({
  _id: false,
  versionKey: false,
})
export class Link extends Document {
  @Prop({
    required: [true, 'Please enter link title'],
    type: String,
  })
  title: string;

  @Prop({
    required: [true, 'Please enter link url'],
    type: String,
  })
  url: string;
}

export const LinkSchema = SchemaFactory.createForClass(Link);
