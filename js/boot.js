// 乐福智能身体成分分析仪 开机动画控制脚本 - 简洁网络背景
document.addEventListener('DOMContentLoaded', function() {
    // 初始化动态网络背景
    initNetworkBackground();
    
    // 等待开机动画完成后跳转到主页
    setTimeout(() => {
        window.location.href = 'main.html';
    }, 5500); // 5.5秒后跳转到主页
});

function initNetworkBackground() {
    const canvas = document.getElementById('boot-network');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let W, H;
    const points = [];
    const POINT_COUNT = 30; // 增加点数量让背景更丰富
    const MAX_DIST = 100; // 连接距离
    
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
                vx: (Math.random() - 0.5) * 0.8,
                vy: (Math.random() - 0.5) * 0.8,
                alpha: Math.random() * 0.6 + 0.4
            });
        }
    }
    
    function animate() {
        ctx.clearRect(0, 0, W, H);
        
        // 更新点位置
        points.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            
            // 边界反弹
            if (p.x <= 0 || p.x >= W) p.vx *= -1;
            if (p.y <= 0 || p.y >= H) p.vy *= -1;
            
            // 保持在画布内
            p.x = Math.max(0, Math.min(W, p.x));
            p.y = Math.max(0, Math.min(H, p.y));
        });
        
        // 绘制连接线
        for (let i = 0; i < POINT_COUNT; i++) {
            const p1 = points[i];
            for (let j = i + 1; j < POINT_COUNT; j++) {
                const p2 = points[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.hypot(dx, dy);
                
                if (dist < MAX_DIST) {
                    const alpha = (1 - dist / MAX_DIST) * 0.4;
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(0,255,255,${alpha})`; // 青色主题匹配扫描光束
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
        
        // 绘制节点
        points.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0,255,255,${p.alpha})`; // 青色主题匹配扫描光束
            ctx.fill();
        });
        
        requestAnimationFrame(animate);
    }
    
    // 初始化
    resize();
    initPoints();
    
    // 延迟启动动画
    setTimeout(() => {
        animate();
    }, 300);
    
    // 响应式处理
    window.addEventListener('resize', () => {
        resize();
        initPoints();
    });
}
