# Docker Setup para Portfolio dcesares.dev

Este guia explica como executar o ambiente de desenvolvimento do portfólio usando Docker, garantindo consistência entre diferentes máquinas e sistemas operacionais.

## Pré-requisitos

- **Docker Desktop** instalado ([Windows](https://docs.docker.com/desktop/install/windows-install/), [macOS](https://docs.docker.com/desktop/install/mac-install/), [Linux](https://docs.docker.com/desktop/install/linux-install/))
- **Docker Compose** (incluído no Docker Desktop)
- Mínimo 4GB RAM disponível para Docker
- Mínimo 10GB espaço em disco

## Estrutura Docker

```
├── Dockerfile              # Multi-stage build (dev + prod)
├── docker-compose.yml      # Ambiente de desenvolvimento
├── docker-compose.prod.yml # Preview de produção
└── .dockerignore          # Otimização do build context
```

## Comandos Rápidos

### Desenvolvimento (Hot Reload)

```bash
# Iniciar ambiente de desenvolvimento
docker-compose up

# Ou em background
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar containers
docker-compose down
```

**Acesso**: http://localhost:4321

### Preview de Produção (SSR Build)

```bash
# Build e preview da versão de produção
docker-compose -f docker-compose.prod.yml up --build

# Em background
docker-compose -f docker-compose.prod.yml up -d --build

# Parar
docker-compose -f docker-compose.prod.yml down
```

**Acesso**: http://localhost:4321

## Comandos Detalhados

### Build da Imagem

```bash
# Build apenas (sem iniciar)
docker-compose build

# Force rebuild (ignora cache)
docker-compose build --no-cache

# Build de produção
docker-compose -f docker-compose.prod.yml build --no-cache
```

### Gerenciamento de Containers

```bash
# Listar containers ativos
docker-compose ps

# Executar comando dentro do container
docker-compose exec portfolio-dev sh

# Ver logs em tempo real
docker-compose logs -f portfolio-dev

# Reiniciar serviço
docker-compose restart portfolio-dev

# Parar e remover containers + volumes
docker-compose down -v
```

### Validação e Testes

```bash
# Executar astro check dentro do container
docker-compose exec portfolio-dev pnpm astro check

# Executar build de validação
docker-compose exec portfolio-dev pnpm build

# Acessar shell do container
docker-compose exec portfolio-dev sh
```

## Estrutura de Volumes

O ambiente de desenvolvimento monta os seguintes diretórios para hot reload:

- `./src` → Código fonte e componentes
- `./public` → Assets estáticos
- `./src/content` → Blog posts e portfolio
- Arquivos de configuração (astro.config.mjs, tailwind.config.cjs, etc.)

**Importante**: `node_modules` e `.astro` permanecem isolados no container para evitar conflitos entre SO.

## Variáveis de Ambiente

Configuradas automaticamente no `docker-compose.yml`:

```yaml
NODE_ENV=development
HOST=0.0.0.0
PORT=4321
```

Para adicionar variáveis customizadas, crie um arquivo `.env` na raiz:

```env
# .env (exemplo)
CUSTOM_VAR=valor
```

E referencia no `docker-compose.yml`:

```yaml
environment:
  - CUSTOM_VAR=${CUSTOM_VAR}
```

## Troubleshooting

### Port já em uso (4321)

**Windows PowerShell**:
```powershell
# Encontrar processo usando a porta
Get-Process -Id (Get-NetTCPConnection -LocalPort 4321).OwningProcess

# Ou mudar porta no docker-compose.yml
ports:
  - "3000:4321"  # Mapeia porta 3000 externa → 4321 interna
```

**Linux/macOS**:
```bash
# Encontrar processo
lsof -i :4321

# Ou mudar porta
ports:
  - "3000:4321"
```

### Hot reload não funciona

```bash
# 1. Verificar se volumes estão montados
docker-compose exec portfolio-dev ls -la /app/src

# 2. Reiniciar container
docker-compose restart portfolio-dev

# 3. Rebuild completo
docker-compose down -v
docker-compose up --build
```

### Build falha com erro de memória

Aumente memória disponível no Docker Desktop:
- **Windows/Mac**: Settings → Resources → Memory (mínimo 4GB)

### Permissões (Linux)

```bash
# Se arquivos criados pelo container não são editáveis
sudo chown -R $USER:$USER .
```

## Performance

### Cache de Build

O Dockerfile usa multi-stage build com layers otimizados:
1. **Base**: Instala pnpm
2. **Development**: Instala dependências completas
3. **Builder**: Executa build
4. **Production**: Runtime leve apenas com produção

### Otimizações

```bash
# Limpar cache Docker (libera espaço)
docker system prune -a

# Remover volumes órfãos
docker volume prune

# Ver uso de espaço
docker system df
```

## Workflow de Desenvolvimento

### Dia a dia

```bash
# 1. Iniciar ambiente
docker-compose up -d

# 2. Desenvolver normalmente (hot reload ativo)
# Editar arquivos em src/, public/, etc.

# 3. Ver logs se necessário
docker-compose logs -f

# 4. Validar antes de commit
docker-compose exec portfolio-dev pnpm astro check

# 5. Parar ao final do dia
docker-compose down
```

### Antes de Deploy

```bash
# 1. Testar build de produção
docker-compose -f docker-compose.prod.yml up --build

# 2. Verificar em http://localhost:4321

# 3. Se OK, fazer deploy normalmente (Vercel)
```

## Integração com VSCode

### Dev Containers (Opcional)

Instale extensão **Dev Containers** e adicione `.devcontainer/devcontainer.json`:

```json
{
  "name": "dcesares.dev Portfolio",
  "dockerComposeFile": "../docker-compose.yml",
  "service": "portfolio-dev",
  "workspaceFolder": "/app",
  "customizations": {
    "vscode": {
      "extensions": [
        "astro-build.astro-vscode",
        "bradlc.vscode-tailwindcss"
      ]
    }
  }
}
```

Abra com: **F1** → "Dev Containers: Reopen in Container"

## Healthchecks

O container possui healthcheck automático:

```bash
# Ver status de saúde
docker-compose ps

# Output esperado:
# NAME                    STATUS
# dcesares-portfolio-dev  Up (healthy)
```

## Networking

O Docker Compose cria rede isolada `portfolio-network`. Para conectar outros serviços (banco de dados futuro, etc.), adicione ao mesmo network.

## Comandos Úteis do PowerShell

```powershell
# Alias úteis (adicionar ao perfil PowerShell)
function dc-up { docker-compose up }
function dc-down { docker-compose down }
function dc-logs { docker-compose logs -f }
function dc-build { docker-compose build --no-cache }

# Executar
dc-up
```

## Migração do Ambiente Local

### Parando servidor local e iniciando Docker

```bash
# 1. Se tiver servidor local rodando, pare
# Ctrl+C no terminal

# 2. Inicie Docker
docker-compose up -d

# 3. Confirme acesso em http://localhost:4321
```

Ambos não podem rodar simultaneamente na mesma porta!

## Limpeza Completa

```bash
# Remover tudo relacionado ao projeto
docker-compose down -v --rmi all

# Isso remove:
# - Containers
# - Volumes
# - Imagens
```

## Suporte e Debugging

### Logs Detalhados

```bash
# Logs completos desde o início
docker-compose logs --tail=1000

# Logs de erro apenas
docker-compose logs | grep -i error
```

### Executar Comandos Ad-Hoc

```bash
# Instalar nova dependência
docker-compose exec portfolio-dev pnpm add <package>

# Executar script customizado
docker-compose exec portfolio-dev pnpm run <script>
```

## Notas Importantes

1. **Node Modules**: Não delete `node_modules` local se estiver usando Docker. Os volumes isolados garantem consistência.

2. **Git**: O `.dockerignore` já exclui arquivos desnecessários do build context.

3. **Vercel Analytics**: Funcionam normalmente em desenvolvimento via Docker.

4. **pnpm**: O container usa pnpm (não npm/yarn) conforme especificação do projeto.

5. **TypeScript Strict**: Validações TypeScript funcionam dentro do container.

## Próximos Passos

- [ ] Adicionar serviço de banco de dados (se necessário)
- [ ] Configurar CI/CD com Docker builds
- [ ] Adicionar testes automatizados no container
- [ ] Implementar backup automático de volumes

---

**Mantido por**: Isaac D'Césares (@idcesares)  
**Atualizado**: 12/11/2025  
**Documentação Principal**: README.md  
**Arquitetura**: AGENTS.md
