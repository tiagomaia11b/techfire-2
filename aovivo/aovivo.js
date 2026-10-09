/* =====================================================================
   PÁGINA AO VIVO (aovivo.html)
   - Transmissão da câmera do drone (Twitch) → configurada na página Câmera
   - Telemetria do GPS → vem do banco de dados (página GPS)
   - Voos gravados → CONFIG.videos em js/config.js
   ===================================================================== */
function renderGravados() {
  $("#recordedList").innerHTML = CONFIG.videos.map((v, i) => `
    <article class="card vid-card"><div class="player" data-rec="${i}"></div><h3>${esc(v.titulo)}</h3><p class="muted">${esc(v.descricao || "")}</p></article>`).join("");
  $$("[data-rec]").forEach(b => renderVideo(b, CONFIG.videos[+b.dataset.rec]));
}

iniciarPagina("aovivo", () => {
  Transmissao.iniciar($("#livePlayer"), CONFIG.aoVivo, $("#liveActions"));
  Telemetria.iniciar();
  renderGravados();
});
