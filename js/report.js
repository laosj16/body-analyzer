document.addEventListener('DOMContentLoaded', function() {
    const measurementData = localStorage.getItem('currentMeasurement');
    let reportData;
    if (measurementData) {
        const parsedData = JSON.parse(measurementData);
        reportData = generateProfessionalReportData(parsedData);
    } else {
        reportData = generateProfessionalReportData({ user: '示例用户', weight: 75.5 });
    }

    populateReport(reportData);
    setupPrintButton(); // 重新启用打印功能
    updateTime();
    setInterval(updateTime, 60000);
});

function updateTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}`;
    const timeElement = document.getElementById('current-time');
    if (timeElement) timeElement.textContent = timeString;
}

function generateProfessionalReportData(measurement) {
    const data = {};
    const weight = parseFloat(measurement.weight);
    const height = 1.75;
    const age = 30;
    const gender = '男';

    // User Info
    data.user = { name: measurement.user, height: height * 100, age, gender };

    // Composition Analysis
    const body_water = weight * 0.58;
    const protein = weight * 0.16;
    const minerals = weight * 0.04;
    const body_fat = weight * 0.22;
    data.composition = [
        { label: '身体总水分', value: body_water.toFixed(1), range: '27.0 ~ 33.0' },
        { label: '蛋白质', value: protein.toFixed(1), range: '7.2 ~ 8.8' },
        { label: '无机盐', value: minerals.toFixed(1), range: '2.5 ~ 3.1' },
        { label: '体脂肪', value: body_fat.toFixed(1), range: '10.6 ~ 16.9' },
        { label: '体重', value: weight.toFixed(1), range: '45.0 ~ 60.8' },
    ];

    // Muscle-Fat Analysis (with ranges for bar chart)
    data.muscleFat = [
        { label: '体重', value: weight.toFixed(1), min: 55, normalMin: 70, normalMax: 115, max: 205 },
        { label: '骨骼肌', value: (weight * 0.45).toFixed(1), min: 70, normalMin: 90, normalMax: 110, max: 170 },
        { label: '体脂肪', value: body_fat.toFixed(1), min: 40, normalMin: 80, normalMax: 160, max: 520 },
    ];

    // Obesity Analysis
    data.obesity = [
        { label: 'BMI', value: (weight / (height * height)).toFixed(1), range: '18.5 ~ 25.0' },
        { label: '体脂百分比', value: (body_fat / weight * 100).toFixed(1), range: '18.0 ~ 28.0' },
    ];

    // InBody Score
    data.score = Math.floor(Math.random() * 15 + 75);

    // Segmental Fat Analysis
    const trunkFat = body_fat * 0.5;
    const armFat = body_fat * 0.15;
    const legFat = body_fat * 0.35;
    data.segmentalFat = [
        { label: '左臂', value: (armFat * 0.48).toFixed(1), range: '0.2 ~ 0.4' },
        { label: '右臂', value: (armFat * 0.52).toFixed(1), range: '0.2 ~ 0.4' },
        { label: '躯干', value: trunkFat.toFixed(1), range: '5.0 ~ 8.0' },
        { label: '左腿', value: (legFat * 0.49).toFixed(1), range: '2.0 ~ 3.5' },
        { label: '右腿', value: (legFat * 0.51).toFixed(1), range: '2.0 ~ 3.5' },
    ];

    // Research Items
    data.research = [
        { label: '去脂体重', value: (weight - body_fat).toFixed(1), range: '' },
        { label: '基础代谢率', value: (10 * weight + 6.25 * (height * 100) - 5 * age + 5).toFixed(0), range: '' },
        { label: '肥胖度', value: '112 %', range: '90 ~ 110' },
        { label: 'SMI', value: ((weight * 0.45) / (height * height)).toFixed(2), range: '' },
    ];

    return data;
}

function populateReport(data) {
    // User Info
    document.getElementById('user-name').textContent = data.user.name;
    document.getElementById('user-height').textContent = `${data.user.height} cm`;
    document.getElementById('user-age').textContent = data.user.age;
    document.getElementById('user-gender').textContent = data.user.gender;

    // Composition Analysis
    const compositionContainer = document.getElementById('composition-analysis');
    compositionContainer.innerHTML = data.composition.map(item => `
        <div class="info-row">
            <span class="label">${item.label}</span>
            <div>
                <span class="value">${item.value}</span>
                <span class="range">(${item.range})</span>
            </div>
        </div>
    `).join('');

    // Muscle-Fat Analysis
    const muscleFatContainer = document.getElementById('muscle-fat-analysis');
    muscleFatContainer.innerHTML = data.muscleFat.map(item => createBarChart(item)).join('');

    // Obesity Analysis
    const obesityContainer = document.getElementById('obesity-analysis');
    obesityContainer.innerHTML = data.obesity.map(item => `
        <div class="info-row">
            <span class="label">${item.label}</span>
            <div>
                <span class="value">${item.value}</span>
                <span class="range">(${item.range})</span>
            </div>
        </div>
    `).join('');

    // InBody Score
    document.getElementById('inbody-score').textContent = data.score;

    // Segmental Fat Analysis
    const segmentalFatContainer = document.getElementById('segmental-fat-analysis');
    segmentalFatContainer.innerHTML = data.segmentalFat.map(item => `
        <div class="info-row">
            <span class="label">${item.label}</span>
            <div>
                <span class="value">${item.value} kg</span>
                <span class="range">(${item.range})</span>
            </div>
        </div>
    `).join('');

    // Research Items
    const researchContainer = document.getElementById('research-items');
    researchContainer.innerHTML = data.research.map(item => `
        <div class="info-row">
            <span class="label">${item.label}</span>
            <div>
                <span class="value">${item.value}</span>
                <span class="range">${item.range}</span>
            </div>
        </div>
    `).join('');
}

function createBarChart(item) {
    const { label, value, min, normalMin, normalMax, max } = item;
    const totalRange = max - min;
    // 确保百分比不会超过100%
    const valuePercentage = Math.min(((value - min) / totalRange) * 100, 100);
    const normalMinPercentage = ((normalMin - min) / totalRange) * 100;
    const normalMaxPercentage = ((normalMax - min) / totalRange) * 100;
    const normalRangeWidth = normalMaxPercentage - normalMinPercentage;

    return `
        <div class="bar-chart-item">
            <div class="bar-chart-label">${label}</div>
            <div class="bar-container">
                <div class="standard-range" style="left: ${normalMinPercentage}%; width: ${normalRangeWidth}%;"></div>
                <div class="bar" style="width: ${valuePercentage}%;"></div>
                <span class="bar-value">${value}</span>
            </div>
        </div>
    `;
}

function setupPrintButton() {
    const printBtn = document.getElementById('print-btn');
    if (!printBtn) return;

    printBtn.addEventListener('click', () => {
        const { jsPDF } = window.jspdf;
        const reportContent = document.getElementById('report-content');
        const originalBackgroundColor = reportContent.style.backgroundColor;
        
        // 为PDF生成准备：隐藏按钮和状态栏，设置白色背景
        printBtn.style.display = 'none';
        const statusBar = document.querySelector('.status-bar');
        if(statusBar) statusBar.style.display = 'none';
        reportContent.style.backgroundColor = 'white';


        html2canvas(reportContent, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff'
        }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'pt',
                format: [canvas.width, canvas.height]
            });
            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save('人体成分分析报告.pdf');
            
            // 恢复原始样式
            printBtn.style.display = 'block';
            if(statusBar) statusBar.style.display = 'flex';
            reportContent.style.backgroundColor = originalBackgroundColor;

        }).catch(err => {
            console.error("PDF生成失败:", err);
            // 确保即使失败也恢复样式
            printBtn.style.display = 'block';
            if(statusBar) statusBar.style.display = 'flex';
            reportContent.style.backgroundColor = originalBackgroundColor;
        });
    });
}
