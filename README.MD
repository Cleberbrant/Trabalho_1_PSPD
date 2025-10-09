| Aluno                                | Matrícula |
| ------------------------------------ | --------- |
| Cleber de Oliveira Brant             | 200061216 |
| Matheus Ferreira Diogo               | 200024949 |
| Milena Beatriz Aires de Santana Dias | 190093625 |
| Sabrina Caldas Berno                 | 211029586 |

# PSPD - Sistema gRPC (Palavras / Caracteres)

## Objetivo Principal

O projeto implementa um sistema de processamento de texto distribuído que conta palavras e caracteres usando diferentes servidores, demonstrando conceitos de:

- Comunicação entre serviços (microserviços)
- Protocolo gRPC
- Arquitetura distribuída com múltiplas linguagens
- Proxy/Gateway para roteamento de requisições
- gRPC-Web para comunicação frontend-backend

Ambiente local: Ubuntu + Python (server A) + Go (server B) + Node (gateway + frontend) + Envoy (gRPC-Web).

# Existem duas formas de ambientação, local e utilizando Docker/Kubernetes

## Ambiente local

### 1. Instalar dependências base (Ubuntu), é necessário ter docker instalado(Para rodar envoy.yaml)

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

## Versão Kubernetes com ambiente Docker

### Pré-requisitos

- Docker instalado e funcionando (`docker ps` deve funcionar)
- kubectl instalado
- Cluster Kubernetes (minikube)

### Como Rodar

```bash
# 1. Iniciar cluster (escolha um)
minikube start

# 2. Buildar docker-files(Na raiz do projeto)
eval $(minikube docker-env)

docker build -t server-a-words:latest server-a-words
docker build -t server-b-chars:latest server-b-chars
docker build -t gateway-stub:latest -f gateway-stub/Dockerfile .
docker build -t frontend-web:latest frontend-web

# Deploy no Kubernetes
cd k8s
./deploy.sh

# 3. Acessar (em terminais separados)
kubectl port-forward -n grpc-textprocessor service/frontend-service 3000:80
kubectl port-forward -n grpc-textprocessor service/envoy-service 8080:8080

# 3.1 Verificar se tudo esta executando corretamente
cd k8s
./verify.sh

# 4. Abri link da aplicação
Frontend: http://localhost:3000

# 5. Ver logs dos pods:
kubectl logs -n grpc-textprocessor -l app=server-a -f --tail=50
kubectl logs -n grpc-textprocessor -l app=server-b -f --tail=50
kubectl logs -n grpc-textprocessor -l app=frontend -f --tail=50

```

### Como Parar

```bash
# Remover do Kubernetes
cd k8s
./cleanup.sh

# Parar cluster (opcional)
minikube stop
```

### O que é Criado

- **5 serviços** com 2 replicas cada (total: 10 pods)
- **Load balancers** automáticos
- **Service discovery** interno
- **Configurações** via ConfigMaps
