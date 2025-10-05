# Dockerfile para o Frontend Web
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar package.json primeiro para aproveitar o cache
COPY package*.json ./
RUN npm install

# Copiar todos os arquivos do frontend
COPY . .

# Construir o projeto para produção
RUN npm run build

# Usar nginx para servir os arquivos estáticos
FROM nginx:alpine

# Copiar os arquivos construídos para o nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuração customizada do nginx se necessário
# COPY nginx.conf /etc/nginx/nginx.conf

# Expor a porta 80
EXPOSE 80

# O nginx já tem um CMD padrão, então não precisamos definir
