<template>
  <van-card :thumb="imageUrl || undefined">
    <template #title>
      <span class="hpc-name">{{ name }}</span>
    </template>
    <template #desc>
      <span class="hpc-model">{{ model }}</span>
      <div class="hpc-tags">
        <van-tag v-for="(tag, i) in tagsList" :key="i" type="primary" plain size="medium">{{ tag }}</van-tag>
      </div>
    </template>
    <template #price>
      <span class="hpc-price">{{ price }}</span>
    </template>
    <template v-if="!imageUrl" #thumb>
      <div class="hpc-placeholder"></div>
    </template>
  </van-card>
</template>

<script>
import { Card, Tag } from 'vant'

export default {
  name: 'HomeProductCard',
  components: { 'van-card': Card, 'van-tag': Tag },
  props: {
    name: { type: String, default: '产品名称' },
    model: { type: String, default: '产品型号' },
    price: { type: String, default: '参考价格' },
    tags: { type: String, default: '定制,专利产品,阿根廷大使馆' },
    imageUrl: { type: String, default: '' }
  },
  data() {
    return { tagsList: String(this.tags || '').split(',').map(s => s.trim()).filter(Boolean) }
  }
}
</script>

<style scoped>
.hpc-name {
  font-size: 16px;
  font-weight: 700;
  color: #404040;
  font-family: Arial, Helvetica, sans-serif;
}

.hpc-model {
  font-size: 12px;
  color: #666666;
}

.hpc-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 4px;
}

.hpc-price {
  font-size: 13px;
  font-weight: 700;
  color: #D81B00;
}

.hpc-placeholder {
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
  gap: 4px;
}

:deep(.van-tag--primary) {
  background: #F5F5F5;
  border-color: #EEEEEE;
  color: #666666;
}
</style>
