// ======================================== 
// 历史数据页面逻辑
// ======================================== 

// 历史数据状态
let historyState = {
    currentUser: '华仔',
    users: {
        '华仔': [
            { date: '2025-07-21', time: '14:30', weight: 75.5, fat: 16.2, muscle: 48.6, bmi: 22.3, healthScore: 86 },
            { date: '2025-07-19', time: '08:45', weight: 75.3, fat: 16.0, muscle: 48.0, bmi: 22.2, healthScore: 85 },
            { date: '2025-07-17', time: '14:15', weight: 74.8, fat: 15.5, muscle: 48.5, bmi: 22.0, healthScore: 87 },
            { date: '2025-07-15', time: '09:20', weight: 75.1, fat: 15.9, muscle: 48.1, bmi: 22.1, healthScore: 85 },
            { date: '2025-07-13', time: '16:35', weight: 75.4, fat: 16.1, muscle: 47.9, bmi: 22.2, healthScore: 84 }
        ],
        '小美': [
            { date: '2024-01-15', time: '14:32', weight: 52.3, fat: 22.5, muscle: 38.1, bmi: 19.8, healthScore: 88 },
            { date: '2024-01-14', time: '08:50', weight: 52.1, fat: 22.3, muscle: 38.2, bmi: 19.7, healthScore: 89 },
            { date: '2024-01-12', time: '15:20', weight: 52.5, fat: 22.7, muscle: 37.9, bmi: 19.9, healthScore: 87 }
        ],
        '老爸': [
            { date: '2024-01-15', time: '14:35', weight: 78.5, fat: 18.9, muscle: 58.7, bmi: 25.2, healthScore: 79 },
            { date: '2024-01-13', time: '19:20', weight: 78.8, fat: 19.1, muscle: 58.5, bmi: 25.3, healthScore: 78 },
            { date: '2024-01-10', time: '07:45', weight: 79.2, fat: 19.5, muscle: 58.2, bmi: 25.4, healthScore: 77 }
        ],
        '老妈': [
            { date: '2024-01-14', time: '08:48', weight: 58.7, fat: 25.3, muscle: 40.5, bmi: 22.8, healthScore: 82 },
            { date: '2024-01-12', time: '14:22', weight: 59.1, fat: 25.5, muscle: 40.3, bmi: 23.0, healthScore: 81 }
        ]
    }
};

// ======================================== 
// 用户切换
// ======================================== 

function selectUser(userName) {
    historyState.currentUser = userName;
    
    // 更新用户头像状态
    const avatars = document.querySelectorAll('.user-avatar');
    avatars.forEach(avatar => {
        avatar.classList.remove('active');
        if (avatar.dataset.user === userName) {
            avatar.classList.add('active');
        }
    });
    
    // 更新历史记录显示
    updateHistoryDisplay();
}

// ======================================== 
// 历史记录显示
// ======================================== 

function updateHistoryDisplay() {
    const historyList = document.getElementById('history-list');
    const noHistoryDiv = document.getElementById('no-history');
    const userHistory = historyState.users[historyState.currentUser] || [];
    
    // 清空现有内容
    historyList.innerHTML = '';
    
    if (userHistory.length === 0) {
        // 显示无数据提示
        historyList.style.display = 'none';
        noHistoryDiv.style.display = 'flex';
    } else {
        // 显示历史记录
        historyList.style.display = 'block';
        noHistoryDiv.style.display = 'none';
        
        // 按日期倒序排列
        const sortedHistory = [...userHistory].sort((a, b) => {
            const dateA = new Date(a.date + 'T' + a.time);
            const dateB = new Date(b.date + 'T' + b.time);
            return dateB - dateA;
        });
        
        sortedHistory.forEach(record => {
            const historyItem = createHistoryItem(record);
            historyList.appendChild(historyItem);
        });
    }
}

function createHistoryItem(record) {
    const item = document.createElement('div');
    item.className = 'history-item';
    item.onclick = () => showHistoryDetail(record);
    
    // 格式化日期
    const date = new Date(record.date);
    const formattedDate = `${date.getMonth() + 1}月${date.getDate()}日`;
    
    item.innerHTML = `
        <div>
            <div class="history-date">${formattedDate}</div>
            <div class="history-time">${record.time}</div>
        </div>
        <div>
            <div class="history-value">
                ${record.weight}
                <span class="history-unit">kg</span>
            </div>
            <div class="history-value" style="font-size: 16px; color: #BDBDBD;">
                体脂 ${record.fat}%
            </div>
        </div>
    `;
    
    return item;
}

function showHistoryDetail(record) {
    // 这里可以跳转到详细页面或显示详细信息
    const detailInfo = `
测量时间: ${record.date} ${record.time}
体重: ${record.weight}kg
体脂率: ${record.fat}%
肌肉量: ${record.muscle}kg
BMI: ${record.bmi}
健康评分: ${record.healthScore}
    `.trim();
    
    alert(detailInfo);
}

// ======================================== 
// 控制功能
// ======================================== 

function clearHistory() {
    if (confirm(`确定要清空 ${historyState.currentUser} 的所有历史记录吗？此操作不可撤销。`)) {
        historyState.users[historyState.currentUser] = [];
        updateHistoryDisplay();
        showToast('历史记录已清空');
    }
}

function goBack() {
    window.location.href = 'main.html';
}

function goToIndex() {
    window.location.href = 'index.html';
}

function navigateToPage(page) {
    switch(page) {
        case 'home':
            window.location.href = 'main.html';
            break;
        case 'settings':
            window.location.href = 'settings.html';
            break;
        case 'measure':
            window.location.href = 'measure.html';
            break;
    }
}

// ======================================== 
// 手势操作和自动关机支持
// ======================================== 

let inactivityTimer = null;
const INACTIVITY_TIMEOUT = 0; // 禁用自动关机

function resetInactivityTimer() {
    // 禁用自动关机功能
    if (inactivityTimer) {
        clearTimeout(inactivityTimer);
    }
    
    // 不再设置自动关机计时器
    // if (INACTIVITY_TIMEOUT > 0) {
    //     inactivityTimer = setTimeout(() => {
    //         window.location.href = 'shutdown.html';
    //     }, INACTIVITY_TIMEOUT);
    // }
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
        document.body.removeChild(toast);
    }, 2000);
}

// ======================================== 
// 初始化
// ======================================== 

function initializeHistory() {
    // 设置用户头像点击事件
    const userAvatars = document.querySelectorAll('.user-avatar');
    userAvatars.forEach(avatar => {
        avatar.addEventListener('click', () => {
            const userName = avatar.dataset.user;
            selectUser(userName);
        });
    });
    
    // 初始化显示
    updateHistoryDisplay();
    
    // 启动自动关机计时器
    resetInactivityTimer();
    
    // 添加用户活动监听（手势操作支持）
    ['click', 'touchstart', 'mousedown', 'mousemove', 'keydown'].forEach(eventType => {
        document.addEventListener(eventType, resetInactivityTimer);
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initializeHistory);
