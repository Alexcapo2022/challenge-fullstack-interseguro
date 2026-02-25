import { Router } from "express";
import { calculateStats } from "../controllers/stats.controller";

const router = Router();

router.post("/", calculateStats);

export default router;