# 🐳 Ambiente de Desenvolvimento Docker

Este diretório contém todos os arquivos e documentação relacionados ao Docker para o portfólio.

## 🚀 Início Rápido

### Pré-requisitos
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado e rodando

### Iniciar Desenvolvimento

**Windows PowerShell** (da raiz do projeto):
```powershell
.\docker.ps1 up
```

**Linux/macOS** (da raiz do projeto):
```bash
make up
# ou
docker compose up -d
```

**Acesse**: http://localhost:4321

### Parar Desenvolvimento
```bash
docker compose down
```

## 📚 Documentação

- **[QUICKSTART.md](./QUICKSTART.md)** - Guia de início rápido (5 minutos)
- **[GUIDE.md](./GUIDE.md)** - Documentação completa e referência
- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Problemas comuns e soluções
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Diagramas de arquitetura visual
- **[INDEX.md](./INDEX.md)** - Hub central de documentação
- **[CHECKLIST.md](./CHECKLIST.md)** - Checklist de verificação de setup

## 🛠️ Arquivos neste Diretório

### Configuração Principal (na raiz do projeto)
- `../Dockerfile` - Definição de build multi-stage
- `../docker-compose.yml` - Ambiente de desenvolvimento
- `../docker-compose.prod.yml` - Preview de produção
- `../.dockerignore` - Otimização de build

### Scripts Auxiliares (na raiz do projeto)
- `../docker.ps1` - Helper PowerShell (Windows)
- `../Makefile` - Comandos cross-platform

### Testes e Validação
- `test-docker.sh` - Testes automatizados (Bash)
- `test-docker.bat` - Testes automatizados (Windows)

### Documentação
- Todos os arquivos `.md` neste diretório

### Integração VSCode (na raiz do projeto)
- `../.devcontainer/devcontainer.json` - Configuração Dev Containers

## 🧪 Testar Sua Configuração

**Windows**:
```powershell
.\docker\test-docker.bat
```

**Linux/macOS**:
```bash
chmod +x docker/test-docker.sh
./docker/test-docker.sh
```

## 📖 Comandos Comuns

Da raiz do projeto:

```bash
# Desenvolvimento
docker compose up -d              # Iniciar
docker compose down               # Parar
docker compose logs -f            # Ver logs
docker compose restart            # Reiniciar

# Validação
docker compose exec portfolio-dev pnpm astro check

# Acessar container
docker compose exec portfolio-dev sh

# Preview de produção
docker compose -f docker-compose.prod.yml up

# Limpar tudo
docker compose down -v --rmi all
```

Ou use os scripts auxiliares:

```powershell
# Windows
.\docker.ps1 up|down|logs|check|shell|prod|clean

# Linux/macOS
make up|down|logs|check|shell|prod|clean
```

## 🆘 Obter Ajuda

1. Confira [QUICKSTART.md](./QUICKSTART.md) primeiro
2. Revise [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) para problemas comuns
3. Leia [GUIDE.md](./GUIDE.md) para detalhes
4. Execute os scripts de teste para diagnosticar problemas

## 🔗 Veja Também

- Projeto principal [README.md](../README.md)
- Instruções para agentes [AGENTS.md](../AGENTS.md)
- Workflow CI/CD `../.github/workflows/docker-test.yml`

---

**Mantido por**: Isaac D'Césares (@idcesares)  
**Última atualização**: 2 de abril de 2026
