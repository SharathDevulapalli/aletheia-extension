function drawHeatmap(websites) {
    const canvas = document.getElementById('heatmapCanvas');
    const ctx = canvas.getContext('2d');

    const maxVisits = Math.max(...Object.values(websites).map(site => site.visits));
    const colors = generateHeatmapColors(maxVisits);

    let y = 10;
    for (const [domain, data] of Object.entries(websites)) {
        const color = colors[data.visits];
        ctx.fillStyle = color;
        ctx.fillRect(10, y, 380, 30);
        ctx.fillStyle = '#000';
        ctx.fillText(`${domain}: ${data.visits} visits`, 20, y + 20);
        y += 40;
    }
}

function generateHeatmapColors(maxVisits) {
    const colors = {};
    for (let i = 0; i <= maxVisits; i++) {
        const intensity = Math.floor((i / maxVisits) * 255);
        colors[i] = `rgb(${255 - intensity}, ${intensity}, 0)`;
    }
    return colors;
}
