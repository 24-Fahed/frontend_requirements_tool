<template>
  <div class="location-nav-bar">
    <van-tabs v-model:active="activeIndex" :ellipsis="false" :animated="false">
      <van-tab v-for="(item, index) in navItems" :key="index" :title="item"></van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { Tabs, Tab } from 'vant'

export default {
  name: 'LocationNavBar',
  components: { 'van-tabs': Tabs, 'van-tab': Tab },
  props: {
    items: { type: String, default: '主页,产品中心,商业案例,关于我们' },
    active: { type: [Number, String], default: 0 }
  },
  data() {
    let navItems = []
    if (typeof this.items === 'string') {
      navItems = String(this.items || '').split(',').map(s => s.trim()).filter(Boolean)
    } else {
      navItems = this.items || ['主页', '产品中心', '商业案例', '关于我们']
    }
    let activeIndex = parseInt(this.active, 10)
    if (isNaN(activeIndex)) activeIndex = 0
    return { navItems, activeIndex }
  }
}
</script>

<style scoped>
.location-nav-bar :deep(.van-tabs__wrap) {
  height: 40px;
  background-color: #000000;
}
.location-nav-bar :deep(.van-tab) {
  color: #FFFFFF;
  font-size: 13px;
  font-family: Arial, Helvetica, sans-serif;
  flex: none;
  padding: 0 12px;
}
.location-nav-bar :deep(.van-tab--active) {
  color: #FFFFFF;
  font-weight: 700;
}
.location-nav-bar :deep(.van-tabs__line) {
  background-color: #A3231F;
  width: 20px !important;
}
.location-nav-bar :deep(.van-tabs__nav) {
  background-color: #000000;
}
.location-nav-bar :deep(.van-tabs__content) {
  display: none;
}
</style>
