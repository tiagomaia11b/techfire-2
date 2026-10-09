/* =====================================================================
   LOGIN E CADASTRO (login.html e cadastro.html)
   Obs.: guarda as contas no navegador (localStorage) — ótimo para a
   apresentação. Para contas reais, troque por Firebase/MySQL.
   ===================================================================== */
async function hashSenha(s) {
  if (window.crypto && crypto.subtle) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode("gf::" + s));
    return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
  }
  return btoa(unescape(encodeURIComponent("gf::" + s)));
}
function showMsg(id, text, ok) { const m = $(id); m.textContent = text; m.className = "msg " + (ok ? "ok" : "err"); }
const emailOk = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
const irParaInicio = () => { location.href = RAIZ + "index.html#home"; };
/* Salva a sessão e confere se o navegador guardou mesmo (alguns bloqueiam dados de sites) */
function entrar(nome, email, aviso) {
  store.set("gf_sessao", { nome, email });
  if (!sessao()) return showMsg(document.querySelector("#loginMsg") ? "#loginMsg" : "#signupMsg",
    "Seu navegador está bloqueando o salvamento de dados deste site. Libere os cookies/dados do site nas configurações e tente de novo.");
  avisoDepois(aviso || "Bem-vindo(a), " + nome.split(" ")[0] + "!");
  irParaInicio();
}

/* Já está logado? Vai direto para o site */
if (sessao()) irParaInicio();

/* ---------- CADASTRO ---------- */
$("#signupForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const f = e.target, nome = f.nome.value.trim(), email = f.email.value.trim().toLowerCase();
  if (nome.length < 3) return showMsg("#signupMsg", "Digite seu nome completo.");
  if (!emailOk(email)) return showMsg("#signupMsg", "Digite um e-mail válido, como nome@email.com.");
  if (f.senha.value.length < 6) return showMsg("#signupMsg", "A senha precisa ter pelo menos 6 caracteres.");
  if (f.senha.value !== f.senha2.value) return showMsg("#signupMsg", "As senhas não são iguais. Digite novamente.");
  if (!f.termos.checked) return showMsg("#signupMsg", "Marque a caixa de concordância para continuar.");
  const users = store.get("gf_usuarios", {});
  if (users[email] || (CONFIG.contas || []).some(c => c.email.toLowerCase() === email)) return showMsg("#signupMsg", "Este e-mail já tem conta. Use a opção Entrar.");
  users[email] = { nome, perfil: f.perfil.value, senha: await hashSenha(f.senha.value), criado: Date.now() };
  store.set("gf_usuarios", users);
  entrar(nome, email, "Conta criada. Bem-vindo(a), " + nome.split(" ")[0] + "!");
});

/* ---------- LOGIN ---------- */
$("#loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const f = e.target, email = f.email.value.trim().toLowerCase();
  if (!emailOk(email)) return showMsg("#loginMsg", "Digite um e-mail válido.");
  if (!f.senha.value) return showMsg("#loginMsg", "Digite sua senha.");

  /* 1) Contas da equipe (CONFIG.contas em js/config.js) */
  const equipe = (CONFIG.contas || []).find(c => c.email.toLowerCase() === email);
  if (equipe) {
    if (equipe.senha !== f.senha.value) return showMsg("#loginMsg", "Senha incorreta. Confira e tente de novo.");
    return entrar(equipe.nome, email);
  }

  /* 2) Contas criadas pelo botão "Criar conta" (salvas neste navegador) */
  const u = store.get("gf_usuarios", {})[email];
  if (!u) return showMsg("#loginMsg", "Não existe conta com este e-mail neste navegador. Clique em Criar conta ou entre como visitante.");
  if (u.senha !== await hashSenha(f.senha.value)) return showMsg("#loginMsg", "Senha incorreta. Confira e tente de novo.");
  entrar(u.nome, email);
});

$("#demoBtn")?.addEventListener("click", () => entrar("Visitante", "visitante", "Você entrou como visitante."));
$("#forgotBtn")?.addEventListener("click", () => {
  const email = $("#loginForm").email.value.trim().toLowerCase();
  if (!emailOk(email)) return showMsg("#loginMsg", "Digite seu e-mail no campo acima e clique em Recuperar senha.");
  showMsg("#loginMsg", "Se existir uma conta com " + email + ", enviaremos as instruções de recuperação.", true);
});

/* Botão de olho: mostrar/esconder senha */
$$(".peek").forEach(b => b.addEventListener("click", () => {
  const inp = b.parentElement.querySelector("input"); const show = inp.type === "password";
  inp.type = show ? "text" : "password"; b.setAttribute("aria-label", show ? "Esconder senha" : "Mostrar senha");
}));

/* ---------- INICIALIZAÇÃO ---------- */
fillIcons();
ativarTema();
initThermals();
mostrarAvisoPendente();
