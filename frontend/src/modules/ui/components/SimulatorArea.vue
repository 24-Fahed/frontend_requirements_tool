<script setup>
import { useAppStore } from '../../../stores/app'
import PhoneFrame from '../../interactive/components/PhoneFrame.vue'
import DrawerPanel from './DrawerPanel.vue'

const store = useAppStore()
</script>

<template>
  <div class="simulator-area" :class="{ hidden: !store.simulatorVisible }">
    <PhoneFrame />
  </div>
  <DrawerPanel />
</template>
