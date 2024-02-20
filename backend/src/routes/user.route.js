import { Router } from "express";
import {
  login,
  logout,
  register,
  getUser,
  getCookie,
  setCookie,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(upload.fields([{ name: "avatar" }]), register);

router.route("/login").post(login);

router.route("/logout").post(verifyJWT, logout);

router.route("/getUser").get(verifyJWT, getUser);

router.route("/get-cookie").get(getCookie);

router.route("/set-cookie").get(setCookie);

export default router;
