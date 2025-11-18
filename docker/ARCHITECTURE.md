# Docker Architecture Diagram

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         HOST MACHINE                             │
│                    (Windows/Linux/macOS)                         │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │              DOCKER DESKTOP                            │    │
│  │                                                         │    │
│  │  ┌──────────────────────────────────────────────────┐  │    │
│  │  │         portfolio-network (bridge)               │  │    │
│  │  │                                                   │  │    │
│  │  │  ┌─────────────────────────────────────────┐    │  │    │
│  │  │  │  Container: dcesares-portfolio-dev      │    │  │    │
│  │  │  │  ┌───────────────────────────────────┐  │    │  │    │
│  │  │  │  │  Node 18 Alpine                   │  │    │  │    │
│  │  │  │  │  + pnpm                            │  │    │  │    │
│  │  │  │  │  + Dependencies                    │  │    │  │    │
│  │  │  │  └───────────────────────────────────┘  │    │  │    │
│  │  │  │                                          │    │  │    │
│  │  │  │  ┌───────────────────────────────────┐  │    │  │    │
│  │  │  │  │  Astro Dev Server                 │  │    │  │    │
│  │  │  │  │  Port: 4321                       │  │    │  │    │
│  │  │  │  │  Host: 0.0.0.0                    │  │    │  │    │
│  │  │  │  └───────────────────────────────────┘  │    │  │    │
│  │  │  │                                          │    │  │    │
│  │  │  │  ┌───────────────────────────────────┐  │    │  │    │
│  │  │  │  │  Mounted Volumes (Hot Reload)     │  │    │  │    │
│  │  │  │  │  • ./src        → /app/src        │  │    │  │    │
│  │  │  │  │  • ./public     → /app/public     │  │    │  │    │
│  │  │  │  │  • ./src/content → /app/src/content│  │    │  │    │
│  │  │  │  │  • configs       → /app/configs   │  │    │  │    │
│  │  │  │  └───────────────────────────────────┘  │    │  │    │
│  │  │  │                                          │    │  │    │
│  │  │  │  ┌───────────────────────────────────┐  │    │  │    │
│  │  │  │  │  Isolated (Container Only)        │  │    │  │    │
│  │  │  │  │  • node_modules                   │  │    │  │    │
│  │  │  │  │  • .astro/                        │  │    │  │    │
│  │  │  │  └───────────────────────────────────┘  │    │  │    │
│  │  │  └─────────────────────────────────────────┘    │  │    │
│  │  │                                                   │  │    │
│  │  └──────────────────────────────────────────────────┘  │    │
│  │                                                         │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  Port Mapping: localhost:4321 → container:4321                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                             ▲
                             │
                             │ Access
                             │
                    ┌────────┴────────┐
                    │   Web Browser   │
                    │ localhost:4321  │
                    └─────────────────┘
```

## Build Stages Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    MULTI-STAGE BUILD                             │
└─────────────────────────────────────────────────────────────────┘

    ┌──────────────────┐
    │   Stage: base    │
    │                  │
    │  • Node 18 Alpine│
    │  • Install pnpm  │
    │  • Copy package  │
    │    files         │
    └────────┬─────────┘
             │
             ├──────────────────────┬──────────────────────┐
             │                      │                      │
             ▼                      ▼                      ▼
    ┌────────────────┐    ┌────────────────┐    ┌────────────────┐
    │   development  │    │    builder     │    │   production   │
    │                │    │                │    │                │
    │ • All deps     │    │ • All deps     │    │ • Prod deps    │
    │ • Hot reload   │    │ • Run build    │    │   only         │
    │ • Dev server   │    │ • Generate     │    │ • Copy dist/   │
    │                │    │   dist/        │    │   from builder │
    │ Port: 4321     │    │                │    │ • Preview      │
    │                │    │                │    │   server       │
    └────────────────┘    └────────────────┘    └────────────────┘
           │                                             │
           │                                             │
           ▼                                             ▼
    docker-compose.yml                     docker-compose.prod.yml
    (Development)                          (Production Preview)
```

## File Changes Detection & Hot Reload

