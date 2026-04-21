<template>
  <div
    v-if="hasError"
    class="min-h-screen flex items-center justify-center bg-gray-50"
  >
    <div class="text-center max-w-md px-4">
      <div class="text-6xl mb-4">
        😢
      </div>
      <h1 class="text-2xl font-bold mb-2">
        页面出错了
      </h1>
      <p class="text-gray-600 mb-6">
        抱歉，页面加载过程中出现了错误。
      </p>
      <button
        class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        @click="resetError"
      >
        重试
      </button>
      <p
        v-if="error"
        class="mt-4 text-sm text-gray-500"
      >
        错误信息：{{ error.message }}
      </p>
    </div>
  </div>
  <slot v-else />
</template>

<script setup>
/**
 * ErrorBoundary 全局错误边界组件
 * 捕获子组件中的 JavaScript 错误，显示友好的错误提示页面
 * @component
 */
import { ref, onErrorCaptured } from 'vue';

/**
 * 是否发生错误的标志
 * @type {import('vue').Ref<boolean>}
 */
const hasError = ref(false);

/**
 * 捕获的错误对象
 * @type {import('vue').Ref<null|Error>}
 */
const error = ref(null);

/**
 * 捕获子组件的错误
 * 当子组件发生错误时，设置错误状态并阻止错误向上传播
 * @param {Error} err - 捕获的错误对象
 * @returns {boolean} 返回 true 阻止错误继续传播
 */
onErrorCaptured((err) => {
  hasError.value = true;
  error.value = err;
  console.error('Error caught by ErrorBoundary:', err);
  return true;
});

/**
 * 重置错误状态
 * 清除错误信息，允许用户重试
 */
const resetError = () => {
  hasError.value = false;
  error.value = null;
};
</script>
