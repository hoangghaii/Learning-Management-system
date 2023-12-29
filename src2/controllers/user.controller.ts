import { redis } from '@/libs/redis';
import { catchAsyncError } from '@/middleware/catchAsyncError';
import { UserModel } from '@/models/user.model';
import { getUserById } from '@/services/user.service';
import { IUpdateAvatar, IUpdatePassword, IUpdateUserInfo } from '@/types';
import { _log } from '@/utils/_log';
import ErrorHandler from '@/utils/ErrorHandler';
import { uploadFileToPinataIPFS } from '@/utils/upload';
import 'dotenv/config';
import { NextFunction, Request, Response } from 'express';

export const getUserInfo = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?._id;

      const user = await getUserById(userId);

      return res.status(200).json({
        success: true,
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  },
);

export const updateUserInfo = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, name } = req.body as IUpdateUserInfo;

      const userId = (req as any).user?._id;

      const user = await UserModel.findById(userId);

      if (email && user) {
        const isEmailExist = await UserModel.findOne({ email });

        if (isEmailExist) {
          return next(new ErrorHandler('Email already exists', 400));
        }

        user.email = email;
      }

      if (name && user) {
        user.name = name;
      }

      await user?.save();

      await redis.set(userId, JSON.stringify(user));

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  },
);

export const updatePassword = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { newPassword, oldPassword } = req.body as IUpdatePassword;

      const user = await UserModel.findById((req as any).user?._id).select(
        '+password',
      );

      if (user?.password === undefined) {
        return next(new ErrorHandler('Invalid old password', 400));
      }

      const isPasswordMatch = await user?.comparePassword(oldPassword);

      if (!isPasswordMatch) {
        return next(new ErrorHandler('Invalid old password', 400));
      }

      user.password = newPassword;

      await user?.save();

      await redis.set((req as any).user?._id, JSON.stringify(user));

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  },
);

export const updateAvatar = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const file = req.file;

      const user = await UserModel.findById((req as any).user?._id).select(
        '+password',
      );

      // if (!file) {
      //   return next(new ErrorHandler('Need file to update avatar', 400));
      // }

      // const respon = await uploadFileToPinataIPFS(file as unknown as File);

      _log('file', file);

      // if(user?.avatar)
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  },
);
