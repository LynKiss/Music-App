
import { Router } from "express";
const router: Router = Router();
import * as controller from "../../controllers/admin/topic.controller";

router.get("/", controller.index);
router.get("/create", controller.create);
router.post("/create", controller.createPost);
router.get("/edit/:id", controller.edit);
router.post("/edit/:id", controller.editPost);
router.post("/delete/:id", controller.deleteItem);

export const topicRoutes: Router = router;
