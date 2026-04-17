<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">作业提交记录</h1>

    <div class="flex flex-col lg:flex-row gap-8">
      <!-- 左侧：编程作业提交记录 -->
      <div class="flex-1 bg-white rounded-lg border border-gray-300 shadow-sm p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-2xl font-semibold">编程作业提交记录</h2>
          <button
            @click="toggleShowAll('coding')"
            class="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            {{ showAllCoding ? '收起' : '查看全部' }}
          </button>
        </div>
        <div v-if="loadingCoding" class="text-center py-8">加载中...</div>
        <div v-else-if="errorCoding" class="text-red-600">{{ errorCoding }}</div>
        <div v-else>
          <div class="space-y-3">
            <div
              v-for="sub in displayedCodingSubmissions"
              :key="sub.id"
              class="bg-white rounded-xl border-2 border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 p-5"
            >
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="text-lg font-semibold text-gray-800">
                    {{ sub.github_assignments?.title || sub.assignment_slug }}
                  </h3>
                  <p class="text-sm text-gray-500 mt-1">
                    提交时间：{{ formatDate(sub.submitted_at) }}
                  </p>
                  <p v-if="isTeacher && sub.student?.name" class="text-sm text-gray-500">
                    提交人：{{ sub.student?.name }} ({{ sub.student?.student_id }})
                  </p>
                  <p class="text-sm text-gray-500">
                    成绩：{{ sub.grade ?? '待批改' }}
                    <button
                      v-if="isTeacher && sub.grade === null"
                      @click="openGradeModal(sub)"
                      class="ml-2 text-blue-600 hover:text-blue-800 text-xs underline"
                    >
                      批改
                    </button>
                  </p>
                </div>
                <a
                  v-if="sub.repo_url"
                  :href="sub.repo_url"
                  target="_blank"
                  class="text-blue-600 hover:text-blue-800 text-sm"
                >
                  查看仓库 →
                </a>
              </div>
            </div>
          </div>

          <!-- 分页控件（仅当未查看全部时显示） -->
          <div v-if="!showAllCoding && codingSubmissions.length > pageSize" class="mt-6 flex justify-center">
            <button
              v-for="page in codingTotalPages"
              :key="page"
              @click="currentCodingPage = page"
              class="mx-1 px-3 py-1 rounded border"
              :class="currentCodingPage === page ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'"
            >
              {{ page }}
            </button>
          </div>
        </div>
      </div>

      <!-- 右侧：理论作业提交记录 -->
      <div class="flex-1 bg-white rounded-lg border border-gray-300 shadow-sm p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-2xl font-semibold">理论作业提交记录</h2>
          <button
            @click="toggleShowAll('theory')"
            class="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            {{ showAllTheory ? '收起' : '查看全部' }}
          </button>
        </div>

        <div v-if="loadingTheory" class="text-center py-8">加载中...</div>
        <div v-else-if="errorTheory" class="text-red-600">{{ errorTheory }}</div>
        <div v-else>
          <div class="space-y-3">
            <div
              v-for="sub in displayedTheorySubmissions"
              :key="sub.id"
              class="bg-white rounded-xl border-2 border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 p-5"
            >
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <p class="text-gray-700 mt-2 line-clamp-3">
                    作业描述：{{ sub.content }}
                  </p>
                  <p class="text-sm text-gray-500 mt-1">
                    提交时间：{{ formatDate(sub.submitted_at) }}
                  </p>
                  <p v-if="isTeacher && sub.name" class="text-sm text-gray-500 mt-1">
                    提交人：{{ sub.name }} ({{ sub.student_id }})
                  </p>
                  <a
                    v-if="sub.attachment_url"
                    :href="sub.attachment_url"
                    target="_blank"
                    class="text-blue-600 hover:text-blue-800 text-sm mt-2 inline-block"
                  >
                    查看附件 →
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- 分页控件 -->
          <div v-if="!showAllTheory && theorySubmissions.length > pageSize" class="mt-6 flex justify-center">
            <button
              v-for="page in theoryTotalPages"
              :key="page"
              @click="currentTheoryPage = page"
              class="mx-1 px-3 py-1 rounded border"
              :class="currentTheoryPage === page ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'"
            >
              {{ page }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 批改模态框 -->
    <div v-if="showGradeModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="closeModal">
      <div class="bg-white rounded-xl shadow-xl p-6 w-96 max-w-full">
        <h3 class="text-xl font-bold mb-4">批改编程作业</h3>
        <div class="space-y-3">
          <div>
            <label class="block text-sm font-medium text-gray-700">学生</label>
            <p class="text-gray-900">{{ selectedSubmission?.name }} ({{ selectedSubmission?.student_id }})</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">作业</label>
            <p class="text-gray-900">{{ selectedSubmission?.github_assignments?.title || selectedSubmission?.assignment_slug }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">成绩 (0-100)</label>
            <input 
              v-model.number="gradeInput" 
              type="number" 
              min="0" 
              max="100" 
              class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <div class="flex justify-end gap-3 mt-6">
          <button @click="closeModal" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">取消</button>
          <button @click="submitGrade" :disabled="submittingGrade" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
            {{ submittingGrade ? '提交中...' : '确认批改' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '../supabase'

// 状态
const codingSubmissions = ref([])
const theorySubmissions = ref([])
const loadingCoding = ref(true)
const loadingTheory = ref(true)
const errorCoding = ref(null)
const errorTheory = ref(null)
const isTeacher = ref(false)

// 批改相关状态
const showGradeModal = ref(false)
const selectedSubmission = ref(null)
const gradeInput = ref(0)
const submittingGrade = ref(false)

// 分页状态
const pageSize = 5
const showAllCoding = ref(false)
const showAllTheory = ref(false)
const currentCodingPage = ref(1)
const currentTheoryPage = ref(1)

// 计算属性：当前显示的编程作业记录
const displayedCodingSubmissions = computed(() => {
  if (showAllCoding.value) return codingSubmissions.value
  const start = (currentCodingPage.value - 1) * pageSize
  return codingSubmissions.value.slice(start, start + pageSize)
})

const codingTotalPages = computed(() => Math.ceil(codingSubmissions.value.length / pageSize))

// 计算属性：当前显示的理论作业记录
const displayedTheorySubmissions = computed(() => {
  if (showAllTheory.value) return theorySubmissions.value
  const start = (currentTheoryPage.value - 1) * pageSize
  return theorySubmissions.value.slice(start, start + pageSize)
})

const theoryTotalPages = computed(() => Math.ceil(theorySubmissions.value.length / pageSize))

// 切换查看全部/分页
const toggleShowAll = (type) => {
  if (type === 'coding') {
    showAllCoding.value = !showAllCoding.value
    if (!showAllCoding.value) currentCodingPage.value = 1
  } else {
    showAllTheory.value = !showAllTheory.value
    if (!showAllTheory.value) currentTheoryPage.value = 1
  }
}

// 日期格式化
const formatDate = (dateStr) => {
  if (!dateStr) return '未知'
  return new Date(dateStr).toLocaleString('zh-CN')
}

// 获取编程作业数据
const fetchCodingSubmissions = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      errorCoding.value = '请先登录'
      return
    }

    const response = await fetch(
      'https://mureufpzatpigcetrkts.supabase.co/functions/v1/get-my-submissions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`
        }
      }
    )
    const result = await response.json()
    if (!response.ok) throw new Error(result.error)
    codingSubmissions.value = result.data || []
    isTeacher.value = result.role === 'teacher'
  } catch (err) {
    errorCoding.value = err.message
  } finally {
    loadingCoding.value = false
  }
}

