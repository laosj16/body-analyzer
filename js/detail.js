// ======================================== 
// 详细结果页面逻辑
// ======================================== 

let detailState = {
    currentMetric: 'weight',
    currentValue: 65.2,
    currentUser: '华仔',
    historyChart: null,
    metricsInfo: {
        weight: {
            label: '体重',
            unit: 'kg',
            range: [60, 80],
            interpretation: '您的体重处于理想范围。请继续保持健康的饮食和规律的运动，以维持当前状态。'
        },
        fat: {
            label: '体脂率',
            unit: '%',
            range: [15, 25],
            interpretation: '体脂率是衡量肥胖的重要指标。您当前的体脂率在健康范围内，这有助于降低心血管疾病风险。'
        },
        muscle: {
            label: '肌肉量',
            unit: 'kg',
            range: [45, 60],
            interpretation: '肌肉是身体的"引擎"。较高的肌肉量能提升基础代谢，帮助消耗更多热量。您的肌肉量非常不错！'
        },
        bmi: {
            label: 'BMI指数',
            unit: '',
            range: [18.5, 24.9],
            interpretation: 'BMI是国际通用的衡量人体胖瘦程度的标准。您的BMI指数正常，身材匀称。'
        },
        water: {
            label: '水分率',
            unit: '%',
            range: [55, 65],
            interpretation: '适当的水分含量对维持身体正常功能至关重要。您的水分率处于健康水平。'
        },
        bone: {
            label: '骨量',
            unit: 'kg',
            range: [2.5, 3.5],
            interpretation: '骨量反映骨骼的健康状况。适当的运动和钙质摄入有助于维持骨骼健康。'
        }
    },
    historyData: {
        '华仔': {
            weight: [74.8, 75.1, 75.4, 75.3, 75.5],
            fat: [15.5, 15.9, 16.1, 16.0, 16.2],
            muscle: [48.5, 48.1, 47.9, 48.0, 48.6],
            bmi: [22.0, 22.1, 22.2, 22.2, 22.3],
            water: [58.7, 58.4, 58.2, 58.3, 58.8],
            bone: [2.9, 2.8, 2.8, 2.8, 2.9]
        },
        '小美': {
            weight: [52.5, 52.1, 52.3],
            fat: [22.7, 22.3, 22.5],
            muscle: [37.9, 38.2, 38.1],
            bmi: [19.9, 19.7, 19.8],
            water: [55.0, 55.3, 55.2],
            bone: [2.1, 2.1, 2.1]
        },
        '老爸': {
            weight: [79.2, 78.8, 78.5],
            fat: [19.5, 19.1, 18.9],
            muscle: [58.2, 58.5, 58.7],
            bmi: [25.4, 25.3, 25.2],
            water: [56.5, 56.7, 56.8],
            bone: [3.2, 3.2, 3.2]
        },
        '老妈': {
            weight: [59.1, 58.7],
            fat: [25.5, 25.3],
            muscle: [40.3, 40.5],
            bmi: [23.0, 22.8],
            water: [53.7, 53.9],
            bone: [2.3, 2.3]
        }
    }
};

// ======================================== 
// 页面初始化
// ======================================== 

function initializeDetail() {
    // 从URL参数获取详情信息
    const urlParams = new URLSearchParams(window.location.search);
    const metric = urlParams.get('type') || 'weight';
    const value = parseFloat(urlParams.get('value')) || 65.2;
    const user = urlParams.get('user') || '华仔';
    
    detailState.currentMetric = metric;
    detailState.currentValue = value;
    detailState.currentUser = user;
    
    // 更新页面显示
    updateDetailDisplay();
    updateRangeIndicator();
    renderHistoryChart();
}

// ======================================== 
// 显示更新
// ======================================== 

function updateDetailDisplay() {
    const metricInfo = detailState.metricsInfo[detailState.currentMetric];
    if (!metricInfo) return;
    
    // 更新标题
    document.getElementById('detail-title').textContent = metricInfo.label;
    
    // 更新数值显示
    document.getElementById('detail-value').textContent = detailState.currentValue.toFixed(1);
    document.getElementById('detail-unit').textContent = metricInfo.unit;
    
    // 更新健康解读
    document.getElementById('detail-interpretation').textContent = metricInfo.interpretation;
}

