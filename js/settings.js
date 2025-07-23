// ======================================== 
// 设置页面逻辑
// ======================================== 

// 设置状态
let settingsState = {
    weightUnit: 'kg', // 'kg' or 'lb'
    height: 175, // cm
    volume: 80, // 0-100
    brightness: 70, // 10-100
    autoShutdown: 0, // 禁用自动关机
    voiceAssistant: false,
    autoUserRecognition: true,
    healthReminder: true,
    dataSync: false
};

// ======================================== 
// 设置项控制
// ======================================== 

function toggleUnit(unit) {
    settingsState.weightUnit = unit;
    
    // 更新按钮状态
    const buttons = document.querySelectorAll('#unit-toggle .page-control-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.unit === unit) {
            btn.classList.add('active');
        }
    });
    
    showToast(`体重单位已切换为 ${unit === 'kg' ? '公斤' : '磅'}`);
}

function adjustHeight(delta) {
    settingsState.height = Math.max(100, Math.min(250, settingsState.height + delta));
    document.getElementById('height-display').textContent = `${settingsState.height}cm`;
}

function adjustShutdown(delta) {
    const shutdownOptions = [0, 1, 3, 5, 10, 15, 30]; // 增加0选项表示禁用
    let currentIndex = shutdownOptions.indexOf(settingsState.autoShutdown);
    
    currentIndex += delta;
    currentIndex = Math.max(0, Math.min(shutdownOptions.length - 1, currentIndex));
    
    settingsState.autoShutdown = shutdownOptions[currentIndex];
    const displayText = settingsState.autoShutdown === 0 ? '禁用' : `${settingsState.autoShutdown}分钟`;
    document.getElementById('shutdown-display').textContent = displayText;
}

function updateVolumeDisplay() {
    const slider = document.getElementById('volume-slider');
    const display = document.getElementById('volume-value');
    settingsState.volume = parseInt(slider.value);
    display.textContent = `${settingsState.volume}%`;
}

function updateBrightnessDisplay() {
    const slider = document.getElementById('brightness-slider');
    const display = document.getElementById('brightness-value');
    settingsState.brightness = parseInt(slider.value);
    display.textContent = `${settingsState.brightness}%`;
    
    // 实际调整屏幕亮度效果
    const screenContainer = document.querySelector('.screen-container');
    if (screenContainer) {
        const opacity = settingsState.brightness / 100;
        screenContainer.style.filter = `brightness(${opacity})`;
    }
}

function toggleSwitch(switchId, propertyName) {
    const switchElement = document.getElementById(switchId);
    const isActive = switchElement.classList.contains('active');
    
    // 切换状态
    settingsState[propertyName] = !isActive;
    
    // 更新UI
    if (settingsState[propertyName]) {
        switchElement.classList.add('active');
    } else {
        switchElement.classList.remove('active');
    }
    
    // 显示提示
    const featureNames = {
        voiceAssistant: '语音助手',
        autoUserRecognition: '自动识别用户',
        healthReminder: '健康提醒',
        dataSync: '数据同步'
    };
    
    const featureName = featureNames[propertyName];
    const status = settingsState[propertyName] ? '已开启' : '已关闭';
    showToast(`${featureName}${status}`);
}

// ======================================== 
// 数据管理功能
// ======================================== 

function clearAllData() {
    if (confirm('确定要清空所有用户数据吗？此操作不可撤销，将删除所有测量记录。')) {
        if (confirm('此操作将永久删除所有数据，确定继续？')) {
            // 清空数据逻辑
            localStorage.clear();
            showToast('所有数据已清空');
        }
    }
}

