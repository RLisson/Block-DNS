#!/bin/bash
# Deploy Script para Block DNS

echo "🚀 Iniciando deploy do Block DNS..."

# Verificar se Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker não está rodando. Por favor, inicie o Docker Desktop."
    exit 1
fi

# Verificar se o arquivo .env existe
if [ ! -f ".env" ]; then
    echo "❌ Arquivo .env não encontrado. Criando arquivo de exemplo..."
    echo "Por favor, configure as variáveis em .env antes de continuar."
    exit 1
fi

# Parar containers existentes
echo "📦 Parando containers existentes..."
docker-compose down

# Limpar imagens antigas (opcional)
echo "🧹 Limpando imagens antigas..."
docker-compose down --rmi local --volumes --remove-orphans 2>/dev/null || true

# Fazer build das imagens
echo "🔨 Fazendo build das imagens..."
docker-compose build --no-cache

# Iniciar containers
echo "▶️ Iniciando containers..."
docker-compose up -d

# Aguardar containers iniciarem
echo "⏳ Aguardando containers iniciarem..."
sleep 15

# Verificar status
echo ""
echo "📊 Status dos containers:"
docker-compose ps

echo ""
echo "✅ Deploy concluído!"
echo ""
echo "🌐 Acessos:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:3001/api/v1"
echo "   Database: localhost:5432"
echo ""
echo "📝 Comandos úteis:"
echo "   Ver logs:     docker-compose logs -f"
echo "   Parar tudo:   docker-compose down"
echo "   Status:       docker-compose ps"
echo ""