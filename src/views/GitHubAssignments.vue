<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-3xl font-bold">
        编程作业
      </h1>
      <router-link
        to="/assignments"
        class="text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-1"
      >
        <span>切换至理论作业</span>
        <span>→</span>
      </router-link>
    </div>
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
      v-else
      class="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
    >
      <div
        v-for="assignment in assignments"
        :key="assignment.id"
        class="bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300 overflow-hidden"
      >
        <div class="p-6">
          <h2 class="text-xl font-semibold mb-2">
            {{ assignment.title }}
          </h2>
          <p class="text-gray-600 text-sm mb-4">
            截止时间：{{ formatDate(assignment.deadline) }}
          </p>
          <div class="flex justify-between items-center text-sm">
            <span class="text-gray-500">
              📝 已提交：{{ assignment.accepted || 0 }} / {{ assignment.submitted || 0 }}
            </span>
            <router-link
              :to="`/github-assignment/${assignment.id}`"
              class="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              查看详情 →
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from '../supabase';

const assignments = ref([]);
const loading = ref(true);
const error = ref(null);

const formatDate = (dateStr) => {
  if (!dateStr) return '待定';
  return new Date(dateStr).toLocaleDateString('zh-CN');
};

onMounted(async () => {
  try {
    const { data, error: fetchError } = await supabase
      .from('github_assignments')
      .select('*')
      .order('deadline', { ascending: true });

    if (fetchError) throw fetchError;
    assignments.value = data || [];
  } catch (err) {
    error.value = '加载作业列表失败：' + err.message;
  } finally {
    loading.value = false;
  }
});
</script>
