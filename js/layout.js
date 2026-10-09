/* =====================================================================
   TOPO E RODAPÉ — escritos uma vez só e colocados em todas as páginas.
   Cada página do site é um arquivo próprio (pasta/pasta.html).
   Para mudar o menu, edite aqui.
   ===================================================================== */
const MENU = [
  ["home",        "Início",      "index.html"],
  ["aovivo",      "Ao vivo",     "aovivo/aovivo.html"],
  ["manual",      "Manual",      "manual/manual.html"],
  ["produto",     "Produto",     "produto/produto.html"],
  ["equipe",      "Quem somos",  "equipe/equipe.html"],
  ["referencias", "Referências", "referencias/referencias.html"],
  ["jogo",        "Jogo",        "jogo/jogo.html"],
  ["ux",          "Experiência", "experiencia/experiencia.html"],
  ["conexao",     "Conexão",     "camera/camera.html"]
];
/* Página só do dono do site (CONFIG.dono): aparece no menu apenas para ele */
const GUIA = ["guia", "Meu guia", "guia/guia.html"];

/* Páginas de conexão do drone: ficam juntas no item "Conexão" do menu, com abas */
const CONEXAO = [
  ["camera", "Câmera",          "camera/camera.html", "eye"],
  ["gps",    "GPS",             "gps/gps.html",       "pin"],
  ["banco",  "Banco de dados",  "banco/banco.html",   "db"]
];

function linkPara(pg) {
  const item = MENU.find(m => m[0] === pg);
  return RAIZ + (item ? item[2] : "index.html");
}
const linkMenu = ([pg, nome, arq]) => `<a href="${RAIZ + arq}" data-pg="${pg}"${pg === "aovivo" ? ' class="live"' : pg === "guia" ? ' class="dono"' : ""}>${nome}</a>`;

function montarLayout(ativo) {
  $("#topo").outerHTML = `
<header class="topbar">
  <div class="wrap">
    <a class="brand" href="${linkPara("home")}"><span class="mark" data-icon="flame"></span>TechFire</a>
    <nav class="nav" id="nav" aria-label="Principal">${(ehDono() ? MENU.concat([GUIA]) : MENU).map(linkMenu).join("")}</nav>
    <div class="tools">
      <span class="user-chip" id="userChip"></span>
      <button class="icon-btn theme-btn" data-theme-toggle aria-label="Alternar modo claro/escuro">
        <span class="moon" data-icon="moon"></span><span class="sun" data-icon="sun"></span>
      </button>
      <button class="icon-btn" id="logoutBtn" aria-label="Sair da conta" title="Sair"><span data-icon="logout"></span></button>
      <button class="icon-btn menu-btn" id="menuBtn" aria-label="Abrir menu" aria-expanded="false"><span data-icon="menu"></span></button>
    </div>
  </div>
</header>`;

  $("#rodape").outerHTML = `
<footer class="site-foot">
  <div class="wrap">
    <div class="cols">
      <div><a class="brand" href="${linkPara("home")}" style="color:var(--ink);padding:0"><span class="mark" data-icon="flame"></span>TechFire</a><p class="muted" style="margin-top:12px;max-width:34ch">Sistema de monitoramento de incêndios florestais com drone, inteligência artificial, GPS e transmissão 4G.</p></div>
      <div><h4>Páginas</h4>${MENU.slice(0, 5).map(linkMenu).join("")}</div>
      <div><h4>Projeto</h4>${MENU.slice(5, 8).map(linkMenu).join("")}${CONEXAO.map(([pg, nome, arq]) => `<a href="${RAIZ + arq}">${nome}</a>`).join("")}</div>
    </div>
    <div class="copy">© ${CONFIG.ano} TechFire · Trabalho de Conclusão de Curso · ${esc(CONFIG.escola)}</div>
  </div>
</footer>
<div class="toast" id="toast" role="status" aria-live="polite"></div>`;

  const s = sessao();
  $("#userChip").textContent = s ? "Olá, " + s.nome.split(" ")[0] : "";
  $("#logoutBtn").style.display = s ? "" : "none";
  $("#logoutBtn").addEventListener("click", () => { store.del("gf_sessao"); avisoDepois("Você saiu da conta."); location.href = RAIZ + "login/login.html"; });
  $("#menuBtn").addEventListener("click", () => {
    const open = $("#nav").classList.toggle("open"); $("#menuBtn").setAttribute("aria-expanded", open);
  });
  $$("#nav a").forEach(a => a.classList.toggle("on", a.dataset.pg === ativo));
}

/* Abas Câmera · GPS · Banco de dados (coloque <div id="subnav"></div> na página) */
function montarSubmenu(ativa) {
  const el = $("#subnav"); if (!el) return;
  el.outerHTML = `<nav class="subnav wrap" aria-label="Conexão do drone">${CONEXAO.map(([pg, nome, arq, ic]) =>
    `<a href="${RAIZ + arq}"${pg === ativa ? ' class="on" aria-current="page"' : ""}><span data-icon="${ic}"></span>${nome}</a>`).join("")}</nav>`;
}

/* Começo padrão de toda página: confere o login, monta topo/rodapé e
   depois chama a função "montar" da própria página. */
function iniciarPagina(ativo, montar) {
  if (!protegerPagina()) return;
  montarLayout(ativo);
  if (montar) montar();
  fillIcons();
  ativarTema();
  ativarCopiar();
  mostrarAvisoPendente();
}
