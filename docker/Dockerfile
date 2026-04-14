# =============================================
# 需求收集工具 - 单阶段构建
# 前端构建 → 后端 + 前端静态文件
# =============================================

# ---- 构建参数（通过 .env 传入）----
ARG NODE_BASE_IMAGE=docker.m.daocloud.io/library/node:20-alpine
ARG PYTHON_BASE_IMAGE=docker.m.daocloud.io/library/python:3.10-slim
ARG NPM_REGISTRY=https://registry.npmmirror.com
ARG PIP_INDEX_URL=https://pypi.tuna.tsinghua.edu.cn/simple
ARG PIP_TRUSTED_HOST=pypi.tuna.tsinghua.edu.cn

# =============================================
# 阶段1：构建前端
# =============================================
FROM ${NODE_BASE_IMAGE} AS frontend-builder

ARG NPM_REGISTRY

WORKDIR /build/frontend

# 配置 npm 国内镜像
RUN npm config set registry ${NPM_REGISTRY}

# 先复制依赖文件，利用 Docker 缓存
COPY frontend/package.json frontend/package-lock.json* ./

# 安装依赖
RUN npm install

# 复制前端源码并构建
COPY frontend/ ./
RUN npm run build

# =============================================
# 阶段2：最终运行镜像
# =============================================
FROM ${PYTHON_BASE_IMAGE}

ARG PIP_INDEX_URL
ARG PIP_TRUSTED_HOST

WORKDIR /app

# 配置 pip 国内镜像并安装依赖
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt \
    -i ${PIP_INDEX_URL} \
    --trusted-host ${PIP_TRUSTED_HOST}

# 复制后端代码
COPY backend/ ./

# 从前端构建阶段复制构建产物
COPY --from=frontend-builder /build/frontend/dist ./frontend-dist/

# 创建默认数据目录
RUN mkdir -p /app/dev-config/lib /app/output

# 环境变量
ENV HOST=0.0.0.0
ENV PORT=8000
ENV PYTHONPATH=/app

EXPOSE 8000

CMD ["python", "main.py"]
