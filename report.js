document.addEventListener('DOMContentLoaded', () => {
    let selectedView = 'week'; // Default to 'week'
    updateView(selectedView);

    // Event listeners for the time selection buttons
    document.getElementById('dayView').addEventListener('click', () => {
        selectedView = 'day';
        updateView(selectedView);
    });

    document.getElementById('weekView').addEventListener('click', () => {
        selectedView = 'week';
        updateView(selectedView);
    });

    document.getElementById('monthView').addEventListener('click', () => {
        selectedView = 'month';
        updateView(selectedView);
    });

    document.getElementById('quarterView').addEventListener('click', () => {
        selectedView = 'quarter';
        updateView(selectedView);
    });

    document.getElementById('yearView').addEventListener('click', () => {
        selectedView = 'year';
        updateView(selectedView);
    });
});

function updateView(view) {
    const periodText = getPeriodText(view);
    document.getElementById('selectedPeriod').textContent = periodText;

    chrome.storage.local.get('websites', (data) => {
        const websites = data.websites || {};

        const processedData = processData(websites, view);

        // Update the UI elements with the processed data
        document.getElementById('averageTime').textContent = processedData.averageTime;
        document.getElementById('changeIndicator').textContent = processedData.changeIndicator;

        updateTable(processedData.mostUsedWebsites);
    });
}

function getPeriodText(view) {
    switch (view) {
        case 'day':
            return "Day's Average";
        case 'week':
            return "Week's Average";
        case 'month':
            return "Month's Average";
        case 'quarter':
            return "Quarter's Average";
        case 'year':
            return "Year's Average";
        default:
            return "Period's Average";
    }
}

function updateTable(mostUsedWebsites) {
    const tableBody = document.querySelector('#websiteTable tbody');
    tableBody.innerHTML = ''; // Clear any existing rows

    // Sort the websites in descending order of time spent
    mostUsedWebsites.sort((a, b) => b.timeSpent - a.timeSpent);

    mostUsedWebsites.forEach(website => {
        const row = document.createElement('tr');
        const websiteCell = document.createElement('td');
        const timeSpentCell = document.createElement('td');
        const visitsCell = document.createElement('td');

        websiteCell.textContent = website.name;
        timeSpentCell.textContent = `${website.timeSpent.toFixed(2)} min`;
        visitsCell.textContent = website.visits;

        row.appendChild(websiteCell);
        row.appendChild(timeSpentCell);
        row.appendChild(visitsCell);

        tableBody.appendChild(row);
    });
}


function processData(websites, view) {
    const processedData = {
        averageTime: '',
        changeIndicator: '',
        mostUsedWebsites: []
    };

    let totalMinutes = 0;
    let totalVisits = 0;
    let mostVisitedWebsites = {};

    // Process each website
    for (const [domain, data] of Object.entries(websites)) {
        if (domain === 'newtab' || domain === 'extensions') continue;

        // Convert time spent to minutes
        const timeSpentInMinutes = data.timeSpent / 60000; // Convert from milliseconds to minutes

        // Aggregate time and visits based on the selected view
        if (!mostVisitedWebsites[domain]) {
            mostVisitedWebsites[domain] = {
                name: domain,
                timeSpent: 0,
                visits: 0
            };
        }

        mostVisitedWebsites[domain].timeSpent += timeSpentInMinutes;
        mostVisitedWebsites[domain].visits += data.visits;

        totalMinutes += timeSpentInMinutes;
        totalVisits += data.visits;
    }

    // Sort websites by time spent descending
    let adjustedWebsites = Object.values(mostVisitedWebsites).sort((a, b) => b.timeSpent - a.timeSpent);
    processedData.mostUsedWebsites = adjustedWebsites;

    // Calculate the average time based on the total minutes
    const averageTime = (totalMinutes / Object.keys(websites).length).toFixed(2);
    processedData.averageTime = `${averageTime} min avg`;

    // Change indicator (for simplicity, assume no change)
    processedData.changeIndicator = '0% from last period';

    return processedData;
}
