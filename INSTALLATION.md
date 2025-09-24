# Block DNS - Scripts de Instalação

Este projeto agora inclui scripts automatizados para instalação e gerenciamento completo.

## 📦 Arquivos Criados

| Arquivo | Descrição | Uso |
|---------|-----------|-----|
| `setup.sh` | **Instalação completa** - Configura tudo do zero | `./setup.sh` |
| `manage.sh` | **Gerenciamento interativo** - Menu com todas as operações | `./manage.sh` |
| `setup-access.sh` | **Reconfiguração de acesso** - Muda entre local/remoto | `./setup-access.sh` |
| `QUICK-START.md` | **Guia rápido** - Comandos essenciais | Para consulta |

## 🚀 Fluxo de Instalação

### 1. Primeira Instalação
```bash
./setup.sh
```
**O que faz:**
- ✅ Verifica Docker, Docker Compose, jq
- 🌐 Configura acesso (local ou remoto)  
- 🐳 Constrói e inicia containers
- 📊 Inicializa banco com dados
- 🧪 Testa funcionamento
- 📋 Mostra informações de acesso

### 2. Gerenciamento Diário
```bash
./manage.sh
```
**Menu interativo com:**
- 📊 Status dos containers
- 🔄 Reiniciar aplicação
- 🛑 Parar/Iniciar
- 📋 Ver logs em tempo real
- 🔧 Reconfigurar acesso
- 💾 Backup do banco
- 🗑️ Reset completo
- 📈 Estatísticas de uso

### 3. Reconfiguração de Acesso
```bash
./setup-access.sh
```
**Permite alternar entre:**
- 🏠 Acesso local (localhost)
- 🌐 Acesso remoto (IP da rede)

## 🎯 Casos de Uso

### Desenvolvimento Local
```bash
./setup.sh
# Escolher opção 1 (Local)
# Acessar: http://localhost
```

### Demonstração Remota
```bash
./setup.sh
# Escolher opção 2 (Remoto)
# Acessar de qualquer dispositivo na rede: http://[SEU-IP]
```

### Mudança de Configuração
```bash
./setup-access.sh
# Escolher nova configuração
# Containers são automaticamente reiniciados
```

### Manutenção e Monitoramento
```bash
./manage.sh
# Menu completo para todas as operações
```

## 📁 Estrutura de Arquivos

```
block-dns/
├── setup.sh              # 🚀 Instalação completa
├── manage.sh              # 🛠️ Gerenciamento interativo
├── setup-access.sh        # 🔧 Configuração de acesso
├── QUICK-START.md         # 📋 Guia rápido
├── .env                   # ⚙️ Variáveis de ambiente
├── docker-compose.yml     # 🐳 Configuração Docker
├── backend/
│   ├── init-db.sql       # 📊 Script de inicialização do banco
│   └── ...
├── front/
│   └── ...
└── install-info.txt      # 📄 Informações da última instalação
```

## 🆘 Solução de Problemas

### Script não executa
```bash
chmod +x setup.sh manage.sh setup-access.sh
```

### Containers não iniciam
```bash
./manage.sh
# Opção 7: Reset completo
./setup.sh
```

### Mudança de IP
```bash
./setup-access.sh
# Reconfigurar com novo IP
```

### Backup antes de alterações
```bash
./manage.sh
# Opção 8: Backup do banco
```

## ✅ Checklist de Instalação

- [ ] Docker e Docker Compose instalados
- [ ] Scripts com permissão de execução (`chmod +x`)
- [ ] Executar `./setup.sh`
- [ ] Testar acesso: http://localhost
- [ ] Login: admin / admin123
- [ ] Configurar acesso remoto se necessário

## 🎉 Resultado Final

Após executar `./setup.sh`, você terá:

- ✅ **Frontend**: Interface web responsiva
- ✅ **Backend**: API REST completa  
- ✅ **Banco**: PostgreSQL com dados iniciais
- ✅ **Segurança**: JWT, CORS configurado
- ✅ **Rede**: Acesso local ou remoto conforme escolhido
- ✅ **Monitoramento**: Scripts de gerenciamento
- ✅ **Backup**: Sistema de backup integrado
- ✅ **Logs**: Visualização em tempo real