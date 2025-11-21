import { RequestHandler } from "express";
import * as roleService from "../../services/users/role.service";

export const getAllRoles: RequestHandler = async (_req, res, next) => {
  try {
    const roles = await roleService.getAllRolesService();
    res.json(roles);
  } catch (err) {
    next(err);
  }
};

export const getRoleById: RequestHandler = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const role = await roleService.getRoleByIdService(id);
    res.json(role);
  } catch (err) {
    next(err);
  }
};

export const createRole: RequestHandler = async (req, res, next) => {
  try {
    const { name } = req.body;
    const role = await roleService.createRoleService(name);
    res.status(201).json(role);
  } catch (err) {
    next(err);
  }
};

export const updateRole: RequestHandler = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { name } = req.body;
    const role = await roleService.updateRoleService(id, name);
    res.json(role);
  } catch (err) {
    next(err);
  }
};

export const deleteRole: RequestHandler = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    await roleService.deleteRoleService(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
