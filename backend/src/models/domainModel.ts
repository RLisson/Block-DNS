import { Query, QueryResult } from "pg";
import { query } from "../config/database.js"
import type { Domain } from "../types/domain.js"

export class DomainModel {
    static async getAll(): Promise<Domain[]> {
        const result = await query(
            'SELECT * FROM domains ORDER BY id ASC'
        )
        return result.rows;
    }

    static async Search(searchTerm: string): Promise<Domain[]> {
        const result = await query(
            'SELECT * FROM domains WHERE url ILIKE $1 ORDER BY id ASC',
            [`%${searchTerm}%`]
        )
        console.log(result.rows);
        console.log(searchTerm)
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
            'UPDATE domains SET url = $1 WHERE id = $2 RETURNING *',
            [url, id]
        )
        return result.rows[0] || null;
    }

    static async updateByUrl(oldUrl: string, newUrl: string): Promise<string | null> {
        const result = await query(
            'UPDATE domains SET url = $1 WHERE url = $2 RETURNING *',
            [newUrl, oldUrl]
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

    static async getAllPaginated(
        page: number = 1,
        limit: number = 10,
        sortBy: string = 'id',
        sortOrder: 'ASC' | 'DESC' = 'ASC',
        search?: string
    ): Promise<{
        data: any[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
            hasNext: boolean;
            hasPrev: boolean;
        }
    }> {
        // Validar e sanitizar parâmetros
        const validSortColumns = ['id', 'url', 'created_at'];
        const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'id';
        const order = sortOrder === 'DESC' ? 'DESC' : 'ASC';
        const searchTerm = search ? search.trim() : undefined;

        // Calcular offset
        const offset = (page - 1) * limit;

        // Buscar total de registros
        let countResult;
        let dataResult;

        // Buscar dados paginados
        if (searchTerm) {
            countResult = await query(
                'SELECT COUNT(*) as total FROM domains WHERE url ILIKE $1',
                [`%${searchTerm}%`]
            );
            dataResult = await query(
                `SELECT * FROM domains WHERE url ILIKE $3 ORDER BY ${sortColumn} ${order} LIMIT $1 OFFSET $2`,
                [limit, offset, `%${searchTerm}%`]
            );
        } else {
            countResult = await query('SELECT COUNT(*) as total FROM domains');
            dataResult = await query(
                `SELECT * FROM domains ORDER BY ${sortColumn} ${order} LIMIT $1 OFFSET $2`,
                [limit, offset]
            );
        }
        const total = parseInt(countResult.rows[0].total);

        // Calcular metadados de paginação
        const totalPages = Math.ceil(total / limit);
        const hasNext = page < totalPages;
        const hasPrev = page > 1;

        return {
            data: dataResult.rows,
            pagination: {
                page,
                limit,
                total,
                totalPages,
                hasNext,
                hasPrev
            }
        };
    }
}