import { Router } from "express";
import {
  addNote,
  deleteNote,
  fetchAllNotes,
  publicNote,
  updateNote,
  viewNote,
} from "../controllers/note.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/addNote").post(verifyJWT, addNote);

router.route("/allNotes").get(verifyJWT, fetchAllNotes);

router.route("/updateNote").put(updateNote);

router.route("/deleteNote").delete(verifyJWT, deleteNote);

router.route("/publicNote").post(publicNote);

router.route("/viewNote/:publicIdentifier").get(viewNote);

export default router;
