# Docker Troubleshooting Guide

Este guia ajuda a resolver problemas comuns ao usar o ambiente Docker do portfolio.

## 🔍 Diagnóstico Rápido

Execute primeiro para identificar o problema:

```bash
# Windows PowerShell
.\docker.ps1 check

# Linux/macOS
make test
# ou
./test-docker.sh
```

---

## ❌ Problemas Comuns

### 1. "Port 4321 is already in use"

**Causa**: Outra aplicação está usando a porta 4321.

**Solução A - Encontrar e parar o processo**:

**Windows PowerShell**:
```powershell
# Encontrar processo
Get-Process -Id (Get-NetTCPConnection -LocalPort 4321).OwningProcess

# Parar processo (substitua PID)
Stop-Process -Id <PID> -Force
```

**Linux/macOS**:
```bash
# Encontrar processo
lsof -i :4321

# Parar processo (substitua PID)
kill -9 <PID>
```

**Solução B - Mudar porta no Docker**:

Edite `docker-compose.yml`:
```yaml
ports:
  - "3000:4321"  # Usa porta 3000 externa → 4321 interna
```

Acesse: http://localhost:3000

---

### 2. "docker: command not found"

**Causa**: Docker não está instalado ou não está no PATH.

**Solução**:
1. Instale [Docker Desktop](https://www.docker.com/products/docker-desktop/)
2. Reinicie o terminal
3. Verifique: `docker --version`

---

### 3. "Cannot connect to Docker daemon"

**Causa**: Docker Desktop não está rodando.

**Solução**:
1. Inicie Docker Desktop (ícone na bandeja do sistema)
2. Aguarde até ficar "running"
3. Tente novamente: `docker compose up -d`

---

### 4. Hot Reload não funciona

**Sintoma**: Mudanças no código não aparecem automaticamente.

**Solução 1 - Reiniciar container**:
```bash
docker compose restart portfolio-dev
```

**Solução 2 - Verificar volumes**:
```bash
# Verificar se volumes estão montados
docker compose exec portfolio-dev ls -la /app/src

# Se não aparecer arquivos, rebuild
docker compose down
docker compose up --build
```

**Solução 3 - Limpar cache Astro**:
```bash
docker compose exec portfolio-dev rm -rf .astro
docker compose restart
```

---

### 5. Build falha com "out of memory"

**Causa**: Docker não tem memória suficiente.

**Solução**:
1. Docker Desktop → Settings → Resources
2. Aumentar Memory para **mínimo 4GB**
3. Apply & Restart
4. Rebuild: `docker compose build --no-cache`

---

### 6. "Permission denied" (Linux)

**Sintoma**: Arquivos criados pelo container não são editáveis.

**Solução**:
```bash
# Corrigir permissões
sudo chown -R $USER:$USER .

# Adicionar usuário ao grupo docker (evita sudo)
sudo usermod -aG docker $USER
newgrp docker
```

---

### 7. Container inicia mas site não carrega

**Diagnóstico**:
```bash
# Ver logs
docker compose logs -f portfolio-dev

# Verificar status
docker compose ps
```

**Soluções comuns**:

**A. Dependências não instaladas**:
```bash
docker compose exec portfolio-dev pnpm install
docker compose restart
```

**B. Build corrompido**:
```bash
docker compose down -v
docker compose build --no-cache
docker compose up -d
```

**C. Porta mapeada errada**:
Verificar `docker-compose.yml` → ports: `"4321:4321"`

---

### 8. "Error loading module" ou erros TypeScript

**Causa**: node_modules desatualizado ou cache corrompido.

**Solução**:
```bash
# Limpar tudo e reinstalar
docker compose down -v
docker compose build --no-cache
docker compose up -d

# Ou dentro do container
docker compose exec portfolio-dev rm -rf node_modules .astro
docker compose exec portfolio-dev pnpm install
docker compose restart
```

---

### 9. Imagem Docker muito grande

**Diagnóstico**:
```bash
docker images | grep dcesares
```

**Solução - Limpar caches**:
```bash
# Limpar cache de build
docker builder prune

# Remover imagens antigas
docker image prune -a

# Ver uso de espaço
docker system df

# Limpeza completa (CUIDADO: remove tudo)
docker system prune -a --volumes
```

---

### 10. Containers não param corretamente

**Sintoma**: `docker compose down` trava ou falha.

**Solução**:
```bash
# Force stop
docker compose down --timeout 30

# Ou manualmente
docker stop $(docker ps -q)
docker rm $(docker ps -aq)

# Limpar tudo
docker compose down -v --remove-orphans
```

---

## 🐞 Debug Avançado

### Acessar shell do container

```bash
# Entrar no container
docker compose exec portfolio-dev sh

# Comandos úteis dentro do container
pwd                    # Ver diretório atual
ls -la                 # Listar arquivos
pnpm run dev           # Iniciar dev manualmente
pnpm astro check       # Validar TypeScript
node --version         # Ver versão Node
pnpm --version         # Ver versão pnpm
```

### Ver variáveis de ambiente

```bash
docker compose exec portfolio-dev env
```

### Inspecionar container

```bash
# Ver configuração completa
docker inspect dcesares-portfolio-dev

# Ver logs desde o início
docker compose logs --tail=1000

# Ver apenas erros
docker compose logs | grep -i error
```

### Network issues

```bash
# Verificar networks
docker network ls

# Inspecionar network
docker network inspect portfolio-network

# Recriar network
docker compose down
docker network rm portfolio-network
docker compose up -d
```

---

## 🔧 Resetar Tudo (Last Resort)

Se nada funcionar, reset completo:

```bash
# 1. Parar e remover tudo
docker compose down -v --rmi all --remove-orphans

# 2. Limpar sistema Docker
docker system prune -a --volumes

# 3. Remover cache Astro local
rm -rf .astro

# 4. Rebuild do zero
docker compose build --no-cache

# 5. Iniciar novamente
docker compose up -d
```

---

## 📊 Monitoramento e Logs

### Ver uso de recursos

```bash
# Ver CPU e memória em tempo real
docker stats dcesares-portfolio-dev

# Ver processos dentro do container
docker compose top
```

### Exportar logs

```bash
# Salvar logs em arquivo
docker compose logs > docker-logs.txt

# Últimas 500 linhas
docker compose logs --tail=500 > recent-logs.txt
```

---

## 🔍 Validação de Setup

### Checklist de validação

```bash
# 1. Docker instalado
docker --version

# 2. Docker Compose instalado
docker compose version

# 3. Docker rodando
docker info

# 4. Arquivos Docker presentes
ls -la Dockerfile docker-compose.yml

# 5. Build funciona
docker compose build

# 6. Container inicia
docker compose up -d

# 7. Site acessível
curl http://localhost:4321

# 8. Healthcheck OK
docker compose ps  # Deve mostrar "healthy"
```

---

## 💡 Dicas de Performance

### Otimizar build

```bash
# Usar BuildKit (mais rápido)
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1
docker compose build

# Windows PowerShell
$env:DOCKER_BUILDKIT=1
$env:COMPOSE_DOCKER_CLI_BUILD=1
docker compose build
```

### Cache de volumes

```bash
# Verificar volumes
docker volume ls

# Limpar volumes órfãos
docker volume prune
```

---

## 🆘 Ainda com Problemas?

1. **Verifique requisitos**:
   - Docker Desktop atualizado
   - Mínimo 4GB RAM para Docker
   - Mínimo 10GB espaço em disco

2. **Logs completos**:
   ```bash
   docker compose logs --tail=1000 > debug-logs.txt
   ```

3. **Informações do sistema**:
   ```bash
   docker version
   docker compose version
   docker info
   ```

4. **Criar Issue**: 
   Abra issue no GitHub com:
   - Sistema operacional
   - Versões (Docker, Docker Compose)
   - Logs relevantes
   - Passos para reproduzir

---

## 📚 Recursos Adicionais

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Astro Troubleshooting](https://docs.astro.build/en/guides/troubleshooting/)
- [README.md](./README.md) - Guia rápido do diretório Docker
- [GUIDE.md](./GUIDE.md) - Guia completo
- [QUICKSTART.md](./QUICKSTART.md) - Início rápido

---

**Última atualização**: 02/04/2026  
**Maintainer**: Isaac D'Césares (@idcesares)
