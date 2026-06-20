#!/bin/bash
# 在已部署后端的腾讯云轻量服务器上运行：构建 Web 前端并配置 www 子域名
set -euo pipefail

APP_DIR=/opt/violet
WEB_DOMAIN="${WEB_DOMAIN:-www.violet37.cn}"
CERTBOT_EMAIL="${CERTBOT_EMAIL:-2232102177@qq.com}"

echo "==> 安装 Node.js（若尚未安装）"
export DEBIAN_FRONTEND=noninteractive
if ! command -v node >/dev/null 2>&1 || [ "$(node -p 'process.versions.node.split(".")[0]')" -lt 18 ]; then
  apt-get update -qq
  apt-get install -y -qq ca-certificates curl gnupg
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y -qq nodejs
fi
node -v
npm -v

echo "==> 拉取最新代码"
if [ -d "$APP_DIR/.git" ]; then
  cd "$APP_DIR" && git pull
else
  echo "!!! 请先运行 scripts/deploy-server.sh 部署后端"
  exit 1
fi

npm config set registry https://registry.npmmirror.com

echo "==> 构建前端"
cd "$APP_DIR/frontend"
npm ci --no-audit --no-fund
npm run build

echo "==> Nginx 静态站点 + API 反代"
cat > /etc/nginx/sites-available/violet-web << EOF
server {
    listen 80;
    server_name $WEB_DOMAIN;

    root $APP_DIR/frontend/dist;
    index index.html;

    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_read_timeout 300s;
    }

    location / {
        try_files \$uri \$uri/ /index.html;
    }
}
EOF

ln -sf /etc/nginx/sites-available/violet-web /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx

echo "==> 申请 HTTPS（需 DNS 已生效：$WEB_DOMAIN → 服务器 IP）"
if ! command -v certbot >/dev/null 2>&1; then
  apt-get install -y -qq certbot python3-certbot-nginx
fi
certbot --nginx -d "$WEB_DOMAIN" --non-interactive --agree-tos -m "$CERTBOT_EMAIL" --redirect \
  || echo "Certbot 失败，DNS 生效后手动运行: certbot --nginx -d $WEB_DOMAIN"

echo "==> 完成"
echo "访问: https://$WEB_DOMAIN"
curl -sf "http://127.0.0.1:8000/api/health" && echo " 后端健康检查 OK"
