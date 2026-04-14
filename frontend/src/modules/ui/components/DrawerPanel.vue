<script setup>
import {
  computed,
  defineComponent,
  h,
  onMounted,
  shallowRef,
  ref,
  watch,
} from 'vue'
import { useAppStore } from '../../../stores/app'
import {
  preloadComponentLibraries,
  resolveRuntimeComponent,
} from '../../interactive/services/componentLoader'
import { encodeDragPayload } from '../../interactive/services/dragPayload'

const store = useAppStore()
const activeTab = ref('component')

const previewMetas = computed(() => [...store.componentList, ...store.layoutList])

function handleClose() {
  store.drawerOpen = false
}

function startExternalDrag(event, sourceType, item) {
  event.dataTransfer.effectAllowed = 'copy'
  event.dataTransfer.setData('text/plain', encodeDragPayload({
    kind: 'palette-item',
    sourceType,
    sourceName: item.name,
  }))
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
          @dragstart="startExternalDrag($event, 'component', comp)"
        >
          <PanelPreview :meta="comp" />
          <div class="drawer-card__title">{{ comp.label }}</div>
          <div class="drawer-card__meta">{{ comp.category }} · {{ comp.name }}</div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="布局" name="layout">
        <div
          v-for="layout in store.layoutList"
          :key="layout.name"
          class="drawer-card"
          draggable="true"
          @dragstart="startExternalDrag($event, 'layout', layout)"
        >
          <PanelPreview :meta="layout" />
          <div class="drawer-card__title">{{ layout.label }}</div>
          <div class="drawer-card__meta">{{ layout.isContainer ? '容器布局' : '布局' }} · {{ layout.name }}</div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-drawer>
</template>
