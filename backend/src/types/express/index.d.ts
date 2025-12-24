import { JwtPayload } from "jsonwebtoken";
import { User } from "../../models/user.model";

export interface AuthUserPayload extends JwtPayload {
  userId: string;
  email: string;
  business_id: number;
  iat?: number;
  exp?: number;
}

declare global {
  namespace Express {
    interface Request {
      id?: string;
      user?: AuthUserPayload;
    }
  }
}

export {};
