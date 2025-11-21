import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { securityConfig } from '../../config/security';
import * as authController from '../../controllers/users/auth.controller';
import { validateRequest } from '../../middlewares/validateRequest.middleware';
import { businessSignupSchema, userSignupSchema, loginSchema } from '../../schemas/auth.schema';

const router = Router();

const authLimiter = rateLimit(securityConfig.rateLimit.auth);
const registerLimiter = rateLimit(securityConfig.rateLimit.register);

router.post('/signup-business', registerLimiter, validateRequest(businessSignupSchema), authController.businessSignup);

router.post('/signup-user', registerLimiter, validateRequest(userSignupSchema), authController.userSignup);

// Deprecated - use /signup-business instead
// router.post('/register', registerLimiter, authController.register);

router.post('/login', authLimiter, validateRequest(loginSchema), authController.login);
router.post('/refresh', authController.refreshToken);
router.post('/logout', authController.logout);

// TODO: Multi-tenant features (commented for future implementation)
// router.post('/switch-tenant', authController.switchTenant);
// router.post('/select-tenant', authController.selectTenant);

export default router;
