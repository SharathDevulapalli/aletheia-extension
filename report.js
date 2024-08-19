document.addEventListener('DOMContentLoaded', function() {
    const websiteTableBody = document.querySelector('#websiteTable tbody');
    const selectedPeriodElement = document.getElementById('selectedPeriod');
    const averageTimeElement = document.getElementById('averageTime');
    const changeIndicatorElement = document.getElementById('changeIndicator');

    // Time period buttons
    const dayViewButton = document.getElementById('dayView');
    const weekViewButton = document.getElementById('weekView');
    const monthViewButton = document.getElementById('monthView');
    const quarterViewButton = document.getElementById('quarterView');
    const yearViewButton = document.getElementById('yearView');

    // Set initial view to 'Week'
    let currentPeriod = 'week';

    // Event listeners for period buttons
    dayViewButton.addEventListener('click', () => setPeriod('day'));
    weekViewButton.addEventListener('click', () => setPeriod('week'));
    monthViewButton.addEventListener('click', () => setPeriod('month'));
    quarterViewButton.addEventListener('click', () => setPeriod('quarter'));
    yearViewButton.addEventListener('click', () => setPeriod('year'));

    function setPeriod(period) {
        currentPeriod = period;
        selectedPeriodElement.textContent = capitalizeFirstLetter(period);
        updateView(period);

        // Update active button styling
        document.querySelector('.time-selection .active').classList.remove('active');
        document.getElementById(`${period}View`).classList.add('active');
    }

    function updateView(period) {
        chrome.storage.local.get('websites', function(data) {
            const websites = data.websites || {};
            let totalTime = 0;
            let totalVisits = 0;
            let rows = '';

            Object.keys(websites).forEach(domain => {
                const site = websites[domain];
                const timeSpent = convertMillisecondsToMinutes(site.timeSpent);
                totalTime += timeSpent;
                totalVisits += site.visits;

                rows += `
                    <tr>
                        <td>${domain}</td>
                        <td>${timeSpent}</td>
                        <td>${site.visits}</td>
                    </tr>
                `;
            });

            // Calculate and display average time
            const averageTime = totalTime / Object.keys(websites).length;
            averageTimeElement.textContent = formatTime(averageTime * 60000); // converting back to milliseconds for formatting

            // Change indicator (dummy calculation, needs logic to compare with previous period)
            changeIndicatorElement.textContent = '- 0% from last period';

            // Populate table
            websiteTableBody.innerHTML = rows;
        });
    }

    // Helper function to capitalize the first letter of the period
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // Helper function to convert milliseconds to minutes
    function convertMillisecondsToMinutes(milliseconds) {
        return Math.round(milliseconds / 60000);
    }

    // Helper function to format time from minutes to "xh ym"
    function formatTime(milliseconds) {
        let totalMinutes = Math.floor(milliseconds / 60000);
        let hours = Math.floor(totalMinutes / 60);
        let minutes = totalMinutes % 60;
        return `${hours}h ${minutes}m`;
    }

    // Initialize view with the default period
    updateView(currentPeriod);
});
