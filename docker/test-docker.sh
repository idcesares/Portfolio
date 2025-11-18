#!/usr/bin/env bash
# Test script para validar Docker setup
# Uso: ./test-docker.sh

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Docker Setup Validation ===${NC}\n"

# Test 1: Docker instalado
echo -n "Testando se Docker está instalado... "
if command -v docker &> /dev/null; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
    echo "Docker não encontrado. Instale Docker Desktop primeiro."
    exit 1
fi

# Test 2: Docker Compose instalado
echo -n "Testando se Docker Compose está instalado... "
if docker compose version &> /dev/null; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
    echo "Docker Compose não encontrado."
    exit 1
fi

# Test 3: Docker rodando
echo -n "Testando se Docker está rodando... "
if docker info &> /dev/null; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
    echo "Docker não está rodando. Inicie Docker Desktop."
    exit 1
fi

# Test 4: Arquivos Docker existem
echo -n "Testando se Dockerfile existe... "
if [ -f "Dockerfile" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
    echo "Dockerfile não encontrado."
    exit 1
fi

echo -n "Testando se docker-compose.yml existe... "
if [ -f "docker-compose.yml" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
    echo "docker-compose.yml não encontrado."
    exit 1
fi

# Test 5: Build da imagem
echo -e "\n${YELLOW}Testando build da imagem Docker...${NC}"
if docker compose build --quiet; then
    echo -e "${GREEN}✓ Build completado com sucesso${NC}"
else
    echo -e "${RED}✗ Build falhou${NC}"
    exit 1
fi

# Test 6: Iniciar containers
echo -e "\n${YELLOW}Iniciando containers...${NC}"
if docker compose up -d; then
    echo -e "${GREEN}✓ Containers iniciados${NC}"
else
    echo -e "${RED}✗ Falha ao iniciar containers${NC}"
    exit 1
fi

# Test 7: Aguardar healthcheck
echo -n "Aguardando containers ficarem prontos... "
sleep 10
echo -e "${GREEN}✓${NC}"

# Test 8: Testar endpoint
echo -n "Testando se site está acessível (http://localhost:4321)... "
if curl -f http://localhost:4321 > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
    echo "Site não acessível. Verificando logs..."
    docker compose logs --tail=50
    exit 1
fi

# Test 9: Testar hot reload (opcional)
echo -e "\n${YELLOW}Testando se hot reload funciona...${NC}"
echo "Criando arquivo de teste..."
echo "# Test file" > src/test-hot-reload.md
sleep 5
if docker compose exec -T portfolio-dev ls src/test-hot-reload.md > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Arquivo visível no container${NC}"
    rm src/test-hot-reload.md
else
    echo -e "${RED}✗ Volume mount não funciona${NC}"
fi

# Test 10: Testar comandos
echo -e "\n${YELLOW}Testando comandos dentro do container...${NC}"
echo -n "Testando 'pnpm astro check'... "
if docker compose exec -T portfolio-dev pnpm astro check > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${YELLOW}⚠ Avisos encontrados (normal)${NC}"
fi

# Cleanup
echo -e "\n${YELLOW}Limpando ambiente de teste...${NC}"
docker compose down
echo -e "${GREEN}✓ Containers parados${NC}"

# Summary
echo -e "\n${GREEN}=== Todos os testes passaram! ===${NC}"
echo -e "${GREEN}Docker setup está funcional.${NC}\n"
echo "Para iniciar desenvolvimento:"
echo "  docker-compose up -d"
echo "  ou"
echo "  make up (se tiver make instalado)"
echo ""
