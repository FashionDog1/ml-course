<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold">理论作业提交</h1>
        <router-link 
          to="/github-assignments" 
          class="text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-1"
        >
          <span>切换至编程作业</span>
          <span>→</span>
        </router-link>
      </div>
      
      <!-- 未登录提示 -->
      <div v-if="!user" class="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <p class="text-yellow-800 mb-4">请先使用 GitHub 账号登录，以便提交作业。</p>
        <button 
          @click="login" 
          class="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition"
        >
          使用 GitHub 登录
        </button>
      </div>

      <!-- 已登录但未完善资料 -->
      <div v-else-if="!profile.student_id || !profile.name" class="bg-red-50 border border-red-200 rounded-lg p-6">
        <p class="text-red-800">您的账户信息不完整，请联系老师补充学号和姓名后再提交作业。</p>
      </div>

      <!-- 已登录且资料完整 -->
      <div v-else class="bg-white rounded-lg shadow-md border border-gray-100 p-6">
        <!-- 显示用户信息（只读） -->
        <div class="bg-gray-50 rounded-lg p-4 mb-6">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <span class="text-sm text-gray-500">姓名</span>
              <p class="font-medium">{{ profile.name }}</p>
            </div>
            <div>
              <span class="text-sm text-gray-500">学号</span>
              <p class="font-medium">{{ profile.student_id }}</p>
            </div>
          </div>
        </div>

        <form @submit.prevent="submitAssignment" class="space-y-6">
          <div>
            <label for="content" class="block text-sm font-medium text-gray-700 mb-1">作业内容</label>
            <textarea 
              id="content" 
              v-model="form.content" 
              rows="4" 
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="请输入作业内容或描述"
              required
            ></textarea>
          </div>
          
          <div>
            <label for="attachment" class="block text-sm font-medium text-gray-700 mb-1">附件</label>
            <input 
              type="file" 
              id="attachment" 
              @change="handleFileChange" 
              class="w-full px-4 py-2 border border-gray-300 rounded-lg"
              accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.zip,.rar,.txt"
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
            <div v-if="errorMsg" class="text-red-600 font-medium">
              {{ errorMsg }}
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from '../supabase';
import { validateInput } from '../utils/xss';
import { checkSubmitRateLimit } from '../utils/rateLimit';

// 用户状态
const user = ref(null);
const profile = ref({ student_id: '', name: '' });
const loadingProfile = ref(true);

// 表单数据
const form = ref({
  content: '',
  attachmentUrl: ''
});
const file = ref(null);
const isSubmitting = ref(false);
const success = ref(false);
const errorMsg = ref('');

// 登录函数
const login = async () => {
  await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: { redirectTo: window.location.href }
  });
};

// 获取当前用户的 profile
const fetchProfile = async (userId) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('student_id, name')
    .eq('id', userId)
    .maybeSingle();
  
  if (error) {
    console.error('获取用户资料失败:', error);
    profile.value = { student_id: '', name: '' };
  } else if (data) {
    profile.value = data;
  } else {
    profile.value = { student_id: '', name: '' };
  }
  loadingProfile.value = false;
};

// 文件处理
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
    // 文档类
    'application/pdf',
    'application/msword',                                      // .doc
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    // 演示文稿
    'application/vnd.ms-powerpoint',                           // .ppt
    'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
    // 表格
    'application/vnd.ms-excel',                                // .xls
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    // 图片
    'image/jpeg',
    'image/png',
    'image/gif',
    // 压缩包
    'application/zip',
    'application/x-rar-compressed',
    // 文本
    'text/plain'
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

// 提交作业（调用 Edge Function）
async function submitAssignment() {
  isSubmitting.value = true;
  success.value = false;
  errorMsg.value = '';
  
  try {
    // 1. 获取当前 session 和 token
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      errorMsg.value = '请先登录';
      isSubmitting.value = false;
      return;
    }
    
    // 2. 检查速率限制
    try {
      checkSubmitRateLimit(session.user.id, 'submit_assignment', profile.value.role || 'student');
    } catch (error) {
      errorMsg.value = error.message;
      isSubmitting.value = false;
      return;
    }
    
    const accessToken = session.access_token;
  
    let attachmentUrl = form.value.attachmentUrl;
    let originalName = null;
    // 如果有文件上传，先上传到 Storage
    if (file.value) {
      const uploadResult = await uploadFile(file.value);
      if (uploadResult) {
        attachmentUrl = uploadResult.url;
        originalName = uploadResult.originalName;
      } else {
        errorMsg.value = '文件上传失败，请重试';
        isSubmitting.value = false;
        return;
      }
    }

    // 调用 Edge Function
    const response = await fetch(
      'https://mureufpzatpigcetrkts.supabase.co/functions/v1/submit-theory-assignment',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          content: validateInput(form.value.content),
          attachment_url: attachmentUrl || null,
          original_name: originalName || ''
        })
      }
    );

    // 解析响应
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || `HTTP ${response.status}`);
    }
    if (!data.success) {
      throw new Error(data.error || '提交失败');
    }
    
    success.value = true;
    
    // 重置表单
    form.value = {
      content: '',
      attachmentUrl: ''
    };
    file.value = null;
    // 清空文件选择框
    const fileInput = document.getElementById('attachment');
    if (fileInput) fileInput.value = '';
    
    // 3秒后清除成功提示
    setTimeout(() => {
      success.value = false;
    }, 3000);
  } catch (err) {
    console.error('提交作业失败:', err);
    errorMsg.value = err.message || '提交失败，请稍后重试';
  } finally {
    isSubmitting.value = false;
  }
}

// 初始化：检查登录状态并获取用户资料
onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession();
  user.value = session?.user || null;
  if (user.value) {
    await fetchProfile(user.value.id);
  } else {
    loadingProfile.value = false;
  }
  
  // 监听登录状态变化（例如登录后页面刷新）
  supabase.auth.onAuthStateChange(async (_event, session) => {
    user.value = session?.user || null;
    if (user.value) {
      await fetchProfile(user.value.id);
    } else {
      profile.value = { student_id: '', name: '' };
    }
  });
});
</script>