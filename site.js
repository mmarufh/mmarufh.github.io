/* Shared by every page: copy-email button and the moiré banner. */
/* ---------- Copy email ---------- */
document.querySelectorAll(".copy").forEach(btn => {
  btn.addEventListener("click", () => {
    const text = btn.dataset.copy;
    const done = () => { btn.textContent = "Copied"; setTimeout(() => btn.textContent = "Copy", 1500); };
    const fallback = () => {
      const r = document.createRange(); r.selectNodeContents(btn.previousElementSibling);
      const s = getSelection(); s.removeAllRanges(); s.addRange(r); btn.textContent = "Selected";
      setTimeout(() => btn.textContent = "Copy", 1500);
    };
    try { navigator.clipboard.writeText(text).then(done, fallback); } catch (e) { fallback(); }
  });
});

/* ---------- Banner: two hexagonal lattices at a small twist angle form a moiré ---------- */
(() => {
  const cv = document.getElementById("moire");
  const ctx = cv.getContext("2d");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let w, h;
  function size(){
    const dpr = Math.min(devicePixelRatio || 1, 2);
    w = cv.clientWidth; h = cv.clientHeight;
    cv.width = w * dpr; cv.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function lattice(theta, color, a){
    const cx = w * 0.72, cy = h * 0.5;
    const n = Math.ceil(Math.hypot(w, h) / a);
    const c = Math.cos(theta), s = Math.sin(theta);
    ctx.fillStyle = color;
    for (let i = -n; i <= n; i++){
      for (let j = -n; j <= n; j++){
        const x0 = a * (i + j / 2), y0 = a * (j * Math.sqrt(3) / 2);
        const x = cx + x0 * c - y0 * s, y = cy + x0 * s + y0 * c;
        if (x < -4 || x > w + 4 || y < -4 || y > h + 4) continue;
        ctx.beginPath(); ctx.arc(x, y, 1.9, 0, 6.2832); ctx.fill();
      }
    }
  }
  function draw(t){
    const g = ctx.createRadialGradient(w * 0.72, h * 0.5, 10, w * 0.72, h * 0.5, Math.max(w, h) * 0.8);
    g.addColorStop(0, "#7a2a22"); g.addColorStop(1, "#2a090a");
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    const twist = (3.2 + (reduce ? 0 : Math.sin(t / 9000) * 0.8)) * Math.PI / 180;
    ctx.globalAlpha = 0.7;
    lattice(0, "#f3c7a6", 12);
    lattice(twist, "#ea664d", 12);
    ctx.globalAlpha = 1;
  }
  function loop(t){ draw(t); if (!reduce) requestAnimationFrame(loop); }
  size(); draw(0);
  addEventListener("resize", () => { size(); draw(performance.now()); });
  if (!reduce) requestAnimationFrame(loop);
})();
