import "./setup.js";
import express, { json } from "express";
import cors from "cors";

const app = express();

app.use(cors(), json());

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
