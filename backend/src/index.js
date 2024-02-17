import connectDB from "./db/index.js";
import { app } from "./app.js";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 4000, () => {
      console.log("Server Listening at port", process.env.PORT);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection failed:", err.message);
  });
