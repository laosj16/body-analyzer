// ======================================== 
// 全面屏手势处理
// ======================================== 

class GestureHandler {
    constructor() {
        this.container = document.getElementById('screen-container');
        this.isGesturing = false;
        this.gestureStart = { x: 0, y: 0 };
        this.gestureEnd = { x: 0, y: 0 };
        this.gestureDirection = '';
        this.trailElements = [];
        this.sensitivity = 50; // 手势触发的最小距离
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.createGestureIndicator();
    }
    
    setupEventListeners() {
        // 鼠标事件
        this.container.addEventListener('mousedown', this.handleStart.bind(this));
        this.container.addEventListener('mousemove', this.handleMove.bind(this));
        this.container.addEventListener('mouseup', this.handleEnd.bind(this));
        this.container.addEventListener('mouseleave', this.handleEnd.bind(this));
        
        // 触摸事件（支持真实设备）
        this.container.addEventListener('touchstart', this.handleStart.bind(this));
        this.container.addEventListener('touchmove', this.handleMove.bind(this));
        this.container.addEventListener('touchend', this.handleEnd.bind(this));
        
        // 防止默认的拖拽和选择行为
        this.container.addEventListener('dragstart', (e) => e.preventDefault());
        this.container.addEventListener('selectstart', (e) => e.preventDefault());
    }
    
    createGestureIndicator() {
        this.indicator = document.createElement('div');
        this.indicator.className = 'gesture-indicator';
        document.body.appendChild(this.indicator);
    }
    
    handleStart(e) {
        e.preventDefault();
        this.isGesturing = true;
        
        const point = this.getEventPoint(e);
        this.gestureStart = { x: point.x, y: point.y };
        
        // 显示手势指示器
        this.showIndicator(point.x, point.y);
        this.container.classList.add('gesture-mode');
        
        // 创建波纹效果
        this.createRipple(point.x, point.y);
    }
    
    handleMove(e) {
        if (!this.isGesturing) return;
        
        e.preventDefault();
        const point = this.getEventPoint(e);
        
        // 更新指示器位置
        this.updateIndicator(point.x, point.y);
        
        // 创建轨迹点
        this.createTrail(point.x, point.y);
        
        // 检测手势方向并更新光标
        this.detectDirection(this.gestureStart, point);
    }
    
    handleEnd(e) {
        if (!this.isGesturing) return;
        
        e.preventDefault();
        this.isGesturing = false;
        
        const point = this.getEventPoint(e);
        this.gestureEnd = { x: point.x, y: point.y };
        
        // 隐藏指示器
        this.hideIndicator();
        this.container.classList.remove('gesture-mode');
        this.clearCursorClasses();
        
        // 处理手势
        this.processGesture();
        
        // 清理轨迹
        setTimeout(() => this.clearTrails(), 500);
    }
    
    getEventPoint(e) {
        const rect = this.container.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
        const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
        
        return {
            x: clientX,
            y: clientY,
            relativeX: clientX - rect.left,
            relativeY: clientY - rect.top
        };
    }
    
    detectDirection(start, current) {
        const deltaX = current.x - start.x;
        const deltaY = current.y - start.y;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        if (distance < 20) return; // 太小的移动不处理
        
        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);
        
        let direction = '';
        if (absX > absY) {
            direction = deltaX > 0 ? 'swipe-right' : 'swipe-left';
        } else {
            direction = deltaY > 0 ? 'swipe-down' : 'swipe-up';
        }
        
