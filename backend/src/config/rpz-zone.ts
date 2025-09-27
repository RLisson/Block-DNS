import { config } from './environment.js';
import type { Domain } from '../types/domain.js';

const REDIRECT = config.REDIRECT;
const RPZ_PATH = config.DNS_RPZ_PATH;

function validateConfig() {
    if (!RPZ_PATH) {
        throw new Error('DNS_RPZ_PATH não definido nas variáveis de ambiente');
    }
    if (!REDIRECT) {
        throw new Error('REDIRECT não definido nas variáveis de ambiente');
    }
}

export class RpzZone {
     static getDateSerial(): string {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        
        return `${year}${month}${day}`;
    }

    static generateZoneFile(domains: Domain[]): string {
        const header = `$TTL 1H
@       IN      SOA     LOCALHOST. ${REDIRECT}.${REDIRECT}. (
                        ${this.getDateSerial()}01 ; serial
                        1h         ; refresh (1 hour)
                        15m        ; retry (15 minutes)
                        30d        ; expire (30 days)
                        2h         ; minimum (2 hours)
                        )
                NS      ${REDIRECT}.
                `;

        const records = domains.map((domain) => {
            return `${domain.url}     IN CNAME .`;
        }).join('\n');

        return `${header}\n${records}`;
    }

    static async writeZoneFile(domains: Domain[]): Promise<void> {
        validateConfig();
        const fsPromises = await import('fs').then(mod => mod.promises);
        const path = await import('path');
        const zoneFileContent = this.generateZoneFile(domains);

        try {
            const dir = path.dirname(RPZ_PATH);
            // Garantir diretório
            await fsPromises.mkdir(dir, { recursive: true });
        } catch (err: any) {
            console.error('[RPZ] Erro ao garantir diretório:', err.message);
            throw err;
        }

        try {
            await fsPromises.writeFile(RPZ_PATH, zoneFileContent);
            console.log(`[RPZ] Arquivo escrito em ${RPZ_PATH} (${zoneFileContent.length} bytes)`);
        } catch (err: any) {
            console.error('[RPZ] Falha ao escrever arquivo RPZ:', err.message);
            throw new Error(`Falha ao escrever RPZ em ${RPZ_PATH}: ${err.message}`);
        }
    }
}