```
┌─────────────────────────────────────────────────────────────────┐
│                      HOT RELOAD FLOW                             │
└─────────────────────────────────────────────────────────────────┘

  Host Machine                    Docker Container
  
  ┌─────────────┐                ┌─────────────┐
  │ Edit File   │                │             │
  │ src/        │                │             │
  │  page.astro │                │             │
  └──────┬──────┘                │             │
         │                       │             │
         │ File Change           │             │
         │ Detected              │             │
         │                       │             │
         ▼                       │             │
  ┌─────────────┐                │             │
  │ Docker      │    Sync        │             │
  │ Volume      ├───────────────►│ /app/src/   │
  │ Mount       │                │  page.astro │
  └─────────────┘                └──────┬──────┘
                                        │
                                        │ Watch
                                        │ Detected
                                        │
                                        ▼
                                 ┌─────────────┐
                                 │ Astro Dev   │
                                 │ Server      │
                                 │ Rebuilds    │
                                 └──────┬──────┘
                                        │
                                        │ HMR
                                        │
                                        ▼
                                 ┌─────────────┐
                                 │ Browser     │
                                 │ Auto-Refresh│
                                 └─────────────┘
```

## Development Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│                    DEVELOPER WORKFLOW                            │
└─────────────────────────────────────────────────────────────────┘

  1. START
     │
     ├─ Windows:       .\docker.ps1 up
     ├─ Linux/macOS:   make up
     └─ Universal:     docker-compose up -d
     │
     ▼
  2. CONTAINER STARTS
     │
     ├─ Pull/Build image (first time: ~5-7min)
     ├─ Mount volumes
     ├─ Start Astro dev server
     └─ Healthcheck passes
     │
     ▼
  3. DEVELOP
     │
     ├─ Edit files in IDE
     ├─ Hot reload happens automatically
     ├─ View changes in browser
     └─ Logs available: docker-compose logs -f
     │
     ▼
  4. VALIDATE
     │
     ├─ docker-compose exec portfolio-dev pnpm astro check
     └─ Fix any issues
     │
     ▼
  5. STOP
     │
     └─ docker-compose down
```

## Network Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     NETWORK TOPOLOGY                             │
└─────────────────────────────────────────────────────────────────┘

  ┌───────────────────────────────────────────────┐
  │         Host Network Namespace                │
  │                                                │
  │  ┌──────────────────────────────────────┐    │
  │  │  localhost:4321                      │    │
  │  │  (Exposed Port)                      │    │
  │  └────────────┬─────────────────────────┘    │
  │               │                               │
  │               │ Port Mapping                  │
  │               │                               │
  │  ┌────────────▼─────────────────────────┐    │
  │  │  Docker Bridge: portfolio-network    │    │
  │  │                                       │    │
  │  │  ┌─────────────────────────────────┐ │    │
  │  │  │  Container: portfolio-dev       │ │    │
  │  │  │  IP: 172.x.x.x (dynamic)        │ │    │
  │  │  │  Port: 4321                     │ │    │
  │  │  │  ┌───────────────────────────┐  │ │    │
  │  │  │  │  Astro Dev Server         │  │ │    │
  │  │  │  │  Listening on 0.0.0.0:4321│  │ │    │
  │  │  │  └───────────────────────────┘  │ │    │
  │  │  └─────────────────────────────────┘ │    │
  │  │                                       │    │
  │  │  Future: Add more services here       │    │
  │  │  (PostgreSQL, Redis, etc.)            │    │
  │  └───────────────────────────────────────┘    │
  │                                                │
  └────────────────────────────────────────────────┘
```

## Data Persistence

```
┌─────────────────────────────────────────────────────────────────┐
│                    VOLUME MANAGEMENT                             │
└─────────────────────────────────────────────────────────────────┘

  Host Filesystem              Docker Container
  
  ┌─────────────┐              ┌─────────────┐
  │ /src        ├─────────────►│ /app/src    │ (Mounted - Hot Reload)
  └─────────────┘              └─────────────┘
  
  ┌─────────────┐              ┌─────────────┐
  │ /public     ├─────────────►│ /app/public │ (Mounted - Hot Reload)
  └─────────────┘              └─────────────┘
  
  ┌─────────────┐              ┌─────────────┐
  │ /src/content├─────────────►│ /app/src/   │ (Mounted - Hot Reload)
  └─────────────┘              │  content    │
                               └─────────────┘
  
  ┌─────────────┐              ┌─────────────┐
  │ astro.config├─────────────►│ /app/astro. │ (Mounted - Config)
  │ .mjs        │              │  config.mjs │
  └─────────────┘              └─────────────┘
  
  ❌ Not Mounted               ┌─────────────┐
     (Container Only)          │ /app/node_  │ (Isolated - No Conflicts)
                               │  modules    │
                               └─────────────┘
  
  ❌ Not Mounted               ┌─────────────┐
     (Container Only)          │ /app/.astro │ (Isolated - Build Cache)
                               └─────────────┘
```

