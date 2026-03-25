import { Router } from "express";
import multer from "multer";
import * as controller from "../../controllers/admin/upload.controller";
import * as uploadCloud from "../../middlewares/admin/uploadCloud.middleware";

const router: Router = Router();
// memoryStorage giúp lấy file dưới dạng buffer để đẩy thẳng lên Cloudinary,
// không cần ghi file tạm ra ổ đĩa server.
const upload = multer({ storage: multer.memoryStorage() });

// Route upload riêng cho TinyMCE:
// editor sẽ POST file với field name = "file" lên /admin/upload
// rồi nhận lại { location: "https://..." } để chèn URL vào nội dung HTML.
router.post("/", upload.single("file"), uploadCloud.uploadSingle, controller.index);

export const uploadRoutes: Router = router;
