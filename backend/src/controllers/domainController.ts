import { DomainService } from '../services/domainService';
import { RpzZone } from '../config/rpz-zone';
import { requireAuth } from '../middlewares/auth';
import { ScpService } from '../services/scpService';

export default class DomainController {
    static async getAllDomains(req: any, res: any) {
        try {
            // Verificar se é uma requisição paginada
            const { page, limit, sortBy, sortOrder } = req.query;
            
            if (page || limit) {
                // Usar paginação
                const pageNum = parseInt(page) || 1;
                const limitNum = parseInt(limit) || 10;
                const sortColumn = sortBy || 'id';
                const order = (sortOrder && sortOrder.toUpperCase() === 'DESC') ? 'DESC' : 'ASC';
                
                const result = await DomainService.getPaginatedDomains(
                    pageNum,
                    limitNum,
                    sortColumn,
                    order as 'ASC' | 'DESC',
                );
                
                res.json({
                    success: true,
                    data: result.data,
                    pagination: result.pagination
                });
            } else {
                // Usar método tradicional (sem paginação)
                const domains = await DomainService.getAll();
                res.json({
                    success: true,
                    data: domains
                });
            }
        } catch (error: any) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    static async simpleGetAll(req: any, res: any) {
        try {
            const domains = await DomainService.getAll();
            res.json({
                success: true,
                data: domains
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    static async searchDomains(req: any, res: any) {
        const { term } = req.query;
        console.log("Searching for term:", term);
        try {
            const domains = await DomainService.search(term);
            res.json({
                success: true,
                data: domains
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    static async getDomainById(req: any, res: any) {
        const { id } = req.params;
        try {
            const domain = await DomainService.getById(Number(id));
            if (!domain) {
                return res.status(404).json({
                    success: false,
                    message: 'Domínio não encontrado'
                });
            }
            res.json({
                success: true,
                data: domain
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    static async getDomainByUrl(req: any, res: any) {
        const { url } = req.params;
        try {
            const domain = await DomainService.getByUrl(url);
            if (!domain) {
                return res.status(404).json({
                    success: false,
                    message: 'Domínio não encontrado'
                });
                }
            return res.json({
                success: true,
                data: domain
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    };

    static async createDomain(req: any, res: any) {
        try {
            const { url } = req.body;
            if (!url) {
                return res.status(400).json({
                    success: false,
                    message: 'URL é obrigatória'
                });
            }
            const newDomain = await DomainService.create(url);
            res.status(201).json({
                success: true,
                data: newDomain
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    };

    static async updateDomain(req: any, res: any) {
        const { id } = req.params;
        const { url } = req.body;
        try {
            if (!url) {
                return res.status(400).json({
                    success: false,
                    message: 'URL é obrigatória'
                });
            }
            const updatedDomain = await DomainService.update(Number(id), url);
            if (!updatedDomain) {
                return res.status(404).json({
                    success: false,
                    message: 'Domínio não encontrado'
                });
            }
            res.json({
                success: true,
                data: updatedDomain
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    };

    static async updateByUrl(req: any, res: any) {
        const { oldUrl, newUrl } = req.body;
        try {
            if (!oldUrl || !newUrl) {
                return res.status(400).json({
                    success: false,
                    message: 'Old URL e New URL são obrigatórias'
                });
            }
            const updatedDomain = await DomainService.updateByUrl(oldUrl, newUrl);
            if (!updatedDomain) {
                return res.status(404).json({
                    success: false,
                    message: 'Domínio antigo não encontrado'
                });
            }
            res.json({
                success: true,
                data: updatedDomain
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    };

    static async deleteDomain(req: any, res: any) {
        const { id } = req.params;
        try {
            const deleted = await DomainService.delete(Number(id));
            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: 'Domínio não encontrado'
                });
            }
            res.json({
                success: true,
                message: 'Domínio deletado com sucesso'
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    };

    static async generateRpz(req: any, res: any) {
        try {
            const domains = await DomainService.getAll();
            await RpzZone.writeZoneFile(domains);
            
            // Enviar arquivo via SCP automaticamente
            const scpResult = await ScpService.sendRpzFile();
            
            res.json({
                success: true,
                message: 'Arquivo RPZ gerado com sucesso',
                scp: scpResult
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    };

    static async getScpStatus(req: any, res: any) {
        try {
            const status = ScpService.getScpStatus();
            res.json({
                success: true,
                status
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    };
}