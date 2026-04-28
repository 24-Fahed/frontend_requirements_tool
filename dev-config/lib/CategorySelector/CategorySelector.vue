<template>
  <div class="category-selector">
    <van-dropdown-menu active-color="#A3231F">
      <van-dropdown-item v-model="activeValue" :options="optionsList" />
    </van-dropdown-menu>
  </div>
</template>

<script>
import { DropdownMenu, DropdownItem } from 'vant'

export default {
  name: 'CategorySelector',
  components: { 'van-dropdown-menu': DropdownMenu, 'van-dropdown-item': DropdownItem },
  props: {
    title: { type: String, default: '产品分类' },
    categories: { type: String, default: '商用大型组合炉,商用大型阿根廷烤炉,普通落地式家用/商用款,台式 无耐火砖' }
  },
  data() {
    const categoriesList = String(this.categories || '').split(',').map(s => s.trim()).filter(Boolean)
    const optionsList = categoriesList.map((text, index) => ({ text, value: index }))
    return {
      activeValue: 0,
      optionsList
    }
  }
}
</script>

<style scoped>
.category-selector {
  font-family: Arial, Helvetica, sans-serif;
}

:deep(.van-dropdown-menu__bar) {
  background: #FFFFFF;
  height: 40px;
}

:deep(.van-dropdown-menu__title) {
  font-size: 14px;
  color: #333333;
}

:deep(.van-dropdown-menu__title--active) {
  color: #A3231F;
}

:deep(.van-dropdown-item__option--active) {
  color: #A3231F;
}
</style>
