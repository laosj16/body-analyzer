// CF663 关机动画控制脚本 - 关机后循环到开机
document.addEventListener('DOMContentLoaded', function() {
    // 等待关机动画完成后循环回到开机
    setTimeout(() => {
        // 关机完成，跳转回开机画面
        console.log('关机动画完成，即将重新开机...');
        
        // 短暂黑屏后跳转到开机页面，形成完整循环
        setTimeout(() => {
            window.location.href = 'boot.html';
        }, 1000); // 黑屏1秒后重新开机
        
    }, 7000); // 等待关机动画完成（总时长7秒）
});
