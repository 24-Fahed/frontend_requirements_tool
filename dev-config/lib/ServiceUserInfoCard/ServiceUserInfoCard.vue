<template>
  <van-cell-group>
    <van-field v-model="innerContact" :label="contactLabel" :placeholder="'请输入' + contactLabel" />
    <van-field v-model="innerName" :label="nameLabel" :placeholder="'请输入' + nameLabel" />
  </van-cell-group>
</template>

<script>
import { CellGroup, Field } from 'vant'

export default {
  name: 'ServiceUserInfoCard',
  components: { 'van-cell-group': CellGroup, 'van-field': Field },
  props: {
    contactLabel: { type: String, default: '联系方式' },
    contactValue: { type: String, default: '' },
    nameLabel: { type: String, default: '姓名' },
    nameValue: { type: String, default: '' }
  },
  data() {
    return { innerContact: this.contactValue, innerName: this.nameValue }
  }
}
</script>

<style scoped>
:deep(.van-field__label) {
  color: #333333;
  font-size: 14px;
  font-family: Arial, Helvetica, sans-serif;
}

:deep(.van-field__control) {
  font-size: 14px;
  color: #404040;
}
</style>
