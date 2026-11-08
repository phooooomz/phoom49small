/**
 * Developer Portfolio - Ultra Clean Minimal Script
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Feather Icons
    if (typeof feather !== 'undefined') {
        feather.replace();
    }

    // 2. Initialize Dark / Light Theme Status
    initTheme();

    // 3. Highlight Current Active Tab in Navigation Bar based on URL
    setActiveTabByUrl();
});

/**
 * Toggle Theme Function (Dark / Light)
 */
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
    
    // Refresh Feather Icons after theme switch
    if (typeof feather !== 'undefined') {
        setTimeout(() => feather.replace(), 50);
    }
}

/**
 * Restore User Theme Preference from LocalStorage
 */
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const html = document.documentElement;
    
    if (savedTheme === 'light') {
        html.classList.remove('dark');
        html.classList.add('light');
    } else {
        html.classList.add('dark');
        html.classList.remove('light');
    }
}

/**
 * Dynamically check current location and set active status on Tab Bar
 */
function setActiveTabByUrl() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav .tab-btn');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}