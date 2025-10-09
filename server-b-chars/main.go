package main

import (
	"context"
	"log"
	"net"
	"os"
	"unicode/utf8"

	"google.golang.org/grpc"

	"server-b-chars/textprocessorpb"
)

type charServer struct {
    textprocessorpb.UnimplementedTextProcessorServer
}

// Unary: conta caracteres
func (s *charServer) CountCharacters(ctx context.Context, req *textprocessorpb.TextRequest) (*textprocessorpb.CharCountResponse, error) {
    text := req.GetText()
    count := utf8.RuneCountInString(text)
    log.Printf("CountCharacters '%s' -> %d", truncate(text, 40), count)
    return &textprocessorpb.CharCountResponse{CharCount: int32(count)}, nil
}

func truncate(s string, n int) string {
    r := []rune(s)
    if len(r) <= n {
        return s
    }
    return string(r[:n]) + "..."
}

func main() {
    port := os.Getenv("GRPC_PORT")
    if port == "" {
        port = "50052"
    }
    lis, err := net.Listen("tcp", ":"+port)
    if err != nil {
        log.Fatalf("listen error: %v", err)
    }
    grpcServer := grpc.NewServer()
    textprocessorpb.RegisterTextProcessorServer(grpcServer, &charServer{})
    log.Printf("Servidor B (Go) na porta %s", port)
    if err := grpcServer.Serve(lis); err != nil {
        log.Fatalf("serve error: %v", err)
    }
}