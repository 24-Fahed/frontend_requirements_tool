<script setup>
import {
  computed,
  defineComponent,
  h,
  onMounted,
  shallowRef,
  watch,
} from 'vue'
import { useSimulatorStore } from '../../../stores/simulator'
import { useAppStore } from '../../../stores/app'
import {
  preloadComponentLibraries,
  resolveRuntimeComponent,
} from '../services/componentLoader'
import {
  decodeDragPayload,
} from '../services/dragPayload'

const simStore = useSimulatorStore()
const appStore = useAppStore()

const allMetas = computed(() => [...appStore.componentList, ...appStore.layoutList])
const metaMap = computed(() => {
  const entries = allMetas.value.map(item => [item.name, item])
  return new Map(entries)
})

function findSource(sourceType, sourceName) {
  const list = sourceType === 'layout' ? appStore.layoutList : appStore.componentList
  return list.find(item => item.name === sourceName) || null
}

function onDragOver(event) {
  event.preventDefault()
  const payload = decodeDragPayload(event.dataTransfer.getData('text/plain'))
  event.dataTransfer.dropEffect = payload?.kind === 'existing-node' ? 'move' : 'copy'
}

function applyDragPayload(payload, parentId = null) {
  if (!payload) {
    return
  }

  if (payload.kind === 'existing-node') {
    simStore.moveNode(payload.nodeId, parentId)
    return
  }

  const source = findSource(payload.sourceType, payload.sourceName)

  if (!source) {
    return
  }

  simStore.addNode(parentId, source)
}

function onDrop(event) {
  event.preventDefault()
  const payload = decodeDragPayload(event.dataTransfer.getData('text/plain'))
  applyDragPayload(payload, null)
}

function handleDropOnNode(payload, parentId) {
  const dropEvent = payload?.event || payload
  const targetParentId = payload?.parentId ?? parentId
  dropEvent.preventDefault()
  dropEvent.stopPropagation()
  const dragPayload = decodeDragPayload(dropEvent.dataTransfer.getData('text/plain'))
  applyDragPayload(dragPayload, targetParentId)
}

function selectNode(nodeId) {
  simStore.selectedNodeId = nodeId === simStore.selectedNodeId ? null : nodeId
}

onMounted(async () => {
  await preloadComponentLibraries(allMetas.value)
})

watch(allMetas, async (value) => {
  await preloadComponentLibraries(value)
}, { deep: true })

const SimNode = defineComponent({
  name: 'SimNode',
  props: {
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
  },
  emits: ['select', 'delete', 'drop-on'],
  setup(props, { emit }) {
    const runtimeComponent = shallowRef(null)

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

    async function loadRuntimeComponent() {
      runtimeComponent.value = await resolveRuntimeComponent(meta.value)
    }

    function handleDragOver(event) {
      if (!isContainer.value) {
        return
      }
      event.preventDefault()
      event.stopPropagation()
      const payload = decodeDragPayload(event.dataTransfer.getData('text/plain'))
      event.dataTransfer.dropEffect = payload?.kind === 'existing-node' ? 'move' : 'copy'
    }

    function handleDrop(event) {
      if (!isContainer.value) {
        return
      }
      event.preventDefault()
      event.stopPropagation()
      emit('drop-on', { event, parentId: props.node.id })
    }

    function handleDragStart(event) {
      event.stopPropagation()
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('text/plain', JSON.stringify({
        kind: 'existing-node',
        nodeId: props.node.id,
      }))
    }

    watch(meta, loadRuntimeComponent, { immediate: true })

    return () => {
      const childNodes = (props.node.children || []).map(child =>
        h(SimNode, {
          key: child.id,
          node: child,
          metaMap: props.metaMap,
          selectedNodeId: props.selectedNodeId,
          onSelect: (nodeId) => emit('select', nodeId),
          onDelete: (nodeId) => emit('delete', nodeId),
          onDropOn: (payload) => emit('drop-on', payload),
        })
      )

      const renderedContent = runtimeComponent.value
        ? h(runtimeComponent.value, normalizedProps.value, isContainer.value ? {
          default: () => childNodes,
        } : undefined)
        : h('div', { class: 'sim-node-fallback' }, [
          h('div', { class: 'sim-node-fallback__title' }, props.node.type),
          Object.keys(normalizedProps.value).length
            ? h('div', { class: 'sim-node-fallback__props' }, JSON.stringify(normalizedProps.value))
            : null,
          ...childNodes,
        ])

      return h('div', {
        class: ['sim-node', { selected: isSelected.value, 'drop-zone-active': isContainer.value }],
        onClick: (event) => {
          event.stopPropagation()
          emit('select', props.node.id)
        },
        draggable: true,
        onDragstart: handleDragStart,
        onDragover: handleDragOver,
        onDrop: handleDrop,
      }, [
        h('span', {
          class: 'delete-btn',
          onClick: (event) => {
            event.stopPropagation()
            emit('delete', props.node.id)
          },
        }, '×'),
        h('span', { class: 'node-label' }, meta.value?.label || props.node.type),
        renderedContent,
      ])
    }
  },
})
</script>

<template>
  <div class="phone-frame">
    <div class="phone-status-bar">Simulator</div>
    <div
      class="phone-screen"
      @dragover="onDragOver"
      @drop="onDrop"
    >
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
        @drop-on="handleDropOnNode"
      />
    </div>
    <div class="phone-home-indicator"></div>
  </div>
</template>
