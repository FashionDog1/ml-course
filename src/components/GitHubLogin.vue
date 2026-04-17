<template>
  <div>
    <div v-if="user">
      <!-- 已登录状态：显示头像和用户名，并提供登出按钮 -->
      <div class="flex items-center gap-4">
        <img :src="user.user_metadata?.avatar_url" class="w-8 h-8 rounded-full">
        <span class="font-medium">{{ user.user_metadata?.user_name }}</span>
        <button @click="handleLogout" class="px-3 py-1 text-sm text-red-600 hover:text-red-800 border border-red-300 rounded-md hover:bg-red-50 transition">
          退出登录
        </button>
      </div>
    </div>
    <div v-else>
      <!-- 未登录状态：显示登录按钮 -->
      <button @click="handleLogin" class="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition flex items-center gap-2">
        <span>GitHub</span> 登录
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/supabase'

const user = ref(null)

// 监听 Supabase 的认证状态变化
onMounted(() => {
  supabase.auth.getSession().then(({ data: { session } }) => {
    user.value = session?.user ?? null
  })

  const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
    user.value = session?.user ?? null
  })
})

// GitHub 登录函数
const handleLogin = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${window.location.origin}`  // 登录成功后的跳转地址，通常是网站首页
    }
  })
  if (error) console.error('GitHub 登录出错:', error.message)
}

// 退出登录函数
const handleLogout = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) console.error('退出登录出错:', error.message)
  else user.value = null
}
</script>