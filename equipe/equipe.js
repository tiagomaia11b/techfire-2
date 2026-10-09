/* =====================================================================
   PÁGINA QUEM SOMOS (equipe.html)
   A equipe e o texto "Sobre" ficam no CONFIG (js/config.js).
   ===================================================================== */
iniciarPagina("equipe", () => {
  $("#teamList").innerHTML = CONFIG.equipe.map(m => {
    const ini = m.nome.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
    return `<div class="card member"><div class="avatar">${m.foto ? `<img src="${esc(caminho(m.foto))}" alt="Foto de ${esc(m.nome)}" onerror="this.replaceWith(document.createTextNode('${ini}'))">` : ini}</div>
      <h3 style="margin:0">${esc(m.nome)}</h3><p class="muted" style="font-size:.9rem">${esc(m.funcao)}</p></div>`;
  }).join("");
  $("#aboutText").textContent = CONFIG.sobre;

  $("#contactForm").addEventListener("submit", e => {
    e.preventDefault(); const f = e.target;
    const corpo = encodeURIComponent(`Nome: ${f.nome.value}\nE-mail: ${f.email.value}\n\n${f.msg.value}`);
    location.href = `mailto:${CONFIG.emailContato}?subject=${encodeURIComponent("Contato pelo site GuardFlame")}&body=${corpo}`;
    toast("Abrindo seu aplicativo de e-mail…");
  });
});
