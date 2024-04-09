import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(403).send({ auth: false, message: "No token provided." });
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET || "secret",
    (err: any, decoded: any) => {
      if (err) {
        return res
          .status(500)
          .send({ auth: false, message: "Failed to authenticate token." });
      }

      // if everything good, save to request for use in other routes
      req.userId = decoded.id;
      next();
    }
  );
};
