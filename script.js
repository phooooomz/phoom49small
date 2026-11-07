/**
 * --------------------------------------------------
 * Phoom49small Link-in-Bio External JavaScript Logic
 * --------------------------------------------------
 */

document.addEventListener("DOMContentLoaded", () => {
    // Set dynamic current year in footer
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // Initialize Theme on startup
    initTheme();
});

/**
 * Show custom Toast notification banner
 * @param {string} message 
 */
function showStatusToast(message) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-message');

    if (!toast || !toastMsg) return;

    toastMsg.textContent = message;

    toast.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4');
    toast.classList.add('opacity-100', 'translate-y-0');

    setTimeout(() => {
        toast.classList.remove('opacity-100', 'translate-y-0');
        toast.classList.add('opacity-0', 'pointer-events-none', 'translate-y-4');
    }, 3000);
}

/**
 * Toggle Light & Dark Mode with LocalStorage persistence
 */
function toggleTheme() {
    const html = document.documentElement;

    if (html.classList.contains('dark')) {
        html.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    } else {
        html.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    }
}

/**
 * Initialize theme settings based on saved user preference
 */
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.documentElement.classList.remove('dark');
    } else {
        document.documentElement.classList.add('dark');
    }
}

/**
 * Copy active Profile URL to Clipboard with fallback support
 */
function copyProfileLink() {
    const profileUrl = window.location.href;
    
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(profileUrl)
            .then(() => showStatusToast("คัดลอกลิงก์โปรไฟล์เรียบร้อยแล้ว!"))
            .catch(() => fallbackCopyTextToClipboard(profileUrl));
    } else {
        fallbackCopyTextToClipboard(profileUrl);
    }
}

/**
 * Fallback mechanism for copying text in non-secure contexts or iFrames
 * @param {string} text 
 */
function fallbackCopyTextToClipboard(text) {
    const tempInput = document.createElement('textarea');
    tempInput.value = text;
    tempInput.style.position = 'fixed';
    tempInput.style.left = '-9999px';
    document.body.appendChild(tempInput);
    tempInput.focus();
    tempInput.select();
    
    try {
        document.execCommand('copy');
        showStatusToast("คัดลอกลิงก์โปรไฟล์เรียบร้อยแล้ว!");
    } catch (err) {
        showStatusToast("ไม่สามารถคัดลอกลิงก์ได้");
    }
    document.body.removeChild(tempInput);
}