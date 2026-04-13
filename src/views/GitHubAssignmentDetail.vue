<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p class="mt-2 text-gray-600">加载中...</p>
    </div>

    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      {{ error }}
    </div>

    <div v-else-if="!assignment" class="text-center py-12">
      <p class="text-gray-600">作业不存在</p>
      <router-link to="/github-assignments" class="text-blue-600 hover:underline mt-2 inline-block">
        返回作业列表
      </router-link>
    </div>

    <div v-else>
      <!-- 作业标题和基本信息 -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-2">{{ assignment.title }}</h1>
        <div class="flex items-center gap-4 text-gray-600">
          <span>📅 截止时间：{{ formatDate(assignment.deadline) }}</span>
          <span>👥 已接受：{{ assignment.accepted || 0 }} 人</span>
          <span>✅ 已提交：{{ assignment.submitted || 0 }} 人</span>
        </div>
      </div>

      <!-- 开始作业按钮 -->
      <div class="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
        <h2 class="text-xl font-semibold mb-3">开始你的编程作业</h2>
        <p class="mb-4 text-gray-700">点击下方按钮，GitHub Classroom 将自动为你创建一个私有的作业仓库。</p>
        <a 
          :href="assignment.invite_link" 
          target="_blank" 
          rel="noopener noreferrer"
          class="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
        >
          🚀 开始作业
        </a>
        <p class="text-sm text-gray-500 mt-3">提示：你需要先登录 GitHub 账号。</p>
      </div>

      <!-- Git 操作指南 -->
      <div class="bg-gray-100 rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4">Git 与 GitHub Classroom 使用指南</h2>
        <div class="space-y-4">
          <div>
            <h3 class="font-semibold">1. 接受作业</h3>
            <p class="text-gray-700 text-sm">点击上面的绿色按钮，在弹出的页面中再次点击 "Accept this assignment" 即可。</p>
          </div>
          <div>
            <h3 class="font-semibold">2. 克隆你的作业仓库到本地</h3>
            <pre class="bg-gray-800 text-green-300 p-3 rounded text-sm overflow-x-auto"><code>git clone 你的作业仓库地址</code></pre>
          </div>
          <div>
            <h3 class="font-semibold">3. 完成作业并提交</h3>
            <pre class="bg-gray-800 text-green-300 p-3 rounded text-sm overflow-x-auto"><code>git add .
git commit -m "完成作业"
git push</code></pre>
          </div>
          <div>
            <h3 class="font-semibold">4. 查看自动评分结果</h3>
            <p class="text-gray-700 text-sm">提交后，稍等片刻，在你的 GitHub 仓库页面即可看到自动评分的测试结果。</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '../supabase'

const route = useRoute()
const assignment = ref(null)
const loading = ref(true)
const error = ref(null)

const formatDate = (dateStr) => {
  if (!dateStr) return '待定'
  return new Date(dateStr).toLocaleDateString('zh-CN')
}

onMounted(async () => {
  const id = route.params.id
  try {
    const { data, error: fetchError } = await supabase
      .from('github_assignments')
      .select('*')
      .eq('id', id)
      .single()
    
    if (fetchError) throw fetchError
    assignment.value = data
  } catch (err) {
    error.value = '加载作业详情失败：' + err.message
  } finally {
    loading.value = false
  }
})
</script>