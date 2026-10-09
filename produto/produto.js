/* =====================================================================
   PÁGINA PRODUTO (produto.html)
   ===================================================================== */
/* Valores aproximados de mercado (2026). Troque pelos que vocês pagaram. */
const PRODUTOS = [
  { n: "Frame F450", d: "Estrutura do drone, com placa de distribuição de energia integrada.", s: ["450 mm entre eixos", "Braços de nylon reforçado", "Suporta hélices de até 10\""], p: 120, c: "#4B5563", i: "drone" },
  { n: "Motores brushless (x4)", d: "Geram a sustentação e o movimento do drone.", s: ["Sem escovas, longa vida útil", "Um por braço", "Sentidos horário e anti-horário"], p: 240, c: "#0891B2", i: "zap" },
  { n: "ESCs 60 A (x4)", d: "Controlam a velocidade de cada motor a partir da Pixhawk.", s: ["Corrente de 60 A", "Compatível com 4S", "Sobra de potência e segurança"], p: 320, c: "#7C3AED", i: "zap" },
  { n: "Bateria LiPo 4S", d: "Fonte de energia de todo o drone.", s: ["14,8 V nominal", "Alta descarga", "Conector XT60"], p: 450, c: "#CA8A04", i: "battery" },
  { n: "Pixhawk 2.4.8", d: "Controladora de voo: estabiliza o drone e executa a rota.", s: ["Processador ARM de 32 bits", "Firmware ArduPilot ou PX4", "Giroscópio, barômetro e bússola"], p: 750, c: "#DC2626", i: "chip" },
  { n: "Raspberry Pi 4", d: "Processa a imagem com IA, transmite o vídeo e cuida do áudio.", s: ["4 núcleos de 1,5 GHz", "Codificador de vídeo H.264", "Wi-Fi, Bluetooth e USB 3.0"], p: 650, c: "#DB2777", i: "chip" },
  { n: "Câmera Arducam IMX708", d: "Filma o voo e alimenta a detecção de fogo e fumaça.", s: ["12 MP (4608×2592)", "Foco automático PDAF", "Modo HDR"], p: 350, c: "#EA580C", i: "eye" },
  { n: "GPS NEO-6M", d: "Informa a posição do drone e de cada foco.", s: ["Ligado à Pixhawk", "Precisão de ~2,5 m", "Antena cerâmica"], p: 60, c: "#16A34A", i: "pin" },
  { n: "Modem 4G USB", d: "Conecta o drone à internet durante o voo.", s: ["Ligado no USB do Pi", "Usa chip de celular", "Envia vídeo e alertas"], p: 180, c: "#2563EB", i: "radio" },
  { n: "Microfone USB", d: "Capta o som ao redor do drone.", s: ["Plug and play no Pi", "Áudio na transmissão", "Escuta pedidos de ajuda"], p: 40, c: "#059669", i: "mic" },
  { n: "Alto-falantes (x2)", d: "Emitem avisos sonoros para quem está na área.", s: ["4 a 8 Ω", "Avisos de evacuação", "Leves e compactos"], p: 30, c: "#9333EA", i: "speaker" },
  { n: "Amplificador MAX98357A", d: "Recebe o áudio digital do Pi e aciona o alto-falante.", s: ["Até 3,2 W em 4 Ω", "Entrada I2S digital", "Classe D, mono"], p: 35, c: "#BE185D", i: "speaker" },
  { n: "Módulo de reconhecimento de voz", d: "Reconhece comandos falados sem precisar de internet.", s: ["Até 80 comandos gravados", "7 ativos ao mesmo tempo", "Comunicação serial (UART)"], p: 150, c: "#0D9488", i: "mic" },
  { n: "BEC", d: "Reduz a tensão da bateria para os 5 V do Raspberry Pi.", s: ["Saída de 5 V", "Protege a eletrônica", "Alimenta o Pi no ar"], p: 40, c: "#475569", i: "power" },
  { n: "Hélices", d: "Transformam o giro dos motores em sustentação.", s: ["Pares horário e anti-horário", "Tamanho para F450", "Tenha peças reserva"], p: 40, c: "#65A30D", i: "drone" },
  { n: "Cabos e conectores", d: "Ligam todas as partes do sistema.", s: ["XT60, JST e jumpers", "Cabo flat da câmera", "Termorretrátil"], p: 80, c: "#57534E", i: "link" }
];
const brl = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

iniciarPagina("produto", () => {
  $("#prodList").innerHTML = PRODUTOS.map(p => `
    <article class="card prod"><div class="top" style="background:${p.c}">${icon(p.i)}</div>
      <div class="body"><h3>${p.n}</h3><p class="muted" style="font-size:.9rem">${p.d}</p>
      <ul>${p.s.map(x => `<li>${x}</li>`).join("")}</ul><div class="price num">${brl(p.p)}</div></div></article>`).join("");
  $("#kitPrice").textContent = CONFIG.precoKit || brl(PRODUTOS.reduce((t, p) => t + p.p, 0));
});
