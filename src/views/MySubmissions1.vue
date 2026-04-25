<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">
      作业提交记录
    </h1>

    <div class="flex flex-col lg:flex-row gap-8">
      <!-- 左侧：编程作业提交记录 -->
      <div class="flex-1 bg-white rounded-lg border border-gray-300 shadow-sm p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-2xl font-semibold">
            编程作业提交记录
          </h2>
          <button
            class="text-blue-600 hover:text-blue-800 text-sm font-medium"
            @click="toggleShowAll('coding')"
          >
            {{ showAllCoding ? '收起' : '查看全部' }}
          </button>
        </div>
        <div
          v-if="loadingCoding"
          class="text-center py-8"
        >
          加载中...
        </div>
        <div
          v-else-if="errorCoding"
          class="text-red-600"
        >
          {{ errorCoding }}
        </div>
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
                  <p
                    v-if="isTeacher && sub.student?.name"
                    class="text-sm text-gray-500 mt-1"
                  >
                    提交人：{{ sub.student?.name }} ({{ sub.student?.student_id }})
                  </p>
                  <p class="text-sm text-gray-500">
                    成绩：{{ sub.grade ?? '待批改' }}
                    <button
                      v-if="isTeacher"
                      class="ml-2 text-blue-600 hover:text-blue-800 text-xs underline"
                      @click="openGradeModal(sub)"
                    >
                      {{ sub.grade === null ? '批改' : '修改成绩' }}
                    </button>
                  </p>
                  <p
                    v-if="sub.grade !== null"
                    class="text-sm text-gray-500 mt-1"
                  >
                    评语：{{ sub.teacher_comment ?? '教师未评语' }}
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
          <div
            v-if="!showAllCoding && codingSubmissions.length > pageSize"
            class="mt-6 flex justify-center"
          >
            <button
              v-for="page in codingTotalPages"
              :key="page"
              class="mx-1 px-3 py-1 rounded border"
              :class="
                currentCodingPage === page
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              "
              @click="currentCodingPage = page"
            >
              {{ page }}
            </button>
          </div>
        </div>
      </div>

      <!-- 右侧：理论作业提交记录 -->
      <div class="flex-1 bg-white rounded-lg border border-gray-300 shadow-sm p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-2xl font-semibold">
            理论作业提交记录
          </h2>
          <button
            class="text-blue-600 hover:text-blue-800 text-sm font-medium"
            @click="toggleShowAll('theory')"
          >
            {{ showAllTheory ? '收起' : '查看全部' }}
          </button>
        </div>

        <div
          v-if="loadingTheory"
          class="text-center py-8"
        >
          加载中...
        </div>
        <div
          v-else-if="errorTheory"
          class="text-red-600"
        >
          {{ errorTheory }}
        </div>
        <div v-else>
          <div class="space-y-3">
            <div
              v-for="sub in displayedTheorySubmissions"
              :key="sub.id"
              class="bg-white rounded-xl border-2 border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 p-5"
            >
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <p class="text-lg font-semibold text-gray-800">
                    作业描述：{{ validateInput(sub.content) }}
                  </p>
                  <p class="text-sm text-gray-500 mt-1">
                    提交时间：{{ formatDate(sub.submitted_at) }}
                  </p>
                  <p
                    v-if="isTeacher && sub.name"
                    class="text-sm text-gray-500 mt-1"
                  >
                    提交人：{{ sub.name }} ({{ sub.student_id }})
                  </p>
                  <p class="text-sm text-gray-500 mt-1">
                    成绩：{{ sub.grade ?? '待批改' }}
                    <button
                      v-if="isTeacher"
                      class="ml-2 text-blue-600 hover:text-blue-800 text-xs underline"
                      @click="openGradeModal(sub, 'theory')"
                    >
                      {{ sub.grade === null ? '批改' : '修改成绩' }}
                    </button>
                  </p>
                  <p
                    v-if="sub.grade !== null"
                    class="text-sm text-gray-500 mt-1"
                  >
                    评语：{{ sub.teacher_comment ?? '教师未评语' }}
                  </p>
                </div>
                <a
                  v-if="sub.attachment_url"
                  :href="sub.attachment_url"
                  target="_blank"
                  class="text-blue-600 hover:text-blue-800 text-sm ml-4"
                >
                  查看附件 →
                </a>
              </div>
            </div>
          </div>

          <!-- 分页控件 -->
          <div
            v-if="!showAllTheory && theorySubmissions.length > pageSize"
            class="mt-6 flex justify-center"
          >
            <button
              v-for="page in theoryTotalPages"
              :key="page"
              class="mx-1 px-3 py-1 rounded border"
              :class="
                currentTheoryPage === page
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              "
              @click="currentTheoryPage = page"
            >
              {{ page }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 批改模态框 -->
    <div
      v-if="showGradeModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-xl shadow-xl p-6 w-96 max-w-full">
        <h3 class="text-xl font-bold mb-4">
          {{ selectedSubmission?.grade === null ? (selectedSubmissionType === 'coding' ? '批改编程作业' : '批改理论作业') : '修改成绩' }}
        </h3>
        <div class="space-y-3">
          <div>
            <label class="block text-sm font-medium text-gray-700">学生</label>
            <p class="text-gray-900">
              {{ selectedSubmission?.student?.name || selectedSubmission?.name }} ({{ selectedSubmission?.student?.student_id || selectedSubmission?.student_id }})
            </p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">作业</label>
            <p class="text-gray-900">
              <span v-if="selectedSubmissionType === 'coding'">
                {{
                  selectedSubmission?.github_assignments?.title ||
                    selectedSubmission?.assignment_slug
                }}
              </span>
              <span v-else> {{ (selectedSubmission?.content || '').substring(0, 50) }}... </span>
            </p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">成绩 (0-100)</label>
            <input
              v-model.number="gradeInput"
              type="number"
              min="0"
              max="100"
              class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">评语</label>
            <textarea
              v-model="teacherCommentInput"
              rows="3"
              class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="请输入评语..."
            />
          </div>
        </div>
        <div class="flex justify-end gap-3 mt-6">
          <button
            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            @click="closeModal"
          >
            取消
          </button>
          <button
            :disabled="submittingGrade"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            @click="submitGrade"
          >
            {{ submittingGrade ? '提交中...' : (selectedSubmission?.grade === null ? '确认批改' : '确认修改') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * 作业提交记录页面
 * 显示学生的编程作业和理论作业提交历史，支持教师批改功能
 * @component
 */
import { ref, computed, onMounted } from 'vue';
import { supabase } from '../supabase';
import { validateInput } from '../utils/xss';
import { checkSubmitRateLimit } from '../utils/rateLimit';

/** @type {import('vue').Ref<Array>} 编程作业提交列表 */
const codingSubmissions = ref([]);

/** @type {import('vue').Ref<Array>} 理论作业提交列表 */
const theorySubmissions = ref([]);

/** @type {import('vue').Ref<boolean>} 是否正在加载编程作业 */
const loadingCoding = ref(true);

/** @type {import('vue').Ref<boolean>} 是否正在加载理论作业 */
const loadingTheory = ref(true);

/** @type {import('vue').Ref<string|null>} 编程作业加载错误 */
const errorCoding = ref(null);

/** @type {import('vue').Ref<string|null>} 理论作业加载错误 */
const errorTheory = ref(null);

/** @type {import('vue').Ref<boolean>} 当前用户是否为教师 */
const isTeacher = ref(false);

/**
 * 处理资料不完整错误
 * @param {string} _errorMessage - 错误信息（未使用）
 */
const handleProfileIncompleteError = (_errorMessage) => {
  alert('您的个人信息不完整，请联系老师补充学号和姓名后再进行操作。');
};

/** @type {import('vue').Ref<boolean>} 是否显示批改模态框 */
const showGradeModal = ref(false);

/** @type {import('vue').Ref<Object|null>} 当前选中的提交记录 */
const selectedSubmission = ref(null);

/** @type {import('vue').Ref<'coding'|'theory'>} 当前批改的作业类型 */
const selectedSubmissionType = ref('coding');

/** @type {import('vue').Ref<number>} 成绩输入值 */
const gradeInput = ref(0);

/** @type {import('vue').Ref<string>} 教师评语输入 */
const teacherCommentInput = ref('');

/** @type {import('vue').Ref<boolean>} 是否正在提交批改 */
const submittingGrade = ref(false);

/** @type {number} 每页显示的记录数 */
const pageSize = 5;

/** @type {import('vue').Ref<boolean>} 是否显示全部编程作业 */
const showAllCoding = ref(false);

/** @type {import('vue').Ref<boolean>} 是否显示全部理论作业 */
const showAllTheory = ref(false);

/** @type {import('vue').Ref<number>} 当前编程作业页码 */
const currentCodingPage = ref(1);

/** @type {import('vue').Ref<number>} 当前理论作业页码 */
const currentTheoryPage = ref(1);

/**
 * 当前显示的编程作业列表（支持分页）
 * @type {import('vue').ComputedRef<Array>}
 */
const displayedCodingSubmissions = computed(() => {
  if (showAllCoding.value) return codingSubmissions.value;
  const start = (currentCodingPage.value - 1) * pageSize;
  return codingSubmissions.value.slice(start, start + pageSize);
});

/**
 * 编程作业总页数
 * @type {import('vue').ComputedRef<number>}
 */
const codingTotalPages = computed(() => Math.ceil(codingSubmissions.value.length / pageSize));

/**
 * 当前显示的理论作业列表（支持分页）
 * @type {import('vue').ComputedRef<Array>}
 */
const displayedTheorySubmissions = computed(() => {
  if (showAllTheory.value) return theorySubmissions.value;
  const start = (currentTheoryPage.value - 1) * pageSize;
  return theorySubmissions.value.slice(start, start + pageSize);
});

/**
 * 理论作业总页数
 * @type {import('vue').ComputedRef<number>}
 */
const theoryTotalPages = computed(() => Math.ceil(theorySubmissions.value.length / pageSize));

/**
 * 切换显示全部/分页模式
 * @param {'coding'|'theory'} type - 作业类型
 */
const toggleShowAll = (type) => {
  if (type === 'coding') {
    showAllCoding.value = !showAllCoding.value;
    if (!showAllCoding.value) currentCodingPage.value = 1;
  } else {
    showAllTheory.value = !showAllTheory.value;
    if (!showAllTheory.value) currentTheoryPage.value = 1;
  }
};

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
 * 获取编程作业提交记录
 * 调用 Edge Function 获取当前用户的编程作业提交历史
 * @returns {Promise<void>}
 */
const fetchCodingSubmissions = async () => {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      errorCoding.value = '请先登录';
      return;
    }

    const response = await fetch(
      'https://mureufpzatpigcetrkts.supabase.co/functions/v1/get-my-submissions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
      }
    );
    const result = await response.json();
    if (response.status === 400 && result.error?.includes('incomplete')) {
      handleProfileIncompleteError(result.error);
      codingSubmissions.value = [];
      return;
    }
    if (!response.ok) throw new Error(result.error);
    codingSubmissions.value = result.data || [];
    isTeacher.value = result.role === 'teacher';
  } catch (err) {
    errorCoding.value = err.message;
  } finally {
    loadingCoding.value = false;
  }
};

