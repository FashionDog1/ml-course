<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    <div
      v-if="loading"
      class="text-center py-12"
    >
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      <p class="mt-2 text-gray-600">
        加载中...
      </p>
    </div>

    <div
      v-else-if="error"
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
    >
      {{ error }}
    </div>

    <div
      v-else-if="!assignment"
      class="text-center py-12"
    >
      <p class="text-gray-600">
        作业不存在
      </p>
      <router-link
        to="/github-assignments"
        class="text-blue-600 hover:underline mt-2 inline-block"
      >
        返回作业列表
      </router-link>
    </div>

    <div v-else>
      <!-- 作业标题和基本信息 -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-2">
          {{ assignment.title }}
        </h1>
        <div class="flex items-center gap-4 text-gray-600">
          <span>📅 截止时间：{{ formatDate(assignment.deadline) }}</span>
          <span>👥 已接受：{{ assignment.accepted || 0 }} 人</span>
          <span>✅ 已提交：{{ assignment.submitted || 0 }} 人</span>
        </div>
      </div>

      <!-- 开始作业按钮 -->
      <div class="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
        <h2 class="text-xl font-semibold mb-3">
          开始你的编程作业
        </h2>
        <p class="mb-4 text-gray-700">
          点击下方按钮，GitHub Classroom 将自动为你创建一个私有的作业仓库。
        </p>
        <a
          :href="assignment.invite_link"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
        >
          🚀 开始作业
        </a>
        <p class="text-sm text-gray-500 mt-3">
          提示：你需要先登录 GitHub 账号。
        </p>
      </div>

      <!-- Git 操作指南 -->
      <div class="bg-gray-100 rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4">
          Git 与 GitHub Classroom 使用指南
        </h2>
        <div class="space-y-4">
          <div>
            <h3 class="font-medium text-gray-800 mb-2">
              1. 接受作业
            </h3>
            <p class="bg-gray-900 text-gray-100 p-3 rounded-md font-mono text-sm overflow-x-auto">
              点击上面的绿色按钮，在弹出的页面中再次点击 "Accept this assignment" 即可。
            </p>
          </div>
          <div>
            <h3 class="font-medium text-gray-800 mb-2">
              2. 克隆仓库
            </h3>
            <div class="bg-gray-900 text-gray-100 p-3 rounded-md font-mono text-sm overflow-x-auto">
              git clone 你的仓库链接;
            </div>
          </div>
          <div>
            <h3 class="font-medium text-gray-800 mb-2">
              3. 进入仓库目录
            </h3>
            <div class="bg-gray-900 text-gray-100 p-3 rounded-md font-mono text-sm overflow-x-auto">
              cd 仓库名称
            </div>
          </div>
          <div>
            <h3 class="font-medium text-gray-800 mb-2">
              4. 创建并切换到新分支
            </h3>
            <div class="bg-gray-900 text-gray-100 p-3 rounded-md font-mono text-sm overflow-x-auto">
              git checkout -b feature/assignment
            </div>
          </div>
          <div>
            <h3 class="font-medium text-gray-800 mb-2">
              5. 编写代码
            </h3>
            <p class="text-gray-600">
              完成作业要求的功能，确保代码能够正常运行。
            </p>
          </div>
          <div>
            <h3 class="font-medium text-gray-800 mb-2">
              6. 提交更改
            </h3>
            <div class="bg-gray-900 text-gray-100 p-3 rounded-md font-mono text-sm overflow-x-auto">
              git add .<br>
              git commit -m "完成作业"
            </div>
          </div>
          <div>
            <h3 class="font-medium text-gray-800 mb-2">
              7. 推送到远程仓库
            </h3>
            <div class="bg-gray-900 text-gray-100 p-3 rounded-md font-mono text-sm overflow-x-auto">
              git push origin feature/assignment
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { supabase } from '../supabase';

const route = useRoute();
const assignment = ref(null);
const loading = ref(true);
const error = ref(null);

const formatDate = (dateStr) => {
  if (!dateStr) return '待定';
  return new Date(dateStr).toLocaleDateString('zh-CN');
};

const hardcodedAssignments = {
  'hello-ml': {
    id: 'hello-ml',
    title: 'Hello ML',
    description: '第一个机器学习编程作业，熟悉基本的 Git 操作和代码提交流程。',
    deadline: '2026-04-30',
    invite_link: 'https://classroom.github.com/a/5-ABWqzz',
    accepted: 0,
    submitted: 0,
  },
  'linear-regression': {
    id: 'linear-regression',
    title: '线性回归实现',
    description: '实现线性回归算法，解决简单的回归问题。',
    deadline: '2026-05-15',
    invite_link: 'https://classroom.github.com/a/5-ABWqzz',
    accepted: 0,
    submitted: 0,
  },
};

onMounted(async () => {
  const id = route.params.id;
  try {
    const { data, error: fetchError } = await supabase
      .from('github_assignments')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.warn('从 Supabase 获取作业详情失败，使用硬编码数据:', fetchError);
      assignment.value = hardcodedAssignments[id];
    } else {
      assignment.value = data || hardcodedAssignments[id];
    }
  } catch (err) {
    console.error('加载作业详情失败:', err);
    assignment.value = hardcodedAssignments[id];
  } finally {
    loading.value = false;
  }
});
</script>
