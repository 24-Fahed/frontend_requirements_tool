<template>
  <van-card :thumb="imageUrl || undefined">
    <template #title>
      <span class="spc-name">{{ name }}</span>
    </template>
    <template #desc>
      <span class="spc-model">{{ model }}</span>
    </template>
    <template #price>
      <span class="spc-price">{{ price }}</span>
    </template>
    <template v-if="!imageUrl" #thumb>
      <div class="spc-placeholder"></div>
    </template>
  </van-card>
</template>

<script>
import { Card } from 'vant'

export default {
  name: 'SimpleProductCard',
  components: { 'van-card': Card },
  props: {
    name: { type: String, default: '产品名称' },
    model: { type: String, default: '产品型号' },
    price: { type: String, default: '参考价格' },
    imageUrl: { type: String, default: '' }
  }
}
</script>

<style scoped>
.spc-name {
  font-size: 16px;
  font-weight: 700;
  color: #404040;
  font-family: Arial, Helvetica, sans-serif;
}

.spc-model {
  font-size: 12px;
  color: #666666;
}

.spc-price {
  font-size: 13px;
  font-weight: 700;
  color: #D81B00;
}

.spc-placeholder {
  width: 100%;
  height: 100%;
  background: #EEEEEE;
}

:deep(.van-card__thumb) {
  width: 80px;
  height: 80px;
}

:deep(.van-card__content) {
  justify-content: center;
  gap: 4px;
}
</style>
