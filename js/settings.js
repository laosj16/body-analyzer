// ======================================== 
// 设置页面逻辑
// ======================================== 

// 设置状态
let currentSettings = {
    unit: 'kg', // 'kg', 'lb', 'st'
    volume: 80, // 0-100
    brightness: 70, // 10-100
    bluetoothEnabled: true,
    wifiEnabled: true,
    wifiConnected: true,
    currentWifiNetwork: 'Home_Network'
};

// ======================================== 
// 页面加载时初始化
// ======================================== 

document.addEventListener('DOMContentLoaded', () => {
    initializeSettings();
    setupEventListeners();
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);
});

// 初始化设置
function initializeSettings() {
    loadSettings();
    updateUI();
    
    // 应用当前亮度设置
    document.body.style.filter = `brightness(${currentSettings.brightness}%)`;
    
    // 更新状态栏图标
    updateBluetoothStatus();
    updateWifiStatus();
}

// 加载设置
function loadSettings() {
    const savedSettings = localStorage.getItem('deviceSettings');
    if (savedSettings) {
        currentSettings = { ...currentSettings, ...JSON.parse(savedSettings) };
    }
}

// 更新UI显示
function updateUI() {
    // 更新单位选择
    document.querySelectorAll('.unit-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.unit === currentSettings.unit);
    });

    // 更新音量滑块
    const volumeSlider = document.getElementById('volume-slider');
    const volumeValue = document.getElementById('volume-value');
    if (volumeSlider && volumeValue) {
        volumeSlider.value = currentSettings.volume;
        volumeValue.textContent = `${currentSettings.volume}%`;
    }

    // 更新亮度滑块
    const brightnessSlider = document.getElementById('brightness-slider');
    const brightnessValue = document.getElementById('brightness-value');
    if (brightnessSlider && brightnessValue) {
        brightnessSlider.value = currentSettings.brightness;
        brightnessValue.textContent = `${currentSettings.brightness}%`;
    }

    // 更新蓝牙开关
    const bluetoothSwitch = document.querySelector('.bluetooth-toggle input');
    const bluetoothLabel = document.querySelector('.switch-label');
    if (bluetoothSwitch && bluetoothLabel) {
        bluetoothSwitch.checked = currentSettings.bluetoothEnabled;
        bluetoothLabel.textContent = currentSettings.bluetoothEnabled ? 'Enabled' : 'Disabled';
    }

    // 更新WiFi开关
    const wifiSwitch = document.getElementById('wifi-switch');
    const wifiLabel = document.getElementById('wifi-label');
    const wifiInfo = document.getElementById('wifi-info');
    if (wifiSwitch && wifiLabel && wifiInfo) {
        wifiSwitch.checked = currentSettings.wifiEnabled;
        wifiLabel.textContent = currentSettings.wifiEnabled ? 'Enabled' : 'Disabled';
        wifiInfo.style.display = currentSettings.wifiEnabled ? 'flex' : 'none';
        
        // 更新连接状态
        const wifiStatus = document.querySelector('.wifi-status');
        const wifiName = document.querySelector('.wifi-name');
        if (wifiStatus && wifiName) {
            if (currentSettings.wifiEnabled && currentSettings.wifiConnected) {
                wifiStatus.className = 'wifi-status connected';
                wifiStatus.textContent = 'Connected';
                wifiName.textContent = currentSettings.currentWifiNetwork;
            } else {
                wifiStatus.className = 'wifi-status disconnected';
                wifiStatus.textContent = 'Disconnected';
                wifiName.textContent = 'No network';
            }
        }
    }
}

