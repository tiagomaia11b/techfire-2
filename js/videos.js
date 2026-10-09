/* =====================================================================
   VÍDEOS GRAVADOS — player de MP4 (pasta videos/) ou YouTube
   ===================================================================== */
function emptyBox(titulo, texto) { return `<div class="empty"><div><b>${titulo}</b>${texto}</div></div>`; }
function renderVideo(box, v) {
  if (v.youtube) {
    box.innerHTML = `<iframe src="https://www.youtube.com/embed/${encodeURIComponent(v.youtube)}?rel=0" title="${esc(v.titulo || "Vídeo")}" allow="accelerometer; autoplay; encrypted-media; picture-in-picture" allowfullscreen loading="lazy"></iframe>`;
    return;
  }
  if (!v.arquivo) { box.innerHTML = emptyBox("Vídeo não configurado", "Adicione o arquivo no CONFIG."); return; }
  const vid = document.createElement("video");
  vid.controls = true; vid.preload = "metadata"; vid.playsInline = true;
  if (v.capa) vid.poster = caminho(v.capa);
  vid.src = caminho(v.arquivo);
  vid.addEventListener("error", () => { box.innerHTML = emptyBox("Vídeo ainda não adicionado", `Coloque o arquivo em <code>${esc(v.arquivo)}</code>`); });
  box.innerHTML = ""; box.appendChild(vid);
}
/* Caixas com data-video="manual" ou data-video="jogo" */
function renderVideosFixos() {
  $$("[data-video]").forEach(b => renderVideo(b, b.dataset.video === "manual" ? CONFIG.videoManual : CONFIG.videoJogo));
}
