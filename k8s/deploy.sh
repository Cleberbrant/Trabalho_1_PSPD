#!/bin/bash

# Script para fazer deploy de todos os recursos no Kubernetes

set -e

echo "🚀 Fazendo deploy dos recursos Kubernetes..."

# Verificar se kubectl está instalado e configurado
if ! command -v kubectl &> /dev/null; then
    echo "❌ kubectl não está instalado. Por favor, instale o kubectl primeiro."
    exit 1
fi

# Verificar se há um cluster Kubernetes disponível
if ! kubectl cluster-info &> /dev/null; then
    echo "❌ Não foi possível conectar ao cluster Kubernetes. Verifique sua configuração."
    exit 1
fi

# Aplicar os manifestos na ordem correta
echo "📋 Aplicando namespace e configmaps..."
kubectl apply -f 00-namespace-configmap.yaml

echo "📋 Aplicando servidor A (Python)..."
kubectl apply -f 01-server-a.yaml

echo "📋 Aplicando servidor B (Go)..."
kubectl apply -f 02-server-b.yaml

echo "📋 Aplicando gateway (Node.js)..."
kubectl apply -f 03-gateway.yaml

echo "📋 Aplicando Envoy proxy..."
kubectl apply -f 04-envoy.yaml

echo "📋 Aplicando frontend web..."
kubectl apply -f 05-frontend.yaml

echo "⏳ Aguardando os pods ficarem prontos..."
kubectl wait --for=condition=ready pod -l app=server-a -n grpc-textprocessor --timeout=300s
kubectl wait --for=condition=ready pod -l app=server-b -n grpc-textprocessor --timeout=300s
kubectl wait --for=condition=ready pod -l app=gateway -n grpc-textprocessor --timeout=300s
kubectl wait --for=condition=ready pod -l app=envoy -n grpc-textprocessor --timeout=300s
kubectl wait --for=condition=ready pod -l app=frontend -n grpc-textprocessor --timeout=300s

echo "✅ Deploy concluído com sucesso!"
echo ""
echo "📊 Status dos recursos:"
kubectl get all -n grpc-textprocessor

echo ""
echo "🌐 Para acessar os serviços:"
echo "Frontend: kubectl port-forward -n grpc-textprocessor service/frontend-service 3000:80"
echo "Envoy (gRPC-Web): kubectl port-forward -n grpc-textprocessor service/envoy-service 8080:8080"
echo "Admin Envoy: kubectl port-forward -n grpc-textprocessor service/envoy-service 9901:9901"
