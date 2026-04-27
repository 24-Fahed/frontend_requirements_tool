import { defineComponent, h } from 'vue'
import * as Vue from 'vue'
import { loadModule } from 'vue3-sfc-loader'

const runtimeComponentCache = new Map()

// ========== Vant 依赖加载 ==========

/** @type {boolean} Vant 依赖是否已就绪 */
let vantReady = false

/**
 * 确保 Vant UI 库已加载到全局（window.vant）。
 * 若尚未加载，通过 CDN 注入 Vant CSS 和 JS 并等待完成。
 * @returns {Promise<void>}
 */
async function ensureVantLoaded() {
  if (vantReady || window.vant) {
    vantReady = true
    return
  }
  // 加载 Vant CSS
  await new Promise((resolve, reject) => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/vant@4/lib/index.css'
    link.onload = resolve
    link.onerror = () => reject(new Error('Failed to load Vant CSS'))
    document.head.appendChild(link)
  })
  // 加载 Vant JS
  await new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/vant@4/lib/vant.min.js'
    script.onload = resolve
    script.onerror = () => reject(new Error('Failed to load Vant JS'))
    document.head.appendChild(script)
  })
  vantReady = true
}

// ========== 全局样式注入 ==========

/** @type {boolean} 全局样式是否已注入 */
let globalStylesInjected = false

/**
 * 注入全局样式（Vant 主题变量、CSS reset、Vant 组件覆写）。
 * 仅在首次调用时执行，后续调用直接跳过。
 */
function injectGlobalStyles() {
  if (globalStylesInjected) return
  const style = document.createElement('style')
  style.dataset.rtGlobalStyles = ''
  style.textContent = `
    :root {
      --van-primary-color: #A3231F;
      --van-primary-color-light: #c84040;
      --van-text-color: #FFFFFF;
      --van-text-color-2: #E0E0E0;
      --van-text-color-3: #999999;
      --van-border-color: #333333;
      --van-background: #000000;
      --van-background-2: #1A1A1A;
      --van-font-family: Arial, Helvetica, sans-serif;
      --van-border-radius-sm: 0;
      --van-border-radius-md: 0;
      --van-border-radius-lg: 0;
      --van-border-radius-max: 0;
    }
    * { -webkit-tap-highlight-color: transparent; }
    .van-button, .van-popup, .van-cell, .van-card, .van-image, .van-tab, .van-tabbar, .van-tabs, .van-swipe, .van-tag, .van-divider, .van-pagination { box-shadow: none !important; border-radius: 0 !important; font-family: Arial, Helvetica, sans-serif !important; }
  `
  document.head.appendChild(style)
  globalStylesInjected = true
}

// ========== 路径工具 ==========

/**
 * 将相对路径规范化为绝对路径。
 * 若 sourceFile 已以 '/' 开头则原样返回，否则添加 '/static/' 前缀。
 * @param {string} sourceFile - 组件文件路径（相对或绝对）
 * @returns {string} 规范化后的绝对路径
 */
function normalizeSourcePath(sourceFile = '') {
  return sourceFile.startsWith('/') ? sourceFile : `/static/${sourceFile}`
}

// ========== 内置容器组件 ==========

/**
 * 创建内置容器组件（VStack / HStack / Grid2Col）。
 * 使用 Vue h() 渲染函数实现 flex/grid 布局，不依赖外部文件。
 * @param {string} tag - 容器标签名
 * @returns {import('vue').Component | null} Vue 组件定义，若 tag 不匹配则返回 null
 */
