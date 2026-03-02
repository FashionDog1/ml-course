<template>
  <div class="container mx-auto px-4 py-12">
    
    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-2xl p-12 mb-16 shadow-xl">
      <div class="max-w-4xl mx-auto text-center">
        <h1 class="text-4xl md:text-6xl font-bold mb-6 tracking-tight">机器学习课程</h1>
        <p class="text-xl md:text-2xl mb-8 opacity-90 max-w-2xl mx-auto">探索人工智能与机器学习的核心概念和应用，开启您的AI学习之旅</p>
        <div class="flex flex-wrap justify-center gap-6">
          <router-link to="/chapters/introduction" class="bg-white text-indigo-600 px-8 py-4 rounded-xl font-medium hover:bg-gray-50 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl">
            开始学习
          </router-link>
          <router-link to="/assignments" class="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-medium hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-1">
            作业提交
          </router-link>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="mb-20">
      <div class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-bold mb-4">课程特色</h2>
        <p class="text-gray-600 max-w-2xl mx-auto">我们的课程融合了理论与实践，为您提供全方位的机器学习学习体验</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="bg-white p-8 rounded-2xl shadow-md border border-gray-50 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2">
          <div class="bg-gradient-to-br from-indigo-100 to-purple-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
            <div class="text-indigo-600 text-4xl">📚</div>
          </div>
          <h3 class="text-xl font-semibold mb-3">丰富的学习内容</h3>
          <p class="text-gray-600 leading-relaxed">涵盖机器学习的核心概念、算法和应用，配有详细的讲解和示例，帮助您建立扎实的知识基础。</p>
        </div>
        <div class="bg-white p-8 rounded-2xl shadow-md border border-gray-50 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2">
          <div class="bg-gradient-to-br from-blue-100 to-cyan-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
            <div class="text-blue-600 text-4xl">🔬</div>
          </div>
          <h3 class="text-xl font-semibold mb-3">交互式可视化</h3>
          <p class="text-gray-600 leading-relaxed">通过TensorFlow Playground等工具，直观理解机器学习算法的工作原理，让抽象概念变得清晰易懂。</p>
        </div>
        <div class="bg-white p-8 rounded-2xl shadow-md border border-gray-50 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2">
          <div class="bg-gradient-to-br from-pink-100 to-red-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
            <div class="text-pink-600 text-4xl">💬</div>
          </div>
          <h3 class="text-xl font-semibold mb-3">师生互动</h3>
          <p class="text-gray-600 leading-relaxed">集成Giscus评论系统，方便学生在每节课下留言讨论，促进师生交流，营造活跃的学习社区。</p>
        </div>
      </div>
    </section>

    <!-- Course Outline -->
    <section class="mb-20">
      <div class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-bold mb-4">课程大纲</h2>
        <p class="text-gray-600 max-w-2xl mx-auto">循序渐进的课程设计，帮助您从基础到进阶，全面掌握机器学习知识</p>
      </div>
      <div class="bg-white rounded-2xl shadow-md border border-gray-50 overflow-hidden">
        <div class="divide-y divide-gray-100">
          <div class="p-6 hover:bg-gray-50 transition-colors duration-300">
            <h3 class="text-lg font-semibold flex items-center">
              <span class="bg-gradient-to-r from-indigo-500 to-purple-500 text-white w-10 h-10 rounded-full flex items-center justify-center mr-4 shadow-sm">1</span>
              机器学习基础
            </h3>
            <p class="text-gray-600 ml-14 mt-2">介绍机器学习的基本概念、分类和应用场景，为后续学习奠定基础。</p>
          </div>
          <div class="p-6 hover:bg-gray-50 transition-colors duration-300">
            <h3 class="text-lg font-semibold flex items-center">
              <span class="bg-gradient-to-r from-indigo-500 to-purple-500 text-white w-10 h-10 rounded-full flex items-center justify-center mr-4 shadow-sm">2</span>
              线性回归
            </h3>
            <p class="text-gray-600 ml-14 mt-2">学习线性回归算法的原理和实现，掌握基本的回归分析方法。</p>
          </div>
          <div class="p-6 hover:bg-gray-50 transition-colors duration-300">
            <h3 class="text-lg font-semibold flex items-center">
              <span class="bg-gradient-to-r from-indigo-500 to-purple-500 text-white w-10 h-10 rounded-full flex items-center justify-center mr-4 shadow-sm">3</span>
              分类算法
            </h3>
            <p class="text-gray-600 ml-14 mt-2">了解逻辑回归、决策树等分类算法，掌握分类问题的解决方法。</p>
          </div>
          <div class="p-6 hover:bg-gray-50 transition-colors duration-300">
            <h3 class="text-lg font-semibold flex items-center">
              <span class="bg-gradient-to-r from-indigo-500 to-purple-500 text-white w-10 h-10 rounded-full flex items-center justify-center mr-4 shadow-sm">4</span>
              神经网络
            </h3>
            <p class="text-gray-600 ml-14 mt-2">探索神经网络的基本结构和工作原理，为深度学习学习做准备。</p>
          </div>
          <div class="p-6 hover:bg-gray-50 transition-colors duration-300">
            <h3 class="text-lg font-semibold flex items-center">
              <span class="bg-gradient-to-r from-indigo-500 to-purple-500 text-white w-10 h-10 rounded-full flex items-center justify-center mr-4 shadow-sm">5</span>
              深度学习
            </h3>
            <p class="text-gray-600 ml-14 mt-2">深入学习深度学习的高级概念和应用，掌握现代AI技术。</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-12 text-center shadow-sm">
      <h2 class="text-3xl md:text-4xl font-bold mb-4">准备好开始学习了吗？</h2>
      <p class="text-gray-600 mb-8 max-w-2xl mx-auto">加入我们的机器学习课程，开启您的AI之旅，探索人工智能的无限可能</p>
      <router-link to="/chapters/introduction" class="bg-black text-white px-10 py-4 rounded-xl font-medium hover:bg-gray-800 transition-all duration-300 transform hover:-translate-y-1 shadow-lg inline-block">
        开始学习
      </router-link>
    </section>
  </div>
</template>

<script setup>
// Home component logic
</script>

<style scoped>
/* Home component styles */
</style>