/* =====================================================================
   TELEMETRIA — GPS, bateria, altitude e velocidade do drone
   Lê a última posição gravada no banco (api/telemetria.php, enviada pelo
   Raspberry Pi com raspberry/enviar_gps.py). Se o drone não estiver
   enviando, simula os dados (CONFIG.telemetria = "auto").

   Qualquer elemento com data-tel="..." é atualizado sozinho:
   status, bat, alt, vel, tmax, sinal, gps, sat, hora, fonte
   ===================================================================== */
const Telemetria = {
  dados: { lat: CONFIG.mapa.lat, lon: CONFIG.mapa.lon, alt: 60, vel: 8, bateria: 87, satelites: null, status: "Em voo", idade: null },
  fonte: "simulada",          // "drone" | "simulada" | "sem-sinal"
  erro: "",
  ouvintes: [],
  proximaApi: 0,              // quando a API falha, espera um pouco antes de tentar de novo

  /* Chama fn(dados, fonte) a cada atualização */
  ao(fn) { this.ouvintes.push(fn); },

  iniciar() {
    if (this.timer) return;
    this.atualizar();
    this.timer = setInterval(() => this.atualizar(), 2000);
  },

  async atualizar() {
    if (this.ocupado) return;
    this.ocupado = true;
    let r = null;
    if (CONFIG.telemetria !== "simulada" && Date.now() >= this.proximaApi) {
      r = await api("telemetria.php");
      if (!r.ok) { this.erro = r.erro || "Erro na API"; this.proximaApi = Date.now() + 30000; }
    }
    this.ocupado = false;

    if (r && r.ok && r.ultimo) {
      const u = r.ultimo;
      Object.assign(this.dados, {
        lat: +u.lat, lon: +u.lon, alt: +u.altitude || 0, vel: +u.velocidade || 0,
        bateria: u.bateria == null ? null : +u.bateria, satelites: u.satelites, status: u.status || "Em voo", idade: +u.idade
      });
      this.fonte = this.dados.idade <= 15 ? "drone" : "sem-sinal";
      this.erro = "";
    } else if (CONFIG.telemetria === "drone") {
      if (r && r.ok) this.erro = "O banco ainda não recebeu nenhuma posição do drone.";
      this.fonte = "sem-sinal";
    } else {
      this.simular();
      this.fonte = "simulada";
    }
    this.mostrar();
    this.ouvintes.forEach(fn => fn(this.dados, this.fonte));
  },

  simular() {
    const d = this.dados;
    d.bateria = Math.max(15, (d.bateria ?? 87) - .1);
    d.alt = 58 + Math.round(Math.random() * 5);
    d.vel = 7 + Math.round(Math.random() * 3);
    d.lat += (Math.random() - .5) * .0004; d.lon += (Math.random() - .5) * .0004;
    d.satelites = 9; d.status = "Em voo"; d.idade = 0;
  },

  mostrar() {
    const d = this.dados, f = this.fonte;
    const conf = typeof Thermal !== "undefined" ? Thermal.ultimaConf : null;
    const vals = {
      status: f === "sem-sinal" ? "Sem sinal" : d.status,
      bat: d.bateria == null ? "--" : Math.round(d.bateria) + "%",
      alt: Math.round(d.alt) + " m",
      vel: Math.round(d.vel) + " km/h",
      tmax: conf != null ? (conf >= 60 ? "Fogo " + conf + "%" : "Nenhum") : "--",
      sinal: f === "drone" ? "4G" : f === "simulada" ? "Simulação" : "Sem sinal",
      gps: d.lat.toFixed(5) + ", " + d.lon.toFixed(5),
      sat: d.satelites == null ? "--" : d.satelites,
      hora: d.idade == null ? "--" : d.idade < 3 ? "agora" : tempoAtras(d.idade),
      fonte: f === "drone" ? "Dados recebidos do drone pelo banco de dados." : f === "simulada" ? "Dados simulados — o drone não está enviando GPS." : "Drone sem sinal — mostrando a última posição recebida."
    };
    $$("[data-tel]").forEach(el => { const k = el.dataset.tel; if (k in vals) el.textContent = vals[k]; });
    $$("[data-tel-pill]").forEach(el => {
      el.className = "pill " + (f === "drone" ? "ok" : f === "simulada" ? "warn" : "err");
      el.textContent = f === "drone" ? "Drone conectado" : f === "simulada" ? "Simulação" : "Sem sinal";
    });
  }
};

function tempoAtras(seg) {
  seg = Math.round(seg);
  if (seg < 60) return "há " + seg + " s";
  if (seg < 3600) return "há " + Math.round(seg / 60) + " min";
  if (seg < 86400) return "há " + Math.round(seg / 3600) + " h";
  return "há " + Math.round(seg / 86400) + " dias";
}
