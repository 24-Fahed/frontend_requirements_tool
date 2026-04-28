<template>
  <div class="product-spec-table">
    <van-cell-group :title="title">
      <van-cell v-for="(row, i) in rowsList" :key="i" :title="row.key" :value="row.value" />
    </van-cell-group>
  </div>
</template>

<script>
import { CellGroup, Cell } from 'vant'

export default {
  name: 'ProductSpecTable',
  components: { 'van-cell-group': CellGroup, 'van-cell': Cell },
  props: {
    title: { type: String, default: '产品信息' },
    rows: { type: String, default: '产品型号:,尺寸:,材质:,重量:' }
  },
  data() {
    const rowsList = String(this.rows || '').split(',').map(s => {
      const parts = s.split(':')
      return { key: (parts[0] || '').trim(), value: (parts[1] || '').trim() }
    }).filter(r => r.key)
    return { rowsList }
  }
}
</script>

<style scoped>
:deep(.van-cell-group__title) {
  font-size: 16px;
  font-weight: 700;
  color: #404040;
  font-family: Arial, Helvetica, sans-serif;
  padding: 8px 16px;
}

:deep(.van-cell__title) {
  color: #666666;
  font-size: 14px;
  font-family: Arial, Helvetica, sans-serif;
}

:deep(.van-cell__value) {
  color: #404040;
  font-size: 14px;
  font-family: Arial, Helvetica, sans-serif;
}
</style>
