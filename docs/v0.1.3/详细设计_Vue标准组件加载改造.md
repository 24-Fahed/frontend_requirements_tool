# 详细设计：Vue 标准组件加载改造

## 1. 模块接口分析

### 1.1 `componentLoader.js` 对外接口

当前导出两个函数，改造后签名不变：

| 函数 | 输入 | 输出 | 调用方 |
|------|------|------|--------|
| `preloadComponentLibraries(componentMetas)` | `Array<{sourceFile, ...}>` 组件元数据列表 | `Promise<void>` | `ComponentPanel.vue`、`PhoneFrame.vue` |
| `resolveRuntimeComponent(meta)` | `{sourceFile, componentTag, name, ...}` 单个组件元数据 | `Promise<VueComponent \| null>` | `SimNode.vue`、`ComponentPanel.vue`（PanelPreview） |

**不变量**：这两个函数的签名和语义不变，调用方无需任何修改。

### 1.2 `createContainerComponent` 内部接口

`VStack`/`HStack`/`Grid2Col` 三个内置容器组件通过 `h()` 渲染函数实现，不涉及文件加载。改造后保持不变。

### 1.3 数据流（改造后）

```
components.json                         componentLoader.js                    渲染层
┌──────────────┐    fetch .vue文件     ┌──────────────────────┐  resolveRuntimeComponent
│ sourceFile:  │ ──────────────────→   │ preloadComponentLib  │ ─────────────────────→
│ lib/Product  │   vue3-sfc-loader     │ raries()             │   返回已编译的Vue组件
│ Card/Product │   编译为Vue组件       │                      │
│ Card.vue     │   存入 cache         │ runtimeComponentCache│
└──────────────┘                       └──────────────────────┘
```

具体流程：

1. `ComponentPanel.vue` / `PhoneFrame.vue` 在 `onMounted` 中调用 `preloadComponentLibraries(allMetas)`
2. `preloadComponentLibraries` 提取去重的 sourceFile 路径列表，对每个路径：
   - `fetch` 获取 `.vue` 文件文本内容
   - 通过 `vue3-sfc-loader` 的 `loadModule` 编译为 Vue 组件
   - 以 sourceFile 路径为 key 存入 `runtimeComponentCache`
3. `SimNode.vue` / `PanelPreview` 调用 `resolveRuntimeComponent(meta)` 获取已编译组件
4. `resolveRuntimeComponent` 从 `runtimeComponentCache` 直接取出返回（不再查找 library 对象）

## 2. componentLoader.js 重写方案

### 2.1 移除的函数

- `loadScriptLibrary(sourceFile)` — 不再通过 `<script>` 标签加载
- `injectStyle(styleId, cssText)` — `.vue` 文件的 `<style scoped>` 由 vue3-sfc-loader 自动处理

### 2.2 移除的模块变量

- `libraryLoaders` — 不再需要，用 `runtimeComponentCache` 统一缓存
- `injectedStyles` — 不再需要手动注入样式

### 2.3 保留的模块变量

- `runtimeComponentCache` — 缓存 key 变更为 sourceFile 路径（每个 `.vue` 文件对应一个组件）

### 2.4 新增：Vant 依赖加载

```javascript
let vantReady = false

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
    link.onerror = reject
    document.head.appendChild(link)
  })
  // 加载 Vant JS
  await new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/vant@4/lib/vant.min.js'
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  })
  vantReady = true
}
```

### 2.5 新增：vue3-sfc-loader 配置与加载函数

```javascript
import { loadModule } from 'vue3-sfc-loader'
import * as Vue from 'vue'

function createSfcLoaderOptions() {
  return {
    moduleCache: {
      vue: Vue,
      vant: window.vant,
    },
    getFile(url) {
      // url 来自 fetch，是完整路径如 /static/lib/ProductCard/ProductCard.vue
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
```

### 2.6 新增：全局样式注入

当前 `mini-program-style.js` 的 `injectCustomStyles()` 包含：
- `:root` CSS 变量（Vant 主题覆写）
- 全局 reset（`-webkit-tap-highlight-color` 等）
- Vant 组件样式覆写（去掉圆角、阴影等）

这些全局样式在第一个组件加载前注入一次即可：

```javascript
let globalStylesInjected = false

function injectGlobalStyles() {
  if (globalStylesInjected) return
  const style = document.createElement('style')
  style.dataset.rtGlobalStyles = ''
  style.textContent = `:root { ... } * { ... } ...`
  document.head.appendChild(style)
  globalStylesInjected = true
}
```

### 2.7 `preloadComponentLibraries` 新实现

```javascript
export async function preloadComponentLibraries(componentMetas = []) {
  const sourceFiles = [...new Set(componentMetas.map(m => m?.sourceFile).filter(Boolean))]
  if (sourceFiles.length === 0) return

  // 确保 Vant 和全局样式就绪
  await ensureVantLoaded()
  injectGlobalStyles()

  // 批量并行加载所有 .vue 文件
  const options = createSfcLoaderOptions()
  const promises = sourceFiles.map(async (sourceFile) => {
    const path = normalizeSourcePath(sourceFile)
    if (runtimeComponentCache.has(path)) return

    const component = await loadModule(path, options)
    runtimeComponentCache.set(path, component)
  })
  await Promise.all(promises)
}
```

