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

    static async getAll(): Promise<User[]> {
        try {
            const result = await pool.query('SELECT * FROM users');
            return result.rows;
        } catch (error: any) {
            throw new Error(
                'Erro ao buscar todos os usuários: ' + error.message
            );
        }
    }

    static async editUser(id: number, username?: string, email?: string, password?: string): Promise<User | null> {
        try {
            let query = 'UPDATE users SET';
            const params: (string | number)[] = [];
            if (username) {
                query += ` username = $${params.length + 1},`;
                params.push(username);
            }
            if (email) {
                query += ` email = $${params.length + 1},`;
                params.push(email);
            }
            if (password) {
                const hashedPassword = await bcrypt.hash(password, 10);
                query += ` password = $${params.length + 1},`;
                params.push(hashedPassword);
            }
            query = query.slice(0, -1); // Remove a última vírgula
            query += ` WHERE id = $${params.length + 1} RETURNING *`;
            params.push(id);

            const result = await pool.query(query, params);
            return result.rows[0];
        } catch (error: any) {
            throw new Error(
                'Erro ao editar usuário: ' + error.message
            );
        }
    }

    static async deleteUser(id: number): Promise<void> {
        try {
            await pool.query('DELETE FROM users WHERE id = $1', [id]);
        } catch (error: any) {
            throw new Error(
                'Erro ao deletar usuário: ' + error.message
            );
        }
    }

    static async validatePassword(user: User, password: string): Promise<boolean> {
        return bcrypt.compare(password, user.password);
    }
}

export default UserModel;
