<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-4xl mx-auto">
      <!-- Breadcrumb -->
      <div class="text-sm text-gray-500 mb-6">
        <router-link to="/" class="hover:text-blue-600">首页</router-link> / 
        <span class="font-medium">{{ chapterTitle }}</span>
      </div>

      <!-- Chapter Content -->
      <div class="bg-white rounded-lg shadow-md border border-gray-100 p-6 mb-8">
        <h1 class="text-3xl font-bold mb-6">{{ chapterTitle }}</h1>
        <div v-if="content" v-html="renderedContent" class="prose max-w-none"></div>
        <div v-else class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p class="text-gray-600">加载中...</p>
        </div>
      </div>

      <!-- Giscus Comments -->
      <div class="bg-white rounded-lg shadow-md border border-gray-100 p-6">
        <h2 class="text-2xl font-bold mb-4">讨论</h2>
        <Giscus />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { marked } from 'marked';
import Giscus from '../components/Giscus.vue';

const route = useRoute();
const content = ref('');
const chapterId = route.params.id;

const chapterTitle = computed(() => {
  const titles = {
    introduction: '机器学习基础',
    'linear-regression': '线性回归',
    classification: '分类算法',
    'neural-networks': '神经网络',
    'deep-learning': '深度学习'
  };
  return titles[chapterId] || '章节内容';
});

const renderedContent = computed(() => {
  return marked(content.value);
});

async function loadChapter() {
  try {
    // 使用import.meta.glob加载Markdown文件
    const markdownFiles = import.meta.glob('../chapters/*.md', { query: '?raw', import: 'default' });
    const filePath = `../chapters/${chapterId}.md`;
    
    if (markdownFiles[filePath]) {
      content.value = await markdownFiles[filePath]();
    } else {
      content.value = '# 章节不存在\n\n该章节内容尚未添加。';
    }
  } catch (error) {
    console.error('加载章节失败:', error);
    content.value = '# 加载失败\n\n章节内容加载失败，请稍后重试。';
  }
}

onMounted(() => {
  loadChapter();
});
</script>

<style scoped>
.prose {
  line-height: 1.6;
}

.prose h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.prose h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}

.prose p {
  margin-bottom: 1rem;
}

.prose ul,
.prose ol {
  margin-bottom: 1rem;
  padding-left: 1.5rem;
}

.prose li {
  margin-bottom: 0.5rem;
}

.prose code {
  background-color: #f3f4f6;
  padding: 0.2rem 0.4rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

.prose pre {
  background-color: #f3f4f6;
  padding: 1rem;
  border-radius: 0.375rem;
  overflow-x: auto;
  margin-bottom: 1rem;
}

.prose pre code {
  background-color: transparent;
  padding: 0;
}
</style>