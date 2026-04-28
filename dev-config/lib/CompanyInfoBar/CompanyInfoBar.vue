<template>
  <div class="company-info-bar">
    <van-cell-group :title="title">
      <van-cell v-if="phone" title="Phone" :value="phone" icon="phone-o" />
      <van-cell v-if="email" title="Email" :value="email" icon="envelop-o" />
      <van-cell v-if="address" title="Address" :value="address" icon="location-o" />
    </van-cell-group>
  </div>
</template>

<script>
import { CellGroup, Cell } from 'vant'

export default {
  name: 'CompanyInfoBar',
  components: { 'van-cell-group': CellGroup, 'van-cell': Cell },
  props: {
    title: { type: String, default: '公司联系信息' },
    phone: { type: String, default: '+86-13928889037' },
    email: { type: String, default: 'info@ygcombi.com' },
    address: { type: String, default: '广州市白云区...' }
  }
}
</script>

<style scoped>
:deep(.van-cell-group) {
  background: #000000;
}

:deep(.van-cell-group__title) {
  color: #FFFFFF;
  font-size: 16px;
  font-weight: 700;
  font-family: Arial, Helvetica, sans-serif;
  background: #000000;
}

:deep(.van-cell) {
  background: #000000;
}

:deep(.van-cell__title),
:deep(.van-cell__value),
:deep(.van-cell__left-icon) {
  color: #FFFFFF;
  font-size: 14px;
  font-family: Arial, Helvetica, sans-serif;
}

:deep(.van-cell__value) {
  color: #E0E0E0;
}

:deep(.van-cell::after) {
  border-color: rgba(255, 255, 255, 0.1);
}
</style>
