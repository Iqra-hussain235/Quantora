import express from "express";
import {
  createBusiness,
  getUserBusinesses
} from "../controllers/business.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createBusiness);
router.get("/", protect, getUserBusinesses);


export default router;