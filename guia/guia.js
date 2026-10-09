/* =====================================================================
   PÁGINA MEU GUIA (guia.html)
   Só abre para a conta CONFIG.dono (js/config.js). Qualquer outra pessoa
   volta para o Início.
   ===================================================================== */

/* Marca "Feito" em cada passo e guarda neste navegador */
function ativarProgresso() {
  const feitos = store.get("gf_guia_feitos", {});
  const passos = $$(".guia .step");
  passos.forEach((st, i) => {
    const id = st.dataset.id || "p" + i;
    const lb = document.createElement("label");
    lb.className = "feito-check";
    lb.innerHTML = `<input type="checkbox"${feitos[id] ? " checked" : ""}> Feito`;
    st.firstElementChild.appendChild(lb);
    st.classList.toggle("feito", !!feitos[id]);
    lb.querySelector("input").addEventListener("change", e => {
      feitos[id] = e.target.checked; if (!feitos[id]) delete feitos[id];
      store.set("gf_guia_feitos", feitos);
      st.classList.toggle("feito", e.target.checked);
      atualizarBarra();
    });
  });
  function atualizarBarra() {
    const n = $$(".guia .step.feito").length;
    $("#barra").style.width = (n / passos.length * 100) + "%";
    $("#barraTxt").textContent = `${n} de ${passos.length} passos`;
  }
  atualizarBarra();
  $("#zerar").addEventListener("click", () => {
    store.del("gf_guia_feitos");
    $$(".feito-check input").forEach(c => { c.checked = false; c.closest(".step").classList.remove("feito"); });
    atualizarBarra(); toast("Progresso zerado");
  });
}

/* Destaca no índice a parte que está na tela */
function ativarIndice() {
  const links = $$(".indice a");
  const obs = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) links.forEach(a => a.classList.toggle("on", a.getAttribute("href") === "#" + e.target.id));
  }), { rootMargin: "-30% 0px -60% 0px" });
  $$(".parte").forEach(p => obs.observe(p));
}

/* Painel "Como está agora" */
async function statusRapido() {
  const canal = CONFIG.aoVivo.twitchCanal;
  $("#stCanal").className = "pill " + (canal ? "ok" : "err");
  $("#stCanal").textContent = canal ? canal : "Não configurado";
  $("#stCanalLink").innerHTML = canal ? `<a href="https://www.twitch.tv/${encodeURIComponent(canal)}" target="_blank" rel="noopener">twitch.tv/${esc(canal)}</a>` : "Preencha twitchCanal no js/config.js";

  const r = await api("status.php");
  const tabelasOk = r.banco && ["telemetria", "ocorrencias"].every(t => r.tabelas && r.tabelas[t] != null);
  $("#stBanco").className = "pill " + (tabelasOk ? "ok" : r.mysql ? "warn" : "err");
  $("#stBanco").textContent = tabelasOk ? "Pronto" : r.mysql ? "Falta criar tabelas" : "Sem conexão";
  $("#stBancoInfo").textContent = tabelasOk ? `${r.tabelas.telemetria} posições gravadas` : (r.erro || "Veja a parte I do guia");
  if (r.chavePadrao) $("#stBancoInfo").textContent += " · troque a CHAVE_API!";
}

if (protegerPagina()) {
  if (!ehDono()) {
    avisoDepois("Essa página é só do administrador do site.");
    location.replace(RAIZ + "index.html");
  } else {
    iniciarPagina("guia", () => {
      document.body.classList.remove("restrito");
      $("#donoNome").textContent = sessao().nome.split(" ")[0];
      ativarProgresso();
      ativarIndice();
      Telemetria.iniciar();
      statusRapido();
    });
  }
}
