#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

# 使用参数选择环境：local（默认）或 prod
ENV=${1:-local}
ENV_FILE=".env.${ENV}"

if [ ! -f "$ENV_FILE" ]; then
    echo "错误：未找到配置文件 $ENV_FILE"
    echo "用法：./start.sh [local|prod]"
    exit 1
fi

echo "使用配置文件: $ENV_FILE"
docker compose --env-file "$ENV_FILE" -f docker-compose.yml up -d --build

echo ""
PORT=$(grep "^BIND_PORT=" "$ENV_FILE" | cut -d'=' -f2)
PORT=${PORT:-8000}
echo "需求收集工具已启动"
echo "访问地址: http://127.0.0.1:${PORT}"
