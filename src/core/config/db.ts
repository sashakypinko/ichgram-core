import mongoose from 'mongoose';

export const connectDB = async () => {
  const DB_URI = process.env.DB_URI;
  
  if (!DB_URI) throw Error('DB_URI is not specified');
  
  try {
    await mongoose.connect(DB_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Error connecting to MongoDB', error);
    process.exit(1);
  }
};