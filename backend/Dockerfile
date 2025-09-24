FROM node:20-alpine

WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências (incluindo devDependencies para tsx)
RUN npm ci

# Copiar código fonte
COPY . .

# Criar diretório para arquivos RPZ
RUN mkdir -p /app/rpz

# Expor porta
EXPOSE 3001

# Comando para iniciar usando tsx diretamente
CMD ["npx", "tsx", "src/server.ts"]