function updateRangeIndicator() {
    const metricInfo = detailState.metricsInfo[detailState.currentMetric];
    if (!metricInfo) return;
    
    const [min, max] = metricInfo.range;
    const value = detailState.currentValue;
    
    // 计算指示器位置 (0-100%)
    let percentage = 0;
    if (value <= min) {
        percentage = 25; // 偏低区域中间
    } else if (value >= max) {
        percentage = 75; // 偏高区域中间
    } else {
        // 正常范围内，映射到中间区域 (33%-67%)
        const normalizedValue = (value - min) / (max - min);
        percentage = 33 + normalizedValue * 34;
    }
    
    // 更新指示器位置
    const indicator = document.getElementById('range-indicator');
    indicator.style.left = `${percentage}%`;
    
    // 更新范围标签
    const labels = document.getElementById('range-labels');
    labels.innerHTML = `
        <span>${min}${metricInfo.unit}</span>
        <span>正常</span>
        <span>${max}${metricInfo.unit}</span>
    `;
    
    // 根据当前值设置指示器颜色
    const arrow = indicator.querySelector('.indicator-arrow');
    if (value < min || value > max) {
        arrow.style.borderTopColor = '#FFA726'; // 橙色 - 异常
    } else {
        arrow.style.borderTopColor = '#4CAF50'; // 绿色 - 正常
    }
}

function renderHistoryChart() {
    const canvas = document.getElementById('history-chart');
    const ctx = canvas.getContext('2d');
    
    // 销毁现有图表
    if (detailState.historyChart) {
        detailState.historyChart.destroy();
    }
    
    // 获取历史数据
    const userData = detailState.historyData[detailState.currentUser];
    const metricData = userData?.[detailState.currentMetric] || [];
    
    // 生成标签（最近N次测量）
    const labels = metricData.map((_, index) => `第${index + 1}次`);
    
    // 获取度量信息
    const metricInfo = detailState.metricsInfo[detailState.currentMetric];
    
    // 创建图表
    detailState.historyChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: metricInfo.label,
                data: metricData,
                borderColor: '#0D47A1',
                backgroundColor: 'rgba(13, 71, 161, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#FFFFFF',
                pointBorderColor: '#0D47A1',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#FFFFFF',
                    bodyColor: '#FFFFFF',
                    borderColor: '#0D47A1',
                    borderWidth: 1,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return `${context.parsed.y}${metricInfo.unit}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#BDBDBD',
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        color: 'rgba(189, 189, 189, 0.1)'
                    }
                },
                y: {
                    ticks: {
                        color: '#BDBDBD',
                        font: {
                            size: 12
                        },
                        callback: function(value) {
                            return value + metricInfo.unit;
                        }
                    },
                    grid: {
                        color: 'rgba(189, 189, 189, 0.1)'
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

// ======================================== 
// 控制功能
// ======================================== 

function goBack() {
    // 返回到测量结果页面或主界面
    const referrer = document.referrer;
    if (referrer && referrer.includes('measure.html')) {
        window.location.href = 'measure.html';
    } else {
        window.location.href = 'main.html';
    }
}

function goToIndex() {
    window.location.href = 'index.html';
}

function saveToHistory() {
    // 保存当前结果到历史记录
    const timestamp = new Date();
    const date = timestamp.toISOString().split('T')[0];
    const time = timestamp.toTimeString().slice(0, 5);
    
    const record = {
        date: date,
        time: time,
        metric: detailState.currentMetric,
        value: detailState.currentValue,
        user: detailState.currentUser
    };
    
    // 这里应该保存到实际的存储系统
    console.log('Saving record:', record);
    
    showToast('记录已保存到历史数据');
}

function shareResult() {
    // 分享结果功能
    const metricInfo = detailState.metricsInfo[detailState.currentMetric];
    const shareText = `我的${metricInfo.label}测量结果: ${detailState.currentValue}${metricInfo.unit}`;
    
    // 模拟分享功能
    if (navigator.share) {
        navigator.share({
            title: '体成分测量结果',
            text: shareText
        }).catch(console.error);
    } else {
        // 复制到剪贴板作为备选方案
        navigator.clipboard.writeText(shareText).then(() => {
            showToast('结果已复制到剪贴板');
        }).catch(() => {
            showToast('分享功能暂不可用');
        });
    }
}

// ======================================== 
// 工具函数
// ======================================== 

function showToast(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 16px;
        z-index: 1000;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        if (document.body.contains(toast)) {
            document.body.removeChild(toast);
        }
    }, 2000);
}

// ======================================== 
// 页面加载初始化
// ======================================== 

document.addEventListener('DOMContentLoaded', initializeDetail);
