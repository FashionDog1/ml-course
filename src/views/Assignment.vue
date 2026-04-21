<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold">
          理论作业提交
        </h1>
        <router-link
          to="/github-assignments"
          class="text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-1"
        >
          <span>切换至编程作业</span>
          <span>→</span>
        </router-link>
      </div>

      <!-- 未登录提示 -->
      <div
        v-if="!user"
        class="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center"
      >
        <p class="text-yellow-800 mb-4">
          请先使用 GitHub 账号登录，以便提交作业。
        </p>
        <button
          class="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition"
          @click="login"
        >
          使用 GitHub 登录
        </button>
      </div>

      <!-- 已登录但未完善资料 -->
      <div
        v-else-if="!profile.student_id || !profile.name"
        class="bg-red-50 border border-red-200 rounded-lg p-6"
      >
        <p class="text-red-800">
          您的账户信息不完整，请联系老师补充学号和姓名后再提交作业。
        </p>
      </div>

      <!-- 已登录且资料完整 -->
      <div
        v-else
        class="bg-white rounded-lg shadow-md border border-gray-100 p-6"
      >
        <!-- 显示用户信息（只读） -->
        <div class="bg-gray-50 rounded-lg p-4 mb-6">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <span class="text-sm text-gray-500">姓名</span>
              <p class="font-medium">
                {{ profile.name }}
              </p>
            </div>
            <div>
              <span class="text-sm text-gray-500">学号</span>
              <p class="font-medium">
                {{ profile.student_id }}
              </p>
            </div>
          </div>
        </div>

        <form
          class="space-y-6"
          @submit.prevent="openSubmissionModal"
        >
          <div>
            <label
              for="content"
              class="block text-sm font-medium text-gray-700 mb-1"
            >作业内容</label>
            <textarea
              id="content"
              v-model="form.content"
              rows="4"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="请输入作业内容或描述"
              required
            />
          </div>

          <div>
            <label
              for="attachment"
              class="block text-sm font-medium text-gray-700 mb-1"
            >附件</label>
            <input
              id="attachment"
              type="file"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg"
              accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.zip,.rar,.txt"
              @change="handleFileChange"
            >
            <p
              v-if="file"
              class="text-sm text-gray-600 mt-1"
            >
              已选择文件: {{ file.name }}
            </p>
          </div>

          <div>
            <label
              for="attachmentUrl"
              class="block text-sm font-medium text-gray-700 mb-1"
            >或输入附件链接</label>
            <input
              id="attachmentUrl"
              v-model="form.attachmentUrl"
              type="url"
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

            <div
              v-if="success"
              class="text-green-600 font-medium"
            >
              作业提交成功！
            </div>
            <div
              v-if="errorMsg"
              class="text-red-600 font-medium"
            >
              {{ errorMsg }}
            </div>
          </div>
        </form>
      </div>
    </div>

    <!-- 覆盖提交模态框 -->
    <div
      v-if="showOverrideModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="closeOverrideModal"
    >
      <div class="bg-white rounded-xl shadow-xl p-6 w-96 max-w-full">
        <h3 class="text-xl font-bold mb-4">
          提交选项
        </h3>
        <p class="text-gray-600 mb-4">
          您可以选择直接提交新作业，或覆盖已有的未批改作业。
        </p>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">选择要覆盖的提交记录（可选）</label>
          <select
            v-model="selectedSubmissionId"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">
              -- 不覆盖，直接提交 --
            </option>
            <option
              v-for="submission in ungradedSubmissions"
              :key="submission.id"
              :value="submission.id"
            >
              {{ formatDate(submission.submitted_at) }} - {{ submission.content.substring(0, 30) }}{{ submission.content.length > 30 ? '...' : '' }}
            </option>
          </select>
          <p
            v-if="ungradedSubmissions.length === 0"
            class="text-xs text-gray-500 mt-1"
          >
            暂无未批改记录，只能直接提交新作业。
          </p>
        </div>
        <div class="flex justify-end gap-3 mt-6">
          <button
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            @click="handleDirectSubmit"
          >
            直接提交
          </button>
          <button
            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            :disabled="!selectedSubmissionId"
            @click="handleOverrideSubmit"
          >
            确认覆盖
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * 理论作业提交页面
 * 支持文本+附件提交，用户可选择直接新增或覆盖未批改的已有记录
 * @component
 */
import { ref, onMounted } from 'vue';
import { supabase } from '../supabase';
import { validateInput } from '../utils/xss';
import { checkSubmitRateLimit } from '../utils/rateLimit';

/** @type {import('vue').Ref<null|Object>} 当前登录用户 */
const user = ref(null);

/** @type {import('vue').Ref<{student_id: string, name: string}>} 用户资料 */
const profile = ref({ student_id: '', name: '' });

/** @type {import('vue').Ref<boolean>} 是否正在加载用户资料 */
const loadingProfile = ref(true);

/** @type {import('vue').Ref<{content: string, attachmentUrl: string}>} 表单数据 */
const form = ref({
  content: '',
  attachmentUrl: '',
});

/** @type {import('vue').Ref<null|File>} 选择的文件 */
const file = ref(null);

/** @type {import('vue').Ref<boolean>} 是否正在提交 */
const isSubmitting = ref(false);

/** @type {import('vue').Ref<boolean>} 提交成功标志 */
const success = ref(false);

/** @type {import('vue').Ref<string>} 错误信息 */
const errorMsg = ref('');

/** @type {import('vue').Ref<boolean>} 是否显示覆盖提交模态框 */
const showOverrideModal = ref(false);

/** @type {import('vue').Ref<Array>} 未批改的作业提交记录 */
const ungradedSubmissions = ref([]);

