# 使用Node.js 23版本的官方镜像作为基础镜像
FROM node:23-alpine

# 设置工作目录
WORKDIR /app

# 复制本地编译后源代码
COPY ./dist .

# 暴露端口
EXPOSE 10011

# 启动应用
CMD ["node", "src/main.js"] 
