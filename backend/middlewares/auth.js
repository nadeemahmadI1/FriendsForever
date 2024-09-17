import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const auth = async (req, res, next) => {
  try {
    // Ensure token is either in cookies or Authorization header
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }
    // Verify token
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.id = decode.userId;
    next();
  } catch (error) {
    console.error("Token verification error:", error); // Better error logging
    res.status(400).json({ message: "Invalid token Login again" });
  }
};

export default auth;
