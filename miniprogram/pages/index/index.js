const { fetchHealth, extractTranscript } = require('../../utils/api')

const STAGE_TEXT = {
  pending: '任务已创建，等待处理...',
  processing: '正在解析链接、下载视频并识别语音...',
}

Page({
  data: {
    shareText: '',
    loading: false,
    stage: '',
    error: '',
    warning: '',
    result: null,
    durationText: '0',
  },

  onLoad() {
    this.checkHealth()
  },

  async checkHealth() {
    try {
      const health = await fetchHealth()
      const warnings = []
      if (!health.ffmpeg_available) {
        warnings.push('后端未检测到 ffmpeg')
      }
      if (!health.api_key_configured) {
        warnings.push('后端未配置 SILICONFLOW_API_KEY')
      }
      if (health.status !== 'ok') {
        this.setData({ warning: warnings.join(' · ') || '后端服务状态异常' })
      }
    } catch (err) {
      this.setData({
        warning: '无法连接后端，请确认服务已启动且 API 地址配置正确',
      })
    }
  },

  onInput(e) {
    this.setData({ shareText: e.detail.value })
  },

  onPaste() {
    wx.getClipboardData({
      success: (res) => {
        this.setData({ shareText: res.data || '' })
        wx.showToast({ title: '已粘贴', icon: 'success' })
      },
      fail: () => {
        wx.showToast({ title: '读取剪贴板失败', icon: 'none' })
      },
    })
  },

  async onSubmit() {
    const shareText = this.data.shareText.trim()
    if (!shareText) {
      return
    }

    this.setData({
      loading: true,
      error: '',
      result: null,
      stage: STAGE_TEXT.pending,
    })

    try {
      const result = await extractTranscript(shareText, (task) => {
        this.setData({
          stage: STAGE_TEXT[task.status] || STAGE_TEXT.processing,
        })
      })

      this.setData({
        result,
        durationText: String(Math.round(result.duration_seconds || 0)),
        stage: '',
      })
    } catch (err) {
      this.setData({
        error: err.message || '提取失败',
        stage: '',
      })
    } finally {
      this.setData({ loading: false })
    }
  },

  onCopy() {
    const transcript = this.data.result && this.data.result.transcript
    if (!transcript) {
      return
    }

    wx.setClipboardData({
      data: transcript,
      success: () => {
        wx.showToast({ title: '已复制', icon: 'success' })
      },
    })
  },
})
