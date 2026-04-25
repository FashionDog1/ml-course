<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl sm:text-3xl font-bold mb-6">
      教学资料与讨论
    </h1>

    <!-- 教师发布资料表单（仅教师可见） -->
    <div
      v-if="isTeacher"
      class="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-8 shadow-sm"
    >
      <h2 class="text-lg sm:text-xl font-semibold mb-4">
        发布新资料
      </h2>
      <form
        class="space-y-4"
        @submit.prevent="publishMaterial"
      >
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">标题 *</label>
          <input
            v-model="newMaterial.title"
            type="text"
            required
            class="w-full border border-gray-300 rounded-lg px-3 py-2"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">描述 / 内容 *</label>
          <textarea
            v-model="newMaterial.content"
            rows="3"
            required
            class="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>
        <!-- 附件上传 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">附件</label>
          <input
            id="material-attachment"
            type="file"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg"
            accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png,.zip,.rar"
            @change="handleFileChange"
          >
          <p
            v-if="uploadedFile"
            class="text-sm text-gray-600 mt-1"
          >
            已选择文件: {{ uploadedFile.name }}
          </p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">附件链接（可选）</label>
          <input
            v-model="newMaterial.attachmentUrl"
            type="url"
            class="w-full border border-gray-300 rounded-lg px-3 py-2"
          >
        </div>
        <div class="flex items-center">
          <input
            id="is_pinned"
            v-model="newMaterial.is_pinned"
            type="checkbox"
            class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          >
          <label
            for="is_pinned"
            class="ml-2 text-sm font-medium text-gray-700"
          >置顶此资料</label>
        </div>
        <button
          type="submit"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          发布
        </button>
      </form>
    </div>

    <!-- 教学资料列表 -->
    <div class="mb-12">
      <h2 class="text-xl sm:text-2xl font-semibold mb-4">
        📚 课件与参考资料
      </h2>
      <div
        v-if="loadingMaterials"
        class="text-center py-8"
      >
        加载中...
      </div>
      <div
        v-else-if="errorMaterials"
        class="text-red-600"
      >
        {{ errorMaterials }}
      </div>
      <div
        v-else
        class="grid gap-5"
      >
        <div
          v-for="item in sortedMaterials"
          :key="item.id"
          class="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 shadow-sm hover:shadow-md transition"
        >
          <div class="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <span
                  v-if="item.is_pinned"
                  class="inline-block px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-medium rounded"
                >置顶</span>
                <h3 class="text-base sm:text-lg font-semibold text-gray-800">
                  {{ item.title }}
                </h3>
              </div>
              <p class="text-gray-600 mt-1">
                {{ item.description }}
              </p>
              <p class="text-xs text-gray-400 mt-2">
                <span class="font-bold">{{ item.user_profiles?.name}}</span> 发布于 {{ formatDate(item.created_at) }}
              </p>
              <a
                v-if="item.attachment_url"
                :href="item.attachment_url"
                target="_blank"
                class="inline-block mt-3 text-blue-600 hover:text-blue-800 text-sm"
              >📎 下载附件 →</a>
            </div>
            <div class="flex flex-col items-end gap-2">
              <button
                v-if="isTeacher && item.user_id === currentUserId"
                class="text-sm py-1 px-2 rounded hover:bg-gray-100"
                :class="
                  item.is_pinned
                    ? 'text-yellow-600 hover:text-yellow-800'
                    : 'text-gray-400 hover:text-yellow-600'
                "
                :title="item.is_pinned ? '取消置顶' : '置顶'"
                @click="togglePin(item)"
              >
                {{ item.is_pinned ? '📌 已置顶' : '📍 置顶' }}
              </button>
              <button
                v-if="isTeacher && item.user_id === currentUserId"
                class="text-red-500 hover:text-red-700 text-sm py-1 px-2 rounded hover:bg-gray-100"
                title="删除"
                @click="openDeleteConfirm(item.id)"
              >
                🗑️ 删除
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 自定义删除确认模态框 -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="closeDeleteModal"
    >
      <div class="bg-white rounded-xl shadow-xl p-4 sm:p-6 w-80 sm:w-96 max-w-full">
        <h3 class="text-lg sm:text-xl font-bold mb-4">
          确认删除
        </h3>
        <p class="text-gray-700 mb-4 sm:mb-6">
          确定要删除这份资料吗？删除后无法恢复。
        </p>
        <div class="flex justify-end gap-2 sm:gap-3">
          <button
            class="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
            @click="closeDeleteModal"
          >
            取消
          </button>
          <button
            class="px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
            @click="confirmDelete"
          >
            确认删除
          </button>
        </div>
      </div>
    </div>

    <!-- Giscus 评论系统 -->
    <div class="mt-12 pt-8 border-t border-gray-200">
      <h2 class="text-xl sm:text-2xl font-semibold mb-4">
        💬 讨论区
      </h2>
      <Giscus />
    </div>
  </div>
