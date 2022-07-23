import { Router } from "express";
import { getCustomers, getCustomerById, createCustomer } from "../controllers/customersController.js";
import validateCustomer from "../middlewares/customersMiddleware.js";

const router = Router();

router.get("/customers", getCustomers);
router.get("/customers/:id", getCustomerById);
router.post("/customers", validateCustomer, createCustomer);

export default router;
