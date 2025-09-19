// ======================================== 
// 应用状态管理
// ======================================== 

// 全局状态
const appState = {
    currentUser: '华仔',
    currentPage: 'home',
    isShuttingDown: false,
    shutdownTimer: null,
    inactivityTimer: null,
    users: {
        '华仔': {
            avatar: '华',
            color: '#2563EB',
            weight: 75.5,
            bmi: 22.3,
            fatPercentage: 16.2,
            muscleWeight: 48.6,
            waterPercentage: 58.8,
            boneWeight: 2.9,
            history: [
                { date: '2025-09-19', time: '14:30', weight: 75.5, fat: 16.2, muscle: 48.6, bmi: 22.3, water: 58.8, bone: 2.9 },
                { date: '2025-09-17', time: '08:45', weight: 75.3, fat: 16.0, muscle: 48.0, bmi: 22.2, water: 58.3, bone: 2.8 },
                { date: '2025-09-15', time: '14:15', weight: 74.8, fat: 15.5, muscle: 48.5, bmi: 22.0, water: 58.7, bone: 2.9 }
            ]
        },
        '亦菲': {
            avatar: '亦',
            color: '#DB2777',
            weight: 50.0,
            bmi: 19.8,
            fatPercentage: 22.5,
            muscleWeight: 36.1,
            waterPercentage: 55.2,
            boneWeight: 2.1,
            history: [
                { date: '2025-09-19', time: '14:32', weight: 50.0, fat: 22.5, muscle: 36.1, bmi: 19.8, water: 55.2, bone: 2.1 },
                { date: '2025-09-16', time: '08:50', weight: 49.8, fat: 22.3, muscle: 36.2, bmi: 19.7, water: 55.4, bone: 2.1 }
            ]
        },
        '志玲': {
            avatar: '志',
            color: '#059669',
            weight: 45.0,
            bmi: 18.5,
            fatPercentage: 20.8,
            muscleWeight: 32.4,
            waterPercentage: 56.8,
            boneWeight: 1.9,
            history: [
                { date: '2025-09-18', time: '09:15', weight: 45.0, fat: 20.8, muscle: 32.4, bmi: 18.5, water: 56.8, bone: 1.9 },
                { date: '2025-09-15', time: '19:20', weight: 45.2, fat: 21.0, muscle: 32.2, bmi: 18.6, water: 56.6, bone: 1.9 }
            ]
        },
        '访客': {
            avatar: 'G',
            color: '#616161',
            weight: 65.0, // 设置一个默认体重
            bmi: 0,
            fatPercentage: 0,
            muscleWeight: 0,
            waterPercentage: 0,
            boneWeight: 0,
            history: []
        }
    },
    settings: {
        unit: 'kg',
        autoShutdown: 0, // 禁用自动关机
        brightness: 80,
        sound: true,
        height: 175
    }
};

const INACTIVITY_TIMEOUT = 0; // 禁用自动关机

// ======================================== 
// 用户管理
// ======================================== 

function selectUser(userName) {
    appState.currentUser = userName;
    updateUserInterface();
    
    // 更新用户头像状态
    const avatars = document.querySelectorAll('.user-avatar');
    avatars.forEach(avatar => {
        avatar.classList.remove('active');
        if (avatar.dataset.user === userName) {
            avatar.classList.add('active');
        }
    });
    
    // 重置自动关机计时器
    resetShutdownTimer();
}

function updateUserInterface() {
    const userData = appState.users[appState.currentUser];
    if (!userData) return;
    
    // 更新主界面数据
    const elements = {
        'main-weight': userData.weight,
        'bmi-value': userData.bmi,
        'fat-percentage': userData.fatPercentage + '%',
        'muscle-mass': userData.muscleWeight + 'kg',
        'water-percentage': userData.waterPercentage + '%',
        'bone-mass': userData.boneWeight + 'kg',
        'bmr-value': calculateBMR(userData) + 'kcal'
    };
    
    Object.entries(elements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    });
    
    // 更新测量日期（如果有历史记录）
    const dateElement = document.getElementById('main-date');
    if (dateElement && userData.history && userData.history.length > 0) {
        const lastRecord = userData.history[userData.history.length - 1];
        dateElement.textContent = `${lastRecord.date} ${lastRecord.time}`;
    }
}

// 计算基础代谢率
function calculateBMR(userData) {
    // 简化的BMR计算（实际应该基于性别、年龄、身高）
    return Math.round(userData.weight * 22 + 500);
}

// 查看详细数据
function viewMoreData() {
    window.location.href = 'detail.html';
}

