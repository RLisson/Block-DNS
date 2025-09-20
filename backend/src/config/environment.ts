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
};

export default config;