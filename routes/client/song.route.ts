
import { Router } from "express";
const router: Router = Router();

import * as controller from "../../controllers/song.controller";

router.get("/detail/:slugSong", controller.detail);
router.patch("/like/:typeLike/:idSong", controller.like);
router.patch("/listen/:idSong", controller.listen);
router.get("/:slugTopic", controller.list);
router.patch("/favorite/:typeFavorite/:idSong", controller.favorite);

export const songRoutes: Router = router;
