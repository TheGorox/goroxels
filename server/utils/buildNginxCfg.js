const fs = require('fs');
const path = require('path');

const HTTP_PORT = '80';

const basePath = path.join(__dirname, '../nginx/base.conf');
const devPath = path.join(__dirname, '../nginx/dev.conf');
const prodPath = path.join(__dirname, '../nginx/prod.conf');

const sslBlockDev = 
`listen HTTP_PORT_REPLACEME;
listen [::]:HTTP_PORT_REPLACEME;`
const sslBlockProd = 
`
listen 443 ssl http2 default_server;
listen [::]:443 ssl http2;
ssl_certificate /etc/letsencrypt/live/goroxels.ru/fullchain.pem; # managed by Certbot
ssl_certificate_key /etc/letsencrypt/live/goroxels.ru/privkey.pem; # managed by Certbot
include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot`;

const devFile = fs.readFileSync(basePath).toString()
        .replace('#SSL_BLOCK_REPLACER', sslBlockDev)
        .replaceAll('HTTP_PORT_REPLACEME', HTTP_PORT);
fs.writeFileSync(devPath, devFile);

const prodFile = fs.readFileSync(basePath).toString()
        .replace('#SSL_BLOCK_REPLACER', sslBlockProd)
        .replaceAll('HTTP_PORT_REPLACEME', HTTP_PORT)
        .replaceAll('logs/access.log', '/var/log/nginx/access_rate_limit.log');
fs.writeFileSync(prodPath, prodFile);

const devNginxPath = 'H:/nginx/conf/nginx.conf';
fs.writeFileSync(devNginxPath, devFile);