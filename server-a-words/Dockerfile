# Dockerfile para o Servidor A (Python - CountWords)
FROM python:3.11-slim

WORKDIR /app

# Copiar requirements.txt primeiro para aproveitar o cache do Docker
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar os arquivos do servidor
COPY *.py .

# Expor a porta 50051
EXPOSE 50051

# Comando para iniciar o servidor
CMD ["python", "main.py"]
