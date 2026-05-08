import pkg from 'jsonwebtoken';
const { verify } = pkg;
import { RequestHandler } from 'express';
import { AuthUserPayload } from '../types/express';
import { requestContext } from '../utils/contextLogger';
import { redis } from '../config/redis';

export const blacklistToken = async (jti: string, ttlSeconds: number): Promise<void> => {
  await redis.set(`blacklist:${jti}`, '1', 'EX', ttlSeconds);
};

const isBlacklisted = async (jti: string): Promise<boolean> => {
  const result = await redis.get(`blacklist:${jti}`);
  return result !== null;
};

export const authMiddleware: RequestHandler = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Token not provided or invalid format' });
    return;
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Token not provided' });
    return;
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error('JWT_SECRET not configured');
    res.status(500).json({ message: 'Server configuration error' });
    return;
  }

  try {
    const decoded = verify(token, secret) as AuthUserPayload;
    if (decoded.jti) {
      const blocked = await isBlacklisted(decoded.jti);
      if (blocked) {
        res.status(401).json({ message: 'Token has been revoked' });
        return;
      }
    }

    req.user = decoded as AuthUserPayload;

    const store = requestContext.getStore();
    if (store) {
      store.userId = req.user.userId;
    }

    next();
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'TokenExpiredError') {
        res.status(401).json({ message: 'Token expired' });
      } else if (error.name === 'JsonWebTokenError') {
        res.status(403).json({ message: 'Invalid token' });
      } else {
        res.status(403).json({ message: 'Token validation failed' });
      }
    } else {
      res.status(403).json({ message: 'Invalid or expired token' });
    }
  }
};
