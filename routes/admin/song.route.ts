import { Router } from "express";
import multer from "multer";
import * as controller from "../../controllers/admin/song.controller";
import * as uploadCloud from "../../middlewares/admin/uploadCloud.middleware";

const router: Router = Router();
// Dùng memoryStorage để file nằm trong RAM tạm thời.
// Sau đó middleware phía sau sẽ lấy buffer này và đẩy thẳng lên Cloudinary.
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", controller.index);
router.get("/create", controller.create);
router.post(
  "/create",
  // Nhận đồng thời 2 field file từ form: avatar và audio.
  // Tên field ở đây phải giống hệt name trong input file của Pug.
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "audio", maxCount: 1 },
  ]),
  // uploadFields sẽ biến file -> URL Cloudinary và gắn vào req.body.avatar / req.body.audio.
  uploadCloud.uploadFields,
  controller.createPost
);
router.get("/edit/:id", controller.edit);
router.post(
  "/edit/:id",
  // Luồng edit dùng cùng cơ chế upload nhiều field như create.
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "audio", maxCount: 1 },
  ]),
  // Với edit cũng dùng cùng flow để nếu có file mới thì thay URL cũ.
  uploadCloud.uploadFields,
  controller.editPost
);
router.post("/delete/:id", controller.deleteItem);

export const songRoutes: Router = router;
