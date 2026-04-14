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
    const existing = document.querySelector(`script[data-require-tool-lib="${path}"]`)
    if (existing) {
      if (window.__requireToolComponents) {
        resolve(window.__requireToolComponents)
        return
      }
      existing.addEventListener('load', () => resolve(window.__requireToolComponents || {}), { once: true })
      existing.addEventListener('error', () => reject(new Error(`Failed to load component library: ${path}`)), { once: true })
      return
    }

    const script = document.createElement('script')
    script.src = path
    script.async = true
    script.dataset.requireToolLib = path
    script.onload = () => resolve(window.__requireToolComponents || {})
    script.onerror = () => reject(new Error(`Failed to load component library: ${path}`))
    document.head.appendChild(script)
  })

  libraryLoaders.set(path, loader)
  return loader
}

export async function preloadComponentLibraries(componentMetas = []) {
  const sourceFiles = [...new Set(componentMetas.map(item => item?.sourceFile).filter(Boolean))]
  await Promise.all(sourceFiles.map(loadScriptLibrary))
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
  })

  runtimeComponentCache.set(cacheKey, component)
  return component
}
