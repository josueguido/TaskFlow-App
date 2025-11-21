import * as userModel from "../../models/user.model";

export const registerUser = async (name: string, email: string, passwordHash: string, business_id: number) => {
  const existing = await userModel.findUserByEmail(email);
  if (existing) throw new Error("Email ya registrado");
  return userModel.createUser(name, email, passwordHash, business_id);
};

export const listUsers = async () => {
  return userModel.getAllUsers();
};

export const inviteUser = async (email: string, business_id: number, role_id: number = 2) => {
  const existing = await userModel.findUserByEmail(email);
  if (existing) throw new Error("Usuario ya existe con este email");

  return userModel.createUserInvite(email, business_id, role_id);
};
