# Docker Docs Index

Hub central da documentação Docker do portfólio.

## Documentos Disponíveis

### Para começar

1. [QUICKSTART.md](./QUICKSTART.md)
   Setup mínimo para subir o ambiente em poucos minutos.

2. [README.md](./README.md)
   Visão geral do ambiente Docker, comandos principais e arquivos envolvidos.

3. [GUIDE.md](./GUIDE.md)
   Referência mais completa do fluxo de desenvolvimento, preview e troubleshooting.

4. [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
   Soluções para erros comuns de build, hot reload, portas e containers.

5. [CHECKLIST.md](./CHECKLIST.md)
   Checklist de validação do ambiente local.

6. [ARCHITECTURE.md](./ARCHITECTURE.md)
   Diagramas e visão estrutural do setup Docker.

## Fluxo Recomendado

### Desenvolvimento

```powershell
.\docker.ps1 up
.\docker.ps1 logs
.\docker.ps1 check
.\docker.ps1 down
```

```bash
docker compose up -d
docker compose logs -f
docker compose exec portfolio-dev pnpm astro check
docker compose down
```

### Preview de produção

```powershell
.\docker.ps1 prod
```

```bash
docker compose -f docker-compose.prod.yml up --build
```

## Arquivos Relacionados

- [`../Dockerfile`](../Dockerfile)
- [`../docker-compose.yml`](../docker-compose.yml)
- [`../docker-compose.prod.yml`](../docker-compose.prod.yml)
- [`../docker.ps1`](../docker.ps1)
- [`../Makefile`](../Makefile)
- [`../.devcontainer/devcontainer.json`](../.devcontainer/devcontainer.json)

## Notas

- O helper PowerShell e o Makefile usam `docker compose`, não `docker-compose`.
- O serviço de desenvolvimento expõe o site em `http://localhost:4321`.
- O container `portfolio-dev` inclui hot reload e healthcheck.

---

**Última atualização**: 2 de abril de 2026
