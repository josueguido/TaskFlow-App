import pkg from 'jsonwebtoken';
import { UnauthorizedError } from '../errors/UnauthorizedError';
import { securityConfig } from '../config/security';

const { sign, verify, TokenExpiredError, JsonWebTokenError } = pkg;

export interface JWTPayload {
  userId: string;
  email: string;
  business_id: number;
  role_id: number;
}

export const generateAccessToken = (payload: JWTPayload): string => {
  return sign(payload, securityConfig.jwt.secret, {
    expiresIn: securityConfig.jwt.expiresIn,
    issuer:    securityConfig.jwt.issuer,
    audience:  securityConfig.jwt.audience,
    algorithm: securityConfig.jwt.algorithm
  });
};

export const generateRefreshToken = (payload: JWTPayload): string => {
  return sign(payload, securityConfig.jwt.refreshSecret, {
    expiresIn: securityConfig.jwt.refreshExpiresIn,
    issuer:    securityConfig.jwt.issuer,
    audience:  securityConfig.jwt.audience,
    algorithm: securityConfig.jwt.algorithm
  });
};

export const verifyAccessToken = (token: string): JWTPayload => {
  try {
    return verify(token, securityConfig.jwt.secret, {
      issuer: securityConfig.jwt.issuer,
      audience: securityConfig.jwt.audience,
      algorithms: [securityConfig.jwt.algorithm]
    }) as JWTPayload;
  } catch (err) {
    if (err instanceof TokenExpiredError) throw new UnauthorizedError('Token expirado');
    if (err instanceof JsonWebTokenError) throw new UnauthorizedError('Token inválido');
    throw err;
  }
};

export const verifyRefreshToken = (token: string): JWTPayload => {
  try {
    return verify(token, securityConfig.jwt.refreshSecret, {
      issuer: securityConfig.jwt.issuer,
      audience: securityConfig.jwt.audience,
      algorithms: [securityConfig.jwt.algorithm]
    }) as JWTPayload;
  } catch (err) {
    if (err instanceof TokenExpiredError) throw new UnauthorizedError('Refresh token expirado');
    if (err instanceof JsonWebTokenError) throw new UnauthorizedError('Refresh token inválido');
    throw err;
  }
};
