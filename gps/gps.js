/* =====================================================================
   PÁGINA CONEXÃO › GPS (gps.html)
   Mapa ao vivo (Leaflet) com a posição que o Raspberry Pi grava no
   banco de dados (raspberry/enviar_gps.py → api/telemetria.php).
   ===================================================================== */
let mapa = null, marcador = null, rastro = null;
const MAX_PONTOS = 300;

function iniciarMapa() {
  const { lat, lon } = Telemetria.dados;
  if (!window.L) {   // Leaflet não carregou (sem internet?) → mapa simples
    const dlt = .01;
    $("#mapa").innerHTML = `<iframe title="Mapa" style="width:100%;height:100%;border:0" src="https://www.openstreetmap.org/export/embed.html?bbox=${lon - dlt}%2C${lat - dlt}%2C${lon + dlt}%2C${lat + dlt}&layer=mapnik&marker=${lat}%2C${lon}"></iframe>`;
    return;
  }
  mapa = L.map("mapa").setView([lat, lon], 16);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, attribution: "© OpenStreetMap" }).addTo(mapa);
  rastro = L.polyline([], { color: "#E2362B", weight: 3, opacity: .7 }).addTo(mapa);
  marcador = L.circleMarker([lat, lon], { radius: 9, color: "#fff", weight: 3, fillColor: "#E2362B", fillOpacity: 1 }).addTo(mapa).bindTooltip("GuardFlame");
}

function moverDrone(d) {
  $("#linkMaps").href = `https://www.google.com/maps?q=${d.lat},${d.lon}`;
  if (!mapa) return;
  const p = [d.lat, d.lon];
  marcador.setLatLng(p);
  const pts = rastro.getLatLngs();
  const ult = pts[pts.length - 1];
  if (!ult || ult.lat !== d.lat || ult.lng !== d.lon) { rastro.addLatLng(p); if (pts.length > MAX_PONTOS) rastro.setLatLngs(pts.slice(-MAX_PONTOS)); }
  if ($("#seguir").checked) mapa.panTo(p, { animate: true });
}

/* Trajeto recente gravado no banco */
async function carregarRastro() {
  const r = await api("telemetria.php?lista=" + MAX_PONTOS);
  if (r.ok && r.lista && r.lista.length && rastro) {
    rastro.setLatLngs(r.lista.slice().reverse().map(p => [+p.lat, +p.lon]));
  }
}

/* Envia um ponto de teste para o banco (confere se a API e a chave funcionam sem o drone) */
async function enviarTeste(e) {
  e.preventDefault();
  const chave = $("#chaveTeste").value.trim();
  if (!chave) return toast("Digite a chave da API");
  const { lat, lon } = CONFIG.mapa;
  const ponto = {
    lat: +(lat + (Math.random() - .5) * .004).toFixed(7), lon: +(lon + (Math.random() - .5) * .004).toFixed(7),
    altitude: 55 + Math.round(Math.random() * 10), velocidade: 8, bateria: 80, satelites: 9, status: "Teste"
  };
  const r = await api("telemetria.php", { method: "POST", headers: { "Content-Type": "application/json", "X-Chave": chave }, body: JSON.stringify(ponto) });
  const msg = $("#testeMsg");
  msg.className = "msg " + (r.ok ? "ok" : "err");
  msg.textContent = r.ok ? `Ponto gravado no banco (${ponto.lat}, ${ponto.lon}). Em até 2 s ele aparece no mapa.` : r.erro;
  if (r.ok) { Telemetria.proximaApi = 0; Telemetria.atualizar(); }
}

iniciarPagina("conexao", () => {
  montarSubmenu("gps");
  iniciarMapa();
  Telemetria.ao((d) => { moverDrone(d); $("#apiErro").textContent = Telemetria.fonte === "drone" ? "" : Telemetria.erro; });
  Telemetria.iniciar();
  carregarRastro();

  $("#centralizar").addEventListener("click", () => { if (mapa) mapa.setView([Telemetria.dados.lat, Telemetria.dados.lon], 17); });
  $("#formTeste").addEventListener("submit", enviarTeste);
});
