import { DomainModel } from "../models/domainModel";

export class DomainService {
    static validateDomain(url: string): boolean {
        const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
        return domainRegex.test(url);
    }

    static normalizeDomain(url: string): string {
        return url.toLowerCase().trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    }

    static async getAll(): Promise<string[]> {
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
}