// 获取理论作业数据
const fetchTheorySubmissions = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      errorTheory.value = '请先登录'
      return
    }

    const response = await fetch(
      'https://mureufpzatpigcetrkts.supabase.co/functions/v1/get-theory-submissions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`
        }
      }
    )
    const result = await response.json()
    if (!response.ok) throw new Error(result.error)
    theorySubmissions.value = result.data || []
    if (result.role) isTeacher.value = result.role === 'teacher'
  } catch (err) {
    errorTheory.value = err.message
  } finally {
    loadingTheory.value = false
  }
}

// 打开批改弹窗
const openGradeModal = (submission) => {
  selectedSubmission.value = submission
  gradeInput.value = submission.grade ?? 0
  showGradeModal.value = true
}

// 关闭弹窗
const closeModal = () => {
  showGradeModal.value = false
  selectedSubmission.value = null
  gradeInput.value = 0
}

// 提交批改
const submitGrade = async () => {
  if (gradeInput.value < 0 || gradeInput.value > 100) {
    alert('成绩必须在 0-100 之间')
    return
  }
  submittingGrade.value = true
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw new Error('未登录')

    const response = await fetch(
      'https://mureufpzatpigcetrkts.supabase.co/functions/v1/update-submission-grade',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          submissionId: selectedSubmission.value.id,
          grade: gradeInput.value
        })
      }
    )
    const result = await response.json()
    if (!response.ok) throw new Error(result.error)

    // 更新本地数据
    const index = codingSubmissions.value.findIndex(s => s.id === selectedSubmission.value.id)
    if (index !== -1) {
      codingSubmissions.value[index].grade = gradeInput.value
    }
    closeModal()
    alert('批改成功')
  } catch (err) {
    console.error('批改失败:', err)
    alert('批改失败: ' + err.message)
  } finally {
    submittingGrade.value = false
  }
}

onMounted(() => {
  fetchCodingSubmissions()
  fetchTheorySubmissions()
})
</script>