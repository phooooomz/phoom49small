import { initTabBar, setActiveTab } from './tabbar.js';

// Global application state
const state = {
    currentTab: 'home',
    isLoading: false
};

const appContainer = document.getElementById('app');

/**
 * Render thinking / loading state with 1.6s light sweep
 */
function renderLoading() {
    return `
        <div class="loading-screen">
            <div class="loading-spinner"></div>
            <div class="thinking-text">Thinking…</div>
        </div>
    `;
}

/**
 * Load tab view content
 */
async function loadView(tabId) {
    state.isLoading = true;
    appContainer.innerHTML = renderLoading();

    try {
        // Simulate fetch delay or view resolution
        const response = await fetch(`./views/${tabId}.html`);
        let html = '';
        if (response.ok) {
            html = await response.text();
        } else {
            html = `<div style="text-align:center; padding: 2rem;"><h2>View loaded: ${tabId}</h2></div>`;
        }

        // Brief delay to showcase the smooth thinking transition
        setTimeout(() => {
            state.isLoading = false;
            appContainer.innerHTML = html;
        }, 500);

    } catch (err) {
        state.isLoading = false;
        appContainer.innerHTML = `<div style="text-align:center; padding: 2rem;"><h2>${tabId.toUpperCase()}</h2></div>`;
    }
}

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    setActiveTab(state.currentTab);
    loadView(state.currentTab);

    initTabBar((selectedTab) => {
        state.currentTab = selectedTab;
        loadView(selectedTab);
    });
});