#!/bin/bash

# 获取当前路径
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
cd "$SCRIPT_DIR"

# 构建镜像
docker compose build
echo "构建镜像完成"

# 保存镜像
rm -rf nest_demo_image.tar
docker save -o nest_demo_image.tar nest_demo
echo "镜像已保存为 nest_demo_image.tar"
