import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import upload from "../middlewares/upload.js";

const createUserRouter = (cache) => {
  const userRouter = Router();

  const userController = new UserController(cache);

  userRouter.get("/", userController.getAll);
  userRouter.get("/:iduser", userController.getById);
  userRouter.post("/register", userController.create);
  userRouter.post("/login", userController.login);
  userRouter.post("/logout", userController.logout);
  userRouter.put("/:iduser", userController.update);
  userRouter.put("/password/:iduser", userController.updatePassword);
  userRouter.delete("/:iduser", userController.delete);
  userRouter.post(
    "/:iduser/upload-profile-picture",
    upload.single("file"),
    userController.uploadProfilePicture
  );

  return userRouter;
};

export default createUserRouter;
