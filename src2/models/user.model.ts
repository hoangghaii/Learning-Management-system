import { IUser } from '@/types';
import bcrypt from 'bcryptjs';
import 'dotenv/config';
import jwt from 'jsonwebtoken';
import mongoose, { Model, Schema } from 'mongoose';

const emailRegexPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    avatar: {
      type: String,
    },
    courses: [
      {
        courseId: {
          ref: 'Course',
          type: mongoose.Schema.Types.ObjectId,
        },
      },
    ],
    email: {
      required: [true, 'Please enter your email'],
      type: String,
      unique: true,
      validate: {
        message: (props: any) => `${props.value} is not a valid email address`,
        validator: function (email: string) {
          return emailRegexPattern.test(email);
        },
      },
    },
    isVerified: {
      default: false,
      type: Boolean,
    },
    name: {
      maxLength: [30, 'Your name cannot exceed 30 characters'],
      required: [true, 'Please enter your name'],
      type: String,
    },
    password: {
      minLength: [6, 'Your password must be longer than 6 characters'],
      select: false,
      type: String,
    },
    role: {
      default: 'user',
      type: String,
    },
  },
  { timestamps: true },
);

// Hashing password before saving user to database
userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);

  next();
});

// Compare user password
userSchema.methods.comparePassword = async function (
  password: string,
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.signAccessToken = function (): string {
  return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN || '', {
    expiresIn: '5d',
  });
};

userSchema.methods.signRefreshToken = function (): string {
  return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN || '', {
    expiresIn: '3d',
  });
};

const userModel: Model<IUser> = mongoose.model('User', userSchema);

export { userModel as UserModel };
