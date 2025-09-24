#!/bin/bash

# Script para configurar acesso remoto ao Block DNS

# Obter IP da máquina
LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)

echo "🔍 IP da máquina detectado: $LOCAL_IP"
echo ""
echo "Escolha o tipo de acesso:"
echo "1) Acesso apenas local (localhost)"
echo "2) Acesso remoto (usando IP da rede: $LOCAL_IP)"
echo ""
read -p "Digite sua escolha (1 ou 2): " choice

case $choice in
    1)
        echo "Configurando para acesso local..."
        sed -i.bak 's|FRONTEND_API_URL=.*|FRONTEND_API_URL=/api/v1|' .env
        sed -i.bak 's|CORS_ORIGIN=.*|CORS_ORIGIN=http://localhost|' .env
        echo "✅ Configurado para acesso local"
        echo "📍 Acesse em: http://localhost"
        ;;
    2)
        echo "Configurando para acesso remoto..."
        sed -i.bak "s|FRONTEND_API_URL=.*|FRONTEND_API_URL=http://$LOCAL_IP/api/v1|" .env
        sed -i.bak 's|CORS_ORIGIN=.*|CORS_ORIGIN=*|' .env
        echo "✅ Configurado para acesso remoto"
        echo "📍 Acesse localmente em: http://localhost"
        echo "📍 Acesse remotamente em: http://$LOCAL_IP"
        ;;
    *)
        echo "❌ Opção inválida!"
        exit 1
        ;;
esac

echo ""
echo "🔄 Reiniciando containers..."
docker-compose down
docker-compose up -d --build

echo ""
echo "✅ Configuração concluída!"
echo ""
echo "Para testar o acesso remoto de outro dispositivo:"
echo "1. Conecte-se à mesma rede WiFi"
echo "2. Acesse: http://$LOCAL_IP"
echo "3. Use login: admin / admin123"