# 需求收集工具

帮助开发工程师向客户收集软件需求的 Web 工具。工程师编写配置文件定义问题和 UI 组件，客户在浏览器中通过表单填写和手机模拟器拖拽完成需求表达。

## 功能概览

- **需求问题表单** — 工程师定义文字输入、选项选择、交互式设计三种问题类型，客户逐项作答
- **手机模拟器** — 可视化拖拽界面，客户从组件面板拖动组件到模拟手机屏幕中完成页面布局设计
- **结果导出** — 客户提交后自动生成 YAML（人类可读）和 JSON（结构化数据）两种格式的需求结果

## 技术栈

| 层 | 技术 |
|---|---|
| 前端 | Vue 3 + Vite + Pinia + Element Plus + vuedraggable |
| 后端 | FastAPI (Python 3.10) + Uvicorn |
| 组件加载 | vue3-sfc-loader（运行时加载标准 `.vue` SFC 文件） |
| UI 组件库 | Vant 4（CDN） |
| 部署 | Docker + docker compose |

## 项目结构

```
require_tools/
├── frontend/                # 前端源码
│   └── src/
│       ├── modules/
│       │   ├── interactive/  # 交互式需求收集子系统（模拟器、组件面板、组件加载器）
│       │   ├── ui/           # 界面子系统（工具栏、侧边栏）
│       │   └── requirement/  # 需求收集子系统（表单渲染、结果提交）
│       ├── stores/           # Pinia 状态仓库
│       └── api/              # 后端 API 客户端
├── backend/                 # 后端源码
│   ├── main.py              # 应用入口
│   ├── routers/             # API 路由
│   ├── services/            # 业务服务（文件解析、存储、静态资源）
│   └── models/              # 数据模型
├── dev-config/              # 开发者配置文件
│   ├── requirements.yaml    # 需求问题定义
│   ├── components.json      # UI 组件描述
│   ├── default_layout.json  # 模拟器默认布局方案
│   └── lib/                 # 组件库（.vue SFC 文件）
│       └── ComponentName/
│           └── ComponentName.vue
├── docker/                  # Docker 部署文件
│   ├── Dockerfile
│   └── docker-compose.yml
└── docs/                    # 设计文档
```

## 快速开始

### 环境要求

- Docker 20+
- Docker Compose V2

无需安装 Python 或 Node.js，所有依赖在 Docker 镜像内构建。

### 启动

```bash
cd docker
docker compose --env-file .env.local -f docker-compose.yml up -d --build
```

启动后访问 `http://127.0.0.1:8000`

### 编写配置文件

将以下文件放入 `data/dev-config/`：

| 文件 | 必需 | 说明 |
|------|------|------|
| `requirements.yaml` | 是 | 需求问题定义 |
| `components.json` | 是 | UI 组件描述 |
| `default_layout.json` | 否 | 模拟器默认布局 |
| `lib/*.vue` | 是 | 组件库文件 |

配置文件编写方法见 [工程师使用手册](docs/工程师使用手册.md)。

### 组件库

组件采用标准 Vue 单文件组件（SFC）格式：

```vue
<template>
  <div class="product-card">
    <div class="title">{{ title }}</div>
  </div>
</template>

<script>
export default {
  name: 'ProductCard',
  props: {
    title: { type: String, default: '产品名称' }
  }
}
</script>

<style scoped>
.product-card { padding: 16px; }
.title { font-size: 16px; }
</style>
```

### 获取结果

客户点击"保存结果"后，输出到 `data/output/`：

```
output/
├── result.yaml      # 人类可读
└── result.json      # 结构化数据
```

## 文档

| 文档 | 说明 |
|------|------|
| [工程师使用手册](docs/工程师使用手册.md) | 配置文件编写指南、组件库开发规范 |
| [部署手册](docs/11_部署手册.md) | 本地开发和生产服务器部署 |
| [详细设计（交互式子系统）](docs/08_详细设计_交互式需求收集子系统.md) | 模拟器、组件加载器、拖拽系统设计 |
| [子系统接口文档](docs/06_子系统接口文档.md) | 三大子系统间接口定义 |

## 生产部署

```bash
# 上传到服务器
scp -r require_tools/ user@server:/opt/require-tools/

# 修改生产配置
# 编辑 docker/.env.prod，设置 BIND_PORT=80

# 启动
cd /opt/require-tools/docker
./start.sh prod
```

详细步骤见 [部署手册](docs/11_部署手册.md)。
