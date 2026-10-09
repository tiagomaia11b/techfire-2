/* =====================================================================
   PÁGINA MANUAL (manual.html)
   [título, descrição, etiqueta, página relacionada (opcional)]
   ===================================================================== */
const PASSOS = [
  ["Ligar o drone", "Encaixe a bateria LiPo 4S. A Pixhawk faz os bipes de inicialização e o Raspberry Pi liga junto, alimentado pelo BEC.", "Tempo: 1 min"],
  ["Conectar ao sistema", "O modem 4G conecta o Raspberry Pi à internet sozinho. Entre no painel do site com seu e-mail e senha.", "Internet 4G"],
  ["Iniciar a missão", "Defina a rota da área no Mission Planner ou QGroundControl e decole. A Pixhawk segue o trajeto pelo GPS.", "Altitude: 50–80 m"],
  ["Visualizar GPS", "Acompanhe a posição do drone no mapa, enviada pela Pixhawk ao banco de dados a cada segundo.", "GPS NEO-6M", "gps/gps.html"],
  ["Acompanhar a câmera", "Assista ao vídeo ao vivo da câmera de 12 MP, transmitido pela Twitch. A IA marca na imagem tudo que parece fogo ou fumaça.", "Ao vivo", "aovivo/aovivo.html"],
  ["Receber alertas", "Ao detectar um foco, o painel mostra o alerta com o local, a confiança da IA e o horário.", "Alerta em segundos"],
  ["Avisar por voz", "Use os alto-falantes do drone para orientar quem está na área. O drone também obedece comandos de voz treinados.", "Áudio"],
  ["Consultar relatórios", "Veja o histórico de voos e ocorrências gravado no banco de dados para planejar a prevenção.", "Banco de dados", "experiencia/experiencia.html"]
];

iniciarPagina("manual", () => {
  $("#stepsList").innerHTML = PASSOS.map(([t, d, tag, link]) => `
    <div class="step"><div><h3>${t}</h3><p>${d}</p><span class="tag leaf">${tag}</span>${link ? `<a class="ir" href="${RAIZ + link}">Abrir página →</a>` : ""}</div></div>`).join("");
  renderVideosFixos();
});
