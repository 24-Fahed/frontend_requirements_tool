import { defineComponent, h } from 'vue'
import * as Vue from 'vue'
import { loadModule } from 'vue3-sfc-loader'

/**
 * Injection key used by simulator document components to access the runtime
 * context of the iframe document.
 */
export const RUNTIME_CONTEXT_KEY = Symbol('runtime-context')

const runtimeComponentCache = new Map()
const vantReadyContexts = new Set()
const globalStylesInjectedContexts = new Set()
const normalizedPathCache = new Map()

/**
 * Creates a runtime context describing the target window/document pair where
 * simulator components should load assets and inject styles.
 *
 * @param {Window} targetWindow
 * @param {Document} targetDocument
 * @param {string} cacheKey
 * @returns {{ window: Window, document: Document, cacheKey: string }}
 */
export function createRuntimeContext(targetWindow, targetDocument, cacheKey) {
  targetWindow.Vue = Vue

  return {
    window: targetWindow,
    document: targetDocument,
    cacheKey,
  }
}

/**
 * Ensures the Vant runtime assets are loaded inside the target document
 * context so `window.vant` resolves against the simulator iframe.
 *
 * @param {{ window: Window, document: Document, cacheKey: string }} runtimeContext
 * @returns {Promise<void>}
 */
async function ensureVantLoaded(runtimeContext) {
  if (vantReadyContexts.has(runtimeContext.cacheKey) || runtimeContext.window.vant) {
    vantReadyContexts.add(runtimeContext.cacheKey)
    return
  }

  runtimeContext.window.Vue = Vue

  await new Promise((resolve, reject) => {
    const link = runtimeContext.document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/vant@4/lib/index.css'
    link.onload = resolve
    link.onerror = () => reject(new Error('Failed to load Vant CSS'))
    runtimeContext.document.head.appendChild(link)
  })

  await new Promise((resolve, reject) => {
    const script = runtimeContext.document.createElement('script')
    script.src = 'https://unpkg.com/vant@4/lib/vant.min.js'
    script.onload = resolve
    script.onerror = () => reject(new Error('Failed to load Vant JS'))
    runtimeContext.document.head.appendChild(script)
  })

  if (!runtimeContext.window.vant) {
    throw new Error('Vant runtime was not attached to the simulator window')
  }

  vantReadyContexts.add(runtimeContext.cacheKey)
}

/**
 * Builds the module namespace exposed to SFC `import { X } from 'vant'`
 * statements. The iframe runtime uses the global UMD bundle, so we expose the
 * object both as named exports and as a `default` export for compatibility.
 *
 * @param {any} vantNamespace
 * @returns {object}
 */
function createVantModule(vantNamespace) {
  if (!vantNamespace) {
    return {}
  }

  if (vantNamespace.default) {
    return vantNamespace
  }

  return {
    ...vantNamespace,
    default: vantNamespace,
  }
}

/**
 * Injects shared Vant theme variables and reset rules into the target runtime
 * document once per runtime context.
 *
 * @param {{ window: Window, document: Document, cacheKey: string }} runtimeContext
 * @returns {void}
 */
function injectGlobalStyles(runtimeContext) {
  if (globalStylesInjectedContexts.has(runtimeContext.cacheKey)) return

  const style = runtimeContext.document.createElement('style')
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
    .van-button, .van-popup, .van-cell, .van-card, .van-image, .van-tab, .van-tabbar, .van-tabs, .van-swipe, .van-tag, .van-divider, .van-pagination, .van-action-bar {
      box-shadow: none !important;
      border-radius: 0 !important;
      font-family: Arial, Helvetica, sans-serif !important;
    }
  `
  runtimeContext.document.head.appendChild(style)
  globalStylesInjectedContexts.add(runtimeContext.cacheKey)
}

/**
 * Converts a metadata `sourceFile` path into the static file URL expected by
 * the runtime loader. Results are memoized because the same paths are
 * normalized frequently across previews and node rendering.
 *
 * @param {string} [sourceFile='']
 * @returns {string}
 */
function normalizeSourcePath(sourceFile = '') {
  if (normalizedPathCache.has(sourceFile)) {
    return normalizedPathCache.get(sourceFile)
  }

  const normalized = sourceFile.startsWith('/') ? sourceFile : `/static/${sourceFile}`
  normalizedPathCache.set(sourceFile, normalized)
  return normalized
}

/**
 * Creates builtin layout container components that do not require external SFC
 * files.
 *
 * @param {string} tag
 * @returns {import('vue').Component | null}
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

/**
 * Builds vue3-sfc-loader options for a specific runtime context so compiled
 * component styles are injected into the target document instead of the host.
 *
 * @param {{ window: Window, document: Document, cacheKey: string }} runtimeContext
 * @returns {object}
 */
function createSfcLoaderOptions(runtimeContext) {
  return {
    moduleCache: {
      vue: Vue,
      vant: createVantModule(runtimeContext.window.vant),
    },
    getFile(url) {
      return fetch(url).then(res => {
        if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`)
        return res.text()
      })
    },
    addStyle(textContent) {
      const style = runtimeContext.document.createElement('style')
      style.textContent = textContent
      runtimeContext.document.head.appendChild(style)
    },
  }
}

/**
 * Preloads SFC component libraries into a specific runtime context.
 *
 * @param {Array<{sourceFile?: string, componentTag?: string, name?: string}>} componentMetas
 * @param {{ window: Window, document: Document, cacheKey: string }} runtimeContext
 * @returns {Promise<void>}
 */
export async function preloadComponentLibraries(componentMetas = [], runtimeContext) {
  const sourceFiles = [...new Set(componentMetas.map(meta => meta?.sourceFile).filter(Boolean))]
  if (sourceFiles.length === 0) return

  await ensureVantLoaded(runtimeContext)
  injectGlobalStyles(runtimeContext)

  const options = createSfcLoaderOptions(runtimeContext)
  const promises = sourceFiles.map(async (sourceFile) => {
    const path = normalizeSourcePath(sourceFile)
    const cacheKey = `${runtimeContext.cacheKey}::${path}`
    if (runtimeComponentCache.has(cacheKey)) return

    const component = await loadModule(path, options)
    runtimeComponentCache.set(cacheKey, component)
  })
  await Promise.all(promises)
}

/**
 * Resolves a runtime component for a specific context, falling back to an
 * on-demand preload when necessary.
 *
 * @param {{sourceFile?: string, componentTag?: string, name?: string} | null} meta
 * @param {{ window: Window, document: Document, cacheKey: string }} runtimeContext
 * @returns {Promise<import('vue').Component | null>}
 */
export async function resolveRuntimeComponent(meta, runtimeContext) {
  if (!meta) return null

  const builtin = createContainerComponent(meta.componentTag || meta.name)
  if (builtin) {
    const builtinKey = `builtin::${meta.componentTag || meta.name}`
    if (!runtimeComponentCache.has(builtinKey)) {
      runtimeComponentCache.set(builtinKey, builtin)
    }
    return runtimeComponentCache.get(builtinKey)
  }

  if (meta.sourceFile) {
    const cacheKey = `${runtimeContext.cacheKey}::${normalizeSourcePath(meta.sourceFile)}`
    if (runtimeComponentCache.has(cacheKey)) {
      return runtimeComponentCache.get(cacheKey)
    }

    await preloadComponentLibraries([meta], runtimeContext)
    return runtimeComponentCache.get(cacheKey) || null
  }

  return null
}
