#!/bin/bash

# Script para construir todas as imagens Docker para Kubernetes
# Este script assume que você tem um registry local na porta 5000

set -e

echo "🐳 Construindo imagens Docker para Kubernetes..."

# Definir o registry local
REGISTRY="localhost:5000"

# Função para construir e fazer push de uma imagem
build_and_push() {
    local service=$1
    local dockerfile_path=$2
    local context_path=$3
    local image_name="${REGISTRY}/${service}:latest"
    
    echo "📦 Construindo ${service}..."
    if [ "${service}" = "gateway-stub" ]; then
        # Para o gateway, usamos o diretório raiz como contexto para acessar o proto
        sudo docker build -f "${context_path}/${dockerfile_path}" -t "${image_name}" .
    else
        cd "${context_path}"
        sudo docker build -f "${dockerfile_path}" -t "${image_name}" .
        cd - > /dev/null
    fi
    echo "🚀 Fazendo push de ${image_name}..."
    sudo docker push "${image_name}"
}

# Verificar se o registry local está rodando
echo "🔍 Verificando registry local..."
if ! curl -s http://localhost:5000/v2/ > /dev/null; then
    echo "⚠️  Registry local não encontrado. Iniciando registry local..."
    docker run -d -p 5000:5000 --name registry registry:2 || echo "Registry já está rodando"
fi

# Navegar para o diretório pai (raiz do projeto)
cd ..

# Construir todas as imagens
build_and_push "server-a-words" "Dockerfile" "./server-a-words"
build_and_push "server-b-chars" "Dockerfile" "./server-b-chars" 
build_and_push "gateway-stub" "Dockerfile" "./gateway-stub"
build_and_push "frontend-web" "Dockerfile" "./frontend-web"

echo "✅ Todas as imagens foram construídas e enviadas para o registry local!"
echo "📋 Imagens disponíveis:"
echo "   - ${REGISTRY}/server-a-words:latest"
echo "   - ${REGISTRY}/server-b-chars:latest"
echo "   - ${REGISTRY}/gateway-stub:latest"
echo "   - ${REGISTRY}/frontend-web:latest"
