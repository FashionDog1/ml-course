<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8 text-center">机器学习可视化</h1>
    
    <div class="flex flex-col gap-8">
      <!-- KNN Visualization -->
      <div class="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
        <div class="p-4 border-b border-gray-200">
          <h2 class="text-xl font-semibold">KNN Visualization</h2>
          <p class="text-gray-600 text-sm">KNN 算法可视化工具</p>
        </div>
        <div class="h-[800px]">
          <iframe 
            src="\ml-course\knn.html" 
            width="100%" 
            height="100%" 
            frameborder="0" 
            allowfullscreen
            @error="handleError('knn')"
          ></iframe>
        </div>
        <div v-if="errors.knn" class="p-4 bg-red-50 border-t border-red-200">
          <p class="text-red-600 text-sm">资源加载失败，请 <a href="\ml-course\knn.html" target="_blank" class="text-blue-600 underline">在新窗口打开</a></p>
        </div>
      </div>
      
      <!-- Logistic Regression Visualization -->
      <div class="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
        <div class="p-4 border-b border-gray-200">
          <h2 class="text-xl font-semibold">Logistic Regression Visualization</h2>
          <p class="text-gray-600 text-sm">逻辑回归可视化工具</p>
        </div>
        <div class="h-[530px]">
          <iframe 
            src="\ml-course\Logistic-Regression\Logistic-Regression.html" 
            width="100%" 
            height="100%" 
            frameborder="0" 
            allowfullscreen
            @error="handleError('logisticRegression')"
          ></iframe>
        </div>
        <div v-if="errors.logisticRegression" class="p-4 bg-red-50 border-t border-red-200">
          <p class="text-red-600 text-sm">资源加载失败，请 <a href="ml-course\Logistic-Regression\Logistic-Regression.html" target="_blank" class="text-blue-600 underline">在新窗口打开</a></p>
        </div>
      </div>
      
      <!-- KMeans Visualization -->
      <div class="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
        <div class="p-4 border-b border-gray-200">
          <h2 class="text-xl font-semibold">KMeans Visualization</h2>
          <p class="text-gray-600 text-sm">KMeans 算法可视化工具</p>
        </div>
        <div class="h-[550px]">
          <iframe 
            src="\ml-course\public\k-means\k-means.html" 
            width="100%" 
            height="100%" 
            frameborder="0" 
            allowfullscreen
            @error="handleError('kMeans')"
          ></iframe>
        </div>
        <div v-if="errors.kMeans" class="p-4 bg-red-50 border-t border-red-200">
          <p class="text-red-600 text-sm">资源加载失败，请 <a href="\ml-course\public\k-means\k-means.html" target="_blank" class="text-blue-600 underline">在新窗口打开</a></p>
        </div>
      </div>
      
      <!-- Google's Teachable Machine -->
      
    </div>
    
    <!-- Additional Resources -->
    <div class="mt-12">
      <h2 class="text-2xl font-bold mb-4">更多可视化资源</h2>
      <div class="bg-white rounded-lg shadow-md border border-gray-100 p-6">
        <ul class="space-y-3">
          <li>
            <a href="https://playground.tensorflow.org/" target="_blank" class="flex items-center text-blue-600 hover:text-blue-800">
              <span class="mr-2">🔗</span>
              <span>TensorFlow Playground - 交互式神经网络工具</span>
            </a>
          </li>
          <li>
            <a href="https://mlvisualized.com/" target="_blank" class="flex items-center text-blue-600 hover:text-blue-800">
              <span class="mr-2">🔗</span>
              <span>Machine Learning Visualized - 机器学习可视化</span>
            </a>
          </li>
          <li>
            <a href="https://poloclub.github.io/cnn-explainer/" target="_blank" class="flex items-center text-blue-600 hover:text-blue-800">
              <span class="mr-2">🔗</span>
              <span>CNN Explainer - 卷积神经网络专用可视化工具</span>
            </a>
          </li>
          <li>
            <a href="https://machinalearning.com/interactive/" target="_blank" class="flex items-center text-blue-600 hover:text-blue-800">
              <span class="mr-2">🔗</span>
              <span>MachinaLearning - 机器学习可视化</span>
            </a>
          </li>
          <li>
            <a href="https://www.naftaliharris.com/blog/visualizing-k-means-clustering/" target="_blank" class="flex items-center text-blue-600 hover:text-blue-800">
              <span class="mr-2">🔗</span>
              <span>K-means Clustering Visualization - K-Means 聚类分析可视化工具</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const errors = ref({
  tensorflow: false,
  cnn: false,
  distill: false,
  teachable: false
});

function handleError(key) {
  errors.value[key] = true;
}
</script>

<style scoped>
/* Visualization component styles */
</style>