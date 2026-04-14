import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../api'

export const useAppStore = defineStore('app', () => {
  // 需求数据
  const requirementData = ref(null)
  const categories = computed(() => requirementData.value?.categories || [])
  const projectInfo = computed(() => requirementData.value?.project || {})

  // 组件和布局注册表
  const componentList = ref([])
  const layoutList = ref([])
  const defaultLayouts = ref([])

  // 界面状态
  const activeCategoryId = ref(null)
  const sidebarCollapsed = ref(false)
  const simulatorVisible = ref(true)
  const drawerOpen = ref(false)

  // 回答数据
  const answers = ref({})

  // 加载需求配置
  async function loadRequirements() {
    const data = await api.getRequirements()
    requirementData.value = data
    if (data.categories?.length && !activeCategoryId.value) {
      activeCategoryId.value = data.categories[0].id
    }
  }

  // 加载组件描述
  async function loadComponents() {
    const data = await api.getComponents()
    componentList.value = data.components || []
  }

  // 加载默认布局
  async function loadDefaultLayouts() {
    const data = await api.getDefaultLayout()
    defaultLayouts.value = data.layouts || []
  }

  // 切换分类
  function setCategory(categoryId) {
    activeCategoryId.value = categoryId
  }

  // 收集回答
  function setAnswer(questionId, answer) {
    answers.value[questionId] = answer
  }

  function getAnswer(questionId) {
    return answers.value[questionId] || null
  }

  // 提交结果
  async function submitResults() {
    const answerList = Object.values(answers.value)
    const result = {
      project: projectInfo.value,
      submittedAt: new Date().toISOString(),
      answers: answerList,
    }
    return await api.saveResults(result)
  }

  // 加载已保存的结果
  async function loadResults() {
    const data = await api.getResults()
    if (data.answers?.length) {
      for (const ans of data.answers) {
        answers.value[ans.questionId] = ans
      }
    }
  }

  return {
    requirementData,
    categories,
    projectInfo,
    componentList,
    layoutList,
    defaultLayouts,
    activeCategoryId,
    sidebarCollapsed,
    simulatorVisible,
    drawerOpen,
    answers,
    loadRequirements,
    loadComponents,
    loadDefaultLayouts,
    setCategory,
    setAnswer,
    getAnswer,
    submitResults,
    loadResults,
  }
})
