# Dockerfile para o Gateway (Node.js)
FROM node:18-alpine

WORKDIR /app

# Copiar package.json primeiro para aproveitar o cache
COPY gateway-stub/package*.json ./
RUN npm install

# Criar diretório proto e copiar o arquivo proto
RUN mkdir -p ./proto
COPY proto/textprocessor.proto ./proto/

# Copiar o código do servidor
COPY gateway-stub/server.js .

# Expor a porta 4001
EXPOSE 4001

# Comando para iniciar o gateway
CMD ["node", "server.js"]
