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
            const websites = data.websites || [];
            let totalTime = 0;
            let totalVisits = 0;
            let rows = '';

            // Convert websites object to an array and sort by timeSpent
            const sortedWebsites = Object.entries(websites).sort((a, b) => {
                return b[1].timeSpent - a[1].timeSpent;
            });

            sortedWebsites.forEach(([domain, site]) => {
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

            // Calculate and display the total time spent
            const hours = Math.floor(totalTime / 60);  // Convert total minutes to hours
            const minutes = totalTime % 60;  // Get the remaining minutes
            averageTimeElement.textContent = `${hours}h ${minutes}m`;

            // Calculate and display percentage change from last period (placeholder logic)
            const previousTotalTime = 0; // Replace this with actual data from the previous period
            const percentageChange = calculatePercentageChange(totalTime, previousTotalTime);
            changeIndicatorElement.textContent = `- ${percentageChange}% from last period`;

            // Populate table with detailed usage
            websiteTableBody.innerHTML = rows;
        });
    }

    // Helper function to calculate percentage change
    function calculatePercentageChange(current, previous) {
        if (previous === 0) return 0;  // Avoid division by zero
        return (((current - previous) / previous) * 100).toFixed(2);
    }

    // Helper function to capitalize the first letter of the period
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // Helper function to convert milliseconds to minutes
    function convertMillisecondsToMinutes(milliseconds) {
        return Math.round(milliseconds / 60000);
    }

    // Initialize view with the default period
    updateView(currentPeriod);
});
