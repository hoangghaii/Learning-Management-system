import { redis } from '@/libs/redis';
import { IUser } from '@/types';
import 'dotenv/config';
import { Response } from 'express';

interface ITokenOptions {
  expires: Date;
  httpOnly: boolean;
  maxAge: number;
  sameSite: 'lax' | 'none' | 'strict' | undefined;
  secure: boolean;
}

// Pares environment variable to intergers with fallback values
const accessTokenExpires = parseInt(
  process.env.ACCESS_TOKEN_EXPIRES || '300',
  10,
);

const refreshTokenExpires = parseInt(
  process.env.REFRESH_TOKEN_EXPIRES || '1200',
  10,
);

// Options for cookies
export const accessTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + accessTokenExpires * 60 * 60 * 1000),
  httpOnly: true,
  maxAge: accessTokenExpires * 60 * 60 * 1000,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
};

export const refreshTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + refreshTokenExpires * 24 * 60 * 60 * 1000),
  httpOnly: true,
  maxAge: refreshTokenExpires * 24 * 60 * 60 * 1000,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
};

export const sendToken = (user: IUser, statusCode: number, res: Response) => {
  const accessToken = user.signAccessToken();

  const refreshToken = user.signRefreshToken();

  // Upload session to Redis
  redis.set(user._id, JSON.stringify(user));

  res.cookie('accessToken', accessToken, accessTokenOptions);

  res.cookie('refreshToken', refreshToken, refreshTokenOptions);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...rest } = user.toObject();

  res.status(statusCode).json({
    accessToken,
    success: true,
    user: rest,
  });
};
