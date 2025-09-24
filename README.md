# Block DNS 🛡️

Sistema avançado de gerenciamento de domínios bloqueados para servidor DNS com interface web moderna e funcionalidades administrativas completas.

![License](https://img.shields.io/badge/license-ISC-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![PostgreSQL](https://img.shields.io/badge/postgresql-%3E%3D12.0-blue.svg)
![React](https://img.shields.io/badge/react-19-blue.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.0-blue.svg)

## 📋 Sobre o Projeto

O Block DNS é uma solução completa e moderna para gerenciamento de domínios bloqueados em servidores DNS. O sistema oferece uma interface web intuitiva com funcionalidades avançadas de administração, geração automática de arquivos de zona RPZ (Response Policy Zone) e sistema robusto de gerenciamento de usuários.

### ✨ Principais Funcionalidades

- 🔐 **Sistema de Autenticação Completo**: Login seguro com JWT e gerenciamento de sessões
- � **Gerenciamento Multi-usuário**: Criação, edição e administração de usuários
- 📝 **CRUD Avançado de Domínios**: Gerenciamento completo com busca e filtros
- 📄 **Paginação Inteligente**: Navegação eficiente em grandes conjuntos de dados
- 🗃️ **Geração Automática RPZ**: Criação de arquivos de zona DNS otimizados
- 🎨 **Interface Moderna**: Design responsivo com componentes customizados
- 🔄 **Atualizações em Tempo Real**: Interface reativa com feedback instantâneo
- 🛠️ **Painel de Configurações**: Gerenciamento centralizado de configurações do sistema
- 📊 **Dashboard Administrativo**: Visão geral e métricas do sistema
- 🔍 **Sistema de Busca**: Pesquisa rápida e eficiente de domínios

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
- **React Router v7** - Roteamento SPA avançado
- **Axios** - Cliente HTTP para comunicação com API
- **Context API** - Gerenciamento de estado global
- **Custom Hooks** - Lógica reutilizável e modular

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

## 🚀 Instalação Rápida

### Método 1: Setup Automático (Recomendado)

Execute o script de instalação que configura tudo automaticamente:

```bash
# Tornar executável (apenas na primeira vez)
chmod +x setup.sh

# Executar instalação
./setup.sh
```

O script irá:
- ✅ Verificar pré-requisitos (Docker, Docker Compose, jq)
- 🌐 Configurar acesso local ou remoto automaticamente
- 🐳 Construir e iniciar todos os containers
- 📊 Inicializar banco de dados com dados de exemplo
- 🧪 Testar funcionamento da aplicação
- 📋 Exibir informações de acesso

### Método 2: Docker Compose Manual

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/RLisson/Block-DNS.git
   cd Block-DNS
   ```

2. **Configure as variáveis de ambiente:**
   ```bash
   # O arquivo .env já está configurado, mas você pode editá-lo se necessário
   ```

3. **Execute com Docker Compose:**
   ```bash
   docker-compose up -d --build
   ```

4. **Inicialize o banco de dados:**
   ```bash
   docker exec -i blockdns-postgres psql -U blockdns_user -d block_dns < backend/init-db.sql
   ```

## 🛠️ Gerenciamento

### Script de Gerenciamento

Use o script interativo para gerenciar a aplicação:

```bash
./manage.sh
```

**Funcionalidades do script:**
- 📊 Ver status dos containers
- 🔄 Reiniciar aplicação
- 🛑 Parar/Iniciar aplicação
- 📋 Visualizar logs em tempo real
- 🔧 Reconfigurar acesso (local/remoto)
- 💾 Fazer backup do banco de dados
- 🗑️ Reset completo (apagar todos os dados)
- 📈 Estatísticas de uso

### Comandos Docker Úteis

```bash
# Ver status
docker-compose ps

# Ver logs
docker-compose logs -f

# Parar aplicação
docker-compose down

# Reiniciar
docker-compose restart

# Rebuild completo
docker-compose down --volumes
docker-compose up -d --build
```

## 🌐 Acesso à Aplicação

### URLs Padrão

**Após instalação com `./setup.sh`:**
- **Local:** http://localhost (porta 80)
- **Remoto:** http://[SEU-IP] (se configurado para acesso remoto)

**Credenciais padrão:**
- **Usuário:** admin
- **Senha:** admin123

### Configuração de Acesso

O script `setup.sh` oferece opções de configuração:

1. **🏠 Acesso Local:** Apenas `localhost`
2. **🌐 Acesso Remoto:** Disponível na rede local pelo IP da máquina
3. **⚙️ Configuração Customizada:** IP/domínio personalizado

Para **reconfigurar** o tipo de acesso:
```bash
./setup-access.sh
```

### Endpoints da API

Base URL: `/api/v1`

**Autenticação:**
- `POST /auth/login` - Login de usuário
- `POST /auth/register` - Registro de usuário

**Domínios:**
- `GET /domains` - Listar domínios (paginado)
- `POST /domains` - Adicionar domínio
- `PUT /domains/:id` - Atualizar domínio
- `DELETE /domains/:id` - Remover domínio
- `GET /domains/search?q=termo` - Buscar domínios
- `GET /domains/rpz` - Gerar arquivo RPZ

**Exemplo de uso da API:**
```bash
# Login
TOKEN=$(curl -s -X POST http://localhost/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' | jq -r '.token')

# Listar domínios
curl -H "Authorization: Bearer $TOKEN" http://localhost/api/v1/domains
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
- `POST /api/v1/auth/login` - Login do usuário
- `POST /api/v1/auth/register` - Registro de usuário
- `GET /api/v1/auth/me` - Informações do usuário autenticado
- `GET /api/v1/auth/getAll` - Lista todos os usuários
- `PATCH /api/v1/auth/update/:id` - Atualiza usuário
- `DELETE /api/v1/auth/delete/:id` - Remove usuário

### Domínios
- `GET /api/v1/domains` - Lista domínios (com paginação)
- `GET /api/v1/domains/search?q=termo` - Busca domínios
- `GET /api/v1/domains/:id` - Busca domínio por ID
- `POST /api/v1/domains` - Adiciona novo domínio
- `PUT /api/v1/domains/:id` - Atualiza domínio
- `DELETE /api/v1/domains/:id` - Remove domínio

### RPZ Zone
- `GET /api/v1/domains/rpz` - Gera arquivo de zona RPZ

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