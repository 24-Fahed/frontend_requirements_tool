import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAppStore } from './app'

export const useSimulatorStore = defineStore('simulator', () => {
  // 当前节点树
  const nodeTree = ref([])

  // 当前关联的问题ID
  const currentQuestionId = ref(null)

  // 选中的节点ID
  const selectedNodeId = ref(null)

  // 节点ID计数器
  let idCounter = 0
  function generateId() {
    return `node_${++idCounter}_${Date.now()}`
  }

  // 加载默认布局
  function loadDefault(layoutId) {
    const store = useAppStore()
    const layout = store.defaultLayouts.find(l => l.id === layoutId)
    if (layout?.nodes) {
      nodeTree.value = deepClone(layout.nodes)
    } else {
      nodeTree.value = []
    }
  }

  // 打开模拟器关联问题
  function openForQuestion(questionId, defaultLayoutId) {
    currentQuestionId.value = questionId
    selectedNodeId.value = null
    if (defaultLayoutId) {
      loadDefault(defaultLayoutId)
    }
  }

  // 添加节点
  function addNode(parentId, node) {
    const newNode = {
      id: generateId(),
      type: node.name || node.type,
      props: node.defaultProps ? { ...node.defaultProps } : {},
      children: node.isContainer ? [] : undefined,
    }

    if (!parentId || parentId === 'root') {
      nodeTree.value.push(newNode)
    } else {
      const parent = findNode(nodeTree.value, parentId)
      if (parent?.children) {
        parent.children.push(newNode)
      } else {
        nodeTree.value.push(newNode)
      }
    }
    return newNode
  }

  // 删除节点
  function removeNode(nodeId) {
    removeFromTree(nodeTree.value, nodeId)
    if (selectedNodeId.value === nodeId) {
      selectedNodeId.value = null
    }
  }

  // 移动节点
  function moveNode(nodeId, targetParentId, index) {
    const node = extractFromTree(nodeTree.value, nodeId)
    if (!node) return

    if (!targetParentId || targetParentId === 'root') {
      nodeTree.value.splice(index ?? nodeTree.value.length, 0, node)
    } else {
      const parent = findNode(nodeTree.value, targetParentId)
      if (parent?.children) {
        parent.children.splice(index ?? parent.children.length, 0, node)
      }
    }
  }

  // 更新节点属性
  function updateNodeProps(nodeId, props) {
    const node = findNode(nodeTree.value, nodeId)
    if (node) {
      node.props = { ...node.props, ...props }
    }
  }

  // 重置
  function reset() {
    nodeTree.value = []
    currentQuestionId.value = null
    selectedNodeId.value = null
  }

  // 获取结果
  function getResult() {
    return { nodes: deepClone(nodeTree.value) }
  }

  // 辅助函数
  function findNode(nodes, id) {
    for (const node of nodes) {
      if (node.id === id) return node
      if (node.children) {
        const found = findNode(node.children, id)
        if (found) return found
      }
    }
    return null
  }

  function removeFromTree(nodes, id) {
    const idx = nodes.findIndex(n => n.id === id)
    if (idx !== -1) {
      nodes.splice(idx, 1)
      return true
    }
    for (const node of nodes) {
      if (node.children && removeFromTree(node.children, id)) return true
    }
    return false
  }

  function extractFromTree(nodes, id) {
    const idx = nodes.findIndex(n => n.id === id)
    if (idx !== -1) {
      return nodes.splice(idx, 1)[0]
    }
    for (const node of nodes) {
      if (node.children) {
        const extracted = extractFromTree(node.children, id)
        if (extracted) return extracted
      }
    }
    return null
  }

  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj))
  }

  return {
    nodeTree,
    currentQuestionId,
    selectedNodeId,
    loadDefault,
    openForQuestion,
    addNode,
    removeNode,
    moveNode,
    updateNodeProps,
    reset,
    getResult,
  }
})
