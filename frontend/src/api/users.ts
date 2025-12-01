import axios from "@/lib/axios";
import type { User } from "@/types/user";

export interface CreateUserData {
    name: string;
    email: string;
    avatar?: string;
    role?: 'admin' | 'member' | 'viewer';
}

export interface UpdateUserData {
    name?: string;
    email?: string;
    avatar?: string;
    role?: 'admin' | 'member' | 'viewer';
}

export const getAllUsers = async (): Promise<User[]> => {
    const response = await axios.get("/users");
    return response.data.data || response.data;
};

export const getUserById = async (id: string): Promise<User> => {
    const response = await axios.get(`/users/${id}`);
    return response.data;
};

export const createUser = async (data: CreateUserData): Promise<User> => {
    const response = await axios.post("/users", data);
    return response.data;
};

export const updateUser = async (id: string, data: UpdateUserData): Promise<User> => {
    const response = await axios.put(`/users/${id}`, data);
    return response.data;
};

export const deleteUser = async (id: string): Promise<void> => {
    const response = await axios.delete(`/users/${id}`);
    return response.data;
};