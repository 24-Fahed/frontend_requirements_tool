<template>
  <van-nav-bar :title="logoText" :border="false">
    <template #left>
      <div class="tabbar-header__logo-icon"></div>
    </template>
    <template #right>
      <van-icon name="share-o" size="18" color="#FFFFFF" />
      <van-icon name="cross" size="18" color="#FFFFFF" />
    </template>
  </van-nav-bar>
</template>

<script>
import { NavBar, Icon } from 'vant'

export default {
  name: 'TabBarHeader',
  components: { 'van-nav-bar': NavBar, 'van-icon': Icon },
  props: {
    logoText: { type: String, default: 'PEATH WOOD' }
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

.tabbar-header__logo-icon {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #333;
  border: 1px solid #666;
}

:deep(.van-nav-bar__right) {
  display: flex;
  gap: 8px;
}
</style>
