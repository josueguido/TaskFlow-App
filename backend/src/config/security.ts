import { config } from 'dotenv';
import { Algorithm, SignOptions } from 'jsonwebtoken';
import { CorsOptions } from 'cors';
config();

const JWT_SECRET = process.env.JWT_SECRET
  ?? (() => { throw new Error('JWT_SECRET must be defined'); })();
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET
  ?? (() => { throw new Error('JWT_REFRESH_SECRET must be defined'); })();

const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || '15m') as SignOptions['expiresIn'];
const JWT_REFRESH_EXPIRES_IN = (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as SignOptions['expiresIn'];

export const securityConfig = {
  jwt: {
     secret: JWT_SECRET,
    refreshSecret: JWT_REFRESH_SECRET,
    expiresIn: JWT_EXPIRES_IN,
    refreshExpiresIn: JWT_REFRESH_EXPIRES_IN,
    algorithm: 'HS256' as Algorithm,
    issuer: 'taskflow-api',
    audience: 'taskflow-users'
  },

  rateLimit: {
    general: {
      windowMs: 15 * 60 * 1000,
      max: process.env.NODE_ENV === 'development' ? 1000 : 100,
      message: 'Too many requests, please try again later',
    },
    auth: {
      windowMs: 15 * 60 * 1000,
      max: process.env.NODE_ENV === 'development' ? 50 : 5,
      message: 'Too many login attempts, please try again later',
      skipSuccessfulRequests: true
    },
    register: {
      windowMs: 60 * 60 * 1000,
      max: process.env.NODE_ENV === 'development' ? 30 : 3,
      message: 'Too many registrations, please try again later'
    }
  },

  cors: {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      const allowedOrigins = process.env.CORS_ORIGIN?.split(',').map(url => url.trim()) || [
        'http://localhost:3001',
        'http://localhost:5173',
        'http://localhost:3000',
        'http://127.0.0.1:3001',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:3000'
      ];

      // Permitir sin origin (requests desde archivos, misma origen, etc)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'Cache-Control',
      'x-business-id'
    ]
  } as CorsOptions,

  bcrypt: {
    saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '12'),
    maxLength: 72
  },

  bruteForce: {
    freeRetries: 2,
    minWait: 5 * 60 * 1000,
    maxWait: 15 * 60 * 1000,
    failuresBeforeBrute: 5,
    maxHits: 10,
    lifetime: 24 * 60 * 60
  },

  validation: {
    password: {
      minLength: 8,
      maxLength: 128,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      specialChars: '!@#$%^&*()_+-=[]{}|;:,.<>?'
    },
    email: {
      maxLength: 320,
      allowedDomains: process.env.ALLOWED_EMAIL_DOMAINS?.split(',') || []
    },
    username: {
      minLength: 3,
      maxLength: 30,
      allowedPattern: /^[a-zA-Z0-9_-]+$/
    }
  },

  session: {
    name: 'taskflow.sid',
    secret: process.env.SESSION_SECRET || JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'strict' as const
    }
  },

  helmet: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"]
      }
    },
    crossOriginEmbedderPolicy: false
  },

  logging: {
    level: process.env.LOG_LEVEL || 'info',
    logFailedAuth: true,
    logSuccessfulAuth: false,
    logRateLimitHits: true,
    maxLogSize: '10m',
    maxFiles: '14d'
  }
};

export {
  JWT_SECRET,
  JWT_REFRESH_SECRET,
  JWT_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN,
};

const validateConfig = () => {
  if (JWT_SECRET.length < 32) {
    console.warn('JWT_SECRET debería tener al menos 32 caracteres');
  }

  if (JWT_REFRESH_SECRET.length < 32) {
    console.warn('JWT_REFRESH_SECRET debería tener al menos 32 caracteres');
  }

  if (JWT_SECRET === JWT_REFRESH_SECRET) {
    throw new Error('JWT_SECRET y JWT_REFRESH_SECRET deben ser diferentes');
  }

  if (securityConfig.bcrypt.saltRounds < 10) {
    console.warn('Se recomienda usar al menos 12 salt rounds para bcrypt');
  }

  // CORS origin validation
  const corsOrigin = process.env.CORS_ORIGIN?.split(',').map(url => url.trim()) || [];
  if (process.env.NODE_ENV === 'production' &&
      (corsOrigin.includes('http://localhost:3000') || corsOrigin.length === 0)) {
    console.warn('CORS incluye localhost en producción');
  }
};

validateConfig();

export default securityConfig;
