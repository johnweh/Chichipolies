# Chichipolies on the CPH VPS

Host: `72.62.132.248` (Hostinger KVM, `srv1515267`), behind the shared
`triveelo-nginx-1` edge. Site: `https://chichipolies.com` (`www` redirects).

## Layout on the server

| Path | What |
|---|---|
| `/opt/chichipolies/src` | git checkout of `main` (bind-mounted into the containers) |
| `/opt/chichipolies/docker-compose.yml` | copy of `deploy/docker-compose.yml` |
| `/opt/chichipolies/nginx.conf` | copy of `deploy/nginx.conf`, mounted into `chichipolies-web` |
| `/opt/chichipolies/deploy.sh` → `/usr/local/bin/chichipolies-deploy` | copy of `deploy/deploy.sh` |
| `/opt/chichipolies/src/.env` | production env, from `deploy/.env.production.example` |

Containers: `chichipolies-app` (php-fpm, image `chichipolies-php:8.4` =
`migrated-php:8.4` + `pdo_pgsql`), `chichipolies-web` (nginx),
`chichipolies-worker` (queue), `chichipolies-scheduler`. All on `mig_net`.

Shared services: PostgreSQL in `outreach-postgres` (database and role
`chichipolies`), Redis in `mig-redis` (`REDIS_PREFIX=chichipolies_`).

## First install

1. `ssh root@72.62.132.248`, then
   `curl -fsSL https://raw.githubusercontent.com/johnweh/Chichipolies/main/deploy/server/bootstrap.sh | bash`.
   It creates the database and role (prints the password once), clones the
   repo, installs the compose file, nginx config and deploy command, and
   writes `.env` with a fresh `APP_KEY` and the database password.
2. Edit `/opt/chichipolies/src/.env`: `MAIL_PASSWORD` (a Zoho app password
   for `hello@chichipolies.com`), `ANTHROPIC_API_KEY`, `PLATFORM_OWNER_EMAIL`.
3. `chichipolies-deploy` builds the image, installs dependencies, builds the
   frontend, migrates, links storage and checks `/up`.
4. First admin:
   `docker compose -f /opt/chichipolies/docker-compose.yml exec -T chichipolies-app php artisan chichipolies:make-admin you@example.com --owner`
5. Point DNS at the box: in Cloudflare, `chichipolies.com` A → `72.62.132.248`
   (proxied), `www` CNAME → `chichipolies.com`. Then on the server
   `bash /opt/chichipolies/src/deploy/server/edge.sh` adds the edge blocks and
   gets a Let's Encrypt certificate.

## Every deploy after that

Merge to `main`. The **tests** workflow runs; when it passes, **Deploy** SSHes
in and runs `chichipolies-deploy`. Needs the `DEPLOY_SSH_KEY` secret (and
ideally `DEPLOY_KNOWN_HOSTS`) on the repository. Or by hand: `ssh root@… chichipolies-deploy`.

`deploy.sh` is pull-based and hard-resets the checkout, so push first.
`.env`, `storage/`, `vendor/` and `public/build/` are untracked and survive.

## Mail

Sends through Zoho SMTP (`smtp.zoho.eu:587`) as `hello@chichipolies.com`,
whose MX, SPF and DKIM already exist in Cloudflare. Use a Zoho app-specific
password. Registration, verification and password-reset mail all go this way.

## Photos

`PHOTOS_DISK=public` keeps photos in `storage/app/public` on the server and
`deploy.sh` runs `storage:link`. To move to Cloudflare R2 set `PHOTOS_DISK=r2`
and the `R2_*` keys; existing files would need copying across.

## Useful commands

```
docker compose -f /opt/chichipolies/docker-compose.yml ps
docker compose -f /opt/chichipolies/docker-compose.yml logs -f chichipolies-app
docker compose -f /opt/chichipolies/docker-compose.yml exec -T chichipolies-app php artisan tinker
docker exec outreach-postgres pg_dump -U outreach chichipolies > chichipolies-$(date +%F).sql
```

The nightly `/opt/migrated/bin/backup-dbs.sh` does not know this database yet;
add `chichipolies` to it or rely on the command above.
