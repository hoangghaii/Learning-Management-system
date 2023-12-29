import { Request } from 'express';
import { Document } from 'mongoose';

// Register user
export interface IRegistrationBody extends Request {
  avatar?: string;
  email: string;
  name: string;
  password: string;
}

export interface IActivationToken {
  activationCode: string;
  token: string;
}

export interface IActivationRequest {
  activation_code: string;
  activation_token: string;
}

export interface IUser extends Document {
  avatar: string;
  comparePassword: (password: string) => Promise<boolean>;
  courses: Array<{ courseId: string }>;
  email: string;
  isVerified: boolean;
  name: string;
  password: string;
  role: string;
  signAccessToken: () => string;
  signRefreshToken: () => string;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ISocicalAuthRequest {
  avatar: string;
  email: string;
  name: string;
}

export interface IUpdateUserInfo {
  email?: string;
  name?: string;
}

export interface IUpdatePassword {
  newPassword: string;
  oldPassword: string;
}

export interface IUpdateAvatar {
  avatar: File;
}
