import mongoose from 'mongoose';
import CONSTANT from '../config/const.config';

export default class MongoDB {
  private static isConnected = false;

  public static async connect(): Promise<void> {
    if (this.isConnected) {
      console.log('MongoDB already connected');
      return;
    }

    try {
      await mongoose.connect(CONSTANT.MONGO_URL);
      this.isConnected = true;
      console.log('MongoDB connected successfully');
    } catch (error) {
      console.error('MongoDB connection error:', error);
      process.exit(1);
    }
  }

  public static async disconnect(): Promise<void> {
    if (!this.isConnected) return;

    try {
      await mongoose.disconnect();
      this.isConnected = false;
      console.log('MongoDB disconnected');
    } catch (error) {
      console.error('MongoDB disconnection error:', error);
    }
  }
}
