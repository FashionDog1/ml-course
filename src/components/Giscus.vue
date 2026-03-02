<template>
  <div class="giscus-container">
    <div id="giscus-container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  repo: {
    type: String,
    default: 'FashionDog1/ml-course'
  },
  repoId: {
    type: String,
    default: 'R_kgDORcdLiA'
  },
  category: {
    type: String,
    default: 'Q&A'
  },
  categoryId: {
    type: String,
    default: 'DIC_kwDORcdLiM4C3hs9'
  }
});

onMounted(() => {
  // 动态创建Giscus脚本标签
  if (typeof window !== 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', props.repo);
    script.setAttribute('data-repo-id', props.repoId);
    script.setAttribute('data-category', props.category);
    script.setAttribute('data-category-id', props.categoryId);
    script.setAttribute('data-mapping', 'url');
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