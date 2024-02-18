import { Router } from "express";
import {
  login,
  logout,
  register,
  getUser,
  getDetails,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// router.route("/register").post(upload.fields([{ name: "avatar" }]), register);

router.route("/details").post(getDetails);

router.route("/register").post(register);

router.route("/login").post(login);

router.route("/logout").post(verifyJWT, logout);

router.route("/getUser").get(verifyJWT, getUser);

export default router;
