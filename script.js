/**
 * Main Application Logic & Data Manager
 */

// Translation Dictionaries (TH / EN)
const translations = {
    th: {
        name: "อเล็กซ์ ริเวร่า",
        tab_home: "หน้าแรก", tab_store: "แจกฟรี", tab_about: "เกี่ยวกับ", tab_contact: "ติดตาม", 
        claim_btn: "รับฟรี",
        status_online: "พร้อมรับงาน",
        status_offline: "ไม่ว่างรับงาน",
        role: "Full-Stack Software Engineer & UI Developer",
        bio: "ยินดีต้อนรับครับ! ผมเป็นนักพัฒนาซอฟต์แวร์ที่เชี่ยวชาญการสร้างสรรค์เว็บแอปพลิเคชันด้วยดีไซน์ Ultra Clean & Minimalist เน้นประสิทธิภาพความเร็ว และประสบการณ์ใช้งานที่เรียบง่ายสบายตา",
        btn_contact: "ติดตามผม",
        btn_about: "ดูประวัติเพิ่มเติม",
        feat_frontend_title: "Frontend Engineering",
        feat_frontend_desc: "พัฒนา UI ด้วย React, Next.js และ Tailwind CSS ที่เน้นความเร็วและ Accessibility",
        feat_backend_title: "Backend Architecture",
        feat_backend_desc: "วางระบบเบื้องหลัง REST API ด้วย Node.js, Go และฐานข้อมูลที่มีความเสถียรสูง",
        feat_ux_title: "Clean & Minimal UX/UI",
        feat_ux_desc: "ออกแบบอินเทอร์เฟซที่เรียบง่าย ปราศจากสิ่งรบกวน เน้นสัดส่วนที่สมดุล สบายตา",
        store_title: "ของแจกฟรี",
        store_subtitle: "เทมเพลตและไฟล์คุณภาพ กดรับได้ฟรีเลย",
        about_title: "เกี่ยวกับ อเล็กซ์ ริเวร่า",
        about_desc: "ผมมีประสบการณ์ทำระบบเว็บแอปพลิเคชันมากกว่า 6 ปี เน้นสร้างสรรค์ซอฟต์แวร์ที่มีประสิทธิภาพสูง อ่านและดูแลรักษาโค้ดได้ง่าย ตลอดจนใส่ใจในรายละเอียดของการใช้งานของผู้ใช้ (UX/UI)",
        exp_title: "ประสบการณ์ทำงาน",
        exp1_role: "Senior Full-Stack Developer — TechCorp Labs",
        exp1_date: "2023 — ปัจจุบัน",
        exp1_desc: "ดูแลสถาปัตยกรรมระบบเว็บแอปพลิเคชันระดับองค์กร และปรับปรุงประสิทธิภาพของ Database ให้ทำงานได้รวดเร็วขึ้น",
        exp2_role: "Frontend Software Engineer — Nexus Studio",
        exp2_desc: "ออกแบบและสร้าง User Interface ด้วย React และ Next.js เน้นความสมบูรณ์ของ Responsive Design",
        skills_title: "ทักษะและเทคโนโลยี",
        contact_title: "ติดตามผมได้ที่",
        contact_subtitle: "เลือกช่องทางที่สะดวก ติดตามข่าวสารและของแจกใหม่ๆ ได้เลยครับ",
        footer: "© 2026 อเล็กซ์ ริเวร่า. สงวนลิขสิทธิ์ทั้งหมด"
    },
    en: {
        name: "Alex Rivera",
        tab_home: "Home", tab_store: "Freebies", tab_about: "About", tab_contact: "Follow", 
        claim_btn: "Get it free",
        status_online: "Available for hire",
        status_offline: "Currently offline",
        role: "Full-Stack Software Engineer & UI Developer",
        bio: "Welcome! I am a software engineer specializing in building web applications with Ultra Clean & Minimalist design, focusing on performance, speed, and seamless user experience.",
        btn_contact: "Follow Me",
        btn_about: "View Full Bio",
        feat_frontend_title: "Frontend Engineering",
        feat_frontend_desc: "Building high-performance UI using React, Next.js, and Tailwind CSS with high accessibility standards.",
        feat_backend_title: "Backend Architecture",
        feat_backend_desc: "Designing reliable REST API services powered by Node.js, Go, and highly scalable databases.",
        feat_ux_title: "Clean & Minimal UX/UI",
        feat_ux_desc: "Crafting clean, distraction-free interfaces focusing on balanced visual hierarchy.",
        store_title: "Free Stuff",
        store_subtitle: "Quality templates and files — grab them for free.",
        about_title: "About Alex Rivera",
        about_desc: "With over 6 years of experience in web application development, I focus on building high-performance, maintainable software with exceptional attention to user experience details.",
        exp_title: "Work Experience",
        exp1_role: "Senior Full-Stack Developer — TechCorp Labs",
        exp1_date: "2023 — Present",
        exp1_desc: "Architecting enterprise web systems and optimizing database performance for high scale.",
        exp2_role: "Frontend Software Engineer — Nexus Studio",
        exp2_desc: "Building high-performance user interfaces using React and Next.js with strong emphasis on responsive design.",
        skills_title: "Skills & Technologies",
        contact_title: "Follow Me",
        contact_subtitle: "Pick a channel to follow for news and new freebies.",
        footer: "© 2026 Alex Rivera. All rights reserved."
    }
};

