import mongoose from "mongoose";

export const connect = async (): Promise<void> => {
  try {
    const mongoUrl = process.env.MONGO_URL;

    if (!mongoUrl) {
      throw new Error("MONGO_URL is not defined");
    }

    console.log("MONGO_URL:", mongoUrl);
    await mongoose.connect(mongoUrl);
    console.log("connect database thành công !");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Database connect error:", message);
    console.log("connect database thất bại !");
  }
};
