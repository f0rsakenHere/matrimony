#!/usr/bin/env bash
# Deploy the current working tree to the production VPS.
#
#   bash scripts/deploy.sh
#
# Uploads the source (no node_modules/.next/.git/.env), then on the server:
# npm ci → apply DB migrations → next build → zero-downtime PM2 reload.
# Server-side .env / .env.production are left untouched.
set -euo pipefail

HOST="${DEPLOY_HOST:-root@207.244.234.198}"
APP_DIR=/var/www/banglanikah
cd "$(dirname "$0")/.."

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

echo "→ packaging"
tar --exclude=./node_modules --exclude=./.next --exclude=./.git \
    --exclude='./.env*' --exclude=./tsconfig.tsbuildinfo \
    -czf "$TMP/app.tgz" .

echo "→ uploading"
scp -q "$TMP/app.tgz" "$HOST:/root/app.tgz"

echo "→ building on server"
ssh "$HOST" "set -e
  cd $APP_DIR
  find . -mindepth 1 -maxdepth 1 ! -name '.env' ! -name '.env.production' ! -name 'ecosystem.config.cjs' -exec rm -rf {} +
  tar -xzf /root/app.tgz -C $APP_DIR
  chown -R app:app $APP_DIR
  sudo -u app -H bash -lc 'cd $APP_DIR && npm ci --no-audit --no-fund --loglevel=error && npx drizzle-kit migrate && npm run build && pm2 reload banglanikah --update-env'
"
echo "✓ deployed"
