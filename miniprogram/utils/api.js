const { API_BASE_URL, POLL_INTERVAL_MS, MAX_POLL_ATTEMPTS } = require('./config')

function request(path, options = {}) {
  const { method = 'GET', data, timeout = 15000 } = options

  return new Promise((resolve, reject) => {
    wx.request({
      url: `${API_BASE_URL}${path}`,
      method,
      data,
      timeout,
      header: {
        'Content-Type': 'application/json',
      },
      success(res) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data)
          return
        }
        const detail = (res.data && res.data.detail) || `请求失败 (${res.statusCode})`
        reject(new Error(typeof detail === 'string' ? detail : JSON.stringify(detail)))
      },
      fail(err) {
        reject(new Error(err.errMsg || '网络请求失败'))
      },
    })
  })
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function fetchHealth() {
  return request('/api/health')
}

function createExtractTask(shareText) {
  return request('/api/extract/async', {
    method: 'POST',
    data: { share_text: shareText },
  })
}

function fetchTaskStatus(taskId) {
  return request(`/api/tasks/${taskId}`)
}

async function extractTranscript(shareText, onStatus) {
  const { task_id: taskId } = await createExtractTask(shareText)

  for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt += 1) {
    const task = await fetchTaskStatus(taskId)

    if (onStatus) {
      onStatus(task)
    }

    if (task.status === 'done') {
      return task.result
    }

    if (task.status === 'failed') {
      throw new Error(task.error || '提取失败')
    }

    await sleep(POLL_INTERVAL_MS)
  }

  throw new Error('处理超时，请稍后重试')
}

module.exports = {
  fetchHealth,
  extractTranscript,
}
