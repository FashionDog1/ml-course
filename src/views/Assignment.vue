<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-6">作业提交</h1>
      
      <div class="bg-white rounded-lg shadow-md border border-gray-100 p-6">
        <form @submit.prevent="submitAssignment" class="space-y-6">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">姓名</label>
            <input 
              type="text" 
              id="name" 
              v-model="form.name" 
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
          </div>
          
          <div>
            <label for="studentId" class="block text-sm font-medium text-gray-700 mb-1">学号</label>
            <input 
              type="text" 
              id="studentId" 
              v-model="form.studentId" 
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
          </div>
          
          <div>
            <label for="content" class="block text-sm font-medium text-gray-700 mb-1">作业内容</label>
            <textarea 
              id="content" 
              v-model="form.content" 
              rows="4" 
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="请输入作业内容或描述"
            ></textarea>
          </div>
          
          <div>
            <label for="attachment" class="block text-sm font-medium text-gray-700 mb-1">附件</label>
            <input 
              type="file" 
              id="attachment" 
              @change="handleFileChange" 
              class="w-full px-4 py-2 border border-gray-300 rounded-lg"
              accept=".pdf,.doc,.docx"
            >
            <p v-if="file" class="text-sm text-gray-600 mt-1">已选择文件: {{ file.name }}</p>
          </div>
          
          <div>
            <label for="attachmentUrl" class="block text-sm font-medium text-gray-700 mb-1">或输入附件链接</label>
            <input 
              type="url" 
              id="attachmentUrl" 
              v-model="form.attachmentUrl" 
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="例如：https://drive.google.com/file/d/12345/view"
            >
          </div>
          
          <div class="flex items-center justify-between">
            <button 
              type="submit" 
              class="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              :disabled="isSubmitting"
            >
              <span v-if="isSubmitting">提交中...</span>
              <span v-else>提交作业</span>
            </button>
            
            <div v-if="success" class="text-green-600 font-medium">
              作业提交成功！
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { supabase } from '../supabase';

const form = ref({
  name: '',
  studentId: '',
  content: '',
  attachmentUrl: ''
});

const file = ref(null);
const isSubmitting = ref(false);
const success = ref(false);

function handleFileChange(event) {
  const selectedFile = event.target.files[0];
  if (selectedFile) {
    if (validateFile(selectedFile)) {
      file.value = selectedFile;
    } else {
      alert('不支持的文件类型，请上传PDF或Word文档');
      file.value = null;
      event.target.value = '';
    }
  }
}

function validateFile(file) {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  return allowedTypes.includes(file.type);
}

function generateSafeFileName(originalName) {
  // 生成随机字符串
  const randomString = Math.random().toString(36).substring(2, 10);
  // 获取文件扩展名
  const extension = originalName.split('.').pop();
  // 生成安全文件名
  return `${Date.now()}_${randomString}.${extension}`;
}

async function uploadFile(file) {
  try {
    const safeFileName = generateSafeFileName(file.name);
    const { data, error } = await supabase
      .storage
      .from('assignments')
      .upload(safeFileName, file);
    
    if (error) {
      console.error('上传文件失败:', error);
      return null;
    }
    
    const { data: urlData } = supabase
      .storage
      .from('assignments')
      .getPublicUrl(data.path);
    
    return {
      url: urlData.publicUrl,
      originalName: file.name
    };
  } catch (error) {
    console.error('上传文件失败:', error);
    return null;
  }
}

async function submitAssignment() {
  isSubmitting.value = true;
  success.value = false;
  
  try {
    let attachmentUrl = form.value.attachmentUrl;
    let originalName = null;
    
    if (file.value) {
      const uploadResult = await uploadFile(file.value);
      if (uploadResult) {
        attachmentUrl = uploadResult.url;
        originalName = uploadResult.originalName;
      }
    }
    
    const { data, error } = await supabase
      .from('assignments')
      .insert([{
        name: form.value.name,
        student_id: form.value.studentId,
        content: form.value.content,
        attachment_url: attachmentUrl,
        original_name: originalName
      }]);
    
    if (error) {
      console.error('提交作业失败:', error);
      alert('提交作业失败，请稍后重试');
      return;
    }
    
    success.value = true;
    
    // 重置表单
    form.value = {
      name: '',
      studentId: '',
      content: '',
      attachmentUrl: ''
    };
    file.value = null;
    
    // 3秒后清除成功提示
    setTimeout(() => {
      success.value = false;
    }, 3000);
  } catch (error) {
    console.error('提交作业失败:', error);
    alert('提交作业失败，请稍后重试');
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<style scoped>
/* Assignment component styles */
</style>