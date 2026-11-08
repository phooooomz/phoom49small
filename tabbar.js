// Floating glass tab bar with spring-like active pill, SPA-aware.
(() => {
  const bar = document.querySelector('nav .glass-bar');
  if (!bar) return;
  const tabs = [...bar.querySelectorAll('.tab-btn')];
  if (!tabs.length) return;
  const pill = document.createElement('div');
  pill.className = 'tab-pill';
  pill.innerHTML = '<i class="p-tint"></i><i class="p-frost"></i><i class="p-gloss"></i>';
  bar.prepend(pill);
  bar.classList.add('has-pill');
  const frost = pill.querySelector('.p-frost');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const spring = (w, z) => {
    const k = Math.sqrt(1 - z * z), wd = w * k;
    return t => t <= 0 ? 0 : 1 - Math.exp(-z * w * t) * (Math.cos(wd * t) + (z * w / wd) * Math.sin(wd * t));
  };
  const lead = spring(19, .55), trail = spring(11, .72);
  let active = 0, raf = 0;
  const routeIndex = () => {
    const hashRoute = location.hash.replace(/^#\//, '');
    const pathRoute = location.pathname.split('/').pop().replace(/\.html$/, '') || 'home';
    const route = hashRoute || pathRoute;
    return Math.max(0, tabs.findIndex(tab => tab.getAttribute('href') === '#/' + route || tab.getAttribute('href') === (route === 'home' ? 'index.html' : route + '.html')));
  };
  function measure() {
    const bounds = bar.getBoundingClientRect();
    return tabs.map(tab => {
      const rect = tab.getBoundingClientRect();
      return { x: rect.left - bounds.left + rect.width / 2, y: rect.top - bounds.top + rect.height / 2, w: rect.width, h: rect.height };
    });
  }
  function draw(from, to, progress) {
    const points = measure();
    const a = points[from], b = points[to];
    if (!a || !b) return;
    const dir = to >= from ? 1 : -1;
    const leftProgress = dir > 0 ? trail(progress) : lead(progress);
    const rightProgress = dir > 0 ? lead(progress) : trail(progress);
    const left = a.x - a.w/2 + (b.x - b.w/2 - (a.x - a.w/2)) * leftProgress;
    const right = a.x + a.w/2 + (b.x + b.w/2 - (a.x + a.w/2)) * rightProgress;
    const width = Math.max(0, right-left);
    pill.style.transform = `translate(${left}px, ${a.y - a.h/2}px)`;
    pill.style.width = width + 'px';
    pill.style.height = a.h + 'px';
    const speed = Math.abs(rightProgress-leftProgress);
    const blur = 1.5 + 5 * Math.min(1, speed);
    pill.style.backdropFilter = `blur(${blur}px) saturate(1.5)`;
    pill.style.webkitBackdropFilter = `blur(${blur}px) saturate(1.5)`;
    frost.style.background = `rgba(225,225,245,${(0.08 + .08 * speed).toFixed(3)})`;
  }
  function setActive(animate = true) {
    const next = routeIndex();
    tabs.forEach((tab, index) => {
      tab.classList.toggle('active', index === next);
      tab.setAttribute('aria-current', index === next ? 'page' : 'false');
    });
    cancelAnimationFrame(raf);
    if (!animate || reduced || next === active) {
      draw(next, next, 99);
      active = next;
      pill.classList.add('ready');
      return;
    }
    const previous = active;
    const start = performance.now();
    pill.classList.add('ready');
    const tick = now => {
      const t = Math.min(1.3, (now - start) / 1000);
      draw(previous, next, t * 1.3);
      if (t < 1.3) raf = requestAnimationFrame(tick);
      else { draw(next, next, 99); active = next; }
    };
    raf = requestAnimationFrame(tick);
  }
  active = routeIndex();
  window.addEventListener('load', () => setActive(false));
  window.addEventListener('resize', () => setActive(false));
  window.addEventListener('hashchange', () => setActive(true));
  requestAnimationFrame(() => setActive(false));
})();
