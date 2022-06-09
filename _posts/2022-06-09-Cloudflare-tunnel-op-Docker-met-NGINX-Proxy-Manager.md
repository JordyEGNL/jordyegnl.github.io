---
title: Cloudflare tunnel instellen op Docker. Met NGINX Proxy Manager ondersteuning
layout: post
categories: [docker,cloudflare]
tags: [server,docker,security,netwerk,nginx,tunnel,cloudflare,nginx,npm]
---

# Cloudflare tunnel instellen op Docker. Met NGINX Proxy Manager ondersteuning

In deze post laat ik zien hoe ik een Cloudflare tunnel heb gemaakt en deze heb geconfigureerd zodat het werkt met NGINX Proxy Manager (dit werkt ook met andere reverse proxy's zoals Caddy).

# Vereisten

- Gratis Cloudflare account
- Domein gekoppeld aan Cloudflare
- Een Linux server met Docker CE

# Installatie op Cloudflare

Als eerste ga je naar [cloudflare.com](https://cloudflare.com) en log je in. Eenmal aangekomen op het dashboard klik je links in de side-bar op Zero Trust. Het kan zijn dat je gevraagd wordt om wat basis instellingen te configureren zoals een team naam. Deze wordt gebruikt voor Cloudflare Acces Authenticatie, als je dit wilt gaan gebruiken.

![Navigeren naar Cloudflare Zero Trust](https://i.imgur.com/yj9dXfb.png)

Eenmaal aangekomen in het Cloudflare Zero Trust dashboard, klik je op Access > Tunnels.

Daarna kun je een tunnel aanmaken door op de knop "Create a tunnel" te klikken.

![Nieuwe tunnel aanmaken](https://i.imgur.com/brMztw2.png)

Je wordt daarna gevraagd om de nieuwe tunnel een naam te geven. Deze wordt getoond op het Tunnel dashboard (vorige scherm). Vul hier bijvoorbeeld de hostname is van je server.

In mijn geval heb ik gekozen voor de naam "framboos-01".

## Connector installeren op server

Daarna wordt er gevraagd op welke manier je de connector wilt installeren. Hier heb ik gekozen voor Docker zodat ik het makkelijk kan beheren in Portainer.

Kopieer het commando dat nu getoond wordt.

![Docker run command](https://i.imgur.com/bsb2So4.png)

Ga nu naar je server en voer het command uit in de console.

Na enkele seconden wordt de container opgestart.

Zoals je ziet kom je direct in de console terecht van de container. Klik nu op CTRL + C om de container af te sluiten.

Je kunt de container nu weer starten met Portainer als je dit geconfigureerd hebt. Als je geen gebruik maakt van Portainer kun je het volgende doen.

```console
# Ga op zoek naar de zojuist aangemaakte container.
docker ps
```

```console
# Start de zojuist aangemakte container
docker start <container>
```

Als de container weer gestart is kun je terug gaan naar Cloudflare om verder te gaan met de configuratie.

## Nieuw sub-domein toevoegen in Cloudflare

Bij het tabje "Public Hostname" kun je de sub-domeinen instellen die gerouteerd moeten worden door de tunnel.

Als voorbeeld heb ik gekozen voor testpagina.jordyhoebergen.nl.

Bij service heb ik gekozen voor HTTP :// 192.168.2.33

> Zorg ervoor dat je het IP verandert in het IP van je server waar NPM op draait!
{: .prompt-warning}

> Je kunt ook de naam van de NPM container gebruiken als de Cloudflare container en NPM in hetzelfde netwerk zitten.
{: .prompt-tip}

Daarna kun je deze configuratie opslaan.

# Configuratie NGINX Proxy Manager

Nu gaan we verder met het configureren van NGINX Proxy Manager.

> Als je dit al gedaan hebt, zorg ervoor dat FORCE SSL uit staat!
{: .prompt-warning}

## Nieuwe Proxy Host toevoegen

Maak nu een nieuwe Proxy Host aan. Stel het domein naam in op het zojuist aangemaakte sub-domein. Je kunt deze forwarden naar eigen wens. Voor deze test gebruik ik UpTime Kuma.

![Configuratie nieuwe Proxy Host](https://i.imgur.com/uRTfs05.png)

## Testen

Als alles is gelukt, zou de pagina nu moeten werken. Het is niet nodig om HTTPS te configureren aangezien al het dataverkeer intern gebeurt.

![Eindresultaat website](https://i.imgur.com/HNEir9w.png)




