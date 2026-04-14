<script setup>
import { useAppStore } from '../../../stores/app'
import { useSimulatorStore } from '../../../stores/simulator'
import QuestionRow from './QuestionRow.vue'

const props = defineProps({
  category: Object,
})

const appStore = useAppStore()
const simStore = useSimulatorStore()
</script>

<template>
  <div>
    <h2 style="margin-bottom: 16px; font-size: 18px;">{{ category.name }}</h2>
    <table class="req-table">
      <thead>
        <tr>
          <th style="width: 30%;">问题</th>
          <th style="width: 15%;">目的</th>
          <th style="width: 35%;">回答</th>
          <th style="width: 20%;">备注</th>
        </tr>
      </thead>
      <tbody>
        <QuestionRow
          v-for="q in category.questions"
          :key="q.id"
          :question="q"
          :category-id="category.id"
        />
      </tbody>
    </table>
  </div>
</template>
