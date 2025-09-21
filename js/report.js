// DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 从localStorage获取当前的测量数据
    const measurementData = localStorage.getItem('currentMeasurement');
    let reportData;

    // 如果存在测量数据，则基于它生成报告；否则，使用示例数据
    if (measurementData) {
        const parsedData = JSON.parse(measurementData);
        reportData = generateProfessionalReportData(parsedData);
    } else {
        // 为演示目的，提供一个默认结构
        reportData = generateProfessionalReportData({ user: '示例用户', weight: 75.5 });
    }

    // 使用生成的数据填充报告页面
    populateReport(reportData);
    // 初始化时间显示，并设置每分钟更新一次
    updateTime();
    setInterval(updateTime, 60000);
});

// 更新状态栏时间
function updateTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}`;
    const timeElement = document.getElementById('current-time');
    if (timeElement) timeElement.textContent = timeString;
}

// “再次测量”按钮的点击事件处理
function measureAgain() {
    window.location.href = 'measure-guide.html';
}

// 生成专业的报告数据
function generateProfessionalReportData(measurement) {
    const data = {};
    const weight = parseFloat(measurement.weight);
    const height = 1.88;
    const age = 30;
    const gender = '男';

    // 用户基本信息
    data.user = { name: measurement.user, height: height * 100, age, gender };

    // 综合评分
    data.score = Math.floor(Math.random() * 15 + 75);

    // 人体成分分析
    const body_water = weight * 0.58;
    const protein = weight * 0.16;
    const minerals = weight * 0.04;
    const body_fat = weight * 0.22;
    data.composition = [
        { label: '身体总水分', value: body_water.toFixed(1) + ' kg' },
        { label: '蛋白质', value: protein.toFixed(1) + ' kg' },
        { label: '无机盐', value: minerals.toFixed(1) + ' kg' },
        { label: '体脂肪', value: body_fat.toFixed(1) + ' kg' },
    ];

    // 肌肉-脂肪分析
    data.muscleFat = [
        { label: '体重', value: weight, range: [55, 75] },
        { label: '骨骼肌', value: weight * 0.45, range: [25, 35] },
        { label: '体脂肪', value: body_fat, range: [10, 18] },
    ];

    // 肥胖分析
    data.obesity = [
        { label: 'BMI', value: (weight / (height * height)).toFixed(1), unit: '' },
        { label: '体脂率', value: (body_fat / weight * 100).toFixed(1), unit: '%' },
    ];

    // 与上次测量对比
    data.comparison = [
        { label: '体重', value: weight.toFixed(1) + ' kg', change: (Math.random() * 2 - 1).toFixed(1) },
        { label: '骨骼肌', value: (weight * 0.45).toFixed(1) + ' kg', change: (Math.random() * 1 - 0.5).toFixed(1) },
        { label: '体脂率', value: (body_fat / weight * 100).toFixed(1) + ' %', change: (Math.random() * 1 - 0.5).toFixed(1) },
        { label: '综合评分', value: data.score, change: Math.floor(Math.random() * 5 - 2) },
    ];

    // 综合评价
    data.evaluation = "您的身体状况良好，各项指标均在标准范围内。建议继续保持目前的饮食和运动习惯。";

    return data;
}

// 将报告数据填充到HTML中
function populateReport(data) {
    // 填充用户基本信息
    document.getElementById('user-name').textContent = data.user.name;
    document.getElementById('user-height').textContent = `${data.user.height} cm`;
    document.getElementById('user-age').textContent = data.user.age;
    document.getElementById('user-gender').textContent = data.user.gender;
    document.getElementById('inbody-score').textContent = data.score;

    // 填充人体成分分析
    const compositionContainer = document.getElementById('composition-analysis');
    compositionContainer.innerHTML = data.composition.map(item => `
        <div class="composition-item">
            <div class="value">${item.value}</div>
            <div class="label">${item.label}</div>
        </div>
    `).join('');

    // 填充肌肉-脂肪分析
    const muscleFatContainer = document.getElementById('muscle-fat-analysis');
    muscleFatContainer.innerHTML = data.muscleFat.map(item => createStatusBar(item)).join('');

    // 填充肥胖分析
    const obesityContainer = document.getElementById('obesity-analysis');
    obesityContainer.innerHTML = data.obesity.map(item => `
        <div class="obesity-item">
            <div class="value">${item.value} <span class="text-base">${item.unit}</span></div>
            <div class="label">${item.label}</div>
        </div>
    `).join('');

    // 填充与上次测量对比
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

    // 填充综合评价
    document.getElementById('evaluation-text').textContent = data.evaluation;
}

// 创建状态条
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

// 创建表示数据变化的指示器（上升/下降箭头）
function createChangeIndicator(change) {
    const value = parseFloat(change);
    if (value > 0) {
        return `<span class="change-arrow up">▲</span> <span>${Math.abs(value)}</span>`;
    } else if (value < 0) {
        return `<span class="change-arrow down">▼</span> <span>${Math.abs(value)}</span>`;
    }
    return `<span>-</span>`;
}
