# -----------------------------------
# TaskFlow Infrastructure
# Monitoring: Prometheus + Grafana
# Logging: Elasticsearch + Logstash + Kibana
# -----------------------------------

# Variables
MONITORING_DIR=monitoring
LOGGING_DIR=logging

# -----------------------------------
# 1. MONITORING (Prometheus + Grafana)
# -----------------------------------

# Start monitoring stack
# Prometheus port: 9090
# Grafana port: 3000 (admin/admin123)
# -----------------------------------

monitor-up: ## Start Prometheus + Grafana
	@echo 'Starting monitoring stack...'
	cd $(MONITORING_DIR) && docker-compose up -d
	@echo 'Prometheus: http://localhost:9090'
	@echo 'Grafana: http://localhost:3000'

monitor-down: ## Stop monitoring services
	@echo 'Stopping Prometheus + Grafana...'
	cd $(MONITORING_DIR) && docker-compose down

monitor-logs: ## View monitoring logs
	cd $(MONITORING_DIR) && docker-compose logs -f

monitor-ps: ## Monitoring services status
	cd $(MONITORING_DIR) && docker-compose ps

monitor-restart: ## Restart monitoring services
	@echo 'Restarting monitoring...'
	$(MAKE) monitor-down
	$(MAKE) monitor-up

# -----------------------------------
# 2. LOGGING (ELK Stack)
# -----------------------------------

# Start ELK Stack
# Elasticsearch: 9200
# Kibana: 5601
# Logstash: 5044
# -----------------------------------

logs-up: ## Start Elasticsearch + Logstash + Kibana
	@echo 'Starting ELK Stack...'
	cd $(LOGGING_DIR) && docker-compose up -d
	@echo 'Kibana: http://localhost:5601'

logs-down: ## Stop ELK services
	@echo 'Stopping ELK Stack...'
	cd $(LOGGING_DIR) && docker-compose down

logs-view: ## View ELK logs
	cd $(LOGGING_DIR) && docker-compose logs -f

logs-ps: ## ELK services status
	cd $(LOGGING_DIR) && docker-compose ps

logs-restart: ## Restart ELK services
	@echo 'Restarting logging...'
	$(MAKE) logs-down
	$(MAKE) logs-up

# -----------------------------------
# 3. COMBINED OPERATIONS
# -----------------------------------

# Commands that apply to entire infrastructure

up: ## Start all infrastructure
	@echo 'Starting TaskFlow Infrastructure...'
	$(MAKE) monitor-up
	$(MAKE) logs-up
	@echo 'All infrastructure started'

down: ## Stop all infrastructure
	@echo 'Stopping TaskFlow Infrastructure...'
	$(MAKE) monitor-down
	$(MAKE) logs-down
	@echo 'All infrastructure stopped'

restart: ## Restart all infrastructure
	@echo 'Restarting TaskFlow Infrastructure...'
	$(MAKE) down
	$(MAKE) up

status: ## Show all services status
	@echo 'Monitoring Status:'
	$(MAKE) monitor-ps
	@echo ''
	@echo 'Logging Status:'
	$(MAKE) logs-ps

clean: ## Remove volumes (warning!)
	@echo 'Removing volumes...'
	cd $(MONITORING_DIR) && docker-compose down -v
	cd $(LOGGING_DIR) && docker-compose down -v
	@echo 'Cleaned'

prune: ## Clean unused Docker resources
	@echo 'Cleaning Docker...'
	docker system prune -f
	@echo 'Docker cleaned'

# -----------------------------------
# HELP
# -----------------------------------

.PHONY: help
help: ## Display this help message
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/\\$$//' -e 's/##/ →/'

	@echo ""
	@echo "Monitoring (Prometheus + Grafana):"
	@echo "  make monitor-up        Start monitoring stack"
	@echo "  make monitor-down      Stop monitoring stack"
	@echo "  make monitor-logs      View monitoring logs"
	@echo ""
	@echo "Logging (ELK Stack):"
	@echo "  make logs-up           Start logging stack"
	@echo "  make logs-down         Stop logging stack"
	@echo "  make logs-view         View logging logs"
	@echo ""
	@echo "Combined:"
	@echo "  make up                Start all infrastructure"
	@echo "  make down              Stop all infrastructure"
	@echo "  make restart           Restart all infrastructure"
	@echo "  make status            Show all services status"
	@echo "  make clean             Remove volumes (careful!)"

# Monitoring
monitor-up:
	@echo "Starting monitoring stack..."
	cd monitoring && docker-compose up -d
	@echo "Prometheus: http://localhost:9090"
	@echo "Grafana: http://localhost:3000 (admin/admin123)"

monitor-down:
	cd monitoring && docker-compose down

monitor-logs:
	cd monitoring && docker-compose logs -f

monitor-ps:
	cd monitoring && docker-compose ps

# Logging
logs-up:
	@echo "Starting logging stack..."
	cd logging && docker-compose up -d
	@echo "Kibana: http://localhost:5601"

logs-down:
	cd logging && docker-compose down

logs-view:
	cd logging && docker-compose logs -f

logs-ps:
	cd logging && docker-compose ps

# Combined
up: monitor-up logs-up
	@echo "All infrastructure started"

down: monitor-down logs-down
	@echo "All infrastructure stopped"

restart: down up
	@echo "All infrastructure restarted"

status: monitor-ps logs-ps
	@echo "Status check complete"

clean:
	@echo "Removing all volumes..."
	cd monitoring && docker-compose down -v
	cd logging && docker-compose down -v
	@echo "Cleaned"

prune:
	docker system prune -f
	@echo "Pruned unused Docker resources"
