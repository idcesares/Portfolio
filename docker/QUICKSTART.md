# Início Rápido - Configuração Docker

## 🚀 Início Rápido (5 minutos)

### 1. Pré-requisitos
- Instale [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Certifique-se que Docker está rodando (ícone na bandeja do sistema)

### 2. Iniciar Desenvolvimento

**Windows PowerShell**:
```powershell
.\docker.ps1 up
```

**Linux/macOS ou Terminal padrão**:
```bash
docker compose up -d
```

### 3. Acessar o Site
Abra seu navegador em: **http://localhost:4321**

### 4. Parar
```powershell
.\docker.ps1 down   # Windows
docker compose down # Linux/macOS
```

---

## 📋 Comandos Essenciais (PowerShell)

```powershell
.\docker.ps1 up       # Iniciar dev
.\docker.ps1 down     # Parar
.\docker.ps1 logs     # Ver logs
.\docker.ps1 check    # Validar código
.\docker.ps1 restart  # Reiniciar
.\docker.ps1 shell    # Acessar container
.\docker.ps1 prod     # Preview produção
.\docker.ps1 clean    # Limpar tudo
```

## 🔧 Troubleshooting Rápido

### Porta 4321 ocupada
```powershell
# Encontrar processo
Get-Process -Id (Get-NetTCPConnection -LocalPort 4321).OwningProcess

# Ou mudar porta no docker-compose.yml
ports:
  - "3000:4321"  # Usar porta 3000
```

### Hot reload não funciona
```powershell
.\docker.ps1 restart
```

### Build com erro
```powershell
.\docker.ps1 clean
.\docker.ps1 build
.\docker.ps1 up
```

---

## 📖 Documentação Completa
Ver **[README.md](./README.md)** e **[GUIDE.md](./GUIDE.md)** para o guia detalhado.

## 🎯 Workflow Diário

```powershell
# Manhã - iniciar ambiente
.\docker.ps1 up

# Desenvolver normalmente
# Editar arquivos em src/, public/, etc.
# Hot reload automático!

# Validar antes de commit
.\docker.ps1 check

# Fim do dia - parar
.\docker.ps1 down
```

## ✅ Checklist Primeira Vez

- [ ] Docker Desktop instalado e rodando
- [ ] Clone do repositório completo
- [ ] Executar `.\docker.ps1 up` (Windows) ou `docker compose up -d`
- [ ] Acessar http://localhost:4321
- [ ] Ver hot reload funcionando (edite um arquivo em `src/`)
- [ ] Executar `.\docker.ps1 check` para validar
- [ ] Parar com `.\docker.ps1 down`

---

**Tempo estimado de setup**: 5-10 minutos  
**Benefícios**: Ambiente idêntico em Windows/Linux/macOS, sem conflitos de dependências
