import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

const corsOptions = {
  origin: ["https://quicknote-beta.vercel.app", "http://localhost:3000"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

app.use(cors(corsOptions));

// app.use(express.json({ limit: "16kb" }));
app.use(express.json());

// app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser("skldjfsldfj@#$#SDsdf"));

// import
import noteRouter from "./routes/note.route.js";
import userRouter from "./routes/user.route.js";

app.use("/api/v1/notes", noteRouter);

app.use("/api/v1/users", userRouter);

export { app };
