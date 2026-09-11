import express from "express";
import { analyzeBusiness } from "../controllers/analysis.controller.js";

const router = express.Router();

router.post("/", analyzeBusiness);

export default router;