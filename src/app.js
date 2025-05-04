import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { foodRouter } from "./routes/food.routes.js";
import userRouter from "./routes/User.routes.js";
import orderRouter from "./routes/order.routes.js";

const app = express();

// Parse CORS origins from .env file
const allowedOrigins = process.env.CORS_Origin.split(',');

app.use(cors({
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

app.use(express.json({ limit: "500kb" }));
app.use(express.urlencoded({ extended: true, limit: "500kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes
app.use("/api/v1/food", foodRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/order", orderRouter);

export default app;
