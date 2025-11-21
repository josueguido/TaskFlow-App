import { RequestHandler } from "express";
import * as userService from "../../services/users/user.service";
import bcrypt from "bcryptjs";

export const register: RequestHandler = async (req, res, next) => {
  try {
    const { name, email, password, business_id = 1 } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await userService.registerUser(name, email, passwordHash, business_id);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const getUsers: RequestHandler = async (req, res, next) => {
  try {
    const users = await userService.listUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const inviteUser: RequestHandler = async (req, res, next) => {
  try {
    const { email, role_id = 2 } = req.body;
    const adminUser = req.user;

    if (!adminUser || !adminUser.business_id) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const invitedUser = await userService.inviteUser(email, adminUser.business_id, role_id);

    res.status(201).json({
      success: true,
      message: 'Usuario invitado exitosamente',
      data: {
        email: invitedUser.email,
        business_id: invitedUser.business_id,
        status: invitedUser.status,
        invite_token: invitedUser.invite_token
      }
    });
  } catch (error) {
    next(error);
  }
};
