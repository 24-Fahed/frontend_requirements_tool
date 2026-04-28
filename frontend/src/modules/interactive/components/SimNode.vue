<script setup>
import {
  computed,
  inject,
  shallowRef,
  watch,
} from 'vue'
import draggable from 'vuedraggable'
import {
  RUNTIME_CONTEXT_KEY,
  resolveRuntimeComponent,
} from '../services/componentLoader'

import SimNode from './SimNode.vue'

const props = defineProps({
  node: {
    type: Object,
    required: true,
  },
  metaMap: {
    type: Object,
    required: true,
  },
  selectedNodeId: {
    type: String,
    default: null,
  },
})

const emit = defineEmits(['select', 'delete'])

const runtimeComponent = shallowRef(null)
const runtimeContext = inject(RUNTIME_CONTEXT_KEY)

const meta = computed(() => props.metaMap.get(props.node.type) || null)
const isContainer = computed(() => Array.isArray(props.node.children))
const isSelected = computed(() => props.selectedNodeId === props.node.id)

const normalizedProps = computed(() => {
  const rawProps = props.node.props || {}
  const propDefs = meta.value?.props || []
  const result = {}

  for (const [key, value] of Object.entries(rawProps)) {
    if (key === 'items') {
      result[key] = Array.isArray(value)
        ? value
        : String(value)
          .replaceAll('，', ',')
          .split(',')
          .map(item => item.trim())
          .filter(Boolean)
      continue
    }

    const propDef = propDefs.find(item => item.name === key)
    if (propDef?.type === 'number') {
      result[key] = Number(value)
      continue
    }

    if (propDef?.type === 'boolean' || ['bold', 'plain', 'square', 'block', 'isLink'].includes(key)) {
      result[key] = value === true || value === 'true'
      continue
    }

    result[key] = value
  }

  return result
})

/**
 * Loads the runtime Vue component matching the current node metadata.
 *
 * @returns {Promise<void>}
 */
async function loadRuntimeComponent() {
  runtimeComponent.value = await resolveRuntimeComponent(meta.value, runtimeContext)
}

const isBuiltinContainer = computed(() => {
  if (!isContainer.value) return false
  const tag = meta.value?.componentTag || props.node.type
  return ['VStack', 'HStack', 'Grid2Col'].includes(tag)
})

const containerStyle = computed(() => {
  if (!isBuiltinContainer.value) return {}
  const tag = meta.value?.componentTag || props.node.type
  const p = normalizedProps.value
  const gap = Number(p.gap ?? 8)
  const padding = Number(p.padding ?? 0)
  const base = { width: '100%', minHeight: '40px' }

  switch (tag) {
    case 'VStack':
      return { ...base, display: 'flex', flexDirection: 'column', gap: `${gap}px`, padding: `${padding}px` }
    case 'HStack':
      return { ...base, display: 'flex', gap: `${gap}px`, alignItems: 'stretch' }
    case 'Grid2Col':
      return { ...base, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: `${gap}px` }
    default:
      return base
  }
})

watch(meta, loadRuntimeComponent, { immediate: true })
</script>

<template>
  <div
    class="sim-node"
    :class="{ selected: isSelected, 'drop-zone-active': isContainer }"
    :data-node-id="node.id"
    :data-is-container="String(isContainer)"
    @click.stop="emit('select', node.id)"
  >
    <span class="delete-btn" @click.stop="emit('delete', node.id)">&times;</span>
    <span class="node-label">{{ meta?.label || node.type }}</span>

    <draggable
      v-if="isBuiltinContainer"
      :list="node.children"
      group="sim"
      item-key="id"
      :style="containerStyle"
    >
      <template #item="{ element }">
        <SimNode
          :node="element"
          :meta-map="metaMap"
          :selected-node-id="selectedNodeId"
          @select="emit('select', $event)"
          @delete="emit('delete', $event)"
        />
      </template>
    </draggable>

    <component
      v-else-if="runtimeComponent && isContainer"
      :is="runtimeComponent"
      v-bind="normalizedProps"
    >
      <template #default>
        <draggable
          :list="node.children"
          group="sim"
          item-key="id"
          style="min-height: 40px"
        >
          <template #item="{ element }">
            <SimNode
              :node="element"
              :meta-map="metaMap"
              :selected-node-id="selectedNodeId"
              @select="emit('select', $event)"
              @delete="emit('delete', $event)"
            />
          </template>
        </draggable>
      </template>
    </component>

    <component
      v-else-if="runtimeComponent"
      :is="runtimeComponent"
      v-bind="normalizedProps"
    />

    <div v-else class="sim-node-fallback">
      <div class="sim-node-fallback__title">{{ node.type }}</div>
      <div v-if="Object.keys(normalizedProps).length" class="sim-node-fallback__props">
        {{ JSON.stringify(normalizedProps) }}
      </div>
      <draggable
        v-if="isContainer"
        :list="node.children"
        group="sim"
        item-key="id"
        :style="containerStyle"
      >
        <template #item="{ element }">
          <SimNode
            :node="element"
            :meta-map="metaMap"
            :selected-node-id="selectedNodeId"
            @select="emit('select', $event)"
            @delete="emit('delete', $event)"
          />
        </template>
      </draggable>
    </div>
  </div>
</template>
