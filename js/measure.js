// ======================================== 
// 测量流程管理
// ======================================== 

let measurementState = {
    currentStep: 'guide', // guide, measuring, result
    progress: 0,
    results: null,
    timer: null
};

// ======================================== 
// 页面切换
// ======================================== 

function showPage(pageId) {
    // 隐藏所有页面
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    // 显示目标页面
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // 更新控制按钮
    updateControlButtons();
}

function updateControlButtons() {
    // 隐藏所有控制按钮组
    const controlGroups = document.querySelectorAll('#control-area > div');
    controlGroups.forEach(group => group.style.display = 'none');
    
    // 显示对应的控制按钮组
    switch(measurementState.currentStep) {
        case 'guide':
            document.getElementById('guide-controls').style.display = 'flex';
            break;
        case 'measuring':
            document.getElementById('measuring-controls').style.display = 'flex';
            break;
        case 'result':
            document.getElementById('result-controls').style.display = 'flex';
            break;
    }
}

// ======================================== 
// 测量流程
// ======================================== 

function startMeasuring() {
    measurementState.currentStep = 'measuring';
    measurementState.progress = 0;
    
    showPage('page-measuring');
    
    // 开始进度动画
    const progressBar = document.getElementById('progress-circle');
    const progressText = document.getElementById('progress-text');
    
    // 禁用CSS动画，使用JavaScript控制
    progressBar.style.animation = 'none';
    
    // 设置正确的圆周长度 (HTML中半径为120)
    const circumference = 2 * Math.PI * 120;
    progressBar.style.strokeDasharray = circumference;
    progressBar.style.strokeDashoffset = circumference;
    
    measurementState.timer = setInterval(() => {
        measurementState.progress += 1;
        
        // 更新进度显示
        const percentage = Math.round((measurementState.progress / 100) * 100);
        progressText.textContent = percentage + '%';
        
        // 更新进度条
        const offset = circumference - (percentage / 100) * circumference;
        progressBar.style.strokeDashoffset = offset;
        
        // 测量完成
        if (measurementState.progress >= 100) {
            clearInterval(measurementState.timer);
            setTimeout(() => {
                completeMeasurement();
            }, 500);
        }
    }, 30); // 3秒完成测量
}

function completeMeasurement() {
    measurementState.currentStep = 'result';
    
    // 生成模拟测量结果
    generateMeasurementResults();
    
    // 显示结果页面
    showPage('page-result');
    
    // 更新结果显示
    updateResultDisplay();
}

function generateMeasurementResults() {
    // 基于当前用户生成带有小幅随机变化的测量结果
    const currentUser = getCurrentUserData();
    const variation = 0.02; // 2% 的随机变化
    
    // 先生成基础数据
    const results = {
        weight: addVariation(currentUser.weight, variation),
        bmi: addVariation(currentUser.bmi, variation),
        fatPercentage: addVariation(currentUser.fatPercentage, variation),
        muscleWeight: addVariation(currentUser.muscleWeight, variation),
        waterPercentage: addVariation(currentUser.waterPercentage, variation),
        boneWeight: addVariation(currentUser.boneWeight, variation)
    };
    
    // 基于结果计算健康评分
    results.healthScore = calculateHealthScore(results);
    
    // 设置到全局状态
    measurementState.results = results;
}

function addVariation(baseValue, variationPercent) {
    const variation = (Math.random() - 0.5) * 2 * variationPercent;
    return Math.round((baseValue * (1 + variation)) * 10) / 10;
}

function calculateHealthScore(results) {
    // 简单的健康评分算法
    let score = 100;
    
    // BMI 评分
    if (results.bmi < 18.5 || results.bmi > 24.9) score -= 10;
    if (results.bmi < 16 || results.bmi > 30) score -= 20;
    
    // 体脂率评分（假设是成年男性）
    if (results.fatPercentage < 10 || results.fatPercentage > 20) score -= 10;
    if (results.fatPercentage < 5 || results.fatPercentage > 25) score -= 15;
    
    // 水分率评分
    if (results.waterPercentage < 55 || results.waterPercentage > 65) score -= 5;
    
    return Math.max(score, 0);
}

function updateResultDisplay() {
    const results = measurementState.results;
    
    // 更新结果值
    document.getElementById('health-score').textContent = results.healthScore;
    document.getElementById('result-weight').textContent = results.weight + 'kg';
    document.getElementById('result-bmi').textContent = results.bmi;
    document.getElementById('result-fat').textContent = results.fatPercentage + '%';
    document.getElementById('result-muscle').textContent = results.muscleWeight + 'kg';
    document.getElementById('result-water').textContent = results.waterPercentage + '%';
    document.getElementById('result-bone').textContent = results.boneWeight + 'kg';
    
    // 更新健康评分颜色
    const scoreElement = document.getElementById('health-score');
    if (results.healthScore >= 80) {
        scoreElement.style.color = '#4CAF50'; // 绿色
    } else if (results.healthScore >= 60) {
        scoreElement.style.color = '#FF9800'; // 橙色
    } else {
        scoreElement.style.color = '#F44336'; // 红色
    }
}

