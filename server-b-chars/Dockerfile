# Dockerfile para o Servidor B (Go - CountCharacters)
FROM golang:1.23-alpine AS builder

WORKDIR /app

# Copiar go.mod e go.sum primeiro para aproveitar o cache
COPY go.mod go.sum ./
RUN go mod download

# Copiar o código fonte
COPY . .

# Construir o binário
RUN CGO_ENABLED=0 GOOS=linux go build -o server-b-chars .

# Imagem final
FROM alpine:latest

RUN apk --no-cache add ca-certificates
WORKDIR /root/

# Copiar o binário da imagem de build
COPY --from=builder /app/server-b-chars .

# Expor a porta 50052
EXPOSE 50052

# Comando para iniciar o servidor
CMD ["./server-b-chars"]
