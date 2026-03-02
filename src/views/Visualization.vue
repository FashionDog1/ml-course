<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8 text-center">机器学习可视化</h1>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- TensorFlow Playground -->
      <div class="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
        <div class="p-4 border-b border-gray-200">
          <h2 class="text-xl font-semibold">TensorFlow Playground</h2>
          <p class="text-gray-600 text-sm">交互式神经网络可视化工具</p>
        </div>
        <div class="h-96">
          <iframe 
            src="https://playground.tensorflow.org/" 
            width="100%" 
            height="100%" 
            frameborder="0" 
            allowfullscreen
            @error="handleError('tensorflow')"
          ></iframe>
        </div>
        <div v-if="errors.tensorflow" class="p-4 bg-red-50 border-t border-red-200">
          <p class="text-red-600 text-sm">资源加载失败，请 <a href="https://playground.tensorflow.org/" target="_blank" class="text-blue-600 underline">在新窗口打开</a></p>
        </div>
      </div>
      
      <!-- CNN Explainer -->
      <div class="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
        <div class="p-4 border-b border-gray-200">
          <h2 class="text-xl font-semibold">CNN Explainer</h2>
          <p class="text-gray-600 text-sm">卷积神经网络可视化工具</p>
        </div>
        <div class="h-96">
          <iframe 
            src="https://poloclub.github.io/cnn-explainer/" 
            width="100%" 
            height="100%" 
            frameborder="0" 
            allowfullscreen
            @error="handleError('cnn')"
          ></iframe>
        </div>
        <div v-if="errors.cnn" class="p-4 bg-red-50 border-t border-red-200">
          <p class="text-red-600 text-sm">资源加载失败，请 <a href="https://poloclub.github.io/cnn-explainer/" target="_blank" class="text-blue-600 underline">在新窗口打开</a></p>
        </div>
      </div>
      
      <!-- Distill.pub -->
      <div class="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
        <div class="p-4 border-b border-gray-200">
          <h2 class="text-xl font-semibold">Neural Networks, Manifolds, and Topology</h2>
          <p class="text-gray-600 text-sm">神经网络拓扑可视化</p>
        </div>
        <div class="h-96">
          <iframe 
            src="https://distill.pub/2018/neural-networks-manifolds-topology/" 
            width="100%" 
            height="100%" 
            frameborder="0" 
            allowfullscreen
            @error="handleError('distill')"
          ></iframe>
        </div>
        <div v-if="errors.distill" class="p-4 bg-red-50 border-t border-red-200">
          <p class="text-red-600 text-sm">资源加载失败，请 <a href="https://distill.pub/2018/neural-networks-manifolds-topology/" target="_blank" class="text-blue-600 underline">在新窗口打开</a></p>
        </div>
      </div>
      
      <!-- Google's Teachable Machine -->
      <div class="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
        <div class="p-4 border-b border-gray-200">
          <h2 class="text-xl font-semibold">Google's Teachable Machine</h2>
          <p class="text-gray-600 text-sm">无需编码的机器学习模型训练工具</p>
        </div>
        <div class="h-96">
          <iframe 
            src="https://teachablemachine.withgoogle.com/" 
            width="100%" 
            height="100%" 
            frameborder="0" 
            allowfullscreen
            @error="handleError('teachable')"
          ></iframe>
        </div>
        <div v-if="errors.teachable" class="p-4 bg-red-50 border-t border-red-200">
          <p class="text-red-600 text-sm">资源加载失败，请 <a href="https://teachablemachine.withgoogle.com/" target="_blank" class="text-blue-600 underline">在新窗口打开</a></p>
        </div>
      </div>
    </div>
    
    <!-- Additional Resources -->
    <div class="mt-12">
      <h2 class="text-2xl font-bold mb-4">更多可视化资源</h2>
      <div class="bg-white rounded-lg shadow-md border border-gray-100 p-6">
        <ul class="space-y-3">
          <li>
            <a href="https://www.cs.cmu.edu/~aharley/vis/" target="_blank" class="flex items-center text-blue-600 hover:text-blue-800">
              <span class="mr-2">🔗</span>
              <span>ConvNetJS - 浏览器中的神经网络可视化</span>
            </a>
          </li>
          <li>
            <a href="https://www.tensorflow.org/tensorboard" target="_blank" class="flex items-center text-blue-600 hover:text-blue-800">
              <span class="mr-2">🔗</span>
              <span>TensorBoard - TensorFlow的可视化工具</span>
            </a>
          </li>
          <li>
            <a href="https://distill.pub/" target="_blank" class="flex items-center text-blue-600 hover:text-blue-800">
              <span class="mr-2">🔗</span>
              <span>Distill - 机器学习可视化研究</span>
            </a>
          </li>
          <li>
            <a href="https://nnviz.org/" target="_blank" class="flex items-center text-blue-600 hover:text-blue-800">
              <span class="mr-2">🔗</span>
              <span>NNViz - 神经网络可视化工具</span>
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