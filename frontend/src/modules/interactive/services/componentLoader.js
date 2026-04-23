import { defineComponent, h } from 'vue'

const libraryLoaders = new Map()
const runtimeComponentCache = new Map()
const injectedStyles = new Set()

function injectStyle(styleId, cssText) {
  if (!cssText || injectedStyles.has(styleId)) {
    return
  }

  const styleEl = document.createElement('style')
  styleEl.dataset.requireToolStyle = styleId
  styleEl.textContent = cssText
  document.head.appendChild(styleEl)
  injectedStyles.add(styleId)
}

function normalizeSourcePath(sourceFile = '') {
  return sourceFile.startsWith('/') ? sourceFile : `/static/${sourceFile}`
}

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

async function loadScriptLibrary(sourceFile) {
  const path = normalizeSourcePath(sourceFile)

  if (libraryLoaders.has(path)) {
    return libraryLoaders.get(path)
  }

  const loader = new Promise((resolve, reject) => {
    // 检查是否已有相同脚本（热更新场景）
    const existing = document.querySelector(`script[data-require-tool-lib="${path}"]`)
    if (existing && existing.__rtResolved) {
      resolve(existing.__rtResolved)
      return
    }

    // 设置回调：库文件加载 CDN 完成后调用 __rtRegister(components)
    window.__rtRegister = function (components) {
      const script = document.currentScript
      if (script) {
        script.__rtResolved = components
      }
      resolve(components)
    }

    const script = document.createElement('script')
    script.src = path
    script.async = true
    script.dataset.requireToolLib = path
    script.onload = () => {
      // 后备兼容：如果库文件同步设置了 __requireToolComponents（无 CDN 依赖）
      if (window.__requireToolComponents && typeof window.__requireToolComponents === 'object') {
        script.__rtResolved = window.__requireToolComponents
        resolve(window.__requireToolComponents)
      }
      // 否则等待 __rtRegister 被调用（CDN 异步加载场景）
    }
    script.onerror = () => reject(new Error(`Failed to load component library: ${path}`))
    document.head.appendChild(script)
  })

  libraryLoaders.set(path, loader)
  return loader
}

export async function preloadComponentLibraries(componentMetas = []) {
  const sourceFiles = [...new Set(componentMetas.map(item => item?.sourceFile).filter(Boolean))]
  // 顺序加载：每个库文件独占 __rtRegister，避免并行争抢
  for (const sf of sourceFiles) {
    await loadScriptLibrary(sf)
  }
}

export async function resolveRuntimeComponent(meta) {
  if (!meta) {
    return null
  }

  const cacheKey = `${meta.sourceFile || 'builtin'}::${meta.componentTag || meta.name}`
  if (runtimeComponentCache.has(cacheKey)) {
    return runtimeComponentCache.get(cacheKey)
  }

  const builtinComponent = createContainerComponent(meta.componentTag || meta.name)
  if (builtinComponent) {
    runtimeComponentCache.set(cacheKey, builtinComponent)
    return builtinComponent
  }

  if (!meta.sourceFile || !meta.componentTag) {
    return null
  }

  const library = await loadScriptLibrary(meta.sourceFile)
  const entry = library?.[meta.componentTag]
  if (!entry) {
    return null
  }

  injectStyle(meta.componentTag, entry.style)

  const component = defineComponent({
    name: meta.componentTag,
    props: entry.props || [],
    template: entry.template,
    components: entry.components || {},
    data: entry.data,
    computed: entry.computed,
    methods: entry.methods,
  })

  runtimeComponentCache.set(cacheKey, component)
  return component
}
