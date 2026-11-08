/* โหลดข้อมูลจาก Supabase มาแสดงบนหน้าเว็บสาธารณะ (ของแจก / ช่องทางติดตาม / สถานะ)
   ใช้ได้ทั้งโหมด SPA (index.html + router.js) และหน้าเดี่ยว (store.html, contact.html) */
(() => {
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
  const safeUrl = u => /^(https?:\/\/|mailto:)/i.test(u || '') ? u : '';
  const lang = () => window.currentLang || 'th';
  const t = key => window.translations?.[lang()]?.[key] || key;

  // สร้าง client ครั้งเดียว
  if (!window.db && window.supabase?.createClient && window.SUPABASE_URL && window.SUPABASE_ANON_KEY) {
    window.db = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
  }
  const db = window.db;
  if (!db) console.warn('[data.js] ไม่พบ Supabase client — เช็ก config.js และการโหลด supabase-js');

  /* ---------- ของแจก ---------- */
  async function renderStore() {
    const box = document.getElementById('product-list');
    if (!box) return;
    let list = [];
    if (db) {
      const { data, error } = await db.from('freebies').select('*').eq('is_active', true)
        .order('sort_order', { ascending: true, nullsFirst: false }).order('created_at', { ascending: false });
      if (error) {
        console.error('[data.js] freebies:', error);
        box.innerHTML = '<p class="text-xs text-dark-muted">โหลดข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง</p>';
        return;
      }
      list = data || [];
    }
    window.__freebies = list;
    box.innerHTML = list.map((p, i) => `
      <article class="reveal rounded-2xl overflow-hidden bg-dark-card light:bg-light-card border border-dark-border light:border-light-border" style="--i:${i}">
        ${safeUrl(p.image_url) ? `<img src="${esc(p.image_url)}" alt="${esc(p.name)}" loading="lazy" class="w-full h-40 object-cover">` : ''}
        <div class="p-4 space-y-2">
          ${p.tag ? `<span class="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium bg-dark-cardSec light:bg-light-cardSec border border-dark-border light:border-light-border text-dark-muted">${esc(p.tag)}</span>` : ''}
          <h3 class="text-sm font-semibold text-dark-text light:text-light-text">${esc(p.name)}</h3>
          ${p.description ? `<p class="text-xs text-dark-muted light:text-light-muted">${esc(p.description)}</p>` : ''}
          <button type="button" data-claim="${esc(p.id)}" class="w-full mt-2 py-2.5 rounded-xl text-xs font-medium bg-dark-accent text-white hover:opacity-90 transition-clean">${esc(t('claim_btn'))}</button>
        </div>
      </article>`).join('') || '<p class="text-xs text-dark-muted">ยังไม่มีของแจกในตอนนี้</p>';
  }

  // กด "รับฟรี" → แสดงรายละเอียด + ลิงก์ (ใช้ event delegation เพราะการ์ดถูกสร้างใหม่ตลอด)
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-claim]');
    if (!b) return;
    const p = (window.__freebies || []).find(x => String(x.id) === b.dataset.claim);
    if (!p) return;
    const link = safeUrl(p.link_url);
    const html = (p.details ? `<div style="text-align:left;white-space:pre-wrap;font-size:.85rem">${esc(p.details)}</div>` : '')
               + (link ? `<p style="margin-top:.75rem"><a href="${esc(link)}" target="_blank" rel="noopener noreferrer" style="color:#60A5FA;text-decoration:underline">เปิดลิงก์ดาวน์โหลด</a></p>` : '');
    if (window.Swal) {
      Swal.fire({ background:'#15181D', color:'#F1F5F9', confirmButtonColor:'#60A5FA', title:p.name, html: html || 'ไม่มีรายละเอียดเพิ่มเติม', confirmButtonText:'ปิด' });
    } else if (link) {
      window.open(link, '_blank', 'noopener');
    }
  });

  /* ---------- ช่องทางติดตาม ---------- */
  async function renderSocials() {
    const box = document.getElementById('social-list');
    if (!box) return;
    let list = window.SOCIALS || [];            // ค่าสำรองจาก socials.js
    if (db) {
      const { data, error } = await db.from('socials').select('*').eq('is_active', true)
        .order('sort_order', { ascending: true, nullsFirst: false }).order('created_at');
      if (error) console.error('[data.js] socials:', error); else list = data || [];
    }
    box.innerHTML = list.filter(x => safeUrl(x.url)).map((x, i) => `
      <a href="${esc(x.url)}" target="_blank" rel="noopener noreferrer" style="--i:${i}"
         class="reveal flex items-center gap-4 p-4 rounded-2xl bg-dark-cardSec light:bg-light-cardSec border border-dark-border light:border-light-border hover:-translate-y-0.5 transition-clean">
        <span class="w-10 h-10 rounded-xl flex items-center justify-center text-lg bg-dark-card light:bg-light-card border border-dark-border light:border-light-border" style="color:${esc(x.color || '#60A5FA')}"><i class="${esc(x.icon)}"></i></span>
        <span class="flex-1 min-w-0"><span class="block text-sm font-medium text-dark-text light:text-light-text">${esc(x.name)}</span>
        <span class="block text-xs text-dark-muted light:text-light-muted truncate">${esc(x.handle || '')}</span></span>
        <i class="fa-solid fa-arrow-up-right-from-square text-xs text-dark-muted"></i>
      </a>`).join('') || '<p class="text-xs text-dark-muted">ยังไม่มีช่องทางติดตาม</p>';
  }

  /* ---------- สถานะ Online / Offline (หน้าแรก) ---------- */
  async function renderStatus() {
    const badge = document.getElementById('status-badge');
    if (!badge || !db) return;
    const { data, error } = await db.from('settings').select('status').eq('id', 1).maybeSingle();
    if (error) { console.error('[data.js] settings:', error); return; }
    const on = data?.status === 'online';
    const dot = document.getElementById('status-dot'), txt = document.getElementById('status-text'), av = document.getElementById('status-avatar');
    badge.className = 'inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ' +
      (on ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-slate-500/10 border-slate-500/20 text-slate-400');
    if (dot) dot.className = 'w-1.5 h-1.5 rounded-full ' + (on ? 'bg-emerald-500' : 'bg-slate-500');
    if (av) { av.classList.toggle('bg-emerald-500', on); av.classList.toggle('bg-slate-500', !on); av.title = on ? 'พร้อมรับงาน' : 'ออฟไลน์'; }
    if (txt) { txt.removeAttribute('data-i18n'); txt.textContent = on ? 'Available for hire' : 'Offline'; }
  }

  const run = () => { renderStore(); renderSocials(); renderStatus(); };
  document.addEventListener('DOMContentLoaded', run);
  document.addEventListener('spa:page-loaded', run);
  if (document.readyState !== 'loading') run();
})();
