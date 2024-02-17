import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Attempt to connect to the MongoDB database using the Mongoose connect method
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}`
    );

    // If the connection is successful, log a success message
    console.log("MongoDB connected:", connectionInstance.connection.host);
  } catch (error) {
    // If there is an error during the connection attempt, log an error message
    console.log("MongoDB connection error:", error.message);

    // Exit the Node.js process with an error code to signal an unsuccessful connection
    // 1 indicates error or an abnormal termination.
    process.exit(1);
  }
};

export default connectDB;