// 设置事件监听器
function setupEventListeners() {
    // 单位选择事件
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('unit-btn')) {
            const unit = e.target.dataset.unit;
            if (unit) {
                currentSettings.unit = unit;
                updateUI();
                saveSettings();
                showToast(`Weight unit changed to ${unit.toUpperCase()}`);
            }
        }
    });

    // 音量滑块事件
    const volumeSlider = document.getElementById('volume-slider');
    if (volumeSlider) {
        volumeSlider.addEventListener('input', (e) => {
            currentSettings.volume = parseInt(e.target.value);
            document.getElementById('volume-value').textContent = `${currentSettings.volume}%`;
            saveSettings();
            playVolumeTestSound();
        });
    }

    // 亮度滑块事件
    const brightnessSlider = document.getElementById('brightness-slider');
    if (brightnessSlider) {
        brightnessSlider.addEventListener('input', (e) => {
            currentSettings.brightness = parseInt(e.target.value);
            document.getElementById('brightness-value').textContent = `${currentSettings.brightness}%`;
            saveSettings();
            
            // 实际调整屏幕亮度（模拟）
            document.body.style.filter = `brightness(${currentSettings.brightness}%)`;
        });
    }

    // 蓝牙开关事件
    const bluetoothSwitch = document.querySelector('.bluetooth-toggle input');
    if (bluetoothSwitch) {
        bluetoothSwitch.addEventListener('change', (e) => {
            currentSettings.bluetoothEnabled = e.target.checked;
            const label = document.querySelector('.switch-label');
            if (label) {
                label.textContent = currentSettings.bluetoothEnabled ? 'Enabled' : 'Disabled';
            }
            saveSettings();
            updateBluetoothStatus();
            showToast(`Bluetooth ${currentSettings.bluetoothEnabled ? 'enabled' : 'disabled'}`);
        });
    }

    // WiFi开关事件
    const wifiSwitch = document.getElementById('wifi-switch');
    if (wifiSwitch) {
        wifiSwitch.addEventListener('change', (e) => {
            currentSettings.wifiEnabled = e.target.checked;
            if (!currentSettings.wifiEnabled) {
                currentSettings.wifiConnected = false;
                // 隐藏密码输入区域
                const passwordSection = document.getElementById('wifi-password-section');
                if (passwordSection) {
                    passwordSection.style.display = 'none';
                }
            }
            updateUI();
            saveSettings();
            updateWifiStatus();
            showToast(`WiFi ${currentSettings.wifiEnabled ? 'enabled' : 'disabled'}`);
        });
    }

    // WiFi密码输入框的键盘事件
    const passwordInput = document.getElementById('wifi-password');
    if (passwordInput) {
        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                connectWithPassword();
            }
        });
    }
}

// 保存设置
function saveSettings() {
    localStorage.setItem('deviceSettings', JSON.stringify(currentSettings));
    console.log('Settings saved:', currentSettings);
}

// 恢复出厂设置确认
function confirmFactoryReset() {
    if (confirm('⚠️ Warning: This will erase all data and restore default settings.\n\nAll user data, measurements, and custom settings will be permanently deleted.\n\nContinue with factory reset?')) {
        performFactoryReset();
    }
}

// 执行恢复出厂设置
function performFactoryReset() {
    // 显示重置进度
    showResetProgress();
    
    setTimeout(() => {
        // 清除所有本地存储
        localStorage.clear();
        
        // 重置设置为默认值
        currentSettings = {
            unit: 'kg',
            volume: 80,
            brightness: 70,
            bluetoothEnabled: true,
            wifiConnected: true
        };
        
        // 更新UI
        updateUI();
        
        // 重置页面亮度
        document.body.style.filter = 'brightness(70%)';
        
        // 显示成功消息
        showResetSuccess();
    }, 2000);
}

// 显示重置进度
function showResetProgress() {
    const progressOverlay = document.createElement('div');
    progressOverlay.id = 'reset-progress';
    progressOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        color: white;
    `;
    
    progressOverlay.innerHTML = `
        <div style="text-align: center;">
            <div style="width: 60px; height: 60px; border: 3px solid rgba(255, 255, 255, 0.3); 
                        border-top: 3px solid white; border-radius: 50%; 
                        animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
            <h3 style="margin: 0 0 10px 0; font-size: 18px;">Factory Reset in Progress</h3>
            <p style="margin: 0; color: rgba(255, 255, 255, 0.7);">Please wait...</p>
        </div>
        <style>
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    `;
    
    document.body.appendChild(progressOverlay);
}

// 显示重置成功消息
function showResetSuccess() {
    // 移除进度提示
    const progressOverlay = document.getElementById('reset-progress');
    if (progressOverlay) {
        document.body.removeChild(progressOverlay);
    }
    
    // 创建成功提示
    const successMsg = document.createElement('div');
    successMsg.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(52, 199, 89, 0.95);
        color: white;
        padding: 30px 40px;
        border-radius: 16px;
        font-size: 16px;
        font-weight: 600;
        z-index: 1000;
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.4);
        text-align: center;
        border: 2px solid rgba(255, 255, 255, 0.3);
    `;
    
    successMsg.innerHTML = `
        <div style="margin-bottom: 10px;">✅</div>
        <div>Factory reset completed successfully!</div>
        <div style="font-size: 14px; margin-top: 8px; opacity: 0.9;">All settings restored to defaults</div>
    `;
    
    document.body.appendChild(successMsg);
    
    // 3秒后移除提示
    setTimeout(() => {
        if (document.body.contains(successMsg)) {
            document.body.removeChild(successMsg);
        }
    }, 3000);
}

// 模拟音量测试声音
function playVolumeTestSound() {
    // 创建简短的提示音（模拟）
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        const volume = currentSettings.volume / 100;
        gainNode.gain.setValueAtTime(volume * 0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
        console.log('Audio context not available');
    }
}

