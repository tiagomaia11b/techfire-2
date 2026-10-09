/* =====================================================================
   TRANSMISSÃO AO VIVO — usado pelas páginas Ao vivo e Câmera
   Mostra no player a fonte configurada em CONFIG.aoVivo (Twitch, YouTube,
   HLS ou MJPEG). Sem transmissão, mostra o aviso "Transmissão offline".

   HTML esperado:
   <div class="player" id="livePlayer"><span class="live-badge">AO VIVO</span></div>
   ===================================================================== */
const Transmissao = {
  hls: null,

  /* Tem como mostrar a Twitch aqui? (a Twitch só aceita sites publicados ou localhost) */
  twitchPossivel: () => !!location.hostname,

  async iniciar(box, L = CONFIG.aoVivo, acts = null) {
    this.parar(box);
    const badge = box.querySelector(".live-badge");
    const add = (html) => box.insertAdjacentHTML("beforeend", html);
    const offline = (msg) => {
      badge.classList.remove("on");
      add(`<div class="empty"><div><span class="off-ic">${icon("radio")}</span><b>Transmissão offline</b>${msg}</div></div>`);
    };
    if (acts) acts.innerHTML = "";

    if (L.tipo === "twitch" && L.twitchCanal) {
      const canal = encodeURIComponent(L.twitchCanal.trim().toLowerCase());
      if (acts) acts.innerHTML = `<a class="btn btn-fire btn-sm" href="https://www.twitch.tv/${canal}" target="_blank" rel="noopener"><span>${icon("radio")}</span>Abrir na Twitch</a>`;
      if (this.twitchPossivel()) {
        add(`<iframe src="https://player.twitch.tv/?channel=${canal}&parent=${encodeURIComponent(location.hostname)}&muted=true" title="Transmissão ao vivo do drone na Twitch" allow="autoplay; fullscreen" allowfullscreen></iframe>`);
        badge.classList.add("on");
      } else {
        offline("Publique o site (ou abra pelo XAMPP) para ver a Twitch aqui — ou use o botão Abrir na Twitch");
      }
    } else if (L.tipo === "youtube" && (L.youtubeId || L.youtubeCanal)) {
      const src = L.youtubeId ? `https://www.youtube.com/embed/${encodeURIComponent(L.youtubeId)}?autoplay=1&mute=1`
                              : `https://www.youtube.com/embed/live_stream?channel=${encodeURIComponent(L.youtubeCanal)}&autoplay=1&mute=1`;
      add(`<iframe src="${src}" title="Transmissão ao vivo do drone" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`);
      badge.classList.add("on");
    } else if (L.tipo === "hls" && L.hlsUrl) {
      add(`<video muted autoplay playsinline controls></video>`);
      const v = box.querySelector("video");
      v.addEventListener("error", () => { v.remove(); offline("Transmissão offline — tentando de novo ao reabrir a página"); });
      if (v.canPlayType("application/vnd.apple.mpegurl")) { v.src = L.hlsUrl; }
      else {
        try {
          if (!window.Hls) await carregarScript("https://cdn.jsdelivr.net/npm/hls.js@1.5.13/dist/hls.min.js");
          this.hls = new Hls(); this.hls.loadSource(L.hlsUrl); this.hls.attachMedia(v);
          this.hls.on(Hls.Events.ERROR, (_, d) => { if (d.fatal) { this.parar(box); offline("Transmissão offline"); } });
        } catch (e) { v.remove(); offline("Não foi possível carregar o player HLS"); }
      }
      badge.classList.add("on");
    } else if (L.tipo === "mjpeg" && L.mjpegUrl) {
      const img = new Image(); img.alt = "Câmera do drone ao vivo"; img.src = L.mjpegUrl;
      img.onerror = () => { img.remove(); offline("Câmera do Raspberry Pi não encontrada na rede"); };
      box.appendChild(img); badge.classList.add("on");
    } else {
      offline(L.tipo === "twitch" ? "Coloque o nome do canal da Twitch na página Conexão › Câmera" : "Configure a transmissão em CONFIG.aoVivo");
    }
  },

  parar(box) {
    if (this.hls) { this.hls.destroy(); this.hls = null; }
    box.querySelectorAll(":scope > :not(.live-badge)").forEach(n => n.remove());
  }
};

function carregarScript(src) {
  return new Promise((ok, falha) => { const s = document.createElement("script"); s.src = src; s.onload = ok; s.onerror = falha; document.head.appendChild(s); });
}
