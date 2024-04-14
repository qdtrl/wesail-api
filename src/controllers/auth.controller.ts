import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const register = async (req: Request, res: Response) => {
  const { email, name, firstName, lastName, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await req.database.user.create({
      data: {
        name,
        email,
        firstName,
        lastName,
        password: hashedPassword,
      },
    });

    res.status(201).json({ user });
  } catch (error) {
    res.status(400).json({ error });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await req.database.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error("User not found");
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new Error("Invalid password");
    }

    const age = 1000 * 60 * 60 * 24 * 7;

    const token = jwt.sign(
      {
        id: user.id,
        isAdmin: false,
      },
      process.env.JWT_SECRET_KEY || "secret",
      { expiresIn: age }
    );

    const { password: userPassword, ...userInfo } = user;

    res
      .cookie("token", token, {
        httpOnly: true,
        // secure:true,
        maxAge: age,
      })
      .status(200)
      .json({ user: userInfo, token });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("token").status(200).json({ message: "Logout Successful" });
};
