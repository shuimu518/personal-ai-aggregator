const GITHUB_OWNER = 'REPLACE_OWNER';
const GITHUB_REPO = 'REPLACE_REPO';
const GITHUB_TOKEN = 'REPLACE_TOKEN';

const promptInput = document.getElementById('prompt-input');
const sendBtn = document.getElementById('send-btn');
const resultArea = document.getElementById('result-area');
const statusDiv = document.getElementById('status');

function setStatus(text, type = '') {
  statusDiv.textContent = text;
  statusDiv.className = type ? 'status-' + type : '';
}

async function triggerWorkflow(prompt) {
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/actions/workflows/run-llm.yml/dispatches`;
  const body = {
    ref: 'main',
    inputs: { prompt }
  };
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`GitHub API 错误: ${response.status} ${errorData.message || response.statusText}`);
  }
  return true;
}

async function getLatestWorkflowResult() {
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/actions/runs?per_page=1`;
  const response = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${GITHUB_TOKEN}`
    }
  });
  if (!response.ok) {
    throw new Error(`获取工作流状态失败: ${response.status}`);
  }
  const data = await response.json();
  return data.workflow_runs && data.workflow_runs[0] ? data.workflow_runs[0] : null;
}

async function pollWorkflow(runId) {
  for (let i = 0; i < 30; i++) {
    const run = await getLatestWorkflowResult();
    if (!run || run.id !== runId) {
      await new Promise(r => setTimeout(r, 2000));
      continue;
    }
    if (run.status === 'completed') {
      return run;
    }
    await new Promise(r => setTimeout(r, 2000));
  }
  throw new Error('工作流超时');
}

sendBtn.addEventListener('click', async () => {
  const prompt = promptInput.value.trim();
  if (!prompt) {
    setStatus('请输入内容', 'error');
    return;
  }
  sendBtn.disabled = true;
  setStatus('正在触发工作流...', 'loading');
  resultArea.textContent = '';
  try {
    await triggerWorkflow(prompt);
    setStatus('工作流已触发，等待结果...', 'loading');
    const run = await pollWorkflow(null);
    const conclusion = run.conclusion || 'unknown';
    setStatus(`工作流完成：${conclusion}`, conclusion === 'success' ? 'success' : 'error');
    resultArea.textContent = `工作流结果：${conclusion}\n如需真实模型回复，请继续完善 Actions 与 Secret 配置。`;
  } catch (e) {
    setStatus('执行失败', 'error');
    resultArea.textContent = e.message || String(e);
  } finally {
    sendBtn.disabled = false;
  }
});
