// 乐福智能身体成分分析仪 关机动画控制脚本 - 简洁网络背景
document.addEventListener('DOMContentLoaded', function() {
    // 初始化动态网络背景
    initShutdownNetworkBackground();
    
    // 等待关机动画完成后循环回到开机
    setTimeout(() => {
        // 关机完成，跳转回开机画面
        console.log('关机动画完成，即将重新开机...');
        
        // 短暂黑屏后跳转到开机页面，形成完整循环
        setTimeout(() => {
            window.location.href = 'boot.html';
        }, 1000); // 黑屏1秒后重新开机
        
    }, 6000); // 等待关机动画完成（总时长6秒）
});

function initShutdownNetworkBackground() {
    const canvas = document.getElementById('shutdown-network');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let W, H;
    const points = [];
    const POINT_COUNT = 25; // 关机时稍少的点数量
    const MAX_DIST = 90; // 连接距离
    let animationId;
    
    function resize() {
        const container = canvas.parentElement;
        W = canvas.width = container.offsetWidth;
        H = canvas.height = container.offsetHeight;
        canvas.style.width = container.offsetWidth + 'px';
        canvas.style.height = container.offsetHeight + 'px';
    }
    
    // 初始化网络节点
    function initPoints() {
        points.length = 0;
        for (let i = 0; i < POINT_COUNT; i++) {
            points.push({
                x: Math.random() * W,
                y: Math.random() * H,
                vx: (Math.random() - 0.5) * 0.6,
                vy: (Math.random() - 0.5) * 0.6,
                alpha: Math.random() * 0.5 + 0.3
            });
        }
    }
    
    let startTime = Date.now();
    
    function animate() {
        const elapsed = Date.now() - startTime;
        const totalDuration = 5000; // 5秒总动画时间
        const fadeStart = 3000; // 3秒后开始淡出
        
        ctx.clearRect(0, 0, W, H);
        
        // 计算淡出效果
        let globalAlpha = 1;
        if (elapsed > fadeStart) {
            globalAlpha = Math.max(0, 1 - (elapsed - fadeStart) / (totalDuration - fadeStart));
        }
        
        // 停止动画当完全透明
        if (globalAlpha <= 0) {
            cancelAnimationFrame(animationId);
            return;
        }
        
        // 更新点位置（关机时逐渐减速）
        const slowFactor = Math.max(0.2, globalAlpha);
        points.forEach(p => {
            p.x += p.vx * slowFactor;
            p.y += p.vy * slowFactor;
            
            // 边界反弹
            if (p.x <= 0 || p.x >= W) p.vx *= -1;
            if (p.y <= 0 || p.y >= H) p.vy *= -1;
            
            // 保持在画布内
            p.x = Math.max(0, Math.min(W, p.x));
            p.y = Math.max(0, Math.min(H, p.y));
        });
        
        // 绘制连接线（红色主题，逐渐淡出）
        for (let i = 0; i < POINT_COUNT; i++) {
            const p1 = points[i];
            for (let j = i + 1; j < POINT_COUNT; j++) {
                const p2 = points[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.hypot(dx, dy);
                
                if (dist < MAX_DIST) {
                    const alpha = (1 - dist / MAX_DIST) * 0.4 * globalAlpha;
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(255,107,107,${alpha})`; // 关机红色主题
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
        
        // 绘制节点（红色主题，逐渐淡出）
        points.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,107,107,${p.alpha * globalAlpha})`; // 关机红色主题
            ctx.fill();
        });
        
        animationId = requestAnimationFrame(animate);
    }
    
    // 初始化
    resize();
    initPoints();
    
    // 立即启动动画
    startTime = Date.now();
    animate();
    
    // 响应式处理
    window.addEventListener('resize', () => {
        resize();
        initPoints();
    });
}
