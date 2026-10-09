/* =====================================================================
   APP DA PÁGINA PRINCIPAL (index.html)
   Troca de "páginas" pelo # do endereço: index.html#manual, #produto...
   ===================================================================== */

/* Endereços antigos que agora são arquivos separados */
const MOVIDAS = { login: "login/login.html", cadastro: "login/cadastro.html", jogo: "jogo/jogo.html" };

function route() {
  let r = location.hash.slice(1) || "home";
  if (MOVIDAS[r]) { location.replace(MOVIDAS[r]); return; }
  if (!$(`[data-page="${r}"]`)) r = "home";
  $$(".page").forEach(p => p.classList.toggle("active", p.dataset.page === r));
  marcarMenu(r);
  document.title = $(`[data-page="${r}"]`).dataset.title + " · TechFire GuardFlame";
  window.scrollTo(0, 0);
  if (r === "aovivo") startLive(); else stopLive();
}
window.addEventListener("hashchange", route);

/* =====================================================================
   TELEMETRIA SIMULADA
   ===================================================================== */
const tel = { bat: 87, alt: 60, vel: 8, lat: CONFIG.mapa.lat, lon: CONFIG.mapa.lon };
function atualizaTelemetria() {
  if (CONFIG.telemetriaSimulada) {
    tel.bat = Math.max(15, tel.bat - .05);
    tel.alt = 58 + Math.round(Math.random() * 5);
    tel.vel = 7 + Math.round(Math.random() * 3);
    tel.lat += (Math.random() - .5) * .0002; tel.lon += (Math.random() - .5) * .0002;
  }
  const vals = {
    status: "Em voo", bat: Math.round(tel.bat) + "%", alt: tel.alt + " m", vel: tel.vel + " km/h",
    tmax: Thermal.ultimaConf != null ? (Thermal.ultimaConf >= 60 ? "Fogo " + Thermal.ultimaConf + "%" : "Nenhum") : "--",
    sinal: "4G", gps: tel.lat.toFixed(4) + ", " + tel.lon.toFixed(4)
  };
  $$("[data-tel]").forEach(el => { const k = el.dataset.tel; if (k in vals) el.textContent = vals[k]; });
}

/* =====================================================================
   MONTA AS PÁGINAS A PARTIR DOS DADOS
   ===================================================================== */
function montar() {
  $("#stepsList").innerHTML = PASSOS.map(([t, d, tag]) => `<div class="step"><div><h3>${t}</h3><p>${d}</p><span class="tag leaf">${tag}</span></div></div>`).join("");

  $("#prodList").innerHTML = PRODUTOS.map(p => `
    <article class="card prod"><div class="top" style="background:${p.c}">${icon(p.i)}</div>
      <div class="body"><h3>${p.n}</h3><p class="muted" style="font-size:.9rem">${p.d}</p>
      <ul>${p.s.map(x => `<li>${x}</li>`).join("")}</ul><div class="price num">${brl(p.p)}</div></div></article>`).join("");
  $("#kitPrice").textContent = CONFIG.precoKit || brl(PRODUTOS.reduce((t, p) => t + p.p, 0));

  $("#teamList").innerHTML = CONFIG.equipe.map(m => {
    const ini = m.nome.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
    return `<div class="card member"><div class="avatar">${m.foto ? `<img src="${esc(caminho(m.foto))}" alt="Foto de ${esc(m.nome)}" onerror="this.replaceWith(document.createTextNode('${ini}'))">` : ini}</div>
      <h3 style="margin:0">${esc(m.nome)}</h3><p class="muted" style="font-size:.9rem">${esc(m.funcao)}</p></div>`;
  }).join("");
  $("#aboutText").textContent = CONFIG.sobre;

  $("#refList").innerHTML = REFS.map(g => `
    <div class="ref-group"><h3><span class="ic" style="margin:0;width:36px;height:36px">${icon(g.icon)}</span>${g.cat}<span class="tag" style="margin-left:4px">${g.itens.length}</span></h3>
      <div class="grid g2">${g.itens.map(([a, t, url]) => `<div class="card ref"><span class="who">${a}</span> ${t}${url ? `<br><a href="${url}" target="_blank" rel="noopener">Acessar fonte</a>` : ""}</div>`).join("")}</div></div>`).join("") +
    `<p class="muted" style="font-size:.88rem">Referências organizadas conforme a ABNT NBR 6023.</p>`;

  $("#journeyList").innerHTML = JORNADA.map(([t, d]) => `<div><b>${t}</b><span class="muted">${d}</span></div>`).join("");
  $("#histBody").innerHTML = HISTORICO.map(([d, l, t, s, c]) => `<tr><td class="num">${d}</td><td class="num">${l}</td><td class="num"><b>${t}</b></td><td><span class="tag ${c}">${s}</span></td></tr>`).join("");

  const temps = Array.from({ length: 24 }, (_, h) => Math.round(24 + 10 * Math.sin((h - 9) / 24 * Math.PI * 2) + (h === 14 ? 34 : h === 15 ? 20 : 0) + Math.random() * 4));
  $("#bars").innerHTML = temps.map((v, h) => `<i class="${v > 45 ? "hot" : v > 33 ? "warm" : ""}" style="height:${Math.min(100, v / 70 * 100)}%" title="${h}h: risco ${Math.min(100, Math.round(v / 70 * 100))}%"></i>`).join("");
  $("#alertTime").textContent = new Date().toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });

  const { lat, lon } = CONFIG.mapa, dlt = .01;
  $("#mapBox").innerHTML = `<iframe title="Mapa com a posição do drone" loading="lazy" src="https://www.openstreetmap.org/export/embed.html?bbox=${lon - dlt}%2C${lat - dlt}%2C${lon + dlt}%2C${lat + dlt}&layer=mapnik&marker=${lat}%2C${lon}"></iframe>`;

  $$("[data-toast]").forEach(b => b.addEventListener("click", () => toast(b.dataset.toast)));

  $("#contactForm").addEventListener("submit", e => {
    e.preventDefault(); const f = e.target;
    const corpo = encodeURIComponent(`Nome: ${f.nome.value}\nE-mail: ${f.email.value}\n\n${f.msg.value}`);
    location.href = `mailto:${CONFIG.emailContato}?subject=${encodeURIComponent("Contato pelo site GuardFlame")}&body=${corpo}`;
    toast("Abrindo seu aplicativo de e-mail…");
  });
}

/* ---------- INICIALIZAÇÃO ---------- */
if (protegerPagina()) {
  montarLayout("home");
  montar();
  renderRecorded();
  renderVideosFixos();
  fillIcons();
  ativarTema();
  initThermals();
  atualizaTelemetria(); setInterval(atualizaTelemetria, 1000);
  route();
  mostrarAvisoPendente();
}
