import { query } from "../config/database"
import type { Domain } from "../types/domain.js"

export class DomainModel {
    static async getAll(): Promise<Domain[]> {
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
        sortOrder: 'ASC' | 'DESC' = 'ASC'
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
        
        // Calcular offset
        const offset = (page - 1) * limit;
        
        // Buscar total de registros
        const countResult = await query('SELECT COUNT(*) as total FROM domains');
        const total = parseInt(countResult.rows[0].total);
        
        // Buscar dados paginados
        const dataResult = await query(
            `SELECT * FROM domains ORDER BY ${sortColumn} ${order} LIMIT $1 OFFSET $2`,
            [limit, offset]
        );
        
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