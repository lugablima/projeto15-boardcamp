import "./setup.js";
import express, { json } from "express";
import cors from "cors";
import categoriesRouter from "./routes/categoriesRouter.js";
import gamesRouter from "./routes/gamesRouter.js";
import customersRouter from "./routes/customersRouter.js";
import rentalsRouter from "./routes/rentalsRouter.js";

const app = express();

app.use(cors(), json());
app.use(categoriesRouter);
app.use(gamesRouter);
app.use(customersRouter);
app.use(rentalsRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
