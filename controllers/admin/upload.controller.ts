import { Request, Response } from "express";

// [POST] /admin/upload
export const index = async (req: Request, res: Response) => {
  // TinyMCE yêu cầu endpoint upload trả về object có key "location".
  // Giá trị này chính là URL ảnh sau khi upload lên Cloudinary.
  res.json({
    location: req.body.file || "",
  });
};
