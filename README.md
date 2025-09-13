# Taskify
Taskify is a modern, theme-aware task manager built with Next.js App Router, Tailwind CSS, shadcn/ui, Recoil, lucide-react, and a Mock Service Worker (MSW) browser backend for realistic local development and demo environments.

## Live
Add the deployed URL here: [LIVE_URL_HERE](https://taskify-five-nu.vercel.app/).

---

## Features
- Next.js App Router with TypeScript, responsive UI, and dark/light theming via next-themes.
- MSW-powered mock backend for tasks CRUD with localStorage persistence to simulate a real server during development and demos.
- shadcn/ui components, Tailwind styling, lucide-react icons, and global toast notifications for rich UX.
- Production-ready Docker image using Next.js standalone output for a compact, fast container.
- Build-time toggle for enabling MSW in the client via NEXT_PUBLIC_ENABLE_MSW so the same codebase serves demos or production-like runs.

---

## Tech stack
- Next.js (App Router) and TypeScript for the application shell and routing.
- Tailwind CSS and shadcn/ui for styling and design system primitives.
- Recoil for client state, with tasks persisted by MSW handlers.
- MSW for browser-level request interception and local mock API.


---

Docker multi-stage build with Next.js standalone output for production containers.

Prerequisites
Node.js 18+ and npm for local development.

Git installed to clone the repository.

Docker Desktop or compatible engine for container builds and runs.

Getting started (local)
Clone and install dependencies.

```
git clone https://github.com/pianist22/taskify.git
cd taskify
npm install
```
Initialize MSW worker into the public folder if not present.

```
npx msw init public --save
```
Enable the mock backend in development using a public env variable.

```
# creates or appends in .env.local
echo 'NEXT_PUBLIC_ENABLE_MSW=true' >> .env.local
```
Start the dev server.

```
npm run dev
```
To verify MSW is available, open the worker script path on the running app host (the file must exist in public).

Common scripts
Dev mode with hot reload.


```
npm run build
```
Start the production server locally after building.

```
npm run start
```

Environment variables
Public variables are compiled into client bundles at build time and must be set before building.

```
# .env.local (local dev)
NEXT_PUBLIC_ENABLE_MSW=true
```


Docker (For Demo to Use at your end )
This project includes a multi-stage Dockerfile that builds a standalone Next.js bundle and runs it on Node Alpine for a small, efficient image.

```
docker pull priyanshu2201/taskify:demo
docker run --rm -p 3000:3000 priyanshu2201/taskify:demo
```

To Setup for Docker Image:
Ensure standalone output is enabled in Next config.

```
# next.config.js (example)
# module.exports = { output: 'standalone' }
```
Build a demo image with MSW enabled (client bundle includes mocks).

```
docker build \
  --build-arg NEXT_PUBLIC_ENABLE_MSW=true \
  -t your_docker_username/taskify:demo .
 ``` 

Run the container.

```
docker run --rm -p 3000:3000 priyanshu2201/taskify:demo
```
Optional compose for one-command demo build and run with MSW enabled.
```
cat > docker-compose.yml << 'YML'
services:
  taskify:
    build:
      context: .
      args:
        NEXT_PUBLIC_ENABLE_MSW: "true"
    image: priyanshu2201/taskify:demo
    ports:
      - "3000:3000"
YML
```

```
docker compose up --build
```
If mocks are enabled, the worker file must be present under public, and rebuilding the image may be necessary after adding it.

Publish to Docker Hub
Login, then push demo and production images.

```
docker login
docker push your_docker_username/taskify:demo
```
Project structure
Standard Next.js App Router layout with an MSW provider that conditionally starts the worker in the browser.

--- 

```
.
├─ app/
│  ├─ layout.tsx
│  ├─ msw-provider.tsx
│  └─ ...
├─ components/
│  └─ ...
├─ features/
│  └─ tasks/
│     ├─ api.ts
│     └─ task-list.tsx
├─ public/
│  └─ mockServiceWorker.js
├─ next.config.js
├─ package.json
└─ Dockerfile
```
--- 

## Contact

For questions, suggestions, or support, please open an issue or contact:

**Priyanshu Saha**  
Email: priyanshusaha944@gmail.com  
GitHub: [pianist22](https://github.com/pianist22)

---
