<template>
  <div class="product-engineering-drawing">
    <div class="ped-title">{{ title }}</div>
    <van-image v-if="imageUrl" :src="imageUrl" width="100%" fit="contain" />
    <div v-else class="ped-placeholder"></div>
  </div>
</template>

<script>
import { Image } from 'vant'

export default {
  name: 'ProductEngineeringDrawing',
  components: { 'van-image': Image },
  props: {
    title: { type: String, default: '工程图' },
    imageUrl: { type: String, default: '' }
  }
}
</script>

<style scoped>
.ped-title {
  text-align: center;
  font-size: 14px;
  color: #404040;
  padding: 8px;
  font-family: Arial, Helvetica, sans-serif;
}

.ped-placeholder {
  width: 100%;
  height: 160px;
  background: #EEEEEE;
}
</style>
