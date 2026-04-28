<template>
  <van-action-bar>
    <van-action-bar-icon icon="chat-o" :text="consultText" />
    <van-action-bar-icon icon="like-o" :text="favoriteText" />
    <van-action-bar-button type="danger" :text="buyText" />
  </van-action-bar>
</template>

<script>
import { ActionBar, ActionBarIcon, ActionBarButton } from 'vant'

export default {
  name: 'ProductActionBar',
  components: {
    'van-action-bar': ActionBar,
    'van-action-bar-icon': ActionBarIcon,
    'van-action-bar-button': ActionBarButton
  },
  props: {
    consultText: { type: String, default: '咨询' },
    favoriteText: { type: String, default: '加入收藏' },
    buyText: { type: String, default: '立即购买' }
  }
}
</script>

<style scoped>
:deep(.van-action-bar-button--danger) {
  background: #A3231F;
  border: none;
}

:deep(.van-action-bar-icon) {
  color: #666666;
}

:deep(.van-action-bar) {
  border-top: 1px solid #EEEEEE;
}
</style>
