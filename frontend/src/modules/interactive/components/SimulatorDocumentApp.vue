<script setup>
import { computed, provide, watch } from 'vue'
import { useSimulatorStore } from '../../../stores/simulator'
import { useAppStore } from '../../../stores/app'
import {
  RUNTIME_CONTEXT_KEY,
  preloadComponentLibraries,
} from '../services/componentLoader'
import ComponentPanel from './ComponentPanel.vue'
import SimulatorTopBar from './SimulatorTopBar.vue'
import SimNode from './SimNode.vue'

const props = defineProps({
  runtimeContext: {
    type: Object,
    required: true,
  },
})

const simStore = useSimulatorStore()
const appStore = useAppStore()

provide(RUNTIME_CONTEXT_KEY, props.runtimeContext)

const allMetas = computed(() => [...appStore.componentList, ...appStore.layoutList])
const metaMap = computed(() => {
  const entries = allMetas.value.map(item => [item.name, item])
  return new Map(entries)
})

/**
 * Toggles the current node selection for the in-document editor canvas.
 *
 * @param {string} nodeId
 * @returns {void}
 */
function selectNode(nodeId) {
  simStore.selectedNodeId = nodeId === simStore.selectedNodeId ? null : nodeId
}

watch(allMetas, async (value) => {
  await preloadComponentLibraries(value, props.runtimeContext)
}, { deep: true, immediate: true })
</script>

<template>
  <div class="simulator-document" :class="{ 'simulator-document--preview': simStore.previewMode }">
    <SimulatorTopBar />
    <div class="simulator-workspace">
      <div class="phone-screen">
        <template v-if="simStore.nodeTree.length === 0">
          <div class="phone-empty-state">
            Drag components or layouts here from the simulator palette
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
      <ComponentPanel />
    </div>
    <div class="phone-home-indicator"></div>
  </div>
</template>
