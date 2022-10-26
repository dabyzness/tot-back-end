import { Router } from "express";
import * as externalsCtrl from "../controllers/externals.js";

const router = Router();

router.get("/unshorten", externalsCtrl.unshorten);

router.get("/test", externalsCtrl.google);

export { router };
