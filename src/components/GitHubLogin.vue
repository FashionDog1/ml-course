<template>
  <div>
    <div v-if="user">
      <!-- 已登录状态：显示头像和用户名，并提供登出按钮 -->
      <div class="flex items-center gap-4">
        <img
          :src="user.user_metadata?.avatar_url"
          class="w-8 h-8 rounded-full"
          loading="lazy"
        >
        <span class="font-medium">{{ user.user_metadata?.user_name }}</span>
        <button
          class="px-3 py-1 text-sm text-red-600 hover:text-red-800 border border-red-300 rounded-md hover:bg-red-50 transition"
          @click="handleLogout"
        >
          退出登录
        </button>
      </div>
    </div>
    <div v-else>
      <!-- 未登录状态：显示登录按钮 -->
      <button
        class="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition flex items-center gap-2"
        @click="handleLogin"
      >
        <span>GitHub</span> 登录
      </button>
    </div>
  </div>
</template>

<script setup>
/**
 * GitHub 登录组件
 * 提供 GitHub OAuth 登录和退出功能
 * @component
 */
import { ref, onMounted } from 'vue';
import { supabase } from '@/supabase';

/**
 * 当前登录用户状态
 * @type {import('vue').Ref<null|Object>}
 */
const user = ref(null);

/**
 * 组件挂载时初始化用户会话并监听认证状态变化
 * @生命周期钩子
 */
onMounted(() => {
  supabase.auth.getSession().then(({ data: { session } }) => {
    user.value = session?.user ?? null;
  });

  supabase.auth.onAuthStateChange((_event, session) => {
    user.value = session?.user ?? null;
  });
});

/**
 * 处理 GitHub OAuth 登录
 * 使用 Supabase Auth 进行 GitHub 登录授权
 * @returns {Promise<void>}
 */
const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}${window.location.pathname}`,
      },
    });
    if (error) console.error('GitHub 登录出错:', error.message);
  };

/**
 * 处理用户退出登录
 * 调用 Supabase Auth 退出功能并清空本地用户状态
 * @returns {Promise<void>}
 */
const handleLogout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) console.error('退出登录出错:', error.message);
  else user.value = null;
};
</script>
