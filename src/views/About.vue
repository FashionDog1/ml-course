<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-8 text-center">关于课程</h1>
      
      <!-- Course Introduction -->
      <div class="bg-white rounded-lg shadow-md border border-gray-100 p-6 mb-8">
        <h2 class="text-2xl font-bold mb-4">课程介绍</h2>
        <p class="text-gray-700 mb-4">
          本课程旨在介绍机器学习的核心概念、算法和应用，帮助学生建立扎实的机器学习基础。通过理论学习和实践操作，学生将掌握机器学习的基本原理和常用算法，并能够应用这些知识解决实际问题。
        </p>
        <p class="text-gray-700 mb-4">
          课程内容涵盖机器学习基础、线性回归、分类算法、神经网络和深度学习等主题，适合对人工智能和机器学习感兴趣的学生。
        </p>
        <div class="mt-6">
          <h3 class="text-lg font-semibold mb-2">课程目标</h3>
          <ul class="list-disc pl-6 space-y-2 text-gray-700">
            <li>理解机器学习的基本概念和原理</li>
            <li>掌握常用的机器学习算法</li>
            <li>能够应用机器学习技术解决实际问题</li>
            <li>了解深度学习的基本原理和应用</li>
          </ul>
        </div>
      </div>
      
      <!-- Instructor Info -->
      <div class="bg-white rounded-lg shadow-md border border-gray-100 p-6 mb-8">
        <h2 class="text-2xl font-bold mb-4">授课教师</h2>
        <div class="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div class="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
            <span class="text-4xl">👨‍🏫</span>
          </div>
          <div>
            <h3 class="text-xl font-semibold">F教授</h3>
            <p class="text-gray-600 mb-2">计算机科学与技术</p>
            <p class="text-gray-700 mb-4">
              大四待业。
            </p>
            <div class="flex space-x-4">
              <a href="1290883283@qq.com" class="text-blue-600 hover:text-blue-800 flex items-center">
                <span class="mr-1">📧</span> 发送邮件
              </a>
              <a href="https://github.com/FashionDog1/ml-course" target="_blank" class="text-blue-600 hover:text-blue-800 flex items-center">
                <span class="mr-1">💻</span> GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Contact Info -->
      <div class="bg-white rounded-lg shadow-md border border-gray-100 p-6">
        <h2 class="text-2xl font-bold mb-4">联系方式</h2>
        <div class="space-y-4">
          <div class="flex items-center">
            <span class="w-12 text-gray-500">🏫</span>
            <span class="text-gray-700">男寝101</span>
          </div>
          <div class="flex items-center">
            <span class="w-12 text-gray-500">📧</span>
            <span class="text-gray-700">1290883283@qq.com</span>
          </div>
          <div class="flex items-center">
            <span class="w-12 text-gray-500">🕒</span>
            <span class="text-gray-700">随时待命</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// About component logic
</script>

<style scoped>
/* About component styles */
</style>