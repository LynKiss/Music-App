import { Router } from "express";
import multer from "multer";
import * as controller from "../../controllers/admin/song.controller";
import { mapUploadedSongFiles } from "../../middlewares/admin/uploadSong.middleware";

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
  // Middleware này upload file lên Cloudinary và gắn URL ngược lại vào req.body.
  mapUploadedSongFiles,
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
  mapUploadedSongFiles,
  controller.editPost
);
router.post("/delete/:id", controller.deleteItem);

export const songRoutes: Router = router;
