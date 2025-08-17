import { connect } from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    await connect(process.env.MONGO_URI!);
    console.log('MongoDB: connected');
  } catch (err) {
    const error = err as Error;
    console.error('MongoDB: connection error:', error.message);
    process.exit(1);
  }
};

export default connectDB;
