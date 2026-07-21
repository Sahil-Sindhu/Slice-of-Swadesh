import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    const connString = process.env.MONGODB_URI || 'mongodb://localhost:27017/slice-of-swadesh';
    const conn = await mongoose.connect(connString);
    console.log(`[Database]: MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[Database]: Connection Error: ${error instanceof Error ? error.message : error}`);
    process.exit(1);
  }
};
