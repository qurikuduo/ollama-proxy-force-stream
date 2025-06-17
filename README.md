
# Ollama Proxy Streamer

> A lightweight Node.js proxy for Ollama API that forces `stream: true` in request body  
> 轻量级 Node.js 代理，自动给 Ollama API 请求体中添加 `stream: true`，实现流式返回。

---

## Features / 功能

- Automatically add `"stream": true` to `/v1/chat/completions` POST request body  
  自动在请求体中添加 `"stream": true`，实现 Ollama 流式响应  
- Proxy to customizable Ollama API URL via environment variable  
  支持通过环境变量自定义 Ollama 服务地址  
- Logs incoming requests and response start/end times with Beijing timezone (UTC+8)  
  打印请求日志和响应开始/结束日志，时间为北京时间（UTC+8）  

---

## Usage 示例

### 1. 构建镜像 Build

```bash
docker build -t ollama-proxy .
````

### 2. 运行 Run

```bash
docker run -it --rm -p 63000:63000 -e PORT=63000 -e OLLAMA_URL=http://localhost:11434 ollama-proxy
```

说明：

* `PORT`：设置代理监听端口，默认 63000
* `OLLAMA_URL`：设置 Ollama API 地址，默认 `http://localhost:11434`

---

## 使用方法 How to use

假设你本地 Ollama API 监听在 `http://localhost:11434`，启动代理后：

```bash
curl -X POST http://localhost:63000/v1/chat/completions \
    -H "Content-Type: application/json" \
    -d '{"model":"deepseek-r1:7b","messages":[{"role":"user","content":"Hello"}]}'
```

该请求会被代理拦截，自动添加 `"stream": true` 字段，并流式返回 Ollama 响应。

---

## 项目结构 Project structure

```
.
├── Dockerfile
├── index.js          # 主服务代码
├── package.json
└── README.md
```

---

## 反馈与贡献 Feedback & Contribution

欢迎提 Issue 和 Pull Request，感谢你的使用和支持！

---

## License

MIT

---

# Ollama Proxy Streamer

> 一个基于 Node.js 的轻量级 Ollama 代理，自动在请求体中添加 `stream: true`，实现流式返回。

---

## 功能 Features

* 自动给 `/v1/chat/completions` POST 请求体添加 `"stream": true`
* 通过环境变量自定义 Ollama API 地址
* 打印请求和响应开始/结束日志，时间为北京时间（UTC+8）

---

## 使用示例 Usage

### 构建镜像 Build

```bash
docker build -t ollama-proxy .
```

### 运行容器 Run

```bash
docker run -d --restart unless-stopped --name ollama-proxy -e PORT=63000 -e OLLAMA_URL=http://localhost:11434 --network=host ollama-proxy
```

---

## 如何使用 How to use

代理启动后，将请求发送到代理地址，例如：

```bash
curl -X POST http://localhost:63000/v1/chat/completions \
    -H "Content-Type: application/json" \
    -d '{"model":"deepseek-r1:7b","messages":[{"role":"user","content":"你好"}]}'
```

代理会自动添加 `"stream": true` 并转发请求，实现流式响应。

---

## 项目结构 Project Structure

```
.
├── Dockerfile
├── index.js
├── package.json
└── README.md
```

---

## 反馈与贡献 Feedback & Contribution

欢迎提交 Issues 或 Pull Requests！

---

## 许可协议 License

MIT