</template>

<script setup>
/**
 * 教学资料与讨论页面
 * 提供教师发布资料、学生查看资料、以及Giscus评论区功能
 * @component
 */
import { ref, onMounted, computed } from 'vue';
import { supabase } from '../supabase';
import Giscus from '../components/Giscus.vue';
import { validateInput } from '../utils/xss';
import { checkSubmitRateLimit } from '../utils/rateLimit';

/** @type {import('vue').Ref<Array>} 教学资料列表 */
const materials = ref([]);

/** @type {import('vue').Ref<boolean>} 是否正在加载资料 */
const loadingMaterials = ref(true);

/** @type {import('vue').Ref<string|null>} 加载错误信息 */
const errorMaterials = ref(null);

/** @type {import('vue').Ref<boolean>} 当前用户是否为教师 */
const isTeacher = ref(false);

/** @type {import('vue').Ref<string|null>} 当前用户ID */
const currentUserId = ref(null);

/** @type {import('vue').Ref<null|File>} 上传的文件 */
const uploadedFile = ref(null);

/** @type {import('vue').Ref<boolean>} 是否显示删除确认模态框 */
const showDeleteModal = ref(false);

/** @type {import('vue').Ref<null|string>} 待删除的资料ID */
const pendingDeleteId = ref(null);

/**
 * 排序后的资料列表
 * 置顶资料优先显示，其余按时间倒序排列
 * @type {import('vue').ComputedRef<Array>}
 */
const sortedMaterials = computed(() => {
  return [...materials.value].sort((a, b) => {
    if (a.is_pinned && !b.is_pinned) return -1;
    if (!a.is_pinned && b.is_pinned) return 1;
    return new Date(b.created_at) - new Date(a.created_at);
  });
});

/** @type {import('vue').Ref<{title: string, content: string, attachmentUrl: string, is_pinned: boolean}>} 新资料表单 */
const newMaterial = ref({ title: '', content: '', attachmentUrl: '', is_pinned: false });

/**
 * 处理资料不完整错误
 * 提示用户联系老师补充信息
 * @param {string} _errorMessage - 错误信息（未使用）
 */
const handleProfileIncompleteError = (_errorMessage) => {
  alert('您的个人信息不完整，请联系老师补充学号和姓名后再进行操作。');
};

/**
 * 格式化日期为本地字符串
 * @param {string} dateStr - ISO格式的日期字符串
 * @returns {string} 格式化的日期字符串
 */
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleString('zh-CN');
};

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
 * 生成安全的文件名
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
 * @returns {Promise<string|null>} 文件的公共URL
 */
async function uploadFile(file) {
  try {
    const safeFileName = generateSafeFileName(file.name);
    const { data, error } = await supabase.storage.from('materials').upload(safeFileName, file);
    if (error) throw error;
    const { data: urlData } = supabase.storage.from('materials').getPublicUrl(data.path);
    return urlData.publicUrl;
  } catch (error) {
    console.error('文件上传失败:', error);
    return null;
  }
}

/**
 * 处理文件选择变化
 * @param {Event} event - 文件选择事件
 */
function handleFileChange(event) {
  const file = event.target.files[0];
  if (file) {
    if (validateFile(file)) {
      uploadedFile.value = file;
    } else {
      alert('不支持的文件类型，请上传 PDF、Word、PPT、Excel、图片或压缩包');
      uploadedFile.value = null;
      event.target.value = '';
    }
  } else {
    uploadedFile.value = null;
  }
}

/**
 * 获取教学资料列表
 * 从 Supabase 获取所有已发布的教学资料
 * @returns {Promise<void>}
 */
