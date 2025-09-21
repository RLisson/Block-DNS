import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export class AuthService {
    static async login(username: string, password: string): Promise<object> {
        try {
            const response = await axios.post(`${BACKEND_URL}/auth/login`, {
                username,
                password
            });
            return response.data;
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    }
}