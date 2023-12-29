import { IActivationToken, IUser } from '@/types';
import jwt from 'jsonwebtoken';

export const createActivationToken = (user: IUser): IActivationToken => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

  const token = jwt.sign({ activationCode, user }, process.env.JWT_SECRET!, {
    expiresIn: '10m',
  });

  return { activationCode, token };
};
