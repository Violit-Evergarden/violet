#!/bin/bash
# 在腾讯云轻量服务器（Ubuntu 22.04）上运行此脚本
set -euo pipefail

APP_DIR=/opt/violet
REPO=https://github.com/Violit-Evergarden/violet.git
API_DOMAIN=api.violet37.cn
WEB_DOMAIN=www.violet37.cn

echo "==> 安装系统依赖"
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get install -y -qq python3 python3-pip python3-venv ffmpeg nginx git certbot python3-certbot-nginx

echo "==> 拉取代码"
mkdir -p /opt
if [ -d "$APP_DIR/.git" ]; then
  cd "$APP_DIR" && git pull
else
  git clone "$REPO" "$APP_DIR"
fi

echo "==> Python 虚拟环境"
cd "$APP_DIR/backend"
python3 -m venv .venv
source .venv/bin/activate
pip install -q -r requirements.txt

if [ ! -f .env ]; then
  cp .env.example .env
  echo ""
  echo "!!! 请编辑 $APP_DIR/backend/.env 填入 SILICONFLOW_API_KEY 后重新运行："
  echo "    nano $APP_DIR/backend/.env"
  echo "    systemctl restart violet"
  exit 0
fi

echo "==> systemd 服务"
cat > /etc/systemd/system/violet.service << EOF
[Unit]
Description=Violet FastAPI
After=network.target

[Service]
User=root
WorkingDirectory=$APP_DIR/backend
EnvironmentFile=$APP_DIR/backend/.env
Environment=PATH=$APP_DIR/backend/.venv/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
ExecStart=$APP_DIR/backend/.venv/bin/uvicorn app.main:app --host 127.0.0.1 --port 8000
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable violet
systemctl restart violet

echo "==> Nginx 反向代理（API）"
cat > /etc/nginx/sites-available/violet-api << EOF
server {
    listen 80;
    server_name $API_DOMAIN;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_read_timeout 300s;
    }
}
EOF

ln -sf /etc/nginx/sites-available/violet-api /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx

echo "==> 申请 API HTTPS（需 DNS 已生效）"
certbot --nginx -d "$API_DOMAIN" --non-interactive --agree-tos -m 2232102177@qq.com --redirect || echo "Certbot 失败，DNS 生效后手动运行: certbot --nginx -d $API_DOMAIN"

echo "==> 部署 Web 前端（$WEB_DOMAIN）"
bash "$APP_DIR/scripts/deploy-frontend.sh"

echo "==> 完成"
curl -sf "http://127.0.0.1:8000/api/health" && echo " 后端健康检查 OK"
