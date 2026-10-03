#!/usr/bin/env bash
# Put chichipolies.com on the Triveelo edge (triveelo-nginx-1): an HTTP block
# (ACME + redirect), a Let's Encrypt certificate, then the HTTPS block that
# proxies to chichipolies-web. Idempotent. Run on the VPS after DNS points here.
set -uo pipefail
E=/opt/triveelo/docker/nginx/nginx.conf
IP=72.62.132.248
NAMES=(chichipolies.com www.chichipolies.com)
LE=/etc/letsencrypt/live/chichipolies.com
SHARED_CERT=/etc/ssl/triveelo/cert.pem; SHARED_KEY=/etc/ssl/triveelo/key.pem

reload() { docker exec triveelo-nginx-1 nginx -t 2>&1 | tail -1 && docker exec triveelo-nginx-1 nginx -s reload && echo "edge reloaded"; }
present() { grep -q "$1" "$E"; }
insert_before_last_brace() {
  BLOCK="$(cat)" python3 - "$E" <<'PYINS'
import os,sys; p=sys.argv[1]; block=os.environ['BLOCK']; s=open(p).read().rstrip('\n')
assert block.strip(), 'empty block'
i=s.rfind('\n}'); assert i>0, 'no closing brace'
open(p,'w').write(s[:i]+'\n'+block.rstrip('\n')+'\n'+s[i:]+'\n'); print('inserted', block.strip().splitlines()[0])
PYINS
}

echo "== 0. DNS"
ok=1; for n in "${NAMES[@]}"; do r=$(getent ahostsv4 "$n" | awk '{print $1}' | head -1); printf '%-24s %s' "$n" "${r:-NONE}"
  if [ -z "$r" ]; then echo "  <- MISSING"; ok=0; elif [ "$r" = "$IP" ]; then echo "  (direct)"; else echo "  (proxied; origin must be $IP)"; fi; done
[ $ok = 1 ] || { echo "a name has no DNS record yet"; exit 1; }

echo "== 1. HTTP block"
if present 'chichipolies.com:START'; then echo "present"; else
  cp -a "$E" "$E.bak-prechichipolies-$(date +%Y%m%d%H%M%S)"
  insert_before_last_brace <<'BLK'

    # -- chichipolies.com:START (managed by Chichipolies deploy/server/edge.sh) --
    server {
        listen 80;
        server_name chichipolies.com www.chichipolies.com;
        location /.well-known/acme-challenge/ { root /var/www/certbot; }
        location / {
            if ($http_x_forwarded_proto != "https") { return 301 https://$host$request_uri; }
            set $chichipolies_upstream http://chichipolies-web:80;
            proxy_pass         $chichipolies_upstream;
            proxy_http_version 1.1;
            proxy_set_header   Host              $host;
            proxy_set_header   X-Real-IP         $remote_addr;
            proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
            proxy_set_header   X-Forwarded-Proto https;
        }
    }
    # -- chichipolies.com:END --
BLK
  reload || { echo "nginx rejected the HTTP block"; exit 1; }
fi

echo "== 2. HTTPS block"
if present 'chichipolies.com:TLS'; then echo "present"; else
  if [ -f "$LE/fullchain.pem" ]; then C=$LE/fullchain.pem; K=$LE/privkey.pem; else C=$SHARED_CERT; K=$SHARED_KEY; echo "no Let's Encrypt cert yet; starting on the shared origin cert"; fi
  insert_before_last_brace <<BLK

    # -- chichipolies.com:TLS (managed by Chichipolies deploy/server/edge.sh) --
    server {
        listen 443 ssl;
        server_name chichipolies.com www.chichipolies.com;
        ssl_certificate     $C;
        ssl_certificate_key $K;
        ssl_protocols       TLSv1.2 TLSv1.3;
        client_max_body_size 8M;
        location /.well-known/acme-challenge/ { root /var/www/certbot; }
        if (\$host = www.chichipolies.com) { return 301 https://chichipolies.com\$request_uri; }
        location / {
            set \$chichipolies_upstream http://chichipolies-web:80;
            proxy_pass         \$chichipolies_upstream;
            proxy_http_version 1.1;
            proxy_set_header   Host              \$host;
            proxy_set_header   X-Real-IP         \$remote_addr;
            proxy_set_header   X-Forwarded-For   \$proxy_add_x_forwarded_for;
            proxy_set_header   X-Forwarded-Proto https;
            proxy_read_timeout    120s;
            proxy_connect_timeout 10s;
        }
    }
    # -- chichipolies.com:TLS:END --
BLK
  reload || { echo "nginx rejected the HTTPS block"; exit 1; }
fi

echo "== 3. Let's Encrypt"
if [ -f "$LE/fullchain.pem" ]; then echo "present"; else
  certbot certonly --webroot -w /var/www/certbot -d chichipolies.com -d www.chichipolies.com \
    --non-interactive --agree-tos --register-unsafely-without-email --deploy-hook "docker exec triveelo-nginx-1 nginx -s reload" \
    && sed -i "s#ssl_certificate     $SHARED_CERT;#ssl_certificate     $LE/fullchain.pem;#; s#ssl_certificate_key $SHARED_KEY;#ssl_certificate_key $LE/privkey.pem;#" "$E" \
    && reload
fi
echo "done"
