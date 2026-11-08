// เชื่อมหน้าเว็บกับ Supabase: สถานะออนไลน์/ออฟไลน์ + สินค้า
(function () {
  if (!window.supabase || !window.SUPABASE_URL || window.SUPABASE_URL.includes('YOUR-PROJECT')) return;
  const db = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const safeUrl = u => (/^https?:\/\//i.test(u || '') ? u : '');
  const LABEL = { online: { th: 'พร้อมรับงาน', en: 'Available for hire' }, offline: { th: 'ไม่ว่างรับงาน', en: 'Currently offline' } };
  const COLOR = { online: '#10b981', offline: '#6b7280' };
  let status = null, products = null;

  function renderStatus() {
    if (!status) return;
    const c = COLOR[status], lang = (typeof currentLang !== 'undefined' ? currentLang : 'th');
    const badge = document.getElementById('status-badge'), dot = document.getElementById('status-dot');
    const txt = document.getElementById('status-text'), av = document.getElementById('status-avatar');
    if (txt) txt.textContent = LABEL[status][lang];
    if (badge) { badge.style.color = c; badge.style.borderColor = c + '33'; badge.style.backgroundColor = c + '1a'; }
    if (dot) dot.style.backgroundColor = c;
    if (av) { av.style.backgroundColor = c; av.title = LABEL[status][lang]; }
  }

  const CARD = 'bg-dark-card light:bg-light-card border border-dark-border light:border-light-border rounded-2xl p-5 shadow-sm space-y-3';
  const TAG = 'px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-dark-cardSec light:bg-light-cardSec border border-dark-border light:border-light-border text-dark-accent light:text-light-accent';
  const BTN = 'w-full inline-block text-center py-2 rounded-xl bg-dark-cardSec light:bg-light-cardSec border border-dark-border light:border-light-border text-xs text-dark-text light:text-light-text hover:bg-dark-border/40 transition-clean';

  function renderProducts() {
    const box = document.getElementById('product-list');
    if (!box || products === null) return;
    if (!products.length) { box.innerHTML = '<p class="text-xs text-dark-muted">ยังไม่มีสินค้า</p>'; return; }
    const label = translations[currentLang].btn_order;
    box.innerHTML = products.map(p => {
      const link = safeUrl(p.buy_link) || 'contact.html';
      const img = safeUrl(p.image_url) ? `<img src="${esc(p.image_url)}" alt="${esc(p.name)}" loading="lazy" class="w-full h-36 object-cover rounded-xl">` : '';
      return `<div class="${CARD}">${img}
        <div class="flex justify-between items-start">${p.tag ? `<span class="${TAG}">${esc(p.tag)}</span>` : '<span></span>'}
        <span class="text-xs font-mono font-semibold text-dark-text light:text-light-text">฿${Number(p.price).toLocaleString()}</span></div>
        <h3 class="text-sm font-semibold text-dark-text light:text-light-text">${esc(p.name)}</h3>
        <p class="text-xs text-dark-muted light:text-light-muted">${esc(p.description)}</p>
        <a href="${esc(link)}" target="_blank" rel="noopener" class="${BTN}">${esc(label)}</a></div>`;
    }).join('');
  }

  // ให้สลับภาษาแล้วสถานะ/ปุ่มอัปเดตตาม
  if (typeof applyLanguage === 'function') {
    const orig = applyLanguage;
    window.applyLanguage = function (l) { orig(l); renderStatus(); renderProducts(); };
  }

  db.from('settings').select('status').eq('id', 1).single().then(({ data }) => {
    if (data && COLOR[data.status]) { status = data.status; renderStatus(); }
  });
  db.from('products').select('*').eq('is_active', true)
    .order('sort_order').order('created_at', { ascending: false })
    .then(({ data, error }) => { if (!error && data) { products = data; renderProducts(); } });
})();
