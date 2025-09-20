import { query } from "../config/database"

export class DomainModel {
    static async getAll(): Promise<string[]> {
        const result = await query(
            'SELECT * FROM domains ORDER BY id ASC'
        )
        return result.rows;
    }

    static async getById(id: number): Promise<string | null> {
        const result = await query(
            'SELECT * FROM domains WHERE id = $1',
            [id]
        )
        return result.rows[0] || null;
    }

    static async getByUrl(url: string): Promise<string | null> {
        const result = await query(
            'SELECT * FROM domains WHERE url = $1',
            [url]
        )
        return result.rows[0] || null;
    }

    static async create(url: string): Promise<string> {
        const result = await query(
            'INSERT INTO domains (url) VALUES ($1) RETURNING *',
            [url]
        )
        return result.rows[0];
    }

    static async update(id: number, url: string): Promise<string | null> {
        const result = await query(
            'UPDATE domains SET url = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
            [url, id]
        )
        return result.rows[0] || null;
    }

    static async delete(id: number): Promise<boolean> {
        const result = await query(
            'DELETE FROM domains WHERE id = $1 RETURNING *',
            [id]
        )
        return result.rows.length > 0;
    }

    static async exists(url: string): Promise<boolean> {
        const result = await query(
            'SELECT * FROM domains WHERE url = $1',
            [url]
        )
        return result.rows.length > 0;
    }
}