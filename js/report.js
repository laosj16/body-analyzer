// 详细报告页面脚本 - 乐福智能身体成分分析仪
document.addEventListener('DOMContentLoaded', function() {
    // 初始化报告数据
    initReportData();
    
    // 绘制图表
    drawBodyCompositionChart();
    drawHistoryChart();
});

// 初始化报告数据
function initReportData() {
    // 从URL参数获取用户信息
    const urlParams = new URLSearchParams(window.location.search);
    const userName = urlParams.get('user') || '张三';
    const weight = urlParams.get('weight') || '68.5';
    
    // 更新用户信息
    if (document.getElementById('userName')) {
        document.getElementById('userName').textContent = userName;
    }
    
    // 模拟根据体重计算其他数据
    const weightNum = parseFloat(weight);
    updateCalculatedData(weightNum);
    
    // 设置测量时间为当前时间
    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    if (document.getElementById('measureTime')) {
        document.getElementById('measureTime').textContent = timeStr;
    }
}

// 根据体重计算其他身体数据
function updateCalculatedData(weight) {
    // 模拟计算BMI等数据
    const height = 175; // 假设身高175cm
    const bmi = (weight / ((height / 100) ** 2)).toFixed(1);
    const bodyFatRate = (15 + Math.random() * 5).toFixed(1);
    const muscleRate = (40 + Math.random() * 8).toFixed(1);
    const waterRate = (55 + Math.random() * 8).toFixed(1);
    
    // 更新显示
    updateResultCards({
        weight: weight,
        bmi: bmi,
        bodyFatRate: bodyFatRate,
        muscleRate: muscleRate,
        waterRate: waterRate
    });
}

// 更新结果卡片显示
function updateResultCards(data) {
    const cards = document.querySelectorAll('.result-card');
    cards.forEach((card, index) => {
        const valueElement = card.querySelector('.result-value');
        const statusElement = card.querySelector('.result-status');
        
        switch(index) {
            case 0: // 体重
                valueElement.textContent = `${data.weight} kg`;
                break;
            case 1: // BMI
                valueElement.textContent = data.bmi;
                statusElement.textContent = getBMIStatus(data.bmi);
                statusElement.className = `result-status ${getBMIStatusClass(data.bmi)}`;
                break;
            case 2: // 体水分
                valueElement.textContent = `${data.waterRate}%`;
                break;
            case 3: // 肌肉量
                valueElement.textContent = `${(data.weight * data.muscleRate / 100).toFixed(1)} kg`;
                break;
            case 4: // 脂肪率
                valueElement.textContent = `${data.bodyFatRate}%`;
                break;
            case 5: // 骨骼肌率
                valueElement.textContent = `${(parseFloat(data.muscleRate) + 2).toFixed(1)}%`;
                break;
        }
    });
}

// 获取BMI状态
function getBMIStatus(bmi) {
    const bmiNum = parseFloat(bmi);
    if (bmiNum < 18.5) return '偏瘦';
    if (bmiNum < 24) return '正常';
    if (bmiNum < 28) return '超重';
    return '肥胖';
}

// 获取BMI状态样式类
function getBMIStatusClass(bmi) {
    const bmiNum = parseFloat(bmi);
    if (bmiNum < 18.5) return 'low';
    if (bmiNum < 24) return 'normal';
    if (bmiNum < 28) return 'warning';
    return 'high';
}

