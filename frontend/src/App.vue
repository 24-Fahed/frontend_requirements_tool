<script setup>
import { onMounted } from 'vue'
import { useAppStore } from './stores/app'
import AppHeader from './modules/ui/components/AppHeader.vue'
import SideBar from './modules/ui/components/SideBar.vue'
import ContentArea from './modules/ui/components/ContentArea.vue'
import SimulatorArea from './modules/ui/components/SimulatorArea.vue'

const store = useAppStore()

onMounted(async () => {
  await Promise.all([
    store.loadRequirements(),
    store.loadComponents(),
    store.loadDefaultLayouts(),
    store.loadResults(),
  ])
})
</script>

<template>
  <div class="app-container">
    <AppHeader />
    <div class="app-body">
      <SideBar />
      <ContentArea />
      <SimulatorArea />
    </div>
  </div>
</template>
