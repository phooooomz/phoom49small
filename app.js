// เชื่อม Supabase: สถานะ / ของแจกฟรี / ฟอร์มติดต่อ + อนิเมชั่นเปลี่ยนหน้า
(function () {
  // อนิเมชั่นออกจากหน้าเดิมก่อนเปลี่ยนหน้า
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href]');
    if (!a || a.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey) return;
    const u = new URL(a.href, location.href);
    if (u.origin !== location.origin || u.pathname === location.pathname) return;
    const m = document.querySelector('main'); if (!m) return;
    e.preventDefault(); m.classList.add('page-out');
    setTimeout(() => { location.href = a.href; }, 170);
  });
  window.addEventListener('pageshow', ev => { if (ev.persisted) document.querySelector('main')?.classList.remove('page-out'); });

  if (!window.supabase || !window.SUPABASE_URL || window.SUPABASE_URL.includes('YOUR-PROJECT')) return;
  const db = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
  window.db = db;
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const safeUrl = u => (/^https?:\/\//i.test(u || '') ? u : '');
  const lang = () => (typeof currentLang !== 'undefined' ? currentLang : 'th');
  const SW = { background: '#15181D', color: '#F1F5F9', confirmButtonColor: '#60A5FA', cancelButtonColor: '#262B33' };

  /* ---- สถานะ ---- */
  const LABEL = { online: { th: 'พร้อมรับงาน', en: 'Available for hire' }, offline: { th: 'ไม่ว่างรับงาน', en: 'Currently offline' } };
  const COLOR = { online: '#10b981', offline: '#6b7280' };
  let status = null, items = null;
  function renderStatus() {
    if (!status) return;
    const c = COLOR[status], g = id => document.getElementById(id);
    if (g('status-text')) g('status-text').textContent = LABEL[status][lang()];
    if (g('status-badge')) Object.assign(g('status-badge').style, { color: c, borderColor: c + '33', backgroundColor: c + '1a' });
    if (g('status-dot')) g('status-dot').style.backgroundColor = c;
    if (g('status-avatar')) { g('status-avatar').style.backgroundColor = c; g('status-avatar').title = LABEL[status][lang()]; }
  }

  /* ---- ของแจกฟรี ---- */
  const CARD = 'bg-dark-card light:bg-light-card border border-dark-border light:border-light-border rounded-2xl p-5 shadow-sm space-y-3';
  const TAG = 'px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-dark-cardSec light:bg-light-cardSec border border-dark-border light:border-light-border text-dark-accent light:text-light-accent';
  function renderItems() {
    const box = document.getElementById('product-list');
    if (!box || items === null) return;
    if (!items.length) { box.innerHTML = '<p class="text-xs text-dark-muted">ยังไม่มีของแจกตอนนี้ ไว้มาใหม่นะครับ</p>'; return; }
    box.innerHTML = items.map((p, i) => `<div class="${CARD} reveal" style="--i:${i}">
      ${safeUrl(p.image_url) ? `<img src="${esc(p.image_url)}" alt="${esc(p.name)}" loading="lazy" class="w-full h-36 object-cover rounded-xl">` : ''}
      <div class="flex justify-between items-start">${p.tag ? `<span class="${TAG}">${esc(p.tag)}</span>` : '<span></span>'}
        <span class="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400">FREE</span></div>
      <h3 class="text-sm font-semibold text-dark-text light:text-light-text">${esc(p.name)}</h3>
      <p class="text-xs text-dark-muted light:text-light-muted">${esc(p.description)}</p>
      <button data-claim="${i}" class="w-full py-2 rounded-xl bg-dark-accent light:bg-light-accent text-white text-xs font-medium hover:opacity-90 transition-clean">${esc(translations[lang()].claim_btn)}</button></div>`).join('');
  }
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-claim]'); if (!b || !items) return;
    const p = items[Number(b.dataset.claim)], link = safeUrl(p.link_url);
    Swal.fire({ ...SW, icon: 'success', title: p.name,
      html: p.details ? `<div style="text-align:left;white-space:pre-wrap;font-size:.9rem">${esc(p.details)}</div>` : 'รับของเรียบร้อยแล้ว',
      showConfirmButton: !!link, confirmButtonText: 'เปิดลิงก์ / ดาวน์โหลด', showCancelButton: true, cancelButtonText: 'ปิด'
    }).then(r => { if (r.isConfirmed && link) window.open(link, '_blank', 'noopener'); });
  });

  /* ---- ฟอร์มติดต่อ ---- */
  window.handleContactSubmit = async function (ev) {
    ev.preventDefault();
    const f = ev.target, name = f.querySelector('input[type=text]').value.trim(),
      email = f.querySelector('input[type=email]').value.trim(), message = f.querySelector('textarea').value.trim();
    try { if (Date.now() - Number(localStorage.getItem('lastMsg') || 0) < 30000) return Swal.fire({ ...SW, icon: 'info', title: 'รอสักครู่นะครับ', text: 'ส่งข้อความได้ทุก 30 วินาที' }); } catch (_) {}
    Swal.fire({ ...SW, title: 'กำลังส่ง...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    const { error } = await db.from('messages').insert({ name, email, message });
    if (error) return Swal.fire({ ...SW, icon: 'error', title: 'ส่งไม่สำเร็จ', text: 'ลองใหม่อีกครั้งภายหลังนะครับ' });
    try { localStorage.setItem('lastMsg', Date.now()); } catch (_) {}
    f.reset();
    Swal.fire({ ...SW, icon: 'success', title: translations[lang()].alert_contact, text: 'ผมจะตอบกลับทางอีเมลที่คุณกรอกไว้ครับ' });
  };

  if (typeof applyLanguage === 'function') {
    const orig = applyLanguage;
    window.applyLanguage = function (l) { orig(l); renderStatus(); renderItems(); };
  }
  if (document.getElementById('status-text'))
    db.from('settings').select('status').eq('id', 1).single().then(({ data }) => { if (data && COLOR[data.status]) { status = data.status; renderStatus(); } });
  if (document.getElementById('product-list'))
    db.from('freebies').select('*').eq('is_active', true).order('sort_order').order('created_at', { ascending: false })
      .then(({ data, error }) => { if (!error && data) { items = data; renderItems(); } });
})();