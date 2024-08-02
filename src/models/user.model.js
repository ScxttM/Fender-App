import connection from "../database.js";
import bcrypt from "bcrypt";

export default class User {
  static async getAll() {
    const [users] = await connection.query(
      "SELECT BIN_TO_UUID(iduser) as iduser, name, email FROM users;"
    );

    return users;
  }

  static async getById({ id }) {
    const [user] = await connection.query(
      "SELECT BIN_TO_UUID(iduser) as iduser, name, email FROM users WHERE iduser = UUID_TO_BIN(?);",
      [id]
    );

    return user[0];
  }

  static async create({ name, email, password }) {
    const [result] = await connection.query(
      "INSERT INTO users (iduser, name, email, password) VALUES (UUID_TO_BIN(UUID()), ?, ?, ?);",
      [name, email, password]
    );

    return result.insertId;
  }

  static async update({ id, name, email, password }) {
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

    params.push(id);

    await connection.query(query, params);
  }

  static async getByEmail({ email }) {
    const [user] = await connection.query(
      "SELECT BIN_TO_UUID(iduser) as iduser, name, email FROM users WHERE email = ?;",
      [email]
    );

    return user[0];
  }

  static async login({ email, password }) {
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
  }
}
