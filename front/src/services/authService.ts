import type { User } from "../types/auth";
import api from "./api";

export class AuthService {
    static async login(username: string, password: string): Promise<object> {
        try {
            const response = await api.post(`/auth/login`, {
                username,
                password
            });
            return response.data;
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    }

    static async updateUser(id: number, username: string, email: string, password?: string): Promise<object> {
        try {
            const response = await api.patch(`/auth/update/${id}`, {
                username,
                email,
                password
            });
            return response.data;
        } catch (error) {
            console.error("Update user error:", error);
            throw error;
        }
    };

    static async deleteUser(id: number): Promise<void> {
        try {
            await api.delete(`/auth/delete/${id}`);
        } catch (error) {
            console.error("Delete user error:", error);
            throw error;
        }
    };

    static async getAllUsers(): Promise<User[]> {
        try {
            const response = await api.get(`/auth/getAll`);
            return response.data.users;
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    }
}