import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = User.create({ username, email, password: hashedPassword });
    return res.status(200).json({
      message: "User created successfully",
      user,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating user" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const tokenData = {
      userId: user._id,
    };

    const token = await jwt.sign(tokenData, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res
      .status(200)
      .cookie("token", token, {
        maxAge: 1*24*60 * 60 * 1000,
        httpOnly: true,
        sameSize: "strict",
      })
      .json({
        message: `Wellcome Back ${user.username}`,
        user,
        token,
        success: true,
      });
  } catch (error) {
    res.status(500).json({ message: "Login error" });
  }
};
export const logout = async (req, res) => {
  try {
    return res.status(201).cookie("token", "", { maxAge: 0 }).json({
      message: "logged out successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
