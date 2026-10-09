/* =====================================================================
   TOPO E RODAPÉ — escritos uma vez só e colocados em todas as páginas
   (index.html e jogo/jogo.html). Para mudar o menu, edite aqui.
   ===================================================================== */
const MENU = [
  ["home", "Início"], ["aovivo", "Ao vivo"], ["manual", "Manual"], ["produto", "Produto"],
  ["equipe", "Quem somos"], ["referencias", "Referências"], ["jogo", "Jogo"], ["ux", "Experiência"]
];
/* Link de cada item: o jogo tem página própria; o resto fica dentro do index.html */
function linkPara(pg) {
  if (pg === "jogo") return RAIZ + "jogo/jogo.html";
  return RAIZ ? RAIZ + "index.html#" + pg : "#" + pg;
}
const linkMenu = ([pg, nome]) => `<a href="${linkPara(pg)}" data-pg="${pg}"${pg === "aovivo" ? ' class="live"' : ""}>${nome}</a>`;

function montarLayout(ativo) {
  $("#topo").outerHTML = `
<header class="topbar">
  <div class="wrap">
    <a class="brand" href="${linkPara("home")}"><span class="mark" data-icon="flame"></span>TechFire</a>
    <nav class="nav" id="nav" aria-label="Principal">${MENU.map(linkMenu).join("")}</nav>
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
      <div><h4>Páginas</h4>${MENU.slice(0, 4).map(linkMenu).join("")}</div>
      <div><h4>Projeto</h4>${MENU.slice(4).map(linkMenu).join("")}</div>
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
  marcarMenu(ativo);
}
/* Destaca no menu a página atual */
function marcarMenu(pg) {
  $$("#nav a").forEach(a => a.classList.toggle("on", a.dataset.pg === pg));
  $("#nav").classList.remove("open"); $("#menuBtn").setAttribute("aria-expanded", "false");
}
