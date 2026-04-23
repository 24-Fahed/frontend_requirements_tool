<script setup>
import { computed, onMounted, watch } from 'vue'
import { useSimulatorStore } from '../../../stores/simulator'
import { useAppStore } from '../../../stores/app'
import {
  preloadComponentLibraries,
} from '../services/componentLoader'
import SimNode from './SimNode.vue'

const simStore = useSimulatorStore()
const appStore = useAppStore()

const allMetas = computed(() => [...appStore.componentList, ...appStore.layoutList])
const metaMap = computed(() => {
  const entries = allMetas.value.map(item => [item.name, item])
  return new Map(entries)
})

function selectNode(nodeId) {
  simStore.selectedNodeId = nodeId === simStore.selectedNodeId ? null : nodeId
}

onMounted(async () => {
  await preloadComponentLibraries(allMetas.value)
})

watch(allMetas, async (value) => {
  await preloadComponentLibraries(value)
}, { deep: true })
</script>

<template>
  <div class="phone-frame">
    <div class="phone-status-bar">Simulator</div>
    <div class="phone-screen">
      <template v-if="simStore.nodeTree.length === 0">
        <div class="phone-empty-state">
          Drag components or layouts here from the right panel
        </div>
      </template>

      <SimNode
        v-for="node in simStore.nodeTree"
        :key="node.id"
        :node="node"
        :meta-map="metaMap"
        :selected-node-id="simStore.selectedNodeId"
        @select="selectNode"
        @delete="simStore.removeNode($event)"
      />
    </div>
    <div class="phone-home-indicator"></div>
  </div>
</template>