function createContainerComponent(tag) {
  const definitions = {
    VStack: (props, slots) =>
      h('div', {
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: `${Number(props.gap || 0)}px`,
          padding: `${Number(props.padding || 0)}px`,
          width: '100%',
        },
      }, slots.default?.()),
    HStack: (props, slots) =>
      h('div', {
        style: {
          display: 'flex',
          flexDirection: 'row',
          gap: `${Number(props.gap || 0)}px`,
          width: '100%',
          alignItems: 'stretch',
        },
      }, slots.default?.()),
    Grid2Col: (props, slots) =>
      h('div', {
        style: {
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: `${Number(props.gap || 8)}px`,
          width: '100%',
        },
      }, slots.default?.()),
  }

  const renderer = definitions[tag]
  if (!renderer) {
    return null
  }

  return defineComponent({
    name: tag,
    props: {
      gap: [Number, String],
      padding: [Number, String],
    },
    setup(props, { slots }) {
      return () => renderer(props, slots)
    },
  })
}

// ========== vue3-sfc-loader 配置 ==========

/**
 * 创建 vue3-sfc-loader 的配置对象。
 * - moduleCache：将 'vue' 映射到当前 Vue 运行时，'vant' 映射到 window.vant，
 *   使 .vue 文件中的 import 语句无需网络请求即可解析。
 * - getFile：通过 fetch 获取文件内容。
 * - addStyle：将编译后的 CSS 注入 document.head。
 * @returns {object} vue3-sfc-loader 配置
 */
function createSfcLoaderOptions() {
  return {
    moduleCache: {
      vue: Vue,
      vant: window.vant,
    },
    getFile(url) {
      return fetch(url).then(res => {
        if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`)
        return res.text()
      })
    },
    addStyle(textContent) {
      const style = document.createElement('style')
      style.textContent = textContent
      document.head.appendChild(style)
    },
  }
}

// ========== 公开 API ==========

/**
 * 批量预加载组件库。
 * 提取去重的 sourceFile 路径，确保 Vant 依赖和全局样式就绪后，
 * 通过 vue3-sfc-loader 并行编译所有 .vue 文件，结果存入缓存。
 * @param {Array<{sourceFile?: string, componentTag?: string, name?: string}>} componentMetas - 组件元数据列表
 * @returns {Promise<void>}
 */
export async function preloadComponentLibraries(componentMetas = []) {
  const sourceFiles = [...new Set(componentMetas.map(m => m?.sourceFile).filter(Boolean))]
  if (sourceFiles.length === 0) return

  await ensureVantLoaded()
  injectGlobalStyles()

  const options = createSfcLoaderOptions()
  const promises = sourceFiles.map(async (sourceFile) => {
    const path = normalizeSourcePath(sourceFile)
    if (runtimeComponentCache.has(path)) return

    const component = await loadModule(path, options)
    runtimeComponentCache.set(path, component)
  })
  await Promise.all(promises)
}

/**
 * 根据组件元数据解析运行时 Vue 组件实例。
 * 优先返回内置容器组件，其次从缓存取 .vue 编译结果；
 * 若缓存未命中则降级调用 preloadComponentLibraries 单独加载。
 * @param {{sourceFile?: string, componentTag?: string, name?: string} | null} meta - 单个组件元数据
 * @returns {Promise<import('vue').Component | null>}
 */
export async function resolveRuntimeComponent(meta) {
  if (!meta) return null

  // 内置容器组件
  const builtin = createContainerComponent(meta.componentTag || meta.name)
  if (builtin) {
    const builtinKey = `builtin::${meta.componentTag || meta.name}`
    if (!runtimeComponentCache.has(builtinKey)) {
      runtimeComponentCache.set(builtinKey, builtin)
    }
    return builtin
  }

  // .vue 文件加载的组件
  if (meta.sourceFile) {
    const cacheKey = normalizeSourcePath(meta.sourceFile)

    // 从缓存取（preload 阶段已编译）
    if (runtimeComponentCache.has(cacheKey)) {
      return runtimeComponentCache.get(cacheKey)
    }

    // 降级：如果 preload 未加载过，单独加载
    await preloadComponentLibraries([meta])
    return runtimeComponentCache.get(cacheKey) || null
  }

  return null
}
