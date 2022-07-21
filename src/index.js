import "./setup.js";
import express, { json } from "express";
import cors from "cors";
import categoriesRouter from "./routes/categoriesRouter.js";
import gamesRouter from "./routes/gamesRouter.js";

const app = express();

app.use(cors(), json());
app.use(categoriesRouter);
app.use(gamesRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
