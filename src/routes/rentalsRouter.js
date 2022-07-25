import { Router } from "express";
import { getRentals, createRental, finalizeRental, deleteRental } from "../controllers/rentalsController.js";
import validateRental from "../middlewares/rentalsMiddlewares.js";

const router = Router();

router.get("/rentals", getRentals);
router.post("/rentals", validateRental, createRental);
router.post("/rentals/:id/return", finalizeRental);
router.delete("/rentals/:id", deleteRental);

export default router;
