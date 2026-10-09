/* =====================================================================
   PÁGINA CONEXÃO › BANCO DE DADOS (banco.html)
   - Testa a conexão com o MySQL (api/status.php)
   - Cria o banco e as tabelas (api/instalar.php, lê banco/guardflame.sql)
   - Mostra os últimos dados gravados pelo drone
   ===================================================================== */
const TABELAS = ["usuarios", "voos", "telemetria", "ocorrencias"];

async function testarConexao() {
  $("#apiUrl").textContent = urlApi("");
  $("#statusPill").className = "pill"; $("#statusPill").textContent = "Testando…";
  const r = await api("status.php");
  const itens = [];
  if (!r.php) {
    itens.push(["err", esc(r.erro || "A API não respondeu.")]);
  } else {
    itens.push(["ok", "PHP funcionando (versão " + esc(r.php) + ")."]);
    itens.push(r.mysql ? ["ok", "Conectou ao MySQL."] : ["err", "Não conectou ao MySQL: " + esc(r.erro || "") + " — confira usuário e senha em <code class=\"inline\">api/conexao.php</code>."]);
    if (r.mysql) itens.push(r.banco ? ["ok", "Banco <b>" + esc(r.nomeBanco) + "</b> encontrado."] : ["warn", "O banco <b>" + esc(r.nomeBanco) + "</b> ainda não existe — use o botão Criar banco e tabelas."]);
    if (r.banco) TABELAS.forEach(t => {
      const n = r.tabelas && r.tabelas[t];
      itens.push(n == null ? ["warn", `Tabela <b>${t}</b> não existe.`] : ["ok", `Tabela <b>${t}</b>: ${n} registro(s).`]);
    });
    if (r.chavePadrao) itens.push(["warn", "A CHAVE_API ainda é a padrão. Troque em <code class=\"inline\">api/conexao.php</code> antes de gravar dados."]);
  }
  $("#statusLista").innerHTML = itens.map(([c, t]) => `<li class="${c}"><span>${t}</span></li>`).join("");
  const tudoOk = r.banco && TABELAS.every(t => r.tabelas && r.tabelas[t] != null);
  $("#statusPill").className = "pill " + (tudoOk ? "ok" : r.mysql ? "warn" : "err");
  $("#statusPill").textContent = tudoOk ? "Pronto" : r.mysql ? "Falta criar" : "Sem conexão";
  if (tudoOk) carregarDados();
}

async function instalar(e) {
  e.preventDefault();
  const chave = $("#chaveInstalar").value.trim();
  if (!chave) return toast("Digite a chave da API");
  const msg = $("#instalarMsg");
  msg.className = "msg ok"; msg.textContent = "Criando…";
  const r = await api("instalar.php", { method: "POST", headers: { "Content-Type": "application/json", "X-Chave": chave }, body: JSON.stringify({}) });
  msg.className = "msg " + (r.ok ? "ok" : "err");
  msg.textContent = r.ok ? `Pronto! ${r.comandos} comandos executados. Tabelas: ${r.tabelas.join(", ")}.` : r.erro;
  testarConexao();
}

function tabela(linhas, colunas) {
  if (!linhas || !linhas.length) return `<p class="muted">Nenhum registro ainda.</p>`;
  return `<div class="table-wrap"><table><thead><tr>${colunas.map(c => `<th>${c}</th>`).join("")}</tr></thead><tbody>${
    linhas.map(l => `<tr>${colunas.map(c => `<td class="num">${esc(l[c] ?? "")}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
}
async function carregarDados() {
  const [t, o] = await Promise.all([api("telemetria.php?lista=10"), api("ocorrencias.php")]);
  $("#dadosTel").innerHTML = t.ok ? tabela(t.lista, ["id", "criado_em", "lat", "lon", "altitude", "velocidade", "bateria", "satelites", "status"]) : `<p class="muted">${esc(t.erro)}</p>`;
  $("#dadosOco").innerHTML = o.ok ? tabela(o.lista, ["id", "criado_em", "lat", "lon", "confianca", "descricao", "situacao"]) : `<p class="muted">${esc(o.erro)}</p>`;
}

/* Mostra o conteúdo do banco/guardflame.sql na página */
async function mostrarSql() {
  try {
    const r = await fetch("guardflame.sql", { cache: "no-store" });
    if (!r.ok) throw 0;
    $("#sqlCode").textContent = await r.text();
  } catch (e) {
    $("#sqlCode").textContent = "-- Abra o arquivo banco/guardflame.sql para ver o script.\n-- (o navegador não deixa ler arquivos quando o site é aberto direto do computador)";
  }
}

iniciarPagina("conexao", () => {
  montarSubmenu("banco");
  $("#apiInput").value = CONFIG.api.url;
  $("#formApi").addEventListener("submit", e => {
    e.preventDefault();
    const url = $("#apiInput").value.trim() || "api/";
    store.set("gf_conexao", { ...ajustesLocais(), api: url }); CONFIG.api.url = url;
    toast("Endereço salvo neste navegador"); testarConexao();
  });
  $("#btnTestar").addEventListener("click", testarConexao);
  $("#formInstalar").addEventListener("submit", instalar);
  $("#btnDados").addEventListener("click", carregarDados);
  mostrarSql();
  testarConexao();
});
