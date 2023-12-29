import {
  getUserInfo,
  updateAvatar,
  updatePassword,
  updateUserInfo,
} from '@/controllers/user.controller';
import { isAuthenticated } from '@/middleware/auth';
import express from 'express';

const userRouter = express.Router();

userRouter.get('/me', isAuthenticated, getUserInfo);

userRouter.put('/update-info', isAuthenticated, updateUserInfo);

userRouter.put('/update-password', isAuthenticated, updatePassword);

userRouter.put('/update-avatar', isAuthenticated, updateAvatar);

export default userRouter;
