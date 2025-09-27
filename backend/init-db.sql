-- Script de inicialização do banco de dados Block DNS
-- Idempotente: pode ser executado múltiplas vezes com segurança

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(120) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS domains (
    id SERIAL PRIMARY KEY,
    url TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices auxiliares (criados somente se não existirem)
CREATE INDEX IF NOT EXISTS idx_domains_url ON domains (url);
CREATE INDEX IF NOT EXISTS idx_users_username ON users (username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);

-- Exibe o resultado básico
-- (psql -f init-db.sql mostrará essas saídas)
SELECT 'users count' AS metric, COUNT(*) AS value FROM users;
SELECT 'domains count' AS metric, COUNT(*) AS value FROM domains;
