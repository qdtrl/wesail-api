import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const autorizationHeader = req.headers["authorization"];
    if (!autorizationHeader) {
      throw new Error("No authorization header provided");
    }

    const token = autorizationHeader.split(" ")[1];

    if (!token) {
      throw new Error("No token provided");
    }

    jwt.verify(
      token,
      process.env.JWT_SECRET || "secret",
      (err: any, decoded: any) => {
        if (err) {
          throw new Error("Unauthorized");
        }

        // if everything good, save to request for use in other routes
        req.userId = decoded.id;
        next();
      }
    );
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};
