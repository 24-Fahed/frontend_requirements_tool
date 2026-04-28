<template>
  <van-card :thumb="imageUrl || undefined">
    <template #title>
      <span class="csc1-title">{{ title }}</span>
    </template>
    <template #desc>
      <span class="csc1-desc">{{ description }}</span>
    </template>
    <template #footer>
      <van-button size="small" type="primary">{{ buttonText }}</van-button>
    </template>
    <template v-if="!imageUrl" #thumb>
      <div class="csc1-placeholder"></div>
    </template>
  </van-card>
</template>

<script>
import { Card, Button } from 'vant'

export default {
  name: 'CompanyServiceCard1',
  components: { 'van-card': Card, 'van-button': Button },
  props: {
    title: { type: String, default: '咨询产品' },
    description: { type: String, default: '你只要想烤肉，我们就可以推荐你最合适的产品' },
    buttonText: { type: String, default: '联系我们' },
    imageUrl: { type: String, default: '' }
  }
}
</script>

<style scoped>
.csc1-title {
  font-size: 14px;
  font-weight: 700;
  color: #FFFFFF;
  font-family: Arial, Helvetica, sans-serif;
}

.csc1-desc {
  font-size: 11px;
  color: #FFFFFF;
  opacity: 0.9;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.csc1-placeholder {
  width: 100%;
  height: 100%;
  background: #EEEEEE;
}

:deep(.van-card) {
  background: #000000;
}

:deep(.van-card__thumb) {
  width: 120px;
  height: 120px;
}

:deep(.van-card__content) {
  justify-content: center;
  min-height: 120px;
}

:deep(.van-card__footer) {
  padding-top: 4px;
}

:deep(.van-button--primary) {
  background-color: #FFFFFF;
  color: #000000;
  border: 1px solid #A3231F;
  border-radius: 0;
}
</style>
