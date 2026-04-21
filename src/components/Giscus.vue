<template>
  <div class="giscus-container">
    <div id="giscus-container" />
  </div>
</template>

<script setup>
/**
 * Giscus 评论组件
 * 基于 GitHub Discussions 的评论系统
 * @component
 */
import { onMounted } from 'vue';

/**
 * Giscus 配置属性
 * @typedef {Object} GiscusProps
 * @property {string} repo - GitHub 仓库名称
 * @property {string} repoId - GitHub 仓库 ID
 * @property {string} category - 讨论分类名称
 * @property {string} categoryId - 讨论分类 ID
 */

/**
 * 组件属性
 * @type {GiscusProps}
 */
const props = defineProps({
  repo: {
    type: String,
    default: 'FashionDog1/ml-course',
  },
  repoId: {
    type: String,
    default: 'R_kgDORcdLiA',
  },
  category: {
    type: String,
    default: 'Q&A',
  },
  categoryId: {
    type: String,
    default: 'DIC_kwDORcdLiM4C3hs9',
  },
});

/**
 * 组件挂载时初始化 Giscus 评论系统
 * 动态创建 Giscus 脚本并配置评论功能
 * @生命周期钩子
 */
onMounted(() => {
  if (typeof window !== 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', props.repo);
    script.setAttribute('data-repo-id', props.repoId);
    script.setAttribute('data-category', props.category);
    script.setAttribute('data-category-id', props.categoryId);
    script.setAttribute('data-mapping', 'pathname');
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '1');
    script.setAttribute('data-input-position', 'top');
    script.setAttribute('data-theme', 'preferred_color_scheme');
    script.setAttribute('data-lang', 'zh-CN');
    script.setAttribute('crossorigin', 'anonymous');
    script.async = true;

    const container = document.getElementById('giscus-container');
    if (container) {
      container.appendChild(script);
    }

    window.addEventListener('message', (event) => {
      if (event.origin === 'https://giscus.app' && event.data.type === 'GISCUS_LOADED') {
        console.log('Giscus评论系统已加载');
      }
    });
  }
});
</script>

<style scoped>
.giscus-container {
  width: 100%;
  margin-top: 1rem;
}
</style>
