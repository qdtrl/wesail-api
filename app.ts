import express from "express";
import cors from "cors";

export default function (database: any) {
  const app = express();

  app
    .use(cors())
    .use((req: any, res: any, next: any) => {
      req.database = database;
      next();
    })
    .use("/", (req: any, res: any) => {
      res.send("Welcome to the Boat API");
    });

  return app;
}
