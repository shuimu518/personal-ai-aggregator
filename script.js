var providerSelect = document.getElementById('provider-select');
var modelSelect = document.getElementById('model-select');
var baseUrlInput = document.getElementById('base-url');
var promptInput = document.getElementById('prompt-input');
var sendBtn = document.getElementById('send-btn');
var resultArea = document.getElementById('result-area');
var statusDiv = document.getElementById('status');

var PROVIDERS = [
  { id: 'cherry-zhipu', name: 'Zhipu', baseUrl: 'https://open.bigmodel.cn/api/anthropic', api: 'anthropic-messages', models: ['glm-4.5-flash'] },
  { id: 'cherry-step_plan', name: 'Step Plan', baseUrl: 'https://api.stepfun.com/step_plan/v1', api: 'openai-completions', models: ['step-3.7-flash', 'step-3.5-flash'] },
  { id: 'cherry-modelscope', name: 'ModelScope', baseUrl: 'https://api-inference.modelscope.cn', api: 'anthropic-messages', models: ['Qwen/Qwen3.5-27B', 'ZhipuAI/GLM-5.2', 'deepseek-ai/DeepSeek-V4-Flash'] },
  { id: 'cherry-nvidia', name: 'NVIDIA API', baseUrl: 'https://integrate.api.nvidia.com/v1', api: 'openai-completions', models: ['openai/gpt-oss-120b:free', 'google/gemma-4-26b-a4b-it:free', 'meta/llama-3.1-8b-instruct'] },
  { id: 'cherry-openrouter', name: 'OpenRouter', baseUrl: 'https://openrouter.ai/api', api: 'anthropic-messages', models: ['google/gemma-4-26b-a4b-it:free', 'openai/gpt-oss-120b:free', 'nvidia/nemotron-3-super-120b-a12b:free'] },
  { id: 'cherry-deepseek', name: 'DeepSeek', baseUrl: 'https://api.deepseek.com', api: 'openai-completions', models: ['deepseek-v4-flash', 'deepseek-v4-pro'] },
  { id: 'cherry-baidu-cloud', name: 'Baidu Qianfan', baseUrl: 'https://qianfan.baidubce.com/v2', api: 'openai-completions', models: ['ernie-4.0-turbo-8k-latest', 'deepseek-v4-flash', 'kimi-k2.6'] },
  { id: 'cherry-hunyuan', name: 'Tencent Hunyuan', baseUrl: 'https://tokenhub.tencentmaas.com/v1', api: 'openai-completions', models: ['deepseek-v4-pro-202606', 'glm-5.3', 'kimi-k3'] }
];

function setStatus(text, type) {
  statusDiv.textContent = text;
  statusDiv.className = type ? 'status-' + type : '';
}

function renderProviderOptions() {
  providerSelect.innerHTML = '';
  PROVIDERS.forEach(function(provider) {
    var option = document.createElement('option');
    option.value = provider.id;
    option.textContent = provider.name;
    providerSelect.appendChild(option);
  });
  renderModelOptions();
}

function renderModelOptions() {
  var provider = PROVIDERS.find(function(item) { return item.id === providerSelect.value; }) || PROVIDERS[0];
  baseUrlInput.value = provider.baseUrl;
  modelSelect.innerHTML = '';
  provider.models.forEach(function(model) {
    var option = document.createElement('option');
    option.value = model;
    option.textContent = model;
    modelSelect.appendChild(option);
  });
}

providerSelect.addEventListener('change', renderModelOptions);

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderProviderOptions);
} else {
  renderProviderOptions();
}

sendBtn.addEventListener('click', async function() {
  var prompt = promptInput.value.trim();
  if (!prompt) {
    setStatus('请输入内容', 'error');
    return;
  }
  sendBtn.disabled = true;
  setStatus('已收到，后端部署后可真实调用模型', 'success');
  resultArea.textContent = '你选择了：' + providerSelect.value + ' / ' + modelSelect.value + '\n\n你的问题：' + prompt + '\n\n当前为前端演示模式。请部署后端服务后将 script.js 中的 BACKEND_ORIGIN 改为实际后端地址。';
  sendBtn.disabled = false;
});
