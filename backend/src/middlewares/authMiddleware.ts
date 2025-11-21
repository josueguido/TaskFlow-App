import pkg from "jsonwebtoken";
const { sign, verify } = pkg;
import { RequestHandler } from "express";
import { AuthUserPayload } from "../types/express";


export const authMiddleware: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: "Token not provided or invalid format" });
    return;
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Token not provided" });
    return;
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("JWT_SECRET not configured");
    res.status(500).json({ message: "Server configuration error" });
    return;
  }

  try {
    const decoded = verify(token, secret);
    req.user = decoded as AuthUserPayload;
    next();
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'TokenExpiredError') {
        res.status(401).json({ message: "Token expired" });
      } else if (error.name === 'JsonWebTokenError') {
        res.status(403).json({ message: "Invalid token" });
      } else {
        res.status(403).json({ message: "Token validation failed" });
      }
    } else {
      res.status(403).json({ message: "Invalid or expired token" });
    }
  }
};
