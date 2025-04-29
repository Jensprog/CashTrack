#!/bin/bash

# Kopiera init.conf till nginx/conf/default.conf för att starta med
cp nginx/conf/init.conf nginx/conf/default.conf

# Starta containers för att få certifikat
docker-compose -f docker-compose.yml -f docker-compose.production.yml up -d nginx

# Vänta lite för att se till att nginx är uppe
echo "Väntar på att nginx ska starta..."
sleep 5

# Kör certbot för att få certifikat
docker-compose -f docker-compose.yml -f docker-compose.production.yml up certbot

# Om certifikatet skapas, byt till final config
if [ -d "nginx/certbot/conf/live/cscloud8-35.lnu.se" ]; then
  echo "Certifikatet skapades framgångsrikt! Byter till HTTPS-konfiguration."
  cp nginx/conf/default.conf nginx/conf/default.conf.bak
  docker-compose -f docker-compose.yml -f docker-compose.production.yml restart nginx
else
  echo "Certifikat skapades inte. Kontrollera felen och försök igen."
fi

echo "Initieringsprocessen är klar!"
