import {
  activateUser,
  loginUser,
  logoutUser,
  registrationUser,
  updateAccessToken,
  userSocialAuth,
} from '@/controllers/auth.controller';
import { authorizeRoles, isAuthenticated } from '@/middleware/auth';
import express from 'express';

const authRouter = express.Router();

authRouter.post('/activate-user', activateUser);

authRouter.post('/login', loginUser);

authRouter.get('/logout', isAuthenticated, authorizeRoles('admin'), logoutUser);

authRouter.post('/register', registrationUser);

authRouter.get('/refresh-token', updateAccessToken);

authRouter.post('/login-social', userSocialAuth);

export default authRouter;
