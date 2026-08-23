# 个人AI聚合平台

## 已实现
- 前端：https://shuimu518.github.io/personal-ai-aggregator/
- 后端仓库：https://github.com/shuimu518/personal-ai-aggregator-backend
- 单入口聚合后端：自动甄选模型，失败自动切换下一个
- API Key 只保存在后端环境变量，前端不暴露

## 生产接入
1. 打开 https://github.com/shuimu518/personal-ai-aggregator-backend
2. 用 Railway / Render / Docker 自托管部署
3. 设置环境变量：PROVIDER_ZHIPU_KEY / PROVIDER_OPENROUTER_KEY / PROVIDER_NVIDIA_KEY 等
4. 拿到后端域名后，把前端 `script.js` 的 `BACKEND_ORIGIN` 改成你的域名
5. 重新部署前端

## 本地验证
```bash
cd backend
npm install
PROVIDER_OPENROUTER_KEY=sk-or-v1-xxx npm start
```
