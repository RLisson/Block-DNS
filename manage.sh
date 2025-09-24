#!/bin/bash

# ==========================================
# Block DNS - Script de Gerenciamento
# ==========================================

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Verificar se está no diretório correto
if [[ ! -f "docker-compose.yml" ]]; then
    error "Execute este script no diretório do Block DNS!"
    exit 1
fi

# Menu principal
show_menu() {
    echo -e "${BLUE}"
    cat << 'EOF'
 ____  _            _      ____  _   _ ____  
| __ )| | ___   ___| | __ |  _ \| \ | / ___| 
|  _ \| |/ _ \ / __| |/ / | | | |  \| \___ \ 
| |_) | | (_) | (__|   <  | |_| | |\  |___) |
|____/|_|\___/ \___|_|\_\ |____/|_| \_|____/ 

Gerenciamento do Sistema
EOF
    echo -e "${NC}"
    
    echo "Escolha uma opção:"
    echo "1) 📊 Status dos containers"
    echo "2) 🔄 Reiniciar aplicação"
    echo "3) 🛑 Parar aplicação"
    echo "4) 🚀 Iniciar aplicação"
    echo "5) 📋 Ver logs"
    echo "6) 🔧 Reconfigurar acesso"
    echo "7) 🗑️  Limpar dados (reset completo)"
    echo "8) 💾 Backup do banco de dados"
    echo "9) 📈 Estatísticas de uso"
    echo "0) 🚪 Sair"
    echo ""
    read -p "Digite sua escolha: " choice
}

# Status dos containers
show_status() {
    header "Status dos Containers"
    docker-compose ps
    
    echo -e "\n${BLUE}URLs de Acesso:${NC}"
    echo "• Local: http://localhost"
    
    # Tentar detectar IP para acesso remoto
    LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)
    if [[ -n "$LOCAL_IP" ]]; then
        echo "• Remoto: http://$LOCAL_IP"
    fi
    
    # Testar conectividade
    echo -e "\n${BLUE}Testes de Conectividade:${NC}"
    if curl -s -o /dev/null -w "%{http_code}" http://localhost | grep -q "200"; then
        echo "✅ Frontend: OK"
    else
        echo "❌ Frontend: Falha"
    fi
    
    if curl -s http://localhost/api/v1/auth/login -H "Content-Type: application/json" -d '{"test":true}' | grep -q "error"; then
        echo "✅ API: OK"
    else
        echo "❌ API: Falha"
    fi
}

# Reiniciar aplicação
restart_app() {
    header "Reiniciando Aplicação"
    log "Parando containers..."
    docker-compose down
    
    log "Iniciando containers..."
    docker-compose up -d
    
    log "Aguardando inicialização..."
    sleep 10
    
    log "✅ Aplicação reiniciada!"
}

# Parar aplicação
stop_app() {
    header "Parando Aplicação"
    docker-compose down
    log "✅ Aplicação parada!"
}

# Iniciar aplicação
start_app() {
    header "Iniciando Aplicação"
    docker-compose up -d
    
    log "Aguardando inicialização..."
    sleep 10
    
    log "✅ Aplicação iniciada!"
}

# Ver logs
show_logs() {
    header "Logs da Aplicação"
    echo "Escolha qual log visualizar:"
    echo "1) Todos os containers"
    echo "2) Frontend apenas"
    echo "3) Backend apenas"
    echo "4) Banco de dados apenas"
    echo ""
    read -p "Escolha: " log_choice
    
    case $log_choice in
        1) docker-compose logs -f --tail=50 ;;
        2) docker-compose logs -f --tail=50 frontend ;;
        3) docker-compose logs -f --tail=50 backend ;;
        4) docker-compose logs -f --tail=50 postgres ;;
        *) error "Opção inválida!" ;;
    esac
}

# Reconfigurar acesso
reconfigure_access() {
    header "Reconfiguração de Acesso"
    if [[ -f "setup-access.sh" ]]; then
        ./setup-access.sh
    else
        warn "Script setup-access.sh não encontrado"
        echo "Execute ./setup.sh para configuração completa"
    fi
}

# Reset completo
reset_app() {
    header "Reset Completo"
    warn "⚠️  ATENÇÃO: Isso irá apagar TODOS os dados!"
    read -p "Tem certeza? Digite 'CONFIRMO' para continuar: " confirm
    
    if [[ "$confirm" != "CONFIRMO" ]]; then
        log "Operação cancelada"
        return
    fi
    
    log "Parando e removendo containers..."
    docker-compose down --volumes --remove-orphans
    
    log "Removendo imagens..."
    docker-compose down --rmi all
    
    log "Limpando volumes..."
    docker volume prune -f
    
    log "✅ Reset completo realizado!"
    echo "Execute ./setup.sh para nova instalação"
}

# Backup do banco
backup_database() {
    header "Backup do Banco de Dados"
    
    BACKUP_FILE="backup_blockdns_$(date +%Y%m%d_%H%M%S).sql"
    
    log "Criando backup em: $BACKUP_FILE"
    
    if docker exec blockdns-postgres pg_dump -U blockdns_user block_dns > "$BACKUP_FILE"; then
        log "✅ Backup criado com sucesso!"
        echo "Arquivo: $BACKUP_FILE"
        echo "Tamanho: $(du -h "$BACKUP_FILE" | cut -f1)"
    else
        error "Falha ao criar backup!"
    fi
}

# Estatísticas de uso
show_stats() {
    header "Estatísticas de Uso"
    
    # Verificar se containers estão rodando
    if ! docker-compose ps | grep -q "Up"; then
        warn "Containers não estão rodando!"
        return
    fi
    
    # Estatísticas do banco
    echo -e "${BLUE}📊 Estatísticas do Banco:${NC}"
    USERS_COUNT=$(docker exec blockdns-postgres psql -U blockdns_user -d block_dns -t -c "SELECT COUNT(*) FROM users;" 2>/dev/null | xargs || echo "N/A")
    DOMAINS_COUNT=$(docker exec blockdns-postgres psql -U blockdns_user -d block_dns -t -c "SELECT COUNT(*) FROM domains;" 2>/dev/null | xargs || echo "N/A")
    
    echo "• Usuários cadastrados: $USERS_COUNT"
    echo "• Domínios bloqueados: $DOMAINS_COUNT"
    
    # Estatísticas dos containers
    echo -e "\n${BLUE}🐳 Estatísticas dos Containers:${NC}"
    docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}"
    
    # Uso de disco
    echo -e "\n${BLUE}💽 Uso de Disco:${NC}"
    docker system df
}

# Loop principal
while true; do
    show_menu
    case $choice in
        1) show_status ;;
        2) restart_app ;;
        3) stop_app ;;
        4) start_app ;;
        5) show_logs ;;
        6) reconfigure_access ;;
        7) reset_app ;;
        8) backup_database ;;
        9) show_stats ;;
        0) 
            log "Saindo..."
            exit 0
            ;;
        *)
            error "Opção inválida!"
            ;;
    esac
    
    echo ""
    read -p "Pressione Enter para continuar..."
done