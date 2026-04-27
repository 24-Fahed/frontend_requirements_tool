# Vue 标准组件加载改造方案

## 1. 背景

当前工具的定制组件存储在 `lib/mini-program-style.js` 单一 IIFE 文件中，所有 30+ 组件打包在一起，通过 `__rtRegister` 全局回调注册。编写格式为非标准 Vue 组件，维护困难且不符合 Vue 生态规范。

目标：将组件改为标准 `.vue` SFC 文件格式，工具直接加载 `.vue` 文件。

## 2. 需要修改的构件

### 2.1 `componentLoader.js`（重写加载机制）

文件位置：`frontend/src/modules/interactive/services/componentLoader.js`

当前机制有三套需要替换：

- `loadScriptLibrary`：通过 `<script>` 标签加载 JS 文件，等待 `__rtRegister` 回调 → 替换为通过 `fetch` 获取 `.vue` 文件内容，交给 `vue3-sfc-loader` 编译
- `preloadComponentLibraries`：顺序加载所有 JS 库文件 → 替换为直接批量加载所有 `.vue` 文件
- `injectStyle`：从组件对象的 `style` 字段注入 CSS → 移除，`.vue` 文件的 `<style scoped>` 由 `vue3-sfc-loader` 自动处理

`resolveRuntimeComponent` 的外部接口不变（输入 meta，输出 Vue 组件实例），但内部逻辑变更：不再从 `library[componentTag]` 查找，而是直接从 `runtimeComponentCache` 中取出 `preloadComponentLibraries` 阶段已编译好的组件。

### 2.2 `ComponentPanel.vue` 和 `PhoneFrame.vue`（不改）

这两个文件调用了 `preloadComponentLibraries(metas)`。由于 `preloadComponentLibraries` 的函数名和参数签名不变（仍然接收组件元数据列表），这两个文件无需任何代码改动。它们调用的还是同一个函数，只是函数内部实现从 `<script>` 标签加载变成了 `.vue` 文件加载。

### 2.3 `frontend/package.json`（加依赖）

新增 `vue3-sfc-loader` 依赖。

### 2.4 `components.json`（改路径）

每个组件的 `sourceFile` 从 `lib/mini-program-style.js` 改为各自的 `.vue` 文件路径，例如 `lib/ProductCard/ProductCard.vue`。

`componentTag` 字段改为与 `.vue` 文件的 `export default` 组件名对应。

### 2.5 后端静态文件服务（补充 MIME 类型）

确认后端是否以正确的 MIME 类型提供 `.vue` 文件。当前后端已通过 `/static/` 路径提供 `lib/` 下的文件，可能只需补充 `.vue` 扩展名的 MIME 类型映射。

## 3. Vant 依赖的处理

### 完整加载链条

1. `componentLoader.js` 初始化时，检查 `window.vant` 是否存在。若不存在，通过 `<script>` 标签加载 Vant CSS 和 JS（CDN），等待加载完成
2. Vant 加载完成后，`window.vant` 全局对象可用（包含 `vant.Button`、`vant.Icon` 等）
3. 配置 `vue3-sfc-loader` 的模块缓存：当 `.vue` 文件中写 `import { Button } from 'vant'` 时，`vue3-sfc-loader` 不会去网络加载 `vant` 包，而是直接从模块缓存中返回 `window.vant` 对象
4. 这样 `.vue` 组件中使用标准的 `import { Button } from 'vant'` 语法即可，依赖由组件加载器自动处理，不需要工具主应用或组件开发者手动处理

### 谁负责加载 Vant

Vant 的加载由 `componentLoader.js` 负责。它是组件加载器的一部分，不是工具主应用的职责。组件开发者只需在 `.vue` 文件中写标准 import 语句，加载链条自动解析依赖。

## 4. 改动范围总结

| 构件 | 改动类型 | 改动量 |
|------|----------|--------|
| `componentLoader.js` | 重写加载机制 | 大 |
| `frontend/package.json` | 加依赖 | 1行 |
| `components.json` | 改 sourceFile 路径 | 中 |
| 后端静态文件服务 | 补充 .vue MIME 类型 | 极小 |
| `lib/` 目录 | 组件从 JS 重写为 .vue SFC | 大（编写方式标准化） |
