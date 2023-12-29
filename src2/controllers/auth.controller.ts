import { redis } from '@/libs/redis';
import { catchAsyncError } from '@/middleware/catchAsyncError';
import { UserModel } from '@/models/user.model';
import {
  IActivationRequest,
  ILoginRequest,
  IRegistrationBody,
  ISocicalAuthRequest,
  IUser,
} from '@/types';
import { createActivationToken } from '@/utils/createActivationToken';
import ErrorHandler from '@/utils/ErrorHandler';
import {
  accessTokenOptions,
  refreshTokenOptions,
  sendToken,
} from '@/utils/jwt';
import { sendMail } from '@/utils/sendMail';
import 'dotenv/config';
import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

export const registrationUser = catchAsyncError(
  async (req: IRegistrationBody, res: Response, next: NextFunction) => {
    try {
      const { email, name, password } = req.body;

      const isEmailExist = await UserModel.findOne({ email });

      if (isEmailExist) {
        return next(new ErrorHandler('Email already exists', 400));
      }

      const user: IUser = await UserModel.create({
        email,
        name,
        password,
      });

      const activationToken = createActivationToken(user);

      const activationCode = activationToken.activationCode;

      const data = {
        user: {
          activationCode,
          name: user.name,
        },
      };

      try {
        await sendMail({
          data,
          email: user.email,
          subject: 'Account activation code',
          template: 'activation-mail.ejs',
        });

        res.status(201).json({
          activationToken: activationToken.token,
          message: 'Please check your email to activate your account',
          success: true,
        });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  },
);

export const activateUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activation_code, activation_token } =
        req.body as IActivationRequest;

      const newUser: { activationCode: string; user: IUser } = jwt.verify(
        activation_token,
        process.env.JWT_SECRET!,
      ) as { activationCode: string; user: IUser };

      if (newUser.activationCode !== activation_code) {
        return next(new ErrorHandler('Invalid activation code', 400));
      }

      const { email, name, password } = newUser.user;

      const exisUser = await UserModel.findOne({ email });

      if (exisUser) {
        return next(new ErrorHandler('Email already exists', 400));
      }

      await UserModel.create({
        email,
        name,
        password,
      });

      return res.status(201).json({
        success: true,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  },
);

export const loginUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as ILoginRequest;

      if (!email || !password) {
        return next(new ErrorHandler('Please provide email and password', 400));
      }

      const exisUser = await UserModel.findOne({ email }).select('+password');

      if (!exisUser) {
        return next(new ErrorHandler('Invalid credentials', 400));
      }

      const isPasswordMatch = await exisUser.comparePassword(password);

      if (!isPasswordMatch) {
        return next(new ErrorHandler('Invalid credentials', 400));
      }

      sendToken(exisUser, 200, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  },
);

export const logoutUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.cookie('accessToken', '', { maxAge: 1 });

      res.cookie('refreshToken', '', { maxAge: 1 });

      const userId = (req as any).user?._id || '';

      redis.del(userId);

      res.status(200).json({
        message: 'Logged out successfully',
        success: true,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  },
);

export const updateAccessToken = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refresh_token = req.cookies.refreshToken as string;

      const decoded = jwt.verify(
        refresh_token,
        process.env.REFRESH_TOKEN!,
      ) as JwtPayload;

      const message = 'Could not verify refresh token';

      if (!decoded) {
        return next(new ErrorHandler(message, 400));
      }

      const session = await redis.get(decoded.id as string);

      if (!session) {
        return next(new ErrorHandler(message, 400));
      }

      const user = JSON.parse(session);

      const accessToken = jwt.sign(
        { id: user._id },
        process.env.ACCESS_TOKEN!,
        { expiresIn: '5m' },
      );

      const refreshToken = jwt.sign(
        { id: user._id },
        process.env.REFRESH_TOKEN!,
        { expiresIn: '3d' },
      );

      (req as any).user = user;

      res.cookie('accessToken', accessToken, accessTokenOptions);

      res.cookie('refreshToken', refreshToken, refreshTokenOptions);

      res.status(200).json({
        accessToken,
        success: true,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  },
);

export const userSocialAuth = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { avatar, email, name } = req.body as ISocicalAuthRequest;

      const user = await UserModel.findOne({ email });

      if (!user) {
        const newUser = await UserModel.create({
          avatar,
          email,
          name,
        });

        sendToken(newUser, 200, res);
      } else {
        sendToken(user, 200, res);
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  },
);
