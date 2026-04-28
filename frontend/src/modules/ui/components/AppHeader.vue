<script setup>
import { useAppStore } from '../../../stores/app'

const store = useAppStore()

function toggleSidebar() {
  store.sidebarCollapsed = !store.sidebarCollapsed
}

function toggleSimulator() {
  store.simulatorVisible = !store.simulatorVisible
}

async function handleExport() {
  await store.submitResults()
  alert('需求结果已保存')
}
</script>

<template>
  <div class="app-header">
    <h1>{{ store.projectInfo.name || '需求收集工具' }}</h1>
    <div class="toolbar">
      <el-button size="small" type="primary" plain @click="toggleSidebar">
        {{ store.sidebarCollapsed ? '展开侧栏' : '收起侧栏' }}
      </el-button>
      <el-button size="small" type="primary" plain @click="toggleSimulator">
        {{ store.simulatorVisible ? '隐藏模拟器' : '显示模拟器' }}
      </el-button>
      <el-button size="small" type="success" @click="handleExport">
        保存结果
      </el-button>
    </div>
  </div>
</template>
