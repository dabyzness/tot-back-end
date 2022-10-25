import { Router } from "express";
import * as searchCtrl from "../controllers/search.js";

const router = Router();

router.get("/:searchTerm", searchCtrl.search);

export { router };
