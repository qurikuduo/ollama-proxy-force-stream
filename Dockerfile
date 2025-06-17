FROM node:18-alpine

# 工作目录
WORKDIR /app

# 复制代码
COPY package.json ./
COPY index.js ./

# 安装依赖
RUN npm install --production

# 启动服务
CMD ["node", "index.js"]

