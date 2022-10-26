import { Router } from "express";
import * as restaurantCtrl from "../controllers/restaurants.js";
import { decodeUserFromToken, checkAuth } from "../middleware/auth.js";

const router = Router();

/*---------- Public Routes ----------*/
router.get("/", restaurantCtrl.index);
router.get("/:id", restaurantCtrl.show);

/*---------- Protected Routes ----------*/
router.use(decodeUserFromToken);

router.post("/", checkAuth, restaurantCtrl.create);
router.post("/:id", checkAuth, restaurantCtrl.createRating);
router.patch("/:id", checkAuth, restaurantCtrl.update);
router.delete("/:id", checkAuth, restaurantCtrl.delete);

export { router };
