import { Router } from "express";
import {
  login,
  logout,
  register,
  getUser,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(upload.fields([{ name: "avatar" }]), register);

router.route("/login").post(login);

router.route("/logout").post(verifyJWT, logout);

router.route("/getUser").post(getUser);

export default router;
