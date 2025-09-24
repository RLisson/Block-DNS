# Block DNS - Guia Rápido

## 🚀 Instalação em 1 Comando

```bash
./setup.sh
```

## 🔧 Gerenciamento

```bash
./manage.sh
```

## 📋 Comandos Essenciais

| Ação | Comando |
|------|---------|
| **Instalar tudo** | `./setup.sh` |
| **Gerenciar** | `./manage.sh` |
| **Ver status** | `docker-compose ps` |
| **Ver logs** | `docker-compose logs -f` |
| **Reiniciar** | `docker-compose restart` |
| **Parar** | `docker-compose down` |
| **Reset completo** | `./manage.sh` → opção 7 |

## 🌐 Acesso

- **Local:** http://localhost
- **Remoto:** http://[SEU-IP] (configurado durante setup)
- **Login:** admin / admin123

## 🆘 Problemas Comuns

### Container não inicia
```bash
docker-compose down
docker-compose up -d --build
```

### Erro de permissão
```bash
chmod +x setup.sh manage.sh setup-access.sh
```

### Resetar tudo
```bash
./manage.sh
# Escolher opção 7 (Reset completo)
./setup.sh
```

### Mudar de local para remoto
```bash
./setup-access.sh
# Escolher opção 2
```

## 📞 Suporte

1. Verifique os logs: `docker-compose logs -f`
2. Teste conectividade: `curl -I http://localhost`
3. Reinicie: `docker-compose restart`
4. Se persistir: Reset completo via `./manage.sh`