function exportData() {
    // 模拟数据导出
    const exportData = {
        settings: settingsState,
        exportTime: new Date().toISOString(),
        users: ['华仔', '小美', '老爸', '老妈'] // 模拟用户数据
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    // 创建下载链接
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `体成分数据_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    showToast('数据导出完成');
}

// ======================================== 
// 系统功能
// ======================================== 

function checkUpdate() {
    showToast('正在检查更新...');
    
    // 模拟检查更新
    setTimeout(() => {
        const hasUpdate = Math.random() > 0.7; // 30% 概率有更新
        
        if (hasUpdate) {
            if (confirm('发现新版本 v1.4.0，是否立即更新？')) {
                showToast('开始下载更新...');
                // 模拟更新过程
                setTimeout(() => {
                    showToast('更新完成，请重启设备');
                }, 3000);
            }
        } else {
            showToast('当前已是最新版本');
        }
    }, 2000);
}

function factoryReset() {
    if (confirm('确定要恢复出厂设置吗？此操作将清除所有设置和数据。')) {
        if (confirm('此操作不可撤销，确定继续？')) {
            // 重置所有设置
            settingsState = {
                weightUnit: 'kg',
                height: 175,
                volume: 80,
                brightness: 70,
                autoShutdown: 5,
                voiceAssistant: false,
                autoUserRecognition: true,
                healthReminder: true,
                dataSync: false
            };
            
            // 更新UI
            updateAllSettings();
            showToast('已恢复出厂设置');
        }
    }
}

// ======================================== 
// 控制按钮功能
// ======================================== 

function saveSettings() {
    // 保存设置到本地存储
    localStorage.setItem('bodyAnalyzerSettings', JSON.stringify(settingsState));
    showToast('设置已保存');
}

function exportSettings() {
    const settingsStr = JSON.stringify(settingsState, null, 2);
    const settingsBlob = new Blob([settingsStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(settingsBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'settings.json';
    link.click();
    
    URL.revokeObjectURL(url);
    showToast('设置已导出');
}

function resetSettings() {
    if (confirm('确定要重置所有设置为默认值吗？')) {
        settingsState = {
            weightUnit: 'kg',
            height: 175,
            volume: 80,
            brightness: 70,
            autoShutdown: 0, // 禁用自动关机
            voiceAssistant: false,
            autoUserRecognition: true,
            healthReminder: true,
            dataSync: false
        };
        
        updateAllSettings();
        showToast('设置已重置');
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
        case 'history':
            window.location.href = 'history.html';
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
// UI 更新函数
// ======================================== 

function updateAllSettings() {
    // 更新体重单位
    const unitButtons = document.querySelectorAll('#unit-toggle .page-control-btn');
    unitButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.unit === settingsState.weightUnit);
    });
    
    // 更新身高
    document.getElementById('height-display').textContent = `${settingsState.height}cm`;
    
    // 更新音量
    document.getElementById('volume-slider').value = settingsState.volume;
    document.getElementById('volume-value').textContent = `${settingsState.volume}%`;
    
    // 更新亮度
    document.getElementById('brightness-slider').value = settingsState.brightness;
    document.getElementById('brightness-value').textContent = `${settingsState.brightness}%`;
    
    // 更新自动关机
    const displayText = settingsState.autoShutdown === 0 ? '禁用' : `${settingsState.autoShutdown}分钟`;
    document.getElementById('shutdown-display').textContent = displayText;
    
    // 更新开关状态
    const switches = [
        { id: 'voice-switch', property: 'voiceAssistant' },
        { id: 'auto-user-switch', property: 'autoUserRecognition' },
        { id: 'health-reminder-switch', property: 'healthReminder' },
        { id: 'sync-switch', property: 'dataSync' }
    ];
    
    switches.forEach(({ id, property }) => {
        const switchElement = document.getElementById(id);
        if (switchElement) {
            switchElement.classList.toggle('active', settingsState[property]);
        }
    });
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

function initializeSettings() {
    // 加载保存的设置
    const savedSettings = localStorage.getItem('bodyAnalyzerSettings');
    if (savedSettings) {
        try {
            settingsState = { ...settingsState, ...JSON.parse(savedSettings) };
        } catch (e) {
            console.error('Failed to load settings:', e);
        }
    }
    
    // 设置事件监听器
    
    // 体重单位切换
    const unitButtons = document.querySelectorAll('#unit-toggle .page-control-btn');
    unitButtons.forEach(btn => {
        btn.addEventListener('click', () => toggleUnit(btn.dataset.unit));
    });
    
    // 滑块事件
    document.getElementById('volume-slider').addEventListener('input', updateVolumeDisplay);
    document.getElementById('brightness-slider').addEventListener('input', updateBrightnessDisplay);
    
    // 开关事件
    document.getElementById('voice-switch').addEventListener('click', () => 
        toggleSwitch('voice-switch', 'voiceAssistant'));
    document.getElementById('auto-user-switch').addEventListener('click', () => 
        toggleSwitch('auto-user-switch', 'autoUserRecognition'));
    document.getElementById('health-reminder-switch').addEventListener('click', () => 
        toggleSwitch('health-reminder-switch', 'healthReminder'));
    document.getElementById('sync-switch').addEventListener('click', () => 
        toggleSwitch('sync-switch', 'dataSync'));
    
    // 更新所有设置显示
    updateAllSettings();
    
    // 启动自动关机计时器
    resetInactivityTimer();
    
    // 添加用户活动监听（手势操作支持）
    ['click', 'touchstart', 'mousedown', 'mousemove', 'keydown'].forEach(eventType => {
        document.addEventListener(eventType, resetInactivityTimer);
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initializeSettings);
