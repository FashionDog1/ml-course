// 速率限制工具函数

/**
 * 速率限制器类
 */
class RateLimiter {
  constructor() {
    // 存储用户操作的时间戳
    this.actions = new Map();
  }

  /**
   * 检查操作是否允许
   * @param {string} key - 操作的唯一标识
   * @param {number} limit - 时间限制（毫秒）
   * @returns {boolean} 是否允许操作
   */
  check(key, limit) {
    const now = Date.now();
    const lastAction = this.actions.get(key);

    if (!lastAction) {
      // 第一次操作，记录时间戳
      this.actions.set(key, now);
      return true;
    }

    if (now - lastAction >= limit) {
      // 超过时间限制，更新时间戳
      this.actions.set(key, now);
      return true;
    }

    // 未超过时间限制，不允许操作
    return false;
  }

  /**
   * 清除指定操作的时间戳
   * @param {string} key - 操作的唯一标识
   */
  clear(key) {
    this.actions.delete(key);
  }

  /**
   * 清除所有操作的时间戳
   */
  clearAll() {
    this.actions.clear();
  }
}

// 导出单例实例
export const rateLimiter = new RateLimiter();

/**
 * 检查是否允许提交操作
 * @param {string} userId - 用户ID
 * @param {string} action - 操作类型
 * @param {string} role - 用户角色（student/teacher）
 * @returns {boolean} 是否允许操作
 */
export function checkSubmitRateLimit(userId, action, role) {
  const key = `${userId}:${action}`;
  const limit = role === 'teacher' ? 5000 : 30000; // 教师5秒，学生30秒

  if (!rateLimiter.check(key, limit)) {
    const timeLeft = Math.ceil((limit - (Date.now() - rateLimiter.actions.get(key))) / 1000);
    throw new Error(`操作过于频繁，请${timeLeft}秒后再试`);
  }

  return true;
}
