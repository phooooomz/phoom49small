// Shared Supabase features for SPA views. Backend client is created once.
(() => {
  const configured = window.supabase && window.SUPABASE_URL &&
    !window.SUPABASE_URL.includes('YOUR-PROJECT') && window.SUPABASE_ANON_KEY;
  if (!configured) {
    console.warn('[App] Supabase is not configured. Static fallback content will be used.');
    return;
  }

  const db = window.db || window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
  window.db = db;
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
  const safeUrl = value => /^https?:\/\//i.test(value || '') ? value : '';
  const labels = { online: { th: 'พร้อมรับงาน', en: 'Available for hire' }, offline: { th: 'ไม่ว่างรับงาน', en: 'Currently offline' } };
  const colors = { online: '#10b981', offline: '#6b7280' };
  const swalStyle = { background: '#15181D', color: '#F1F5F9', confirmButtonColor: '#60A5FA', cancelButtonColor: '#262B33' };
  let statusCache = null;
  let itemsCache = null;
  let socialsCache = null;
  const lang = () => window.currentLang || 'th';

  function renderStatus() {
    if (!statusCache) return;
    const color = colors[statusCache];
    const text = document.getElementById('status-text');
    const badge = document.getElementById('status-badge');
    const dot = document.getElementById('status-dot');
    const avatar = document.getElementById('status-avatar');
    if (text) text.textContent = labels[statusCache][lang()];
    if (badge) Object.assign(badge.style, { color, borderColor: color + '33', backgroundColor: color + '1a' });
    if (dot) dot.style.backgroundColor = color;
    if (avatar) { avatar.style.backgroundColor = color; avatar.title = labels[statusCache][lang()]; }
  }

  function renderItems() {
    const box = document.getElementById('product-list');
    if (!box || !itemsCache) return;
    if (!itemsCache.length) { box.innerHTML = '<p class="text-xs text-dark-muted">ยังไม่มีของแจกตอนนี้ ไว้มาใหม่นะครับ</p>'; return; }
    const claimText = window.translations?.[lang()]?.claim_btn || 'รับฟรี';
    box.innerHTML = itemsCache.map((p, i) => `<article class="bg-dark-card light:bg-light-card border border-dark-border light:border-light-border rounded-2xl p-5 shadow-sm space-y-3 reveal" style="--i:${i}">
      ${safeUrl(p.image_url) ? `<img src="${esc(p.image_url)}" alt="${esc(p.name)}" loading="lazy" class="w-full h-36 object-cover rounded-xl">` : ''}
      <div class="flex justify-between items-start">${p.tag ? `<span class="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-dark-cardSec light:bg-light-cardSec border border-dark-border light:border-light-border text-dark-accent light:text-light-accent">${esc(p.tag)}</span>` : '<span></span>'}<span class="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400">FREE</span></div>
      <h3 class="text-sm font-semibold text-dark-text light:text-light-text">${esc(p.name)}</h3>
      <p class="text-xs text-dark-muted light:text-light-muted">${esc(p.description)}</p>
      <button data-claim="${i}" class="w-full py-2 rounded-xl bg-dark-accent light:bg-light-accent text-white text-xs font-medium hover:opacity-90 transition-clean">${esc(claimText)}</button></article>`).join('');
  }

  function renderSocials() {
    const box = document.getElementById('social-list');
    if (!box) return;
    const list = socialsCache || window.SOCIALS || [];
    const allowed = list.filter(item => /^(https?:\/\/|mailto:)/i.test(item.url || ''));
    box.innerHTML = allowed.map((item, i) => `<a href="${esc(item.url)}" target="_blank" rel="noopener noreferrer" style="--i:${i}" class="reveal flex items-center gap-4 p-4 rounded-2xl bg-dark-cardSec light:bg-light-cardSec border border-dark-border light:border-light-border hover:-translate-y-0.5 transition-clean">
      <span class="w-10 h-10 rounded-xl flex items-center justify-center text-lg bg-dark-card light:bg-light-card border border-dark-border light:border-light-border" style="color:${esc(item.color || '#60A5FA')}"><i class="${esc(item.icon)}"></i></span>
      <span class="flex-1 min-w-0"><span class="block text-sm font-medium text-dark-text light:text-light-text">${esc(item.name)}</span><span class="block text-xs text-dark-muted light:text-light-muted truncate">${esc(item.handle)}</span></span>
      <i class="fa-solid fa-arrow-up-right-from-square text-xs text-dark-muted"></i></a>`).join('') || '<p class="text-xs text-dark-muted">ยังไม่มีช่องทางติดตาม</p>';
  }

  async function loadStatus() {
    if (statusCache) { renderStatus(); return; }
    const { data, error } = await db.from('settings').select('status').eq('id', 1).single();
    if (!error && data && colors[data.status]) { statusCache = data.status; renderStatus(); }
  }
  async function loadItems() {
    if (itemsCache) { renderItems(); return; }
    const { data, error } = await db.from('freebies').select('*').eq('is_active', true).order('sort_order').order('created_at', { ascending: false });
    if (!error && data) { itemsCache = data; renderItems(); }
  }
  async function loadSocials() {
    if (socialsCache) { renderSocials(); return; }
    const { data, error } = await db.from('socials').select('*').eq('is_active', true).order('sort_order').order('created_at');
    socialsCache = !error && data ? data : (window.SOCIALS || []);
    renderSocials();
  }

  document.addEventListener('spa:page-loaded', event => {
    const route = event.detail?.route;
    if (route === 'home') loadStatus();
    if (route === 'store') loadItems();
    if (route === 'contact') loadSocials();
  });
  document.addEventListener('click', event => {
    const button = event.target.closest('[data-claim]');
    if (!button || !itemsCache) return;
    const product = itemsCache[Number(button.dataset.claim)];
    if (!product) return;
    const link = safeUrl(product.link_url);
    if (!window.Swal) return;
    Swal.fire({ ...swalStyle, icon: 'success', title: product.name,
      html: product.details ? `<div style="text-align:left;white-space:pre-wrap;font-size:.9rem">${esc(product.details)}</div>` : 'รับของเรียบร้อยแล้ว',
      showConfirmButton: !!link, confirmButtonText: 'เปิดลิงก์ / ดาวน์โหลด', showCancelButton: true, cancelButtonText: 'ปิด'
    }).then(result => { if (result.isConfirmed && link) window.open(link, '_blank', 'noopener'); });
  });

  window.handleContactSubmit = async function (event) {
    event.preventDefault();
    const form = event.target;
    const name = form.querySelector('input[type="text"]')?.value.trim() || '';
    const email = form.querySelector('input[type="email"]')?.value.trim() || '';
    const message = form.querySelector('textarea')?.value.trim() || '';
    try { if (Date.now() - Number(localStorage.getItem('lastMsg') || 0) < 30000) return Swal.fire({ ...swalStyle, icon: 'info', title: 'รอสักครู่นะครับ', text: 'ส่งข้อความได้ทุก 30 วินาที' }); } catch (_) {}
    Swal.fire({ ...swalStyle, title: 'กำลังส่ง...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    const { error } = await db.from('messages').insert({ name, email, message });
    if (error) return Swal.fire({ ...swalStyle, icon: 'error', title: 'ส่งไม่สำเร็จ', text: 'ลองใหม่อีกครั้งภายหลังนะครับ' });
    try { localStorage.setItem('lastMsg', Date.now()); } catch (_) {}
    form.reset();
    Swal.fire({ ...swalStyle, icon: 'success', title: window.translations?.[lang()]?.alert_contact || 'ส่งข้อความเรียบร้อยแล้ว!', text: 'ผมจะตอบกลับทางอีเมลที่คุณกรอกไว้ครับ' });
  };

  const originalApplyLanguage = window.applyLanguage;
  if (typeof originalApplyLanguage === 'function') {
    window.applyLanguage = function (language) {
      originalApplyLanguage(language);
      renderStatus();
      renderItems();
    };
  }
})();
