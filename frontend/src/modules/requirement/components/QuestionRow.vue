<script setup>
import { computed, ref } from 'vue'
import { useAppStore } from '../../../stores/app'
import { useSimulatorStore } from '../../../stores/simulator'

const props = defineProps({
  question: Object,
  categoryId: String,
})

const appStore = useAppStore()
const simStore = useSimulatorStore()

const currentAnswer = computed(() => appStore.getAnswer(props.question.id))

const textValue = ref(currentAnswer.value?.value || '')
const selectedOptions = ref(currentAnswer.value?.value || [])
const customInput = ref(currentAnswer.value?.customValue || '')

/**
 * Persists text answers into the shared answer store.
 *
 * @returns {void}
 */
function handleTextChange() {
  appStore.setAnswer(props.question.id, {
    questionId: props.question.id,
    categoryId: props.categoryId,
    type: 'text',
    value: textValue.value,
  })
}

/**
 * Persists checkbox answers into the shared answer store.
 *
 * @returns {void}
 */
function handleOptionSelect() {
  appStore.setAnswer(props.question.id, {
    questionId: props.question.id,
    categoryId: props.categoryId,
    type: 'option',
    value: [...selectedOptions.value],
    customValue: props.question.allowCustom ? customInput.value : undefined,
  })
}

/**
 * Persists custom option text for option questions.
 *
 * @returns {void}
 */
function handleCustomInput() {
  appStore.setAnswer(props.question.id, {
    questionId: props.question.id,
    categoryId: props.categoryId,
    type: 'option',
    value: [...selectedOptions.value],
    customValue: customInput.value,
  })
}

/**
 * Opens the simulator for the current interactive question and hydrates the
 * layout tree from either the saved answer or the registered default layout.
 *
 * @returns {void}
 */
function handleInteractive() {
  const defaultLayoutId = props.question.interactiveConfig?.defaultLayout || null
  const existingAnswer = currentAnswer.value

  simStore.previewMode = false
  simStore.paletteVisible = false
  simStore.selectedNodeId = null

  if (existingAnswer?.value?.nodes) {
    simStore.nodeTree = JSON.parse(JSON.stringify(existingAnswer.value.nodes))
  } else if (defaultLayoutId) {
    simStore.loadDefault(defaultLayoutId)
  } else {
    simStore.reset()
  }

  simStore.currentQuestionId = props.question.id
  appStore.simulatorVisible = true
}

/**
 * Serializes and stores the current simulator result for the active question.
 *
 * @returns {void}
 */
function saveInteractiveResult() {
  const result = simStore.getResult()
  appStore.setAnswer(props.question.id, {
    questionId: props.question.id,
    categoryId: props.categoryId,
    type: 'interactive',
    value: result,
  })
}
</script>

<template>
  <tr>
    <td>{{ question.text }}</td>
    <td style="font-size: 13px; color: #606266;">{{ question.purpose }}</td>
    <td>
      <template v-if="question.type === 'text'">
        <el-input
          v-model="textValue"
          placeholder="请输入"
          @input="handleTextChange"
        />
      </template>

      <template v-else-if="question.type === 'option'">
        <el-checkbox-group v-model="selectedOptions" @change="handleOptionSelect">
          <el-checkbox
            v-for="opt in question.options"
            :key="opt"
            :label="opt"
            :value="opt"
          />
        </el-checkbox-group>
        <el-input
          v-if="question.allowCustom && selectedOptions.includes('自定义')"
          v-model="customInput"
          placeholder="请输入自定义内容"
          style="margin-top: 8px;"
          @input="handleCustomInput"
        />
      </template>

      <template v-else-if="question.type === 'interactive'">
        <div style="display: flex; gap: 8px; align-items: center;">
          <el-button type="primary" size="small" @click="handleInteractive">
            打开模拟器设计
          </el-button>
          <el-button
            v-if="simStore.currentQuestionId === question.id"
            size="small"
            @click="saveInteractiveResult"
          >
            保存设计结果
          </el-button>
          <span v-if="currentAnswer?.value" style="font-size: 12px; color: #67c23a;">
            已设计
          </span>
        </div>
      </template>
    </td>
    <td style="font-size: 13px; color: #909399;">{{ question.note || '' }}</td>
  </tr>
</template>
