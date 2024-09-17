import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";
import friendRoutes from "./routes/friends.route.js";
import cookieParser from "cookie-parser";
dotenv.config();
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(cors());

// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected fine"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/friends", friendRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
