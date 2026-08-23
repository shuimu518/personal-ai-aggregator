const providerSelect = document.getElementById('provider-select');
const modelSelect = document.getElementById('model-select');
const baseUrlInput = document.getElementById('base-url');
const promptInput = document.getElementById('prompt-input');
const sendBtn = document.getElementById('send-btn');
const resultArea = document.getElementById('result-area');
const statusDiv = document.getElementById('status');

const PROVIDERS = [
  { id: 'cherry-zhipu', name: '智谱', baseUrl: 'https://open.bigmodel.cn/api/anthropic', api: 'anthropic-messages', models: ['glm-4.5-flash'] },
  { id: 'cherry-step_plan', name: '阶跃星辰 Step Plan', baseUrl: 'https://api.stepfun.com/step_plan/v1', api: 'openai-completions', models: ['step-3.7-flash', 'step-3.5-flash', 'step-image-edit-2'] },
  { id: 'cherry-modelscope', name: 'ModelScope', baseUrl: 'https://api-inference.modelscope.cn', api: 'anthropic-messages', models: ['Qwen/Qwen3.5-27B', 'Qwen/Qwen3-5-27B', 'ZhipuAI/GLM-5.2', 'deepseek-ai/DeepSeek-V4-Flash'] },
  { id: 'cherry-nvidia', name: 'NVIDIA API', baseUrl: 'https://integrate.api.nvidia.com/v1', api: 'openai-completions', models: ['openai/gpt-oss-120b:free', 'google/gemma-4-26b-a4b-it:free', 'meta/llama-3.1-8b-instruct'] },
  { id: 'cherry-cloudflare', name: 'Cloudflare Workers AI', baseUrl: 'https://api.cloudflare.com/client/v4/accounts/4fa24e21c050c0c8f5a6de187997b236/ai/v1', api: 'openai-completions', models: ['@cf/openai/gpt-oss-120b', '@cf/deepseek-ai/deepseek-r1-distill-qwen-32b'] },
  { id: 'cherry-silicon', name: 'SiliconFlow', baseUrl: 'https://api.siliconflow.cn', api: 'anthropic-messages', models: ['deepseek-ai/DeepSeek-V3.2', 'Qwen/Qwen3-8B', 'deepseek-ai/DeepSeek-R1-0528-Qwen3-8B'] },
  { id: 'cherry-openrouter', name: 'OpenRouter', baseUrl: 'https://openrouter.ai/api', api: 'anthropic-messages', models: ['google/gemma-4-26b-a4b-it:free', 'openai/gpt-oss-120b:free', 'nvidia/nemotron-3-super-120b-a12b:free'] },
  { id: 'cherry-deepseek', name: 'DeepSeek', baseUrl: 'https://api.deepseek.com', api: 'openai-completions', models: ['deepseek-v4-flash', 'deepseek-v4-pro'] },
  { id: 'cherry-cherryin', name: 'CherryIn', baseUrl: 'https://open.cherryin.cc', api: 'anthropic-messages', models: ['deepseek/deepseek-v4-flash(free)', 'qwen/qwen3-coder-30b-a3b-instruct(free)', 'qwen/qwen3.5-9b(free)'] },
  { id: 'cherry-shangtang', name: '商汤', baseUrl: 'https://token.sensenova.cn/v1', api: 'openai-completions', models: ['sensenova-6.7-flash-lite', 'deepseek-v4-flash', 'glm-5.2'] },
  { id: 'cherry-agnes', name: 'Agnes', baseUrl: 'https://api.agnes-ai.cn/v1', api: 'openai-completions', models: ['agnes-2.5-flash', 'agnes-2.5-pro', 'agnes-image-2.1-flash'] },
  { id: 'cherry-moma', name: 'Moma', baseUrl: 'https://zhenze-huhehaote.cmecloud.cn/v1', api: 'openai-completions', models: ['deepseek-v4-flash'] },
  { id: 'cherry-baidu-cloud', name: '百度千帆', baseUrl: 'https://qianfan.baidubce.com/v2', api: 'openai-completions', models: ['ernie-4.0-turbo-8k-latest', 'deepseek-v4-flash', 'kimi-k2.6'] },
  { id: 'cherry-hunyuan', name: '腾讯混元', baseUrl: 'https://tokenhub.tencentmaas.com/v1', api: 'openai-completions', models: ['deepseek-v4-pro-202606', 'glm-5.3', 'kimi-k3', 'hunyuan-turbos-vision-video-20250728'] },
  { id: 'cherry-xirang', name: '夕岚', baseUrl: 'https://wishub-x6.ctyun.cn/v1', api: 'openai-completions', models: ['MiniMax-M3', 'GLM-5.2', 'DeepSeek-V4-Flash', 'Doubao-Seed-2.0-pro'] },
  { id: 'cherry-mimo', name: 'Mimo', baseUrl: 'https://api.xiaomimimo.com/anthropic', api: 'anthropic-messages', models: ['mimo-v2.5'] },
  { id: 'cherry-stepfun', name: 'StepFun', baseUrl: 'https://api.stepfun.com', api: 'anthropic-messages', models: ['step-3.5-flash'] },
  { id: 'cherry-moonshot', name: 'Moonshot', baseUrl: 'https://api.moonshot.cn/anthropic', api: 'anthropic-messages', models: ['kimi-k2.7-code', 'kimi-k2.5', 'kimi-k2.6'] },
  { id: 'cherry-Weytoken', name: 'Weytoken', baseUrl: 'https://api.weytoken.com/v1', api: 'openai-completions', models: ['deepseek-v4-flash'] },
  { id: 'cherry-TokenRiver', name: 'TokenRiver', baseUrl: 'https://api.tokenriver.cn/v1', api: 'openai-completions', models: ['deepseek-v4-flash', 'glm-5.2', 'qwen3.7-flash', 'mimo-v2.5'] }
];

