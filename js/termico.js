/* =====================================================================
   VISOR TÉRMICO (simulação da câmera térmica)
   ===================================================================== */
const PALETA = (() => {
  const stops = [[0,[10,10,42]],[.25,[74,12,107]],[.45,[176,32,79]],[.62,[232,81,42]],[.8,[249,168,30]],[1,[255,251,224]]];
  const out = new Uint8ClampedArray(256 * 3);
  for (let i = 0; i < 256; i++) {
    const t = i / 255; let k = 0; while (t > stops[k + 1][0]) k++;
    const [t0, a] = stops[k], [t1, b] = stops[k + 1], f = (t - t0) / (t1 - t0);
    for (let c = 0; c < 3; c++) out[i * 3 + c] = a[c] + (b[c] - a[c]) * f;
  }
  return out;
})();
const reduzMovimento = matchMedia("(prefers-reduced-motion: reduce)").matches;

class Thermal {
  constructor(canvas) {
    this.c = canvas; this.ctx = canvas.getContext("2d");
    this.W = 96; this.H = 64;
    this.off = document.createElement("canvas"); this.off.width = this.W; this.off.height = this.H;
    this.octx = this.off.getContext("2d"); this.img = this.octx.createImageData(this.W, this.H);
    this.hot = canvas.closest(".scope").querySelector("[data-hot]");
    // textura do solo/copa das árvores (ruído suave)
    const gx = 13, gy = 9, g = Array.from({ length: gx * gy }, () => Math.random());
    this.ground = new Float32Array(this.W * this.H);
    for (let y = 0; y < this.H; y++) for (let x = 0; x < this.W; x++) {
      const fx = x / this.W * (gx - 1), fy = y / this.H * (gy - 1), ix = fx | 0, iy = fy | 0, tx = fx - ix, ty = fy - iy;
      const v = g[iy*gx+ix]*(1-tx)*(1-ty) + g[iy*gx+ix+1]*tx*(1-ty) + g[(iy+1)*gx+ix]*(1-tx)*ty + g[(iy+1)*gx+ix+1]*tx*ty;
      this.ground[y * this.W + x] = .16 + v * .2 + Math.random() * .03;
    }
    this.focos = [
      { x: .66, y: .42, r: 7, calor: .5, fase: 0 },
      { x: .3, y: .7, r: 4, calor: .35, fase: 2 },
      { x: .18, y: .25, r: 3, calor: .22, fase: 4 }
    ];
    this.visivel = false; this.raf = 0;
    canvas.addEventListener("wake", () => this.loop());
    new IntersectionObserver(([e]) => { this.visivel = e.isIntersecting; if (this.visivel) this.loop(); }).observe(canvas);
    new ResizeObserver(() => this.resize()).observe(canvas);
  }
  resize() {
    const r = this.c.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2);
    if (!r.width) return;
    this.c.width = Math.round(r.width * d); this.c.height = Math.round(r.height * d);
    this.draw(performance.now());
  }
  loop() {
    cancelAnimationFrame(this.raf);
    if (!this.visivel || document.hidden || reduzMovimento) { this.draw(performance.now()); return; }
    let last = 0;
    const tick = (t) => { if (!this.visivel || document.hidden) return; if (t - last > 70) { this.draw(t); last = t; } this.raf = requestAnimationFrame(tick); };
    this.raf = requestAnimationFrame(tick);
  }
  draw(t) {
    const { W, H, img, ground } = this, d = img.data, s = t / 1000;
    const drift = (s * 1.5) % W; // o drone "anda" sobre a área
    let max = 0, mx = 0, my = 0;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const gxp = (x + drift | 0) % W;
      let v = ground[y * W + gxp] + Math.sin(x * .3 + s) * .01;
      for (const f of this.focos) {
        let dx = x - ((f.x * W - drift) % W + W) % W; if (dx > W / 2) dx -= W; if (dx < -W / 2) dx += W;
        const dy = y - f.y * H, flick = 1 + .12 * Math.sin(s * 6 + f.fase + x * .4) * Math.sin(s * 4.3 + y * .5);
        v += f.calor * flick * Math.exp(-(dx * dx + dy * dy * 1.3) / (f.r * f.r));
      }
      v = Math.min(1, Math.max(0, v));
      if (v > max) { max = v; mx = x; my = y; }
      const k = (v * 255 | 0) * 3, p = (y * W + x) * 4;
      d[p] = PALETA[k]; d[p + 1] = PALETA[k + 1]; d[p + 2] = PALETA[k + 2]; d[p + 3] = 255;
    }
    this.octx.putImageData(img, 0, 0);
    const { c, ctx } = this, cw = c.width, ch = c.height;
    if (!cw) return;
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high";
    // preenche cobrindo o quadro inteiro (object-fit: cover)
    const sc = Math.max(cw / W, ch / H), dw = W * sc, dh = H * sc, ox = (cw - dw) / 2, oy = (ch - dh) / 2;
    ctx.drawImage(this.off, ox, oy, dw, dh);
    // mira no ponto mais quente
    const px = ox + (mx + .5) * sc, py = oy + (my + .5) * sc, u = Math.max(1, cw / 600), R = 26 * u;
    ctx.strokeStyle = "rgba(255,255,255,.95)"; ctx.lineWidth = 1.5 * u;
    ctx.beginPath(); ctx.arc(px, py, R, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(px - R * 1.6, py); ctx.lineTo(px - R * .6, py); ctx.moveTo(px + R * .6, py); ctx.lineTo(px + R * 1.6, py);
    ctx.moveTo(px, py - R * 1.6); ctx.lineTo(px, py - R * .6); ctx.moveTo(px, py + R * .6); ctx.lineTo(px, py + R * 1.6); ctx.stroke();
    const conf = Math.round(Math.min(99, Math.max(0, (max - .35) / .55 * 100)));
    ctx.font = `600 ${13 * u}px Figtree, sans-serif`; ctx.fillStyle = "#fff";
    ctx.fillText((conf >= 60 ? "Fogo " : "Calor ") + conf + "%", px + R * .9, py - R * .9);
    if (this.hot) this.hot.textContent = conf >= 60 ? "Foco detectado · " + conf + "%" : "Sem foco";
    Thermal.ultimaConf = conf;
  }
}
const thermals = new WeakSet();
function initThermals(root = document) {
  $$("canvas[data-thermal]", root).forEach(c => { if (!thermals.has(c)) { thermals.add(c); new Thermal(c); } });
}
document.addEventListener("visibilitychange", () => { if (!document.hidden) $$("canvas[data-thermal]").forEach(c => c.dispatchEvent(new Event("wake"))); });
