<template>
  <div class="product-media-viewer">
    <van-swipe ref="swipeRef" :loop="true" :show-indicators="false" @change="onSwipeChange">
      <van-swipe-item v-for="(item, index) in allItems" :key="index">
        <div class="pmv-slide">
          <video
            v-if="item.type === 'video'"
            :src="item.src"
            class="pmv-video"
            controls
            @ended="onVideoEnded"
          ></video>
          <van-image
            v-else-if="item.type === 'image'"
            :src="item.src"
            width="100%"
            height="100%"
            fit="cover"
          />
          <a v-else-if="item.type === 'case'" :href="item.link" class="pmv-case">
            <van-image :src="item.src" width="100%" height="100%" fit="cover" />
          </a>
          <div v-if="!item.src" class="pmv-placeholder"></div>
        </div>
      </van-swipe-item>
    </van-swipe>
    <van-tabs v-model:active="activeTab" :animated="false" :swipeable="false" @change="onTabChange">
      <van-tab :title="videoLabel" disabled></van-tab>
      <van-tab :title="galleryLabel" disabled></van-tab>
      <van-tab :title="caseLabel" disabled></van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { Swipe, SwipeItem, Tabs, Tab, Image } from 'vant'

export default {
  name: 'ProductMediaViewer',
  components: {
    'van-swipe': Swipe,
    'van-swipe-item': SwipeItem,
    'van-tabs': Tabs,
    'van-tab': Tab,
    'van-image': Image
  },
  props: {
    videoLabel: { type: String, default: '展示视频' },
    galleryLabel: { type: String, default: '产品图集' },
    caseLabel: { type: String, default: '用户案例' },
    videos: { type: String, default: '' },
    images: { type: String, default: '' },
    cases: { type: String, default: '' }
  },
  data() {
    const parseList = (str, type, linkStr) => {
      if (!str) return []
      const links = linkStr ? String(linkStr).split(',').map(s => s.trim()) : []
      return String(str).split(',').map(s => s.trim()).filter(Boolean).map((src, i) => {
        const item = { type, src }
        if (type === 'case' && links[i]) item.link = links[i]
        return item
      })
    }
    const videoItems = parseList(this.videos, 'video')
    const imageItems = parseList(this.images, 'image')
    const caseItems = parseList(this.cases, 'case', this.cases)
    const allItems = [...videoItems, ...imageItems, ...caseItems]
    const videoCount = videoItems.length
    const imageCount = imageItems.length
    return {
      allItems,
      activeTab: 0,
      currentIndex: 0,
      videoCount,
      imageCount,
      totalCount: allItems.length,
      imageTimer: null
    }
  },
  computed: {
    sectionRanges() {
      let vEnd = this.videoCount
      let iEnd = vEnd + this.imageCount
      return [
        { start: 0, end: vEnd },
        { start: vEnd, end: iEnd },
        { start: iEnd, end: this.totalCount }
      ]
    }
  },
  methods: {
    onSwipeChange(index) {
      this.currentIndex = index
      this.syncTab(index)
      this.startImageTimer(index)
    },
    syncTab(index) {
      const ranges = this.sectionRanges
      if (index < ranges[0].end) this.activeTab = 0
      else if (index < ranges[1].end) this.activeTab = 1
      else this.activeTab = 2
    },
    onTabChange(tab) {
      const ranges = this.sectionRanges
      if (ranges[tab] && this.$refs.swipeRef) {
        this.$refs.swipeRef.swipeTo(ranges[tab].start)
      }
    },
    onVideoEnded() {
      if (this.$refs.swipeRef) {
        this.$refs.swipeRef.next()
      }
    },
    startImageTimer(index) {
      clearTimeout(this.imageTimer)
      const ranges = this.sectionRanges
      const isInImageSection = index >= ranges[1].start && index < ranges[1].end
      if (isInImageSection) {
        this.imageTimer = setTimeout(() => {
          if (this.$refs.swipeRef) {
            this.$refs.swipeRef.next()
          }
        }, 5000)
      }
    },
    beforeUnmount() {
      clearTimeout(this.imageTimer)
    }
  }
}
</script>

<style scoped>
.product-media-viewer {
  font-family: Arial, Helvetica, sans-serif;
  background: #FFFFFF;
}

.pmv-slide {
  width: 100%;
  height: 200px;
  background: #EEEEEE;
  overflow: hidden;
}

.pmv-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.pmv-case {
  display: block;
  width: 100%;
  height: 100%;
  text-decoration: none;
}

.pmv-placeholder {
  width: 100%;
  height: 100%;
  background: #EEEEEE;
}

:deep(.van-tabs__line) {
  background-color: #A3231F;
}

:deep(.van-tab) {
  font-size: 12px;
  color: #666666;
}

:deep(.van-tab--active) {
  color: #A3231F;
}

:deep(.van-tabs__content) {
  display: none;
}
</style>
