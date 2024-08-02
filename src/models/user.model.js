import connection from "../database.js";

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
}
