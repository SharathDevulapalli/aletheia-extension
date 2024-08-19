document.addEventListener('DOMContentLoaded', () => {
    const topWebsiteNameElement = document.getElementById('topWebsiteName');
    const topWebsiteTimeElement = document.getElementById('topWebsiteTime');
    const topWebsiteVisitsElement = document.getElementById('topWebsiteVisits');
    const viewReportButton = document.getElementById('viewReport');

    // Set initial state
    topWebsiteNameElement.textContent = 'Loading...';
    topWebsiteTimeElement.textContent = 'Time Spent: 0h 0m';
    topWebsiteVisitsElement.textContent = 'Visits: 0';

    // Fetch stored data from chrome.storage.local
    chrome.storage.local.get('websites', (data) => {
        if (chrome.runtime.lastError) {
            console.error('Error retrieving data:', chrome.runtime.lastError);
            topWebsiteNameElement.textContent = 'Error loading data';
            return;
        }

        const websites = data.websites || {};
        let topWebsite = '';
        let maxTimeSpent = 0;
        let maxVisits = 0;

        // Iterate through stored websites to find the one with the most time spent
        for (const [domain, siteData] of Object.entries(websites)) {
            // Exclude invalid or irrelevant domains
            if (domain === 'newtab' || domain === 'extensions') continue;

            // Determine if the current website has more time spent
            if (siteData.timeSpent > maxTimeSpent) {
                maxTimeSpent = siteData.timeSpent;
                maxVisits = siteData.visits;
                topWebsite = domain;
            }
        }

        // Log data for debugging purposes
        console.log("Websites data:", websites);
        console.log("Top website:", topWebsite);

        // Update the UI based on the top website data
        if (topWebsite) {
            const hours = Math.floor(maxTimeSpent / 3600000); // Convert ms to hours
            const minutes = Math.floor((maxTimeSpent % 3600000) / 60000); // Remaining minutes after hours

            topWebsiteNameElement.textContent = `Website: ${topWebsite}`;
            topWebsiteTimeElement.textContent = `Time Spent: ${hours}h ${minutes}m`;
            topWebsiteVisitsElement.textContent = `Visits: ${maxVisits}`;
        } else {
            topWebsiteNameElement.textContent = 'No data available';
            topWebsiteTimeElement.textContent = 'Time Spent: 0h 0m';
            topWebsiteVisitsElement.textContent = 'Visits: 0';
        }

        // Handle the "View Full Report" button click
        viewReportButton.addEventListener('click', () => {
            chrome.tabs.create({ url: chrome.runtime.getURL('report.html') });
        });
    });
});
