/* =====================================================================
   CONFIGURAÇÃO — É SÓ EDITAR AQUI
   ===================================================================== */
const CONFIG = {
  escola: "Nome da sua escola",
  ano: 2026,
  emailContato: "contato@techfire.com",   // para onde o formulário de contato envia
  exigirLogin: true,                       // false = o site abre sem precisar entrar
  dono: "tiago@techfire.com",             // só esta conta vê a página "Meu guia" (guia/guia.html)

  /* ---------- CONTAS DA EQUIPE ----------
     Funcionam em qualquer computador e navegador, sem precisar criar conta.
     Atenção: qualquer pessoa que abrir este arquivo consegue ver estas senhas.
     Contas criadas pelo botão "Criar conta" ficam salvas só no navegador onde foram criadas. */
  contas: [
    { nome: "Tiago Maia",     email: "tiago@techfire.com",   senha: "guardflame" },
    { nome: "Lucca Carvalho", email: "lucca@techfire.com",   senha: "guardflame" },
    { nome: "Melissa Fontes", email: "melissa@techfire.com", senha: "guardflame" }
  ],

  /* ---------- AO VIVO (CÂMERA) ----------
     O Raspberry Pi transmite a câmera para a Twitch (script raspberry/transmitir_twitch.sh)
     e o site mostra a transmissão. Veja o passo a passo na página Conexão > Câmera.
     tipo: "twitch"   -> canal da Twitch (coloque o nome em twitchCanal)
           "youtube"  -> live do YouTube
           "hls"      -> link .m3u8 (servidor próprio, MediaMTX, etc.)
           "mjpeg"    -> câmera do Raspberry Pi na mesma rede (mjpg-streamer / motion)
           "nenhum"   -> mostra o mapa de detecção simulado                       */
  aoVivo: {
    tipo: "twitch",
    twitchCanal: "",        // nome do canal, ex.: "techfire_guardflame" (o que aparece em twitch.tv/NOME)
    youtubeId: "",          // ID do vídeo da live, ex.: "dQw4w9WgXcQ"
    youtubeCanal: "",       // OU o ID do canal (UC...), mostra a live atual do canal
    hlsUrl: "",             // ex.: "https://seu-servidor/drone/index.m3u8"
    mjpegUrl: ""            // ex.: "http://192.168.0.50:8080/?action=stream"
  },

  /* ---------- BANCO DE DADOS E GPS ----------
     O Raspberry Pi envia o GPS para api/telemetria.php, que grava no MySQL.
     As senhas do banco ficam em api/conexao.php (nunca aqui).
     Veja o passo a passo nas páginas Conexão > GPS e Conexão > Banco de dados. */
  api: {
    url: "api/"             // pasta dos arquivos PHP (relativa ao site) ou endereço completo, ex.: "https://meusite.com/api/"
  },
  telemetria: "auto",       // "auto" = dados do drone quando ele estiver enviando, senão simulação
                            // "drone" = só dados reais · "simulada" = sempre simulação

  /* ---------- VÍDEOS E FOTOS DA MONTAGEM (página Ao vivo) ----------
     tipo "foto":  arquivo na pasta img/montagem/ (JPG ou PNG)
     tipo "video": arquivo MP4 na pasta videos/ OU "youtube" (ID do vídeo)
     Adicione quantos quiser, um por linha.                                     */
  montagem: [
    { tipo: "foto",  titulo: "Peças do drone",          descricao: "Todos os componentes antes da montagem.",      arquivo: "img/montagem/foto-01.jpg" },
    { tipo: "foto",  titulo: "Frame e motores",         descricao: "Montagem do frame F450 e fixação dos motores.", arquivo: "img/montagem/foto-02.jpg" },
    { tipo: "foto",  titulo: "Pixhawk e Raspberry Pi",  descricao: "Ligação da controladora, do Pi e do GPS.",       arquivo: "img/montagem/foto-03.jpg" },
    { tipo: "video", titulo: "Montagem completa",       descricao: "O passo a passo da montagem do GuardFlame.",    arquivo: "videos/montagem-01.mp4", capa: "", youtube: "" },
    { tipo: "video", titulo: "Ligando a câmera e o 4G", descricao: "Instalação da Arducam e do modem 4G.",          arquivo: "videos/montagem-02.mp4", capa: "", youtube: "" }
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
  mapa: { lat: -23.6664, lon: -46.7831, local: "UNASP SP" }   // onde o drone está (UNASP – Campus São Paulo)
};
