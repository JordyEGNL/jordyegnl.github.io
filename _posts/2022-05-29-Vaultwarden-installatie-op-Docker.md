---
title: Vaultwarden installatie op Docker met NPM
layout: post
categories: [docker]
tags: [server,docker,passwordmanager,beveiliging,netwerk,nginx]
---

# Vaultwarden installatie op Docker

In deze post ga ik uitleggen hoe ik Vaultwarden heb geïnstalleerd met Docker. En hoe ik deze proxy met NGINX Proxy Manager.

# Vereisten
* Een eigen domein
* Docker CE
* Docker Compose
* Toegang tot het wereldwijde web

# Wat is Vaultwarden?

[Vaultwarden](https://github.com/dani-garcia/vaultwarden) is een fork van [Bitwarden Server](https://github.com/bitwarden/server). Standaard worden de wachtwoorden die in jouw Bitwarden app staan opgeslagen op een server bij Bitwarden zelf. Nu zorgen we er voor dat deze wachtwoorden bij jou thuis opgeslagen worden. Natuurlijk kan dit ook bij een hosting provider zoals [Linode](https://linode.com).

# De eerste stappen

We gaan als eerst de docker-compose file kopieëren vanuit de Github repository. Deze is [hier](https://github.com/dani-garcia/vaultwarden/wiki/Using-Docker-Compose) te vinden.

Hieronder vind je de door mij gebruikte docker-compose file.

```yaml
version: '3'

services:
  vaultwarden:
    image: vaultwarden/server:latest
    container_name: vaultwarden
    volumes:
      - /docker_data/vaultwarden/:/data/
    restart: unless-stopped
    ports:
      - 8080:80
    environment:
      - TZ=Europe/Amsterdam
      - WEBSOCKET_ENABLED=true
      - LOG_FILE=/data/vaultwarden.log
```

Deze file kun je opslaan in een mapje genaamd _vaultwarden_. Er worden geen bestanden geplaatst in deze directory. Alle benodigde bestanden komen te staan in /docker_data/vaultwarden. **Zorg er wel voor dat dit een bestaande locatie is!**

Daarna kun je deze container starten en aanmaken.

```bash
docker-compose up -d
```

Als je de container wilt stoppen kun je het volgende command typen.

```bash
docker stop vaultwarden
```

Als alles goed is gegaan kun je Vaultwarden nu bereiken op [127.0.0.1:8080](http://127.0.0.1:8080). Let op, we zijn nog niet klaar met het instellen. Hier na leg ik uit hoe je Vaultwarden kunt toevoegen in NGINX Proxy Manager.

# NGINX Proxy Manager

Zorg er voor dat je NGINX Proxy Manager hebt draaien in een Docker Container. Meer uitleg kun je [hier](https://nginxproxymanager.com/guide/#quick-setup) vinden.

Je kunt NPM bereiken op [127.0.0.1:81](http://127.0.0.1:81)

De standaard inloggegevens zijn:

```
Email: admin@example.com
Wachtwoord: changeme
```

Maak nu een nieuwe Proxy Host aan. Zorg er wel voor dat je domein (of sub-domein) wijst naar jouw server. In mijn geval is dit vault.jordyhoebergen.nl

De waardes moeten zijn:

```
Scheme: http
Forward IP: IP VAN JOUW SERVER
Forward Port: 8080
```

![Proxy Host voor Vaultwarden](https://i.imgur.com/ZiT9Kls.png)

Als je Cloudflare gebruikt raad ik je aan om het volgende te plaatsen onder het tabje Advanced. Dit zorgt er voor dat Vaultwarden het echte IP van de bezoeker te zien krijgt, in plaats van het IP van Cloudflare.

```
real_ip_header CF-Connecting-IP;
```

Binnenkort komt er een post met meer informatie over NPM en Cloudflare waarin ik uitleg hoe je een Lets Encrypt of Cloudflare origin certificaat kunt krijgen.