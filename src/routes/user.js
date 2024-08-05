import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import upload from "../middlewares/upload.js";

const userRouter = Router();

const userController = new UserController();

userRouter.get("/", userController.getAll);
userRouter.get("/:iduser", userController.getById);
userRouter.post("/register", userController.create);
userRouter.post("/login", userController.login);
userRouter.post("/logout", userController.logout);
userRouter.put("/:iduser", userController.update);
userRouter.put("/password/:iduser", userController.updatePassword);
userRouter.delete("/:iduser", userController.delete);
userRouter.post(
  "/upload/:iduser",
  upload.single("file"),
  userController.uploadProfilePicture
);

export default userRouter;
