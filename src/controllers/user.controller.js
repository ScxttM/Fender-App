import UserModel from "../models/user.model.js";
import { validateUser, validatePartialUser } from "../schemas/user.schema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class UserController {
  getAll = async (req, res) => {
    const users = await UserModel.getAll();
    res.json(users);
  };

  getById = async (req, res) => {
    const { id } = req.params;
    const user = await UserModel.getById({ id });
    res.json(user);
  };

  create = async (req, res) => {
    const result = validatePartialUser(req.body);

    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    const { name, email } = result.data;
    const password = "123456";

    const existingUser = await UserModel.getByEmail({ email });

    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    const hash = await bcrypt.hash(password, 10);
    const id = await UserModel.create({ name, email, password: hash });
    res.json({ id });
  };

  login = async (req, res) => {
    const { email, password } = req.body;

    const user = await UserModel.login({ email, password });

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user.iduser }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "none",
        secure: process.env.NODE_ENV === "production",
        maxAge: 3600000,
      })
      .json({ token, firstLogin: user.firstLogin });
  };

  logout = (req, res) => {
    res.clearCookie("token").json({ message: "Logged out" });
  };
}
