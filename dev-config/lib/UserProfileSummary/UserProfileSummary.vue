<template>
  <van-cell center>
    <template #icon>
      <van-icon name="contact" size="50" color="#999999" />
    </template>
    <template #title>
      <span class="ups-username">{{ username }}</span>
    </template>
    <template #label>
      <span class="ups-count">{{ productCount }}</span>
    </template>
  </van-cell>
</template>

<script>
import { Cell, Icon } from 'vant'

export default {
  name: 'UserProfileSummary',
  components: { 'van-cell': Cell, 'van-icon': Icon },
  props: {
    username: { type: String, default: '用户名' },
    productCount: { type: String, default: '您有5款产品' }
  }
}
</script>

<style scoped>
.ups-username {
  font-size: 17px;
  font-weight: 700;
  color: #404040;
  font-family: Arial, Helvetica, sans-serif;
}

.ups-count {
  font-size: 13px;
  color: #666666;
  font-family: Arial, Helvetica, sans-serif;
}

:deep(.van-cell__left-icon) {
  font-size: 50px;
  margin-right: 16px;
}
</style>
