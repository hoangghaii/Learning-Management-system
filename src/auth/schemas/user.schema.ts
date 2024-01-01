import {
  FileUploaded,
  FileUploadedSchema,
} from '@/common/schema/file-uploaded.schema';
import { Course } from '@/course/schemas/course.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import mongoose, { Document, HydratedDocument } from 'mongoose';

const emailRegexPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type UserDocument = HydratedDocument<User>;

@Schema({
  methods: {
    comparePassword: Function,
    signAccessToken: Function,
    signRefreshToken: Function,
  },
  timestamps: true,
})
export class User extends Document {
  @Prop({ required: false, type: FileUploadedSchema })
  avatar: FileUploaded;

  @Prop({
    type: [
      {
        ref: 'Course',
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
  })
  courses: Course[];

  @Prop({
    required: [true, 'Email is required'],
    type: String,
    unique: true,
    validate: {
      message: 'Email must be a valid email address',
      validator: (value: string): boolean => emailRegexPattern.test(value),
    },
  })
  email: string;

  @Prop({
    default: false,
    type: Boolean,
  })
  isVerified: boolean;

  @Prop({
    maxLength: [30, 'Your name cannot exceed 30 characters'],
    required: [true, 'Please enter your name'],
    type: String,
  })
  name: string;

  @Prop({
    minLength: [6, 'Your password must be longer than 6 characters'],
    select: false,
    type: String,
  })
  password: string;

  @Prop({
    default: 'user',
    enum: ['admin', 'user'],
    type: String,
  })
  role: string;

  async comparePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre<UserDocument>('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);

  next();
});

UserSchema.loadClass(User);
