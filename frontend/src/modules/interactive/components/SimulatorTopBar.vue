<script setup>
import { computed } from 'vue'
import { useSimulatorStore } from '../../../stores/simulator'

const simStore = useSimulatorStore()

const paletteButtonActive = computed(() => !simStore.previewMode && simStore.paletteVisible)
</script>

<template>
  <div class="phone-status-bar">
    <span class="phone-status-bar__title">Simulator</span>
    <div class="phone-status-bar__actions">
      <button
        class="phone-status-bar__button"
        :class="{ 'is-active': paletteButtonActive }"
        @click="simStore.togglePalette"
      >
        {{ simStore.paletteVisible ? 'Palette Off' : 'Palette' }}
      </button>
      <button
        class="phone-status-bar__button"
        :class="{ 'is-active': simStore.previewMode }"
        @click="simStore.togglePreview"
      >
        {{ simStore.previewMode ? 'Edit' : 'Preview' }}
      </button>
    </div>
  </div>
</template>
