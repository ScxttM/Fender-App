import mysql from "mysql2/promise";
import "dotenv/config";

const DEFAULT_CONFIG = {
  host: "localhost",
  user: process.env.DB_USER,
  port: 3306,
  password: process.env.DB_PASSWORD,
  database: "fenderdb",
};
const connectionString = process.env.DB_URL ?? DEFAULT_CONFIG;

const connection = await mysql.createConnection(connectionString);

export default connection;
