<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-md">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center">
            <router-link to="/" class="flex items-center space-x-2">
              <span class="text-blue-600 text-2xl">🤖</span>
              <span class="font-bold text-xl">机器学习课程</span>
            </router-link>
          </div>
          
          <!-- Desktop Navigation -->
          <div class="hidden md:flex space-x-8">
            <router-link to="/" class="text-gray-700 hover:text-blue-600 font-medium">首页</router-link>
            <router-link to="/chapters/introduction" class="text-gray-700 hover:text-blue-600 font-medium">课程章节</router-link>
            <router-link to="/assignments" class="text-gray-700 hover:text-blue-600 font-medium">作业提交</router-link>
            <router-link to="/visualization" class="text-gray-700 hover:text-blue-600 font-medium">可视化</router-link>
            <router-link to="/about" class="text-gray-700 hover:text-blue-600 font-medium">关于</router-link>
          </div>
          
          <!-- Mobile Navigation Button -->
          <div class="md:hidden">
            <button @click="toggleMenu" class="text-gray-700 hover:text-blue-600">
              <span class="text-xl">☰</span>
            </button>
          </div>
        </div>
        
        <!-- Mobile Navigation Menu -->
        <div v-if="menuOpen" class="md:hidden py-4 space-y-2">
          <router-link to="/" class="block text-gray-700 hover:text-blue-600 font-medium py-2">首页</router-link>
          <router-link to="/chapters/introduction" class="block text-gray-700 hover:text-blue-600 font-medium py-2">课程章节</router-link>
          <router-link to="/assignments" class="block text-gray-700 hover:text-blue-600 font-medium py-2">作业提交</router-link>
          <router-link to="/visualization" class="block text-gray-700 hover:text-blue-600 font-medium py-2">可视化</router-link>
          <router-link to="/about" class="block text-gray-700 hover:text-blue-600 font-medium py-2">关于</router-link>
        </div>
      </div>
    </nav>
    
    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    
    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200 mt-12">
      <div class="container mx-auto px-4 py-8">
        <div class="text-center text-gray-600">
          <p>© 2026 机器学习课程. 保留所有权利.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const menuOpen = ref(false);

function toggleMenu() {
  menuOpen.value = !menuOpen.value;
}
</script>

<style>
/* Global styles */
body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
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
