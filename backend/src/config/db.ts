import mongoose from 'mongoose';
import { logger } from '../utils/logger';

export const connectDB = async (): Promise<void> => {
  try {
    const connString = process.env.MONGODB_URI || 'mongodb://localhost:27017/slice-of-swadesh';
    const conn = await mongoose.connect(connString);
    logger.info(`MongoDB connected: ${conn.connection.host}`, { service: 'database' });
  } catch (error) {
    logger.error(`Connection Error: ${error instanceof Error ? error.message : error}`, { service: 'database' });
    process.exit(1);
  }
};
