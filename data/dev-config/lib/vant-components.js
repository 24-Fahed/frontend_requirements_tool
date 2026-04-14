/**
 * Vant Web Component 组件库
 * 基于 @vant/cli 生成的 Web Components，通过 CDN 加载 Vant
 * 此文件注册所有可用的自定义组件供模拟器使用
 */

// Vant 组件注册表
window.__requireToolComponents = {

  // ---------- 基础组件 ----------

  VanButton: {
    template: `
      <button class="van-button"
        :class="[
          'van-button--' + type,
          'van-button--' + size,
          plain ? 'van-button--plain' : '',
          square ? 'van-button--square' : ''
        ]"
        :style="{ width: block ? '100%' : 'auto' }"
      >{{ text }}</button>
    `,
    props: ['text', 'type', 'size', 'plain', 'square', 'block'],
    style: `
      .van-button { display: inline-flex; align-items: center; justify-content: center;
        height: 44px; padding: 0 16px; font-size: 14px; border-radius: 4px; border: 1px solid #ddd;
        background: #fff; color: #323233; cursor: pointer; box-sizing: border-box; }
      .van-button--primary { background: #1989fa; color: #fff; border-color: #1989fa; }
      .van-button--success { background: #07c160; color: #fff; border-color: #07c160; }
      .van-button--danger { background: #ee0a24; color: #fff; border-color: #ee0a24; }
      .van-button--warning { background: #ff976a; color: #fff; border-color: #ff976a; }
      .van-button--default { background: #fff; color: #323233; border-color: #ebedf0; }
      .van-button--small { height: 32px; padding: 0 8px; font-size: 12px; }
      .van-button--large { height: 50px; padding: 0 24px; font-size: 16px; }
      .van-button--square { border-radius: 0; }
      .van-button--plain { background: transparent; }
      .van-button--plain.van-button--primary { color: #1989fa; }
    `
  },

  VanText: {
    template: `
      <div class="van-text" :style="{ fontSize: fontSize + 'px', color: color, fontWeight: bold ? 'bold' : 'normal', textAlign: align, padding: '4px 0' }">
        {{ content }}
      </div>
    `,
    props: ['content', 'fontSize', 'color', 'bold', 'align'],
    style: ''
  },

  VanImage: {
    template: `
      <div class="van-image" :style="{ width: width, height: height + 'px', background: '#f7f8fa', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: radius + 'px', overflow: 'hidden', border: '1px solid #ebedf0' }">
        <span style="color:#c8c9cc;font-size:12px;">{{ src === 'placeholder' ? '图片 ' + width + '×' + height : src }}</span>
      </div>
    `,
    props: ['src', 'width', 'height', 'radius', 'fit'],
    style: ''
  },

  VanInput: {
    template: `
      <div class="van-field">
        <label class="van-field__label" v-if="label">{{ label }}</label>
        <div class="van-field__control">
          <input :placeholder="placeholder" :type="inputType" disabled style="width:100%;border:none;background:transparent;font-size:14px;color:#323233;" />
        </div>
      </div>
    `,
    props: ['label', 'placeholder', 'inputType'],
    style: `
      .van-field { display: flex; align-items: center; padding: 10px 16px; background: #fff;
        border: 1px solid #ebedf0; border-radius: 4px; }
      .van-field__label { font-size: 14px; color: #646566; margin-right: 12px; white-space: nowrap; }
      .van-field__control { flex: 1; }
    `
  },

  VanSearch: {
    template: `
      <div class="van-search">
        <div class="van-search__content">
          <span style="color:#969799;margin-right:8px;">🔍</span>
          <input :placeholder="placeholder" disabled style="border:none;background:transparent;font-size:14px;flex:1;" />
        </div>
      </div>
    `,
    props: ['placeholder'],
    style: `
      .van-search { padding: 8px 12px; background: #fff; }
      .van-search__content { display: flex; align-items: center; background: #f7f8fa;
        border-radius: 18px; padding: 6px 12px; }
    `
  },

  VanCell: {
    template: `
      <div class="van-cell" :style="{ borderTop: border ? 'none' : '1px solid #ebedf0' }">
        <div class="van-cell__title">{{ title }}</div>
        <div class="van-cell__value">{{ value }}</div>
        <span v-if="isLink" class="van-cell__arrow">›</span>
      </div>
    `,
    props: ['title', 'value', 'isLink', 'border'],
    style: `
      .van-cell { display: flex; align-items: center; padding: 12px 16px; background: #fff;
        border-bottom: 1px solid #ebedf0; font-size: 14px; }
      .van-cell__title { color: #323233; }
      .van-cell__value { flex: 1; text-align: right; color: #969799; margin-left: 12px; }
      .van-cell__arrow { color: #c8c9cc; margin-left: 4px; font-size: 16px; }
    `
  },

  // ---------- 组合组件 ----------

  VanProductCard: {
    template: `
      <div class="product-card">
        <div class="product-card__img" :style="{ height: imageHeight + 'px' }">
          <span style="color:#c8c9cc;font-size:12px;">商品图片</span>
        </div>
        <div class="product-card__info">
          <div class="product-card__title">{{ title }}</div>
          <div class="product-card__desc">{{ desc }}</div>
          <div class="product-card__price">{{ price }}</div>
        </div>
      </div>
    `,
    props: ['title', 'desc', 'price', 'imageHeight'],
    style: `
      .product-card { background: #fff; border-radius: 8px; overflow: hidden;
        border: 1px solid #ebedf0; }
      .product-card__img { background: #f7f8fa; display: flex; align-items: center;
        justify-content: center; }
      .product-card__info { padding: 8px 12px; }
      .product-card__title { font-size: 14px; color: #323233; font-weight: 500; }
      .product-card__desc { font-size: 12px; color: #969799; margin-top: 4px; }
      .product-card__price { font-size: 16px; color: #ee0a24; font-weight: bold; margin-top: 4px; }
    `
  },

  VanNavBar: {
    template: `
      <div class="van-nav-bar">
        <div class="van-nav-bar__left">{{ leftText }}</div>
        <div class="van-nav-bar__title">{{ title }}</div>
        <div class="van-nav-bar__right">{{ rightText }}</div>
      </div>
    `,
    props: ['title', 'leftText', 'rightText'],
    style: `
      .van-nav-bar { display: flex; align-items: center; justify-content: space-between;
        height: 46px; padding: 0 16px; background: #fff; border-bottom: 1px solid #ebedf0; }
      .van-nav-bar__title { font-size: 16px; font-weight: 600; color: #323233; }
      .van-nav-bar__left, .van-nav-bar__right { font-size: 14px; color: #1989fa; min-width: 40px; }
      .van-nav-bar__right { text-align: right; }
    `
  },

  VanTabBar: {
    template: `
      <div class="van-tabbar">
        <div class="van-tabbar__item" v-for="item in items" :key="item">
          <span class="van-tabbar__icon">○</span>
          <span class="van-tabbar__text">{{ item }}</span>
        </div>
      </div>
    `,
    props: ['items'],
    style: `
      .van-tabbar { display: flex; align-items: center; justify-content: space-around;
        height: 50px; background: #fff; border-top: 1px solid #ebedf0; }
      .van-tabbar__item { display: flex; flex-direction: column; align-items: center;
        justify-content: center; flex: 1; font-size: 10px; color: #646566; }
      .van-tabbar__icon { font-size: 18px; margin-bottom: 2px; }
      .van-tabbar__text { font-size: 10px; }
    `
  },

  VanNoticeBar: {
    template: `
      <div class="van-notice-bar">
        <span class="van-notice-bar__icon">📢</span>
        <span class="van-notice-bar__text">{{ text }}</span>
      </div>
    `,
    props: ['text'],
    style: `
      .van-notice-bar { display: flex; align-items: center; padding: 8px 16px;
        background: #fffbeb; color: #ed6a0c; font-size: 13px; }
      .van-notice-bar__icon { margin-right: 8px; }
      .van-notice-bar__text { flex: 1; overflow: hidden; white-space: nowrap;
        text-overflow: ellipsis; }
    `
  }
};