// 绘制身体成分分析图表
function drawBodyCompositionChart() {
    const canvas = document.getElementById('bodyCompositionChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 100;
    
    // 身体成分数据
    const data = [
        { label: '肌肉', value: 52.4, color: '#3b82f6' },
        { label: '脂肪', value: 10.8, color: '#f59e0b' },
        { label: '骨骼', value: 3.2, color: '#6b7280' },
        { label: '其他', value: 2.1, color: '#10b981' }
    ];
    
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = -Math.PI / 2; // 从顶部开始
    
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 绘制饼图
    data.forEach((item, index) => {
        const sliceAngle = (item.value / total) * 2 * Math.PI;
        
        // 绘制扇形
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
        ctx.closePath();
        ctx.fillStyle = item.color;
        ctx.fill();
        
        // 绘制边框
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // 绘制标签
        const labelAngle = currentAngle + sliceAngle / 2;
        const labelX = centerX + Math.cos(labelAngle) * (radius + 30);
        const labelY = centerY + Math.sin(labelAngle) * (radius + 30);
        
        ctx.fillStyle = '#374151';
        ctx.font = '14px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(item.label, labelX, labelY);
        ctx.fillText(`${item.value}kg`, labelX, labelY + 16);
        
        currentAngle += sliceAngle;
    });
    
    // 绘制中心文字
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 16px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('身体成分', centerX, centerY - 5);
    ctx.font = '14px Inter';
    ctx.fillText(`总重量 ${total.toFixed(1)}kg`, centerX, centerY + 15);
}

// 绘制历史趋势图表
function drawHistoryChart() {
    const canvas = document.getElementById('historyChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    
    // 模拟历史数据 (最近7次测量)
    const historyData = [
        { date: '03-01', weight: 69.2, muscle: 51.8, fat: 17.1 },
        { date: '03-03', weight: 68.8, muscle: 52.0, fat: 16.8 },
        { date: '03-05', weight: 68.5, muscle: 52.1, fat: 16.5 },
        { date: '03-08', weight: 68.3, muscle: 52.2, fat: 16.2 },
        { date: '03-10', weight: 68.0, muscle: 52.3, fat: 15.9 },
        { date: '03-12', weight: 68.2, muscle: 52.4, fat: 15.8 },
        { date: '03-15', weight: 68.5, muscle: 52.4, fat: 15.8 }
    ];
    
    // 清空画布
    ctx.clearRect(0, 0, width, height);
    
    // 绘制网格线
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    
    // 垂直网格线
    for (let i = 0; i <= 6; i++) {
        const x = padding + (width - 2 * padding) * i / 6;
        ctx.beginPath();
        ctx.moveTo(x, padding);
        ctx.lineTo(x, height - padding);
        ctx.stroke();
    }
    
    // 水平网格线
    for (let i = 0; i <= 4; i++) {
        const y = padding + (height - 2 * padding) * i / 4;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
    }
    
    // 绘制体重曲线
    drawLine(ctx, historyData, 'weight', '#3b82f6', width, height, padding);
    
    // 绘制图例
    ctx.fillStyle = '#374151';
    ctx.font = '12px Inter';
    ctx.fillText('体重变化趋势 (kg)', padding, 25);
    
    // 绘制日期标签
    historyData.forEach((data, index) => {
        const x = padding + (width - 2 * padding) * index / (historyData.length - 1);
        ctx.fillStyle = '#6b7280';
        ctx.font = '10px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(data.date, x, height - 10);
    });
}

// 绘制线条
function drawLine(ctx, data, field, color, width, height, padding) {
    const values = data.map(d => d[field]);
    const minValue = Math.min(...values) - 1;
    const maxValue = Math.max(...values) + 1;
    
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    data.forEach((point, index) => {
        const x = padding + (width - 2 * padding) * index / (data.length - 1);
        const y = height - padding - ((point[field] - minValue) / (maxValue - minValue)) * (height - 2 * padding);
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
        
        // 绘制数据点
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
    });
    
    ctx.stroke();
}

// 打印报告功能
function printReport() {
    // 显示打印提示
    showNotification('正在准备打印报告...', 'info');
    
    // 模拟打印准备时间
    setTimeout(() => {
        // 隐藏不需要打印的元素
        const elementsToHide = document.querySelectorAll('.page-header, .page-footer');
        elementsToHide.forEach(el => el.style.display = 'none');
        
        // 调用浏览器打印功能
        window.print();
        
        // 恢复隐藏的元素
        setTimeout(() => {
            elementsToHide.forEach(el => el.style.display = '');
            showNotification('报告已发送至打印机', 'success');
        }, 1000);
        
    }, 1500);
}

// 保存PDF功能
function saveReport() {
    showNotification('PDF报告已保存到本地', 'success');
    
    // 模拟PDF生成和下载
    setTimeout(() => {
        // 这里可以集成PDF生成库，如jsPDF
        console.log('PDF报告生成完成');
    }, 1000);
}

// 显示通知消息
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // 添加样式
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 9999;
        animation: slideIn 0.3s ease-out;
    `;
    
    // 根据类型设置颜色
    switch(type) {
        case 'success':
            notification.style.backgroundColor = '#10b981';
            break;
        case 'error':
            notification.style.backgroundColor = '#ef4444';
            break;
        case 'warning':
            notification.style.backgroundColor = '#f59e0b';
            break;
        default:
            notification.style.backgroundColor = '#3b82f6';
    }
    
    document.body.appendChild(notification);
    
    // 3秒后自动移除
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// 添加动画样式
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
