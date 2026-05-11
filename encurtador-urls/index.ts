// index.ts
import {
  inserirUrl,
  buscarPorCodigo,
  registrarAcesso,
  listarUrls,
} from "./banco";
import { gerarCodigo, urlValida, codigoValido } from "./util";
import type { RespostaErro } from "./tipos";

// Desafio E: porta via variável de ambiente
const PORTA = Number(Bun.env.PORTA ?? "3000");

function json(dados: unknown, status: number = 200): Response {
  return new Response(JSON.stringify(dados, null, 2), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

function erro(mensagem: string, status: number): Response {
  const resp: RespostaErro = { erro: mensagem };
  return json(resp, status);
}

function paginaStats(
  codigo: string,
  urlOriginal: string,
  criadoEm: string,
  acessos: number,
  expiraEm: string | null | undefined,
  urlCurta: string,
): string {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(urlCurta)}`;
  const expirou = expiraEm ? new Date(expiraEm) < new Date() : false;
  const expiraTexto = expiraEm
    ? `${new Date(expiraEm).toLocaleString("pt-BR")}${expirou ? " <span style='color:#c0392b'>(expirado)</span>" : ""}`
    : "<em>Sem expiração</em>";

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Estatísticas — ${codigo}</title>
  <style>
    body { font-family: system-ui; max-width: 680px; margin: 40px auto; padding: 0 20px; color: #222; }
    h1 { color: #0d4f3c; margin-bottom: 4px; }
    .subtitle { color: #555; margin-top: 0; font-size: 0.95rem; }
    .card { background: #f5faf8; border: 1px solid #c3dfd6; border-radius: 8px; padding: 24px; margin-top: 24px; }
    .stat-row { display: flex; gap: 12px; margin-bottom: 12px; flex-wrap: wrap; }
    .stat-label { font-weight: 600; color: #0d4f3c; min-width: 160px; }
    .stat-value { word-break: break-all; }
    .badge { display: inline-block; background: #0d4f3c; color: white; border-radius: 20px; padding: 4px 16px; font-size: 1.4rem; font-weight: bold; letter-spacing: 2px; margin-bottom: 8px; }
    .acessos { font-size: 2rem; font-weight: bold; color: #0d4f3c; }
    .qr-section { text-align: center; margin-top: 24px; }
    .qr-section img { border: 4px solid #c3dfd6; border-radius: 8px; }
    a { color: #1a8870; }
    .back { display: inline-block; margin-top: 24px; color: #0d4f3c; text-decoration: none; font-weight: 600; }
    .back:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <h1>📊 Estatísticas</h1>
  <p class="subtitle">Informações sobre o link encurtado</p>

  <div class="card">
    <div class="stat-row">
      <span class="stat-label">Código</span>
      <span class="stat-value"><span class="badge">${codigo}</span></span>
    </div>
    <div class="stat-row">
      <span class="stat-label">URL curta</span>
      <span class="stat-value"><a href="${urlCurta}" target="_blank">${urlCurta}</a></span>
    </div>
    <div class="stat-row">
      <span class="stat-label">URL original</span>
      <span class="stat-value"><a href="${urlOriginal}" target="_blank" rel="noopener">${urlOriginal}</a></span>
    </div>
    <div class="stat-row">
      <span class="stat-label">Criado em</span>
      <span class="stat-value">${new Date(criadoEm).toLocaleString("pt-BR")}</span>
    </div>
    <div class="stat-row">
      <span class="stat-label">Expira em</span>
      <span class="stat-value">${expiraTexto}</span>
    </div>
    <div class="stat-row">
      <span class="stat-label">Total de acessos</span>
      <span class="stat-value acessos">${acessos}</span>
    </div>
  </div>

  <div class="qr-section">
    <p style="font-weight:600;color:#0d4f3c;">QR Code</p>
    <img src="${qrUrl}" alt="QR Code para ${urlCurta}" width="200" height="200">
  </div>

  <a class="back" href="/">← Voltar ao início</a>
</body>
</html>`;
}

const servidor = Bun.serve({
  port: PORTA,
  async fetch(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const caminho = url.pathname;
    const metodo = req.method;

    // POST /api/encurtar → cria nova URL curta
    if (metodo === "POST" && caminho === "/api/encurtar") {
      const corpo = (await req.json()) as {
        urlOriginal?: string;
        codigo?: string;
        expiraEm?: string;
      };

      if (!corpo.urlOriginal || !urlValida(corpo.urlOriginal)) {
        return erro("URL inválida. Forneça http:// ou https://", 400);
      }

      let codigo: string;

      // Desafio A: código personalizado
      if (corpo.codigo && corpo.codigo.trim() !== "") {
        if (!codigoValido(corpo.codigo)) {
          return erro(
            "Código inválido. Use apenas letras e números, entre 4 e 10 caracteres.",
            400,
          );
        }
        const existente = buscarPorCodigo(corpo.codigo);
        if (existente) {
          return erro("Este código já está em uso.", 409);
        }
        codigo = corpo.codigo;
      } else {
        // Gera código único automaticamente
        do {
          codigo = gerarCodigo();
        } while (buscarPorCodigo(codigo));
      }

      // Desafio C: expiraEm opcional
      const expiraEm = corpo.expiraEm?.trim() || null;

      const registro = inserirUrl(codigo, corpo.urlOriginal, expiraEm);
      return json(registro, 201);
    }

    // GET /api/urls → lista todas
    if (metodo === "GET" && caminho === "/api/urls") {
      return json(listarUrls());
    }

    // Desafio B: GET /stats/:codigo → página de estatísticas
    if (metodo === "GET" && /^\/stats\/[A-Za-z0-9]{4,10}$/.test(caminho)) {
      const codigo = caminho.slice(7); // remove "/stats/"
      const registro = buscarPorCodigo(codigo);
      if (!registro) return erro("Código não encontrado", 404);
      const urlCurta = `${url.origin}/${codigo}`;
      const html = paginaStats(
        registro.codigo,
        registro.urlOriginal,
        registro.criadoEm,
        registro.acessos,
        registro.expiraEm,
        urlCurta,
      );
      return new Response(html, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    // GET /:codigo → redireciona
    if (metodo === "GET" && /^\/[A-Za-z0-9]{4,10}$/.test(caminho)) {
      const codigo = caminho.slice(1);
      const registro = buscarPorCodigo(codigo);
      if (!registro) return erro("Código não encontrado", 404);

      // Desafio C: verifica expiração
      if (registro.expiraEm && new Date(registro.expiraEm) < new Date()) {
        return erro("Este link expirou.", 410);
      }

      registrarAcesso(codigo);
      return Response.redirect(registro.urlOriginal, 302);
    }

    // Arquivos estáticos
    if (metodo === "GET" && caminho === "/app.js") {
      return new Response(Bun.file("./public/app.js"));
    }
    if (metodo === "GET" && caminho === "/styles.css") {
      return new Response(Bun.file("./public/styles.css"));
    }

    // GET / → frontend
    if (metodo === "GET" && caminho === "/") {
      return new Response(Bun.file("./public/index.html"));
    }

    return erro("Rota não encontrada", 404);
  },
});

console.log(`Servidor pronto em http://localhost:${servidor.port}`);
