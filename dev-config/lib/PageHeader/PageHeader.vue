<template>
  <van-nav-bar :title="title" left-arrow :border="false">
    <template #right>
      <van-icon name="share-o" size="18" color="#FFFFFF" />
    </template>
  </van-nav-bar>
</template>

<script>
import { NavBar, Icon } from 'vant'

export default {
  name: 'PageHeader',
  components: { 'van-nav-bar': NavBar, 'van-icon': Icon },
  props: {
    title: { type: String, default: '产品详情' }
  }
}
</script>

<style scoped>
:deep(.van-nav-bar) {
  background: #000000;
  height: 48px;
}

:deep(.van-nav-bar__title) {
  color: #FFFFFF;
  font-size: 16px;
  font-family: Arial, Helvetica, sans-serif;
}

:deep(.van-nav-bar__left .van-icon) {
  color: #FFFFFF;
}
</style>
