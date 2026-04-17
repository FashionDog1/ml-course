<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">教学资料与讨论</h1>

    <!-- 教师发布资料表单（仅教师可见） -->
    <div v-if="isTeacher" class="bg-white rounded-xl border border-gray-200 p-6 mb-8 shadow-sm">
      <h2 class="text-xl font-semibold mb-4">发布新教学资料</h2>
      <form @submit.prevent="publishMaterial" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">标题 *</label>
          <input v-model="newMaterial.title" type="text" required class="w-full border border-gray-300 rounded-lg px-3 py-2" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">描述 / 内容 *</label>
          <textarea v-model="newMaterial.content" rows="3" required class="w-full border border-gray-300 rounded-lg px-3 py-2"></textarea>
        </div>
        <!-- 附件上传 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">附件</label>
          <input 
            type="file" 
            id="material-attachment" 
            @change="handleFileChange" 
            class="w-full px-4 py-2 border border-gray-300 rounded-lg"
            accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png,.zip,.rar"
          />
          <p v-if="uploadedFile" class="text-sm text-gray-600 mt-1">已选择文件: {{ uploadedFile.name }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">附件链接（可选）</label>
          <input v-model="newMaterial.attachmentUrl" type="url" class="w-full border border-gray-300 rounded-lg px-3 py-2" />
        </div>
        <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">发布</button>
      </form>
    </div>

    <!-- 教学资料列表 -->
    <div class="mb-12">
      <h2 class="text-2xl font-semibold mb-4">📚 课件与参考资料</h2>
      <div v-if="loadingMaterials" class="text-center py-8">加载中...</div>
      <div v-else-if="errorMaterials" class="text-red-600">{{ errorMaterials }}</div>
      <div v-else class="grid gap-5">
        <div v-for="item in materials" :key="item.id" class="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition">
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-800">{{ item.title }}</h3>
              <p class="text-gray-600 mt-1">{{ item.description }}</p>
              <p class="text-xs text-gray-400 mt-2">发布于 {{ formatDate(item.created_at) }}</p>
              <a v-if="item.attachment_url" :href="item.attachment_url" target="_blank" class="inline-block mt-3 text-blue-600 hover:text-blue-800 text-sm">📎 下载附件 →</a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Giscus 评论系统 -->
    <div class="mt-12 pt-8 border-t border-gray-200">
      <h2 class="text-2xl font-semibold mb-4">💬 讨论区</h2>
      <Giscus />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { supabase } from '../supabase'
import Giscus from '../components/Giscus.vue';

const materials = ref([])
const loadingMaterials = ref(true)
const errorMaterials = ref(null)
const isTeacher = ref(false)
const uploadedFile = ref(null)

const newMaterial = ref({ title: '', content: '', attachmentUrl: '' })

// 日期格式化
const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleString('zh-CN')
}

// 文件验证函数
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
    'text/plain'
  ]
  return allowedTypes.includes(file.type)
}

function generateSafeFileName(originalName) {
  const randomString = Math.random().toString(36).substring(2, 10)
  const extension = originalName.split('.').pop()
  return `${Date.now()}_${randomString}.${extension}`
}

async function uploadFile(file) {
  try {
    const safeFileName = generateSafeFileName(file.name)
    const { data, error } = await supabase
      .storage
      .from('assignments')
      .upload(safeFileName, file)
    if (error) throw error
    const { data: urlData } = supabase
      .storage
      .from('assignments')
      .getPublicUrl(data.path)
    return urlData.publicUrl
  } catch (error) {
    console.error('文件上传失败:', error)
    return null
  }
}

function handleFileChange(event) {
  const file = event.target.files[0]
  if (file) {
    if (validateFile(file)) {
      uploadedFile.value = file
    } else {
      alert('不支持的文件类型，请上传 PDF、Word、PPT、Excel、图片或压缩包')
      uploadedFile.value = null
      event.target.value = ''
    }
  } else {
    uploadedFile.value = null
  }
}

// 获取教学资料
const fetchMaterials = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    const response = await fetch(
      'https://mureufpzatpigcetrkts.supabase.co/functions/v1/get-teacher-materials',
      { headers: { Authorization: `Bearer ${session.access_token}` } }
    )
    const result = await response.json()
    if (response.ok) materials.value = result.data || []
    else console.error(result.error)
  } catch (err) {
    errorMaterials.value = err.message
  } finally {
    loadingMaterials.value = false
  }
}

// 教师发布资料
const publishMaterial = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw new Error('未登录')
    let attachmentUrl = newMaterial.value.attachmentUrl || null
    // 如果有上传文件，先上传到 Storage
    if (uploadedFile.value) {
      const uploadedUrl = await uploadFile(uploadedFile.value)
      if (uploadedUrl) {
        attachmentUrl = uploadedUrl
      } else {
        alert('文件上传失败，请重试')
        return
      }
    }
    const response = await fetch(
      'https://mureufpzatpigcetrkts.supabase.co/functions/v1/submit-theory-assignment',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          title: newMaterial.value.title,
          content: newMaterial.value.content,
          attachment_url: attachmentUrl || null
        })
      }
    )
    const result = await response.json()
    if (!response.ok) throw new Error(result.error)
    alert('发布成功！')
    // 重置表单
    newMaterial.value = { title: '', content: '', attachmentUrl: '' }
    uploadedFile.value = null
    // 清空文件选择框
    const fileInput = document.getElementById('material-attachment')
    if (fileInput) fileInput.value = ''
    fetchMaterials() // 刷新列表
  } catch (err) {
    alert('发布失败：' + err.message)
  }
}

// 获取当前用户角色
const fetchUserRole = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return
  const { data: profile } = await supabase.from('user_profiles').select('role').eq('id', session.user.id).single()
  isTeacher.value = profile?.role === 'teacher'
}

onMounted(async () => {
  await fetchUserRole()
  await fetchMaterials()
})

</script>

<style scoped>
.giscus-container {
  width: 100%;
}
</style>