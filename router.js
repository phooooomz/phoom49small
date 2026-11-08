/* Lightweight hash-based SPA router. Views are HTML fragments in /views. */
(() => {
  const routes = {
    home: { file: 'views/home.html', title: 'Home' },
    store: { file: 'views/store.html', title: 'Freebies' },
    about: { file: 'views/about.html', title: 'About' },
    contact: { file: 'views/contact.html', title: 'Follow' }
  };
  const mount = document.getElementById('app-view');
  if (!mount) return;

  let requestId = 0;
  let currentRoute = '';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function routeName() {
    const name = location.hash.replace(/^#\//, '').split('?')[0];
    return routes[name] ? name : 'home';
  }

  async function renderRoute() {
    const route = routeName();
    const config = routes[route];
    const id = ++requestId;
    if (route === currentRoute && mount.children.length) return;

    mount.classList.add('spa-leaving');
    if (!reducedMotion) await new Promise(resolve => setTimeout(resolve, 130));
    if (id !== requestId) return;

    try {
      const response = await fetch(config.file, { headers: { 'X-Requested-With': 'SPA' } });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const markup = await response.text();
      if (id !== requestId) return;

      const parsed = new DOMParser().parseFromString(markup, 'text/html');
      const content = parsed.body.innerHTML.trim();
      if (!content) throw new Error('Empty view');

      mount.innerHTML = content;
      currentRoute = route;
      document.title = `${config.title} | Phoom49small`;
      mount.classList.remove('spa-leaving');
      mount.classList.remove('spa-entering');
      void mount.offsetWidth;
      mount.classList.add('spa-entering');
      window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });

      document.dispatchEvent(new CustomEvent('spa:page-loaded', { detail: { route } }));
      document.dispatchEvent(new CustomEvent('pjax:complete', { detail: { route } }));
      setTimeout(() => mount.classList.remove('spa-entering'), reducedMotion ? 0 : 360);
    } catch (error) {
      console.error('[SPA] Could not load view:', error);
      // A direct navigation is a safe fallback if the view file is missing.
      const fallback = { home: 'index.html', store: 'store.html', about: 'about.html', contact: 'contact.html' }[route];
      if (fallback && !location.pathname.endsWith(fallback)) location.href = fallback;
      else mount.innerHTML = '<div class="p-6 text-sm">ไม่สามารถโหลดหน้านี้ได้ กรุณาลองใหม่อีกครั้ง</div>';
    }
  }

  document.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#/"]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target === '_blank') return;
    const next = new URL(link.href, location.href);
    if (next.hash === location.hash) { event.preventDefault(); return; }
    // Let the browser update the hash; hashchange will render the view.
  });

  window.addEventListener('hashchange', renderRoute);
  window.addEventListener('popstate', renderRoute);
  document.addEventListener('DOMContentLoaded', renderRoute);
  if (document.readyState !== 'loading') renderRoute();
})();
