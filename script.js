// Initialize Feather Icons
document.addEventListener('DOMContentLoaded', () => {
    feather.replace();
    initTheme();
});

// Theme Toggle Functionality
function toggleTheme() {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
        html.classList.remove('dark');
        html.classList.add('light');
        localStorage.setItem('theme', 'light');
    } else {
        html.classList.remove('light');
        html.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    }
    // Re-render icons after DOM modification
    setTimeout(() => feather.replace(), 50);
}

// Initialize Theme Preference from LocalStorage
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
    } else {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
    }
}

// Tab Switching Functionality
function switchTab(tabKey) {
    const buttons = document.querySelectorAll('.tab-btn');
    const projectsSec = document.getElementById('projects-section');
    const expSec = document.getElementById('experience-section');
    const contactSec = document.getElementById('contact-section');
    const techCard = document.getElementById('tech-stack-card');
    const focusCard = document.getElementById('focus-card');

    // Update active tab buttons
    buttons.forEach(btn => {
        if (btn.getAttribute('data-tab') === tabKey) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Content Display Logic
    if (tabKey === 'all') {
        projectsSec.classList.remove('hidden-tab');
        expSec.classList.remove('hidden-tab');
        contactSec.classList.remove('hidden-tab');
        techCard.classList.remove('hidden-tab');
        focusCard.classList.remove('hidden-tab');
    } else if (tabKey === 'projects') {
        projectsSec.classList.remove('hidden-tab');
        expSec.classList.add('hidden-tab');
        contactSec.classList.add('hidden-tab');
        techCard.classList.remove('hidden-tab');
        focusCard.classList.remove('hidden-tab');
    } else if (tabKey === 'experience') {
        projectsSec.classList.add('hidden-tab');
        expSec.classList.remove('hidden-tab');
        contactSec.classList.add('hidden-tab');
    } else if (tabKey === 'contact') {
        projectsSec.classList.add('hidden-tab');
        expSec.classList.add('hidden-tab');
        contactSec.classList.remove('hidden-tab');
    }
}

// Copy Email to Clipboard
function copyEmail(e) {
    e.preventDefault();
    const email = "alex.rivera@dev.io";
    const copyTextSpan = document.getElementById('copy-text');
    
    // Standard fallback copy technique for iframe environments
    const el = document.createElement('textarea');
    el.value = email;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

    const originalText = copyTextSpan.innerText;
    copyTextSpan.innerText = "Copied to Clipboard!";
    copyTextSpan.classList.add('text-dark-accent', 'light:text-light-accent');

    setTimeout(() => {
        copyTextSpan.innerText = originalText;
        copyTextSpan.classList.remove('text-dark-accent', 'light:text-light-accent');
    }, 2000);
}

// Handle Contact Form Submission
function handleFormSubmit(e) {
    e.preventDefault();
    const status = document.getElementById('form-status');
    const form = document.getElementById('contact-form');
    
    status.classList.remove('hidden');
    form.reset();

    setTimeout(() => {
        status.classList.add('hidden');
    }, 4000);
}