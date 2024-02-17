import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

const corsOptions = {
  origin: ["http://localhost:3000", "https://quicknote-beta.vercel.app"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

// app.use(express.json({ limit: "16kb" }));
app.use(express.json());

// app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// import
import noteRouter from "./routes/note.route.js";
import userRouter from "./routes/user.route.js";

app.use("/api/v1/notes", noteRouter);

app.use("/api/v1/users", userRouter);

export { app };
