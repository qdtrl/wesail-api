import express from "express";
import cors from "cors";
import { verifyToken } from "./src/middleware/verifyToken";
import { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      database: any;
      userId: string;
    }
  }
}

export default function (database: any) {
  const app = express();

  app
    .use(cors())
    .use((req: Request, res: Response, next: NextFunction) => {
      req.database = database;
      next();
    })
    .use("/", (req: any, res: any) => {
      res.send("Welcome to the Boat API");
    });

  app.use("/auth", require("./routes/auth.route"));
  app.use("/user", verifyToken, require("./routes/user.route"));

  return app;
}
