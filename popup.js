document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get('websites', (data) => {
        const websites = data.websites || {};
        let topWebsite = '';
        let maxTimeSpent = 0;
        let maxVisits = 0;

        // Find the most viewed website
        for (const [domain, siteData] of Object.entries(websites)) {
            if (domain === 'newtab' || domain === 'extensions') continue;

            if (siteData.timeSpent > maxTimeSpent) {
                maxTimeSpent = siteData.timeSpent;
                maxVisits = siteData.visits;
                topWebsite = domain;
            }
        }

        // Log data for debugging
        console.log("Websites data:", websites);
        console.log("Top website:", topWebsite);

        // Update the popup UI with the most viewed website data
        const hours = Math.floor(maxTimeSpent / 3600000);
        const minutes = Math.floor((maxTimeSpent % 3600000) / 60000);

        document.getElementById('topWebsiteName').textContent = `Website: ${topWebsite}`;
        document.getElementById('topWebsiteTime').textContent = `Time Spent: ${hours}h ${minutes}m`;
        document.getElementById('topWebsiteVisits').textContent = `Visits: ${maxVisits}`;

        // Handle the "View Full Report" button click
        document.getElementById('viewReport').addEventListener('click', () => {
            chrome.tabs.create({ url: chrome.runtime.getURL('report.html') });
        });
    });
});