// Fallback Default Social Links
const DEFAULT_SOCIALS = [
    { name: 'Instagram', handle: '@yourname', url: 'https://instagram.com', icon: 'fa-brands fa-instagram', color: '#E4405F' },
    { name: 'Facebook', handle: 'Your Page', url: 'https://facebook.com', icon: 'fa-brands fa-facebook', color: '#1877F2' },
    { name: 'LINE', handle: '@yourline', url: 'https://line.me', icon: 'fa-brands fa-line', color: '#06C755' },
    { name: 'TikTok', handle: '@yourname', url: 'https://tiktok.com', icon: 'fa-brands fa-tiktok', color: '#F1F5F9' },
    { name: 'YouTube', handle: 'Your Channel', url: 'https://youtube.com', icon: 'fa-brands fa-youtube', color: '#FF0000' },
    { name: 'GitHub', handle: 'yourname', url: 'https://github.com', icon: 'fa-brands fa-github', color: '#F1F5F9' },
    { name: 'Email', handle: 'name@example.com', url: 'mailto:name@example.com', icon: 'fa-solid fa-envelope', color: '#60A5FA' }
];

let currentLang = localStorage.getItem('app_lang') || 'th';
let db = null;
let itemsData = null;
let currentStatus = 'online';

document.addEventListener('DOMContentLoaded', () => {
    if (typeof feather !== 'undefined') feather.replace();

    if (window.supabase && window.SUPABASE_URL) {
        try {
            db = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
        } catch(e) {
            console.log("Supabase initialization skipped/failed:", e);
        }
    }

    applyLanguage(currentLang);
    switchTab('home');

    loadStatus();
    loadItems();
    loadSocials();
});

// Toggle TH / EN Language
function toggleLanguage() {
    currentLang = currentLang === 'th' ? 'en' : 'th';
    localStorage.setItem('app_lang', currentLang);
    applyLanguage(currentLang);
    renderStatus();
    if (itemsData) renderItems(itemsData);
}

function applyLanguage(lang) {
    const langLabel = document.getElementById('lang-label');
    if (langLabel) langLabel.textContent = lang.toUpperCase();

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });
    document.documentElement.setAttribute('lang', lang);
}

// Tab Navigation Manager
function switchTab(tabId) {
    document.querySelectorAll('.app-section').forEach(sec => sec.classList.remove('active-section'));
    const target = document.getElementById('tab-' + tabId);
    if (target) target.classList.add('active-section');

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabId);
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Load Hire Status
async function loadStatus() {
    if (!db) return;
    try {
        const { data } = await db.from('settings').select('status').eq('id', 1).single();
        if (data && data.status) {
            currentStatus = data.status;
            renderStatus();
        }
    } catch (e) {
        console.log("Load status failed:", e);
    }
}

function renderStatus() {
    const isOnline = currentStatus === 'online';
    const text = isOnline ? translations[currentLang].status_online : translations[currentLang].status_offline;
    const color = isOnline ? '#10b981' : '#6b7280';

    const statusText = document.getElementById('status-text');
    const statusDot = document.getElementById('status-dot');
    const statusBadge = document.getElementById('status-badge');
    const statusAvatar = document.getElementById('status-avatar');

    if (statusText) statusText.textContent = text;
    if (statusDot) statusDot.style.backgroundColor = color;
    if (statusAvatar) statusAvatar.style.backgroundColor = color;
    if (statusBadge) {
        statusBadge.style.color = color;
        statusBadge.style.borderColor = color + '33';
        statusBadge.style.backgroundColor = color + '1a';
    }
}

