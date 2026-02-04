import mongoose from 'mongoose';

const connectMongoDB = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI, {
        dbName: "auto-theorie",
        })
      console.log('MongoDB connected successfully');
    } else {
      console.log('MongoDB is already connected');
    }
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};

export default connectMongoDB;
