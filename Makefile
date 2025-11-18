# Makefile para Portfolio dcesares.dev
# Suporta Windows (via make.exe), Linux e macOS

.PHONY: help up down build logs restart clean prod check shell install test

# Default target
.DEFAULT_GOAL := help

# Colors para output (funciona em terminais compatíveis)
CYAN := \033[0;36m
GREEN := \033[0;32m
YELLOW := \033[0;33m
NC := \033[0m # No Color

help: ## Mostra esta mensagem de ajuda
	@echo "$(CYAN)Docker Commands para Portfolio dcesares.dev$(NC)"
	@echo "=============================================="
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-12s$(NC) %s\n", $$1, $$2}'
	@echo ""

up: ## Inicia ambiente de desenvolvimento
	@echo "$(GREEN)Iniciando ambiente de desenvolvimento...$(NC)"
	docker-compose up -d
	@echo "$(GREEN)✓ Containers iniciados!$(NC)"
	@echo "$(GREEN)✓ Acesse: http://localhost:4321$(NC)"

down: ## Para todos os containers
	@echo "$(YELLOW)Parando containers...$(NC)"
	docker-compose down
	@echo "$(GREEN)✓ Containers parados!$(NC)"

build: ## Rebuild da imagem Docker
	@echo "$(YELLOW)Rebuilding imagem Docker...$(NC)"
	docker-compose build --no-cache
	@echo "$(GREEN)✓ Build completo!$(NC)"

logs: ## Mostra logs em tempo real
	@echo "$(YELLOW)Mostrando logs (Ctrl+C para sair)...$(NC)"
	docker-compose logs -f

restart: ## Reinicia containers
	@echo "$(YELLOW)Reiniciando containers...$(NC)"
	docker-compose restart
	@echo "$(GREEN)✓ Containers reiniciados!$(NC)"

clean: ## Remove containers, volumes e imagens
	@echo "$(YELLOW)Limpando tudo...$(NC)"
	docker-compose down -v --rmi all
	@echo "$(GREEN)✓ Limpeza completa!$(NC)"

prod: ## Inicia preview de produção
	@echo "$(GREEN)Iniciando preview de produção...$(NC)"
	docker-compose -f docker-compose.prod.yml up --build

check: ## Executa astro check no container
	@echo "$(YELLOW)Executando astro check...$(NC)"
	docker-compose exec portfolio-dev pnpm astro check

shell: ## Abre shell dentro do container
	@echo "$(GREEN)Abrindo shell no container...$(NC)"
	docker-compose exec portfolio-dev sh

install: ## Instala nova dependência (use: make install PKG=nome-pacote)
	@echo "$(YELLOW)Instalando $(PKG)...$(NC)"
	docker-compose exec portfolio-dev pnpm add $(PKG)

test: ## Testa se containers estão rodando
	@echo "$(YELLOW)Testando containers...$(NC)"
	@docker-compose ps
	@echo ""
	@echo "$(YELLOW)Testando endpoint...$(NC)"
	@curl -f http://localhost:4321 > /dev/null 2>&1 && echo "$(GREEN)✓ Site acessível!$(NC)" || echo "$(YELLOW)⚠ Site não acessível. Execute 'make up' primeiro.$(NC)"
