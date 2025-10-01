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

    # def StreamWords(self, request, context):
    #     text = request.text.strip()
    #     logger.info("📡 StreamWords iniciando")
    #     words = re.findall(r'\b\w+\b', text, re.UNICODE)
    #     for i, w in enumerate(words, start=1):
    #         yield pb.WordChunk(word=w, position=i)
    #         time.sleep(0.02)

    # def CountMultipleTexts(self, request_iterator, context):
    #     total_words = 0
    #     total_chars = 0
    #     text_count = 0
    #     for req in request_iterator:
    #         text = req.text.strip()
    #         if not text:
    #             continue
    #         words = re.findall(r'\b\w+\b', text, re.UNICODE)
    #         total_words += len(words)
    #         total_chars += len(text)
    #         text_count += 1
    #         logger.info(f"📄 Texto {text_count}: +{len(words)} palavras")
    #     logger.info(f"📊 Totais -> textos={text_count} palavras={total_words} chars={total_chars}")
    #     return pb.TotalCountResponse(
    #         total_words=total_words,
    #         total_chars=total_chars,
    #         text_count=text_count
    #     )

    # def AnalyzeTextStream(self, request_iterator, context):
    #     running_words = 0
    #     running_chars = 0
    #     logger.info("🔁 AnalyzeTextStream iniciado")
    #     for req in request_iterator:
    #         text = req.text.strip()
    #         if text:
    #             words = re.findall(r'\b\w+\b', text, re.UNICODE)
    #             running_words += len(words)
    #             running_chars += len(text)
    #             yield pb.AnalysisResponse(
    #                 current_words=running_words,
    #                 current_chars=running_chars,
    #                 status=f"Processado: {len(words)} novas palavras"
    #             )
    #         else:
    #             yield pb.AnalysisResponse(
    #                 current_words=running_words,
    #                 current_chars=running_chars,
    #                 status="Texto vazio ignorado"
    #             )
    #         time.sleep(0.1)
    #     logger.info("🔚 AnalyzeTextStream concluído")

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