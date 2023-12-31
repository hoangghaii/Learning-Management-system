import { User } from '@/auth/schemas/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';

export type CommentItemDocument = HydratedDocument<CommentItem>;

@Schema({
  _id: false,
  versionKey: false,
})
export class CommentItem extends Document {
  @Prop({
    required: [true, 'Please enter your comment'],
    type: String,
  })
  comment: string;

  @Prop({
    ref: 'User',
    type: mongoose.Schema.Types.ObjectId,
  })
  user: User;
}

export const CommentItemSchema = SchemaFactory.createForClass(CommentItem);
