<template>
  <van-tabbar v-model="activeIndex" active-color="#A3231F" inactive-color="#666666">
    <van-tabbar-item v-for="(item, index) in itemsList" :key="index" :icon="icons[index]">
      {{ item }}
    </van-tabbar-item>
  </van-tabbar>
</template>

<script>
import { Tabbar, TabbarItem } from 'vant'

export default {
  name: 'MiniProgramTabBar',
  components: { 'van-tabbar': Tabbar, 'van-tabbar-item': TabbarItem },
  props: {
    active: { type: [Number, String], default: 0 },
    items: { type: String, default: '首页,产品,我的' }
  },
  data() {
    const itemsList = String(this.items || '').split(',').map(s => s.trim()).filter(Boolean)
    const activeIndex = parseInt(this.active, 10)
    return {
      itemsList,
      activeIndex: isNaN(activeIndex) ? 0 : activeIndex,
      icons: ['home-o', 'apps-o', 'contact']
    }
  }
}
</script>

<style scoped>
:deep(.van-tabbar) {
  height: 50px;
  border-top: 1px solid #EEEEEE;
}

:deep(.van-tabbar-item__text) {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 11px;
}
</style>
