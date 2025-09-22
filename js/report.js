// Execute when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get the current measurement data from localStorage
    const measurementData = localStorage.getItem('currentMeasurement');
    let reportData;

    // If measurement data exists, generate the report based on it; otherwise, use sample data
    if (measurementData) {
        const parsedData = JSON.parse(measurementData);
        reportData = generateProfessionalReportData(parsedData);
    } else {
        // Provide a default structure for demonstration purposes
        reportData = generateProfessionalReportData({ user: 'Sample User', weight: 75.5 });
    }

    // Populate the report page with the generated data
    populateReport(reportData);
    // Initialize the time display and set it to update every minute
    updateTime();
    setInterval(updateTime, 60000);
});

// Update the status bar time
function updateTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}`;
    const timeElement = document.getElementById('current-time');
    if (timeElement) timeElement.textContent = timeString;
}

// Event handler for the "Measure Again" button
function measureAgain() {
    window.location.href = 'measure-guide.html';
}

// Generate professional report data
function generateProfessionalReportData(measurement) {
    const data = {};
    const weight = parseFloat(measurement.weight);
    const height = 1.88;
    const age = 30;
    const gender = 'Male';

    // User Basic Information
    data.user = { name: measurement.user, height: height * 100, age, gender };

    // Overall Score
    data.score = Math.floor(Math.random() * 15 + 75);

    // Body Composition Analysis
    const body_water = weight * 0.58;
    const protein = weight * 0.16;
    const minerals = weight * 0.04;
    const body_fat = weight * 0.22;
    data.composition = [
        { label: 'Total Body Water', value: body_water.toFixed(1) + ' kg' },
        { label: 'Protein', value: protein.toFixed(1) + ' kg' },
        { label: 'Minerals', value: minerals.toFixed(1) + ' kg' },
        { label: 'Body Fat Mass', value: body_fat.toFixed(1) + ' kg' },
    ];

    // Muscle-Fat Analysis
    data.muscleFat = [
        { label: 'Weight', value: weight, range: [55, 75] },
        { label: 'Skeletal Muscle Mass', value: weight * 0.45, range: [25, 35] },
        { label: 'Body Fat Mass', value: body_fat, range: [10, 18] },
    ];

    // Obesity Analysis
    data.obesity = [
        { label: 'BMI', value: (weight / (height * height)).toFixed(1), unit: '' },
        { label: 'Percent Body Fat', value: (body_fat / weight * 100).toFixed(1), unit: '%' },
    ];

    // Comparison with Previous
    data.comparison = [
        { label: 'Weight', value: weight.toFixed(1) + ' kg', change: (Math.random() * 2 - 1).toFixed(1) },
        { label: 'Skeletal Muscle Mass', value: (weight * 0.45).toFixed(1) + ' kg', change: (Math.random() * 1 - 0.5).toFixed(1) },
        { label: 'Percent Body Fat', value: (body_fat / weight * 100).toFixed(1) + ' %', change: (Math.random() * 1 - 0.5).toFixed(1) },
        { label: 'Overall Score', value: data.score, change: Math.floor(Math.random() * 5 - 2) },
    ];

    // Overall Evaluation
    data.evaluation = "Your body condition is good, and all indicators are within the standard range. It is recommended to maintain your current diet and exercise habits.";

    return data;
}

// Populate the report with data
function populateReport(data) {
    // Populate user basic information
    document.getElementById('user-name').textContent = data.user.name;
    document.getElementById('user-height').textContent = `${data.user.height} cm`;
    document.getElementById('user-age').textContent = data.user.age;
    document.getElementById('user-gender').textContent = data.user.gender;
    document.getElementById('inbody-score').textContent = data.score;

    // Populate Body Composition Analysis
    const compositionContainer = document.getElementById('composition-analysis');
    compositionContainer.innerHTML = data.composition.map(item => `
        <div class="composition-item">
            <div class="value">${item.value}</div>
            <div class="label">${item.label}</div>
        </div>
    `).join('');

    // Populate Muscle-Fat Analysis
    const muscleFatContainer = document.getElementById('muscle-fat-analysis');
    muscleFatContainer.innerHTML = data.muscleFat.map(item => createStatusBar(item)).join('');

    // Populate Obesity Analysis
    const obesityContainer = document.getElementById('obesity-analysis');
    obesityContainer.innerHTML = data.obesity.map(item => `
        <div class="obesity-item">
            <div class="value">${item.value} <span class="text-base">${item.unit}</span></div>
            <div class="label">${item.label}</div>
        </div>
    `).join('');

    // Populate Comparison with Previous
    const comparisonContainer = document.getElementById('comparison-table');
    comparisonContainer.innerHTML = data.comparison.map(item => `
        <tr>
            <td class="label">${item.label}</td>
            <td class="value">${item.value}</td>
            <td class="comparison-change">
                ${createChangeIndicator(item.change)}
            </td>
        </tr>
    `).join('');

    // Populate Overall Evaluation
    document.getElementById('evaluation-text').textContent = data.evaluation;
}

// Create a status bar
function createStatusBar(item) {
    const { label, value, range } = item;
    const [min, max] = range;
    const percentage = Math.min(Math.max(((value - min) / (max - min)) * 100, 0), 100);
    
    let colorClass = 'var(--normal-color)';
    if (value < min) colorClass = 'var(--low-color)';
    if (value > max) colorClass = 'var(--high-color)';

    return `
        <div class="bar-analysis-item">
            <div class="header">
                <span class="label">${label}</span>
                <span class="value">${value.toFixed(1)} kg</span>
            </div>
            <div class="status-bar-bg">
                <div class="status-segment" style="width: 33.3%; background-color: var(--low-color);"></div>
                <div class="status-segment" style="width: 33.3%; background-color: var(--normal-color);"></div>
                <div class="status-segment" style="width: 33.3%; background-color: var(--high-color);"></div>
            </div>
            <div class="status-indicator">
                <div class="indicator-dot" style="left: ${percentage}%;"></div>
            </div>
        </div>
    `;
}

// Create an indicator for data change (up/down arrow)
function createChangeIndicator(change) {
    const value = parseFloat(change);
    if (value > 0) {
        return `<span class="change-arrow up">▲</span> <span>${Math.abs(value)}</span>`;
    } else if (value < 0) {
        return `<span class="change-arrow down">▼</span> <span>${Math.abs(value)}</span>`;
    }
    return `<span>-</span>`;
}
