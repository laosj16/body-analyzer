// ======================================== 
// 全屏手势处理逻辑
// ======================================== 

document.addEventListener('DOMContentLoaded', () => {
    const screen = document.getElementById('screen-container');
    if (!screen) return;

    let touchStartX = 0;
    let touchStartY = 0;
    let activeGesture = null;

    // 监听手势边缘的触摸开始事件
    screen.addEventListener('touchstart', (e) => {
        const target = e.target;
        if (target.classList.contains('gesture-edge')) {
            activeGesture = target.dataset.gesture;
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }
    }, { passive: true });

    // 监听触摸移动
    screen.addEventListener('touchmove', (e) => {
        if (!activeGesture) return;

        const touchCurrentX = e.touches[0].clientX;
        const touchCurrentY = e.touches[0].clientY;
        const deltaX = touchCurrentX - touchStartX;
        const deltaY = touchCurrentY - touchStartY;

        // 根据手势类型处理
        switch (activeGesture) {
            case 'left':
                // 从左边缘向右滑动超过50像素，触发返回
                if (deltaX > 50 && Math.abs(deltaY) < 30) {
                    console.log('Gesture: Swipe Right from Left Edge (Back)');
                    if (typeof goBack === 'function') {
                        goBack();
                    }
                    activeGesture = null; // 重置手势
                }
                break;
            case 'top':
                // 从顶部向下滑动
                if (deltaY > 50 && Math.abs(deltaX) < 30) {
                    console.log('Gesture: Swipe Down from Top Edge');
                    // 在此可以添加打开通知中心等功能
                    activeGesture = null;
                }
                break;
            case 'right':
                 // 从右边缘向左滑动
                if (deltaX < -50 && Math.abs(deltaY) < 30) {
                    console.log('Gesture: Swipe Left from Right Edge');
                    activeGesture = null;
                }
                break;
        }
    }, { passive: true });

    // 触摸结束时重置状态
    screen.addEventListener('touchend', () => {
        activeGesture = null;
        touchStartX = 0;
        touchStartY = 0;
    });
});
