import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import os from 'os';
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

            // Resolver caminho da chave (expandir ~) e validar existência
            const expandedKeyPath = expandHome(config.SCP_KEY);
            try {
                await fs.access(expandedKeyPath);
            } catch {
                return {
                    success: false,
                    message: `Chave SSH não encontrada em ${expandedKeyPath}. Verifique SCP_KEY.`
                };
            }

            const baseOptions = '-o PubkeyAcceptedAlgorithms=+ssh-rsa -o ConnectTimeout=10 -o StrictHostKeyChecking=no';

            console.log(`📡 Enviando arquivo RPZ para ${config.SCP_USER}@${config.SCP_HOST}:${config.SCP_PATH}`);
            console.log(`🔑 Usando chave: ${expandedKeyPath}`);

            // Comando SCP (usar caminho expandido)
            const scpCommand = `scp -i "${expandedKeyPath}" ${baseOptions} "${config.DNS_RPZ_PATH}" "${config.SCP_USER}@${config.SCP_HOST}:${config.SCP_PATH}"`;
            
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
                const rawMessage = scpError?.message || '';
                let userMessage = 'Erro ao enviar arquivo via SCP';
                if (rawMessage.includes('Permission denied (publickey')) {
                    userMessage = 'Falha de autenticação (publickey). Verifique se a chave privada corresponde à chave pública autorizada no servidor.';
                } else if (rawMessage.includes('No such file')) {
                    userMessage = 'Arquivo de origem ou destino inválido.';
                } else if (rawMessage.includes('Connection timed out')) {
                    userMessage = 'Timeout de conexão com o host remoto.';
                }
                console.error('Erro no SCP:', rawMessage);
                return {
                    success: false,
                    message: `${userMessage}: ${rawMessage}`
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
            
            const expandedKeyPath = expandHome(config.SCP_KEY);
            const baseOptions = '-o PubkeyAcceptedAlgorithms=+ssh-rsa -o ConnectTimeout=10 -o StrictHostKeyChecking=no';
            const sshCommand = `ssh -i "${expandedKeyPath}" ${baseOptions} "${config.SCP_USER}@${config.SCP_HOST}" "sudo service bind9 restart"`;
            
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
            const expandedKeyPath = expandHome(config.SCP_KEY);
            const baseOptions = '-o PubkeyAcceptedAlgorithms=+ssh-rsa -o ConnectTimeout=10 -o StrictHostKeyChecking=no -o BatchMode=yes';
            const sshCommand = `ssh -i "${expandedKeyPath}" ${baseOptions} "${config.SCP_USER}@${config.SCP_HOST}" "echo 'SSH_TEST_OK'"`;
            
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

// Utilitário para expandir ~ no caminho de arquivo
function expandHome(filePath: string): string {
    if (!filePath) return filePath;
    if (filePath.startsWith('~')) {
        return path.join(os.homedir(), filePath.slice(1));
    }
    return filePath;
}