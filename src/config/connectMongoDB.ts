import colors from 'colors';
import mongoose from 'mongoose';

const connectMongoDB = async () => {
  const MONGO_DB_ATLAS_URI = process.env.MONGO_DB_ATLAS_URI ?? '';

  const { connection } = await mongoose.connect(MONGO_DB_ATLAS_URI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });

  console.log(colors.cyan.bold('MongoDB Connected: %s'), connection.host);
};

export default connectMongoDB;
