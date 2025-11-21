import {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
} from "../../models/role.model";
import { IRole } from "../../interfaces/role.interface";
import { BadRequestError } from "../../errors/BadRequestError";

export const getAllRolesService = async (): Promise<IRole[]> => {
  return getAllRoles();
};

export const getRoleByIdService = async (id: number): Promise<IRole> => {
  if (isNaN(id)) throw new BadRequestError("Role ID must be a number");
  return getRoleById(id);
};

export const createRoleService = async (name: string): Promise<IRole> => {
  return createRole(name);
};

export const updateRoleService = async (
  id: number,
  name: string
): Promise<IRole> => {
  if (isNaN(id)) throw new BadRequestError("Role ID must be a number");
  return updateRole(id, name);
};

export const deleteRoleService = async (id: number): Promise<{ message: string }> => {
  if (isNaN(id)) throw new BadRequestError("Role ID must be a number");
  return deleteRole(id);
};