const fetchMaterials = async () => {
  try {
    const { data, error } = await supabase
      .from('teacher_materials')
      .select('*, user_profiles(name)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    materials.value = data || [];
  } catch (error) {
    console.error('获取教学资料失败:', error);
    errorMaterials.value = '加载失败';
  } finally {
    loadingMaterials.value = false;
  }
};

/**
 * 发布新的教学资料
 * 验证用户身份、上传文件并提交到服务器
 * @returns {Promise<void>}
 */
const publishMaterial = async () => {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) throw new Error('未登录');

    try {
      checkSubmitRateLimit(session.user.id, 'publish_material', 'teacher');
    } catch (error) {
      alert(error.message);
      return;
    }

    let attachmentUrl = newMaterial.value.attachmentUrl || null;
    if (uploadedFile.value) {
      const uploadedUrl = await uploadFile(uploadedFile.value);
      if (uploadedUrl) {
        attachmentUrl = uploadedUrl;
      } else {
        alert('文件上传失败，请重试');
        return;
      }
    }
    const response = await fetch(
      'https://mureufpzatpigcetrkts.supabase.co/functions/v1/submit-theory-assignment',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          title: validateInput(newMaterial.value.title),
          content: validateInput(newMaterial.value.content),
          attachment_url: attachmentUrl || null,
          is_pinned: newMaterial.value.is_pinned,
        }),
      }
    );
    const result = await response.json();
    if (response.status === 400 && result.error?.includes('incomplete')) {
      // 用户资料不完整
      handleProfileIncompleteError(result.error);
      return;
    }
    if (!response.ok) throw new Error(result.error);
    alert('发布成功！');
    // 重置表单
    newMaterial.value = { title: '', content: '', attachmentUrl: '', is_pinned: false };
    uploadedFile.value = null;
    // 清空文件选择框
    const fileInput = document.getElementById('material-attachment');
    if (fileInput) fileInput.value = '';
    fetchMaterials(); // 刷新列表
  } catch (err) {
    alert('发布失败：' + err.message);
  }
};

/**
 * 获取当前用户角色和ID
 * 从 Supabase 获取用户信息并判断是否为教师
 * @returns {Promise<void>}
 */
const fetchUserInfo = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return;
  currentUserId.value = session.user.id;
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', currentUserId.value)
    .single();
  isTeacher.value = profile?.role === 'teacher';
};

/**
 * 打开删除确认弹窗
 * @param {string} materialId - 待删除的资料ID
 */
const openDeleteConfirm = (materialId) => {
  pendingDeleteId.value = materialId;
  showDeleteModal.value = true;
};

/**
 * 关闭删除确认弹窗
 */
const closeDeleteModal = () => {
  showDeleteModal.value = false;
  pendingDeleteId.value = null;
};

/**
 * 确认删除资料
 * 调用 Edge Function 删除资料并更新本地列表
 * @returns {Promise<void>}
 */
const confirmDelete = async () => {
  if (!pendingDeleteId.value) return;
  const materialId = pendingDeleteId.value;
  closeDeleteModal();
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) throw new Error('未登录');

    const response = await fetch(
      'https://mureufpzatpigcetrkts.supabase.co/functions/v1/delete-teacher-material',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ materialId }),
      }
    );
    const result = await response.json();
    if (!response.ok) throw new Error(result.error);

    materials.value = materials.value.filter((m) => m.id !== materialId);
    alert('删除成功');
  } catch (err) {
    alert('删除失败：' + err.message);
  }
};

/**
 * 切换资料的置顶状态
 * @param {Object} item - 资料对象
 * @returns {Promise<void>}
 */
const togglePin = async (item) => {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) throw new Error('未登录');

    try {
      checkSubmitRateLimit(session.user.id, 'toggle_pin', 'teacher');
    } catch (error) {
      alert(error.message);
      return;
    }

    const response = await fetch(
      'https://mureufpzatpigcetrkts.supabase.co/functions/v1/toggle-pin-material',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ materialId: item.id, is_pinned: !item.is_pinned }),
      }
    );
    const result = await response.json();
    if (!response.ok) throw new Error(result.error);

    const index = materials.value.findIndex((m) => m.id === item.id);
    if (index !== -1) {
      materials.value[index].is_pinned = !item.is_pinned;
    }
    alert(item.is_pinned ? '已置顶' : '已取消置顶');
  } catch (err) {
    alert('操作失败：' + err.message);
  }
};

onMounted(async () => {
  await fetchUserInfo();
  await fetchMaterials();
});
</script>

<style scoped>
.giscus-container {
  width: 100%;
}
</style>
