<script setup>
import { computed, defineComponent, h, inject, ref, shallowRef, watch } from 'vue'
import draggable from 'vuedraggable'
import { useAppStore } from '../../../stores/app'
import { useSimulatorStore } from '../../../stores/simulator'
import {
  RUNTIME_CONTEXT_KEY,
  resolveRuntimeComponent,
} from '../services/componentLoader'

const appStore = useAppStore()
const simStore = useSimulatorStore()
const runtimeContext = inject(RUNTIME_CONTEXT_KEY)
const activeTab = ref('component')

/**
 * Clones component metadata into a new simulator layout node for drag
 * insertion.
 *
 * @param {object} meta
 * @returns {object}
 */
function metaToNode(meta) {
  return {
    id: simStore.generateId(),
    type: meta.name,
    props: { ...(meta.defaultProps || {}) },
    children: meta.isContainer ? [] : undefined,
  }
}

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

    /**
     * Loads the preview runtime component for the palette card.
     *
     * @returns {Promise<void>}
     */
    async function loadPreviewComponent() {
      runtimeComponent.value = await resolveRuntimeComponent(props.meta, runtimeContext)
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
  <div class="component-panel" :class="{ 'component-panel--open': simStore.paletteVisible && !simStore.previewMode }">
    <div class="component-panel__header">
      <span class="component-panel__title">Palette</span>
      <span class="component-panel__close" @click="simStore.togglePalette">&times;</span>
    </div>

    <div class="component-panel__tabs">
      <button
        class="component-panel__tab"
        :class="{ 'component-panel__tab--active': activeTab === 'component' }"
        @click="activeTab = 'component'"
      >
        Components
      </button>
      <button
        class="component-panel__tab"
        :class="{ 'component-panel__tab--active': activeTab === 'layout' }"
        @click="activeTab = 'layout'"
      >
        Layouts
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
            <div class="drawer-card__meta">{{ element.category }} | {{ element.name }}</div>
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
            <div class="drawer-card__meta">{{ element.isContainer ? 'Container' : 'Layout' }} | {{ element.name }}</div>
          </div>
        </template>
      </draggable>
    </div>
  </div>
</template>
