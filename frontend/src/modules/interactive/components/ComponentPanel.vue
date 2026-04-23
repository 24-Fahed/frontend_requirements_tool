<script setup>
import { computed, defineComponent, h, onMounted, shallowRef, watch } from 'vue'
import { useAppStore } from '../../../stores/app'
import { useSimulatorStore } from '../../../stores/simulator'
import {
  preloadComponentLibraries,
  resolveRuntimeComponent,
} from '../services/componentLoader'
import draggable from 'vuedraggable'

const appStore = useAppStore()
const simStore = useSimulatorStore()
const activeTab = ref('component')

import { ref } from 'vue'

const previewMetas = computed(() => [...appStore.componentList, ...appStore.layoutList])

// clone 回调：ComponentInfo → LayoutNode
function metaToNode(meta) {
  return {
    id: simStore.generateId(),
    type: meta.name,
    props: { ...(meta.defaultProps || {}) },
    children: meta.isContainer ? [] : undefined,
  }
}

onMounted(async () => {
  await preloadComponentLibraries(previewMetas.value)
})

watch(previewMetas, async (value) => {
  await preloadComponentLibraries(value)
}, { deep: true })

const PanelPreview = defineComponent({
  name: 'PanelPreview',
  props: {
    meta: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const runtimeComponent = shallowRef(null)

    const previewProps = computed(() => {
      const propsValue = { ...(props.meta.defaultProps || {}) }
      if (typeof propsValue.items === 'string') {
        propsValue.items = propsValue.items
          .replaceAll('，', ',')
          .split(',')
          .map(item => item.trim())
          .filter(Boolean)
      }
      return propsValue
    })

    async function loadPreviewComponent() {
      runtimeComponent.value = await resolveRuntimeComponent(props.meta)
    }

    watch(() => props.meta, loadPreviewComponent, { immediate: true })

    return () => {
      if (!runtimeComponent.value) {
        return h('div', { class: 'panel-preview__placeholder' }, props.meta.label)
      }

      const slots = props.meta.isContainer
        ? {
            default: () => [
              h('div', { class: 'panel-preview__slot' }, 'Slot A'),
              h('div', { class: 'panel-preview__slot' }, 'Slot B'),
            ],
          }
        : undefined

      return h('div', { class: 'panel-preview' }, [
        h(runtimeComponent.value, previewProps.value, slots),
      ])
    }
  },
})
</script>

<template>
  <div class="component-panel" :class="{ 'component-panel--open': appStore.panelOpen }">
    <div class="component-panel__header">
      <span class="component-panel__title">组件与布局面板</span>
      <span class="component-panel__close" @click="appStore.panelOpen = false">&times;</span>
    </div>

    <div class="component-panel__tabs">
      <button
        class="component-panel__tab"
        :class="{ 'component-panel__tab--active': activeTab === 'component' }"
        @click="activeTab = 'component'"
      >
        组件
      </button>
      <button
        class="component-panel__tab"
        :class="{ 'component-panel__tab--active': activeTab === 'layout' }"
        @click="activeTab = 'layout'"
      >
        布局
      </button>
    </div>

    <div class="component-panel__body">
      <draggable
        v-if="activeTab === 'component'"
        :list="appStore.componentList"
        :group="{ name: 'sim', pull: 'clone', put: false }"
        :clone="metaToNode"
        item-key="name"
        class="component-panel__list"
      >
        <template #item="{ element }">
          <div class="drawer-card">
            <PanelPreview :meta="element" />
            <div class="drawer-card__title">{{ element.label }}</div>
            <div class="drawer-card__meta">{{ element.category }} · {{ element.name }}</div>
          </div>
        </template>
      </draggable>

      <draggable
        v-if="activeTab === 'layout'"
        :list="appStore.layoutList"
        :group="{ name: 'sim', pull: 'clone', put: false }"
        :clone="metaToNode"
        item-key="name"
        class="component-panel__list"
      >
        <template #item="{ element }">
          <div class="drawer-card">
            <PanelPreview :meta="element" />
            <div class="drawer-card__title">{{ element.label }}</div>
            <div class="drawer-card__meta">{{ element.isContainer ? '容器布局' : '布局' }} · {{ element.name }}</div>
          </div>
        </template>
      </draggable>
    </div>
  </div>
</template>

<style scoped>
.component-panel {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 300px;
  background: #fff;
  box-shadow: -4px 0 16px rgba(0, 0, 0, 0.12);
  z-index: 2000;
  display: flex;
  flex-direction: column;
  transform: translateX(100%);
  transition: transform 0.3s ease;
}

.component-panel--open {
  transform: translateX(0);
}

.component-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid #e4e7ed;
  flex-shrink: 0;
}

.component-panel__title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.component-panel__close {
  font-size: 22px;
  color: #909399;
  cursor: pointer;
  line-height: 1;
}

.component-panel__close:hover {
  color: #303133;
}

.component-panel__tabs {
  display: flex;
  border-bottom: 1px solid #e4e7ed;
  flex-shrink: 0;
}

.component-panel__tab {
  flex: 1;
  padding: 10px 0;
  border: none;
  background: none;
  font-size: 14px;
  color: #606266;
  cursor: pointer;
  border-bottom: 2px solid transparent;
}

.component-panel__tab--active {
  color: #409EFF;
  border-bottom-color: #409EFF;
}

.component-panel__body {
  flex: 1;
  overflow-y: auto;
  padding: 8px 12px;
}

.component-panel__list {
  min-height: 100%;
}
</style>
