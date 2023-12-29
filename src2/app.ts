import { ErrorMiddleWare } from '@/middleware/error';
import authRouter from '@/routes/auth.route';
import userRouter from '@/routes/user.route';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import multer from 'multer';

export const app = express();

const apiRouter = express.Router();

// Body parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// Multer
const upload = multer();
app.use(upload.single('avatar'));

// Cookie parser
app.use(cookieParser());

// Cors => Cross Origin Resource Sharing
app.use(cors({ origin: process.env.ORIGIN }));

// Routes
app.use('/api/v1', apiRouter);

apiRouter.use('/user', userRouter);
apiRouter.use('/auth', authRouter);

// Unknown route handler
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Can't find ${req.originalUrl} on this server`) as any;

  err.statusCode = 404;

  next(err);
});

app.use(ErrorMiddleWare);
