<template>
  <van-cell :title="province + ' ' + city" :label="detail" is-link>
    <template #title>
      <span class="uao-region">{{ province }} {{ city }}</span>
    </template>
    <van-button size="small" type="primary">编辑</van-button>
  </van-cell>
</template>

<script>
import { Cell, Button } from 'vant'

export default {
  name: 'UserAddressOverview',
  components: { 'van-cell': Cell, 'van-button': Button },
  props: {
    province: { type: String, default: '江苏 省' },
    city: { type: String, default: '徐州 市' },
    detail: { type: String, default: '铜山区......街道.......号' }
  }
}
</script>

<style scoped>
.uao-region {
  font-size: 14px;
  color: #404040;
  font-weight: 700;
  font-family: Arial, Helvetica, sans-serif;
}

:deep(.van-cell__label) {
  font-size: 13px;
  color: #666666;
  font-family: Arial, Helvetica, sans-serif;
}

:deep(.van-button--primary) {
  background-color: #FFFFFF;
  color: #A3231F;
  border: 1px solid #A3231F;
  border-radius: 0;
}
</style>
