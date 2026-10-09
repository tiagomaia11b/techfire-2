/* =====================================================================
   VÍDEOS
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
function renderRecorded() {
  $("#recordedList").innerHTML = CONFIG.videos.map((v, i) => `
    <article class="card vid-card"><div class="player" data-rec="${i}"></div><h3>${esc(v.titulo)}</h3><p class="muted">${esc(v.descricao || "")}</p></article>`).join("");
  $$("[data-rec]").forEach(b => renderVideo(b, CONFIG.videos[+b.dataset.rec]));
}
/* Caixas com data-video="manual" ou data-video="jogo" */
function renderVideosFixos() {
  $$("[data-video]").forEach(b => renderVideo(b, b.dataset.video === "manual" ? CONFIG.videoManual : CONFIG.videoJogo));
}

/* ---------- AO VIVO ---------- */
let liveOn = false, hlsObj = null;
function loadScript(src) { return new Promise((ok, fail) => { const s = document.createElement("script"); s.src = src; s.onload = ok; s.onerror = fail; document.head.appendChild(s); }); }
async function startLive() {
  if (liveOn) return; liveOn = true;
  const box = $("#livePlayer"), badge = $("#liveBadge"), L = CONFIG.aoVivo;
  box.querySelectorAll(":not(#liveBadge)").forEach(n => n.remove());
  const add = (html) => box.insertAdjacentHTML("beforeend", html);
  const offline = (msg) => { badge.classList.remove("on"); add(`<div class="scope" style="aspect-ratio:auto;height:100%;border-radius:0"><canvas data-thermal></canvas><div class="hud"><div class="tl"><span class="rec">Mapa de detecção · simulação</span></div><div class="tr" data-hot>--</div><div class="bl">${msg}</div></div></div>`); initThermals(box); };

  const acts = $("#liveActions"); acts.innerHTML = "";
  if (L.tipo === "twitch" && L.twitchCanal) {
    const canal = encodeURIComponent(L.twitchCanal), host = location.hostname;
    acts.innerHTML = `<a class="btn btn-fire btn-sm" href="https://www.twitch.tv/${canal}" target="_blank" rel="noopener"><span>${icon("radio")}</span>Abrir na Twitch</a>`;
    if (host) {
      add(`<iframe src="https://player.twitch.tv/?channel=${canal}&parent=${encodeURIComponent(host)}&muted=true" title="Transmissão ao vivo do drone na Twitch" allow="autoplay; fullscreen" allowfullscreen></iframe>`);
      badge.classList.add("on");
    } else {
      offline("Publique o site para ver a Twitch aqui — ou use o botão Abrir na Twitch");
    }
  } else if (L.tipo === "youtube" && (L.youtubeId || L.youtubeCanal)) {
    const src = L.youtubeId ? `https://www.youtube.com/embed/${encodeURIComponent(L.youtubeId)}?autoplay=1&mute=1`
                            : `https://www.youtube.com/embed/live_stream?channel=${encodeURIComponent(L.youtubeCanal)}&autoplay=1&mute=1`;
    add(`<iframe src="${src}" title="Transmissão ao vivo do drone" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`);
    badge.classList.add("on");
  } else if (L.tipo === "hls" && L.hlsUrl) {
    add(`<video id="liveVid" muted autoplay playsinline controls></video>`);
    const v = $("#liveVid");
    v.addEventListener("error", () => { v.remove(); offline("Transmissão offline — tentando de novo ao reabrir a página"); });
    if (v.canPlayType("application/vnd.apple.mpegurl")) { v.src = L.hlsUrl; }
    else {
      try {
        if (!window.Hls) await loadScript("https://cdn.jsdelivr.net/npm/hls.js@1.5.13/dist/hls.min.js");
        hlsObj = new Hls(); hlsObj.loadSource(L.hlsUrl); hlsObj.attachMedia(v);
        hlsObj.on(Hls.Events.ERROR, (_, d) => { if (d.fatal) { stopLive(); liveOn = true; offline("Transmissão offline"); } });
      } catch (e) { v.remove(); offline("Não foi possível carregar o player HLS"); }
    }
    badge.classList.add("on");
  } else if (L.tipo === "mjpeg" && L.mjpegUrl) {
    const img = new Image(); img.alt = "Câmera do drone ao vivo"; img.src = L.mjpegUrl;
    img.onerror = () => { img.remove(); offline("Câmera do Raspberry Pi não encontrada na rede"); };
    box.appendChild(img); badge.classList.add("on");
  } else {
    offline("Configure a transmissão em CONFIG.aoVivo");
  }
  $("#telNote").textContent = CONFIG.telemetriaSimulada ? "Dados simulados para demonstração." : "Dados recebidos do drone.";
}
function stopLive() {
  if (!liveOn) return; liveOn = false;
  if (hlsObj) { hlsObj.destroy(); hlsObj = null; }
  $("#livePlayer").querySelectorAll(":not(#liveBadge)").forEach(n => n.remove()); /* para o vídeo ao sair da página */
}
