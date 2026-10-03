#!/usr/bin/env bash
# One-off first install on the CPH VPS. Idempotent: safe to re-run.
#   1. database + role in outreach-postgres
#   2. /opt/chichipolies checkout, compose file, nginx.conf, deploy command
#   3. .env from deploy/.env.production.example (then you fill the blanks)
#   4. first deploy, then the first admin
# Usage: bash bootstrap.sh [git-url]
set -euo pipefail
REPO="${1:-https://github.com/johnweh/Chichipolies.git}"
ROOT=/opt/chichipolies
SRC="$ROOT/src"

echo "== 1. database"
if ! docker exec outreach-postgres psql -U outreach -d outreach -tAc "select 1 from pg_roles where rolname='chichipolies'" | grep -q 1; then
  DB_PASS="$(openssl rand -hex 24)"
  docker exec outreach-postgres psql -U outreach -d outreach -v ON_ERROR_STOP=1 -c "create role chichipolies login password '$DB_PASS';"
  echo "created role chichipolies (password below goes in .env as DB_PASSWORD)"
  echo "DB_PASSWORD=$DB_PASS"
else echo "role present"; fi
if ! docker exec outreach-postgres psql -U outreach -d outreach -tAc "select 1 from pg_database where datname='chichipolies'" | grep -q 1; then
  docker exec outreach-postgres psql -U outreach -d outreach -v ON_ERROR_STOP=1 -c "create database chichipolies owner chichipolies;"
  echo "created database chichipolies"
else echo "database present"; fi

echo "== 2. checkout + files"
mkdir -p "$ROOT"
if [ ! -d "$SRC/.git" ]; then git clone --branch main "$REPO" "$SRC"; else echo "checkout present"; fi
cp "$SRC/deploy/docker-compose.yml" "$ROOT/docker-compose.yml"
cp "$SRC/deploy/nginx.conf" "$ROOT/nginx.conf"
install -m 0755 "$SRC/deploy/deploy.sh" "$ROOT/deploy.sh"
ln -sf "$ROOT/deploy.sh" /usr/local/bin/chichipolies-deploy

echo "== 3. .env"
if [ ! -f "$SRC/.env" ]; then
  cp "$SRC/deploy/.env.production.example" "$SRC/.env"
  KEY="base64:$(openssl rand -base64 32)"
  sed -i "s#^APP_KEY=.*#APP_KEY=$KEY#" "$SRC/.env"
  [ -n "${DB_PASS:-}" ] && sed -i "s#^DB_PASSWORD=.*#DB_PASSWORD=$DB_PASS#" "$SRC/.env"
  echo "wrote $SRC/.env; fill MAIL_PASSWORD, ANTHROPIC_API_KEY, PLATFORM_OWNER_EMAIL (and DB_PASSWORD if the role already existed), then run: chichipolies-deploy"
else echo ".env present"; fi

echo "== 4. next"
echo "  chichipolies-deploy"
echo "  docker compose -f $ROOT/docker-compose.yml exec -T chichipolies-app php artisan chichipolies:make-admin you@example.com --owner"
echo "  bash $SRC/deploy/server/edge.sh   # once DNS points at this box"
