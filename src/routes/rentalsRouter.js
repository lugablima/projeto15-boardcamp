import { Router } from "express";
import { getRentals, createRental } from "../controllers/rentalsController.js";
import validateRental from "../middlewares/rentalsMiddlewares.js";

const router = Router();

router.get("/rentals", getRentals);
router.post("/rentals", validateRental, createRental);

export default router;
