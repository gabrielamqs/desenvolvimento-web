// public/app.js
const btn = document.getElementById("btn");
const inputUrl = document.getElementById("url");
const inputCodigo = document.getElementById("codigo");
const inputExpira = document.getElementById("expira");
const resultado = document.getElementById("resultado");
const tbody = document.querySelector("#tabela tbody");

function formatarData(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("pt-BR");
}

function celulaTruncada(texto, maxLen = 50) {
  if (texto.length <= maxLen) return texto;
  return `<span title="${texto}">${texto.slice(0, maxLen)}…</span>`;
}

async function carregarLista() {
  const resp = await fetch("/api/urls");
  const lista = await resp.json();
  tbody.innerHTML = lista
    .map((u) => {
      const expirou = u.expiraEm && new Date(u.expiraEm) < new Date();
      const expiraTexto = u.expiraEm
        ? `<span class="${expirou ? "expirado" : "ativo"}">${formatarData(u.expiraEm)}</span>`
        : "—";
      return `
        <tr class="${expirou ? "linha-expirada" : ""}">
            <td><a href="/${u.codigo}" target="_blank">${u.codigo}</a></td>
            <td class="url-cell">${celulaTruncada(u.urlOriginal)}</td>
            <td>${formatarData(u.criadoEm)}</td>
            <td>${expiraTexto}</td>
            <td class="acessos">${u.acessos}</td>
            <td><a href="/stats/${u.codigo}" target="_blank" class="btn-stats" title="Ver estatísticas">📊</a></td>
        </tr>`;
    })
    .join("");
}

btn.addEventListener("click", async () => {
  const urlOriginal = inputUrl.value.trim();
  const codigo = inputCodigo.value.trim();
  const expiraEm = inputExpira.value;

  if (!urlOriginal) {
    resultado.innerHTML = `<div class="resultado erro">⚠️ Informe uma URL.</div>`;
    return;
  }

  const corpo = { urlOriginal };
  if (codigo) corpo.codigo = codigo;
  if (expiraEm) corpo.expiraEm = expiraEm;

  const resp = await fetch("/api/encurtar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(corpo),
  });

  const dados = await resp.json();

  if (!resp.ok) {
    resultado.innerHTML = `<div class="resultado erro">■ ${dados.erro}</div>`;
    return;
  }

  const curta = `${location.origin}/${dados.codigo}`;
  resultado.innerHTML = `
        <div class="resultado sucesso">
            ✅ URL encurtada com sucesso!<br>
            <a href="${curta}" target="_blank">${curta}</a>
            &nbsp;|&nbsp;
            <a href="/stats/${dados.codigo}" target="_blank">📊 Ver estatísticas</a>
        </div>`;

  inputUrl.value = "";
  inputCodigo.value = "";
  inputExpira.value = "";
  carregarLista();
});

carregarLista();
