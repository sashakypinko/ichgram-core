import mongoose from 'mongoose';

export const connectDB = async () => {
  const dbUri = process.env.DB_URI || 'mongodb://localhost:27017';
  const dbName = process.env.DB_NANE || 'ichgram';
  const user = process.env.DB_USER || 'root';
  const pass = process.env.DB_PASS || 'password';
  
  try {
    await mongoose.connect(dbUri, { user, pass, dbName, retryWrites: true });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Error connecting to MongoDB', error);
    process.exit(1);
  }
};