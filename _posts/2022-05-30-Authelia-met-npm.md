---
title: Authelia with NGINX Proxy Manager and Cloudflare DNS [English]
layout: post
categories: [docker,security]
tags: [server,docker,security,netwerk,nginx,english,authelia]
---

# Authelia with NGINX Proxy Manager and Cloudflare DNS

Hi, you are probably here because your Authelia is not working properly with NPM. Hopefully this gist helps you!


What you need:
 - Cloudflare (free plan is enough)
 - Docker CE
 - Docker Compose (for fast deployment)
 - Authelia
 - NGINX Proxy Manager


# Cloudflare

You need a (sub-)domain that points to your NGINX instance. In this example I use nextcloud.example.com and auth.example.com.
The subdomain 'auth' will be used for authentication with Authelia. You can change this if you want.
'nextcloud' will be used for, well you guessed it, Nextcloud.


# Docker

I'm not going to explain how to install docker, you can find a simple tutorial here for Ubuntu here, https://docs.docker.com/engine/install/ubuntu/


# Deploy the Authelia Container

<details>
<summary>docker-compose.yaml</summary><br/>
  
``` yaml
version: '3.3'

networks:
  net:
    driver: bridge

services:
  authelia:
    image: authelia/authelia:4
    container_name: authelia
    volumes:
      - /docker_data/authelia:/config
    networks:
      - net
    ports:
      - 9001:9091
    restart: unless-stopped
    healthcheck:
      disable: true
    environment:
      - TZ=Europe/Amsterdam
  redis:
    image: redis:alpine
    container_name: redis
    volumes:
      - /docker_data/redis:/data
    networks:
      - net
    ports:
      - 6379:6379
    restart: unless-stopped
    environment:
      - TZ=Europe/Amsterdam
```
</details>

You can change /docker_data/authelia, /docker_data/redis and Europe/Amsterdam to your own values.

<details>
<summary>configuration.yml</summary><br/>

```yaml
---
###############################################################
#                   Authelia configuration                    #
###############################################################

jwt_secret: A_VERY_COOL_SECRET
default_redirection_url: YOUR AUTH URL

server:
  host: 0.0.0.0
  port: 9091

theme: dark
log:
  level: debug
# This secret can also be set using the env variables AUTHELIA_JWT_SECRET_FILE

totp:
  issuer: YOUR DOMAIN

duo_api:
 hostname: api-123456789.example.com
 integration_key: ABCDEF
 # This secret can also be set using the env variables AUTHELIA_DUO_API_SECRET_KEY_FILE
 secret_key: 1234567890abcdefghifjkl

authentication_backend:
  file:
    path: /config/users_database.yml

access_control:
  default_policy: two_factor
  rules:
    # Rules applied to everyone
    - domain: public.example.com
      policy: bypass
    - domain: traefik.example.com
      policy: one_factor
    - domain: secure.example.com
      policy: two_factor

session:
  name: authelia_session
  # This secret can also be set using the env variables AUTHELIA_SESSION_SECRET_FILE
  secret: unsecure_session_secret_dit_is_nu_wel_secure
  expiration: 3600  # 1 hour
  inactivity: 300  # 5 minutes
  domain: YOUR DOMAIN  # Should match whatever your root protected domain is

  redis:
    host: redis
    port: 6379
    # This secret can also be set using the env variables AUTHELIA_SESSION_REDIS_PASSWORD_FILE
    # password: authelia

regulation:
  max_retries: 3
  find_time: 120
  ban_time: 300

storage:
  encryption_key: YOUR ENCRYPTION KEY
  local:
    path: /config/db.sqlite3

notifier:
  smtp:
    username: no-reply@example.com
    # This secret can also be set using the env variables AUTHELIA_NOTIFIER_SMTP_PASSWORD_FILE
    password: 
    host: mail.example.com
    port: 465
    sender: no-reply@example.com

webauthn:
  disable: false
  display_name: Authelia
  attestation_conveyance_preference: indirect
  user_verification: preferred
  timeout: 60s
...
```
</details>

<details>
<summary>users_database.yml</summary><br/>
  
```yaml
---
###############################################################
#                         Users Database                      #
###############################################################

# This file can be used if you do not have an LDAP set up.

# List of users
users:
  authelia:
    displayname: "Authelia User"
    # Password is authelia
    password: "$6$rounds=50000$BpLnfgDsc2WD8F2q$Zis.ixdg9s/UOJYrs56b5QEZFiZECu0qZVNsIYxBaNJ7ucIL.nlxVCT5tqh8KHG8X4tlwCFm5r6NTOZZ5qRFN/"  # yamllint disable-line rule:line-length
    email: authelia@authelia.com
    groups:
      - admins
      - dev
...
  ```
