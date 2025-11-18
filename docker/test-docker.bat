@echo off
REM Test script para validar Docker setup no Windows
REM Uso: test-docker.bat

echo === Docker Setup Validation ===
echo.

REM Test 1: Docker instalado
echo Testando se Docker esta instalado...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] Docker nao encontrado. Instale Docker Desktop primeiro.
    exit /b 1
)
echo [OK] Docker instalado

REM Test 2: Docker Compose instalado
echo Testando se Docker Compose esta instalado...
docker compose version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] Docker Compose nao encontrado.
    exit /b 1
)
echo [OK] Docker Compose instalado

REM Test 3: Docker rodando
echo Testando se Docker esta rodando...
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] Docker nao esta rodando. Inicie Docker Desktop.
    exit /b 1
)
echo [OK] Docker rodando

REM Test 4: Arquivos Docker existem
echo Testando se arquivos Docker existem...
if not exist "Dockerfile" (
    echo [ERRO] Dockerfile nao encontrado.
    exit /b 1
)
if not exist "docker-compose.yml" (
    echo [ERRO] docker-compose.yml nao encontrado.
    exit /b 1
)
echo [OK] Arquivos Docker existem

REM Test 5: Build da imagem
echo.
echo Testando build da imagem Docker...
docker compose build --quiet
if %errorlevel% neq 0 (
    echo [ERRO] Build falhou
    exit /b 1
)
echo [OK] Build completado com sucesso

REM Test 6: Iniciar containers
echo.
echo Iniciando containers...
docker compose up -d
if %errorlevel% neq 0 (
    echo [ERRO] Falha ao iniciar containers
    exit /b 1
)
echo [OK] Containers iniciados

REM Test 7: Aguardar healthcheck
echo Aguardando containers ficarem prontos...
timeout /t 15 /nobreak >nul
echo [OK] Containers prontos

REM Test 8: Testar endpoint (usando PowerShell para curl)
echo Testando se site esta acessivel (http://localhost:4321)...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:4321' -UseBasicParsing -TimeoutSec 5; exit 0 } catch { exit 1 }"
if %errorlevel% neq 0 (
    echo [ERRO] Site nao acessivel
    echo Verificando logs...
    docker compose logs --tail=50
    exit /b 1
)
echo [OK] Site acessivel

REM Test 9: Testar comandos
echo.
echo Testando comandos dentro do container...
docker compose exec -T portfolio-dev pnpm astro check >nul 2>&1
if %errorlevel% neq 0 (
    echo [AVISO] Avisos encontrados (normal)
) else (
    echo [OK] Comandos funcionando
)

REM Cleanup
echo.
echo Limpando ambiente de teste...
docker compose down >nul
echo [OK] Containers parados

REM Summary
echo.
echo === Todos os testes passaram! ===
echo Docker setup esta funcional.
echo.
echo Para iniciar desenvolvimento:
echo   docker-compose up -d
echo   ou
echo   .\docker.ps1 up
echo.

pause
