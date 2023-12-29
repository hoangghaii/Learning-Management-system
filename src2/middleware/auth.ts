import { redis } from '@/libs/redis';
import ErrorHandler from '@/utils/ErrorHandler';
import 'dotenv/config';
import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

import { catchAsyncError } from './catchAsyncError';

// Authentication middleware
export const isAuthenticated = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return next(
        new ErrorHandler('Please login to access this resource', 400),
      );
    }

    const decoded = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN!,
    ) as JwtPayload;

    if (!decoded) {
      return next(new ErrorHandler('Access token is not valid', 400));
    }

    const user = await redis.get(decoded.id);

    if (!user) {
      return next(new ErrorHandler('User not found', 400));
    }

    (req as any).user = JSON.parse(user);

    return next();
  },
);

// Validate user role
export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes((req as any).user.role)) {
      return next(
        new ErrorHandler(
          `Role ${
            (req as any).user.role
          } is not allowed to access this resource`,
          403,
        ),
      );
    }

    next();
  };
};
