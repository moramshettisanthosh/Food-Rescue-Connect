# Deployment Guide

This document outlines the hosting blueprints, production bundling commands, and Docker orchestration pipelines for **Food Rescue Connect (RescueConnect)**.

---

## 1. Local Production Compilation

To bundle and validate the application locally for high-performance static server serving:

```bash
# 1. Install all dependencies
npm install

# 2. Build the optimized production bundle
npm run build

# 3. Preview locally on optimized static production port (defaults to 4173)
npm run preview
```

The build process compiles TS assets and writes lightweight, minified bundles into the `/dist` directory, fully optimized with code splitting and zero-dependency blurs.

---

## 2. Docker Containerization Blueprints

We leverage multi-stage Dockerfiles to minimize build footprints (React Static assets are built, then served via high-performance Nginx layers).

### Production `Dockerfile`
Create the following file in your root workspace:

```dockerfile
# Stage 1: Compiling assets
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Nginx Web Server serving Static dist
FROM nginx:1.25-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Production `nginx.conf`
Create this Nginx redirection helper to support single-page client side routing:

```nginx
server {
    listen 80;
    server_name localhost;

    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}
```

### Docker Compose Grid Orchestration (`docker-compose.yml`)
To spun up the entire infrastructure locally (client dashboard, Express core, database, Redis cache, Python ML engine):

```yaml
version: '3.8'

services:
  client-dashboard:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "80:80"
    depends_on:
      - express-backend

  express-backend:
    image: node:20-alpine
    working_dir: /usr/src/app
    command: npm run start:prod
    environment:
      - DATABASE_URL=postgres://rescue_admin:DbSecPass442@postgres-db:5432/rescue_connect
      - REDIS_URL=redis://redis-cache:6379
    ports:
      - "5000:5000"
    depends_on:
      - postgres-db
      - redis-cache

  postgres-db:
    image: postgres:16-alpine
    environment:
      - POSTGRES_USER=rescue_admin
      - POSTGRES_PASSWORD=DbSecPass442
      - POSTGRES_DB=rescue_connect
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis-cache:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

---

## 3. GitHub Actions Continuous Integration (CI/CD)

Automate build checks and deployment targets upon every branch merge to branch `main`.

### Workflow: `.github/workflows/deploy.yml`

```yaml
name: Build and Deploy RescueConnect

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout Source Code
      uses: actions/checkout@v4

    - name: Set up Node.js Environment
      uses: actions/setup-node@v4
      with:
        node-size: 20
        cache: 'npm'

    - name: Install Project Dependencies
      run: npm install

    - name: Verify Code Compilation
      run: npm run build

    - name: Run Quality Linters
      run: npm run lint

  docker-publish:
    needs: build-and-test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
    - name: Checkout Source Code
      uses: actions/checkout@v4

    - name: Login to Docker Hub
      uses: docker/login-action@v3
      with:
        username: ${{ secrets.DOCKER_HUB_USERNAME }}
        password: ${{ secrets.DOCKER_HUB_ACCESS_TOKEN }}

    - name: Build and Push Docker Image
      uses: docker/build-push-action@v5
      with:
        context: .
        push: true
        tags: |
          docker.io/${{ secrets.DOCKER_HUB_USERNAME }}/rescueconnect-dashboard:latest
          docker.io/${{ secrets.DOCKER_HUB_USERNAME }}/rescueconnect-dashboard:${{ github.sha }}
```
