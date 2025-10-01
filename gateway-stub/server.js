import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import reflectionPkg from "grpc-reflection-js"; // CommonJS
import path from "path";
import { fileURLToPath } from "url";

const { ServerReflection } = reflectionPkg || {};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROTO_PATH = path.join(__dirname, "..", "proto", "textprocessor.proto");

const pkgDef = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const proto = grpc.loadPackageDefinition(pkgDef).textprocessor;

const serverA = process.env.SERVER_A_HOST || "localhost:50051";
const serverB = process.env.SERVER_B_HOST || "localhost:50052";

const clientA = new proto.TextProcessor(
  serverA,
  grpc.credentials.createInsecure()
);
const clientB = new proto.TextProcessor(
  serverB,
  grpc.credentials.createInsecure()
);

const impl = {
  CountWords(call, cb) {
    clientA.CountWords({ text: call.request.text }, cb);
  },
  CountCharacters(call, cb) {
    clientB.CountCharacters({ text: call.request.text }, cb);
  },
  //   StreamWords(call) {
  //     call.end();
  //   },
  //   CountMultipleTexts(call, cb) {
  //     cb(null, { total_words: 0, total_chars: 0, text_count: 0 });
  //   },
  //   AnalyzeTextStream(stream) {
  //     stream.end();
  //   },
};

function start() {
  const s = new grpc.Server();
  s.addService(proto.TextProcessor.service, impl);

  // Reflection (ignora se lib não expõe)
  try {
    if (ServerReflection && typeof ServerReflection.enable === "function") {
      ServerReflection.enable(s, {
        textprocessor: { TextProcessor: proto.TextProcessor.service },
      });
      console.log("Reflection habilitado");
    } else {
      console.log("Reflection não disponível (prosseguindo sem)");
    }
  } catch (e) {
    console.log("Falha ao habilitar reflection (ignorando):", e.message);
  }

  const port = process.env.GATEWAY_GRPC_PORT || "4001";
  s.bindAsync(
    "0.0.0.0:" + port,
    grpc.ServerCredentials.createInsecure(),
    (err) => {
      if (err) {
        console.error("bind error", err);
        process.exit(1);
      }
      console.log("Gateway gRPC na porta", port);
      console.log("A(Python):", serverA, "| B(Go):", serverB);
      s.start();
    }
  );
}

start();
