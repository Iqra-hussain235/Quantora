import express from "express";
import { createExistingBusiness } from "../controllers/existingbusiness.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";


const router = express.Router();

router.post("/", protect, upload.single("file"), createExistingBusiness);

export default router;