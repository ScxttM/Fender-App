import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";

const userRouter = Router();

const userController = new UserController();

userRouter.get("/", userController.getAll);
userRouter.get("/:id", userController.getById);
userRouter.post("/register", userController.create);
userRouter.post("/login", userController.login);
userRouter.post("/logout", userController.logout);
userRouter.put("/:id", userController.update);

export default userRouter;
