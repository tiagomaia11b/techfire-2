/* =====================================================================
   PÁGINA EXPERIÊNCIA (experiencia.html)
   O histórico de ocorrências vem do banco de dados (api/ocorrencias.php).
   Sem banco, mostra os exemplos de HISTORICO abaixo.
   ===================================================================== */
const JORNADA = [
  ["Cadastro", "Cria a conta no site"], ["Login", "Entra no painel"], ["Conexão", "Liga e conecta o drone"], ["Voo", "Define a área e decola"],
  ["Monitoramento", "Acompanha vídeo e calor"], ["Alerta", "Recebe aviso de foco"], ["Registro", "Confirma a ocorrência"], ["Relatório", "Consulta o histórico"]
];

/* Exemplos usados quando o banco de dados ainda não está ligado */
const HISTORICO = [
  ["04/10/2026 14:32", "-23.5612, -46.6401", "94%", "Em atendimento"],
  ["02/10/2026 11:05", "-23.5487, -46.6218", "88%", "Controlado"],
  ["28/09/2026 16:47", "-23.5701, -46.6550", "61%", "Falso alarme"],
  ["25/09/2026 09:18", "-23.5399, -46.6102", "97%", "Controlado"],
  ["21/09/2026 15:56", "-23.5823, -46.6489", "90%", "Controlado"]
];
const COR_SITUACAO = { "Em atendimento": "", "Controlado": "leaf", "Falso alarme": "amber" };

/* "2026-10-04 14:32:10" → "04/10/2026 14:32" */
const dataBr = (s) => { const [d, h = ""] = String(s).split(" "); const [a, m, dia] = d.split("-"); return `${dia}/${m}/${a} ${h.slice(0, 5)}`; };

function mostrarHistorico(linhas, doBanco) {
  $("#histBody").innerHTML = linhas.map(([d, l, t, s]) =>
    `<tr><td class="num">${esc(d)}</td><td class="num">${esc(l)}</td><td class="num"><b>${esc(t)}</b></td><td><span class="tag ${COR_SITUACAO[s] ?? ""}">${esc(s)}</span></td></tr>`).join("");
  $("#histFonte").textContent = doBanco ? "Dados do banco de dados." : "Exemplos — ligue o banco de dados para ver as ocorrências reais.";
}

async function carregarHistorico() {
  mostrarHistorico(HISTORICO, false);
  const r = await api("ocorrencias.php");
  if (r.ok && r.lista && r.lista.length) {
    mostrarHistorico(r.lista.map(o => [dataBr(o.criado_em), (+o.lat).toFixed(4) + ", " + (+o.lon).toFixed(4), o.confianca + "%", o.situacao]), true);
  }
}

iniciarPagina("ux", () => {
  $("#journeyList").innerHTML = JORNADA.map(([t, d]) => `<div><b>${t}</b><span class="muted">${d}</span></div>`).join("");

  const temps = Array.from({ length: 24 }, (_, h) => Math.round(24 + 10 * Math.sin((h - 9) / 24 * Math.PI * 2) + (h === 14 ? 34 : h === 15 ? 20 : 0) + Math.random() * 4));
  $("#bars").innerHTML = temps.map((v, h) => `<i class="${v > 45 ? "hot" : v > 33 ? "warm" : ""}" style="height:${Math.min(100, v / 70 * 100)}%" title="${h}h: risco ${Math.min(100, Math.round(v / 70 * 100))}%"></i>`).join("");
  $("#alertTime").textContent = new Date().toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });

  const { lat, lon } = CONFIG.mapa, dlt = .01;
  $("#mapBox").innerHTML = `<iframe title="Mapa com a posição do drone" loading="lazy" src="https://www.openstreetmap.org/export/embed.html?bbox=${lon - dlt}%2C${lat - dlt}%2C${lon + dlt}%2C${lat + dlt}&layer=mapnik&marker=${lat}%2C${lon}"></iframe>`;

  $$("[data-toast]").forEach(b => b.addEventListener("click", () => toast(b.dataset.toast)));

  Telemetria.iniciar();
  carregarHistorico();
});
