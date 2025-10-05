# PSPD - Sistema gRPC (Palavras / Caracteres)

## Objetivo Principal

O projeto implementa um sistema de processamento de texto distribuído que conta palavras e caracteres usando diferentes servidores, demonstrando conceitos de:
- Comunicação entre serviços (microserviços)
- Protocolo gRPC com diferentes tipos de streaming
- Arquitetura distribuída com múltiplas linguagens 
- Proxy/Gateway para roteamento de requisições 
- gRPC-Web para comunicação frontend-backend

Ambiente local: Ubuntu + Python (server A) + Go (server B) + Node (gateway + frontend) + Envoy (gRPC-Web).

## 1. Instalar dependências base (Ubuntu), é necessário ter docker instalado(Para rodar envoy.yaml)

```bash
sudo apt update
sudo apt install -y python3 python3-venv python3-pip golang-go nodejs npm docker.io curl
```

Verificar versões:

```bash
python3 --version
go version
node -v
npm -v
docker --version
```

## 2. Clonar o projeto

```bash
git clone <URL_DO_REPOSITORIO>
cd Trabalho_1_PSPD
```

## 3. Servidor A (Python - CountWords)

```bash
cd server-a-words
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python main.py
# Rode em um terminal separado
```

Porta: 50051

## 4. Servidor B (Go - CountCharacters)

```bash
cd server-b-chars
go mod tidy
go run .
# Rode em um terminal separado
```

Porta: 50052

## 5. Gateway (Node gRPC - porta 4001)

```bash
cd gateway-stub
npm install
node server.js
# Rode em um terminal separado
```

Porta: 4001 (encaminha CountWords -> server A, CountCharacters -> server B)

## 6. Envoy (gRPC-Web -> gRPC)

Na raiz do projeto:

```bash
cd ..  # garantir que está em Trabalho_1_PSPD
docker rm -f envoy || true
docker run -d --name envoy \
  --network host \
  -v "$(pwd)/envoy.yaml":/etc/envoy/envoy.yaml:ro \
  envoyproxy/envoy:v1.29-latest
  # Rode em um terminal separado
```

Portas:

- 8080 (gRPC-Web)
- 9901 (Admin)

Teste CORS (deve retornar 204):

```bash
curl -i -X OPTIONS 'http://localhost:8080/textprocessor.TextProcessor/CountWords' \
  -H 'Origin: http://localhost:3000' \
  -H 'Access-Control-Request-Method: POST' \
  -H 'Access-Control-Request-Headers: content-type,x-grpc-web,x-user-agent'
```

## 7. Frontend (porta 3000)

Em outro terminal:

```bash
cd frontend-web
npm install
npm run dev
```

Abrir: http://localhost:3000  
Endpoint gRPC-Web no campo: http://localhost:8080  
Digite algum texto
Clicar “ANALISAR VIA GRPC”.

## 8. Testes diretos (opcional)

gRPC direto (sem Envoy) com grpcurl (instale se quiser):

```bash
# CountWords
grpcurl -plaintext -d '{"text":"um dois tres"}' localhost:50051 textprocessor.TextProcessor/CountWords
# CountCharacters
grpcurl -plaintext -d '{"text":"abc xyz"}' localhost:50052 textprocessor.TextProcessor/CountCharacters
# Listar métodos via gateway
grpcurl -plaintext localhost:4001 list textprocessor.TextProcessor
```

## 10. Estrutura de portas (resumo)

| Componente        | Porta | Protocolo |
| ----------------- | ----- | --------- |
| server-a (Python) | 50051 | gRPC      |
| server-b (Go)     | 50052 | gRPC      |
| gateway (Node)    | 4001  | gRPC      |
| Envoy             | 8080  | gRPC-Web  |
| Frontend dev      | 3000  | HTTP      |

## 11. Encerrar tudo

```bash
docker stop envoy
pkill -f server.js || true
pkill -f main.py || true
pkill -f server-b-chars || true
```

Se usar venv:

```bash
deactivate
```

## 12. ✨ Versão Kubernetes (NOVA!)

Para rodar o sistema completo no Kubernetes com alta disponibilidade:

### Pré-requisitos Kubernetes
- Docker instalado
- kubectl instalado  
- kind ou minikube para cluster local

### Deploy Kubernetes
```bash
# 1. Criar cluster kind (se não tiver um)
kind create cluster --name grpc-cluster

# 2. Construir e deployar
cd k8s
./build-images.sh  # Constrói todas as imagens Docker
./deploy.sh        # Faz deploy no Kubernetes

# 3. Acessar a aplicação
# Frontend: http://localhost:3000
# gRPC-Web: http://localhost:8080
```

### Status do Deploy Kubernetes
- ✅ **Server A** (Python): 2 replicas - Contador de palavras
- ✅ **Server B** (Go): 2 replicas - Contador de caracteres  
- ✅ **Gateway** (Node.js): 2 replicas - Roteamento gRPC
- ✅ **Envoy Proxy**: 2 replicas - gRPC-Web bridge
- ✅ **Frontend Web**: 2 replicas - Interface do usuário

🎯 **Vantagens da versão Kubernetes:**
- **Alta disponibilidade** com múltiplas replicas
- **Service discovery** automático
- **Load balancing** nativo
- **Health checks** configurados
- **Scaling** horizontal automático
- **Configuração via ConfigMaps**

Veja `k8s/README-KUBERNETES.md` para detalhes completos!
