// 简化的main.js测试版本

function updateTime() {
    const now = new Date();
    const timeString = now.toTimeString().slice(0, 5);
    const timeElements = document.querySelectorAll('.time');
    timeElements.forEach(element => {
        element.textContent = timeString;
    });
}

// 简单的初始化函数
function initializeMain() {
    // 更新时间
    updateTime();
    setInterval(updateTime, 60000);
    
    console.log('Main initialized successfully');
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initializeMain);

// 测试设置按钮功能
function testSettingsClick() {
    console.log('Settings icon clicked!');
    window.location.href = 'settings.html';
}

console.log('Main.js loaded');