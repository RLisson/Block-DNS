import { exec } from 'child_process';
import { promisify } from 'util';
import { config } from '../config/environment.js';

const execAsync = promisify(exec);

export class ScpService {
    
    static async sendRpzFile(): Promise<{ success: boolean; message: string }> {
        try {
            // Verificar se SCP está habilitado
            if (!config.SCP_ENABLED) {
                return {
                    success: false,
                    message: 'SCP está desabilitado (SCP_ENABLED=false)'
                };
            }

            // Verificar configurações obrigatórias
            if (!config.SCP_HOST || !config.SCP_USER) {
                return {
                    success: false,
                    message: 'Configurações SCP incompletas. Verifique SCP_HOST e SCP_USER'
                };
            }

            // Verificar se o arquivo RPZ existe
            const fs = await import('fs').then(mod => mod.promises);
            try {
                await fs.access(config.DNS_RPZ_PATH);
            } catch {
                return {
                    success: false,
                    message: `Arquivo RPZ não encontrado em ${config.DNS_RPZ_PATH}`
                };
            }

            console.log(`📡 Enviando arquivo RPZ para ${config.SCP_USER}@${config.SCP_HOST}:${config.SCP_PATH}`);

            // Comando SCP
            const scpCommand = `scp -i "${config.SCP_KEY}" -o ConnectTimeout=10 -o StrictHostKeyChecking=no "${config.DNS_RPZ_PATH}" "${config.SCP_USER}@${config.SCP_HOST}:${config.SCP_PATH}"`;
            
            try {
                const { stdout, stderr } = await execAsync(scpCommand);
                
                if (stderr && !stderr.includes('Warning')) {
                    console.error('SCP stderr:', stderr);
                }

                console.log('✅ Arquivo RPZ enviado com sucesso!');

                // Opcionalmente reiniciar o serviço BIND
                if (config.SCP_RESTART_BIND) {
                    await this.restartBindService();
                }

                return {
                    success: true,
                    message: 'Arquivo RPZ enviado com sucesso'
                };

            } catch (scpError: any) {
                console.error('Erro no SCP:', scpError);
                return {
                    success: false,
                    message: `Erro ao enviar arquivo via SCP: ${scpError.message}`
                };
            }

        } catch (error: any) {
            console.error('Erro geral no ScpService:', error);
            return {
                success: false,
                message: `Erro interno: ${error.message}`
            };
        }
    }

    private static async restartBindService(): Promise<void> {
        try {
            console.log('🔄 Tentando reiniciar serviço BIND na VM de destino...');
            
            const sshCommand = `ssh -i "${config.SCP_KEY}" -o ConnectTimeout=10 -o StrictHostKeyChecking=no "${config.SCP_USER}@${config.SCP_HOST}" "sudo systemctl reload bind9 || sudo systemctl reload named"`;
            
            const { stdout, stderr } = await execAsync(sshCommand);
            
            if (stderr && !stderr.includes('Warning')) {
                console.warn('SSH stderr (restart BIND):', stderr);
            }
            
            console.log('✅ Serviço BIND reiniciado com sucesso!');
            
        } catch (error: any) {
            console.warn('⚠️  Não foi possível reiniciar o BIND automaticamente:', error.message);
            console.warn('   Execute manualmente na VM de destino: sudo systemctl reload bind9');
        }
    }

    static getScpStatus(): { enabled: boolean; configured: boolean; config: any } {
        return {
            enabled: config.SCP_ENABLED,
            configured: !!(config.SCP_HOST && config.SCP_USER),
            config: {
                host: config.SCP_HOST,
                user: config.SCP_USER,
                path: config.SCP_PATH,
                restartBind: config.SCP_RESTART_BIND
            }
        };
    }
}