<script setup>
import { computed } from 'vue'
import { useSimulatorStore } from '../../../stores/simulator'
import { useAppStore } from '../../../stores/app'

const simStore = useSimulatorStore()
const appStore = useAppStore()

// 获取节点对应的组件信息
function getComponentInfo(type) {
  return appStore.componentList.find(c => c.name === type)
    || appStore.layoutList.find(l => l.name === type)
}

// 处理拖拽放置
function onDragOver(e) {
  e.preventDefault()
  e.dataTransfer.dropEffect = 'copy'
}

function onDrop(e) {
  e.preventDefault()
  const type = e.dataTransfer.getData('type')
  const name = e.dataTransfer.getData('name')

  if (!name) return

  let source
  if (type === 'component') {
    source = appStore.componentList.find(c => c.name === name)
  } else if (type === 'layout') {
    source = appStore.layoutList.find(l => l.name === name)
  }

  if (source) {
    simStore.addNode(null, source)
  }
}

// 渲染节点树
function renderNode(node) {
  const info = getComponentInfo(node.type)
  const label = info?.label || node.type

  return { node, info, label }
}

function selectNode(nodeId) {
  simStore.selectedNodeId = nodeId === simStore.selectedNodeId ? null : nodeId
}

function handleDropOnNode(e, parentId) {
  e.preventDefault()
  e.stopPropagation()
  const type = e.dataTransfer.getData('type')
  const name = e.dataTransfer.getData('name')

  if (!name) return

  let source
  if (type === 'component') {
    source = appStore.componentList.find(c => c.name === name)
  } else if (type === 'layout') {
    source = appStore.layoutList.find(l => l.name === name)
  }

  if (source) {
    simStore.addNode(parentId, source)
  }
}
</script>

<template>
  <div class="phone-frame">
    <div class="phone-status-bar">模拟器</div>
    <div
      class="phone-screen"
      @dragover="onDragOver"
      @drop="onDrop"
    >
      <template v-if="simStore.nodeTree.length === 0">
        <div style="color: #c0c4cc; text-align: center; padding: 40px 16px; font-size: 13px;">
          从右侧面板拖动组件或布局到此处
        </div>
      </template>
      <template v-for="node in simStore.nodeTree" :key="node.id">
        <SimNode
          :node="node"
          :selected="simStore.selectedNodeId === node.id"
          @select="selectNode"
          @delete="simStore.removeNode($event)"
          @drop-on="handleDropOnNode"
        />
      </template>
    </div>
    <div class="phone-home-indicator"></div>
  </div>
</template>

<script>
import { h, defineComponent } from 'vue'

// 递归渲染节点组件
const SimNode = defineComponent({
  name: 'SimNode',
  props: {
    node: Object,
    selected: Boolean,
  },
  emits: ['select', 'delete', 'drop-on'],
  setup(props, { emit }) {
    function getLabel(type) {
      return type
    }

    function onDragOver(e) {
      e.preventDefault()
      e.stopPropagation()
      e.dataTransfer.dropEffect = 'copy'
    }

    function onDrop(e) {
      e.preventDefault()
      e.stopPropagation()
      emit('drop-on', e, props.node.id)
    }

    return () => {
      const children = []
      if (props.node.children?.length) {
        children.push(
          ...props.node.children.map(child =>
            h(SimNode, {
              node: child,
              selected: false,
              onSelect: (id) => emit('select', id),
              onDelete: (id) => emit('delete', id),
              onDropOn: (e, parentId) => emit('drop-on', e, parentId),
              key: child.id,
            })
          )
        )
      }

      const propText = props.node.props
        ? Object.entries(props.node.props)
            .filter(([, v]) => v !== undefined && v !== '')
            .map(([k, v]) => `${k}: ${v}`)
            .join(', ')
        : ''

      return h('div', {
        class: ['sim-node', { selected: props.selected, 'drop-zone-active': props.node.children !== undefined }],
        onClick: (e) => { e.stopPropagation(); emit('select', props.node.id) },
        onDragover: props.node.children !== undefined ? onDragOver : undefined,
        onDrop: props.node.children !== undefined ? onDrop : undefined,
      }, [
        h('span', { class: 'delete-btn', onClick: (e) => { e.stopPropagation(); emit('delete', props.node.id) } }, '×'),
        h('span', { class: 'node-label' }, getLabel(props.node.type)),
        h('div', { style: 'padding: 4px; font-size: 12px; pointer-events: none;' }, [
          h('div', { style: 'font-weight: 500;' }, props.node.type),
          propText ? h('div', { style: 'color: #909399; font-size: 11px; margin-top: 2px;' }, propText) : null,
        ]),
        ...children,
      ])
    }
  },
})

export default { name: 'PhoneFrame' }
</script>
