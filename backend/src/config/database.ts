import { Pool, PoolClient } from 'pg';
import dotenv from 'dotenv';
import type { DatabaseConfig, QueryResult } from '../types/domain.js';
import type { DatabaseConnection } from '../types/database.js';

dotenv.config();

// Configuração da pool de conexões PostgreSQL
const databaseConfig: DatabaseConfig = {
  user: process.env.DB_USER as string,
  host: process.env.DB_HOST as string,
  database: process.env.DB_NAME as string,
  password: process.env.DB_PASSWORD as string,
  port: parseInt(process.env.DB_PORT as string),
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

const pool = new Pool(databaseConfig);

// Teste de conexão
pool.on('connect', () => {
  console.log('✅ Conectado ao PostgreSQL');
});

pool.on('error', (err: Error) => {
  console.error('❌ Erro na pool PostgreSQL:', err);
  process.exit(-1);
});

// Função para executar queries
export const query = async <T = any>(
  text: string, 
  params?: any[]
): Promise<QueryResult<T>> => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('📊 Query executada:', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    throw error;
  }
};

// Função para transações
export const getClient = async (): Promise<PoolClient> => {
  const client: PoolClient = await pool.connect();
  
  // Adicionar logging simples
  const originalRelease = client.release.bind(client);
  (client as any).release = () => {
    console.log('🔓 Cliente PostgreSQL liberado');
    return originalRelease();
  };
  
  return client;
};

export default pool;