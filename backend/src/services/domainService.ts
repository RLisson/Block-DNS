import type { Domain } from "../types/domain.js";
import { DomainModel } from "../models/domainModel.js";

export class DomainService {
    static validateDomain(url: string): boolean {
        try {
            return URL.canParse("https://" + url);
        }
        catch {
            return false;
        }
    }

    static normalizeDomain(url: string): string {
        return url.toLowerCase().trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    }

    static async search(term: string): Promise<Domain[]> {
        try {
            console.log('Searching for term:', term);
            return await DomainModel.Search(term);
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    static async getAll(): Promise<Domain[]> {
        try {
            return await DomainModel.getAll();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static async getById(id: number): Promise<string | null> {
        try {
            return await DomainModel.getById(id);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static async getByUrl(url: string): Promise<string | null> {
        try {
            return await DomainModel.getByUrl(url);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static async create(url: string): Promise<string> {
        try {
            console.log('Creating domain with URL:', url);
            const normalizedUrl = this.normalizeDomain(url);
            if (!this.validateDomain(normalizedUrl)) {
                throw new Error('URL inválida');
            }
            const exists = await DomainModel.exists(normalizedUrl);
            if (exists) {
                throw new Error('Domínio já existe');
            }
            return await DomainModel.create(normalizedUrl);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static async update(id: number, url: string): Promise<string | null> {
        try {
            const normalizedUrl = this.normalizeDomain(url);
            if (!this.validateDomain(normalizedUrl)) {
                throw new Error('URL inválida');
            }
            const exists = await DomainModel.exists(normalizedUrl);
            if (exists) {
                throw new Error('Domínio já existe');
            }
            return await DomainModel.update(id, normalizedUrl);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static async updateByUrl(oldUrl: string, newUrl: string): Promise<string | null> {
        try {
            const normalizedOldUrl = this.normalizeDomain(oldUrl);
            const normalizedNewUrl = this.normalizeDomain(newUrl);
            if (!this.validateDomain(normalizedNewUrl)) {
                throw new Error('URL inválida');
            }
            const exists = await DomainModel.exists(normalizedNewUrl);
            if (exists) {
                throw new Error('Domínio já existe');
            }
            return await DomainModel.updateByUrl(normalizedOldUrl, normalizedNewUrl);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static async delete(id: number): Promise<boolean> {
        try {
            return await DomainModel.delete(id);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static async getPaginatedDomains(
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
        try {
            // Validar parâmetros
            const validatedPage = Math.max(1, Math.floor(page));
            const validatedLimit = Math.min(Math.max(1, Math.floor(limit)), 100); // Máximo de 100 itens por página
            const validSortOrders: ('ASC' | 'DESC')[] = ['ASC', 'DESC'];
            const validatedSortOrder = validSortOrders.includes(sortOrder) ? sortOrder : 'ASC';

            return await DomainModel.getAllPaginated(
                validatedPage,
                validatedLimit,
                sortBy,
                validatedSortOrder
            );
        } catch (error) {
            console.error('Erro ao buscar domínios paginados:', error);
            throw error;
        }
    }
}