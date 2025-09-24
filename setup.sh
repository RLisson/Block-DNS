#!/bin/bash

# ==========================================
# Block DNS - Script de Instalação Completo
# ==========================================

set -e  # Para o script se houver erro

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log colorido
log() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

header() {
    echo -e "\n${BLUE}=== $1 ===${NC}\n"
}

# Banner inicial
echo -e "${BLUE}"
cat << 'EOF'
 ____  _            _      ____  _   _ ____  
| __ )| | ___   ___| | __ |  _ \| \ | / ___| 
|  _ \| |/ _ \ / __| |/ / | | | |  \| \___ \ 
| |_) | | (_) | (__|   <  | |_| | |\  |___) |
|____/|_|\___/ \___|_|\_\ |____/|_| \_|____/ 

Sistema de Bloqueio de DNS
Setup Automático - v1.0
EOF
echo -e "${NC}\n"

header "Verificando Pré-requisitos"

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    error "Docker não está instalado!"
    echo "Instale Docker Desktop em: https://www.docker.com/products/docker-desktop"
    exit 1
fi
log "✅ Docker encontrado: $(docker --version)"

# Verificar se Docker Compose está disponível
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    error "Docker Compose não está disponível!"
    exit 1
fi
log "✅ Docker Compose encontrado"

# Verificar se jq está instalado (para parsing JSON)
if ! command -v jq &> /dev/null; then
    warn "jq não encontrado. Instalando..."
    if command -v brew &> /dev/null; then
        brew install jq
    else
        error "Por favor, instale jq manualmente: https://stedolan.github.io/jq/"
        exit 1
    fi
fi
log "✅ jq encontrado"

header "Configuração de Rede"

# Detectar IP da máquina
LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)
if [[ -z "$LOCAL_IP" ]]; then
    error "Não foi possível detectar o IP da máquina!"
    exit 1
fi

log "🔍 IP detectado: $LOCAL_IP"

# Menu de configuração
echo ""
echo "Escolha o tipo de configuração:"
echo "1) 🏠 Acesso LOCAL apenas (localhost)"
echo "2) 🌐 Acesso REMOTO (rede local: $LOCAL_IP)"
echo "3) ⚙️  Configuração CUSTOMIZADA"
echo ""
read -p "Digite sua escolha (1, 2 ou 3): " access_choice

case $access_choice in
    1)
        log "Configurando para acesso LOCAL..."
        FRONTEND_API_URL="/api/v1"
        CORS_ORIGIN="http://localhost"
        ACCESS_TYPE="local"
        ;;
    2)
        log "Configurando para acesso REMOTO..."
        FRONTEND_API_URL="http://$LOCAL_IP/api/v1"
        CORS_ORIGIN="*"
        ACCESS_TYPE="remote"
        ;;
    3)
        echo ""
        read -p "Digite o IP/domínio para acesso (ex: $LOCAL_IP): " custom_ip
        FRONTEND_API_URL="http://$custom_ip/api/v1"
        CORS_ORIGIN="*"
        ACCESS_TYPE="custom"
        ;;
    *)
        error "Opção inválida!"
        exit 1
        ;;
esac

header "Configurando Variáveis de Ambiente"

# Atualizar arquivo .env
cat > .env << EOF
# Configurações gerais
COMPOSE_PROJECT_NAME=blockdns

# Database
POSTGRES_DB=block_dns
POSTGRES_USER=blockdns_user
POSTGRES_PASSWORD=blockdns_password123

# Backend
JWT_SECRET=jwt_secret_muito_seguro_docker_$(date +%s)
CORS_ORIGIN=$CORS_ORIGIN

# Frontend API URL
FRONTEND_API_URL=$FRONTEND_API_URL
EOF

log "✅ Arquivo .env configurado"

header "Parando Containers Existentes"

# Parar containers existentes (se houver)
if docker-compose ps | grep -q "blockdns"; then
    log "Parando containers existentes..."
    docker-compose down --volumes
fi

header "Construindo e Iniciando Aplicação"

log "🔨 Construindo imagens Docker..."
docker-compose build --no-cache

log "🚀 Iniciando containers..."
docker-compose up -d

# Aguardar containers ficarem prontos
log "⏳ Aguardando containers ficarem prontos..."
sleep 10

# Verificar se containers estão rodando
if ! docker-compose ps | grep -q "Up"; then
    error "Falha ao iniciar containers!"
    docker-compose logs
    exit 1
fi

header "Inicializando Banco de Dados"

