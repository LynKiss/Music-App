import { Router } from "express";
import * as controller from "../../controllers/admin/song.controller";

const router: Router = Router();

router.get("/", controller.index);
router.get("/create", controller.create);
router.post("/create", controller.createPost);
router.get("/edit/:id", controller.edit);
router.post("/edit/:id", controller.editPost);
router.post("/delete/:id", controller.deleteItem);

export const songRoutes: Router = router;
