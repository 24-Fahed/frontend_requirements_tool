import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAppStore } from './app'

export const useSimulatorStore = defineStore('simulator', () => {
  const nodeTree = ref([])
  const currentQuestionId = ref(null)
  const selectedNodeId = ref(null)
  const previewMode = ref(false)
  const paletteVisible = ref(false)

  let idCounter = 0

  /**
   * Toggles simulator preview mode and hides editing affordances when entering
   * preview mode.
   *
   * @returns {void}
   */
  function togglePreview() {
    previewMode.value = !previewMode.value
    selectedNodeId.value = null
    if (previewMode.value) {
      paletteVisible.value = false
    }
  }

  /**
   * Toggles the visibility of the simulator-internal component palette.
   *
   * @returns {void}
   */
  function togglePalette() {
    if (previewMode.value) {
      previewMode.value = false
    }
    paletteVisible.value = !paletteVisible.value
  }

  /**
   * Generates a unique layout node identifier.
   *
   * @returns {string}
   */
  function generateId() {
    return `node_${++idCounter}_${Date.now()}`
  }

  /**
   * Loads a predefined layout into the current simulator tree.
   *
   * @param {string} layoutId
   * @returns {void}
   */
  function loadDefault(layoutId) {
    const store = useAppStore()
    const layout = store.defaultLayouts.find(item => item.id === layoutId)
    nodeTree.value = layout?.nodes ? deepClone(layout.nodes) : []
  }

  /**
   * Opens the simulator for a specific interactive question and resets editor
   * affordances.
   *
   * @param {string} questionId
   * @param {string | null} [defaultLayoutId]
   * @returns {void}
   */
  function openForQuestion(questionId, defaultLayoutId = null) {
    currentQuestionId.value = questionId
    selectedNodeId.value = null
    previewMode.value = false
    paletteVisible.value = false

    if (defaultLayoutId) {
      loadDefault(defaultLayoutId)
    }
  }

  /**
   * Adds a new node into the current layout tree.
   *
   * @param {string | null} parentId
   * @param {{name?: string, type?: string, defaultProps?: object, isContainer?: boolean}} node
   * @returns {object}
   */
  function addNode(parentId, node) {
    const newNode = {
      id: generateId(),
      type: node.name || node.type,
      props: node.defaultProps ? { ...node.defaultProps } : {},
      children: node.isContainer ? [] : undefined,
    }

    if (!parentId || parentId === 'root') {
      nodeTree.value.push(newNode)
      return newNode
    }

    const parent = findNode(nodeTree.value, parentId)
    if (parent?.children) {
      parent.children.push(newNode)
    } else {
      nodeTree.value.push(newNode)
    }
    return newNode
  }

  /**
   * Removes a node from the layout tree.
   *
   * @param {string} nodeId
   * @returns {void}
   */
  function removeNode(nodeId) {
    removeFromTree(nodeTree.value, nodeId)
    if (selectedNodeId.value === nodeId) {
      selectedNodeId.value = null
    }
  }

  /**
   * Moves an existing node into a new parent container and optional index.
   *
   * @param {string} nodeId
   * @param {string | null} targetParentId
   * @param {number} [index]
   * @returns {void}
   */
  function moveNode(nodeId, targetParentId, index) {
    if (!nodeId) return
    if (nodeId === targetParentId) return
    if (targetParentId && isDescendant(nodeId, targetParentId)) return

    const node = extractFromTree(nodeTree.value, nodeId)
    if (!node) return

    if (!targetParentId || targetParentId === 'root') {
      nodeTree.value.splice(index ?? nodeTree.value.length, 0, node)
      return
    }

    const parent = findNode(nodeTree.value, targetParentId)
    if (parent?.children) {
      parent.children.splice(index ?? parent.children.length, 0, node)
    }
  }

  /**
   * Swaps the positions of two nodes in the current tree.
   *
   * @param {string} nodeIdA
   * @param {string} nodeIdB
   * @returns {boolean}
   */
  function swapNodes(nodeIdA, nodeIdB) {
    if (!nodeIdA || !nodeIdB || nodeIdA === nodeIdB) return false

    const infoA = findParentAndIndex(nodeTree.value, nodeIdA)
    const infoB = findParentAndIndex(nodeTree.value, nodeIdB)
    if (!infoA || !infoB) return false

    if (infoA.parent === infoB.parent && infoA.index === infoB.index) {
      return false
    }

    if (infoA.parent === infoB.parent) {
      const siblings = infoA.parent
      const temp = siblings[infoA.index]
      siblings[infoA.index] = siblings[infoB.index]
      siblings[infoB.index] = temp
      return true
    }

    const nodeA = infoA.parent[infoA.index]
    const nodeB = infoB.parent[infoB.index]
    infoA.parent[infoA.index] = nodeB
    infoB.parent[infoB.index] = nodeA
    return true
  }

  /**
   * Merges new props into the target node.
   *
   * @param {string} nodeId
   * @param {object} props
   * @returns {void}
   */
  function updateNodeProps(nodeId, props) {
    const node = findNode(nodeTree.value, nodeId)
    if (node) {
      node.props = { ...node.props, ...props }
    }
  }

  /**
   * Resets the simulator state to an empty editor session.
   *
   * @returns {void}
   */
  function reset() {
    nodeTree.value = []
    currentQuestionId.value = null
    selectedNodeId.value = null
    previewMode.value = false
    paletteVisible.value = false
  }

  /**
   * Returns a deep-cloned serialization payload of the current layout tree.
   *
   * @returns {{ nodes: object[] }}
   */
  function getResult() {
    return { nodes: deepClone(nodeTree.value) }
  }

  /**
   * Finds a node inside the tree recursively.
   *
   * @param {object[]} nodes
   * @param {string} id
   * @returns {object | null}
   */
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

  /**
   * Removes a node from a nested tree structure.
   *
   * @param {object[]} nodes
   * @param {string} id
   * @returns {boolean}
   */
  function removeFromTree(nodes, id) {
    const index = nodes.findIndex(node => node.id === id)
    if (index !== -1) {
      nodes.splice(index, 1)
      return true
    }

    for (const node of nodes) {
      if (node.children && removeFromTree(node.children, id)) {
        return true
      }
    }

    return false
  }

  /**
   * Extracts a node from the tree and returns the removed node.
   *
   * @param {object[]} nodes
   * @param {string} id
   * @returns {object | null}
   */
  function extractFromTree(nodes, id) {
    const index = nodes.findIndex(node => node.id === id)
    if (index !== -1) {
      return nodes.splice(index, 1)[0]
    }

    for (const node of nodes) {
      if (node.children) {
        const extracted = extractFromTree(node.children, id)
        if (extracted) return extracted
      }
    }

    return null
  }

  /**
   * Finds the parent array and index for a node.
   *
   * @param {object[]} nodes
   * @param {string} id
   * @returns {{ parent: object[], index: number } | null}
   */
  function findParentAndIndex(nodes, id) {
    const index = nodes.findIndex(node => node.id === id)
    if (index !== -1) {
      return { parent: nodes, index }
    }

    for (const node of nodes) {
      if (node.children) {
        const found = findParentAndIndex(node.children, id)
        if (found) return found
      }
    }

    return null
  }

  /**
   * Determines whether the target node exists beneath the ancestor node.
   *
   * @param {string} ancestorId
   * @param {string} targetId
   * @returns {boolean}
   */
  function isDescendant(ancestorId, targetId) {
    const ancestor = findNode(nodeTree.value, ancestorId)
    if (!ancestor?.children?.length) return false
    return containsNode(ancestor.children, targetId)
  }

  /**
   * Checks whether a tree contains a node with the given id.
   *
   * @param {object[]} nodes
   * @param {string} id
   * @returns {boolean}
   */
  function containsNode(nodes, id) {
    for (const node of nodes) {
      if (node.id === id) return true
      if (node.children && containsNode(node.children, id)) return true
    }
    return false
  }

  /**
   * Produces a JSON-safe deep clone used by the layout serializer.
   *
   * @param {any} value
   * @returns {any}
   */
  function deepClone(value) {
    return JSON.parse(JSON.stringify(value))
  }

  return {
    nodeTree,
    currentQuestionId,
    selectedNodeId,
    previewMode,
    paletteVisible,
    generateId,
    togglePreview,
    togglePalette,
    loadDefault,
    openForQuestion,
    addNode,
    removeNode,
    moveNode,
    swapNodes,
    updateNodeProps,
    reset,
    getResult,
  }
})