/**
 * 获取理论作业提交记录
 * 调用 Edge Function 获取当前用户的理论作业提交历史
 * @returns {Promise<void>}
 */
const fetchTheorySubmissions = async () => {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      errorTheory.value = '请先登录';
      return;
    }

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
    if (response.status === 400 && result.error?.includes('incomplete')) {
      handleProfileIncompleteError(result.error);
      theorySubmissions.value = [];
      return;
    }
    if (!response.ok) throw new Error(result.error);
    theorySubmissions.value = result.data || [];
    if (result.role) isTeacher.value = result.role === 'teacher';
  } catch (err) {
    errorTheory.value = err.message;
  } finally {
    loadingTheory.value = false;
  }
};

/**
 * 打开批改弹窗
 * @param {Object} submission - 提交记录对象
 * @param {'coding'|'theory'} [type='coding'] - 作业类型
 */
const openGradeModal = (submission, type = 'coding') => {
  selectedSubmission.value = submission;
  selectedSubmissionType.value = type;
  gradeInput.value = submission.grade ?? 0;
  teacherCommentInput.value = submission.teacher_comment ?? '';
  showGradeModal.value = true;
};

/**
 * 关闭批改弹窗
 * 重置所有批改相关状态
 */
const closeModal = () => {
  showGradeModal.value = false;
  selectedSubmission.value = null;
  selectedSubmissionType.value = null;
  gradeInput.value = 0;
  teacherCommentInput.value = '';
};

