#!/bin/bash
# Script de gerenciamento para Block DNS

case "$1" in
    start)
        echo "🚀 Iniciando Block DNS..."
        docker-compose up -d
        ;;
    stop)
        echo "⏹️ Parando Block DNS..."
        docker-compose down
        ;;
    restart)
        echo "🔄 Reiniciando Block DNS..."
        docker-compose down
        docker-compose up -d
        ;;
    logs)
        echo "📜 Mostrando logs..."
        docker-compose logs -f
        ;;
    status)
        echo "📊 Status dos containers:"
        docker-compose ps
        ;;
    rebuild)
        echo "🔨 Reconstruindo e reiniciando..."
        docker-compose down
        docker-compose build --no-cache
        docker-compose up -d
        ;;
    clean)
        echo "🧹 Limpando containers e volumes..."
        docker-compose down -v --rmi all --remove-orphans
        ;;
    backup)
        echo "💾 Fazendo backup do banco..."
        mkdir -p backups
        docker exec blockdns-postgres pg_dump -U blockdns_user block_dns > backups/backup_$(date +%Y%m%d_%H%M%S).sql
        echo "Backup salvo em backups/"
        ;;
    *)
        echo "Block DNS - Gerenciador Docker"
        echo ""
        echo "Uso: $0 {start|stop|restart|logs|status|rebuild|clean|backup}"
        echo ""
        echo "Comandos:"
        echo "  start   - Inicia os containers"
        echo "  stop    - Para os containers"
        echo "  restart - Reinicia os containers"
        echo "  logs    - Mostra logs em tempo real"
        echo "  status  - Mostra status dos containers"
        echo "  rebuild - Reconstrói e reinicia tudo"
        echo "  clean   - Remove tudo (containers, volumes, imagens)"
        echo "  backup  - Faz backup do banco de dados"
        echo ""
        exit 1
        ;;
esac