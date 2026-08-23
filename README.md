# 个人AI聚合平台

> 生产目标：前端走 GitHub Pages，后端走独立服务，API Key 只保存在后端环境变量。

## 已就绪
- 前端：https://shuimu518.github.io/personal-ai-aggregator/
- 前端代码：`index.html`, `script.js`
- 后端仓库：https://github.com/shuimu518/personal-ai-aggregator-backend
- 后端代码：`backend/server.js`, `backend/package.json`, `backend/Dockerfile`

## 生产接入步骤
1. 打开 https://github.com/shuimu518/personal-ai-aggregator-backend
2. 选择 Railway / Render / Docker 自托管其中一种
3. 填入 provider API Key 环境变量，不要暴露到前端
4. 拿到后端公网域名后，更新前端 `script.js` 的 `BACKEND_ORIGIN`
5. 重新部署前端

## 推荐
- 最快：Railway 一键导入 GitHub 仓库
- 最稳：Docker 自托管
- 临时验证：本地 `cd backend && npm install && npm start`
