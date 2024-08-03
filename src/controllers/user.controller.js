import UserModel from "../models/user.model.js";
import { validateUser, validatePartialUser } from "../schemas/user.schema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class UserController {
  getAll = async (req, res) => {
    const users = await UserModel.getAll();

    if (!users) {
      return res.status(500).json({ error: "Error getting users" });
    }

    res.json(users);
  };

  getById = async (req, res) => {
    const { id } = req.params;
    const user = await UserModel.getById({ id });

    if (!user) {
      return res.status(404).json({ error: "User not found ", id });
    }

    res.json(user);
  };

  create = async (req, res) => {
    const validation = validatePartialUser(req.body);

    if (!validation.success) {
      return res.status(400).json({ error: validation.error });
    }

    const { name, email } = validation.data;
    const password = "123456";

    const existingUser = await UserModel.getByEmail({ email });

    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    const hash = await bcrypt.hash(password, 10);
    const id = await UserModel.create({ name, email, password: hash });

    if (!id) {
      return res.status(500).json({ error: "Error creating user" });
    }

    res.json({ message: "User created" });
  };

  update = async (req, res) => {
    const validation = validatePartialUser(req.body);

    if (!validation.success) {
      return res.status(400).json({ error: validation.error });
    }

    const { id } = req.params;
    const { name, email, password } = validation.data;

    const existingUser = await UserModel.getById({ id });

    if (!existingUser) {
      return res.status(404).json({ error: "User not found", id });
    }

    const hash = await bcrypt.hash(password, 10);
    const result = await UserModel.update({ id, name, email, password: hash });

    if (!result) {
      return res.status(500).json({ error: "Error updating user" });
    }

    res.json({ message: "User updated" });
  };

  delete = async (req, res) => {
    const { id } = req.params;

    const user = await UserModel.getById({ id });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const result = await UserModel.delete({ id });

    if (!result) {
      return res.status(500).json({ error: "Error deleting user" });
    }

    if (user.profilePicture) {
      fs.unlinkSync(`uploads/${user.profilePicture}`);
    }

    res.json({ message: "User deleted" });
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

  uploadProfilePicture = async (req, res) => {
    const { id } = req.params;
    const file = req.file;

    const user = await UserModel.getById({ id });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const result = await UserModel.uploadProfilePicture(id, file);

    if (!result) {
      return res.status(500).json({ error: "Error uploading profile picture" });
    }

    res.json({ message: "Profile picture uploaded" });
  };
}