        this.clearCursorClasses();
        this.container.classList.add(`gesture-${direction}`);
        this.gestureDirection = direction;
    }
    
    clearCursorClasses() {
        this.container.classList.remove(
            'gesture-swipe-up', 
            'gesture-swipe-down', 
            'gesture-swipe-left', 
            'gesture-swipe-right'
        );
    }
    
    processGesture() {
        const deltaX = this.gestureEnd.x - this.gestureStart.x;
        const deltaY = this.gestureEnd.y - this.gestureStart.y;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        if (distance < this.sensitivity) return;
        
        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);
        
        let gestureType = '';
        if (absX > absY) {
            gestureType = deltaX > 0 ? 'right' : 'left';
        } else {
            gestureType = deltaY > 0 ? 'down' : 'up';
        }
        
        this.executeGesture(gestureType);
    }
    
    executeGesture(type) {
        console.log(`手势检测: ${type}`);
        
        switch(type) {
            case 'up':
                this.handleSwipeUp();
                break;
            case 'down':
                this.handleSwipeDown();
                break;
            case 'left':
                this.handleSwipeLeft();
                break;
            case 'right':
                this.handleSwipeRight();
                break;
        }
    }
    
    handleSwipeUp() {
        // 向上滑动 - 返回主菜单
        console.log('执行向上滑动手势 - 返回主菜单');
        this.showGestureToast('返回主菜单');
        // 返回主菜单
        if (typeof navigateToPage === 'function') {
            navigateToPage('home');
        } else {
            window.location.href = 'main.html';
        }
    }
    
    handleSwipeDown() {
        // 向下滑动 - 可以实现下拉刷新或展开更多内容
        console.log('执行向下滑动手势');
        this.showGestureToast('向下滑动 - 刷新数据');
        // 可以在这里添加滚动到更多内容的逻辑
        this.scrollToMoreContent();
    }
    
    handleSwipeLeft() {
        // 向左滑动 - 返回上一级菜单
        console.log('执行向左滑动手势 - 返回上一级');
        this.showGestureToast('返回上一级');
        // 返回上一级菜单
        if (typeof goBack === 'function') {
            goBack();
        } else {
            window.history.back();
        }
    }
    
    handleSwipeRight() {
        // 向右滑动 - 返回上一级菜单
        console.log('执行向右滑动手势 - 返回上一级');
        this.showGestureToast('返回上一级');
        // 返回上一级菜单
        if (typeof goBack === 'function') {
            goBack();
        } else {
            window.history.back();
        }
    }
    
    scrollToMoreContent() {
        const homeContent = document.querySelector('.home-content');
        if (homeContent) {
            homeContent.scrollTo({
                top: homeContent.scrollHeight,
                behavior: 'smooth'
            });
        }
    }
    
    showIndicator(x, y) {
        this.indicator.style.left = x + 'px';
        this.indicator.style.top = y + 'px';
        this.indicator.classList.add('active');
    }
    
    updateIndicator(x, y) {
        this.indicator.style.left = x + 'px';
        this.indicator.style.top = y + 'px';
    }
    
    hideIndicator() {
        this.indicator.classList.remove('active');
    }
    
    createRipple(x, y) {
        const ripple = document.createElement('div');
        ripple.className = 'gesture-ripple';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.width = '20px';
        ripple.style.height = '20px';
        
        document.body.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }
    
    createTrail(x, y) {
        const trail = document.createElement('div');
        trail.className = 'gesture-trail';
        trail.style.left = x + 'px';
        trail.style.top = y + 'px';
        
        document.body.appendChild(trail);
        this.trailElements.push(trail);
        
        // 限制轨迹点数量
        if (this.trailElements.length > 20) {
            const oldTrail = this.trailElements.shift();
            if (oldTrail.parentNode) {
                oldTrail.parentNode.removeChild(oldTrail);
            }
        }
    }
    
    clearTrails() {
        this.trailElements.forEach(trail => {
            if (trail.parentNode) {
                trail.parentNode.removeChild(trail);
            }
        });
        this.trailElements = [];
    }
    
    showGestureToast(message) {
        // 创建临时提示
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 14px;
            z-index: 10000;
            pointer-events: none;
        `;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 2000);
    }
}

// 初始化手势处理器
let gestureHandler;
document.addEventListener('DOMContentLoaded', () => {
    gestureHandler = new GestureHandler();
});
