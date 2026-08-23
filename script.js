const providerSelect = document.getElementById('provider-select');
const modelSelect = document.getElementById('model-select');
const baseUrlInput = document.getElementById('base-url');
const promptInput = document.getElementById('prompt-input');
const sendBtn = document.getElementById('send-btn');
const resultArea = document.getElementById('result-area');
const statusDiv = document.getElementById('status');

const PROVIDERS = [
  { id: 'cherry-zhipu', name: '鏅鸿氨', baseUrl: 'https://open.bigmodel.cn/api/anthropic', api: 'anthropic-messages', models: ['glm-4.5-flash'] },
  { id: 'cherry-step_plan', name: '闃惰穬鏄熻景 Step Plan', baseUrl: 'https://api.stepfun.com/step_plan/v1', api: 'openai-completions', models: ['step-3.7-flash', 'step-3.5-flash'] },
  { id: 'cherry-modelscope', name: 'ModelScope', baseUrl: 'https://api-inference.modelscope.cn', api: 'anthropic-messages', models: ['Qwen/Qwen3.5-27B', 'ZhipuAI/GLM-5.2', 'deepseek-ai/DeepSeek-V4-Flash'] },
  { id: 'cherry-nvidia', name: 'NVIDIA API', baseUrl: 'https://integrate.api.nvidia.com/v1', api: 'openai-completions', models: ['openai/gpt-oss-120b:free', 'google/gemma-4-26b-a4b-it:free', 'meta/llama-3.1-8b-instruct'] },
  { id: 'cherry-openrouter', name: 'OpenRouter', baseUrl: 'https://openrouter.ai/api', api: 'anthropic-messages', models: ['google/gemma-4-26b-a4b-it:free', 'openai/gpt-oss-120b:free', 'nvidia/nemotron-3-super-120b-a12b:free'] },
  { id: 'cherry-deepseek', name: 'DeepSeek', baseUrl: 'https://api.deepseek.com', api: 'openai-completions', models: ['deepseek-v4-flash', 'deepseek-v4-pro'] },
  { id: 'cherry-baidu-cloud', name: '鐧惧害鍗冨竼', baseUrl: 'https://qianfan.baidubce.com/v2', api: 'openai-completions', models: ['ernie-4.0-turbo-8k-latest', 'deepseek-v4-flash', 'kimi-k2.6'] },
  { id: 'cherry-hunyuan', name: '鑵捐娣峰厓', baseUrl: 'https://tokenhub.tencentmaas.com/v1', api: 'openai-completions', models: ['deepseek-v4-pro-202606', 'glm-5.3', 'kimi-k3'] }
];

const BACKEND_ORIGIN = (function() {
  const query = new URLSearchParams(location.search);
  const fromQuery = query.get('backendOrigin');
  if (fromQuery) return fromQuery.replace(/\/$/, '');
  const local = 'http://127.0.0.1:18792';
  const remote = 'https://personal-ai-aggregator-backend-production.up.railway.app';
  return location.hostname === 'shuimu518.github.io' ? remote : local;
})();

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

async function callBackend(prompt) {
  const provider = PROVIDERS.find(item => item.id === providerSelect.value) || PROVIDERS[0];
  const response = await fetch(BACKEND_ORIGIN + '/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ provider: provider.id, model: modelSelect.value, baseUrl: baseUrlInput.value, prompt, messages: [{ role: 'user', content: prompt }] })
  });
  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error('鍚庣璋冪敤澶辫触锛? + response.status + ' ' + text);
  }
  return await response.json();
}

async function callWorkflow(prompt) {
  const response = await fetch('https://api.github.com/repos/shuimu518/personal-ai-aggregator/actions/workflows/run-llm.yml/dispatches', {
    method: 'POST',
    headers: { Accept: 'application/vnd.github+json', 'Content-Type': 'application/json' },
    body: JSON.stringify({ ref: 'main', inputs: { prompt, provider: providerSelect.value, model: modelSelect.value, baseUrl: baseUrlInput.value } })
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error('GitHub API 閿欒: ' + response.status + ' ' + (errorData.message || response.statusText));
  }
  return { mode: 'workflow', provider: providerSelect.value, model: modelSelect.value, baseUrl: baseUrlInput.value };
}

sendBtn.addEventListener('click', async () => {
  const prompt = promptInput.value.trim();
  if (!prompt) {
    setStatus('璇疯緭鍏ュ唴瀹?, 'error');
    return;
  }
  sendBtn.disabled = true;
  setStatus('姝ｅ湪璇锋眰鏈湴鍚庣...', 'loading');
  resultArea.textContent = '';
  let result = null;
  let lastError = null;
  try {
    result = await callBackend(prompt);
    const label = result && result.provider && result.model ? result.provider + ' / ' + result.model : 'local backend';
    setStatus(label + ' 杩斿洖鎴愬姛', 'success');
  } catch (error) {
    lastError = error;
    setStatus('鍚庣涓嶅彲鐢紝鍒囨崲鍒?GitHub Actions 娴嬭瘯閾?..', 'loading');
    try {
      result = await callWorkflow(prompt);
      setStatus('宸插垏鎹㈠埌澶囩敤閾捐矾', 'success');
    } catch (workflowError) {
      setStatus('鎵ц澶辫触', 'error');
      resultArea.textContent = lastError.message;
      sendBtn.disabled = false;
      return;
    }
  }

  if (result && result.text) {
    resultArea.textContent = result.text || JSON.stringify(result, null, 2);
  } else if (result && result.data && result.data.choices && result.data.choices[0] && result.data.choices[0].message) {
    resultArea.textContent = result.data.choices[0].message.content || JSON.stringify(result, null, 2);
  } else if (result && result.error) {
    setStatus('鑱氬悎鍚庣杩斿洖閿欒', 'error');
    resultArea.textContent = JSON.stringify(result, null, 2);
  } else {
    setStatus('缁撴灉宸茶繑鍥?, 'success');
    resultArea.textContent = JSON.stringify(result, null, 2);
  }
  sendBtn.disabled = false;
});