/** @type {import('vue').Ref<string>} 选择的要覆盖的提交记录ID */
const selectedSubmissionId = ref('');

/**
 * 处理 GitHub OAuth 登录
 * 跳转到 GitHub 授权页面
 * @returns {Promise<void>}
 */
const login = async () => {
  await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: { redirectTo: window.location.href },
  });
};

/**
 * 获取用户资料
 * @param {string} userId - 用户ID
 * @returns {Promise<void>}
 */
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

/**
 * 处理文件选择变化
 * 验证文件类型并更新状态
 * @param {Event} event - 文件选择事件
 */
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

/**
 * 验证文件类型是否允许上传
 * @param {File} file - 要验证的文件
 * @returns {boolean} 文件是否有效
 */
function validateFile(file) {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/zip',
    'application/x-rar-compressed',
    'text/plain',
  ];
  return allowedTypes.includes(file.type);
}

/**
 * 格式化日期为本地字符串
 * @param {string} dateStr - ISO格式的日期字符串
 * @returns {string} 格式化的日期字符串
 */
const formatDate = (dateStr) => {
  if (!dateStr) return '未知';
  return new Date(dateStr).toLocaleString('zh-CN');
};

/**
 * 生成安全的文件名
 * 防止文件名冲突和安全问题
 * @param {string} originalName - 原始文件名
 * @returns {string} 安全的新文件名
 */
function generateSafeFileName(originalName) {
  const randomString = Math.random().toString(36).substring(2, 10);
  const extension = originalName.split('.').pop();
  return `${Date.now()}_${randomString}.${extension}`;
}

/**
 * 上传文件到 Supabase Storage
 * @param {File} file - 要上传的文件
 * @returns {Promise<{url: string, originalName: string}|null>} 文件URL和原始名称
 */
async function uploadFile(file) {
  try {
    const safeFileName = generateSafeFileName(file.name);
    const { data, error } = await supabase.storage.from('assignments').upload(safeFileName, file);

    if (error) {
      console.error('上传文件失败:', error);
      return null;
    }

    const { data: urlData } = supabase.storage.from('assignments').getPublicUrl(data.path);

    return {
      url: urlData.publicUrl,
      originalName: file.name,
    };
  } catch (error) {
    console.error('上传文件失败:', error);
    return null;
  }
}

/**
 * 从 Supabase Edge Function 获取用户未批改的理论提交记录
 * @param {string} userId - 用户ID
 * @returns {Promise<Array>} 未批改的理论提交记录列表
 */
const fetchUngradedSubmissions = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return [];
    const response = await fetch(
      'https://mureufpzatpigcetrkts.supabase.co/functions/v1/get-theory-submissions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
      }
    );
    const result = await response.json();
    if (!response.ok) throw new Error(result.error);
    // 过滤未批改且按时间倒序
    return (result.data || [])
      .filter(sub => sub.grade === null)
      .sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at));
  } catch (error) {
    console.error('获取未批改作业失败:', error);
    return [];
  }
};

/**
 * 打开覆盖提交模态框
 * @returns {Promise<void>}
 */
const openSubmissionModal = async () => {
  // 先获取未批改记录（用于下拉框）
  const ungraded = await fetchUngradedSubmissions();
  ungradedSubmissions.value = ungraded;
  selectedSubmissionId.value = '';
  showOverrideModal.value = true;
};

/**
 * 关闭覆盖提交模态框
 * @returns {Promise<void>}
 */
const closeOverrideModal = () => {
  showOverrideModal.value = false;
  ungradedSubmissions.value = [];
  selectedSubmissionId.value = '';
};

/**
 * 直接提交理论作业
 * @returns {Promise<void>}
 */
const handleDirectSubmit = async () => {
  closeOverrideModal();
  await performSubmit(false);
};

/**
 * 确认覆盖提交
 * @returns {Promise<void>}
 */
const handleOverrideSubmit = async () => {
  if (!selectedSubmissionId.value) {
    alert('请选择要覆盖的提交记录');
    return;
  }
  closeOverrideModal();
  await performSubmit(true);
};

/**
 * 提交理论作业
 * 验证用户信息、上传文件并调用 Edge Function 提交作业
 * @param {boolean} [isOverride] - 是否为覆盖提交
 * @returns {Promise<void>}
 */
const performSubmit = async (isOverride) => {
  isSubmitting.value = true;
  success.value = false;
  errorMsg.value = '';

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      errorMsg.value = '请先登录';
      isSubmitting.value = false;
      return;
    }

    try {
      checkSubmitRateLimit(session.user.id, 'submit_assignment', profile.value.role || 'student');
    } catch (error) {
      errorMsg.value = error.message;
      isSubmitting.value = false;
      return;
    }

    let attachmentUrl = form.value.attachmentUrl;
    let originalName = null;
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

    const body = {
      content: validateInput(form.value.content),
      attachment_url: attachmentUrl || null,
      original_name: originalName || '',
    };
    if (isOverride) {
      body.submission_id = selectedSubmissionId.value;
    }

    const response = await fetch(
      'https://mureufpzatpigcetrkts.supabase.co/functions/v1/submit-theory-assignment',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || `HTTP ${response.status}`);
    }
    if (!data.success) {
      throw new Error(data.error || '提交失败');
    }

    success.value = true;

    form.value = {
      content: '',
      attachmentUrl: '',
    };
    file.value = null;
    const fileInput = document.getElementById('attachment');
    if (fileInput) fileInput.value = '';

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

/**
 * 初始化页面
 * 检查登录状态并获取用户资料
 * @生命周期钩子
 */
onMounted(async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
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
