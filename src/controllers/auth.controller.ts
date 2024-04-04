import { Request, Response } from "express";

export const register = async (req: any, res: Response) => {
  const { email } = req.body;
  try {
    const user = await req.database.create(req.body);
    res.status(201).json({ user });
  } catch (error) {
    res.status(400).json({ error });
  }
};
