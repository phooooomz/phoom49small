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

// Tab Switching & Filtering Functionality
function switchTab(tabKey) {
    const buttons = document.querySelectorAll('.tab-btn');
    const items = document.querySelectorAll('.portfolio-item');

    // Update active tab buttons visual state
    buttons.forEach(btn => {
        if (btn.getAttribute('data-tab') === tabKey) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Filter Items by category
    items.forEach(item => {
        const category = item.getAttribute('data-category');
        if (tabKey === 'all' || category === tabKey) {
            item.classList.remove('hidden-tab');
        } else {
            item.classList.add('hidden-tab');
        }
    });
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