// 更新蓝牙状态
function updateBluetoothStatus() {
    const statusIcons = document.querySelector('.status-left');
    const bluetoothIcon = statusIcons.querySelector('svg');
    
    if (bluetoothIcon) {
        bluetoothIcon.style.color = currentSettings.bluetoothEnabled ? '#2196F3' : '#999';
        bluetoothIcon.style.opacity = currentSettings.bluetoothEnabled ? '1' : '0.5';
    }
}

// 更新WiFi状态
function updateWifiStatus() {
    const statusIcons = document.querySelector('.status-left');
    const wifiIcon = statusIcons.querySelectorAll('svg')[1]; // 第二个SVG是WiFi图标
    
    if (wifiIcon) {
        if (currentSettings.wifiEnabled && currentSettings.wifiConnected) {
            wifiIcon.style.color = '#4CAF50';
            wifiIcon.style.opacity = '1';
        } else if (currentSettings.wifiEnabled) {
            wifiIcon.style.color = '#FFA500';
            wifiIcon.style.opacity = '0.8';
        } else {
            wifiIcon.style.color = '#999';
            wifiIcon.style.opacity = '0.5';
        }
    }
}

// 处理WiFi网络选择
function handleWifiSelection() {
    const dropdown = document.getElementById('wifi-networks');
    const selectedValue = dropdown.value;
    const passwordSection = document.getElementById('wifi-password-section');
    const passwordInput = document.getElementById('wifi-password');
    
    if (!selectedValue) {
        passwordSection.style.display = 'none';
        return;
    }
    
    // 获取选中选项的安全类型
    const selectedOption = dropdown.options[dropdown.selectedIndex];
    const security = selectedOption.dataset.security;
    
    if (security === 'Open') {
        // 开放网络，直接连接
        passwordSection.style.display = 'none';
        connectWifiNetwork(selectedValue);
    } else {
        // 需要密码的网络，显示密码输入框
        passwordSection.style.display = 'flex';
        passwordInput.value = '';
        passwordInput.focus();
    }
}

// 显示/隐藏密码
function togglePasswordVisibility() {
    const passwordInput = document.getElementById('wifi-password');
    const showPasswordBtn = document.querySelector('.show-password-btn svg');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        showPasswordBtn.innerHTML = '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>';
    } else {
        passwordInput.type = 'password';
        showPasswordBtn.innerHTML = '<path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>';
    }
}

// 使用密码连接
function connectWithPassword() {
    const dropdown = document.getElementById('wifi-networks');
    const passwordInput = document.getElementById('wifi-password');
    const networkName = dropdown.value;
    const password = passwordInput.value.trim();
    
    if (!password) {
        showToast('Please enter the network password');
        passwordInput.focus();
        return;
    }
    
    connectWifiNetwork(networkName, password);
}

// 执行WiFi连接
function connectWifiNetwork(networkName, password = '') {
    showToast('Connecting to WiFi...');
    
    // 禁用连接按钮防止重复点击
    const connectBtn = document.querySelector('.wifi-connect-btn');
    if (connectBtn) {
        connectBtn.disabled = true;
        connectBtn.textContent = 'Connecting...';
    }
    
    // 模拟连接过程
    setTimeout(() => {
        currentSettings.wifiConnected = true;
        currentSettings.currentWifiNetwork = networkName;
        
        // 重置表单
        const dropdown = document.getElementById('wifi-networks');
        const passwordSection = document.getElementById('wifi-password-section');
        const passwordInput = document.getElementById('wifi-password');
        
        dropdown.value = '';
        passwordSection.style.display = 'none';
        passwordInput.value = '';
        
        // 恢复连接按钮
        if (connectBtn) {
            connectBtn.disabled = false;
            connectBtn.textContent = 'Connect to Network';
        }
        
        updateUI();
        saveSettings();
        updateWifiStatus();
        showToast(`Connected to ${networkName}`);
    }, 2000);
}

// 更新当前时间
function updateCurrentTime() {
    const timeElement = document.getElementById('current-time');
    if (timeElement) {
        const now = new Date();
        const timeString = now.toLocaleTimeString('zh-CN', { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        timeElement.textContent = timeString;
    }
}

// 返回主页
function goBack() {
    window.location.href = 'main.html';
}

// 工具函数 - 显示提示消息
function showToast(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 16px;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        if (document.body.contains(toast)) {
            document.body.removeChild(toast);
        }
    }, 2000);
}

// 获取设置数据（供其他页面使用）
function getSettings() {
    return currentSettings;
}

// 导出设置供全局使用
window.deviceSettings = {
    get: getSettings,
    save: saveSettings,
    load: loadSettings
};
