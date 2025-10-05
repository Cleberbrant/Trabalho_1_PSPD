#!/bin/bash

# Script para limpar todos os recursos do Kubernetes

set -e

echo "🧹 Removendo recursos do Kubernetes..."

# Remover todos os recursos do namespace
kubectl delete namespace grpc-textprocessor --ignore-not-found=true

echo "⏳ Aguardando a remoção completa dos recursos..."
kubectl wait --for=delete namespace/grpc-textprocessor --timeout=60s || true

echo "✅ Limpeza concluída!"

# Opcional: parar o registry local se desejar
read -p "Deseja também parar o registry local? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🛑 Parando registry local..."
    docker stop registry || true
    docker rm registry || true
    echo "✅ Registry local removido!"
fi
