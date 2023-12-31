import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type BenefitDocument = HydratedDocument<Benefit>;

@Schema({
  _id: false,
  versionKey: false,
})
export class Benefit extends Document {
  @Prop({
    required: [true, 'Please enter your comment'],
    type: String,
  })
  title: string;
}

export const BenefitSchema = SchemaFactory.createForClass(Benefit);
