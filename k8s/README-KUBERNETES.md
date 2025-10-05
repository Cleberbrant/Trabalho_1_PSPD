# PSPD - Sistema gRPC no Kubernetes

## ✅ Status do Deploy

**🎉 IMPLEMENTAÇÃO KUBERNETES COMPLETA E FUNCIONAL!**

O sistema gRPC foi successfully deployado no Kubernetes com todos os componentes funcionando:

- ✅ Server A (Python - CountWords): 2 replicas 
- ✅ Server B (Go - CountCharacters): 2 replicas
- ✅ Gateway (Node.js): 2 replicas 
- ✅ Envoy Proxy (gRPC-Web): 2 replicas
- ✅ Frontend Web: 2 replicas

## 🚀 Como Testar Agora

### 1. Acessar o Frontend
```bash
# O frontend está rodando em:
http://localhost:3000
```

### 2. Verificar os Serviços
```bash
# Status dos pods
kubectl get pods -n grpc-textprocessor

# Status dos services
kubectl get services -n grpc-textprocessor
```

### 3. Usar a Aplicação
1. Abra http://localhost:3000 no navegador
2. Digite um texto qualquer
3. Clique em "📊 ANALISAR VIA gRPC"
4. Veja os resultados:
   - **Palavras**: Processado pelo Server A (Python)
   - **Caracteres**: Processado pelo Server B (Go)

## 🏗️ Arquitetura no Kubernetes

```
Frontend (nginx) ──HTTP──► Envoy (gRPC-Web) ──gRPC──► Gateway ──┬──► Server A (Python)
    ↑                          ↑                          ↑     └──► Server B (Go)
    │                          │                          │
 Port 3000                 Port 8080                 Port 4001
```

Todos os componentes estão rodando como Deployments com 2 replicas para alta disponibilidade.

## 📁 Estrutura dos Arquivos Kubernetes

```
k8s/
├── 00-namespace-configmap.yaml    # Namespace e ConfigMaps
├── 01-server-a.yaml              # Deployment + Service do Server A
├── 02-server-b.yaml              # Deployment + Service do Server B  
├── 03-gateway.yaml               # Deployment + Service do Gateway
├── 04-envoy.yaml                 # ConfigMap + Deployment + Service do Envoy
├── 05-frontend.yaml              # Deployment + Service do Frontend
├── build-images.sh               # Script para build das imagens Docker
├── deploy.sh                     # Script para deploy no Kubernetes
└── cleanup.sh                    # Script para limpeza dos recursos
```

## 🔧 Scripts Úteis

### Build das Imagens
```bash
cd k8s
./build-images.sh
```

### Deploy no Kubernetes
```bash
cd k8s  
./deploy.sh
```

### Limpeza dos Recursos
```bash
cd k8s
./cleanup.sh
```

### Port Forwards (já configurados)
```bash
# Frontend (já ativo)
kubectl port-forward -n grpc-textprocessor service/frontend-service 3000:80 &

# Envoy gRPC-Web (já ativo) 
kubectl port-forward -n grpc-textprocessor service/envoy-service 8080:8080 &

# Gateway direto (opcional)
kubectl port-forward -n grpc-textprocessor service/gateway-service 4001:4001 &
```

## 🔍 Debugging

### Ver logs dos serviços
```bash
# Logs do Server A
kubectl logs -n grpc-textprocessor deployment/server-a-deployment

# Logs do Server B  
kubectl logs -n grpc-textprocessor deployment/server-b-deployment

# Logs do Gateway
kubectl logs -n grpc-textprocessor deployment/gateway-deployment

# Logs do Envoy
kubectl logs -n grpc-textprocessor deployment/envoy-deployment
```

### Testar conectividade interna
```bash
# Exec em um pod para testar conectividade
kubectl exec -it -n grpc-textprocessor deployment/gateway-deployment -- sh

# Dentro do pod, testar conexões:
# nc -zv server-a-service 50051
# nc -zv server-b-service 50052
```

## 🎯 Recursos Configurados

- **Recursos de CPU/Memory**: Definidos para todos os pods
- **Health Checks**: Liveness e Readiness probes configurados
- **High Availability**: 2 replicas de cada serviço
- **Service Discovery**: Services com ClusterIP para comunicação interna
- **Load Balancing**: Services distribuem carga entre replicas
- **Configuration**: ConfigMaps para variáveis de ambiente

## 📊 Monitoramento

```bash
# CPU e Memory usage
kubectl top pods -n grpc-textprocessor

# Events do namespace
kubectl get events -n grpc-textprocessor --sort-by='.lastTimestamp'

# Describe de recursos específicos
kubectl describe pod -n grpc-textprocessor <pod-name>
```

---

**🎉 Parabéns! O sistema gRPC está rodando perfeitamente no Kubernetes!**
