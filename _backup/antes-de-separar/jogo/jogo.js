/* =====================================================================
   PÁGINA DO JOGO (jogo.html)
   O link do jogo e o vídeo de prévia ficam no CONFIG (js/config.js).
   ===================================================================== */
if (protegerPagina()) {
  montarLayout("jogo");
  renderVideosFixos();
  fillIcons();
  ativarTema();
  mostrarAvisoPendente();

  const play = $("#playBtn"); play.href = CONFIG.linkJogo;
  if (CONFIG.linkJogo === "#") play.addEventListener("click", e => { e.preventDefault(); toast("Adicione o link do jogo em CONFIG.linkJogo"); });
}
