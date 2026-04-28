<template>
  <van-card :thumb="imageUrl || undefined">
    <template #title>
      <span class="opc-name">{{ name }}</span>
    </template>
    <template #desc>
      <span class="opc-detail">{{ model }}</span>
      <span class="opc-detail">{{ price }}</span>
      <span class="opc-detail">{{ date }}</span>
    </template>
    <template #price>
      <span class="opc-status">{{ status }}</span>
    </template>
    <template v-if="!imageUrl" #thumb>
      <div class="opc-placeholder"></div>
    </template>
  </van-card>
</template>

<script>
import { Card } from 'vant'

export default {
  name: 'OrderProductCard',
  components: { 'van-card': Card },
  props: {
    name: { type: String, default: '产品名称' },
    model: { type: String, default: '产品型号' },
    price: { type: String, default: '成交价格' },
    date: { type: String, default: '成交日期' },
    status: { type: String, default: '产品状态' },
    imageUrl: { type: String, default: '' }
  }
}
</script>

<style scoped>
.opc-name {
  font-size: 16px;
  font-weight: 700;
  color: #404040;
  font-family: Arial, Helvetica, sans-serif;
}

.opc-detail {
  font-size: 12px;
  color: #666666;
}

.opc-status {
  font-size: 12px;
  font-weight: 700;
  color: #A3231F;
}

.opc-placeholder {
  width: 100%;
  height: 100%;
  background: #EEEEEE;
}

:deep(.van-card__thumb) {
  width: 140px;
  height: 140px;
}

:deep(.van-card__content) {
  justify-content: flex-start;
  gap: 6px;
}
</style>
