/* =====================================================================
   PÁGINA AO VIVO (aovivo.html)
   - Transmissão da câmera do drone (Twitch) → configurada na página Câmera
   - Telemetria do GPS → vem do banco de dados (página GPS)
   - Vídeos e fotos da montagem → CONFIG.montagem em js/config.js
   ===================================================================== */
function renderFoto(box, f) {
  const img = new Image();
  img.alt = f.titulo || "Foto da montagem"; img.loading = "lazy"; img.src = caminho(f.arquivo);
  img.addEventListener("error", () => { box.innerHTML = emptyBox("Foto ainda não adicionada", `Coloque o arquivo em <code>${esc(f.arquivo)}</code>`); });
  const a = document.createElement("a");
  a.href = caminho(f.arquivo); a.target = "_blank"; a.rel = "noopener"; a.title = "Abrir foto em tamanho grande";
  a.appendChild(img); box.innerHTML = ""; box.appendChild(a);
}
function renderMontagem() {
  $("#montagemList").innerHTML = CONFIG.montagem.map((m, i) => `
    <article class="card vid-card"><div class="player${m.tipo === "foto" ? " foto" : ""}" data-mont="${i}"></div>
      <span class="tag ${m.tipo === "foto" ? "leaf" : ""}">${m.tipo === "foto" ? "Foto" : "Vídeo"}</span>
      <h3>${esc(m.titulo)}</h3><p class="muted">${esc(m.descricao || "")}</p></article>`).join("");
  $$("[data-mont]").forEach(b => { const m = CONFIG.montagem[+b.dataset.mont]; m.tipo === "foto" ? renderFoto(b, m) : renderVideo(b, m); });
}

iniciarPagina("aovivo", () => {
  Transmissao.iniciar($("#livePlayer"), CONFIG.aoVivo, $("#liveActions"));
  Telemetria.iniciar();
  renderMontagem();
});
