import { Request, Response, NextFunction } from "express";
import { uploadToCloudinary } from "../../helpers/uploadToCloudinary";

// Middleware này chạy sau multer.
// Lúc này req.files đã chứa buffer của các file được upload từ form.
export const mapUploadedSongFiles = (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  const files = req.files as
    | {
        [fieldname: string]: Express.Multer.File[];
      }
    | undefined;

  return (async () => {
    // Nếu có file ảnh, upload lên Cloudinary và ghi URL vào req.body.avatar
    // để controller lưu như một field text bình thường.
    if (files?.avatar?.[0]) {
      req.body.avatar = await uploadToCloudinary(files.avatar[0].buffer, "image");
    }

    // Audio thường để resource_type = "video" trên Cloudinary
    // thì các định dạng mp3/mp4/m4a... dễ được chấp nhận hơn.
    if (files?.audio?.[0]) {
      req.body.audio = await uploadToCloudinary(files.audio[0].buffer, "video");
    }

    next();
  })().catch((error) => {
    // Đẩy lỗi về Express để không bị "treo" request nếu upload thất bại.
    next(error);
  });
};
