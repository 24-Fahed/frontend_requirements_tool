<template>
  <div class="product-introduction">
    <van-cell-group>
      <van-cell :title="heading" :label="content" />
    </van-cell-group>
  </div>
</template>

<script>
import { CellGroup, Cell } from 'vant'

export default {
  name: 'ProductIntroduction',
  components: { 'van-cell-group': CellGroup, 'van-cell': Cell },
  props: {
    heading: { type: String, default: 'Heading' },
    content: { type: String, default: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' }
  }
}
</script>

<style scoped>
:deep(.van-cell__title) {
  font-size: 18px;
  font-weight: 700;
  color: #404040;
  font-family: Arial, Helvetica, sans-serif;
}

:deep(.van-cell__label) {
  font-size: 14px;
  color: #666666;
  line-height: 24px;
  font-family: Arial, Helvetica, sans-serif;
  margin-top: 8px;
}
</style>
