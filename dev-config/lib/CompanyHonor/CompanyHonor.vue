<template>
  <div class="company-honor">
    <van-grid :column-num="columnNum" :border="false">
      <van-grid-item v-for="(item, index) in honorsList" :key="index">
        <template #text>
          <div class="ch-number">{{ item.number }}</div>
          <div class="ch-text">{{ item.text }}</div>
        </template>
      </van-grid-item>
    </van-grid>
  </div>
</template>

<script>
import { Grid, GridItem } from 'vant'

export default {
  name: 'CompanyHonor',
  components: { 'van-grid': Grid, 'van-grid-item': GridItem },
  props: {
    honors: { type: String, default: '[{"number":"20+","text":"年行业经验"},{"number":"100+","text":"全球客户"},{"number":"50+","text":"专利技术"},{"number":"30+","text":"国家覆盖"}]' },
    columnNum: { type: [Number, String], default: 2 }
  },
  data() {
    let honorsList = []
    if (typeof this.honors === 'string') {
      try { honorsList = JSON.parse(this.honors || '[]') } catch (e) { honorsList = [] }
    } else {
      honorsList = this.honors || []
    }
    return { honorsList }
  }
}
</script>

<style scoped>
.ch-number {
  color: #A3231F;
  font-size: 36px;
  font-weight: 700;
  line-height: 44px;
  font-family: Arial, Helvetica, sans-serif;
}

.ch-text {
  color: #333333;
  font-size: 16px;
  line-height: 24px;
  font-family: Arial, Helvetica, sans-serif;
  text-align: center;
}

:deep(.van-grid-item__content) {
  padding: 16px 8px;
}
</style>
