import express from "express"
import { register, login, logout } from "../controllers/auth.controller.js";

const router = express.Router();

// Register a new user
router.post("/signup", register);

// Login
router.post("/login", login);
router.post("/logout", logout);

export default router;