## CI/CD Pipeline

```
┌─────────────────────────────────────────────────────────────────┐
│                  GITHUB ACTIONS WORKFLOW                         │
└─────────────────────────────────────────────────────────────────┘

  Git Push to main
       │
       ▼
  ┌─────────────────┐
  │ GitHub Actions  │
  │ Triggered       │
  └────────┬────────┘
           │
           ├─────────────────────────┬──────────────────────┐
           │                         │                      │
           ▼                         ▼                      ▼
  ┌────────────────┐      ┌────────────────┐    ┌────────────────┐
  │  Ubuntu Runner │      │ Windows Runner │    │  macOS Runner  │
  └────────┬───────┘      └────────┬───────┘    └────────┬───────┘
           │                       │                      │
           ▼                       ▼                      ▼
  ┌────────────────┐      ┌────────────────┐    ┌────────────────┐
  │ Setup Docker   │      │ Setup Docker   │    │ Setup Docker   │
  │ Buildx         │      │ Buildx         │    │ Buildx         │
  └────────┬───────┘      └────────┬───────┘    └────────┬───────┘
           │                       │                      │
           ▼                       ▼                      ▼
  ┌────────────────┐      ┌────────────────┐    ┌────────────────┐
  │ Build Image    │      │ Build Image    │    │ Build Image    │
  └────────┬───────┘      └────────┬───────┘    └────────┬───────┘
           │                       │                      │
           ▼                       ▼                      ▼
  ┌────────────────┐      ┌────────────────┐    ┌────────────────┐
  │ Start Container│      │ Start Container│    │ Start Container│
  └────────┬───────┘      └────────┬───────┘    └────────┬───────┘
           │                       │                      │
           ▼                       ▼                      ▼
  ┌────────────────┐      ┌────────────────┐    ┌────────────────┐
  │ Test Endpoints │      │ Test Endpoints │    │ Test Endpoints │
  └────────┬───────┘      └────────┬───────┘    └────────┬───────┘
           │                       │                      │
           └───────────────────────┴──────────────────────┘
                                   │
                                   ▼
                          ┌────────────────┐
                          │   ✅ Success   │
                          │   or           │
                          │   ❌ Failure   │
                          └────────────────┘
```

## Security Layers

```
┌─────────────────────────────────────────────────────────────────┐
│                     SECURITY ARCHITECTURE                        │
└─────────────────────────────────────────────────────────────────┘

  ┌───────────────────────────────────────────────┐
  │ Level 1: Host System                          │
  │ • Docker Desktop security                     │
  │ • User permissions                            │
  └────────────────┬──────────────────────────────┘
                   │
                   ▼
  ┌───────────────────────────────────────────────┐
  │ Level 2: Docker Network                       │
  │ • Isolated bridge network                     │
  │ • Only exposed port: 4321                     │
  └────────────────┬──────────────────────────────┘
                   │
                   ▼
  ┌───────────────────────────────────────────────┐
  │ Level 3: Container                            │
  │ • Non-root user (node)                        │
  │ • Minimal Alpine Linux                        │
  │ • No shell access from outside                │
  └────────────────┬──────────────────────────────┘
                   │
                   ▼
  ┌───────────────────────────────────────────────┐
  │ Level 4: Application                          │
  │ • No secrets in code                          │
  │ • Dependencies from official registries       │
  │ • TypeScript strict mode                      │
  └───────────────────────────────────────────────┘
```

---

**Visual Guide Version**: 1.0  
**Created**: 12/11/2025  
**Purpose**: Architecture visualization for dcesares.dev Docker setup  
**Maintainer**: Isaac D'Césares (@idcesares)
