import { config } from './environment';
import type { Domain } from '../types/domain.js';

const REDIRECT = config.REDIRECT;
const RPZ_PATH = config.DNS_RPZ_PATH;

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
        const fs = await import('fs').then(mod => mod.promises);
        const zoneFileContent = this.generateZoneFile(domains);
        await fs.writeFile(RPZ_PATH, zoneFileContent);
    }
}