const CHAT_ENDPOINTS = [
  { label: '本地代理测试链', url: 'http://127.0.0.1:18791/api/chat' },
  { label: 'GitHub Actions 工作流', url: 'https://api.github.com/repos/shuimu518/personal-ai-aggregator/actions/workflows/run-llm.yml/dispatches', mode: 'workflow' },
];

function setStatus(text, type = '') {
  statusDiv.textContent = text;
  statusDiv.className = type ? 'status-' + type : '';
}

function renderProviderOptions() {
  providerSelect.innerHTML = '';
  PROVIDERS.forEach(provider => {
    const option = document.createElement('option');
    option.value = provider.id;
    option.textContent = provider.name;
    providerSelect.appendChild(option);
  });
  renderModelOptions();
}

function renderModelOptions() {
  const provider = PROVIDERS.find(item => item.id === providerSelect.value) || PROVIDERS[0];
  baseUrlInput.value = provider.baseUrl;
  modelSelect.innerHTML = '';
  provider.models.forEach(model => {
    const option = document.createElement('option');
    option.value = model;
    option.textContent = model;
    modelSelect.appendChild(option);
  });
}

providerSelect.addEventListener('change', renderModelOptions);
renderProviderOptions();

function toAnthropicPayload(model, prompt) {
  return {
    model,
    max_tokens: 256,
    messages: [{ role: 'user', content: prompt }]
  };
}

function toOpenAiPayload(model, prompt) {
  return {
    model,
    max_tokens: 256,
    messages: [{ role: 'user', content: prompt }]
  };
}

function buildPayload(provider, prompt) {
  const model = modelSelect.value;
  if (provider.api === 'anthropic-messages') {
    return toAnthropicPayload(model, prompt);
  }
  return toOpenAiPayload(model, prompt);
}

async function callLocalProxy(prompt) {
  const provider = PROVIDERS.find(item => item.id === providerSelect.value) || PROVIDERS[0];
  const body = {
    prompt,
    provider: provider.id,
    model: modelSelect.value,
    baseUrl: provider.baseUrl
  };
  const response = await fetch('http://127.0.0.1:18791/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`本地代理调用失败：${response.status} ${text}`);
  }
  const data = await response.json();
  return data;
}

async function callWorkflow(prompt) {
  const response = await fetch('https://api.github.com/repos/shuimu518/personal-ai-aggregator/actions/workflows/run-llm.yml/dispatches', {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ ref: 'main', inputs: { prompt, provider: providerSelect.value, model: modelSelect.value, baseUrl: baseUrlInput.value } })
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`GitHub API 错误: ${response.status} ${errorData.message || response.statusText}`);
  }
  return { mode: 'workflow', provider: providerSelect.value, model: modelSelect.value, baseUrl: baseUrlInput.value };
}

sendBtn.addEventListener('click', async () => {
  const prompt = promptInput.value.trim();
  if (!prompt) {
    setStatus('请输入内容', 'error');
    return;
  }
  sendBtn.disabled = true;
  setStatus('正在尝试本地代理...', 'loading');
  resultArea.textContent = '';
  let result = null;
  let lastError = null;
  try {
    result = await callLocalProxy(prompt);
    setStatus('本地代理测试完成', 'success');
  } catch (error) {
    lastError = error;
    setStatus('本地代理不可用，切换到公开测试链...', 'loading');
    try {
      result = await callWorkflow(prompt);
      setStatus('已切换到 GitHub Actions 测试链', 'success');
    } catch (workflowError) {
      setStatus('执行失败', 'error');
      resultArea.textContent = [lastError.message, workflowError.message].filter(Boolean).join('\n');
      sendBtn.disabled = false;
      return;
    }
  }

  if (result && result.choices && result.choices[0] && result.choices[0].message) {
    resultArea.textContent = result.choices[0].message.content || JSON.stringify(result, null, 2);
  } else if (result && result.error) {
    setStatus('代理返回错误', 'error');
    resultArea.textContent = JSON.stringify(result, null, 2);
  } else {
    setStatus('结果已返回', 'success');
    resultArea.textContent = JSON.stringify(result, null, 2);
  }
  sendBtn.disabled = false;
});
