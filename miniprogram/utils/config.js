// 开发阶段可在微信开发者工具中关闭「不校验合法域名」
// 正式发布前请将后端部署到 HTTPS 域名，并在小程序后台配置 request 合法域名
const API_BASE_URL = 'https://api.violet37.cn'

const POLL_INTERVAL_MS = 2000
const MAX_POLL_ATTEMPTS = 180

module.exports = {
  API_BASE_URL,
  POLL_INTERVAL_MS,
  MAX_POLL_ATTEMPTS,
}
