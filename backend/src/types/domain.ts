export interface Domain {
  id: number;
  url: string;
  is_blocked: boolean;
  created_at: Date;
  updated_at?: Date;
}

export interface CreateDomainInput {
  url: string;
}

export interface UpdateDomainInput {
  url: string;
}

export interface DomainQueryResult {
  id: number;
  url: string;
  is_blocked: boolean;
  created_at: string; // PostgreSQL retorna como string
  updated_at?: string;
}

export interface DatabaseConfig {
  user: string;
  host: string;
  database: string;
  password: string;
  port: number;
  max?: number;
  idleTimeoutMillis?: number;
  connectionTimeoutMillis?: number;
}

export interface QueryResult<T = any> {
  rows: T[];
  rowCount: number | null;
  command: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: keyof Domain;
  sortOrder?: 'ASC' | 'DESC';
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}