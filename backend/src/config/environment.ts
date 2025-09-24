import dotenv from 'dotenv';
import type { EnvironmentConfig, NodeEnv } from '../types/environment.js';

dotenv.config();

export const config: EnvironmentConfig = {
  // Servidor
  PORT: parseInt(process.env.PORT as string),
  NODE_ENV: (process.env.NODE_ENV as NodeEnv),
  
  // Database
  DB_HOST: process.env.DB_HOST as string,
  DB_PORT: parseInt(process.env.DB_PORT as string),
  DB_NAME: process.env.DB_NAME as string,
  DB_USER: process.env.DB_USER as string,
  DB_PASSWORD: process.env.DB_PASSWORD as string,

  // API
  API_VERSION: process.env.API_VERSION as string,
  CORS_ORIGIN: process.env.CORS_ORIGIN as string,

  // JWT (para futuras implementações)
  JWT_SECRET: process.env.JWT_SECRET as string,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN as string,

  // DNS Server RPZ
  DNS_RPZ_PATH: process.env.DNS_RPZ_PATH as string,
  REDIRECT: process.env.REDIRECT as string,

  // SCP Configuration
  SCP_ENABLED: process.env.SCP_ENABLED === 'true',
  SCP_HOST: process.env.SCP_HOST || '',
  SCP_USER: process.env.SCP_USER || '',
  SCP_PATH: process.env.SCP_PATH || '/etc/bind/rpz.db',
  SCP_KEY: process.env.SCP_KEY || '~/.ssh/id_rsa',
  SCP_RESTART_BIND: process.env.SCP_RESTART_BIND === 'true',
};

export default config;