/**
 * 提交作业批改
 * 验证成绩范围并调用 Edge Function 更新成绩和评语
 * @returns {Promise<void>}
 */
const submitGrade = async () => {
  if (gradeInput.value < 0 || gradeInput.value > 100) {
    alert('成绩必须在 0-100 之间');
    return;
  }
  submittingGrade.value = true;
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) throw new Error('未登录');

    try {
      checkSubmitRateLimit(session.user.id, 'grade_submission', 'teacher');
    } catch (error) {
      alert(error.message);
      submittingGrade.value = false;
      return;
    }

    const response = await fetch(
      'https://mureufpzatpigcetrkts.supabase.co/functions/v1/update-submission-grade',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          submissionId: selectedSubmission.value.id,
          grade: gradeInput.value,
          teacherComment: validateInput(teacherCommentInput.value),
          type: selectedSubmissionType.value,
        }),
      }
    );
    const result = await response.json();
    if (response.status === 400 && result.error?.includes('incomplete')) {
      handleProfileIncompleteError(result.error);
      return;
    }
    if (!response.ok) throw new Error(result.error);

    if (selectedSubmissionType.value === 'coding') {
      const index = codingSubmissions.value.findIndex((s) => s.id === selectedSubmission.value.id);
      if (index !== -1) {
        codingSubmissions.value[index].grade = gradeInput.value;
        codingSubmissions.value[index].teacher_comment = teacherCommentInput.value;
      }
    } else {
      const index = theorySubmissions.value.findIndex((s) => s.id === selectedSubmission.value.id);
      if (index !== -1) {
        theorySubmissions.value[index].grade = gradeInput.value;
        theorySubmissions.value[index].teacher_comment = teacherCommentInput.value;
      }
    }
    closeModal();
    alert(selectedSubmission.value?.grade === null ? '批改成功' : '修改成绩成功');
  } catch (err) {
    console.error('批改失败:', err);
    alert('批改失败: ' + err.message);
  } finally {
    submittingGrade.value = false;
  }
};

/**
 * 初始化页面
 * 获取用户作业提交记录
 * @生命周期钩子
 */
onMounted(() => {
  fetchCodingSubmissions();
  fetchTheorySubmissions();
});
</script>
