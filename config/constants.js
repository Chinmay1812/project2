import dotEnv from "dotenv";

dotEnv.config();

export const MONGODB_URL = process.env.MONGODB_URL || 'mongodb+srv://backend-todo:FAooDwBtnjBCmdZq@cluster0.fbwua37.mongodb.net/?retryWrites=true&w=majority';
export const PORT = process.env.PORT || 4000;

export const DEV_MODE = (process.env.NODE_ENV === "development");