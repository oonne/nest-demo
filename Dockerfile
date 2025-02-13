# 使用Node.js 23版本的官方镜像作为基础镜像
FROM node:23-alpine

# 设置工作目录
WORKDIR /app

# 安装pnpm
RUN npm install -g pnpm

# 复制本地全部文件
COPY . .

# 安装依赖
RUN pnpm install

# 构建应用
RUN npm run build

# 暴露端口
EXPOSE 10011

# 启动应用
CMD ["npm", "run", "start"] 
