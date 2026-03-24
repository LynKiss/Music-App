
import { Router } from "express";
const router: Router = Router();

import * as controller from "../../controllers/song.controller";

router.get("/detail/:slugSong", controller.detail);
router.patch("/like/:typeLike/:idSong", controller.like);
router.get("/:slugTopic", controller.list);

export const songRoutes: Router = router;
