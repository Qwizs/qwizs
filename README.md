# Qwizs

Qwizs est une application de quiz en ligne composée d’un backend NestJS et d’un frontend Vue.js, orchestrés pour le développement et la production.

---

## Prérequis

- Node.js >= 20 (pour le backend)
- npm >= 8
- Docker & Docker Compose (pour la production)

---

## Structure du projet

```
PROJET QUIZ/
├── prototype-backend/      # Backend NestJS
├── prototype-frontend/     # Frontend Vue.js
├── docker-compose.yml      # Orchestration Docker
├── Dockerfile              # (optionnel, pour image unique)
└── README.md
```

---

## Lancer en mode développement

### 1. Backend (NestJS)

```bash
cd prototype-backend
npm install
npm run start:dev
```
Le backend sera accessible sur [http://localhost:4500](http://localhost:4500).

### 2. Frontend (Vue.js)

```bash
cd prototype-frontend
npm install
npm run dev
```
Le frontend sera accessible sur [http://localhost:3000](http://localhost:3000).

---

## Lancer en production avec Docker Compose

### 1. Build et lancement

Depuis la racine du projet :

```bash
docker compose up --build
```

- Le frontend sera accessible sur [http://localhost](http://localhost)
- Les appels à `/api` seront automatiquement redirigés vers le backend NestJS.

### 2. Arrêter les conteneurs

```bash
docker compose down
```

---

## Variables d’environnement

- Pour la production, adaptez la configuration Nginx et les variables d’environnement selon votre hébergement.

---

## Déploiement

Pour publier une image Docker :

```bash
docker build -t <votre-utilisateur>/qwizs:latest .
docker push <votre-utilisateur>/qwizs:latest
```

---

## Contribution

1. Forkez le projet
2. Créez une branche (`git checkout -b feature/ma-feature`)
3. Commitez vos modifications (`git commit -am 'Ajout de ma feature'`)
4. Poussez la branche (`git push origin feature/ma-feature`)
5. Ouvrez une Pull Request

---

## Licence

APACHE

---