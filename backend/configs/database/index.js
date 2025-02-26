import mongoose from "mongoose";

const ConnectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected : ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.log(`Error de connexion : ${error}`);
    process.exit(1);
  }
};

export default ConnectDB;
