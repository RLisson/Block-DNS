# Block DNS - Configuração Docker

Este diretório contém os arquivos necessários para executar o Block DNS usando Docker no macOS.

## 🚀 Início Rápido

1. **Instalar Docker**
2. **Configurar variáveis de ambiente**:
   ```bash
   cp .env.example .env
   # Editar .env com suas configurações
   ```
3. **Executar deploy**:
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

## 📁 Arquivos Docker

- `docker-compose.yml` - Configuração principal dos serviços
- `backend/Dockerfile` - Imagem do backend Node.js
- `front/Dockerfile` - Imagem do frontend React + Nginx
- `front/nginx.conf` - Configuração do Nginx
- `.env` - Variáveis de ambiente (não versionado)
- `.env.example` - Template das variáveis
- `deploy.sh` - Script de deploy completo
- `docker-manager.sh` - Script de gerenciamento

## 🌐 Acessos

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api/v1
- **PostgreSQL**: localhost:5432

## 🛠️ Comandos Úteis

```bash
# Deploy completo
./deploy.sh

# Gerenciamento
./docker-manager.sh start|stop|restart|logs|status

# Comandos diretos
docker-compose up -d          # Iniciar
docker-compose down           # Parar
docker-compose logs -f        # Ver logs
docker-compose ps             # Status
```

## 🔧 Troubleshooting

### Container não inicia
```bash
docker-compose logs backend
docker-compose logs frontend
```

### Banco não conecta
```bash
docker-compose logs postgres
docker exec -it blockdns-postgres psql -U blockdns_user -d block_dns
```

### Rebuild completo
```bash
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```