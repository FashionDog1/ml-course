<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold">{{ assignment.title }}</h1>
        <router-link 
          to="/assignments" 
          class="text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-1"
        >
          <span>切换至理论作业</span>
          <span>→</span>
        </router-link>
      </div>
      
      <div class="bg-white rounded-lg shadow-md border border-gray-100 p-6">
        <!-- 作业信息卡片 -->
        <div class="mb-8">
          <div class="flex items-start justify-between mb-4">
            <div>
              <h2 class="text-xl font-semibold mb-2">作业详情</h2>
              <p class="text-gray-600 mb-2">{{ assignment.description }}</p>
            </div>
            <div class="bg-blue-50 border border-blue-100 rounded-lg p-3">
              <p class="text-sm font-medium text-blue-800">截止日期</p>
              <p class="text-lg font-semibold text-blue-600">{{ assignment.deadline }}</p>
            </div>
          </div>
          
          <div class="mt-6">
            <a 
              :href="assignment.invitationLink" 
              target="_blank" 
              rel="noopener noreferrer"
              class="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
            >
              <span>前往 GitHub Classroom</span>
              <span>→</span>
            </a>
          </div>
        </div>
        
        <!-- Git 操作指南 -->
        <div class="mt-8">
          <h2 class="text-xl font-semibold mb-4">Git 操作指南</h2>
          <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p class="text-gray-700 mb-4">请按照以下步骤完成作业：</p>
            
            <div class="space-y-4">
              <div>
                <h3 class="font-medium text-gray-800 mb-2">1. 克隆仓库</h3>
                <div class="bg-gray-900 text-gray-100 p-3 rounded-md font-mono text-sm overflow-x-auto">
                  git clone &lt;你的仓库链接&gt;
                </div>
              </div>
              
              <div>
                <h3 class="font-medium text-gray-800 mb-2">2. 进入仓库目录</h3>
                <div class="bg-gray-900 text-gray-100 p-3 rounded-md font-mono text-sm overflow-x-auto">
                  cd &lt;仓库名称&gt;
                </div>
              </div>
              
              <div>
                <h3 class="font-medium text-gray-800 mb-2">3. 创建并切换到新分支</h3>
                <div class="bg-gray-900 text-gray-100 p-3 rounded-md font-mono text-sm overflow-x-auto">
                  git checkout -b feature/assignment
                </div>
              </div>
              
              <div>
                <h3 class="font-medium text-gray-800 mb-2">4. 编写代码</h3>
                <p class="text-gray-600">完成作业要求的功能，确保代码能够正常运行。</p>
              </div>
              
              <div>
                <h3 class="font-medium text-gray-800 mb-2">5. 提交更改</h3>
                <div class="bg-gray-900 text-gray-100 p-3 rounded-md font-mono text-sm overflow-x-auto">
                  git add .<br>
                  git commit -m "完成作业"
                </div>
              </div>
              
              <div>
                <h3 class="font-medium text-gray-800 mb-2">6. 推送到远程仓库</h3>
                <div class="bg-gray-900 text-gray-100 p-3 rounded-md font-mono text-sm overflow-x-auto">
                  git push origin feature/assignment
                </div>
              </div>
              
              <div>
                <h3 class="font-medium text-gray-800 mb-2">7. 创建 Pull Request</h3>
                <p class="text-gray-600">在 GitHub 上创建 Pull Request，等待老师审核。</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 作业要求 -->
        <div class="mt-8">
          <h2 class="text-xl font-semibold mb-4">作业要求</h2>
          <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <ul class="list-disc list-inside space-y-2 text-gray-700">
              <li v-for="(requirement, index) in assignment.requirements" :key="index">
                {{ requirement }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { supabase } from '../supabase';

const route = useRoute();
const assignmentId = route.params.id;

// 方案 A：硬编码作业数据
const hardcodedAssignments = {
  'hello-ml': {
    id: 'hello-ml',
    title: 'Hello ML',
    description: '第一个机器学习编程作业，熟悉基本的 Git 操作和代码提交流程。',
    deadline: '2026-04-30',
    invitationLink: 'https://classroom.github.com/a/5-ABWqzz',
    requirements: [
      '完成指定的机器学习基础练习',
      '确保代码能够正常运行',
      '提交到 GitHub 仓库',
      '创建 Pull Request'
    ]
  },
  'linear-regression': {
    id: 'linear-regression',
    title: '线性回归实现',
    description: '实现线性回归算法，解决简单的回归问题。',
    deadline: '2026-05-15',
    invitationLink: 'https://classroom.github.com/a/5-ABWqzz', // 暂时使用同一个链接
    requirements: [
      '实现线性回归算法',
      '使用给定的数据集进行训练和测试',
      '计算模型的均方误差',
      '提交完整的代码和分析报告'
    ]
  }
};

// 方案 B：从 Supabase 动态获取数据
const assignment = ref({
  id: '',
  title: '加载中...',
  description: '',
  deadline: '',
  invitationLink: '',
  requirements: []
});

const isLoading = ref(true);

async function fetchAssignment() {
  try {
    // 尝试从 Supabase 获取数据
    const { data, error } = await supabase
      .from('github_assignments')
      .select('*')
      .eq('id', assignmentId)
      .single();
    
    if (error) {
      console.warn('从 Supabase 获取作业失败，使用硬编码数据:', error);
      // 失败时使用硬编码数据
      assignment.value = hardcodedAssignments[assignmentId] || hardcodedAssignments['hello-ml'];
    } else {
      // 成功时使用 Supabase 数据
      assignment.value = {
        ...data,
        requirements: data.requirements || []
      };
    }
  } catch (error) {
    console.error('获取作业数据失败:', error);
    // 错误时使用硬编码数据
    assignment.value = hardcodedAssignments[assignmentId] || hardcodedAssignments['hello-ml'];
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  fetchAssignment();
});
</script>

<style scoped>
/* GitHubAssignment component styles */
</style>