// ======================================== 
// 控制按钮事件
// ======================================== 

function goBack() {
    if (measurementState.currentStep === 'measuring') {
        // 如果正在测量，先取消测量
        cancelMeasurement();
    } else {
        // 返回主界面
        window.location.href = 'main.html';
    }
}

function goToIndex() {
    window.location.href = 'index.html';
}

function cancelMeasurement() {
    if (measurementState.timer) {
        clearInterval(measurementState.timer);
        measurementState.timer = null;
    }
    
    measurementState.currentStep = 'guide';
    measurementState.progress = 0;
    
    // 重置进度条
    const progressBar = document.getElementById('progress-circle');
    const progressText = document.getElementById('progress-text');
    if (progressBar && progressText) {
        const circumference = 2 * Math.PI * 120;
        progressBar.style.strokeDashoffset = circumference;
        progressText.textContent = '0%';
    }
    
    showPage('page-measure-guide');
}

function saveResult() {
    if (!measurementState.results) return;
    
    // 获取当前用户数据
    const currentUser = getCurrentUserName();
    const userData = getCurrentUserData();
    
    // 创建历史记录
    const now = new Date();
    const historyEntry = {
        date: now.toISOString().split('T')[0],
        time: now.toTimeString().slice(0, 5),
        weight: measurementState.results.weight,
        bmi: measurementState.results.bmi,
        fatPercentage: measurementState.results.fatPercentage,
        muscleWeight: measurementState.results.muscleWeight,
        waterPercentage: measurementState.results.waterPercentage,
        boneWeight: measurementState.results.boneWeight,
        healthScore: measurementState.results.healthScore
    };
    
    // 添加到历史记录（这里应该保存到本地存储或服务器）
    userData.history.unshift(historyEntry);
    
    // 更新用户的最新数据
    userData.weight = measurementState.results.weight;
    userData.bmi = measurementState.results.bmi;
    userData.fatPercentage = measurementState.results.fatPercentage;
    userData.muscleWeight = measurementState.results.muscleWeight;
    userData.waterPercentage = measurementState.results.waterPercentage;
    userData.boneWeight = measurementState.results.boneWeight;
    
    // 显示保存成功提示
    showToast('测量结果已保存');
    
    // 返回主界面
    setTimeout(() => {
        window.location.href = 'main.html';
    }, 1000);
}

function deleteResult() {
    if (confirm('确定要删除这次测量结果吗？')) {
        measurementState.results = null;
        showToast('测量结果已删除');
        
        setTimeout(() => {
            window.location.href = 'main.html';
        }, 1000);
    }
}

function showDetail(type) {
    // 这里可以跳转到详细结果页面
    const params = new URLSearchParams({
        type: type,
        value: measurementState.results[type] || 0
    });
    
    window.location.href = `detail.html?${params.toString()}`;
}

// ======================================== 
// 工具函数
// ======================================== 

function getCurrentUserName() {
    // 从 URL 参数或本地存储获取当前用户
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('user') || '华仔';
}

function getCurrentUserData() {
    // 这里应该从全局状态或API获取用户数据
    // 临时使用模拟数据
    const users = {
        '华仔': {
            weight: 65.2,
            bmi: 22.1,
            fatPercentage: 15.8,
            muscleWeight: 48.2,
            waterPercentage: 58.5,
            boneWeight: 2.8,
            history: []
        },
        '小美': {
            weight: 52.3,
            bmi: 19.8,
            fatPercentage: 22.5,
            muscleWeight: 38.1,
            waterPercentage: 55.2,
            boneWeight: 2.1,
            history: []
        },
        '老爸': {
            weight: 78.5,
            bmi: 25.2,
            fatPercentage: 18.9,
            muscleWeight: 58.7,
            waterPercentage: 56.8,
            boneWeight: 3.2,
            history: []
        },
        '老妈': {
            weight: 58.7,
            bmi: 22.8,
            fatPercentage: 25.3,
            muscleWeight: 40.5,
            waterPercentage: 53.9,
            boneWeight: 2.3,
            history: []
        }
    };
    
    return users[getCurrentUserName()] || users['华仔'];
}

function showToast(message) {
    // 创建临时提示元素
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
        document.body.removeChild(toast);
    }, 2000);
}

// ======================================== 
// 初始化
// ======================================== 

function initializeMeasure() {
    // 设置初始状态
    measurementState.currentStep = 'guide';
    
    // 显示引导页面
    showPage('page-measure-guide');
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initializeMeasure);
