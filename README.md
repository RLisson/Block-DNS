# Block DNS 🛡️

Sistema de gerenciamento de domínios bloqueados para servidor DNS com interface web intuitiva.

![License](https://img.shields.io/badge/license-ISC-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![PostgreSQL](https://img.shields.io/badge/postgresql-%3E%3D12.0-blue.svg)

## 📋 Sobre o Projeto

O Block DNS é uma solução completa para gerenciamento de domínios bloqueados em servidores DNS. O sistema permite adicionar, editar, remover e visualizar domínios bloqueados através de uma interface web moderna, com geração automática de arquivos de zona RPZ (Response Policy Zone) para integração com servidores DNS como BIND.

### ✨ Principais Funcionalidades

- 🔐 **Autenticação e Autorização**: Sistema completo de login com JWT
- 📝 **Gerenciamento de Domínios**: CRUD completo para domínios bloqueados
- 📄 **Paginação Inteligente**: Navegação eficiente em grandes listas
- 🗃️ **Geração de Zona RPZ**: Criação automática de arquivos de zona DNS
- 📱 **Interface Responsiva**: Design moderno com Material-UI
- 🔄 **Atualizações em Tempo Real**: Interface dinâmica e reativa

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** + **TypeScript** - Runtime e tipagem
- **Express.js** - Framework web
- **PostgreSQL** - Banco de dados relacional
- **Passport.js** - Autenticação estratégica
- **JWT** - Tokens de autenticação
- **bcryptjs** - Criptografia de senhas
- **CORS** - Controle de acesso entre origens

### Frontend
- **React 19** + **TypeScript** - Biblioteca UI e tipagem
- **Vite** - Build tool moderna e rápida
- **Material-UI (MUI)** - Componentes e design system
- **Axios** - Cliente HTTP
- **React Router** - Roteamento SPA

### DevOps & Ferramentas
- **Concurrently** - Execução paralela de scripts
- **ESLint** - Linting e qualidade de código
- **Nodemon** - Hot reload para desenvolvimento
- **TSX** - Execução TypeScript

## 🗄️ Estrutura do Banco de Dados

### Tabela: `users`
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabela: `domains`
```sql
CREATE TABLE domains (
    id SERIAL PRIMARY KEY,
    url VARCHAR(255) UNIQUE NOT NULL
);
```

### Relacionamentos
- Cada usuário pode gerenciar múltiplos domínios
- Domínios são únicos no sistema

## 🚀 Instalação e Configuração

### Pré-requisitos
- Node.js >= 18.0.0
- PostgreSQL >= 12.0
- npm ou yarn

### 1. Clone o repositório
```bash
git clone https://github.com/RLisson/Block-DNS.git
cd Block-DNS
```

### 2. Instale as dependências
```bash
npm run install:all
```

### 3. Configuração do banco de dados
Crie um banco PostgreSQL e configure as variáveis de ambiente:

```bash
# backend/.env
# Servidor
PORT=3001
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=block_dns
DB_USER=seu_usuario
DB_PASSWORD=sua_senha

# API
API_VERSION=v1
CORS_ORIGIN=http://localhost:5173

# Autenticação
JWT_SECRET=seu_jwt_secret_muito_seguro

# DNS/RPZ
DNS_RPZ_PATH=/var/named/
REDIRECT=localhost
```

### 4. Configure o frontend
```bash
# front/.env
VITE_API_URL=http://localhost:3001
```

### 5. Inicie o projeto
```bash
# Desenvolvimento (backend + frontend)
npm run dev

# Ou separadamente:
npm run dev:backend   # Backend na porta 3001
npm run dev:frontend  # Frontend na porta 5173
```

## 📁 Estrutura do Projeto

```
block-dns/
├── backend/
│   ├── src/
│   │   ├── config/         # Configurações (DB, Auth, RPZ)
│   │   ├── controllers/    # Controladores da API
│   │   ├── middlewares/    # Middlewares (autenticação)
│   │   ├── models/         # Modelos de dados
│   │   ├── routes/         # Rotas da API
│   │   ├── services/       # Lógica de negócio
│   │   ├── types/          # Tipos TypeScript
│   │   └── utils/          # Utilitários
│   ├── db.rpz.zone        # Arquivo de zona RPZ gerado
│   └── package.json
├── front/
│   ├── src/
│   │   ├── auth/          # Autenticação
│   │   ├── components/    # Componentes React
│   │   ├── contexts/      # Contextos React
│   │   ├── hooks/         # Hooks customizados
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── services/      # Serviços API
│   │   └── types/         # Tipos TypeScript
│   └── package.json
└── package.json           # Scripts principais
```

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev                 # Inicia backend + frontend
npm run dev:backend        # Apenas backend
npm run dev:frontend       # Apenas frontend

# Produção
npm run start              # Inicia em produção
npm run build              # Build do frontend
npm run build:backend      # Build do backend

# Instalação
npm run install:all        # Instala todas as dependências
```

## 🌐 Endpoints da API

### Autenticação
- `POST /api/auth/login` - Login do usuário
- `POST /api/auth/register` - Registro de usuário

### Domínios
- `GET /api/domains` - Lista domínios (com paginação)
- `POST /api/domains` - Adiciona novo domínio
- `PUT /api/domains/:id` - Atualiza domínio
- `DELETE /api/domains/:id` - Remove domínio

### RPZ Zone
- `GET /api/domains/rpz` - Gera arquivo de zona RPZ

## 🔐 Autenticação

O sistema utiliza JWT (JSON Web Tokens) para autenticação. Todas as rotas de domínios são protegidas e requerem um token válido no header:

```
Authorization: Bearer <seu_jwt_token>
```

## 📊 Funcionalidades de DNS

O sistema gera automaticamente arquivos de zona RPZ compatíveis com servidores DNS como BIND, permitindo o bloqueio efetivo de domínios através de:

- Redirecionamento para localhost
- Geração automática de serial baseado em data
- Configuração TTL otimizada
- Suporte a wildcards e subdomínios

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request


## 👨‍💻 Autor

**RLisson** - [GitHub](https://github.com/RLisson)

---

<div align="center">
  <p>Feito com ❤️ para melhorar a segurança de redes</p>
  <p>⭐ Se este projeto foi útil, considere dar uma estrela!</p>
</div>