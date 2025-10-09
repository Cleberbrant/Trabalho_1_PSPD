# Dockerfile para o Servidor A (Python - CountWords)
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia todo o código (antes: COPY *.py .  que falhava)
COPY . .

EXPOSE 50051
CMD ["python","main.py"]