### 2.8 `resolveRuntimeComponent` 新实现

```javascript
export async function resolveRuntimeComponent(meta) {
  if (!meta) return null

  const cacheKey = meta.sourceFile
    ? normalizeSourcePath(meta.sourceFile)
    : `${meta.componentTag || meta.name}`

  // 检查缓存（preload 阶段已编译好的组件）
  if (runtimeComponentCache.has(cacheKey)) {
    return runtimeComponentCache.get(cacheKey)
  }

  // 内置容器组件
  const builtin = createContainerComponent(meta.componentTag || meta.name)
  if (builtin) {
    runtimeComponentCache.set(cacheKey, builtin)
    return builtin
  }

  // 如果 preload 未加载过（降级：单独加载）
  if (meta.sourceFile) {
    await preloadComponentLibraries([meta])
    return runtimeComponentCache.get(normalizeSourcePath(meta.sourceFile)) || null
  }

  return null
}
```

## 3. components.json 路径变更

每个组件的 `sourceFile` 从 `lib/mini-program-style.js` 改为各自的 `.vue` 文件路径。

格式：`lib/{ComponentName}/{ComponentName}.vue`

示例：

```json
{
  "name": "ProductCard",
  "sourceFile": "lib/ProductCard/ProductCard.vue",
  "componentTag": "ProductCard",
  ...
}
```

`componentTag` 字段保留，用于内置容器判断（VStack/HStack/Grid2Col）。对于 `.vue` 文件加载的组件，componentTag 仅作缓存 key 的辅助标识，不参与加载逻辑。

## 4. 后端 MIME 类型

`backend/routers/static_route.py` 使用 FastAPI 的 `FileResponse`。对于 `.vue` 文件，`FileResponse` 默认不会设置正确的 MIME 类型。

修改：为 `.vue` 文件显式设置 `media_type='text/plain'`。

```python
@router.get("/lib/{path:path}")
def serve_static(path: str) -> FileResponse:
    import os
    full_path = os.path.join(base_dir, "lib", path)
    if not os.path.isfile(full_path):
        raise HTTPException(status_code=404, detail="文件不存在")
    # .vue 文件需要显式设置 MIME 类型
    if path.endswith('.vue'):
        return FileResponse(full_path, media_type='text/plain')
    return FileResponse(full_path)
```

## 5. .vue 组件文件结构

每个组件一个目录，放在 `dev-config/lib/` 下：

```
dev-config/lib/
├── ProductCard/
│   └── ProductCard.vue
├── CompanyInfoBar1/
│   └── CompanyInfoBar1.vue
├── HomeProductCard/
│   └── HomeProductCard.vue
...
```

`.vue` 文件格式示例（ProductCard）：

```vue
<template>
  <div class="product-card">
    <div v-if="image" class="pc-image">
      <img :src="image" alt="" />
    </div>
    <div v-else class="pc-image placeholder">
      <span class="placeholder-text">产品图片</span>
    </div>
    <div class="pc-title">{{ title }}</div>
  </div>
</template>

<script>
export default {
  props: {
    title: { type: String, default: '产品名称' },
    image: { type: String, default: '' }
  }
}
</script>

<style scoped>
.product-card { ... }
.pc-image { ... }
...
</style>
```

对于使用 Vant 组件的组件：

```vue
<script>
import { Icon, Tabs, Tab } from 'vant'
export default {
  components: { 'van-icon': Icon, 'van-tabs': Tabs, 'van-tab': Tab },
  props: { ... },
  data() { return { ... } }
}
</script>
```

## 6. 实际操作步骤

### 步骤 1：安装 vue3-sfc-loader

```bash
cd frontend
npm install vue3-sfc-loader
```

### 步骤 2：重写 componentLoader.js

按第 2 节方案重写文件。保留 `normalizeSourcePath`、`createContainerComponent` 不变。移除 `loadScriptLibrary`、`injectStyle`、`libraryLoaders`、`injectedStyles`。新增 `ensureVantLoaded`、`injectGlobalStyles`、`createSfcLoaderOptions`。重写 `preloadComponentLibraries` 和 `resolveRuntimeComponent`。

### 步骤 3：修改后端 MIME 类型

修改 `backend/routers/static_route.py`，为 `.vue` 文件设置 `media_type='text/plain'`。

### 步骤 4：创建 ProductCard.vue 示例

在 `dev-config/lib/ProductCard/ProductCard.vue` 创建第一个 `.vue` 组件文件，内容从 `mini-program-style.js` 中的 ProductCard 提取。

### 步骤 5：更新 components.json

将 ProductCard 的 `sourceFile` 从 `lib/mini-program-style.js` 改为 `lib/ProductCard/ProductCard.vue`。

### 步骤 6：验证

1. 启动后端：`cd backend && python main.py`
2. 启动前端开发服务器：`cd frontend && npm run dev`
3. 打开浏览器，打开组件面板，确认 ProductCard 在面板预览中正常显示
4. 将 ProductCard 拖入模拟器，确认渲染正确
