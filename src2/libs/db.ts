import { _log } from '@/utils/_log';
import 'dotenv/config';
import mongoose from 'mongoose';

const dbUri = process.env.DB_URI as string;

export async function connectDB() {
  try {
    await mongoose
      .connect(dbUri)
      .then((data) => _log('MongoDB connected with', data.connection.host));
  } catch (error: any) {
    _log('connectDB error:', error.message, 'error');

    setTimeout(connectDB, 5000);
  }
}
