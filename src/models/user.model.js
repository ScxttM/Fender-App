import connection from "../database.js";
import bcrypt from "bcrypt";
import fs from "fs";

export default class User {
  static async getAll() {
    try {
      const [users] = await connection.query(
        "SELECT BIN_TO_UUID(iduser) as iduser, name, email FROM users;"
      );

      return users;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  static async getById({ iduser }) {
    try {
      const [user] = await connection.query(
        "SELECT BIN_TO_UUID(iduser) as iduser, name, email, profile_picture FROM users WHERE iduser = UUID_TO_BIN(?);",
        [iduser]
      );

      return user[0];
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  static async create({ name, email, password }) {
    try {
      const [result] = await connection.query(
        "INSERT INTO users (iduser, name, email, password) VALUES (UUID_TO_BIN(UUID()), ?, ?, ?);",
        [name, email, password]
      );

      const id = result.insertId;
      const [user] = await connection.query(
        "SELECT BIN_TO_UUID(iduser) as iduser, name, email FROM users WHERE id= ?;",
        [id]
      );

      return user[0];
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  static async update({ iduser, name, email, password }) {
    try {
      let query = "UPDATE users SET ";
      const params = [];

      if (name) {
        query += "name = ?, ";
        params.push(name);
      }

      if (email) {
        query += "email = ?, ";
        params.push(email);
      }

      if (password) {
        query += "password = ?, ";
        params.push(password);
      }

      query = query.slice(0, -2);
      query += " WHERE iduser = UUID_TO_BIN(?);";

      params.push(iduser);

      const [result] = await connection.query(query, params);

      return result.affectedRows === 1;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  static async delete({ iduser }) {
    try {
      const [result] = await connection.query(
        "DELETE FROM users WHERE iduser = UUID_TO_BIN(?);",
        [iduser]
      );

      return result.affectedRows === 1;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  static async getByEmail({ email }) {
    try {
      const [user] = await connection.query(
        "SELECT BIN_TO_UUID(iduser) as iduser, name, email FROM users WHERE email = ?;",
        [email]
      );

      return user[0];
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  static async login({ email, password }) {
    try {
      const [result] = await connection.query(
        "SELECT BIN_TO_UUID(iduser) as iduser, name, email, password FROM users WHERE email = ?;",
        [email]
      );

      if (result.length === 0) {
        return null;
      }

      const user = result[0];
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return null;
      }

      const firstLogin = await bcrypt.compare("123456", user.password);
      user.firstLogin = firstLogin;

      delete user.password;

      return user;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  static async uploadProfilePicture(iduser, file) {
    try {
      const [user] = await connection.query(
        "SELECT profile_picture FROM users WHERE iduser = UUID_TO_BIN(?);",
        [iduser]
      );

      if (user[0].profile_picture) {
        const filePath = user[0].profile_picture;
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }

      const newFilePath = "uploads/" + file.filename;
      const [result] = await connection.query(
        "UPDATE users SET profile_picture = ? WHERE iduser = UUID_TO_BIN(?);",
        [newFilePath, iduser]
      );

      return result;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
