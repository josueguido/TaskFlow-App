import { Request, Response, NextFunction } from "express";
import * as authService from "../../services/users/auth.service";
import { BadRequestError } from '../../errors/BadRequestError';

export const businessSignup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, admin_name, admin_email, password } = req.body;

    const result = await authService.signupBusinessService({
      businessName: name,
      adminName: admin_name,
      adminEmail: admin_email,
      password,
    });

    res.status(201).json({
      success: true,
      message: "Business and admin user created successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // DEPRECATED: This endpoint is kept for backwards compatibility
    // Redirect users to /api/auth/signup-business instead
    throw new BadRequestError(
      "POST /register is deprecated. Use /api/auth/signup-business instead"
    );
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new BadRequestError("Email and password are required");
    }

    const data = await authService.loginService(email, password);
    res.status(200).json({
      success: true,
      message: "Login successful",
      data,
    });
  } catch (err) {
    console.error('[LOGIN] Controller error:', err);
    next(err);
  }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;

    console.log('[REFRESH] Request received');
    console.log('[REFRESH] Body:', req.body);
    console.log('[REFRESH] Token provided:', !!refreshToken);

    if (!refreshToken) {
      throw new BadRequestError("Refresh token is required");
    }

    const data = await authService.refreshTokenService(refreshToken);
    res.status(200).json({
      success: true,
      message: "Access token refreshed",
      data,
    });
  } catch (err) {
    console.error('[REFRESH] Controller error:', err);
    next(err);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new BadRequestError("Refresh token is required");
    }

    await authService.logoutService(refreshToken);
    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (err) {
    next(err);
  }
};

export const userSignup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { invite_token, name, password } = req.body;

    const data = await authService.completeUserRegistration(invite_token, name, password);
    res.status(200).json({
      success: true,
      message: "User registration completed successfully",
      data,
    });
  } catch (err) {
    next(err);
  }
};
