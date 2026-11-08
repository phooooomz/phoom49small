/**
 * Developer Portfolio - Script with Theme & Multi-language (TH/EN) System
 */

// Multi-language dictionary
const translations = {
    th: {
        name: "อเล็กซ์ ริเวร่า",
        tab_home: "หน้าแรก", tab_store: "แจกฟรี", tab_about: "เกี่ยวกับ", tab_contact: "ติดตาม", claim_btn: "รับฟรี",
        status: "Available for hire",
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
        prod1_title: "Ultra Clean Portfolio Template",
        prod1_desc: "เทมเพลตเว็บไซต์ส่วนตัวสำหรับนักพัฒนา ดีไซน์เรียบหรู รองรับ Responsive และ Dark Theme",
        btn_order: "สั่งซื้อ / สอบถาม",
        prod2_title: "Custom Web Application",
        prod2_desc: "รับออกแบบและพัฒนาระบบเว็บแอปพลิเคชันตามโจทย์ธุรกิจด้วย React, Next.js และ Node.js",
        prod2_price: "เริ่มต้น ฿15,000",
        btn_consult: "ปรึกษาโครงการ",
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
        form_name: "ชื่อของคุณ",
        form_email: "อีเมล",
        form_message: "ข้อความ",
        form_submit: "ส่งข้อความ",
        footer: "© 2026 อเล็กซ์ ริเวร่า. สงวนลิขสิทธิ์ทั้งหมด",
        alert_contact: "ส่งข้อความเรียบร้อยแล้ว!"
    },
    en: {
        name: "Alex Rivera",
        tab_home: "Home", tab_store: "Freebies", tab_about: "About", tab_contact: "Follow", claim_btn: "Get it free",
        status: "Available for hire",
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
        prod1_title: "Ultra Clean Portfolio Template",
        prod1_desc: "Minimal personal bio & portfolio template for developers with responsive design and dark mode.",
        btn_order: "Order / Inquiry",
        prod2_title: "Custom Web Application",
        prod2_desc: "Tailor-made web development built with React, Next.js, and Node.js for modern business needs.",
        prod2_price: "Starting at ฿15,000",
        btn_consult: "Consult Project",
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
        form_name: "Your Name",
        form_email: "Email Address",
        form_message: "Message",
        form_submit: "Send Message",
        footer: "© 2026 Alex Rivera. All rights reserved.",
        alert_contact: "Message sent successfully!"
    }
};

let currentLang = 'th';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Feather Icons
    if (typeof feather !== 'undefined') {
        feather.replace();
    }

    // 2. Initialize Dark / Light Theme
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');

    // 3. Initialize Language
    initLanguage();

    // 4. Highlight Active Navigation Tab
    setActiveTabByUrl();
});

/**
 * Initialize Language Preference
 */
function initLanguage() {
    const savedLang = 'th';
    if (savedLang && (savedLang === 'th' || savedLang === 'en')) {
        currentLang = savedLang;
    }
    applyLanguage(currentLang);
}

/**
 * Apply Language to UI Text Elements
 */
function applyLanguage(lang) {
    const langIndicator = document.getElementById('lang-indicator');
    if (langIndicator) {
        langIndicator.textContent = lang.toUpperCase();
    }

    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });

    document.documentElement.setAttribute('lang', lang);
}

/**
 * Handle Contact Form Submission
 */
function handleContactSubmit(event) {
    event.preventDefault();
    const msg = translations[currentLang]?.alert_contact || 'Message sent!';
    alert(msg);
    event.target.reset();
}

/**
 * Set Active Tab Highlight by URL
 */
function setActiveTabByUrl() {
    const clean = p => (p || 'index').replace(/\.html$/, '') || 'index';
    const currentPage = clean(window.location.pathname.split('/').pop());
    const navLinks = document.querySelectorAll('nav .tab-btn');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (clean(href) === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}