// XSS 防护工具函数

/**
 * 清理HTML标签，防止XSS攻击
 * @param {string} input - 用户输入的内容
 * @returns {string} 清理后的安全内容
 */
export function sanitizeHtml(input) {
  if (!input) return '';

  // 基本的HTML标签过滤
  return (
    input
      // 移除<script>标签
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      // 移除<iframe>标签
      .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
      // 移除事件处理器
      .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
      // 移除javascript:链接
      .replace(/javascript:[^"']*/gi, '')
      // 转义特殊字符
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
  );
}

/**
 * 验证并清理用户输入的内容
 * @param {string} input - 用户输入的内容
 * @returns {string} 清理后的安全内容
 */
export function validateInput(input) {
  return sanitizeHtml(input);
}
