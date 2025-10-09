#!/usr/bin/env python3
"""
Servidor A - Contador de Palavras (Python)
Implementa todos os RPCs definidos em textprocessor.proto.
"""

import os
import re
import time
import logging
from concurrent import futures

import grpc
import textprocessor_pb2 as pb
import textprocessor_pb2_grpc as pb_grpc

# Logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("ServidorA")

class TextProcessorService(pb_grpc.TextProcessorServicer):
    """Implementação dos métodos gRPC definidos em textprocessor.proto."""

    def CountWords(self, request, context):
        text = request.text.strip()
        logger.info(f"📝 CountWords: '{text[:50]}{'...' if len(text) > 50 else ''}'")
        if not text:
            return pb.WordCountResponse(word_count=0)
        words = re.findall(r'\b\w+\b', text, re.UNICODE)
        time.sleep(0.05)  # simular processamento
        resp = pb.WordCountResponse(word_count=len(words))
        logger.info(f"✅ CountWords -> {resp.word_count}")
        return resp

def serve():
    port = os.getenv("GRPC_PORT", "50051")
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    pb_grpc.add_TextProcessorServicer_to_server(TextProcessorService(), server)
    listen_addr = f"[::]:{port}"
    server.add_insecure_port(listen_addr)
    logger.info(f"🚀 Servidor A (Python) escutando em {listen_addr}")
    server.start()
    try:
        server.wait_for_termination()
    except KeyboardInterrupt:
        logger.info("🛑 Encerrando...")
        server.stop(0)

if __name__ == "__main__":
    serve()