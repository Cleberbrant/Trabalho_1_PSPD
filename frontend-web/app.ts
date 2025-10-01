import pb from "./textprocessor_pb.wrapper.ts";
import { TextProcessorClient } from "./TextprocessorServiceClientPb.ts";

const defaultGateway = "http://localhost:8080"; // Envoy gRPC-Web endpoint

let isProcessing = false;

function byId<T extends HTMLElement>(id: string) {
  return document.getElementById(id) as T | null;
}

function getTextRequestCtor(): any {
  // tenta vários caminhos possíveis dependendo de como o stub foi gerado
  return (
    // export padrão
    (pb as any).TextRequest ||
    // agrupamento comum: proto namespace
    (pb as any).textprocessor?.TextRequest ||
    (pb as any).proto?.textprocessor?.TextRequest ||
    (pb as any).default?.textprocessor?.TextRequest ||
    (pb as any).default?.TextRequest ||
    // último recurso: procurar por qualquer export que termine com "TextRequest"
    Object.values(pb).find((v: any) => v && v.name === "TextRequest")
  );
}

async function processTextViaGrpc() {
  if (isProcessing) return;

  const textInput = byId<HTMLTextAreaElement>("textInput");
  const gatewayInput = byId<HTMLInputElement>("gatewayUrl");
  const submitBtn = byId<HTMLButtonElement>("submitBtn");
  const wordCountEl = byId<HTMLElement>("wordCount");
  const charCountEl = byId<HTMLElement>("charCount");
  const errorEl = byId<HTMLElement>("error");

  if (
    !textInput ||
    !gatewayInput ||
    !submitBtn ||
    !wordCountEl ||
    !charCountEl ||
    !errorEl
  )
    return;

  const text = textInput.value.trim();
  const gatewayUrl = (gatewayInput.value || defaultGateway).trim();

  if (!text) {
    showError("Por favor, digite algum texto para análise via gRPC");
    return;
  }

  const TextRequestCtor = getTextRequestCtor();
  if (!TextRequestCtor) {
    showError(
      "Não foi possível localizar TextRequest no stub gerado (textprocessor_pb.js)."
    );
    console.error("pb exports:", pb);
    return;
  }

  try {
    isProcessing = true;
    submitBtn.disabled = true;
    submitBtn.textContent = "⏳ Processando via gRPC...";
    wordCountEl.textContent = "...";
    charCountEl.textContent = "...";
    errorEl.style.display = "none";

    const client = new TextProcessorClient(gatewayUrl, null, null);

    const req = new TextRequestCtor();
    // campo conforme proto
    if (typeof req.setText === "function") {
      req.setText(text);
    } else {
      // fallback assign
      req.text = text;
    }

    // CountWords
    await new Promise<void>((resolve) => {
      client.countWords(req, {}, (err: any, resp: any) => {
        if (err) {
          console.error("CountWords error", err);
          wordCountEl.textContent = "ERR";
        } else {
          wordCountEl.textContent =
            typeof resp.getWordCount === "function"
              ? String(resp.getWordCount())
              : String(resp.word_count ?? resp.wordCount ?? "-");
        }
        resolve();
      });
    });

    // CountCharacters
    await new Promise<void>((resolve) => {
      client.countCharacters(req, {}, (err: any, resp: any) => {
        if (err) {
          console.error("CountCharacters error", err);
          charCountEl.textContent = "ERR";
        } else {
          charCountEl.textContent =
            typeof resp.getCharCount === "function"
              ? String(resp.getCharCount())
              : String(resp.char_count ?? resp.charCount ?? "-");
        }
        resolve();
      });
    });
  } catch (e: any) {
    console.error("Erro gRPC:", e);
    showError(e.message || String(e));
  } finally {
    isProcessing = false;
    const submit = byId<HTMLButtonElement>("submitBtn");
    if (submit) {
      submit.disabled = false;
      submit.textContent = "📊 ANALISAR VIA gRPC";
    }
  }
}

function showError(msg: string) {
  const errorEl = byId<HTMLElement>("error");
  if (!errorEl) return;
  errorEl.textContent = `⚠️ ${msg}`;
  errorEl.style.display = "block";
  setTimeout(() => (errorEl.style.display = "none"), 7000);
}

function clearText() {
  const t = byId<HTMLTextAreaElement>("textInput");
  const wc = byId<HTMLElement>("wordCount");
  const cc = byId<HTMLElement>("charCount");
  if (t) t.value = "";
  if (wc) wc.textContent = "-";
  if (cc) cc.textContent = "-";
}

function loadExample() {
  const t = byId<HTMLTextAreaElement>("textInput");
  if (!t) return;
  t.value = "teste gRPC Web integracao";
}

function demoStreaming() {
  alert("Demo streaming não implementado no cliente TS (ok no futuro).");
}

document.addEventListener("DOMContentLoaded", () => {
  const gw = byId<HTMLInputElement>("gatewayUrl");
  if (gw && (!gw.value || gw.value.includes("4000"))) gw.value = defaultGateway;

  const submit = byId<HTMLButtonElement>("submitBtn");
  if (submit)
    submit.addEventListener("click", (e) => {
      e.preventDefault();
      processTextViaGrpc();
    });

  const clearBtn = byId<HTMLButtonElement>("clearBtn");
  if (clearBtn)
    clearBtn.addEventListener("click", (e) => {
      e.preventDefault();
      clearText();
    });

  const exampleBtn = byId<HTMLButtonElement>("exampleBtn");
  if (exampleBtn)
    exampleBtn.addEventListener("click", (e) => {
      e.preventDefault();
      loadExample();
    });

  const streamBtn = byId<HTMLButtonElement>("streamBtn");
  if (streamBtn)
    streamBtn.addEventListener("click", (e) => {
      e.preventDefault();
      demoStreaming();
    });
});
