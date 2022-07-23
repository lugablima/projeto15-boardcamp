import { Router } from "express";
import { getCustomers, getCustomerById } from "../controllers/customersController.js";

const router = Router();

router.get("/customers", getCustomers);
router.get("/customers/:id", getCustomerById);

export default router;
