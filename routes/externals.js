import axios from "axios";
import { Router } from "express";
import * as externalsCtrl from "../controllers/externals.js";

const router = Router();

/**
 * Accepts one query parameter called shortURL
 * Send a get request to
 */
router.get("/unshorten", externalsCtrl.unshorten);

export { router };
