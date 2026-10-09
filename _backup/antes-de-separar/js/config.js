/* =====================================================================
   CONFIGURAÇÃO — É SÓ EDITAR AQUI
   ===================================================================== */
const CONFIG = {
  escola: "Nome da sua escola",
  ano: 2026,
  emailContato: "contato@techfire.com",   // para onde o formulário de contato envia
  exigirLogin: true,                       // false = o site abre sem precisar entrar

  /* ---------- CONTAS DA EQUIPE ----------
     Funcionam em qualquer computador e navegador, sem precisar criar conta.
     Atenção: qualquer pessoa que abrir este arquivo consegue ver estas senhas.
     Contas criadas pelo botão "Criar conta" ficam salvas só no navegador onde foram criadas. */
  contas: [
    { nome: "Tiago Maia",     email: "tiago@techfire.com",   senha: "guardflame" },
    { nome: "Lucca Carvalho", email: "lucca@techfire.com",   senha: "guardflame" },
    { nome: "Melissa Fontes", email: "melissa@techfire.com", senha: "guardflame" }
  ],

  /* ---------- AO VIVO ----------
     tipo: "youtube"  -> live do YouTube (mais fácil, funciona em qualquer hospedagem)
           "hls"      -> link .m3u8 (servidor próprio, MediaMTX, etc.)
           "mjpeg"    -> câmera do Raspberry Pi na mesma rede (mjpg-streamer / motion)
           "twitch"   -> canal da Twitch (coloque o nome em twitchCanal)
           "nenhum"   -> mostra o mapa de detecção simulado                       */
  aoVivo: {
    tipo: "nenhum",
    twitchCanal: "",        // nome do canal, ex.: "techfire_guardflame"
    youtubeId: "",          // ID do vídeo da live, ex.: "dQw4w9WgXcQ"
    youtubeCanal: "",       // OU o ID do canal (UC...), mostra a live atual do canal
    hlsUrl: "",             // ex.: "https://seu-servidor/drone/index.m3u8"
    mjpegUrl: ""            // ex.: "http://192.168.0.50:8080/?action=stream"
  },
  telemetriaSimulada: true,

  /* ---------- VÍDEOS GRAVADOS ----------
     Use "arquivo" (MP4 na pasta videos/) OU "youtube" (ID do vídeo).          */
  videos: [
    { titulo: "Primeiro voo de teste",   descricao: "Calibração e decolagem.",           arquivo: "videos/voo-01.mp4", capa: "", youtube: "" },
    { titulo: "Detecção de foco",        descricao: "A IA marca o fogo e a fumaça na imagem.", arquivo: "videos/voo-02.mp4", capa: "", youtube: "" },
    { titulo: "Voo de patrulha",         descricao: "Rota completa sobre a área de teste.", arquivo: "videos/voo-03.mp4", capa: "", youtube: "" }
  ],
  videoManual: { arquivo: "videos/manual.mp4", youtube: "" },
  videoJogo:   { arquivo: "videos/jogo.mp4",   youtube: "" },
  linkJogo: "#",            // link para jogar (itch.io, GitHub Pages, etc.)

  /* ---------- EQUIPE ---------- (foto: "img/nome.jpg" ou deixe vazio) */
  equipe: [
    { nome: "Tiago Maia",      funcao: "Programação e banco de dados", foto: "" },
    { nome: "Lucca Carvalho",  funcao: "Hardware e montagem do drone",  foto: "" },
    { nome: "Melissa Fontes",  funcao: "Design e site",                 foto: "" }
  ],
  sobre: "O TechFire GuardFlame é um Trabalho de Conclusão de Curso: um drone F450 com controladora Pixhawk, Raspberry Pi 4, câmera Arducam de 12 MP, GPS e internet 4G que detecta focos de incêndio florestal, transmite o voo ao vivo e avisa as pessoas da área por voz.",

  precoKit: "",   // vazio = soma automática dos componentes
  mapa: { lat: -23.5505, lon: -46.6333 }   // posição inicial do drone no mapa
};
