-- Atualização da estrutura das tabelas existentes

-- Adicionar colunas faltantes na tabela domains
ALTER TABLE domains 
ADD COLUMN IF NOT EXISTS category VARCHAR(100),
ADD COLUMN IF NOT EXISTS added_by INTEGER REFERENCES users(id),
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Criar índices se não existirem
CREATE INDEX IF NOT EXISTS idx_domains_url ON domains(url);
CREATE INDEX IF NOT EXISTS idx_domains_category ON domains(category);

-- Inserir usuário padrão (admin/admin123)
-- Senha hash para 'admin123'
INSERT INTO users (username, email, password) 
VALUES ('admin', 'admin@blockdns.local', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi')
ON CONFLICT (username) DO NOTHING;

-- Inserir alguns domínios de exemplo
INSERT INTO domains (url, category, added_by) VALUES
    ('doubleclick.net', 'advertising', 1),
    ('googleadservices.com', 'advertising', 1),
    ('googlesyndication.com', 'advertising', 1),
    ('facebook.com', 'social', 1),
    ('instagram.com', 'social', 1)
ON CONFLICT (url) DO NOTHING;

-- Confirmar criação
SELECT 'Banco de dados inicializado com sucesso!' as status;