// Load Products / Freebies
async function loadItems() {
    if (!db) {
        renderItems([]);
        return;
    }
    try {
        const { data, error } = await db.from('freebies').select('*').eq('is_active', true).order('sort_order').order('created_at', { ascending: false });
        if (!error && data) {
            itemsData = data;
            renderItems(itemsData);
        } else {
            renderItems([]);
        }
    } catch (e) {
        renderItems([]);
    }
}

function renderItems(list) {
    const box = document.getElementById('product-list');
    if (!box) return;

    if (!list || list.length === 0) {
        box.innerHTML = '<p class="text-xs text-dark-muted col-span-full py-8 text-center">ยังไม่มีของแจกตอนนี้ ไว้มาใหม่นะครับ</p>';
        return;
    }

    const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const safeUrl = u => (/^https?:\/\//i.test(u || '') ? u : '');

    box.innerHTML = list.map((p, i) => `
        <div class="bg-dark-card border border-dark-border rounded-2xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
            <div class="space-y-3">
                ${safeUrl(p.image_url) ? `<img src="${esc(p.image_url)}" alt="${esc(p.name)}" loading="lazy" class="w-full h-36 object-cover rounded-xl">` : ''}
                <div class="flex justify-between items-start">
                    ${p.tag ? `<span class="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-dark-cardSec border border-dark-border text-dark-accent">${esc(p.tag)}</span>` : '<span></span>'}
                    <span class="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400">FREE</span>
                </div>
                <h3 class="text-sm font-semibold text-dark-text">${esc(p.name)}</h3>
                <p class="text-xs text-dark-muted leading-relaxed">${esc(p.description)}</p>
            </div>
            <button onclick="claimItem(${i})" class="w-full mt-3 py-2 rounded-xl bg-dark-accent text-white text-xs font-medium hover:opacity-90 transition-clean">
                ${esc(translations[currentLang].claim_btn)}
            </button>
        </div>
    `).join('');
}

function claimItem(index) {
    if (!itemsData || !itemsData[index]) return;
    const p = itemsData[index];
    const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const link = /^https?:\/\//i.test(p.link_url || '') ? p.link_url : '';

    Swal.fire({
        background: '#15181D',
        color: '#F1F5F9',
        confirmButtonColor: '#60A5FA',
        cancelButtonColor: '#262B33',
        icon: 'success',
        title: p.name,
        html: p.details ? `<div style="text-align:left;white-space:pre-wrap;font-size:.85rem">${esc(p.details)}</div>` : 'รับของเรียบร้อยแล้ว',
        showConfirmButton: !!link,
        confirmButtonText: 'เปิดลิงก์ / ดาวน์โหลด',
        showCancelButton: true,
        cancelButtonText: 'ปิด'
    }).then(r => {
        if (r.isConfirmed && link) window.open(link, '_blank', 'noopener');
    });
}

// Load Social Media Links
async function loadSocials() {
    if (!db) {
        renderSocials(DEFAULT_SOCIALS);
        return;
    }
    try {
        const { data, error } = await db.from('socials').select('*').eq('is_active', true).order('sort_order').order('created_at');
        if (!error && data && data.length > 0) {
            renderSocials(data);
        } else {
            renderSocials(DEFAULT_SOCIALS);
        }
    } catch (e) {
        renderSocials(DEFAULT_SOCIALS);
    }
}

function renderSocials(list) {
    const box = document.getElementById('social-list');
    if (!box) return;

    const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const ok = u => /^(https?:\/\/|mailto:)/i.test(u || '');

    box.innerHTML = list.filter(x => ok(x.url)).map(x => `
        <a href="${esc(x.url)}" target="_blank" rel="noopener noreferrer"
           class="flex items-center gap-4 p-4 rounded-2xl bg-dark-cardSec border border-dark-border hover:-translate-y-0.5 hover:border-dark-accent transition-clean">
            <span class="w-10 h-10 rounded-xl flex items-center justify-center text-lg bg-dark-card border border-dark-border" style="color:${esc(x.color || '#60A5FA')}">
                <i class="${esc(x.icon)}"></i>
            </span>
            <span class="flex-1 min-w-0">
                <span class="block text-sm font-medium text-dark-text">${esc(x.name)}</span>
                <span class="block text-xs text-dark-muted truncate">${esc(x.handle || x.url)}</span>
            </span>
            <i class="fa-solid fa-arrow-up-right-from-square text-xs text-dark-muted"></i>
        </a>
    `).join('') || '<p class="text-xs text-dark-muted py-4 text-center">ยังไม่มีช่องทางติดตาม</p>';
}