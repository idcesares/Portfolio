# Docker Setup - Summary & Index

Este documento serve como índice central para toda a documentação Docker do portfolio.

## 📋 Documentos Disponíveis

### Para Usuários

1. **[QUICKSTART-DOCKER.md](./QUICKSTART-DOCKER.md)** ⭐
   - **Tempo de leitura**: 2 minutos
   - **Propósito**: Começar em 5 minutos
   - **Ideal para**: Primeira vez usando Docker no projeto

2. **[README-DOCKER.md](./README-DOCKER.md)** 📚
   - **Tempo de leitura**: 15 minutos
   - **Propósito**: Guia completo e referência
   - **Ideal para**: Entender arquitetura, comandos avançados, workflows

3. **[DOCKER-TROUBLESHOOTING.md](./DOCKER-TROUBLESHOOTING.md)** 🔧
   - **Tempo de leitura**: Conforme necessário
   - **Propósito**: Resolver problemas específicos
   - **Ideal para**: Quando algo não funciona

### Para Desenvolvedores

4. **[README.md](./README.md)** (Seção Docker)
   - Overview e links para docs completas

5. **[AGENTS.md](./AGENTS.md)** (Seção Docker)
   - Instruções para AI Agents sobre Docker

## 🚀 Quick Reference

### Comandos Mais Usados

```bash
# Iniciar desenvolvimento
docker-compose up -d          # OU .\docker.ps1 up

# Parar
docker-compose down           # OU .\docker.ps1 down

# Ver logs
docker-compose logs -f        # OU .\docker.ps1 logs

# Validar código
docker-compose exec portfolio-dev pnpm astro check
```

### Arquivos Docker

```
├── Dockerfile                      # Definição da imagem (multi-stage)
├── docker-compose.yml              # Ambiente de desenvolvimento
├── docker-compose.prod.yml         # Preview de produção
├── .dockerignore                   # Arquivos excluídos do build
├── .devcontainer/
│   └── devcontainer.json          # VSCode Dev Containers config
├── docker.ps1                      # Helper PowerShell (Windows)
├── Makefile                        # Cross-platform commands
├── test-docker.sh                  # Teste automatizado (Bash)
└── test-docker.bat                 # Teste automatizado (Windows)
```

## 🎯 Fluxos de Trabalho

### Primeiro Setup

