import UserModel from "../models/user.model.js";
import { validatePartialUser } from "../schemas/user.schema.js";
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
    const { iduser } = req.params;
    const user = await UserModel.getById({ iduser });

    if (!user) {
      return res.status(404).json({ error: "User not found ", iduser });
    }

    if (user.iduser === req.session.iduser) {
      user.itsMe = true;
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
    const user = await UserModel.create({ name, email, password: hash });

    if (!user) {
      return res.status(500).json({ error: "Error creating user" });
    }

    res.json({ message: "User created", user });
  };

  update = async (req, res) => {
    const validation = validatePartialUser(req.body);

    if (!validation.success) {
      return res.status(400).json({ error: validation.error });
    }

    const { iduser } = req.params;
    const { name, email } = validation.data;

    const existingUser = await UserModel.getById({ iduser });

    if (!existingUser) {
      return res.status(404).json({ error: "User not found", iduser });
    }

    const result = await UserModel.update({ iduser, name, email });

    if (!result) {
      return res.status(500).json({ error: "Error updating user" });
    }

    res.json({ message: "User updated", user: { iduser, name, email } });
  };

  updatePassword = async (req, res) => {
    const validation = validatePartialUser(req.body);

    if (!validation.success) {
      return res.status(400).json({ error: validation.error });
    }

    const { iduser } = req.params;
    const { password } = validation.data;

    const existingUser = await UserModel.getById({ iduser });

    if (!existingUser) {
      return res.status(404).json({ error: "User not found", iduser });
    }

    const hash = await bcrypt.hash(password, 10);
    const result = await UserModel.update({ iduser, password: hash });

    if (!result) {
      return res.status(500).json({ error: "Error updating password" });
    }

    res.json({ message: "Password updated" });
  };

  delete = async (req, res) => {
    const { iduser } = req.params;

    const user = await UserModel.getById({ iduser });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const result = await UserModel.delete({ iduser });

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

    const token = jwt.sign({ iduser: user.iduser }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      token,
      firstLogin: user.firstLogin,
      iduser: user.iduser,
      name: user.name,
    });
  };

  logout = (req, res) => {
    res.clearCookie("token").json({ message: "Logged out" });
  };

  uploadProfilePicture = async (req, res) => {
    const { iduser } = req.params;
    const file = req.file;

    const user = await UserModel.getById({ iduser });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const result = await UserModel.uploadProfilePicture(iduser, file);

    if (!result) {
      return res.status(500).json({ error: "Error uploading profile picture" });
    }

    res.json({ message: "Profile picture uploaded" });
  };
}
