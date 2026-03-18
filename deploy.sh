#!/bin/bash
set -euo pipefail

IP="${1:-}"
if [ -z "$IP" ]; then
  echo "Uso: ./deploy.sh IP_DEL_VPS"
  exit 1
fi

echo "Deployando DebtOut en CubePath ($IP)..."

cd frontend
npm install
npm run build
cd ..

ssh "root@$IP" "mkdir -p /var/www/debtout /opt/debtout-api"
scp -r frontend/dist/* "root@$IP:/var/www/debtout/"
scp -r backend/. "root@$IP:/opt/debtout-api/"
scp nginx.conf "root@$IP:/etc/nginx/sites-available/debtout"

ssh "root@$IP" <<'EOF'
  set -euo pipefail

  ln -sf /etc/nginx/sites-available/debtout /etc/nginx/sites-enabled/debtout
  nginx -t
  systemctl reload nginx

  cd /opt/debtout-api
  python3 -m pip install -r requirements.txt -q

  cat > /etc/systemd/system/debtout.service <<'SERVICE'
[Unit]
Description=DebtOut FastAPI
After=network.target

[Service]
WorkingDirectory=/opt/debtout-api
EnvironmentFile=/opt/debtout-api/.env
ExecStart=/usr/bin/python3 -m uvicorn main:app --host 127.0.0.1 --port 8000
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
SERVICE

  systemctl daemon-reload
  systemctl enable debtout
  systemctl restart debtout
  systemctl status debtout --no-pager
EOF
