import express, { json } from "express";
import corsMiddleware from "./middlewares/cors.js";
import verifyToken from "./middlewares/auth.js";
import userRouter from "./routes/user.js";
import "dotenv/config";

const PORT = process.env.PORT || 3000;

const createApp = () => {
  const app = express();
  app.use(json());
  app.use(corsMiddleware());
  app.disable("x-powered-by");

  app.get("/", (req, res) => {
    res.json({ message: "API is working" });
  });
  app.post("/login", userRouter);
  app.post("/logout", userRouter);
  app.post("/register", userRouter);
  app.use("/users", verifyToken, userRouter);

  app.listen(PORT, () => {
    console.log(
      `Server is running on port ${PORT}\n\n\thttp://localhost:${PORT}\n\n`
    );
  });
};

export default createApp;