</details>



# NGINX Proxy Manager

Im not going to explain how to install NPM, but you can find a quick start guide [here](https://nginxproxymanager.com/guide/#quick-setup)

Create a new proxy host for the authentication website. I use auth.example.com in this tutorial.

Forward it to Authelia http://x.x.x.x:9001. 

Then place the following in the Advanced section
<details>
<summary>Advanced settings for auth host</summary><br/>

```yaml
location / {
set $upstream_authelia http://x.x.x.x:9001;
proxy_pass $upstream_authelia;
client_body_buffer_size 128k;

#Timeout if the real server is dead
proxy_next_upstream error timeout invalid_header http_500 http_502 http_503;

# Advanced Proxy Config
send_timeout 5m;
proxy_read_timeout 360;
proxy_send_timeout 360;
proxy_connect_timeout 360;

# Basic Proxy Config
proxy_set_header Host $host;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;
proxy_set_header X-Forwarded-Host $http_host;
proxy_set_header X-Forwarded-Uri $request_uri;
proxy_set_header X-Forwarded-Ssl on;
proxy_redirect  http://  $scheme://;
proxy_http_version 1.1;
proxy_set_header Connection "";
proxy_cache_bypass $cookie_session;
proxy_no_cache $cookie_session;
proxy_buffers 64 256k;
real_ip_header CF-Connecting-IP;
add_header Referrer-Policy "no-referrer";
}
```
</details>


You need to replace x.x.x.x with your server ip. You can also use the container name of Authelia if you know how.
  
Now you are going to create (or modify) the protected website host. In my example this will be Nextcloud.

You can forward it to your service in the Details tab. In the Advanced tab you need to add the following

<details>
<summary>Advanced settings for protected host</summary><br/>

```yaml
location /authelia {
internal;
set $upstream_authelia http://YOUR AUTHELIA IP AND PORT/api/verify;
proxy_pass_request_body off;
proxy_pass $upstream_authelia;    
proxy_set_header Content-Length "";

# Timeout if the real server is dead
proxy_next_upstream error timeout invalid_header http_500 http_502 http_503;
client_body_buffer_size 128k;
proxy_set_header Host $host;
proxy_set_header X-Original-URL $scheme://$http_host$request_uri;
proxy_set_header X-Forwarded-For $remote_addr; 
proxy_set_header X-Forwarded-Proto $scheme;
proxy_set_header X-Forwarded-Host $http_host;
proxy_set_header X-Forwarded-Uri $request_uri;
proxy_set_header X-Forwarded-Ssl on;
proxy_redirect  http://  $scheme://;
proxy_set_header Connection "";
proxy_cache_bypass $cookie_session;
proxy_no_cache $cookie_session;
proxy_buffers 4 32k;
send_timeout 5m;
proxy_read_timeout 240;
proxy_send_timeout 240;
proxy_connect_timeout 240;
}

location / {
proxy_pass http://YOUR SERVICE;

auth_request /authelia;
auth_request_set $target_url https://$http_host$request_uri;
auth_request_set $user $upstream_http_remote_user;
auth_request_set $email $upstream_http_remote_email;
auth_request_set $groups $upstream_http_remote_groups;
proxy_set_header Remote-User $user;
proxy_set_header Remote-Email $email;
proxy_set_header Remote-Groups $groups;

error_page 401 =302 https://YOUR AUTH DOMAIN/?rd=$target_url;

client_body_buffer_size 128k;

proxy_next_upstream error timeout invalid_header http_500 http_502 http_503;

send_timeout 5m;
proxy_read_timeout 360;
proxy_send_timeout 360;
proxy_connect_timeout 360;

proxy_set_header Host $host;
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection upgrade;
proxy_set_header Accept-Encoding gzip;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;
proxy_set_header X-Forwarded-Host $http_host;
proxy_set_header X-Forwarded-Uri $request_uri;
proxy_set_header X-Forwarded-Ssl on;
proxy_redirect  http://  $scheme://;
proxy_http_version 1.1;
proxy_set_header Connection "";
proxy_cache_bypass $cookie_session;
proxy_no_cache $cookie_session;
proxy_buffers 64 256k;

real_ip_header CF-Connecting-IP;

}
```
  
There are 3 placeholders in this example, YOUR SERVICE (nextcloud:80), YOUR AUTHELIA IP AND PORT (192.168.0.20:9001) and YOUR AUTH DOMAIN (auth.example.com).
  
The real_ip_header is going to forward the real ip of the visiter.
</details>


# Hopefully this has helped you!