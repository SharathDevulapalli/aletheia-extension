let websites = {};

// Listen for when a tab is updated (e.g., a new page is loaded)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        trackWebsite(tab);
    }
});

// Listen for when the active tab changes (e.g., switching between tabs)
chrome.tabs.onActivated.addListener(activeInfo => {
    chrome.tabs.get(activeInfo.tabId, tab => {
        trackWebsite(tab);
    });
});

// Function to track website usage
function trackWebsite(tab) {
    // Ensure the tab URL is defined and starts with http or https
    if (!tab.url || !/^https?:\/\//.test(tab.url)) {
        return; // Exit if the URL is not valid
    }

    try {
        const url = new URL(tab.url);
        const domain = url.hostname;

        // Exclude "new tab" and "extensions" pages
        if (domain === 'newtab' || domain === 'extensions') {
            return;
        }

        const now = new Date().getTime();

        if (!websites[domain]) {
            websites[domain] = {
                visits: 0,
                timeSpent: 0,
                lastVisit: now
            };
        }

        const site = websites[domain];
        site.visits += 1;
        const lastVisitTime = site.lastVisit;
        site.timeSpent += now - lastVisitTime;
        site.lastVisit = now;

        chrome.storage.local.set({ websites });
    } catch (e) {
        console.error('Error processing URL:', tab.url, e);
    }
}


// Optional: Handle when the browser is closed or a window is unfocused
chrome.windows.onFocusChanged.addListener(windowId => {
    if (windowId === chrome.windows.WINDOW_ID_NONE) {
        // The window lost focus (user switched to a different application)
        Object.keys(websites).forEach(domain => {
            const now = new Date().getTime();
            const site = websites[domain];
            const lastVisitTime = site.lastVisit;
            site.timeSpent += now - lastVisitTime;
            site.lastVisit = now;
        });
    }
});