// 模拟称重功能
function simulateWeighIn(weight, userName) {
    // 存储用户信息到 localStorage，供测量页面使用
    const measurementData = {
        user: userName,
        weight: weight,
        timestamp: new Date().toISOString(),
        isGuest: userName === '访客'
    };
    localStorage.setItem('currentMeasurement', JSON.stringify(measurementData));
    
    // 直接跳转到测量引导页面
    window.location.href = 'measure-guide.html';
}

// ======================================== 
// 页面导航
// ======================================== 

function navigateToPage(pageName) {
    appState.currentPage = pageName;
    
    // 更新导航状态
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
        const navType = item.dataset.nav;
        if ((navType === pageName) || 
            (navType === 'start-measurement' && pageName === 'measure') ||
            (navType === 'home' && pageName === 'home')) {
            item.classList.add('active');
        }
    });
    
    // 根据页面类型跳转
    switch(pageName) {
        case 'home':
            // 已经在主页
            break;
        case 'add-user':
            // 显示添加用户页面
            showPage('page-add-user');
            break;
        case 'history':
            showDevelopmentNotice('历史数据功能');
            break;
        case 'settings':
            showDevelopmentNotice('设置功能');
            break;
        case 'measure':
        case 'start-measurement':
            startMeasurement();
            break;
    }
    
    resetShutdownTimer();
}

function showPage(pageId) {
    // 隐藏所有页面
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    // 显示目标页面
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
}

function startMeasurement() {
    // 获取当前选中的用户
    const currentUser = appState.currentUser;
    
    // 根据当前用户创建测量数据
    const measurementData = {
        user: currentUser,
        weight: appState.users[currentUser] ? appState.users[currentUser].weight : (Math.random() * 40 + 45).toFixed(1),
        timestamp: new Date().toISOString(),
        isGuest: currentUser === '访客'
    };
    
    localStorage.setItem('currentMeasurement', JSON.stringify(measurementData));
    window.location.href = 'measure-guide.html';
}

function goBack() {
    // 检查当前是否在添加用户页面
    const addUserPage = document.getElementById('page-add-user');
    if (addUserPage && addUserPage.classList.contains('active')) {
        showPage('page-home');
        return;
    }
    
    window.location.href = 'index.html';
}

function goToIndex() {
    window.location.href = 'index.html';
}

// ======================================== 
// 时间更新
// ======================================== 

function updateTime() {
    const now = new Date();
    const timeString = now.getHours().toString().padStart(2, '0') + ':' + 
                      now.getMinutes().toString().padStart(2, '0');
    
    const timeElement = document.getElementById('current-time');
    if (timeElement) {
        timeElement.textContent = timeString;
    }
}

// ======================================== 
// 自动关机管理
// ======================================== 

function resetShutdownTimer() {
    // 禁用自动关机功能
    if (appState.shutdownTimer) {
        clearTimeout(appState.shutdownTimer);
    }
    if (appState.inactivityTimer) {
        clearTimeout(appState.inactivityTimer);
    }
    
    // 不再设置自动关机计时器
    // if (appState.settings.autoShutdown > 0 && INACTIVITY_TIMEOUT > 0) {
    //     appState.inactivityTimer = setTimeout(() => {
    //         if (!appState.isShuttingDown) {
    //             initiateShutdown();
    //         }
    //     }, INACTIVITY_TIMEOUT);
    // }
}

function initiateShutdown() {
    appState.isShuttingDown = true;
    window.location.href = 'shutdown.html';
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
// 初始化
// ======================================== 

function initializeMain() {
    // 更新时间
    updateTime();
    setInterval(updateTime, 60000); // 每分钟更新一次
    
    // 更新用户界面
    updateUserInterface();
    
    // 设置导航事件监听
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const navType = item.dataset.nav;
            if (navType === 'start-measurement') {
                navigateToPage('measure');
            } else {
                navigateToPage(navType);
            }
        });
    });
    
    // 设置用户头像点击事件
    const userAvatars = document.querySelectorAll('.user-avatar');
    userAvatars.forEach(avatar => {
        avatar.addEventListener('click', () => {
            const userName = avatar.dataset.user;
            selectUser(userName);
        });
    });
    
    // 启动自动关机计时器
    resetShutdownTimer();
    
    // 添加用户活动监听（手势操作支持）
    ['click', 'touchstart', 'mousedown', 'mousemove', 'keydown'].forEach(eventType => {
        document.addEventListener(eventType, resetShutdownTimer);
    });
}

// ======================================== 
// 添加用户功能
// ======================================== 

