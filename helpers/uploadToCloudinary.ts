import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import dotenv from "dotenv";
import streamifier from "streamifier";

// Nạp .env ngay tại đây vì helper này có thể bị import rất sớm,
// trước cả lúc index.ts chạy dotenv.config().
dotenv.config();

// Khởi tạo Cloudinary từ biến môi trường.
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Cloudinary upload_stream nhận stream thay vì nhận trực tiếp Buffer.
// Vì multer(memoryStorage) trả file dưới dạng buffer nên mình phải bọc lại ở đây.
const streamUpload = (
  buffer: Buffer,
  resourceType: "image" | "video" | "raw" | "auto" = "auto"
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: resourceType,
      },
      (error, result) => {
        if (result) {
          resolve(result);
          return;
        }

        reject(error);
      }
    );

    // Chuyển buffer thành stream rồi pipe vào Cloudinary.
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// Hàm public dùng ở middleware:
// nhận buffer file và trả về URL cuối cùng trên Cloudinary.
export const uploadToCloudinary = async (
  buffer: Buffer,
  resourceType: "image" | "video" | "raw" | "auto" = "auto"
): Promise<string> => {
  const result = await streamUpload(buffer, resourceType);
  return result.secure_url || result.url;
};
