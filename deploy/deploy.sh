#!/usr/bin/env bash
# Installed on the CPH VPS as /opt/chichipolies/deploy.sh and
# /usr/local/bin/chichipolies-deploy. Run by the Deploy workflow over SSH or by
# hand. Pull-based: the server hard-resets its checkout to origin/<branch>.
# Untracked files (.env, storage/, vendor/, public/build/) survive the reset.
set -euo pipefail

ROOT=/opt/chichipolies
SRC="$ROOT/src"
COMPOSE="docker compose -f $ROOT/docker-compose.yml"
LOCK=/var/run/chichipolies-deploy.lock

exec 9>"$LOCK"
flock -n 9 || { echo "another chichipolies deploy is running" >&2; exit 1; }

cd "$SRC"
BRANCH="$(git rev-parse --abbrev-ref HEAD)"
echo "==> pulling origin/$BRANCH"
git fetch --prune origin
git reset --hard "origin/$BRANCH"

echo "==> composer install (throwaway container)"
# --ignore-platform-reqs: the composer image lacks gd/pcntl; the runtime image has them.
docker run --rm -v "$SRC:/app" -w /app composer:2 \
    install --no-dev --optimize-autoloader --no-interaction --prefer-dist --ignore-platform-reqs

echo "==> npm ci + vite build (throwaway container)"
docker run --rm -v "$SRC:/app" -w /app node:22 \
    bash -c "npm ci --no-audit --no-fund && npm run build"

# php-fpm runs as www-data (uid 33).
chown -R 33:33 "$SRC/storage" "$SRC/bootstrap/cache" "$SRC/public/build"

echo "==> build image (no-op unless deploy/php/Dockerfile changed) + up"
$COMPOSE build chichipolies-app
$COMPOSE up -d

echo "==> migrate, storage link, clear caches"
$COMPOSE exec -T chichipolies-app php artisan migrate --force
$COMPOSE exec -T chichipolies-app php artisan storage:link --force --relative
$COMPOSE exec -T chichipolies-app php artisan config:clear
$COMPOSE exec -T chichipolies-app php artisan route:clear
$COMPOSE exec -T chichipolies-app php artisan view:clear

echo "==> restart app, worker, scheduler"
$COMPOSE restart chichipolies-app chichipolies-worker chichipolies-scheduler

echo "==> health"
sleep 3
code=$(docker run --rm --network mig_net curlimages/curl:latest -s -o /dev/null -w '%{http_code}' --max-time 15 http://chichipolies-web/up || echo 000)
[ "$code" = 200 ] || { echo "health check failed: /up returned $code" >&2; exit 1; }

echo "chichipolies deployed: $(git rev-parse --short HEAD)"
