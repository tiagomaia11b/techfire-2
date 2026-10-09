/* =====================================================================
   PÁGINA CONEXÃO › CÂMERA (camera.html)
   O Raspberry Pi transmite a câmera para a Twitch e o site mostra o
   canal nas páginas Ao vivo e Câmera.
   Para valer para todos os visitantes: coloque o canal em
   CONFIG.aoVivo.twitchCanal (js/config.js).
   ===================================================================== */
const limparCanal = (s) => s.trim().replace(/^https?:\/\/(www\.)?twitch\.tv\//i, "").replace(/[/?#].*$/, "").toLowerCase();

function testarCanal() {
  const canal = limparCanal($("#canal").value);
  $("#canal").value = canal;
  Transmissao.iniciar($("#livePlayer"), { tipo: "twitch", twitchCanal: canal }, $("#liveActions"));
  verificar(canal);
}

function verificar(canal) {
  const local = ajustesLocais().twitchCanal;
  const host = location.hostname, https = location.protocol === "https:" || host === "localhost" || host === "127.0.0.1";
  const itens = [
    [canal ? "ok" : "err", canal ? `Canal da Twitch: <b>${esc(canal)}</b>` : "Digite o nome do canal da Twitch."],
    [host ? "ok" : "err", host ? "Site aberto por um endereço (" + esc(host) + ")." : "O site foi aberto direto do arquivo. A Twitch só mostra o player em site publicado ou em <code class=\"inline\">http://localhost</code> (XAMPP)."],
    [!host ? "warn" : https ? "ok" : "warn", https ? "Conexão segura (https ou localhost)." : "A Twitch exige <b>https</b> quando o site não está em localhost."],
    [local ? "warn" : canal ? "ok" : "warn", local ? "Canal salvo só neste navegador. Para todos verem, copie a linha abaixo para o <code class=\"inline\">js/config.js</code>." : canal ? "Canal configurado no js/config.js (vale para todos)." : "Depois de testar, coloque o canal no js/config.js."]
  ];
  $("#checks").innerHTML = itens.map(([c, t]) => `<li class="${c}"><span>${t}</span></li>`).join("");
  $("#linhaConfig").textContent = `twitchCanal: "${canal || "nome_do_canal"}",`;
}

iniciarPagina("conexao", () => {
  montarSubmenu("camera");
  $("#canal").value = CONFIG.aoVivo.twitchCanal || "";

  $("#formCanal").addEventListener("submit", e => { e.preventDefault(); testarCanal(); });
  $("#salvarCanal").addEventListener("click", () => {
    const canal = limparCanal($("#canal").value);
    if (!canal) return toast("Digite o nome do canal primeiro");
    store.set("gf_conexao", { ...ajustesLocais(), twitchCanal: canal });
    CONFIG.aoVivo.tipo = "twitch"; CONFIG.aoVivo.twitchCanal = canal;
    testarCanal(); toast("Salvo neste navegador — a página Ao vivo já usa este canal");
  });
  $("#limparCanal").addEventListener("click", () => {
    const a = ajustesLocais(); delete a.twitchCanal; store.set("gf_conexao", a);
    toast("Ajuste local apagado"); setTimeout(() => location.reload(), 600);
  });

  testarCanal();
});
