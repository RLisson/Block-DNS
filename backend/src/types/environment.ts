export interface EnvironmentConfig {
  PORT: number;
  NODE_ENV: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_NAME: string;
  DB_USER: string;
  DB_PASSWORD: string;
  API_VERSION: string;
  CORS_ORIGIN: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  DNS_RPZ_PATH: string;
  REDIRECT: string;
  SCP_ENABLED: boolean;
  SCP_HOST: string;
  SCP_USER: string;
  SCP_PATH: string;
  SCP_KEY: string;
  SCP_RESTART_BIND: boolean;
}


export type NodeEnv = 'development' | 'production' | 'test';