# Docker Helper Script para Portfolio dcesares.dev
# Uso: .\docker.ps1 [comando]

param(
    [Parameter(Position=0)]
    [ValidateSet('up', 'down', 'build', 'logs', 'restart', 'clean', 'prod', 'check', 'shell', 'help')]
    [string]$Command = 'help'
)

function Show-Help {
    Write-Host "`nDocker Helper para Portfolio dcesares.dev" -ForegroundColor Cyan
    Write-Host "==========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Comandos disponíveis:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  up        " -ForegroundColor Green -NoNewline
    Write-Host "  Inicia o ambiente de desenvolvimento"
    Write-Host "  down      " -ForegroundColor Green -NoNewline
    Write-Host "  Para todos os containers"
    Write-Host "  build     " -ForegroundColor Green -NoNewline
    Write-Host "  Rebuild da imagem Docker"
    Write-Host "  logs      " -ForegroundColor Green -NoNewline
    Write-Host "  Mostra logs em tempo real"
    Write-Host "  restart   " -ForegroundColor Green -NoNewline
    Write-Host "  Reinicia os containers"
    Write-Host "  clean     " -ForegroundColor Green -NoNewline
    Write-Host "  Remove containers, volumes e imagens"
    Write-Host "  prod      " -ForegroundColor Green -NoNewline
    Write-Host "  Inicia preview de produção"
    Write-Host "  check     " -ForegroundColor Green -NoNewline
    Write-Host "  Executa astro check no container"
    Write-Host "  shell     " -ForegroundColor Green -NoNewline
    Write-Host "  Abre shell dentro do container"
    Write-Host "  help      " -ForegroundColor Green -NoNewline
    Write-Host "  Mostra esta ajuda"
    Write-Host ""
    Write-Host "Exemplos:" -ForegroundColor Yellow
    Write-Host "  .\docker.ps1 up       # Inicia desenvolvimento"
    Write-Host "  .\docker.ps1 logs     # Ver logs"
    Write-Host "  .\docker.ps1 check    # Validar TypeScript"
    Write-Host ""
}

function Start-Dev {
    Write-Host "Iniciando ambiente de desenvolvimento..." -ForegroundColor Green
    docker-compose up -d
    Write-Host ""
    Write-Host "✓ Container iniciado!" -ForegroundColor Green
    Write-Host "✓ Acesse: " -ForegroundColor Green -NoNewline
    Write-Host "http://localhost:4321" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Use '.\docker.ps1 logs' para ver os logs" -ForegroundColor Yellow
}

function Stop-Dev {
    Write-Host "Parando containers..." -ForegroundColor Yellow
    docker-compose down
    Write-Host "✓ Containers parados!" -ForegroundColor Green
}

function Build-Image {
    Write-Host "Rebuilding imagem Docker..." -ForegroundColor Yellow
    docker-compose build --no-cache
    Write-Host "✓ Build completo!" -ForegroundColor Green
}

function Show-Logs {
    Write-Host "Mostrando logs (Ctrl+C para sair)..." -ForegroundColor Yellow
    docker-compose logs -f
}

function Restart-Dev {
    Write-Host "Reiniciando containers..." -ForegroundColor Yellow
    docker-compose restart
    Write-Host "✓ Containers reiniciados!" -ForegroundColor Green
}

function Clean-All {
    Write-Host "ATENÇÃO: Isso irá remover containers, volumes e imagens!" -ForegroundColor Red
    $confirm = Read-Host "Confirmar? (s/n)"
    if ($confirm -eq 's' -or $confirm -eq 'S') {
        Write-Host "Limpando tudo..." -ForegroundColor Yellow
        docker-compose down -v --rmi all
        Write-Host "✓ Limpeza completa!" -ForegroundColor Green
    } else {
        Write-Host "Cancelado." -ForegroundColor Yellow
    }
}

function Start-Prod {
    Write-Host "Iniciando preview de produção..." -ForegroundColor Green
    docker-compose -f docker-compose.prod.yml up --build
}

function Run-Check {
    Write-Host "Executando astro check..." -ForegroundColor Yellow
    docker-compose exec portfolio-dev pnpm astro check
}

function Open-Shell {
    Write-Host "Abrindo shell no container..." -ForegroundColor Green
    docker-compose exec portfolio-dev sh
}

# Main logic
switch ($Command) {
    'up'      { Start-Dev }
    'down'    { Stop-Dev }
    'build'   { Build-Image }
    'logs'    { Show-Logs }
    'restart' { Restart-Dev }
    'clean'   { Clean-All }
    'prod'    { Start-Prod }
    'check'   { Run-Check }
    'shell'   { Open-Shell }
    'help'    { Show-Help }
    default   { Show-Help }
}
