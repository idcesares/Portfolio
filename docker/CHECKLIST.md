# ✅ Checklist de Verificação da Configuração Docker

Use este checklist para verificar se sua configuração Docker está funcionando corretamente.

## 📋 Verificações Pré-Voo

### Software Necessário
- [ ] Docker Desktop instalado
- [ ] Docker Desktop está rodando (verifique bandeja do sistema/barra de menu)
- [ ] Git instalado (para clonar)
- [ ] Editor de texto/IDE instalado (VS Code recomendado)

### Requisitos de Sistema
- [ ] Mínimo 4GB RAM disponível para Docker
- [ ] Mínimo 10GB espaço livre em disco
- [ ] Conexão com internet (para primeiro build)

---

## 🔍 Verificação de Arquivos

### Arquivos Docker Principais
```bash
# Execute da raiz do projeto
ls -la Dockerfile
ls -la docker-compose.yml
ls -la docker-compose.prod.yml
ls -la .dockerignore
```

- [ ] `Dockerfile` existe
- [ ] `docker-compose.yml` existe
- [ ] `docker-compose.prod.yml` existe
- [ ] `.dockerignore` existe

### Scripts Auxiliares
- [ ] `docker.ps1` existe (Windows)
- [ ] `Makefile` existe (Linux/macOS)
- [ ] `test-docker.sh` existe
- [ ] `test-docker.bat` existe

### Documentação
- [ ] `docker/QUICKSTART.md` existe
- [ ] `docker/GUIDE.md` existe
- [ ] `docker/TROUBLESHOOTING.md` existe
- [ ] `docker/INDEX.md` existe
- [ ] `docker/ARCHITECTURE.md` existe
- [ ] `docker/CHECKLIST.md` existe

### Integração VSCode
- [ ] `.devcontainer/devcontainer.json` existe

### CI/CD
- [ ] `.github/workflows/docker-test.yml` existe

---

## 🧪 Testes Automatizados

### Windows
```powershell
# Execute da raiz do projeto no PowerShell
.\docker\test-docker.bat
```

### Linux/macOS
```bash
# Execute da raiz do projeto
chmod +x docker/test-docker.sh
./docker/test-docker.sh
```

- [ ] Todos os testes automatizados passam
- [ ] Sem erros no output
- [ ] Site acessível em http://localhost:4321

---

## 🚀 Verificação Manual

### Passo 1: Instalação Docker
```bash
docker --version
docker compose version
docker info
```

**Esperado**:
- [ ] Docker versão 20.x ou superior
- [ ] Docker Compose versão 2.x ou superior
- [ ] Sem erros de `docker info`

### Passo 2: Build da Imagem
```bash
# Windows PowerShell
.\docker.ps1 build

# Linux/macOS
make build

# Ou universal
docker-compose build
```

**Esperado**:
- [ ] Build completa sem erros
- [ ] Sem mensagens "FAILED"
- [ ] Tamanho da imagem ~800MB para desenvolvimento

**Tempo**: Primeiro build ~5-7 minutos

### Passo 3: Iniciar Container
```bash
# Windows PowerShell
.\docker.ps1 up

# Linux/macOS
make up

# Ou universal
docker-compose up -d
```

**Esperado**:
- [ ] Container inicia sem erros
- [ ] Sem status "exited"
- [ ] Healthcheck mostra "healthy" após ~30s

### Passo 4: Verificar Status do Container
```bash
docker-compose ps
```

**Output Esperado**:
```
NAME                    STATUS
dcesares-portfolio-dev  Up X minutes (healthy)
```

- [ ] Status mostra "Up"
- [ ] Status de saúde mostra "(healthy)"

### Passo 5: Verificar Logs
```bash
docker-compose logs
```

**Esperado nos logs**:
- [ ] "Local: http://localhost:4321"
- [ ] "ready in XXX ms"
- [ ] Sem mensagens de erro
- [ ] Sem avisos sobre dependências faltando

### Passo 6: Testar Acesso Web
```bash
# No navegador, visite:
http://localhost:4321
```

**Esperado**:
- [ ] Site carrega com sucesso
- [ ] Homepage exibida corretamente
- [ ] Imagens carregam
- [ ] Navegação funciona
- [ ] Sem erros no console (F12 → Console)

### Passo 7: Testar Hot Reload

**Edite um arquivo**:
```bash
# Edite src/pages/index.astro
# Mude qualquer texto
```

**Esperado**:
- [ ] Navegador atualiza automaticamente
- [ ] Mudanças aparecem imediatamente
- [ ] Sem erros no terminal/logs

**Tempo**: Reload deve acontecer em <2 segundos

### Passo 8: Testar Endpoint de Busca
```bash
# No navegador ou curl:
http://localhost:4321/search-data.json
```

**Esperado**:
- [ ] Dados JSON carregam
- [ ] Contém itens de blog e work
- [ ] Sem erros

### Passo 9: Testar Astro Check
```bash
docker-compose exec portfolio-dev pnpm astro check
```

**Esperado**:
- [ ] Validação TypeScript executa
- [ ] Sem erros críticos
- [ ] Avisos são aceitáveis

### Passo 10: Testar Acesso ao Shell
```bash
# Windows PowerShell
.\docker.ps1 shell

# Linux/macOS
make shell

# Ou universal
docker-compose exec portfolio-dev sh
```

