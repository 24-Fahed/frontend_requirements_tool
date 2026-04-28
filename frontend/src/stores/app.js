import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import api from '../api'

export const useAppStore = defineStore('app', () => {
  const requirementData = ref(null)
  const categories = computed(() => requirementData.value?.categories || [])
  const projectInfo = computed(() => requirementData.value?.project || {})

  const componentList = ref([])
  const layoutList = ref([])
  const defaultLayouts = ref([])

  const activeCategoryId = ref(null)
  const sidebarCollapsed = ref(false)
  const simulatorVisible = ref(true)

  const answers = ref({})

  /**
   * Loads requirement categories and project information from the backend.
   *
   * @returns {Promise<void>}
   */
  async function loadRequirements() {
    const data = await api.getRequirements()
    requirementData.value = data
    if (data.categories?.length && !activeCategoryId.value) {
      activeCategoryId.value = data.categories[0].id
    }
  }

  /**
   * Loads component and layout metadata used by the interactive simulator.
   *
   * @returns {Promise<void>}
   */
  async function loadComponents() {
    const data = await api.getComponents()
    const allComponents = data.components || []
    componentList.value = allComponents.filter(item => !item.isContainer)
    layoutList.value = allComponents.filter(item => item.isContainer)
    console.log('[DEBUG #21] loadComponents:', {
      total: allComponents.length,
      components: componentList.value.length,
      layouts: layoutList.value.length,
      sample: allComponents[0],
    })
  }

  /**
   * Loads registered default layouts for interactive questions.
   *
   * @returns {Promise<void>}
   */
  async function loadDefaultLayouts() {
    const data = await api.getDefaultLayout()
    defaultLayouts.value = data.layouts || []
  }

  /**
   * Updates the currently active requirement category.
   *
   * @param {string} categoryId
   * @returns {void}
   */
  function setCategory(categoryId) {
    activeCategoryId.value = categoryId
  }

  /**
   * Stores the answer payload for a question.
   *
   * @param {string} questionId
   * @param {object} answer
   * @returns {void}
   */
  function setAnswer(questionId, answer) {
    answers.value[questionId] = answer
  }

  /**
   * Gets the stored answer payload for a question.
   *
   * @param {string} questionId
   * @returns {object | null}
   */
  function getAnswer(questionId) {
    return answers.value[questionId] || null
  }

  /**
   * Serializes and submits all collected answers to the backend.
   *
   * @returns {Promise<any>}
   */
  async function submitResults() {
    const answerList = Object.values(answers.value)
    const result = {
      project: projectInfo.value,
      submittedAt: new Date().toISOString(),
      answers: answerList,
    }
    return await api.saveResults(result)
  }

  /**
   * Loads previously saved answers and hydrates the local answer map.
   *
   * @returns {Promise<void>}
   */
  async function loadResults() {
    const data = await api.getResults()
    if (data.answers?.length) {
      for (const answer of data.answers) {
        answers.value[answer.questionId] = answer
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
