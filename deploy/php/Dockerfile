# PHP image for chichipolies-app, chichipolies-worker and chichipolies-scheduler.
# migrated-php:8.4 (built from /opt/migrated/php84 on the server) already has
# gd, exif, intl, zip, bcmath, pcntl, redis and pdo_mysql. Chichipolies runs on
# PostgreSQL, so pdo_pgsql is baked in here. GD is what PhotoStore uses to
# strip EXIF and resize uploads.
#
# Build on the server: docker compose -f /opt/chichipolies/docker-compose.yml build
FROM migrated-php:8.4

RUN apt-get update -qq \
    && apt-get install -y -qq --no-install-recommends libpq-dev postgresql-client \
    && docker-php-ext-install pdo_pgsql \
    && rm -rf /var/lib/apt/lists/*
