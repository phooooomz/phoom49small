// Tab bar: pill กระจกที่สองปลายสปริงแยกกัน ยืดตอนเคลื่อนที่ เบลอ/ขุ่นตามความเร็ว แล้วใสตอนหยุด
(function () {
  const bar = document.querySelector('nav .glass-bar');
  if (!bar) return;
  const tabs = [...bar.querySelectorAll('.tab-btn')];
  const clean = p => (p || 'index').replace(/\.html$/, '') || 'index';
  const here = clean(location.pathname.split('/').pop());
  const cur = Math.max(0, tabs.findIndex(t => clean(t.getAttribute('href')) === here));

  // มาจากแท็บไหน (เก็บไว้ตอนกด เพราะแต่ละแท็บเป็นคนละหน้า)
  let from = cur;
  try {
    const o = JSON.parse(sessionStorage.getItem('tabFrom') || 'null');
    if (o && Date.now() - o.t < 4000 && o.i >= 0 && o.i < tabs.length) from = o.i;
    sessionStorage.removeItem('tabFrom');
  } catch (_) {}
  tabs.forEach(t => t.addEventListener('click', () => {
    try { sessionStorage.setItem('tabFrom', JSON.stringify({ i: cur, t: Date.now() })); } catch (_) {}
  }));

  const pill = document.createElement('div');
  pill.className = 'tab-pill';
  pill.innerHTML = '<i class="p-tint"></i><i class="p-frost"></i><i class="p-gloss"></i>';
  bar.prepend(pill); bar.classList.add('has-pill');
  const frost = pill.querySelector('.p-frost');

  // สปริง: ω = ความถี่, ζ = ค่าหน่วง (ปลายนำเร็วเด้ง / ปลายตามช้านุ่ม)
  const spring = (w, z) => {
    const k = Math.sqrt(1 - z * z), wd = w * k;
    return {
      pos: t => t <= 0 ? 0 : 1 - Math.exp(-z * w * t) * (Math.cos(wd * t) + (z * w / wd) * Math.sin(wd * t)),
      vel: t => t <= 0 ? 0 : (w / k) * Math.exp(-z * w * t) * Math.sin(wd * t)
    };
  };
  const lead = spring(19, 0.55), trail = spring(11, 0.72);
  const clamp = v => Math.min(1, Math.max(0, v));

  let cx = [], pad = 40, restH = 52, cy = 0, minL = 0, maxR = 0;
  function measure() {
    const b = bar.getBoundingClientRect(), r0 = tabs[0].getBoundingClientRect();
    const ox = b.left + bar.clientLeft, oy = b.top + bar.clientTop;
    cx = tabs.map(t => { const r = t.getBoundingClientRect(); return r.left - ox + r.width / 2; });
    pad = r0.width / 2; restH = r0.height; cy = r0.top - oy + r0.height / 2;
    minL = cx[0] - pad; maxR = cx[cx.length - 1] + pad;
  }

  function render(t, a, b) {
    const dir = b >= a ? 1 : -1, d = cx[b] - cx[a];
    const eR = dir > 0 ? lead.pos(t) : trail.pos(t), eL = dir > 0 ? trail.pos(t) : lead.pos(t);
    const left = Math.max(minL, cx[a] + d * eL - pad), right = Math.min(maxR, cx[a] + d * eR + pad);
    const w = right - left, s = clamp((w - 2 * pad) / (2 * pad)), h = restH * (1 - 0.1 * s);
    const sn = clamp(Math.abs((lead.vel(t) + trail.vel(t)) / 2) / 7);
    pill.style.transform = `translate(${left}px, ${cy - h / 2}px)`;
    pill.style.width = w + 'px'; pill.style.height = h + 'px';
    const f = `blur(${(1.5 + 6.5 * sn).toFixed(2)}px) saturate(1.6)`;
    pill.style.backdropFilter = f; pill.style.webkitBackdropFilter = f;
    frost.style.background = `rgba(225,225,245,${(0.14 * sn).toFixed(3)})`;
  }
  const still = () => { measure(); render(99, cur, cur); pill.classList.add('ready'); };

  let raf = 0;
  function play() {
    measure(); render(0, from, cur); pill.classList.add('ready');
    if (from === cur || matchMedia('(prefers-reduced-motion: reduce)').matches) return still();
    const t0 = performance.now();
    (function tick(now) {
      const t = (now - t0) / 1000;
      if (t > 1.3) return render(99, from, cur);
      render(t, from, cur); raf = requestAnimationFrame(tick);
    })(t0);
  }
  setTimeout(() => { raf = requestAnimationFrame(play); }, 120);
  window.addEventListener('resize', () => { cancelAnimationFrame(raf); still(); });
  window.addEventListener('load', () => { if (!raf) still(); });
  window.addEventListener('pageshow', e => { if (e.persisted) { cancelAnimationFrame(raf); still(); } });
})();
