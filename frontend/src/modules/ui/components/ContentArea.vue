<script setup>
import { computed } from 'vue'
import { useAppStore } from '../../../stores/app'
import TableRenderer from '../../requirement/components/TableRenderer.vue'

const store = useAppStore()
const activeCategory = computed(() => {
  return store.categories.find(c => c.id === store.activeCategoryId) || null
})
</script>

<template>
  <div class="content-area">
    <div v-if="!activeCategory" style="color: #909399; text-align: center; padding-top: 40px;">
      请从左侧选择一个需求分类
    </div>
    <TableRenderer v-else :category="activeCategory" />
  </div>
</template>
