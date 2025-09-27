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
            const scpCommand = `scp -i "${config.SCP_KEY}" -o PubkeyAcceptedAlgorithms=+ssh-rsa -o ConnectTimeout=10 -o StrictHostKeyChecking=no "${config.DNS_RPZ_PATH}" "${config.SCP_USER}@${config.SCP_HOST}:${config.SCP_PATH}"`;
            
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

    private static async restartBindService(): Promise<boolean> {
        try {
            console.log('🔄 Tentando reiniciar serviço BIND na VM de destino...');
            
            const sshCommand = `ssh -i "${config.SCP_KEY}" -o ConnectTimeout=10 -o StrictHostKeyChecking=no "${config.SCP_USER}@${config.SCP_HOST}" "sudo service bind9 restart"`;
            
            const { stdout, stderr } = await execAsync(sshCommand);
            
            if (stderr && !stderr.includes('Warning')) {
                console.warn('SSH stderr (restart BIND):', stderr);
                return false;
            }
            
            console.log('✅ Serviço BIND reiniciado com sucesso!');
            return true;
            
        } catch (error: any) {
            console.warn('⚠️  Não foi possível reiniciar o BIND automaticamente:', error.message);
            console.warn('   Execute manualmente na VM de destino: sudo systemctl reload bind9');
            return false;
        }
    }

    static async getScpStatus(): Promise<{ enabled: boolean; configured: boolean; config: any; sshConnection?: any }> {
        const basicStatus = {
            enabled: config.SCP_ENABLED,
            configured: !!(config.SCP_HOST && config.SCP_USER),
            config: {
                host: config.SCP_HOST,
                user: config.SCP_USER,
                path: config.SCP_PATH,
                restartBind: config.SCP_RESTART_BIND,
            },
        };

        // Se SCP não estiver habilitado ou configurado, não testar conexão
        if (!basicStatus.enabled || !basicStatus.configured) {
            return {
                ...basicStatus,
                sshConnection: {
                    tested: false,
                    reason: !basicStatus.enabled ? 'SCP desabilitado' : 'SCP não configurado'
                }
            };
        }

        // Testar conectividade SSH
        const sshConnection = await this.testSshConnection();
        
        return {
            ...basicStatus,
            sshConnection
        };
    }

    private static async testSshConnection(): Promise<{ tested: boolean; success: boolean; message: string; responseTime?: number; error?: string }> {
        try {
            const startTime = Date.now();
            
            // Comando SSH simples para testar conectividade
            const sshCommand = `ssh -i "${config.SCP_KEY}" -o ConnectTimeout=10 -o StrictHostKeyChecking=no -o BatchMode=yes "${config.SCP_USER}@${config.SCP_HOST}" "echo 'SSH_TEST_OK'"`;
            
            const { stdout, stderr } = await execAsync(sshCommand);
            const responseTime = Date.now() - startTime;
            
            if (stdout.trim() === 'SSH_TEST_OK') {
                return {
                    tested: true,
                    success: true,
                    message: 'Conexão SSH funcionando corretamente',
                    responseTime
                };
            } else {
                return {
                    tested: true,
                    success: false,
                    message: 'Resposta SSH inesperada',
                    responseTime,
                    error: `Esperado: 'SSH_TEST_OK', Recebido: '${stdout.trim()}'`
                };
            }
            
        } catch (error: any) {
            let errorMessage = 'Erro de conexão SSH';
            
            // Categorizar diferentes tipos de erro SSH
            if (error.message.includes('Connection timed out') || error.message.includes('timeout')) {
                errorMessage = 'Timeout de conexão - Host inacessível';
            } else if (error.message.includes('Permission denied') || error.message.includes('publickey')) {
                errorMessage = 'Autenticação falhou - Verifique a chave SSH';
            } else if (error.message.includes('Host key verification failed')) {
                errorMessage = 'Verificação de host falhou';
            } else if (error.message.includes('No such file or directory')) {
                errorMessage = 'Chave SSH não encontrada';
            } else if (error.message.includes('Connection refused')) {
                errorMessage = 'Conexão recusada - Serviço SSH indisponível';
            } else if (error.message.includes('Name or service not known')) {
                errorMessage = 'Host não encontrado - Verifique o endereço';
            }
            
            return {
                tested: true,
                success: false,
                message: errorMessage,
                error: error.message
            };
        }
    }
}