1. Instale [Docker Desktop](https://www.docker.com/products/docker-desktop/)
2. Clone o repositório
3. Execute:
   ```bash
   .\docker.ps1 up    # Windows
   make up            # Linux/macOS
   ```
4. Acesse http://localhost:4321

**Tempo total**: 5-10 minutos

### Desenvolvimento Diário

```bash
# Manhã
docker-compose up -d

# Desenvolver normalmente
# Hot reload automático funciona!

# Validar antes de commit
docker-compose exec portfolio-dev pnpm astro check

# Fim do dia
docker-compose down
```

### Testar Build de Produção

```bash
docker-compose -f docker-compose.prod.yml up --build
```

### Resolver Problemas

1. Consultar [DOCKER-TROUBLESHOOTING.md](./DOCKER-TROUBLESHOOTING.md)
2. Executar testes:
   ```bash
   ./test-docker.sh       # Linux/macOS
   test-docker.bat        # Windows
   ```
3. Reset completo se necessário:
   ```bash
   docker-compose down -v --rmi all
   docker-compose build --no-cache
   docker-compose up -d
   ```

## 🔑 Conceitos-Chave

### Multi-Stage Build

O `Dockerfile` usa 4 stages:
1. **base**: Instala pnpm
2. **development**: Dev dependencies + hot reload
3. **builder**: Executa build SSR
4. **production**: Runtime leve

### Volumes

Arquivos montados para hot reload:
- `./src` → Código fonte
- `./public` → Assets estáticos
- `./src/content` → Blog/Portfolio
- Configs (astro.config.mjs, etc.)

**Isolado**: `node_modules`, `.astro` (evita conflitos)

### Healthcheck

Container tem healthcheck automático:
- Verifica http://localhost:4321 a cada 30s
- Start period: 40s para inicialização
- Status visível em `docker-compose ps`

### Caching

- **Build layers**: Cached automaticamente
- **search-data.json**: 5min cache (vercel.json)
- **node_modules**: Persistente no container

## 🌐 Compatibilidade

### Sistemas Operacionais

| OS | Status | Comando |
|---|---|---|
| Windows 10/11 | ✅ Testado | `.\docker.ps1 up` |
| macOS (Intel) | ✅ Testado | `make up` |
| macOS (Apple Silicon) | ✅ Compatível | `make up` |
| Linux (Ubuntu/Debian) | ✅ Testado | `make up` |
| WSL2 | ✅ Recomendado | `make up` |

### IDEs/Editores

| Editor | Suporte | Feature |
|---|---|---|
| VSCode | ✅ Dev Containers | `.devcontainer/devcontainer.json` |
| JetBrains | ✅ Docker Compose | Nativo |
| Vim/Neovim | ✅ Terminal | docker-compose CLI |
| Visual Studio | ⚠️ Manual | docker-compose CLI |

## 📊 Performance

### Primeira Execução

- **Download de imagem base**: ~2-3min
- **Build**: ~5-7min
- **Inicialização**: ~30s
- **Total**: ~8-10min

### Execuções Subsequentes

- **Start**: ~10s (cache)
- **Hot reload**: <1s por mudança
- **Rebuild**: ~2-3min (se necessário)

### Otimizações Aplicadas

- ✅ Multi-stage build (imagem menor)
- ✅ pnpm (instalação mais rápida)
- ✅ Layer caching otimizado
- ✅ .dockerignore abrangente
- ✅ BuildKit habilitado

## 🔒 Segurança

### Práticas Implementadas

- ✅ Non-root user (node) no container
- ✅ Multi-stage build (menos vulnerabilidades)
- ✅ Imagem oficial Node Alpine (minimal)
- ✅ .dockerignore (sem dados sensíveis)
- ✅ Network isolada

### O que NÃO fazer

- ❌ Commitar `.env` com secrets
- ❌ Expor portas desnecessárias
- ❌ Rodar como root no container
- ❌ Usar `latest` tag em produção

## 📈 Métricas

### Tamanho das Imagens

- **Development**: ~800MB (com dev deps)
- **Production**: ~400MB (runtime only)
- **Base**: ~150MB (Node Alpine + pnpm)

### Uso de Recursos

- **RAM**: 512MB - 2GB (depende do tráfego)
- **CPU**: 1-2 cores
- **Disco**: 2GB (inclui cache)

## 🆘 Suporte

### Problemas Conhecidos

1. **Hot reload lento no Windows**
   - Solução: Usar WSL2
   - Ver: [README-DOCKER.md](./README-DOCKER.md#performance)

2. **Porta 4321 ocupada**
   - Solução: Mudar porta em docker-compose.yml
   - Ver: [DOCKER-TROUBLESHOOTING.md](./DOCKER-TROUBLESHOOTING.md#1-port-4321-is-already-in-use)

3. **Out of memory**
   - Solução: Aumentar RAM no Docker Desktop (mín 4GB)
   - Ver: [DOCKER-TROUBLESHOOTING.md](./DOCKER-TROUBLESHOOTING.md#5-build-falha-com-out-of-memory)

### Onde Pedir Ajuda

1. Consulte documentos na ordem:
   - QUICKSTART-DOCKER.md
   - README-DOCKER.md
   - DOCKER-TROUBLESHOOTING.md

2. Execute testes automatizados:
   ```bash
   ./test-docker.sh  # ou test-docker.bat
   ```

3. Abra issue no GitHub com:
   - Sistema operacional
   - Versões (Docker, Docker Compose)
   - Logs (`docker-compose logs`)
   - Output do teste automatizado

## 🔄 Atualizações

### Manter Docker Atualizado

```bash
# Atualizar imagem base
docker-compose pull

# Rebuild com nova imagem
docker-compose build --pull

# Atualizar dependências Node
docker-compose exec portfolio-dev pnpm update
```

### Changelog Docker

- **2025-01-12**: Setup inicial
  - Dockerfile multi-stage
  - docker-compose.yml (dev + prod)
  - Documentação completa
  - Scripts de teste
  - CI/CD workflow

## 📝 Notas Adicionais

### Por que Docker?

1. **Consistência**: Mesmo ambiente em qualquer máquina
2. **Isolamento**: Sem conflitos de dependências
3. **Reprodutibilidade**: Setup idêntico para toda equipe
4. **CI/CD**: Facilita automação
5. **Onboarding**: Novo dev produtivo em 10min

### Alternativas

- **Local setup**: Requer Node.js, pnpm, config manual
- **Vercel Dev**: Preview, mas não substitui dev local
- **GitHub Codespaces**: Cloud, mas depende de internet

### Próximos Passos

- [ ] Adicionar serviços opcionais (Redis, Postgres)
- [ ] Otimizar build multi-arch (ARM64)
- [ ] Adicionar profiles Docker Compose (dev/test/prod)
- [ ] Integrar com Kubernetes (se necessário)

---

## 🎓 Recursos de Aprendizado

### Docker Geral

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Best Practices](https://docs.docker.com/develop/dev-best-practices/)

### Astro + Docker

- [Astro Deployment](https://docs.astro.build/en/guides/deploy/)
- [Astro Docker Guide](https://docs.astro.build/en/recipes/docker/)

### VSCode Dev Containers

- [Dev Containers Tutorial](https://code.visualstudio.com/docs/devcontainers/tutorial)
- [Dev Container Features](https://code.visualstudio.com/docs/devcontainers/containers)

---

**Última atualização**: 12/11/2025  
**Versão**: 1.0  
**Maintainer**: Isaac D'Césares (@idcesares)  
**Feedback**: Abra issue no GitHub

**Links Rápidos**:
- [Portfolio](https://dcesares.dev)
- [GitHub Repo](https://github.com/idcesares/Portfolio)
- [Documentação Principal](./README.md)
