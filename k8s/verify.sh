#!/bin/bash

# Script de verificação completa do sistema Kubernetes

echo "🔍 VERIFICAÇÃO COMPLETA DO SISTEMA KUBERNETES"
echo "============================================="

# Verificar se o cluster está disponível
echo "📋 1. Status do Cluster Kubernetes:"
kubectl cluster-info --request-timeout=5s || {
    echo "❌ Cluster Kubernetes não disponível"
    exit 1
}

echo ""
echo "📋 2. Status dos Pods:"
kubectl get pods -n grpc-textprocessor -o wide

echo ""
echo "📋 3. Status dos Services:"
kubectl get services -n grpc-textprocessor

echo ""
echo "📋 4. Testando conectividade dos serviços:"

# Testar se o frontend está respondendo
echo -n "Frontend (3000): "
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ OK"
else
    echo "❌ FALHA"
fi

# Testar se o Envoy está respondendo
echo -n "Envoy gRPC-Web (8080): "
if curl -s http://localhost:8080 > /dev/null 2>&1; then
    echo "✅ OK"
else
    echo "❌ FALHA"
fi

echo ""
echo "📋 5. Resumo dos Recursos:"
echo "Namespaces:"
kubectl get namespaces | grep grpc-textprocessor

echo ""
echo "ConfigMaps:"
kubectl get configmaps -n grpc-textprocessor

echo ""
echo "Deployments:"
kubectl get deployments -n grpc-textprocessor

echo ""
echo "📋 6. URLs de Acesso:"
echo "🌐 Frontend Web: http://localhost:3000"
echo "🔗 gRPC-Web (Envoy): http://localhost:8080"

echo ""
echo "📋 7. Comandos úteis:"
echo "# Ver logs em tempo real:"
echo "kubectl logs -f -n grpc-textprocessor deployment/server-a-deployment"
echo "kubectl logs -f -n grpc-textprocessor deployment/gateway-deployment"
echo ""
echo "# Escalar serviços:"
echo "kubectl scale deployment/server-a-deployment --replicas=3 -n grpc-textprocessor"
echo ""
echo "# Limpar tudo:"
echo "./cleanup.sh"

echo ""
if kubectl get pods -n grpc-textprocessor | grep -q "Running"; then
    echo "🎉 SISTEMA KUBERNETES FUNCIONANDO CORRETAMENTE!"
    echo "✅ Todos os componentes principais estão rodando"
    echo "🚀 Acesse http://localhost:3000 para usar a aplicação"
else
    echo "⚠️  Alguns pods podem não estar rodando corretamente"
    echo "Execute: kubectl get pods -n grpc-textprocessor para mais detalhes"
fi
