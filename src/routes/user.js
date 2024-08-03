import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import upload from "../middlewares/upload.js";

const userRouter = Router();

const userController = new UserController();

userRouter.get("/", userController.getAll);
userRouter.get("/:id", userController.getById);
userRouter.post("/register", userController.create);
userRouter.post("/login", userController.login);
userRouter.post("/logout", userController.logout);
userRouter.put("/:id", userController.update);
userRouter.delete("/:id", userController.delete);
userRouter.post(
  "/upload/:id",
  upload.single("file"),
  userController.uploadProfilePicture
);

export default userRouter;
