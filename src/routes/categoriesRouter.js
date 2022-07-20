import { Router } from "express";
import { getCategories, createCategory } from "../controllers/categoriesController.js";

const router = Router();

router.get("/categories", getCategories);
router.post("/categories", createCategory);

export default router;
