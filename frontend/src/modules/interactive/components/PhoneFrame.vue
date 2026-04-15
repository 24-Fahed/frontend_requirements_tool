<script setup>
import {
  computed,
  defineComponent,
  h,
  onMounted,
  onBeforeUnmount,
  ref,
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

const phoneScreenRef = ref(null)
const allMetas = computed(() => [...appStore.componentList, ...appStore.layoutList])
const metaMap = computed(() => {
  const entries = allMetas.value.map(item => [item.name, item])
  return new Map(entries)
})

function findSource(sourceType, sourceName) {
  const list = sourceType === 'layout' ? appStore.layoutList : appStore.componentList
  return list.find(item => item.name === sourceName) || null
}

function isOverPhoneScreen(event) {
  const el = phoneScreenRef.value
  if (!el) return false
  const rect = el.getBoundingClientRect()
  return event.clientX >= rect.left && event.clientX <= rect.right &&
         event.clientY >= rect.top && event.clientY <= rect.bottom
}

// document 级别 dragover：无条件 preventDefault，绕过 overlay 阻挡
// 注意：dragover 期间 dataTransfer.getData 可能返回空，不能依赖它
function onDocDragOver(event) {
  if (isOverPhoneScreen(event)) {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'copy'
    console.log('[PhoneFrame] doc dragover (在 phone-screen 上方)')
  }
}

// 在 phone-screen 内查找鼠标下方最深的 SimNode 节点（容器或非容器）
function findDropTarget(x, y) {
  const allNodes = document.querySelectorAll('.sim-node[data-node-id]')
  let target = null
  let targetArea = Infinity
  for (const el of allNodes) {
    const rect = el.getBoundingClientRect()
    if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
      const area = rect.width * rect.height
      if (area < targetArea) {
        targetArea = area
        target = el
      }
    }
  }
  if (!target) return { nodeId: null, isContainer: false }
  return {
    nodeId: target.dataset.nodeId,
    isContainer: target.dataset.isContainer === 'true',
  }
}

// document 级别 drop：坐标落在 phone-screen 内则处理
function onDocDrop(event) {
  if (!isOverPhoneScreen(event)) return
  event.preventDefault()
  const { nodeId: targetId, isContainer } = findDropTarget(event.clientX, event.clientY)
  console.log('[PhoneFrame] doc drop, target:', targetId, 'isContainer:', isContainer)
  const payload = decodeDragPayload(event.dataTransfer.getData('text/plain'))
  applyDragPayload(payload, targetId, isContainer)
}

// 统一的拖拽结果处理
// operation: 'swap' | 'move-into' | 'add-to-container' | 'add-to-root'
function applyDragPayload(payload, targetNodeId = null, isTargetContainer = false) {
  console.log('[PhoneFrame] applyDragPayload', { payload, targetNodeId, isTargetContainer })
  if (!payload) {
    console.warn('[PhoneFrame] applyDragPayload: payload 为空')
    return
  }

  if (payload.kind === 'existing-node') {
    // 内部拖拽
    if (!isTargetContainer && targetNodeId) {
      // 落在非容器节点上 → 交换
      console.log('[PhoneFrame] swap:', payload.nodeId, '↔', targetNodeId)
      simStore.swapNodes(payload.nodeId, targetNodeId)
    } else {
      // 落在容器上或空白处 → 移入容器
      console.log('[PhoneFrame] moveNode:', payload.nodeId, '→ container:', targetNodeId)
      simStore.moveNode(payload.nodeId, targetNodeId)
    }
    return
  }

  // 外部拖入（palette-item）
  const source = findSource(payload.sourceType, payload.sourceName)
  if (!source) {
    console.warn('[PhoneFrame] 未找到 source:', payload.sourceType, payload.sourceName)
    return
  }

  if (isTargetContainer && targetNodeId) {
    // 落在容器上 → 加入容器
    simStore.addNode(targetNodeId, source)
  } else {
    // 落在空白或非容器上 → 加到根
    simStore.addNode(null, source)
  }
  console.log('[PhoneFrame] addNode 完成, nodeTree:', JSON.parse(JSON.stringify(simStore.nodeTree)))
}

// phone-screen 上的 dragover/drop 保留给内部 SimNode 拖拽（不经过 overlay）
function onScreenDragOver(event) {
  event.preventDefault()
  event.dataTransfer.dropEffect = event.dataTransfer.effectAllowed === 'move' ? 'move' : 'copy'
}

function onScreenDrop(event) {
  console.log('[PhoneFrame] screen drop (空白区域)')
  event.preventDefault()
  const payload = decodeDragPayload(event.dataTransfer.getData('text/plain'))
  // 落在 phone-screen 空白处 → 加到根
  applyDragPayload(payload, null, false)
}

// 落在容器 SimNode 上 → 移入容器
function handleDropOnNode(payload) {
  const { dragPayload, parentId } = payload
  applyDragPayload(dragPayload, parentId, true)
}

// 落在非容器 SimNode 上 → 交换
function handleSwap(payload) {
  const { dragPayload, targetNodeId } = payload
  applyDragPayload(dragPayload, targetNodeId, false)
}

function selectNode(nodeId) {
  simStore.selectedNodeId = nodeId === simStore.selectedNodeId ? null : nodeId
}

onMounted(async () => {
  await preloadComponentLibraries(allMetas.value)
  // document 级别监听，绕过 el-overlay 对事件的拦截
  document.addEventListener('dragover', onDocDragOver)
  document.addEventListener('drop', onDocDrop)
  console.log('[PhoneFrame] mounted, doc-level drag listeners registered')
})

onBeforeUnmount(() => {
  document.removeEventListener('dragover', onDocDragOver)
  document.removeEventListener('drop', onDocDrop)
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
  emits: ['select', 'delete', 'drop-on', 'swap'],
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
      console.log('[SimNode] loadRuntimeComponent', {
        nodeId: props.node.id,
        type: props.node.type,
        hasMeta: !!meta.value,
        resolved: !!runtimeComponent.value,
        isContainer: isContainer.value,
        childrenCount: props.node.children?.length,
      })
    }

    function handleDragOver(event) {
      // 所有节点都必须 preventDefault，否则浏览器不会触发 drop 事件
      event.preventDefault()
      if (isContainer.value) {
        event.stopPropagation()
      }
      event.dataTransfer.dropEffect = event.dataTransfer.effectAllowed === 'move' ? 'move' : 'copy'
    }

    function handleDrop(event) {
      console.log('[SimNode] drop', {
        nodeId: props.node.id,
        type: props.node.type,
        isContainer: isContainer.value,
      })
      event.preventDefault()
      event.stopPropagation()

      const dragPayload = decodeDragPayload(event.dataTransfer.getData('text/plain'))
      if (!dragPayload) return

      if (isContainer.value) {
        // 容器节点：移入
        emit('drop-on', { dragPayload, parentId: props.node.id })
      } else {
        // 非容器节点：交换
        emit('swap', { dragPayload, targetNodeId: props.node.id })
      }
    }

    function handleDragStart(event) {
      console.log('[SimNode] dragstart', {
        nodeId: props.node.id,
        type: props.node.type,
      })
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
          onSwap: (payload) => emit('swap', payload),
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
        'data-node-id': props.node.id,
        'data-is-container': String(isContainer.value),
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
      ref="phoneScreenRef"
      class="phone-screen"
      @dragover="onScreenDragOver"
      @drop="onScreenDrop"
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
        @swap="handleSwap"
      />
    </div>
    <div class="phone-home-indicator"></div>
  </div>
</template>
