import type { User } from "../types/user";
import pool from "../config/database";
import bcrypt from "bcryptjs";

class UserModel {
    static async findById(id: number): Promise<User | null> {
        try {
            const result = await pool.query(
                'SELECT * FROM users WHERE id = $1',
                [id]
            );
            return result.rows[0];
        } catch (error: any) {
            throw new Error(
                'Erro ao buscar usuário por ID: ' + error.message
            );
        }
    };

    static async findByUsername(username: string): Promise<User | null> {
        try {
            const result = await pool.query(
                'SELECT * FROM users WHERE username = $1',
                [username]
            );
            return result.rows[0];
        } catch (error: any) {
            throw new Error(
                'Erro ao buscar usuário por nome de usuário: ' + error.message
            );
        }
    };

    static async findByEmail(email: string): Promise<User | null> {
        try {
            const result = await pool.query(
                'SELECT * FROM users WHERE email = $1',
                [email]
            );
            return result.rows[0];
        } catch (error: any) {
            throw new Error(
                'Erro ao buscar usuário por email: ' + error.message
            );
        }
    };

    static async create(username: string, email: string, password: string): Promise<User> {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const result = await pool.query(
                'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
                [username, email, hashedPassword]
            );
            return result.rows[0];
        } catch (error: any) {
            throw new Error(
                'Erro ao criar usuário: ' + error.message
            );
        }
    };

    static async validatePassword(user: User, password: string): Promise<boolean> {
        return bcrypt.compare(password, user.password);
    }
}

export default UserModel;
