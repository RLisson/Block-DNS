# SCP Integration - Envio Automático de Arquivo RPZ

Esta funcionalidade permite que o arquivo RPZ seja enviado automaticamente via SCP para outra VM Linux sempre que a função `generateRpz` for chamada.

## Configuração

### 1. Variáveis de Ambiente

Adicione as seguintes variáveis ao seu arquivo `.env`:

```bash
# Habilitar SCP automático
SCP_ENABLED=true

# Configurações da VM de destino
SCP_HOST=192.168.1.100
SCP_USER=bind-user
SCP_PATH=/etc/bind/rpz.db
SCP_KEY=~/.ssh/id_rsa
SCP_RESTART_BIND=true
```

### 2. Configuração SSH

Certifique-se de que:
- A chave SSH está configurada e tem acesso à VM de destino
- O usuário tem permissão para escrever no caminho especificado
- Se `SCP_RESTART_BIND=true`, o usuário deve ter permissão sudo para reiniciar o BIND

## Como Funciona

### Fluxo Automático

1. **API Call**: `GET /api/v1/domains/rpz`
2. **Geração**: O arquivo RPZ é gerado com os domínios atuais
3. **Envio SCP**: O arquivo é automaticamente enviado para a VM de destino
4. **Restart BIND**: Opcionalmente reinicia o serviço BIND na VM

### Resposta da API

```json
{
  "success": true,
  "message": "Arquivo RPZ gerado com sucesso",
  "scp": {
    "success": true,
    "message": "Arquivo RPZ enviado com sucesso"
  }
}
```

## Endpoints Adicionais

### Verificar Status SCP

```bash
GET /api/v1/domains/scp/status
```

Retorna:
```json
{
  "success": true,
  "status": {
    "enabled": true,
    "configured": true,
    "config": {
      "host": "192.168.1.100",
      "user": "bind-user", 
      "path": "/etc/bind/rpz.db",
      "restartBind": true
    }
  }
}
```

## Cenários de Uso

### 1. Frontend Automático
Quando o usuário adiciona/remove domínios no frontend, a API `generateRpz` é chamada e o arquivo é automaticamente enviado.

### 2. Via cURL Manual
```bash
curl -X GET http://localhost:3001/api/v1/domains/rpz \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 3. Script Automatizado
```bash
#!/bin/bash
# Gerar e enviar RPZ
curl -s -X GET "http://localhost:3001/api/v1/domains/rpz" \
  -H "Authorization: Bearer $API_TOKEN" | jq
```

## Troubleshooting

### SCP Desabilitado
```json
{
  "scp": {
    "success": false,
    "message": "SCP está desabilitado (SCP_ENABLED=false)"
  }
}
```

### Configuração Incompleta
```json
{
  "scp": {
    "success": false, 
    "message": "Configurações SCP incompletas. Verifique SCP_HOST e SCP_USER"
  }
}
```

### Erro de Conexão
```json
{
  "scp": {
    "success": false,
    "message": "Erro ao enviar arquivo via SCP: Connection refused"
  }
}
```

## Logs

O serviço SCP gera logs detalhados no console:

```
📡 Enviando arquivo RPZ para bind-user@192.168.1.100:/etc/bind/rpz.db
✅ Arquivo RPZ enviado com sucesso!
🔄 Tentando reiniciar serviço BIND na VM de destino...
✅ Serviço BIND reiniciado com sucesso!
```

## Segurança

- Use chaves SSH em vez de senhas
- Configure `StrictHostKeyChecking=no` apenas em ambientes controlados
- Limite as permissões do usuário SSH na VM de destino
- Use timeout de conexão para evitar travamentos