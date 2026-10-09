/* =====================================================================
   PÁGINA INÍCIO (index.html)
   ===================================================================== */

/* Endereços antigos (index.html#manual, #produto...) → páginas novas */
const ANTIGAS = {
  aovivo: "aovivo/aovivo.html", manual: "manual/manual.html", produto: "produto/produto.html",
  equipe: "equipe/equipe.html", referencias: "referencias/referencias.html", ux: "experiencia/experiencia.html",
  login: "login/login.html", cadastro: "login/cadastro.html", jogo: "jogo/jogo.html"
};
const destinoAntigo = ANTIGAS[location.hash.slice(1)];

if (destinoAntigo) location.replace(destinoAntigo);
else iniciarPagina("home", () => {
  Telemetria.iniciar();
});
