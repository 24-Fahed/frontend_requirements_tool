<template>
  <van-field
    v-model="innerValue"
    type="textarea"
    :placeholder="placeholder"
    rows="6"
  />
</template>

<script>
import { Field } from 'vant'

export default {
  name: 'MessageInputBox',
  components: { 'van-field': Field },
  props: {
    placeholder: { type: String, default: '请输入内容...' },
    value: { type: String, default: '' }
  },
  data() {
    return { innerValue: this.value }
  }
}
</script>

<style scoped>
:deep(.van-field__control) {
  font-size: 14px;
  color: #404040;
  font-family: Arial, Helvetica, sans-serif;
  min-height: 120px;
}
</style>
