import { Request, Response } from "express";
import bcrypt from "bcrypt";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await req.database.user.findMany();

    if (!users) {
      throw new Error("No users found");
    }

    res.status(200).json(users);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!Number(id)) {
      throw new Error("Id must be a number");
    }

    const user = await req.database.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new Error("User not found");
    }
    res.status(200).json(user);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  let updatedPassword = null;

  try {
    const id = req.params.id;
    if (!Number(id)) {
      throw new Error("Id must be a number");
    }

    const tokenUserId = req.userId;
    if (Number(id) !== Number(tokenUserId)) {
      throw new Error("Not Authorized");
    }

    const { password, avatar, ...inputs } = req.body;

    if (password) {
      updatedPassword = await bcrypt.hash(password, 10);
    }

    const updatedUser = await req.database.user.update({
      where: { id },
      data: {
        ...inputs,
        ...(updatedPassword && { password: updatedPassword }),
        ...(avatar && { avatar }),
      },
    });

    if (!updatedUser) {
      throw new Error("Failed to update user");
    }

    const { password: userPassword, ...rest } = updatedUser.user;

    res.status(200).json({ user: rest });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!Number(id)) {
      throw new Error("Id must be a number");
    }

    const tokenUserId = req.userId;
    if (Number(id) !== Number(tokenUserId)) {
      throw new Error("Not Authorized");
    }

    await req.database.user.delete({
      where: { id },
    });

    res.status(200).json({ message: "User deleted" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
