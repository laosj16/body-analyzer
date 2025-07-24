// ======================================== 
// 全面屏手势处理 + 滚动功能
// ======================================== 

class GestureHandler {
    constructor() {
        this.container = document.getElementById('screen-container');
        this.isGesturing = false;
        this.isScrolling = false;
        this.gestureStart = { x: 0, y: 0 };
        this.gestureEnd = { x: 0, y: 0 };
        this.gestureDirection = '';
        this.trailElements = [];
        this.sensitivity = 50; // 手势触发的最小距离
        this.scrollSensitivity = 20; // 滚动检测的最小距离
        this.scrollSpeed = 3; // 滚动速度倍数（提高到3倍）
        
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
        this.isScrolling = false;
        
        const point = this.getEventPoint(e);
        this.gestureStart = { x: point.x, y: point.y };
        
        // 初始时不显示指示器，等确定是手势还是滚动后再决定
    }
    
    handleMove(e) {
        if (!this.isGesturing) return;
        
        e.preventDefault();
        const point = this.getEventPoint(e);
        
        const deltaX = point.x - this.gestureStart.x;
        const deltaY = point.y - this.gestureStart.y;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        if (distance < this.scrollSensitivity) return; // 太小的移动不处理
        
        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);
        
        // 确定是滚动还是手势
        if (!this.isScrolling && absY > absX && absY > 20 && this.shouldEnableScroll()) {
            // 垂直移动较大且页面支持滚动，启动滚动模式
            this.isScrolling = true;
            this.container.style.cursor = 'grabbing';
        } else if (!this.isScrolling && absX > absY && absX > 30) {
            // 水平移动较大，启动手势模式
            this.showIndicator(point.x, point.y);
            this.container.classList.add('gesture-mode');
            this.createRipple(this.gestureStart.x, this.gestureStart.y);
        }
        
        if (this.isScrolling) {
            // 执行滚动 - 传递Y轴变化量
            this.handleScroll(deltaY);
        } else {
            // 执行手势检测
            this.updateIndicator(point.x, point.y);
            this.createTrail(point.x, point.y);
            this.detectDirection(this.gestureStart, point);
        }
    }
    
    handleEnd(e) {
        if (!this.isGesturing) return;
        
        e.preventDefault();
        this.isGesturing = false;
        
        const point = this.getEventPoint(e);
        this.gestureEnd = { x: point.x, y: point.y };
        
        if (this.isScrolling) {
            // 结束滚动
            this.isScrolling = false;
            this.container.style.cursor = '';
        } else {
            // 隐藏手势指示器
            this.hideIndicator();
            this.container.classList.remove('gesture-mode');
            this.clearCursorClasses();
            
            // 处理手势
            this.processGesture();
            
            // 清理轨迹
            setTimeout(() => this.clearTrails(), 500);
        }
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
        
        // 只处理水平方向的手势
        if (absX > absY && absX > 30) {
            let direction = deltaX > 0 ? 'swipe-right' : 'swipe-left';
            this.clearCursorClasses();
            this.container.classList.add(`gesture-${direction}`);
            this.gestureDirection = direction;
        }
    }
    
    clearCursorClasses() {
        this.container.classList.remove(
            'gesture-swipe-left', 
            'gesture-swipe-right'
        );
    }
    
    handleScroll(deltaY) {
        // 检查当前页面是否应该支持滚动
        if (!this.shouldEnableScroll()) return;
        
        // 获取可滚动的内容区域
        const scrollableElement = this.getScrollableElement();
        if (!scrollableElement) return;
        
        // 计算滚动距离（向下拖动时内容向下移动，向上拖动时内容向上移动）
        const scrollAmount = -deltaY * this.scrollSpeed;
        
        // 执行滚动
        scrollableElement.scrollTop += scrollAmount;
    }
    
    shouldEnableScroll() {
        // 获取当前页面文件名
        const currentPage = window.location.pathname.split('/').pop() || '';
        
        // 不支持滚动的页面列表
        const noScrollPages = ['boot.html', 'shutdown.html', 'index.html', '1.html'];
        
        return !noScrollPages.includes(currentPage);
    }
    
    getScrollableElement() {
        // 优先查找具有滚动内容的元素
        const candidates = [
            '.page-content',
            '.home-content', 
            '.result-content',
            '.history-content',
            '.page.active',
            '.page'
        ];
        
        for (const selector of candidates) {
            const element = document.querySelector(selector);
            if (element && element.scrollHeight > element.clientHeight) {
                return element;
            }
        }
        
        // 如果没有找到合适的元素，返回整个容器
        return this.container;
    }
    
    processGesture() {
        const deltaX = this.gestureEnd.x - this.gestureStart.x;
        const deltaY = this.gestureEnd.y - this.gestureStart.y;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        if (distance < this.sensitivity) return;
        
        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);
        
        // 只处理水平滑动手势
        if (absX > absY && absX > 30) { // 增加水平滑动的最小距离要求
            const gestureType = deltaX > 0 ? 'right' : 'left';
            this.executeGesture(gestureType);
        } else {
            console.log('忽略垂直滑动手势');
        }
    }
    
    executeGesture(type) {
        console.log(`手势检测: ${type}`);
        
        switch(type) {
            case 'left':
                this.handleSwipeLeft();
                break;
            case 'right':
                this.handleSwipeRight();
                break;
            default:
                // 只支持左右滑动手势
                console.log(`不支持的手势类型: ${type}`);
                break;
        }
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
