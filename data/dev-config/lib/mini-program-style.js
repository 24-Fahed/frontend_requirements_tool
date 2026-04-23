/**
 * 小程序风格组件库
 * 基于Vant 4，遵循暗色工业风格
 */

(function () {
  'use strict';

  // ========== 1. 加载 Vant CSS ==========
  var cssLink = document.createElement('link');
  cssLink.rel = 'stylesheet';
  cssLink.href = 'https://unpkg.com/vant@4/lib/index.css';
  document.head.appendChild(cssLink);

  // ========== 2. 定义 injectCustomStyles 函数 ==========
  function injectCustomStyles() {
    var style = document.createElement('style');
    style.textContent = '\
      :root {\
        --van-primary-color: #A3231F;\
        --van-primary-color-light: #c84040;\
        --van-text-color: #FFFFFF;\
        --van-text-color-2: #E0E0E0;\
        --van-text-color-3: #999999;\
        --van-border-color: #333333;\
        --van-background: #000000;\
        --van-background-2: #1A1A1A;\
        --van-font-family: Arial, Helvetica, sans-serif;\
        --van-border-radius-sm: 0;\
        --van-border-radius-md: 0;\
        --van-border-radius-lg: 0;\
        --van-border-radius-max: 0;\
      }\
      * { -webkit-tap-highlight-color: transparent; }\
      .van-button, .van-popup, .van-cell, .van-card, .van-image, .van-tab, .van-tabbar, .van-tabs, .van-swipe, .van-tag, .van-divider, .van-pagination { box-shadow: none !important; border-radius: 0 !important; font-family: Arial, Helvetica, sans-serif !important; }\
      .vstack { display: flex; flex-direction: column; width: 100%; }\
      .hstack { display: flex; flex-direction: row; width: 100%; flex-wrap: wrap; }\
      .hstack > * { flex: 1; min-width: 0; }\
      .company-info-bar-1 { background-color: #000000; padding: 16px; }\
      .ci-header { margin-bottom: 16px; }\
      .ci-title { color: #FFFFFF; font-size: 16px; font-weight: 700; line-height: 24px; font-family: Arial, Helvetica, sans-serif; }\
      .ci-separator { color: #FFFFFF; margin-top: 8px; }\
      .ci-content { display: flex; flex-direction: column; gap: 16px; }\
      .ci-item { display: flex; align-items: flex-start; gap: 8px; }\
      .ci-icon { color: #FFFFFF; font-size: 16px; margin-top: 2px; }\
      .ci-label { color: #FFFFFF; font-size: 14px; font-family: Arial, Helvetica, sans-serif; white-space: nowrap; }\
      .ci-value { color: #E0E0E0; font-size: 14px; font-family: Arial, Helvetica, sans-serif; line-height: 20px; word-break: break-word; }\
      .company-honors { background-color: #FFFFFF; padding: 16px; }\
      .honors-grid { display: flex; flex-direction: column; gap: 16px; }\
      .honor-item { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 8px; }\
      .honor-number { color: #A3231F; font-size: 36px; font-weight: 700; line-height: 44px; font-family: Arial, Helvetica, sans-serif; }\
      .honor-text { color: #333333; font-size: 16px; font-weight: 400; line-height: 24px; font-family: Arial, Helvetica, sans-serif; }\
      .location-nav-bar .van-tabs__wrap { height: 40px; background-color: #000000; }\
      .location-nav-bar .van-tab { color: #FFFFFF; font-size: 13px; font-family: Arial, Helvetica, sans-serif; flex: none; padding: 0 12px; }\
      .location-nav-bar .van-tab--active { color: #FFFFFF; font-weight: 700; }\
      .location-nav-bar .van-tabs__line { background-color: #A3231F; width: 20px !important; }\
      .location-nav-bar .van-tabs__nav { background-color: #000000; }\
      .location-nav-bar .van-tabs__content { display: none; }\
      .product-category { background-color: #000000; }\
      .pc-header { background-color: #A3231F; color: #FFFFFF; font-size: 18px; font-weight: 700; line-height: 32px; padding: 12px 16px; font-family: Arial, Helvetica, sans-serif; }\
      .pc-list { background-color: #FFFFFF; }\
      .pc-item { color: #333333; font-size: 14px; font-family: Arial, Helvetica, sans-serif; line-height: 40px; padding: 0 16px; border-bottom: 1px solid #EEEEEE; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\
      .pc-item:last-child { border-bottom: none; }\
      .product-card { background-color: #FFFFFF; border-radius: 0 !important; overflow: hidden; width: 100%; }\
      .pc-image { width: 100%; aspect-ratio: 1; background-color: #F5F5F5; display: flex; align-items: center; justify-content: center; }\
      .pc-image img { width: 100%; height: 100%; object-fit: cover; }\
      .pc-image.placeholder { background-color: #EEEEEE; }\
      .pc-image .placeholder-text { color: #999999; font-size: 12px; }\
      .pc-title { color: #404040; font-size: 16px; line-height: 32px; text-align: center; margin-top: 4px; font-family: Arial, Helvetica, sans-serif; padding: 8px; }\
      .pagination { display: flex; align-items: center; justify-content: center; gap: 8px; padding: 16px; background-color: #FFFFFF; }\
      .page-numbers { display: flex; gap: 4px; }\
      .page-number { background-color: #EEEEEE; border: 0.5px solid #CCCCCC; border-radius: 3px; color: #666666; font-size: 12px; font-family: Arial, Helvetica, sans-serif; line-height: 28px; min-width: 28px; text-align: center; padding: 0 8px; }\
      .page-active { background-color: #A3231F; border-color: #A3231F; color: #FFFFFF; }\
      .page-next { background-color: #FFFFFF; border: 0.5px solid #DDDDDD; border-radius: 3px; color: #666666; font-size: 12px; font-family: Arial, Helvetica, sans-serif; line-height: 28px; padding: 0 12px; }\
      .product-info-card { background-color: #f5f5f5; padding: 16px; border-radius: 0; }\
      .pic-header { color: #8B1A1A; font-size: 18px; font-weight: 700; line-height: 32px; font-family: Arial, Helvetica, sans-serif; margin-bottom: 12px; }\
      .pic-button .van-button { background: linear-gradient(135deg, #8B1A1A 0%, #A3231F 100%); color: #FFFFFF; font-size: 14px; font-weight: 500; padding: 10px 24px; border: none; border-radius: 0; width: 100%; height: auto; }\
      .pic-phones { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }\
      .pic-phone { display: flex; align-items: center; gap: 8px; color: #333333; font-size: 14px; font-family: Arial, Helvetica, sans-serif; }\
      .pic-phone-icon { color: #8B1A1A; font-size: 16px; }\
      .pic-qr-section { display: flex; align-items: flex-end; justify-content: space-between; margin-top: 8px; }\
      .pic-qr-label { color: #666666; font-size: 12px; font-family: Arial, Helvetica, sans-serif; }\
      .pic-qr-label strong { color: #8B1A1A; font-size: 14px; }\
      .pic-qr-code { width: 80px; height: 80px; background-color: #FFFFFF; display: flex; align-items: center; justify-content: center; border: 1px solid #DDDDDD; }\
      .product-gallery { background-color: #FFFFFF; padding: 16px 0; position: relative; }\
      .pg-header { display: flex; justify-content: space-between; align-items: center; padding: 0 16px 12px; }\
      .pg-logo { display: flex; align-items: center; gap: 8px; }\
      .pg-logo-icon { width: 32px; height: 32px; background-color: #FF0000; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #FFFFFF; font-size: 16px; font-weight: 700; }\
      .pg-logo-text { color: #1a3a5c; font-size: 14px; font-weight: 700; font-family: Arial, Helvetica, sans-serif; }\
      .pg-url { color: #FF6600; font-size: 14px; font-weight: 700; font-family: Arial, Helvetica, sans-serif; text-decoration: none; }\
      .pg-carousel { position: relative; display: flex; gap: 12px; overflow-x: auto; padding: 0 16px; scroll-snap-type: x mandatory; }\
      .pg-item { flex: 0 0 calc(33.33% - 8px); aspect-ratio: 1; background-color: #F5F5F5; overflow: hidden; scroll-snap-align: start; position: relative; }\
      .pg-item img { width: 100%; height: 100%; object-fit: cover; }\
      .pg-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: #999999; font-size: 12px; }\
      .pg-nav { position: absolute; top: 50%; transform: translateY(-50%); width: 32px; height: 32px; background-color: rgba(0,0,0,0.3); border: none; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 10; }\
      .pg-nav-prev { left: 8px; }\
      .pg-nav-next { right: 8px; }\
      .pg-nav-icon { color: #FFFFFF; font-size: 16px; }\
      .product-description { background-color: #FFFFFF; }\
      .pd-header { background: linear-gradient(to right, #8B0000, #A3231F); color: #FFFFFF; font-size: 18px; font-weight: 700; line-height: 40px; padding: 0 16px; font-family: Arial, Helvetica, sans-serif; box-shadow: 2px 0 4px rgba(0,0,0,0.1); }\
      .pd-body { padding: 16px; }\
      .pd-product-title { color: #000000; font-size: 22px; font-weight: 700; line-height: 32px; margin-bottom: 12px; font-family: Arial, Helvetica, sans-serif; }\
      .pd-list { color: #000000; font-size: 16px; line-height: 26px; font-family: Arial, Helvetica, sans-serif; }\
      .pd-list-item { margin-bottom: 8px; display: flex; align-items: flex-start; }\
      .pd-number { margin-right: 4px; }\
      .file-card { display: flex; align-items: center; gap: 12px; background-color: #FFFFFF; padding: 16px; border: 1px solid #EEEEEE; }\
      .fc-icon { color: #A3231F; font-size: 24px; }\
      .fc-info { flex: 1; }\
      .fc-name { color: #404040; font-size: 14px; font-weight: 500; margin-bottom: 4px; font-family: Arial, Helvetica, sans-serif; }\
      .fc-size { color: #999999; font-size: 12px; font-family: Arial, Helvetica, sans-serif; }\
      .fc-download { color: #666666; font-size: 18px; }\
      .company-info-bar-2 { background-color: #FFFFFF; padding: 16px; }\
      .cib2-item { display: flex; align-items: center; margin-bottom: 12px; }\
      .cib2-item:last-child { margin-bottom: 0; }\
      .cib2-icon { color: #E60000; font-size: 20px; margin-right: 8px; }\
      .cib2-label { color: #333333; font-size: 14px; margin-right: 8px; font-family: Arial, Helvetica, sans-serif; }\
      .cib2-value { color: #000000; font-size: 14px; font-weight: 500; font-family: Arial, Helvetica, sans-serif; }\
      .cib2-value a { color: #000000; text-decoration: none; }\
      .recommended-category-card-1 { display: flex; width: 100%; background-color: #000000; overflow: hidden; }\
      .rcc1-left { flex: 0 0 42%; background-color: #FFFFFF; display: flex; align-items: center; justify-content: center; }\
      .rcc1-image { width: 100%; aspect-ratio: 1; background-color: #F5F5F5; display: flex; align-items: center; justify-content: center; }\
      .rcc1-image img { width: 100%; height: 100%; object-fit: cover; }\
      .rcc1-placeholder { color: #999999; font-size: 12px; }\
      .rcc1-right { flex: 1; background-color: #000000; padding: 12px; display: flex; flex-direction: column; justify-content: center; }\
      .rcc1-title { color: #FFFFFF; font-size: 14px; font-weight: 700; line-height: 20px; margin-bottom: 6px; font-family: Arial, Helvetica, sans-serif; }\
      .rcc1-subtitle { color: #FFFFFF; font-size: 11px; line-height: 16px; margin-bottom: 8px; font-family: Arial, Helvetica, sans-serif; opacity: 0.9; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }\
      .rcc1-button .van-button { background-color: #FFFFFF; color: #000000; font-size: 11px; font-weight: 500; padding: 4px 12px; border: 1px solid #FF0000; border-radius: 0; height: auto; }\
      .company-info-card { display: flex; width: 100%; background-color: #000000; overflow: hidden; }\
      .cic-left { flex: 0 0 42%; background-color: #FFFFFF; display: flex; align-items: center; justify-content: center; }\
      .cic-image { width: 100%; aspect-ratio: 1; background-color: #F5F5F5; display: flex; align-items: center; justify-content: center; }\
      .cic-image img { width: 100%; height: 100%; object-fit: cover; }\
      .cic-placeholder { color: #999999; font-size: 12px; }\
      .cic-right { flex: 1; background-color: #000000; padding: 12px; display: flex; flex-direction: column; justify-content: center; }\
      .cic-title { color: #FFFFFF; font-size: 14px; font-weight: 700; line-height: 20px; margin-bottom: 6px; text-transform: uppercase; font-family: Arial, Helvetica, sans-serif; letter-spacing: 0.5px; }\
      .cic-paragraph { color: #FFFFFF; font-size: 11px; line-height: 16px; margin-bottom: 4px; font-family: Arial, Helvetica, sans-serif; opacity: 0.9; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }\
      .cic-button .van-button { background-color: #FF0000; color: #FFFFFF; font-size: 11px; font-weight: 700; padding: 4px 12px; border: none; border-radius: 0; height: auto; }\
      .customer-case-card { position: relative; width: 100%; aspect-ratio: 4/3; overflow: hidden; }\
      .ccc-image { width: 100%; height: 100%; background-color: #F5F5F5; }\
      .ccc-image img { width: 100%; height: 100%; object-fit: cover; }\
      .ccc-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: #999999; font-size: 14px; }\
      .ccc-overlay { position: absolute; bottom: 0; left: 0; right: 0; height: 20%; background-color: rgba(0, 0, 0, 0.7); display: flex; align-items: center; justify-content: center; }\
      .ccc-title { color: #FFFFFF; font-size: 16px; font-weight: 700; text-align: center; font-family: Arial, Helvetica, sans-serif; }\
      .recommended-category-card-2 { display: flex; width: 100%; background-color: #000000; overflow: hidden; }\
      .rcc2-left { flex: 1; background-color: #000000; padding: 12px; display: flex; flex-direction: column; justify-content: center; }\
      .rcc2-title { color: #FFFFFF; font-size: 14px; font-weight: 700; line-height: 20px; margin-bottom: 6px; font-family: Arial, Helvetica, sans-serif; }\
      .rcc2-content { color: #FFFFFF; font-size: 11px; line-height: 16px; margin-bottom: 8px; font-family: Arial, Helvetica, sans-serif; opacity: 0.9; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }\
      .rcc2-button .van-button { background-color: #8B0000; color: #FFFFFF; font-size: 11px; font-weight: 500; padding: 4px 12px; border: none; border-radius: 0; height: auto; }\
      .rcc2-right { flex: 0 0 42%; background-color: #FFFFFF; display: flex; align-items: center; justify-content: center; }\
      .rcc2-image { width: 100%; aspect-ratio: 1; background-color: #F5F5F5; display: flex; align-items: center; justify-content: center; }\
      .rcc2-image img { width: 100%; height: 100%; object-fit: cover; }\
      .rcc2-placeholder { color: #999999; font-size: 12px; }\
      .mini-program-header { display: flex; align-items: center; justify-content: space-between; background-color: #000000; height: 40px; padding: 0 12px; }\
      .mph-logo { width: 28px; height: 28px; border-radius: 50%; background-color: #A3231F; display: flex; align-items: center; justify-content: center; color: #FFFFFF; font-size: 12px; font-weight: 700; font-family: Arial, Helvetica, sans-serif; overflow: hidden; }\
      .mph-logo img { width: 100%; height: 100%; object-fit: cover; }\
      .mph-actions { display: flex; gap: 8px; }\
      .mph-btn { width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; color: #FFFFFF; font-size: 14px; cursor: pointer; }\
      .company-logo { background-color: #000000; display: flex; align-items: center; justify-content: center; padding: 8px 16px; }\
      .cl-img { max-height: 32px; max-width: 100%; object-fit: contain; }\
      .cl-placeholder { color: #666666; font-size: 12px; font-family: Arial, Helvetica, sans-serif; }\
      .video-player { width: 100%; background-color: #000000; position: relative; }\
      .vp-video { width: 100%; display: block; }\
      .vp-placeholder { width: 100%; aspect-ratio: 16/9; background-color: #1A1A1A; display: flex; align-items: center; justify-content: center; }\
      .vp-play { width: 48px; height: 48px; background-color: rgba(163, 35, 31, 0.9); border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; }\
      .vp-play-icon { color: #FFFFFF; font-size: 24px; margin-left: 2px; }\
      .tab-bar { display: flex; align-items: center; background-color: #000000; height: 40px; }\
      .tb-item { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; cursor: pointer; }\
      .tb-icon { color: #999999; font-size: 16px; }\
      .tb-text { color: #999999; font-size: 10px; font-family: Arial, Helvetica, sans-serif; }\
      .tb-active .tb-icon { color: #FFFFFF; }\
      .tb-active .tb-text { color: #FFFFFF; }\
      .separator .van-divider { margin: 0; border-color: #333333; color: #666666; font-size: 11px; font-family: Arial, Helvetica, sans-serif; }\
      .home-product-card { display: flex; width: 100%; background-color: #FFFFFF; overflow: hidden; }\
      .hpc-left { flex: 0 0 57%; background-color: #F5F5F5; display: flex; align-items: center; justify-content: center; }\
      .hpc-image { width: 100%; aspect-ratio: 1; display: flex; align-items: center; justify-content: center; }\
      .hpc-image img { width: 100%; height: 100%; object-fit: cover; }\
      .hpc-placeholder { color: #999999; font-size: 12px; }\
      .hpc-right { flex: 1; padding: 8px; display: flex; flex-direction: column; justify-content: center; gap: 4px; }\
      .hpc-name { color: #000000; font-size: 13px; font-weight: 700; line-height: 18px; font-family: Arial, Helvetica, sans-serif; }\
      .hpc-model { color: #666666; font-size: 11px; line-height: 16px; font-family: Arial, Helvetica, sans-serif; }\
      .hpc-tags .van-tag { font-size: 9px; padding: 2px 6px; background-color: #EEEEEE; color: #333333; border-radius: 0; }\
      .hpc-price { color: #A3231F; font-size: 12px; font-weight: 700; font-family: Arial, Helvetica, sans-serif; margin-top: auto; }\
      .carousel .van-swipe { width: 100%; }\
      .carousel .van-swipe-item { aspect-ratio: 16/9; background-color: #F5F5F5; display: flex; align-items: center; justify-content: center; }\
      .carousel .van-swipe-item img { width: 100%; height: 100%; object-fit: cover; }\
      .carousel-placeholder { color: #999999; font-size: 12px; }\
      .carousel .van-swipe__indicator { background-color: rgba(255,255,255,0.4); }\
      .carousel .van-swipe__indicator--active { background-color: #FFFFFF; }\
      .company-product-promo { width: 100%; background-color: #F5F5F5; }\
      .cpp-image { width: 100%; aspect-ratio: 7/6; display: flex; align-items: center; justify-content: center; }\
      .cpp-image img { width: 100%; height: 100%; object-fit: cover; }\
      .cpp-placeholder { color: #999999; font-size: 14px; }\
      .product-media-swipe { width: 100%; background-color: #000000; }\
      .pms-swipe .van-swipe-item { aspect-ratio: 16/9; background-color: #1A1A1A; display: flex; align-items: center; justify-content: center; }\
      .pms-swipe .van-swipe-item img { width: 100%; height: 100%; object-fit: cover; }\
      .pms-swipe .van-swipe-item video { width: 100%; height: 100%; object-fit: cover; }\
      .pms-placeholder { color: #999999; font-size: 12px; }\
      .pms-tabs { display: flex; height: 20px; background-color: #000000; }\
      .pms-tab { flex: 1; text-align: center; color: #999999; font-size: 11px; font-family: Arial, Helvetica, sans-serif; line-height: 20px; cursor: pointer; }\
      .pms-tab-active { color: #FFFFFF; font-weight: 700; }\
      .product-detail-info { background-color: #FFFFFF; padding: 16px; }\
      .pdi-top { display: flex; justify-content: space-between; align-items: flex-start; }\
      .pdi-left { flex: 1; }\
      .pdi-name { color: #000000; font-size: 16px; font-weight: 700; line-height: 24px; margin-bottom: 4px; font-family: Arial, Helvetica, sans-serif; }\
      .pdi-model { color: #666666; font-size: 13px; line-height: 20px; margin-bottom: 8px; font-family: Arial, Helvetica, sans-serif; }\
      .pdi-tags { display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 8px; }\
      .pdi-qr { width: 80px; height: 80px; background-color: #F5F5F5; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-left: 12px; }\
      .pdi-qr img { width: 100%; height: 100%; object-fit: cover; }\
      .pdi-qr-placeholder { color: #999999; font-size: 9px; }\
      .pdi-price { color: #A3231F; font-size: 16px; font-weight: 700; font-family: Arial, Helvetica, sans-serif; margin-top: 8px; }\
      .product-spec-table { width: 100%; padding: 0 10px; }\
      .pst-title { color: #000000; font-size: 14px; font-weight: 700; line-height: 30px; padding: 0 8px; font-family: Arial, Helvetica, sans-serif; background-color: #F5F5F5; }\
      .pst-table { width: 100%; border-collapse: collapse; }\
      .pst-table td { border: 1px solid #EEEEEE; padding: 6px 10px; font-size: 12px; font-family: Arial, Helvetica, sans-serif; line-height: 20px; }\
      .pst-label { color: #333333; font-weight: 500; width: 40%; background-color: #FAFAFA; }\
      .pst-value { color: #000000; }\
      .product-engineering-drawing { width: 100%; background-color: #FFFFFF; padding: 0 10px; }\
      .ped-title { color: #000000; font-size: 14px; font-weight: 700; line-height: 30px; text-align: center; font-family: Arial, Helvetica, sans-serif; }\
      .ped-image { width: 100%; background-color: #F5F5F5; display: flex; align-items: center; justify-content: center; }\
      .ped-image img { width: 100%; height: 100%; object-fit: cover; }\
      .ped-placeholder { color: #999999; font-size: 12px; padding: 40px 0; }\
      .product-introduction { width: 100%; background-color: #FFFFFF; padding: 16px; }\
      .pi-title { color: #000000; font-size: 16px; font-weight: 700; line-height: 24px; margin-bottom: 8px; font-family: Arial, Helvetica, sans-serif; }\
      .pi-text { color: #333333; font-size: 13px; line-height: 20px; font-family: Arial, Helvetica, sans-serif; white-space: pre-wrap; }\
      .product-action-bar { display: flex; align-items: center; background-color: #000000; height: 40px; }\
      .pab-btn { height: 40px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 500; font-family: Arial, Helvetica, sans-serif; cursor: pointer; border: none; }\
      .pab-consult { width: 60px; background-color: #333333; color: #FFFFFF; }\
      .pab-favorite { flex: 1; background-color: #1A1A1A; color: #FFFFFF; }\
      .pab-buy { flex: 1; background-color: #A3231F; color: #FFFFFF; }\
      .user-profile-summary { background-color: #FFFFFF; padding: 16px; display: flex; align-items: center; gap: 12px; }\
      .user-profile-summary .van-image { flex-shrink: 0; }\
      .ups-info { flex: 1; }\
      .ups-username { color: #000000; font-size: 16px; font-weight: 700; line-height: 24px; font-family: Arial, Helvetica, sans-serif; }\
      .ups-badge .van-tag { background-color: #EEEEEE; color: #666666; margin-top: 4px; }\
      .user-profile-menu-item .van-cell { padding: 12px 16px; background-color: #FFFFFF; }\
      .user-profile-menu-item .van-cell__left-icon { color: #A3231F; font-size: 20px; margin-right: 12px; }\
      .user-profile-menu-item .van-cell__title span { color: #333333; font-size: 16px; font-family: Arial, Helvetica, sans-serif; }\
      .thin-separator .van-divider { margin: 0; border-color: #EEEEEE; }\
      .copyright-bar { text-align: center; padding: 16px; background-color: #F5F5F5; }\
      .cb-text { color: #999999; font-size: 11px; font-family: Arial, Helvetica, sans-serif; line-height: 16px; }\
      .opc-price { color: #A3231F; font-size: 12px; font-weight: 700; font-family: Arial, Helvetica, sans-serif; }\
      .opc-date { color: #999999; font-size: 11px; font-family: Arial, Helvetica, sans-serif; }\
      .opc-status .van-tag { background-color: #A3231F; color: #FFFFFF; font-size: 11px; border-radius: 0; }\
      .order-status-tabs .van-tabs__wrap { height: 40px; background-color: #FFFFFF; }\
      .order-status-tabs .van-tab { color: #666666; font-size: 12px; font-family: Arial, Helvetica, sans-serif; }\
      .order-status-tabs .van-tab--active { color: #A3231F; font-weight: 700; }\
      .order-status-tabs .van-tabs__line { background-color: #A3231F; }\
      .order-status-tabs .van-tabs__content { display: none; }\
      .company-intro-section { background-color: #FFFFFF; }\
      .company-intro-section .van-cell__title { color: #000000; font-size: 18px; font-weight: 700; line-height: 28px; font-family: Arial, Helvetica, sans-serif; }\
      .company-intro-section .van-cell__label { color: #333333; font-size: 14px; line-height: 22px; font-family: Arial, Helvetica, sans-serif; white-space: pre-wrap; }\
    ';
    document.head.appendChild(style);
  }

  // ========== 3. 加载 Vant JS ==========
  var vantScript = document.createElement('script');
  vantScript.src = 'https://unpkg.com/vant@4/lib/vant.min.js';
  vantScript.onload = function () {
    injectCustomStyles();

    __rtRegister({
      VStack: {
        template: '<div class="vstack" :style="{ gap: gap + \'px\', padding: padding + \'px\' }"><slot></slot></div>',
        props: ['gap', 'padding']
      },
      HStack: {
        template: '<div class="hstack" :style="{ gap: gap + \'px\', padding: padding + \'px\' }"><slot></slot></div>',
        props: ['gap', 'padding']
      },
      CompanyInfoBar1: {
        template: '<div class="company-info-bar-1"><div class="ci-header"><div class="ci-title">{{ title }}</div><div class="ci-separator">—</div></div><div class="ci-content"><div v-if="phone" class="ci-item"><van-icon name="phone-o" class="ci-icon" /><span class="ci-label">Phone:</span><span class="ci-value">{{ phone }}</span></div><div v-if="email" class="ci-item"><van-icon name="envelop-o" class="ci-icon" /><span class="ci-label">Email:</span><span class="ci-value">{{ email }}</span></div><div v-if="address" class="ci-item"><van-icon name="location-o" class="ci-icon" /><span class="ci-label">Address:</span><span class="ci-value">{{ address }}</span></div></div></div>',
        props: ['title', 'phone', 'email', 'address'],
        components: { 'van-icon': vant.Icon }
      },
      CompanyHonors: {
        template: '<div class="company-honors"><div class="honors-grid"><div v-for="(item, index) in honorsList" :key="index" class="honor-item"><div class="honor-number">{{ item.number }}</div><div class="honor-text">{{ item.text }}</div></div></div></div>',
        props: ['honors'],
        data: function () {
          var honorsList = [];
          if (typeof this.honors === 'string') {
            try {
              honorsList = JSON.parse(this.honors || '[]');
            } catch (e) {
              honorsList = [];
            }
          } else {
            honorsList = this.honors || [];
          }
          return { honorsList: honorsList };
        }
      },
      LocationNavBar: {
        template: '<div class="location-nav-bar"><van-tabs v-model:active="activeIndex" :ellipsis="false" :animated="false"><van-tab v-for="(item, index) in navItems" :key="index" :title="item"></van-tab></van-tabs></div>',
        props: ['items', 'active'],
        components: { 'van-tabs': vant.Tabs, 'van-tab': vant.Tab },
        data: function () {
          var navItems = [];
          if (typeof this.items === 'string') {
            navItems = String(this.items || '').split(',').map(function (s) { return s.trim(); }).filter(function (s) { return s; });
          } else {
            navItems = this.items || ['主页', '产品中心', '商业案例', '关于我们'];
          }
          var activeIndex = parseInt(this.active, 10);
          if (isNaN(activeIndex)) activeIndex = 0;
          return { navItems: navItems, activeIndex: activeIndex };
        }
      },
      ProductCategory: {
        template: '<div class="product-category"><div class="pc-header">{{ title }}</div><div class="pc-list"><div v-for="(item, index) in categoriesList" :key="index" class="pc-item">{{ item }}</div></div></div>',
        props: ['title', 'categories'],
        data: function () {
          var categoriesList = [];
          if (typeof this.categories === 'string') {
            categoriesList = String(this.categories || '').split(',').map(function (s) { return s.trim(); }).filter(function (s) { return s; });
          } else {
            categoriesList = this.categories || [];
          }
          return { categoriesList: categoriesList };
        }
      },
      ProductCard: {
        template: '<div class="product-card"><div v-if="image" class="pc-image"><img :src="image" alt="" /></div><div v-else class="pc-image placeholder"><span class="placeholder-text">产品图片</span></div><div class="pc-title">{{ title }}</div></div>',
        props: ['title', 'image']
      },
      Pagination: {
        template: '<div class="pagination"><div class="page-numbers"><span v-for="n in totalPages" :key="n" :class="\'page-number \' + (n === currentPage ? \'page-active\' : \'\')">{{ n }}</span></div><div class="page-next">Next</div></div>',
        props: ['currentPage', 'totalPages']
      },
      ProductInfoCard: {
        template: '<div class="product-info-card"><div class="pic-header">{{ title }}</div><van-button size="small" class="pic-button">{{ buttonText }}</van-button><div class="pic-phones"><div v-for="(phone, index) in phonesList" :key="index" class="pic-phone"><van-icon name="phone-o" class="pic-phone-icon" /><span>{{ phone }}</span></div></div><div class="pic-qr-section"><div class="pic-qr-label"><strong>Scan</strong><br />Follow Us</div><div class="pic-qr-code"><van-image v-if="qrCodeUrl" :src="qrCodeUrl" width="80" height="80" fit="cover" /><span v-else style="color: #999; font-size: 10px;">QR Code</span></div></div></div>',
        props: ['title', 'buttonText', 'phones', 'qrCodeUrl'],
        components: { 'van-icon': vant.Icon, 'van-image': vant.Image, 'van-button': vant.Button },
        data: function () {
          var phonesList = [];
          if (typeof this.phones === 'string') {
            phonesList = String(this.phones || '').split(',').map(function (s) { return s.trim(); }).filter(function (s) { return s; });
          } else {
            phonesList = this.phones || [];
          }
          return { phonesList: phonesList };
        }
      },
      ProductGallery: {
        template: '<div class="product-gallery"><div class="pg-header"><div class="pg-logo"><div class="pg-logo-icon">P</div><span class="pg-logo-text">{{ brandName }}</span></div><a class="pg-url">{{ websiteUrl }}</a></div><div class="pg-carousel"><div v-for="(img, index) in imagesList" :key="index" class="pg-item"><img v-if="img" :src="img" alt="" /><div v-else class="pg-placeholder">产品{{ index + 1 }}</div></div></div><button class="pg-nav pg-nav-prev"><van-icon name="arrow-left" class="pg-nav-icon" /></button><button class="pg-nav pg-nav-next"><van-icon name="arrow" class="pg-nav-icon" /></button></div>',
        props: ['brandName', 'websiteUrl', 'images'],
        components: { 'van-icon': vant.Icon },
        data: function () {
          var imagesList = [];
          if (typeof this.images === 'string') {
            imagesList = String(this.images || '').split(',').map(function (s) { return s.trim(); });
          } else {
            imagesList = this.images || [];
          }
          return { imagesList: imagesList };
        }
      },
      ProductDescription: {
        template: '<div class="product-description"><div class="pd-header">{{ headerText }}</div><div class="pd-body"><div class="pd-product-title">{{ productTitle }}</div><div class="pd-list"><div v-for="(item, index) in itemsList" :key="index" class="pd-list-item"><span class="pd-number">{{ index + 1 }}*</span><span>{{ item }}</span></div></div></div></div>',
        props: ['headerText', 'productTitle', 'items'],
        data: function () {
          var itemsList = [];
          if (typeof this.items === 'string') {
            itemsList = String(this.items || '').split('\n').map(function (s) { return s.trim(); }).filter(function (s) { return s; });
          } else {
            itemsList = this.items || [];
          }
          return { itemsList: itemsList };
        }
      },
      FileCard: {
        template: '<div class="file-card"><van-icon name="description" class="fc-icon" /><div class="fc-info"><div class="fc-name">{{ fileName }}</div><div class="fc-size">{{ fileSize }}</div></div><van-icon name="down" class="fc-download" /></div>',
        props: ['fileName', 'fileSize'],
        components: { 'van-icon': vant.Icon }
      },
      CompanyInfoBar2: {
        template: '<div class="company-info-bar-2"><div v-if="address" class="cib2-item"><van-icon name="location-o" class="cib2-icon" /><span class="cib2-label">Address:</span><span class="cib2-value">{{ address }}</span></div><div v-if="phone" class="cib2-item"><van-icon name="phone-o" class="cib2-icon" /><span class="cib2-label">Tel:</span><span class="cib2-value">{{ phone }}</span></div><div v-if="email" class="cib2-item"><van-icon name="envelop-o" class="cib2-icon" /><span class="cib2-label">Email:</span><span class="cib2-value">{{ email }}</span></div><div v-if="website" class="cib2-item"><van-icon name="globe-o" class="cib2-icon" /><span class="cib2-label">Company Website:</span><span class="cib2-value">{{ website }}</span></div></div>',
        props: ['address', 'phone', 'email', 'website'],
        components: { 'van-icon': vant.Icon }
      },
      CompanyServiceCard1: {
        template: '<div class="recommended-category-card-1"><div class="rcc1-left"><div class="rcc1-image"><img v-if="image" :src="image" alt="" /><div v-else class="rcc1-placeholder">产品图片</div></div></div><div class="rcc1-right"><div class="rcc1-title">{{ title }}</div><div class="rcc1-subtitle">{{ subtitle }}</div><van-button size="small" class="rcc1-button">{{ buttonText }}</van-button></div></div>',
        props: ['title', 'subtitle', 'buttonText', 'image'],
        components: { 'van-button': vant.Button }
      },
      CompanyInfoCard: {
        template: '<div class="company-info-card"><div class="cic-left"><div class="cic-image"><img v-if="image" :src="image" alt="" /><div v-else class="cic-placeholder">建筑图片</div></div></div><div class="cic-right"><div class="cic-title">{{ title }}</div><div class="cic-paragraph">{{ paragraph1 }}</div><div class="cic-paragraph">{{ paragraph2 }}</div><div class="cic-paragraph">{{ paragraph3 }}</div><van-button size="small" class="cic-button">{{ buttonText }}</van-button></div></div>',
        props: ['title', 'paragraph1', 'paragraph2', 'paragraph3', 'buttonText', 'image'],
        components: { 'van-button': vant.Button }
      },
      CustomerCaseCard: {
        template: '<div class="customer-case-card"><div class="ccc-image"><img v-if="image" :src="image" alt="" /><div v-else class="ccc-placeholder">案例图片</div></div><div class="ccc-overlay"><div class="ccc-title">{{ title }}</div></div></div>',
        props: ['title', 'image']
      },
      CompanyServiceCard2: {
        template: '<div class="recommended-category-card-2"><div class="rcc2-left"><div class="rcc2-title">{{ title }}</div><div class="rcc2-content">{{ content }}</div><van-button size="small" class="rcc2-button">{{ buttonText }}</van-button></div><div class="rcc2-right"><div class="rcc2-image"><img v-if="image" :src="image" alt="" /><div v-else class="rcc2-placeholder">产品图片</div></div></div></div>',
        props: ['title', 'content', 'buttonText', 'image'],
        components: { 'van-button': vant.Button }
      },
      MiniProgramHeader: {
        template: '<div class="mini-program-header"><div class="mph-logo"><img v-if="logoUrl" :src="logoUrl" alt="" /><span v-else>银</span></div><div class="mph-actions"><span class="mph-btn" @click="$emit(\'share\')"><van-icon name="share-o" /></span><span class="mph-btn" @click="$emit(\'close\')"><van-icon name="cross" /></span></div></div>',
        props: ['logoUrl'],
        components: { 'van-icon': vant.Icon }
      },
      CompanyLogo: {
        template: '<div class="company-logo"><img v-if="imageUrl" :src="imageUrl" alt="" class="cl-img" /><span v-else class="cl-placeholder">公司Logo</span></div>',
        props: ['imageUrl']
      },
      VideoPlayer: {
        template: '<div class="video-player"><video v-if="videoUrl" :src="videoUrl" class="vp-video" controls :poster="posterUrl"></video><div v-else class="vp-placeholder"><div class="vp-play"><van-icon name="play" class="vp-play-icon" /></div></div></div>',
        props: ['videoUrl', 'posterUrl'],
        components: { 'van-icon': vant.Icon }
      },
      TabBar: {
        template: '<div class="tab-bar"><div v-for="(item, index) in tabItems" :key="index" :class="\'tb-item \' + (index === activeIndex ? \'tb-active\' : \'\')"><van-icon :name="item.icon" class="tb-icon" /><span class="tb-text">{{ item.text }}</span></div></div>',
        props: ['tabs', 'active'],
        components: { 'van-icon': vant.Icon },
        data: function () {
          var tabItems = [];
          if (typeof this.tabs === 'string') {
            try {
              tabItems = JSON.parse(this.tabs || '[]');
            } catch (e) {
              tabItems = [];
            }
          } else {
            tabItems = this.tabs || [];
          }
          if (!tabItems.length) {
            tabItems = [
              { text: '首页', icon: 'wap-home-o' },
              { text: '产品', icon: 'apps-o' },
              { text: '关于', icon: 'info-o' },
              { text: '联系', icon: 'phone-o' }
            ];
          }
          var activeIndex = parseInt(this.active, 10);
          if (isNaN(activeIndex)) activeIndex = 0;
          return { tabItems: tabItems, activeIndex: activeIndex };
        }
      },
      Separator: {
        template: '<div class="separator"><van-divider v-if="text">{{ text }}</van-divider><van-divider v-else></van-divider></div>',
        props: ['text'],
        components: { 'van-divider': vant.Divider }
      },
      HomeProductCard: {
        template: '<div class="home-product-card"><div class="hpc-left"><div class="hpc-image"><img v-if="image" :src="image" alt="" /><div v-else class="hpc-placeholder">产品图片</div></div></div><div class="hpc-right"><div class="hpc-name">{{ name }}</div><div class="hpc-model">{{ model }}</div><div class="hpc-tags"><van-tag v-for="(tag, i) in tagsList" :key="i" size="medium">{{ tag }}</van-tag></div><div class="hpc-price">{{ price }}</div></div></div>',
        props: ['name', 'model', 'tags', 'price', 'image'],
        components: { 'van-tag': vant.Tag },
        data: function () {
          var tagsList = [];
          if (typeof this.tags === 'string') {
            tagsList = String(this.tags || '').split(',').map(function (s) { return s.trim(); }).filter(function (s) { return s; });
          } else {
            tagsList = this.tags || [];
          }
          return { tagsList: tagsList };
        }
      },
      Carousel: {
        template: '<div class="carousel"><van-swipe :autoplay="3000" indicator-color="#FFFFFF"><van-swipe-item v-for="(img, i) in imagesList" :key="i"><img v-if="img" :src="img" alt="" /><div v-else class="carousel-placeholder">轮播图{{ i + 1 }}</div></van-swipe-item></van-swipe></div>',
        props: ['images'],
        components: { 'van-swipe': vant.Swipe, 'van-swipe-item': vant.SwipeItem },
        data: function () {
          var imagesList = [];
          if (typeof this.images === 'string') {
            imagesList = String(this.images || '').split(',').map(function (s) { return s.trim(); }).filter(function (s) { return s; });
          } else {
            imagesList = this.images || [];
          }
          if (!imagesList.length) imagesList = ['', '', ''];
          return { imagesList: imagesList };
        }
      },
      CompanyProductPromo: {
        template: '<div class="company-product-promo"><div class="cpp-image"><img v-if="imageUrl" :src="imageUrl" alt="" /><div v-else class="cpp-placeholder">推广图片</div></div></div>',
        props: ['imageUrl']
      },
      ProductMediaSwipe: {
        template: '<div class="product-media-swipe"><van-swipe :autoplay="0" indicator-color="#FFFFFF" class="pms-swipe"><van-swipe-item v-for="(item, i) in mediaList" :key="i"><video v-if="item.type === \'video\'" :src="item.url" controls style="width:100%;height:100%;background:#000;"></video><img v-else-if="item.url" :src="item.url" alt="" /><div v-else class="pms-placeholder">{{ item.type === \'video\' ? \'展示视频\' : \'产品图片\' }}</div></van-swipe-item></van-swipe><div class="pms-tabs"><div v-for="(tab, i) in tabsList" :key="i" :class="\'pms-tab \' + (i === activeTab ? \'pms-tab-active\' : \'\')">{{ tab }}</div></div></div>',
        props: ['tabs', 'media'],
        components: { 'van-swipe': vant.Swipe, 'van-swipe-item': vant.SwipeItem },
        data: function () {
          var tabsList = [];
          if (typeof this.tabs === 'string') {
            tabsList = String(this.tabs || '').split(',').map(function (s) { return s.trim(); }).filter(function (s) { return s; });
          } else {
            tabsList = this.tabs || [];
          }
          if (!tabsList.length) tabsList = ['展示视频', '产品图集', '用户案例'];
          var mediaList = [];
          if (typeof this.media === 'string') {
            try { mediaList = JSON.parse(this.media || '[]'); } catch (e) { mediaList = []; }
          } else {
            mediaList = this.media || [];
          }
          if (!mediaList.length) mediaList = [{ type: 'video' }, { type: 'image' }, { type: 'image' }];
          return { tabsList: tabsList, mediaList: mediaList, activeTab: 0 };
        }
      },
      ProductDetailInfo: {
        template: '<div class="product-detail-info"><div class="pdi-top"><div class="pdi-left"><div class="pdi-name">{{ name }}</div><div class="pdi-model">{{ model }}</div><div class="pdi-tags"><van-tag v-for="(tag, i) in tagsList" :key="i" size="medium" style="background-color:#EEEEEE;color:#333333;border-radius:0;font-size:9px;padding:2px 6px;">{{ tag }}</van-tag></div></div><div class="pdi-qr"><img v-if="qrCodeUrl" :src="qrCodeUrl" alt="" /><span v-else class="pdi-qr-placeholder">二维码</span></div></div><div class="pdi-price">{{ price }}</div></div>',
        props: ['name', 'model', 'tags', 'price', 'qrCodeUrl'],
        components: { 'van-tag': vant.Tag },
        data: function () {
          var tagsList = [];
          if (typeof this.tags === 'string') {
            tagsList = String(this.tags || '').split(',').map(function (s) { return s.trim(); }).filter(function (s) { return s; });
          } else { tagsList = this.tags || []; }
          return { tagsList: tagsList };
        }
      },
      ProductSpecTable: {
        template: '<div class="product-spec-table"><div class="pst-title">产品信息</div><table class="pst-table"><tr v-for="(row, i) in rowsList" :key="i"><td class="pst-label">{{ row.label }}</td><td class="pst-value">{{ row.value }}</td></tr></table></div>',
        props: ['rows'],
        data: function () {
          var rowsList = [];
          if (typeof this.rows === 'string') {
            try { rowsList = JSON.parse(this.rows || '[]'); } catch (e) { rowsList = []; }
          } else { rowsList = this.rows || []; }
          if (!rowsList.length) rowsList = [{ label: '产品型号', value: '' }, { label: '尺寸', value: '' }, { label: '材质', value: '' }, { label: '重量', value: '' }];
          return { rowsList: rowsList };
        }
      },
      ProductEngineeringDrawing: {
        template: '<div class="product-engineering-drawing"><div class="ped-title">工程图</div><div class="ped-image"><img v-if="imageUrl" :src="imageUrl" alt="" /><div v-else class="ped-placeholder">工程图</div></div></div>',
        props: ['imageUrl']
      },
      ProductIntroduction: {
        template: '<div class="product-introduction"><div class="pi-title">{{ title }}</div><div class="pi-text">{{ content }}</div></div>',
        props: ['title', 'content']
      },
      ProductActionBar: {
        template: '<div class="product-action-bar"><button class="pab-btn pab-consult">咨询</button><button class="pab-btn pab-favorite">加入收藏</button><button class="pab-btn pab-buy">立即购买</button></div>',
        props: []
      },
      UserProfileSummary: {
        template: '<div class="user-profile-summary"><van-image :src="avatarUrl" round width="50" height="50" fit="cover"><template #error><div style="width:50px;height:50px;border-radius:50%;background:#F5F5F5;display:flex;align-items:center;justify-content:center;color:#999;font-size:12px;">头像</div></template></van-image><div class="ups-info"><div class="ups-username">{{ username }}</div><van-tag size="medium" plain class="ups-badge">{{ productCount }}</van-tag></div></div>',
        props: ['avatarUrl', 'username', 'productCount'],
        components: { 'van-image': vant.Image, 'van-tag': vant.Tag }
      },
      UserProfileMenuItem: {
        template: '<div class="user-profile-menu-item"><van-cell :icon="icon" :title="text" is-link :border="false" /></div>',
        props: ['icon', 'text'],
        components: { 'van-cell': vant.Cell }
      },
      ThinSeparator: {
        template: '<div class="thin-separator"><van-divider /></div>',
        props: [],
        components: { 'van-divider': vant.Divider }
      },
      CopyrightBar: {
        template: '<div class="copyright-bar"><span class="cb-text">{{ text }}</span></div>',
        props: ['text']
      },
      OrderProductCard: {
        template: '<div class="home-product-card"><div class="hpc-left"><div class="hpc-image"><van-image v-if="image" :src="image" width="100%" height="100%" fit="cover" /><div v-else class="hpc-placeholder">产品图片</div></div></div><div class="hpc-right"><div class="hpc-name">{{ name }}</div><div class="hpc-model">{{ model }}</div><div class="opc-price">{{ price }}</div><div class="opc-date">{{ date }}</div><div class="opc-status"><van-tag size="medium" type="primary">{{ status }}</van-tag></div></div></div>',
        props: ['name', 'model', 'price', 'date', 'status', 'image'],
        components: { 'van-image': vant.Image, 'van-tag': vant.Tag }
      },
      OrderStatusTabs: {
        template: '<div class="order-status-tabs"><van-tabs v-model:active="activeIndex" :ellipsis="false" :animated="false"><van-tab v-for="(item, i) in itemsList" :key="i" :title="item"></van-tab></van-tabs></div>',
        props: ['items', 'active'],
        components: { 'van-tabs': vant.Tabs, 'van-tab': vant.Tab },
        data: function () {
          var itemsList = [];
          if (typeof this.items === 'string') {
            itemsList = String(this.items || '').split(',').map(function (s) { return s.trim(); }).filter(function (s) { return s; });
          } else { itemsList = this.items || []; }
          if (!itemsList.length) itemsList = ['定制中', '运输中', '售后中', '已完成'];
          var activeIndex = parseInt(this.active, 10);
          if (isNaN(activeIndex)) activeIndex = 0;
          return { itemsList: itemsList, activeIndex: activeIndex };
        }
      },
      CompanyIntroSection: {
        template: '<van-cell :title="title" :label="content" class="company-intro-section" :border="false" />',
        props: ['title', 'content'],
        components: { 'van-cell': vant.Cell }
      },
      PlaceholderPage: {
        template: '<van-empty :description="text" />',
        props: ['text'],
        components: { 'van-empty': vant.Empty }
      }
    });
  };
  document.head.appendChild(vantScript);

})();
