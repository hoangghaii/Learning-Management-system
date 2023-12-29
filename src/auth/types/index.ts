import { Document } from 'mongoose';

export type ActivationTokenType = {
  activationCode: string;
  token: string;
};

export type UserType = Document & {
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
};
