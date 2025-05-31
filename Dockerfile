# 1. Build frontend
FROM node:20 AS frontend-build
WORKDIR /app/frontend
COPY prototype-frontend/package*.json ./
RUN npm install
COPY prototype-frontend/ ./
RUN npm run build

# 2. Build backend
FROM node:20 AS backend-build
WORKDIR /app/backend
COPY prototype-backend/package*.json ./
RUN npm install --legacy-peer-deps
COPY prototype-backend/ ./
RUN npm run build

# 3. Assemble everything with Nginx and Node
FROM nginx:stable-alpine

# Copy frontend build to nginx html
COPY --from=frontend-build /app/frontend/dist /usr/share/nginx/html

# Copy nginx config
COPY prototype-frontend/nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy backend build and node_modules
COPY --from=backend-build /app/backend/dist /app/backend/dist
COPY --from=backend-build /app/backend/node_modules /app/backend/node_modules
COPY --from=backend-build /app/backend/package.json /app/backend/package.json

# Install Node.js to run backend
RUN apk add --no-cache nodejs npm

# Script to launch both backend and nginx
COPY start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 80
CMD ["/start.sh"]