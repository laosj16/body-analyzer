// CF663 开机动画控制脚本 - 适配屏幕容器
document.addEventListener('DOMContentLoaded', function() {
    // 等待开机动画完成后跳转到主页
    setTimeout(() => {
        window.location.href = 'main.html';
    }, 7500); // 7.5秒后跳转到主页
});
