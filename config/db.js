import mongoose from "mongoose";
import { MONGODB_URL } from "./constants.js";
const dbConnect = async () => {
  try {
    await mongoose.connect(MONGODB_URL);
    console.log("Connected to database");
  } catch (err) {
    console.log("Failed to Connect to Database \n", err.message);
  }
};

export default dbConnect;