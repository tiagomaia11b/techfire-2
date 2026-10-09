/* ---------- DADOS DAS PÁGINAS ---------- */
const PASSOS = [
  ["Ligar o drone", "Encaixe a bateria LiPo 4S. A Pixhawk faz os bipes de inicialização e o Raspberry Pi liga junto, alimentado pelo BEC.", "Tempo: 1 min"],
  ["Conectar ao sistema", "O modem 4G conecta o Raspberry Pi à internet sozinho. Entre no painel do site com seu e-mail e senha.", "Internet 4G"],
  ["Iniciar a missão", "Defina a rota da área no Mission Planner ou QGroundControl e decole. A Pixhawk segue o trajeto pelo GPS.", "Altitude: 50–80 m"],
  ["Visualizar GPS", "Acompanhe a posição do drone no mapa, enviada pela Pixhawk a cada segundo.", "GPS NEO-6M"],
  ["Acompanhar a câmera", "Assista ao vídeo ao vivo da câmera de 12 MP. A IA marca na imagem tudo que parece fogo ou fumaça.", "Ao vivo"],
  ["Receber alertas", "Ao detectar um foco, o painel mostra o alerta com o local, a confiança da IA e o horário.", "Alerta em segundos"],
  ["Avisar por voz", "Use os alto-falantes do drone para orientar quem está na área. O drone também obedece comandos de voz treinados.", "Áudio"],
  ["Consultar relatórios", "Veja o histórico de voos e ocorrências para planejar a prevenção.", "Banco de dados"]
];

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

const REFS = [
  { cat: "Drones e tecnologia UAV", icon: "drone", itens: [
    ["VALAVANIS, K. P.; VACHTSEVANOS, G. J. (org.).", "Handbook of Unmanned Aerial Vehicles. Dordrecht: Springer, 2015.", ""],
    ["YUAN, C.; ZHANG, Y.; LIU, Z.", "A survey on technologies for automatic forest fire monitoring, detection, and fighting using unmanned aerial vehicles and remote sensing techniques. Canadian Journal of Forest Research, v. 45, n. 7, 2015.", ""]
  ]},
  { cat: "Pixhawk e controle de voo", icon: "chip", itens: [
    ["ARDUPILOT.", "ArduPilot Copter Documentation.", "https://ardupilot.org/copter/"],
    ["PX4.", "PX4 Autopilot User Guide.", "https://docs.px4.io/"]
  ]},
  { cat: "Raspberry Pi e câmera", icon: "eye", itens: [
    ["UPTON, E.; HALFACREE, G.", "Raspberry Pi: manual do usuário. São Paulo: Novatec, 2013.", ""],
    ["RASPBERRY PI LTD.", "Camera software documentation.", "https://www.raspberrypi.com/documentation/computers/camera_software.html"],
    ["ARDUCAM.", "12MP IMX708 Camera Module documentation.", "https://docs.arducam.com/Raspberry-Pi-Camera/Native-camera/12MP-IMX708/"]
  ]},
  { cat: "Visão computacional", icon: "eye", itens: [
    ["OPENCV.", "OpenCV Documentation.", "https://docs.opencv.org/"],
    ["ALLISON, R. S. et al.", "Airborne optical and thermal remote sensing for wildfire detection and monitoring. Sensors, v. 16, n. 8, 2016.", ""]
  ]},
  { cat: "Sistemas GPS", icon: "pin", itens: [
    ["KAPLAN, E. D.; HEGARTY, C. J.", "Understanding GPS/GNSS: principles and applications. 3. ed. Boston: Artech House, 2017.", ""]
  ]},
  { cat: "Áudio e reconhecimento de voz", icon: "mic", itens: [
    ["ADAFRUIT.", "Adafruit MAX98357 I2S Class-D Mono Amp.", "https://learn.adafruit.com/adafruit-max98357-i2s-class-d-mono-amp"],
    ["ELECHOUSE.", "Voice Recognition Module V3 – manual.", "https://www.elechouse.com/product/speak-recognition-voice-recognition-module-v3/"]
  ]},
  { cat: "Monitoramento ambiental", icon: "tree", itens: [
    ["INPE – Instituto Nacional de Pesquisas Espaciais.", "Programa Queimadas: monitoramento de focos.", "https://terrabrasilis.dpi.inpe.br/queimadas/portal/"]
  ]},
  { cat: "MySQL e banco de dados", icon: "db", itens: [
    ["MILANI, A.", "MySQL: guia do programador. São Paulo: Novatec, 2006.", ""],
    ["ORACLE.", "MySQL Reference Manual.", "https://dev.mysql.com/doc/"]
  ]}
];

const JORNADA = [
  ["Cadastro", "Cria a conta no site"], ["Login", "Entra no painel"], ["Conexão", "Liga e conecta o drone"], ["Voo", "Define a área e decola"],
  ["Monitoramento", "Acompanha vídeo e calor"], ["Alerta", "Recebe aviso de foco"], ["Registro", "Confirma a ocorrência"], ["Relatório", "Consulta o histórico"]
];

const HISTORICO = [
  ["04/10/2026 14:32", "-23.5612, -46.6401", "94%", "Em atendimento", ""],
  ["02/10/2026 11:05", "-23.5487, -46.6218", "88%", "Controlado", "leaf"],
  ["28/09/2026 16:47", "-23.5701, -46.6550", "61%", "Falso alarme", "amber"],
  ["25/09/2026 09:18", "-23.5399, -46.6102", "97%", "Controlado", "leaf"],
  ["21/09/2026 15:56", "-23.5823, -46.6489", "90%", "Controlado", "leaf"]
];
