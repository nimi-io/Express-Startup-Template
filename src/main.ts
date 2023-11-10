import express, { Request, Response } from "express";
import cors from "cors";
import apiRouter from "./routes";
import config from "./config/config";
import mongoose from "mongoose";
import enums from "./types/lib/index";
import { info } from "winston";
import helmet from "helmet";


const app = express();
const PORT = config.PORT; //process.env.PORT || 8080;

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api/v1", apiRouter);

app.use("**", (req: Request, res: Response) => {
  return res.status(404).send("NOT FOUND");
});

app.get("/", (req: any, res: any) => {
  // Access device information
  const { type, os, browser } = req.device;

  res.send(`Device Type: ${type}, OS: ${os}, Browser: ${browser}`);
});

mongoose
  .connect(config.MongoDBUrl, {})
  .then(() => {
    console.log(enums.CURRENT_DATE, enums.MONGO_DB_CONNECTION_SUCCESS);

    app.listen(PORT, async () => {
      console.log(enums.CURRENT_DATE, `Listening on ${PORT}`);
    });
  })
  .catch(() =>
    console.error(
      enums.CURRENT_DATE,
      enums.ZERO_ERR,
      enums.MONGO_DB_CONNRCTION_ERROR,
      enums.MONGO_DB_CONNRCTION_ERROR
    )
  );