const availableAvatars = [
    { avatar: '爸', color: '#004D40' }, { avatar: '妈', color: '#4A148C' },
    { avatar: '哥', color: '#01579B' }, { avatar: '姐', color: '#880E4F' },
    { avatar: '爷', color: '#3E2723' }, { avatar: '奶', color: '#F57F17' },
    { avatar: 'A', color: '#1A237E' }, { avatar: 'B', color: '#BF360C' },
];

let selectedAvatar = null;

function showAddUserPage() {
    navigateToPage('add-user');
    prepareAddUserPage();
}

function prepareAddUserPage() {
    const nicknameInput = document.getElementById('nickname-input');
    const avatarPicker = document.getElementById('avatar-picker');
    const saveButton = document.getElementById('save-user-button');
    
    if (nicknameInput) nicknameInput.value = '';
    selectedAvatar = null;
    if (saveButton) saveButton.disabled = true;
    
    if (avatarPicker) {
        avatarPicker.innerHTML = '';
        availableAvatars.forEach(avatarInfo => {
            const avatarEl = document.createElement('div');
            avatarEl.className = 'avatar-option';
            avatarEl.style.backgroundColor = avatarInfo.color;
            avatarEl.textContent = avatarInfo.avatar;
            avatarEl.addEventListener('click', () => {
                document.querySelectorAll('.avatar-option').forEach(el => el.classList.remove('selected'));
                avatarEl.classList.add('selected');
                selectedAvatar = avatarInfo;
                validateAddUserForm();
            });
            avatarPicker.appendChild(avatarEl);
        });
    }
}

function validateAddUserForm() {
    const nicknameInput = document.getElementById('nickname-input');
    const saveButton = document.getElementById('save-user-button');
    const isValid = nicknameInput && nicknameInput.value.trim() && selectedAvatar;
    if (saveButton) saveButton.disabled = !isValid;
}

function saveNewUser() {
    const nicknameInput = document.getElementById('nickname-input');
    const nickname = nicknameInput.value.trim();
    
    if (nickname && selectedAvatar) {
        // 添加新用户到状态
        appState.users[nickname] = {
            avatar: selectedAvatar.avatar,
            color: selectedAvatar.color,
            weight: 0,
            bmi: 0,
            fatPercentage: 0,
            muscleWeight: 0,
            waterPercentage: 0,
            boneWeight: 0,
            history: []
        };
        
        // 切换到新用户
        selectUser(nickname);
        
        // 返回主页
        navigateToPage('home');
        
        // 重新渲染用户列表
        location.reload(); // 简单的重新加载页面来更新用户列表
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    initializeMain();
    
    // 添加用户表单事件监听
    const nicknameInput = document.getElementById('nickname-input');
    const saveButton = document.getElementById('save-user-button');
    
    if (nicknameInput) {
        nicknameInput.addEventListener('input', validateAddUserForm);
    }
    
    if (saveButton) {
        saveButton.addEventListener('click', saveNewUser);
    }
});

// ======================================== 
// 开发状态提示功能
// ======================================== 

/**
 * 显示开发中提示
 */
function showDevelopmentNotice(featureName) {
    // 创建提示元素
    const notice = document.createElement('div');
    notice.className = 'development-notice';
    notice.innerHTML = `
        <div class="development-notice-content">
            <div class="development-notice-icon">🚧</div>
            <div class="development-notice-title">${featureName}正在开发中</div>
            <div class="development-notice-message">该功能正在紧急开发中，敬请期待！</div>
        </div>
    `;
    
    // 添加样式
    notice.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease-out;
    `;
    
    // 内容样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
        }
        .development-notice-content {
            background: white;
            padding: 40px;
            border-radius: 16px;
            text-align: center;
            max-width: 320px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }
        .development-notice-icon {
            font-size: 48px;
            margin-bottom: 16px;
        }
        .development-notice-title {
            font-size: 20px;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 8px;
        }
        .development-notice-message {
            font-size: 14px;
            color: #64748b;
            line-height: 1.5;
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(notice);
    
    // 3秒后自动关闭
    setTimeout(() => {
        notice.style.animation = 'fadeIn 0.3s ease-out reverse';
        setTimeout(() => {
            if (notice.parentNode) {
                notice.parentNode.removeChild(notice);
            }
            if (style.parentNode) {
                style.parentNode.removeChild(style);
            }
        }, 300);
    }, 3000);
    
    // 点击背景关闭
    notice.addEventListener('click', (e) => {
        if (e.target === notice) {
            notice.style.animation = 'fadeIn 0.3s ease-out reverse';
            setTimeout(() => {
                if (notice.parentNode) {
                    notice.parentNode.removeChild(notice);
                }
                if (style.parentNode) {
                    style.parentNode.removeChild(style);
                }
            }, 300);
        }
    });
}
