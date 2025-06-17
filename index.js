import express from 'express';
import httpProxy from 'http-proxy';
import bodyParser from 'body-parser';

const app = express();
const proxy = httpProxy.createProxyServer({});
const PORT = process.env.PORT || 63000;

// 支持通过环境变量指定 Ollama 服务地址，默认 localhost
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';

// 获取当前北京时间字符串，格式：YYYY-MM-DD HH:mm:ss
function getBeijingTimeString() {
  const now = new Date();
  // 北京时间 = UTC时间 + 8小时
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const bjDate = new Date(utc + 3600000 * 8);

  const yyyy = bjDate.getFullYear();
  const MM = String(bjDate.getMonth() + 1).padStart(2, '0');
  const dd = String(bjDate.getDate()).padStart(2, '0');
  const hh = String(bjDate.getHours()).padStart(2, '0');
  const mm = String(bjDate.getMinutes()).padStart(2, '0');
  const ss = String(bjDate.getSeconds()).padStart(2, '0');

  return `${yyyy}-${MM}-${dd} ${hh}:${mm}:${ss}`;
}

app.use(bodyParser.json());

app.post('/v1/chat/completions', (req, res) => {
  const requestId = Date.now() + '-' + Math.random().toString(36).substring(2, 8);
  const timeStr = getBeijingTimeString();

  console.log(`[${timeStr}] [${requestId}] Incoming request:`);
  console.log(`  Method: ${req.method}`);
  console.log(`  URL: ${req.originalUrl}`);
  console.log(`  Headers: ${JSON.stringify(req.headers, null, 2)}`);
  console.log(`  Body: ${JSON.stringify(req.body, null, 2)}`);

  const modifiedBody = {
    ...req.body,
    stream: true,
  };
  const bodyStr = JSON.stringify(modifiedBody);

  req.headers['content-length'] = Buffer.byteLength(bodyStr);
  req.headers['content-type'] = 'application/json';

  console.log(`[${timeStr}] [${requestId}] 🔄 Response started`);

  res.on('finish', () => {
    const endTimeStr = getBeijingTimeString();
    console.log(`[${endTimeStr}] [${requestId}] ✅ Response finished`);
  });

  proxy.web(req, res, {
    target: OLLAMA_URL,
    selfHandleResponse: false,
    buffer: {
      pipe: (dest) => {
        dest.write(bodyStr);
        dest.end();
      },
    },
  });

  proxy.on('error', (err, _req, res) => {
    const errTimeStr = getBeijingTimeString();
    console.error(`[${errTimeStr}] [${requestId}] ❌ Proxy error:`, err);
    if (!res.headersSent) {
      res.writeHead(502, { 'Content-Type': 'text/plain' });
    }
    res.end('Proxy error');
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Proxy running at http://localhost:${PORT}`);
});

