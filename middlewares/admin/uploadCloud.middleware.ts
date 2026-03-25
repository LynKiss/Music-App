import { Request, Response, NextFunction } from "express";
import { uploadToCloudinary } from "../../helpers/uploadToCloudinary";

// uploadSingle:
// 1. dùng cho các route chỉ nhận 1 file, ví dụ TinyMCE gửi field "file"
// 2. multer(memoryStorage) đặt file vào req.file dưới dạng buffer
// 3. middleware này upload buffer đó lên Cloudinary
// 4. sau cùng ghi URL Cloudinary ngược lại vào req.body[file.fieldname]
//    để controller phía sau chỉ cần đọc như một field text bình thường
export const uploadSingle = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const file = req.file as Express.Multer.File | undefined;

    if (file) {
      // Ảnh dùng resource_type=image, còn audio/video dùng resource_type=video
      // để Cloudinary xử lý media đúng loại.
      const resourceType = file.mimetype.startsWith("image/") ? "image" : "video";
      const result = await uploadToCloudinary(file.buffer, resourceType);
      req.body[file.fieldname] = result;
    }

    next();
  } catch (error) {
    next(error);
  }
};

// uploadFields:
// 1. dùng cho các form nhận nhiều file cùng lúc, ví dụ avatar + audio ở bài hát
// 2. multer đặt dữ liệu vào req.files theo từng key
// 3. middleware sẽ duyệt từng key, upload từng file lên Cloudinary
// 4. kết quả cuối cùng là req.body.avatar = [url1], req.body.audio = [url2]
//    nên controller sẽ lấy phần tử đầu tiên để lưu vào database
export const uploadFields = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const files = req.files as
      | {
          [fieldname: string]: Express.Multer.File[];
        }
      | undefined;

    if (files) {
      for (const key in files) {
        // Mỗi field được gom thành một mảng URL để hỗ trợ maxCount > 1 nếu cần mở rộng sau này.
        req.body[key] = [];

        const array = files[key];
        for (const item of array) {
          const resourceType = item.mimetype.startsWith("image/") ? "image" : "video";
          const result = await uploadToCloudinary(item.buffer, resourceType);
          req.body[key].push(result);
        }
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};
