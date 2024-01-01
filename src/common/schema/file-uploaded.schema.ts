import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type FileUploadedDocument = HydratedDocument<FileUploaded>;

@Schema({
  _id: false,
  versionKey: false,
})
export class FileUploaded extends Document {
  @Prop({
    required: true,
    type: String,
  })
  public_id: string;

  @Prop({
    required: true,
    type: String,
  })
  url: string;
}

export const FileUploadedSchema = SchemaFactory.createForClass(FileUploaded);
