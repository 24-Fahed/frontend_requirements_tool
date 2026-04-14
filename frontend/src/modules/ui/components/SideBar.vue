<script setup>
import { computed } from 'vue'
import { useAppStore } from '../../../stores/app'

const store = useAppStore()
const sortedCategories = computed(() => {
  return [...store.categories].sort((a, b) => (a.order || 0) - (b.order || 0))
})

function selectCategory(id) {
  store.setCategory(id)
}
</script>

<template>
  <div class="sidebar" :class="{ collapsed: store.sidebarCollapsed }">
    <div
      v-for="cat in sortedCategories"
      :key="cat.id"
      class="category-item"
      :class="{ active: store.activeCategoryId === cat.id }"
      @click="selectCategory(cat.id)"
    >
      {{ cat.name }}
    </div>
  </div>
</template>