**No shell do container, teste**:
```bash
pwd                 # Deve mostrar /app
ls -la              # Deve mostrar arquivos do projeto
node --version      # Deve mostrar v18.x
pnpm --version      # Deve mostrar v8.x
exit                # Sair do shell
```

- [ ] Acesso ao shell funciona
- [ ] Comandos executam com sucesso
- [ ] Pode sair corretamente

---

## 🏭 Teste de Build de Produção

### Build da Imagem de Produção
```bash
docker-compose -f docker-compose.prod.yml build
```

**Esperado**:
- [ ] Build completa sem erros
- [ ] Cria dist/ otimizado para produção

### Iniciar Preview de Produção
```bash
docker-compose -f docker-compose.prod.yml up
```

**Esperado**:
- [ ] Servidor de preview inicia
- [ ] Site acessível em http://localhost:4321
- [ ] Funções SSR funcionam

### Parar Preview de Produção
```bash
# Ctrl+C ou em novo terminal:
docker-compose -f docker-compose.prod.yml down
```

- [ ] Para corretamente

---

## 🧹 Teste de Limpeza

### Parar Desenvolvimento
```bash
docker-compose down
```

**Esperado**:
- [ ] Container para
- [ ] Sem erros
- [ ] `docker-compose ps` não mostra nada rodando

### Limpeza Completa (Opcional)
```bash
# Windows PowerShell
.\docker.ps1 clean

# Linux/macOS
make clean

# Ou universal
docker-compose down -v --rmi all
```

**Esperado**:
- [ ] Remove containers
- [ ] Remove volumes
- [ ] Remove imagens
- [ ] Sem erros

---

## 🎯 Teste VSCode Dev Container (Opcional)

### Pré-requisitos
- [ ] VSCode instalado
- [ ] Extensão "Dev Containers" instalada

### Passos
1. Abrir projeto no VS Code
2. F1 → "Dev Containers: Reopen in Container"
3. Aguardar build do container (~5-7 min primeira vez)
4. Terminal abre dentro do container

**Esperado**:
- [ ] VS Code reabre no container
- [ ] Extensões carregam automaticamente
- [ ] Terminal mostra `/app` como diretório de trabalho
- [ ] Pode executar `pnpm dev` no terminal
- [ ] Pode editar arquivos com hot reload

---

## 📊 Benchmarks de Performance

### Tempos de Build (Primeira Execução)
- [ ] Pull da imagem: 1-2 minutos
- [ ] Build: 5-7 minutos
- [ ] Total: 6-9 minutos

### Tempos de Build (Subsequentes)
- [ ] Build com cache: 1-2 minutos
- [ ] Iniciar container: <10 segundos

### Hot Reload
- [ ] Mudança de arquivo até navegador: <2 segundos

### Uso de Memória
- [ ] RAM do Container: 512MB - 2GB
- [ ] CPU do Container: 10-50% (dependendo da atividade)

---

## 🐛 Checklist de Problemas Comuns

Se algo falhar, verifique:

### Docker Não Está Rodando
```bash
# Inicie Docker Desktop manualmente
# Aguarde "Docker Desktop is running"
# Tente o comando novamente
```

- [ ] Docker Desktop mostra status "running"
- [ ] Ícone verde na bandeja do sistema

### Porta 4321 Ocupada
```bash
# Windows PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 4321).OwningProcess

# Linux/macOS
lsof -i :4321

# Mate o processo ou mude a porta no docker-compose.yml
```

- [ ] Nenhum outro processo usando porta 4321

### Problemas de Permissão (Linux)
```bash
sudo usermod -aG docker $USER
newgrp docker
```

- [ ] Usuário no grupo docker
- [ ] Sem erros "permission denied"

### Cache Desatualizado
```bash
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

- [ ] Rebuild limpo funciona

---

## ✨ Critérios de Sucesso

Sua configuração Docker está **totalmente funcional** se:

- ✅ Todas verificações pré-voo passam
- ✅ Testes automatizados passam (test-docker.sh/bat)
- ✅ Passos de verificação manual 1-10 passam
- ✅ Teste de build de produção passa
- ✅ Site carrega em http://localhost:4321
- ✅ Hot reload funciona
- ✅ Sem erros nos logs
- ✅ Healthcheck mostra "healthy"

---

## 📝 Referência de Troubleshooting

Se qualquer verificação falhar:

1. **Confira**: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
2. **Leia**: [GUIDE.md](./GUIDE.md)
3. **Revise**: Logs com `docker-compose logs`
4. **Reset**: Build limpo com `docker-compose down -v && docker-compose build --no-cache`

---

## 🎉 Aprovação Final

Data: _______________

- [ ] Todos testes automatizados passaram
- [ ] Todas verificações manuais completadas
- [ ] Workflow de desenvolvimento testado
- [ ] Preview de produção testado
- [ ] Hot reload confirmado funcionando
- [ ] Documentação revisada
- [ ] Pronto para desenvolvimento

**Aprovado por**: _____________________

---

**Versão do Checklist**: 1.0  
**Criado**: 12/11/2025  
**Para**: Configuração Docker do Portfolio dcesares.dev  
**Próximo**: Começar desenvolvimento com `docker-compose up -d`
