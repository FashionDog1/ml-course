<template>
  <div class="container mx-auto px-4 py-12">
    <!-- Hero 区域 -->
    <section class="bg-blue-500 text-white rounded-xl p-6 sm:p-12 mb-16 shadow-sm relative overflow-hidden">
      <div class="absolute inset-0 bg-cover bg-center opacity-20" style="background-image: url('img/hero.png');"></div>
      <div class="max-w-4xl mx-auto text-center">
        <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 tracking-tight">
          机器学习课程
        </h1>
        <p class="text-base sm:text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
          一站式学习平台：课程内容、作业提交、教学资料、可视化演示、师生讨论
        </p>
        <div class="flex flex-wrap justify-center gap-4 sm:gap-6">
          <router-link
            to="/chapters"
            class="bg-white text-blue-600 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-medium hover:bg-gray-50 transition duration-200"
          >
            开始学习
          </router-link>
          <router-link
            to="/assignments"
            class="bg-transparent border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-medium hover:bg-white/10 transition duration-200"
          >
            作业提交
          </router-link>
        </div>
      </div>
    </section>

    <!-- 功能卡片区（6个核心模块） -->
    <section class="mb-20">
      <div class="text-center mb-12">
        <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">平台功能</h2>
        <p class="text-gray-600 max-w-2xl mx-auto">
          从学习到实践，从交流到反馈，全方位支持您的机器学习学习之旅
        </p>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- 课程内容 -->
        <div class="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-sm transition">
          <div class="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
            <span class="text-blue-600 text-2xl">📖</span>
          </div>
          <h3 class="text-lg font-semibold mb-2">系统化课程内容</h3>
          <p class="text-gray-600 text-sm leading-relaxed">
            结构化的章节设计，Markdown 格式呈现，支持数学公式和代码高亮，每个章节底部集成 Giscus 讨论区。
          </p>
          <router-link to="/chapters" class="text-blue-600 text-sm font-medium mt-3 inline-block hover:underline">
            浏览课程 →
          </router-link>
        </div>
        <!-- 理论作业 -->
        <div class="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-sm transition">
          <div class="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
            <span class="text-blue-600 text-2xl">📝</span>
          </div>
          <h3 class="text-lg font-semibold mb-2">理论作业提交</h3>
          <p class="text-gray-600 text-sm leading-relaxed">
            在线提交作业内容与附件（支持多种格式），支持覆盖未批改记录，教师可在线批改并给与评语。
          </p>
          <router-link to="/assignments" class="text-blue-600 text-sm font-medium mt-3 inline-block hover:underline">
            提交作业 →
          </router-link>
        </div>
        <!-- 编程作业 -->
        <div class="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-sm transition">
          <div class="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
            <span class="text-blue-600 text-2xl">💻</span>
          </div>
          <h3 class="text-lg font-semibold mb-2">编程作业（GitHub Classroom）</h3>
          <p class="text-gray-600 text-sm leading-relaxed">
            集成 GitHub Classroom，学生接受作业邀请、克隆仓库、提交代码，自动评分，教师在线批改。
          </p>
          <router-link to="/github-assignments" class="text-blue-600 text-sm font-medium mt-3 inline-block hover:underline">
            查看作业 →
          </router-link>
        </div>
        <!-- 作业提交记录 -->
        <div class="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-sm transition">
          <div class="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
            <span class="text-blue-600 text-2xl">📊</span>
          </div>
          <h3 class="text-lg font-semibold mb-2">作业提交记录</h3>
          <p class="text-gray-600 text-sm leading-relaxed">
            统一查看编程作业和理论作业的提交记录、成绩与教师评语，支持分页和“查看全部”，教师端可查看所有学生提交。
          </p>
          <router-link to="/my-submissions" class="text-blue-600 text-sm font-medium mt-3 inline-block hover:underline">
            查看记录 →
          </router-link>
        </div>
        <!-- 教学资料 -->
        <div class="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-sm transition">
          <div class="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
            <span class="text-blue-600 text-2xl">📚</span>
          </div>
          <h3 class="text-lg font-semibold mb-2">教学资料共享</h3>
          <p class="text-gray-600 text-sm leading-relaxed">
            教师可发布课件、参考资料（支持附件），学生可在线查看或下载，支持资料置顶和删除。
          </p>
          <router-link to="/teacher-materials" class="text-blue-600 text-sm font-medium mt-3 inline-block hover:underline">
            浏览资料 →
          </router-link>
        </div>
        <!-- 可视化演示 -->
        <div class="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-sm transition">
          <div class="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
            <span class="text-blue-600 text-2xl">🔬</span>
          </div>
          <h3 class="text-lg font-semibold mb-2">交互式可视化</h3>
          <p class="text-gray-600 text-sm leading-relaxed">
            嵌入 TensorFlow Playground 等工具，直观理解算法原理，帮助将抽象概念可视化。
          </p>
          <router-link to="/visualization" class="text-blue-600 text-sm font-medium mt-3 inline-block hover:underline">
            体验可视化 →
          </router-link>
        </div>
      </div>
    </section>

    <!-- 课程大纲简表（保留但精简） -->
    <section class="mb-20">
      <div class="text-center mb-12">
        <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">课程大纲</h2>
        <p class="text-gray-600 max-w-2xl mx-auto">
          从基础到进阶，系统化掌握机器学习核心知识
        </p>
      </div>
      <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div class="divide-y divide-gray-100">
          <div class="p-4 hover:bg-gray-50 transition-colors">
            <h3 class="text-base font-semibold flex items-center">
              <span class="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center mr-3 text-xs">1</span>
              机器学习简介
            </h3>
          </div>
          <div class="p-4 hover:bg-gray-50 transition-colors">
            <h3 class="text-base font-semibold flex items-center">
              <span class="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center mr-3 text-xs">2</span>
              线性回归
            </h3>
          </div>
          <div class="p-4 hover:bg-gray-50 transition-colors">
            <h3 class="text-base font-semibold flex items-center">
              <span class="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center mr-3 text-xs">3</span>
              Logistic回归
            </h3>
          </div>
          <div class="p-4 hover:bg-gray-50 transition-colors">
            <h3 class="text-base font-semibold flex items-center">
              <span class="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center mr-3 text-xs">4</span>
              SVM
            </h3>
          </div>
          <div class="p-4 hover:bg-gray-50 transition-colors">
            <h3 class="text-base font-semibold flex items-center">
              <span class="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center mr-3 text-xs">5</span>
              生成式分类器
            </h3>
          </div>
        </div>
        <div class="p-4 text-center border-t border-gray-100">
          <router-link to="/chapters" class="text-blue-600 text-sm font-medium hover:underline">查看完整大纲 →</router-link>
        </div>
      </div>
    </section>

    <!-- 讨论区入口 / CTA -->
    <section class="bg-gray-50 rounded-lg border border-gray-200 p-6 sm:p-10 text-center">
      <h2 class="text-2xl font-bold mb-3">有疑问？参与讨论</h2>
      <p class="text-gray-600 mb-6 max-w-lg mx-auto">
        每节课下方集成 Giscus 评论系统，使用 GitHub 账号即可参与讨论，与老师和同学互动交流。
      </p>
      <router-link
        to="/chapters"
        class="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
      >
        开始学习并参与讨论
      </router-link>
    </section>
  </div>
</template>