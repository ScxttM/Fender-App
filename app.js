import express, { json } from "express";
import { corsMiddleware } from "./middlewares/cors.js";
import "dotenv/config";

const PORT = process.env.PORT || 3000;

const createApp = () => {
  const app = express();
  app.use(json());
  app.use(corsMiddleware());
  app.disable("x-powered-by");

  app.get("/", (req, res) => {
    res.json({ message: "Hello World!" });
  });

  app.listen(PORT, () => {
    console.log(
      `Server is running on port ${PORT}\n\n\thttp://localhost:${PORT}\n\n`
    );
  });
};

export default createApp;
