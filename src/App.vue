<template>
  <ErrorBoundary>
    <div class="min-h-screen bg-gray-50">
      <!-- Navigation -->
      <nav class="bg-white shadow-md">
        <div class="container mx-auto px-4">
          <div class="flex items-center justify-between h-16">
            <div class="flex items-center">
              <router-link
                to="/"
                class="flex items-center space-x-2"
              >
                <span class="font-bold text-xl">机器学习课程</span>
              </router-link>
            </div>

            <!-- Desktop Navigation -->
            <div class="hidden md:flex space-x-8">
              <router-link
                to="/"
                class="text-gray-700 hover:text-blue-600 font-medium"
              >
                首页
              </router-link>
              <router-link
                to="/chapters"
                class="text-gray-700 hover:text-blue-600 font-medium"
              >
                课程章节
              </router-link>
              <!-- 作业提交二级菜单 -->
              <div class="relative group">
                <button
                  class="text-gray-700 hover:text-blue-600 font-medium flex items-center space-x-1"
                >
                  <span>作业提交</span>
                  <span class="text-xs">▼</span>
                </button>
                <div
                  class="absolute left-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300"
                >
                  <router-link
                    to="/assignments"
                    class="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  >
                    理论作业提交
                  </router-link>
                  <router-link
                    to="/github-assignments"
                    class="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  >
                    编程作业提交
                  </router-link>
                  <router-link
                    to="/my-submissions"
                    class="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  >
                    作业提交记录
                  </router-link>
                </div>
              </div>
              <router-link
                to="/teacher-materials"
                class="text-gray-700 hover:text-blue-600 font-medium"
              >
                教学材料
              </router-link>
              <router-link
                to="/visualization"
                class="text-gray-700 hover:text-blue-600 font-medium"
              >
                可视化
              </router-link>
              <router-link
                to="/about"
                class="text-gray-700 hover:text-blue-600 font-medium"
              >
                关于
              </router-link>
              <git-hub-login />
            </div>

            <!-- Mobile Navigation Button -->
            <div class="md:hidden">
              <button
                class="text-gray-700 hover:text-blue-600"
                @click="toggleMenu"
              >
                <span class="text-xl">☰</span>
              </button>
            </div>
          </div>

          <!-- Mobile Navigation Menu -->
          <div
            v-if="menuOpen"
            class="md:hidden py-4 space-y-2"
          >
            <router-link
              to="/"
              class="block text-gray-700 hover:text-blue-600 font-medium py-2"
            >
              首页
            </router-link>
            <router-link
              to="/chapters"
              class="block text-gray-700 hover:text-blue-600 font-medium py-2"
            >
              课程章节
            </router-link>
            <!-- 作业提交移动端菜单 -->
            <div>
              <button
                class="w-full text-left text-gray-700 hover:text-blue-600 font-medium py-2 flex items-center justify-between"
                @click="toggleAssignmentMenu"
              >
                <span>作业提交</span>
                <span class="text-xs">{{ assignmentMenuOpen ? '▲' : '▼' }}</span>
              </button>
              <div
                v-if="assignmentMenuOpen"
                class="pl-4 space-y-1 mt-1"
              >
                <router-link
                  to="/assignments"
                  class="block text-gray-700 hover:text-blue-600 font-medium py-1"
                >
                  理论作业
                </router-link>
                <router-link
                  to="/github-assignments"
                  class="block text-gray-700 hover:text-blue-600 font-medium py-1"
                >
                  编程作业
                </router-link>
                <router-link
                  to="/my-submissions"
                  class="block text-gray-700 hover:text-blue-600 font-medium py-1"
                >
                  作业提交记录
                </router-link>
              </div>
            </div>
            <router-link
              to="/teacher-materials"
              class="block text-gray-700 hover:text-blue-600 font-medium py-2"
            >
              教学资料与讨论
            </router-link>
            <router-link
              to="/visualization"
              class="block text-gray-700 hover:text-blue-600 font-medium py-2"
            >
              可视化
            </router-link>
            <router-link
              to="/about"
              class="block text-gray-700 hover:text-blue-600 font-medium py-2"
            >
              关于
            </router-link>
            <git-hub-login />
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="container mx-auto px-4 py-8">
        <router-view v-slot="{ Component }">
          <transition
            name="fade"
            mode="out-in"
          >
            <component :is="Component" />
          </transition>
        </router-view>
      </main>

      <!-- Footer -->
      <footer class="bg-white border-t border-gray-200 mt-12">
        <div class="container mx-auto px-4 py-8">
          <div class="text-center text-gray-600">
            <p>© 2026 计算机专业毕设,仅供学习交流使用,联系邮箱:1290883283@qq.com</p>  
          </div>
        </div>
      </footer>
      <!-- Back to Top Button -->
      <button
        v-if="showBackToTop"
        class="fixed bottom-8 right-8 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 z-50"
        aria-label="返回顶部"
        @click="backToTop"
      >
        ↑
      </button>
    </div>
  </ErrorBoundary>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import GitHubLogin from './components/GitHubLogin.vue';
import ErrorBoundary from './components/ErrorBoundary.vue';
import { supabase } from './supabase';

const menuOpen = ref(false);
const assignmentMenuOpen = ref(false);
const showBackToTop = ref(false);

// 检查资料完整性
const checkProfileCompleteness = async (userId) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('student_id, name')
    .eq('id', userId)
    .single();

  if (error || !data || !data.student_id || !data.name) {
    alert('您的个人信息不完整（学号或姓名缺失），请联系老师补充后再使用完整功能。');
  }
};

// 设置登录状态监听
const setupAuthListener = () => {
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session?.user) {
      checkProfileCompleteness(session.user.id);
    }
  });
};

function toggleMenu() {
  menuOpen.value = !menuOpen.value;
  // 关闭作业菜单当主菜单关闭时
  if (!menuOpen.value) {
    assignmentMenuOpen.value = false;
  }
}

function toggleAssignmentMenu() {
  assignmentMenuOpen.value = !assignmentMenuOpen.value;
}

function backToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}

function handleScroll() {
  showBackToTop.value = window.scrollY > 300;
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  setupAuthListener();
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style>
/* Global styles */
body {
  font-family:
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    Oxygen,
    Ubuntu,
    Cantarell,
    'Open Sans',
    'Helvetica Neue',
    sans-serif;
}

/* Transition animation */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
