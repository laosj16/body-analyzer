/**
 * 显示一个浮动提示框 (Toast)
 * @param {string} message - 要显示的消息
 * @param {string} [type='info'] - 提示类型 ('info', 'success', 'error')
 */
function showToast(message, type = 'info') {
    // 移除任何已存在的toast
    const existingToast = document.querySelector('.toast-container');
    if (existingToast) {
        existingToast.remove();
    }

    // 创建toast元素
    const toast = document.createElement('div');
    toast.className = `toast-container ${type}`;
    toast.textContent = message;

    document.body.appendChild(toast);

    // 动画：滑入
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    // 3秒后自动移除
    setTimeout(() => {
        toast.classList.remove('show');
        // 等待滑出动画结束后再移除DOM元素
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 500);
    }, 3000);
}
