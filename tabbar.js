/**
 * TabBar Management - Direct Active Highlight
 */
export function initTabBar(onTabChange) {
    const tabItems = document.querySelectorAll('.tab-item');

    tabItems.forEach(tab => {
        tab.addEventListener('click', (e) => {
            const targetTab = tab.getAttribute('data-tab');

            // Remove active highlight from all tabs
            tabItems.forEach(item => item.classList.remove('active'));

            // Set active highlight directly to clicked tab
            tab.classList.add('active');

            if (typeof onTabChange === 'function') {
                onTabChange(targetTab);
            }
        });
    });
}

export function setActiveTab(tabId) {
    const tabItems = document.querySelectorAll('.tab-item');
    tabItems.forEach(item => {
        if (item.getAttribute('data-tab') === tabId) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}