log "📊 Criando estrutura do banco de dados..."

# Aguardar PostgreSQL estar pronto
log "Aguardando PostgreSQL..."
timeout=60
while ! docker exec blockdns-postgres pg_isready -U blockdns_user -d block_dns > /dev/null 2>&1; do
    timeout=$((timeout-1))
    if [ $timeout -eq 0 ]; then
        error "Timeout aguardando PostgreSQL!"
        exit 1
    fi
    sleep 1
done

# Executar script de inicialização do banco
log "Executando inicialização do banco..."
if [ -f "backend/init-db.sql" ]; then
    docker exec -i blockdns-postgres psql -U blockdns_user -d block_dns < backend/init-db.sql > /dev/null 2>&1
    log "✅ Banco de dados inicializado"
else
    warn "Arquivo init-db.sql não encontrado, criando estrutura básica..."
    
    # Criar usuário admin se o arquivo não existir
    docker exec blockdns-postgres psql -U blockdns_user -d block_dns -c "
        INSERT INTO users (username, email, password) 
        VALUES ('admin', 'admin@blockdns.local', '\$2b\$10\$eCHwVbtmzCyP2jOeyCMjw.sUXZlLzGbmYV40mhQK.vgU5r4724Wme')
        ON CONFLICT (username) DO NOTHING;
    " > /dev/null 2>&1 || true
fi

header "Testando Aplicação"

# Testar se a aplicação está respondendo
log "🧪 Testando frontend..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost | grep -q "200"; then
    log "✅ Frontend respondendo"
else
    error "Frontend não está respondendo!"
fi

# Testar API
log "🧪 Testando API..."
API_TEST=$(curl -s -X POST http://localhost/api/v1/auth/login \
    -H "Content-Type: application/json" \
    -d '{"username":"admin","password":"admin123"}' | jq -r '.authenticated' 2>/dev/null || echo "false")

if [[ "$API_TEST" == "true" ]]; then
    log "✅ API funcionando - Login de teste realizado com sucesso"
else
    warn "API pode não estar funcionando corretamente"
fi

header "Instalação Concluída"

echo -e "${GREEN}"
cat << 'EOF'
 ✅ INSTALAÇÃO CONCLUÍDA COM SUCESSO! 

 🌐 Acesso à Aplicação:
EOF

case $access_choice in
    1)
        echo -e "   Local: ${BLUE}http://localhost${NC}"
        ;;
    2)
        echo -e "   Local: ${BLUE}http://localhost${NC}"
        echo -e "   Remoto: ${BLUE}http://$LOCAL_IP${NC}"
        echo ""
        echo -e "   ${YELLOW}Para acesso remoto de outros dispositivos:${NC}"
        echo -e "   1. Conecte na mesma rede WiFi"
        echo -e "   2. Acesse: ${BLUE}http://$LOCAL_IP${NC}"
        ;;
    3)
        echo -e "   Configurado: ${BLUE}http://$custom_ip${NC}"
        ;;
esac

echo -e "${NC}"
echo " 🔐 Credenciais de Login:"
echo "   Usuário: admin"
echo "   Senha: admin123"
echo ""
echo " 📋 Comandos Úteis:"
echo "   Ver logs: docker-compose logs -f"
echo "   Parar: docker-compose down"
echo "   Reiniciar: docker-compose restart"
echo "   Reconfigurar: ./setup-access.sh"
echo ""
echo " 🛠️ Funcionalidades:"
echo "   ✓ Gerenciamento de domínios bloqueados"
echo "   ✓ Geração automática de arquivos RPZ"
echo "   ✓ Interface web responsiva"
echo "   ✓ API REST completa"
echo "   ✓ Autenticação JWT"
echo ""

# Salvar informações da instalação
cat > install-info.txt << EOF
Block DNS - Informações da Instalação
=====================================

Data da Instalação: $(date)
Tipo de Acesso: $ACCESS_TYPE
IP da Máquina: $LOCAL_IP
Frontend API URL: $FRONTEND_API_URL
CORS Origin: $CORS_ORIGIN

URLs de Acesso:
- Local: http://localhost
$(if [[ "$ACCESS_TYPE" == "remote" ]]; then echo "- Remoto: http://$LOCAL_IP"; fi)

Credenciais:
- Usuário: admin
- Senha: admin123

Containers:
$(docker-compose ps)
EOF

log "📄 Informações salvas em install-info.txt"

echo -e "${GREEN}🎉 Block DNS está pronto para uso!${NC}"
echo ""