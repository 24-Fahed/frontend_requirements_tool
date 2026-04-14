<script setup>
import { ref } from 'vue'
import { useAppStore } from '../../../stores/app'

const store = useAppStore()
const activeTab = ref('component')

function handleClose() {
  store.drawerOpen = false
}
</script>

<template>
  <el-drawer
    v-model="store.drawerOpen"
    title="组件与布局面板"
    direction="rtl"
    size="300px"
    :before-close="handleClose"
  >
    <el-tabs v-model="activeTab">
      <el-tab-pane label="组件" name="component">
        <div
          v-for="comp in store.componentList"
          :key="comp.name"
          class="drawer-card"
          draggable="true"
          @dragstart="$event.dataTransfer.setData('type', 'component'); $event.dataTransfer.setData('name', comp.name)"
        >
          <div><strong>{{ comp.label }}</strong></div>
          <div style="font-size: 11px; color: #909399;">{{ comp.category }} - {{ comp.name }}</div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="布局" name="layout">
        <div
          v-for="layout in store.layoutList"
          :key="layout.name"
          class="drawer-card"
          draggable="true"
          @dragstart="$event.dataTransfer.setData('type', 'layout'); $event.dataTransfer.setData('name', layout.name)"
        >
          <div><strong>{{ layout.label }}</strong></div>
          <div style="font-size: 11px; color: #909399;">{{ layout.isContainer ? '容器' : '非容器' }}</div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-drawer>
</template>
