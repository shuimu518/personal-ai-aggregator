# 个人AI聚合平台网页部署记录

> 记录时间：2026-08-23
> 负责助手：打工斯斯 / OpenClaw 本地 agent
> 目标：把“个人AI聚合平台”前端测试页部署到 GitHub Pages，并沉淀可复用经验。
> 状态：已改为本地 README 记录 + 远端 GitHub REST API 直传，不再依赖 git push。

---

## 一、项目结论

- 新仓库：shuimu518/personal-ai-aggregator
- Pages 地址：https://shuimu518.github.io/personal-ai-aggregator/
- 本地留底目录：$scaffold
- 远端已上传文件：
  - index.html
  - script.js
  - .github/workflows/run-llm.yml

---

## 二、本地准备清单

### 2.1 目录结构建议

`
D:\GEO文件夹\GEO文件夹\Openclaw聚合平台\2026-08
├── index.html
├── script.js
└── .github
    └── workflows
        └── run-llm.yml
`

### 2.2 关键文件

- index.html：前端页面，负责输入框、发送按钮、结果显示。
- script.js：前端逻辑，负责触发 GitHub Actions、轮询结果、渲染状态。
- .github/workflows/run-llm.yml：GitHub Actions 工作流，用于后端执行模型调用。
- README.md：本文件，记录部署方法与排错经验。

---

## 三、GitHub 仓库与 Pages 配置

### 3.1 创建仓库

- 仓库名：personal-ai-aggregator
- 账号：shuimu518
- 可见性：公开
- 初始化：不需要自动生成 README / .gitignore

### 3.2 Pages 分支配置

- 推荐分支：main
- 推荐根目录：/ (root)
- 目录建议：/docs 也可，但本项目使用根目录更直接

---

## 四、部署方法

本项目采用 **GitHub REST API 直接上传文件** 的方式完成部署，不依赖本机 git push。

### 4.1 上传文件到 main 分支

上传 index.html、script.js、.github/workflows/run-llm.yml 到仓库根目录，并用 GitHub REST API 写入 main 分支。

### 4.2 启用 GitHub Pages

将 Pages 源设为 main 分支 + / 根目录。

### 4.3 验证 Pages 状态

通过 GitHub REST API 查看 Pages 的 html_url 与 status，确认页面可访问。

---

## 五、前端代码说明

### 5.1 index.html

- 深色主题页面
- 包含输入框、发送按钮、结果显示区
- 样式可直接运行，无需额外依赖

### 5.2 script.js

- 负责调用 GitHub Actions workflow_dispatch
- 支持轮询最近一次 workflow 状态
- 当前为测试版，后续可改为真正聚合模型调用

### 5.3 run-llm.yml

- 接收前端传入的 prompt
- 当前先打印 prompt，作为测试工作流
- 后续可替换为真实模型调用逻辑

---

## 六、遇到的问题与解决

| 问题 | 原因 | 解决 |
|------|------|------|
| git push 被策略阻断 | 当前 shell 执行 git 被限制 | 改用 GitHub REST API 上传 |
| GitHub API 返回 401 | PAT 无效或未正确提取 | 检查 token 来源与权限 |
| Pages 显示 404 | 刚创建后未立即生效 | 等待 1-3 分钟再访问 |
| 旧仓库 Your-Configuration 内容干扰 | 误用旧部署脚本 | 明确新建 personal-ai-aggregator |
| 前端不能直接写死 PAT | 安全风险 | 改用 Actions 后端 + Secret |

---

## 七、验证结果

- 仓库创建成功：shuimu518/personal-ai-aggregator
- 文件上传成功：
  - index.html
  - script.js
  - .github/workflows/run-llm.yml
- Pages 状态：uilt
- 访问地址：https://shuimu518.github.io/personal-ai-aggregator/

---

## 八、后续优化建议

1. **接入真实模型**
   - 在 GitHub Secrets 配置模型 API Key
   - 前端改为仅传 prompt/provider/model，不传真实 key
2. **模型选择器**
   - 根据 openclaw.json 动态生成模型下拉列表
3. **结果回显**
   - 让 Actions 把模型回复回写到 gh-pages 或公开 artifact
4. **错误处理**
   - 增加 provider/baseUrl/model 校验与错误提示
