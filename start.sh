#!/bin/sh
# filepath: d:\PROJET QUIZ\start.sh
# Démarre le backend NestJS en arrière-plan
node /app/backend/dist/main.js &
# Démarre nginx (en avant-plan)
nginx -g "daemon off;"