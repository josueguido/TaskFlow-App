# ============================================
# TaskFlow - Project Makefile
# ============================================
# App:        DB + Backend + Frontend + pgAdmin
# Monitoring: Prometheus + Grafana
# Logging:    Elasticsearch + Logstash + Kibana
# ============================================
# Usage: make <target>
# ============================================

# -----------------------------------
# Variables
# -----------------------------------
MONITORING_DIR  = infra/monitoring
LOGGING_DIR     = infra/logging
COMPOSE         = docker-compose

.PHONY: build_app start_app stop_app restart_app delete_app show_app logs_app \
        build_monitoring stop_monitoring delete_monitoring restart_monitoring show_monitoring logs_monitoring \
        build_logging stop_logging delete_logging restart_logging show_logging logs_logging \
        start_all stop_all restart_all delete_all show_all \
        clean prune help

# ============================================
# 1. APP (DB + Backend + Frontend + pgAdmin)
# ============================================
# Frontend: http://localhost:5173
# Backend:  http://localhost:3003
# pgAdmin:  http://localhost:8080
# ============================================

build_app: ## Build and start the application stack
	@echo 'Building app containers...'
	$(COMPOSE) build
	@echo 'Starting app stack...'
	$(COMPOSE) up -d
	@echo 'App stack is running'
	@echo '  Frontend: http://localhost:5173'
	@echo '  Backend:  http://localhost:3003'
	@echo '  pgAdmin:  http://localhost:8080'

start_app: ## Start the application stack (no rebuild)
	@echo 'Starting app stack...'
	$(COMPOSE) up -d

stop_app: ## Stop the application stack
	@echo 'Stopping app stack...'
	$(COMPOSE) stop

restart_app: ## Restart the application stack
	@echo 'Restarting app stack...'
	$(MAKE) stop_app
	$(MAKE) start_app

delete_app: ## Remove app containers and networks
	@echo 'Removing app containers...'
	$(COMPOSE) down
	@echo 'App stack removed'

show_app: ## Show app services status
	@echo '--- App Services ---'
	$(COMPOSE) ps

logs_app: ## View app logs (follow mode)
	$(COMPOSE) logs -f

# ============================================
# 2. MONITORING (Prometheus + Grafana)
# ============================================
# Prometheus: http://localhost:9090
# Grafana:    http://localhost:3000
# ============================================

build_monitoring: ## Build and start monitoring stack
	@echo 'Starting monitoring stack...'
	cd $(MONITORING_DIR) && $(COMPOSE) up -d
	@echo 'Monitoring is running'
	@echo '  Prometheus: http://localhost:9090'
	@echo '  Grafana:    http://localhost:3000'

stop_monitoring: ## Stop monitoring services
	@echo 'Stopping monitoring...'
	cd $(MONITORING_DIR) && $(COMPOSE) stop

delete_monitoring: ## Remove monitoring containers
	@echo 'Removing monitoring containers...'
	cd $(MONITORING_DIR) && $(COMPOSE) down

restart_monitoring: ## Restart monitoring services
	@echo 'Restarting monitoring...'
	$(MAKE) stop_monitoring
	$(MAKE) build_monitoring

show_monitoring: ## Show monitoring services status
	@echo '--- Monitoring Services ---'
	cd $(MONITORING_DIR) && $(COMPOSE) ps

logs_monitoring: ## View monitoring logs (follow mode)
	cd $(MONITORING_DIR) && $(COMPOSE) logs -f

# ============================================
# 3. LOGGING (ELK Stack)
# ============================================
# Elasticsearch: http://localhost:9200
# Kibana:        http://localhost:5601
# Logstash:      :5044
# ============================================

build_logging: ## Build and start ELK stack
	@echo 'Starting ELK stack...'
	cd $(LOGGING_DIR) && $(COMPOSE) up -d
	@echo 'ELK stack is running'
	@echo '  Kibana: http://localhost:5601'

stop_logging: ## Stop ELK services
	@echo 'Stopping ELK stack...'
	cd $(LOGGING_DIR) && $(COMPOSE) stop

delete_logging: ## Remove ELK containers
	@echo 'Removing ELK containers...'
	cd $(LOGGING_DIR) && $(COMPOSE) down

restart_logging: ## Restart ELK services
	@echo 'Restarting ELK stack...'
	$(MAKE) stop_logging
	$(MAKE) build_logging

show_logging: ## Show ELK services status
	@echo '--- Logging Services ---'
	cd $(LOGGING_DIR) && $(COMPOSE) ps

logs_logging: ## View ELK logs (follow mode)
	cd $(LOGGING_DIR) && $(COMPOSE) logs -f

# ============================================
# 4. FULL STACK (App + Monitoring + Logging)
# ============================================

start_all: ## Start all services (App + Monitoring + Logging)
	@echo '========================================='
	@echo '  Starting Full TaskFlow Stack'
	@echo '========================================='
	$(MAKE) build_app
	$(MAKE) build_monitoring
	$(MAKE) build_logging
	@echo '========================================='
	@echo '  All services are running!'
	@echo '  Frontend:      http://localhost:5173'
	@echo '  Backend:       http://localhost:3003'
	@echo '  pgAdmin:       http://localhost:8080'
	@echo '  Prometheus:    http://localhost:9090'
	@echo '  Grafana:       http://localhost:3000'
	@echo '  Kibana:        http://localhost:5601'
	@echo '========================================='

stop_all: ## Stop all services
	@echo 'Stopping all services...'
	$(MAKE) stop_logging
	$(MAKE) stop_monitoring
	$(MAKE) stop_app
	@echo 'All services stopped'

restart_all: ## Restart all services
	@echo 'Restarting all services...'
	$(MAKE) stop_all
	$(MAKE) start_all

delete_all: ## Remove all containers and networks
	@echo 'Removing all containers...'
	$(MAKE) delete_logging
	$(MAKE) delete_monitoring
	$(MAKE) delete_app
	@echo 'All containers removed'

show_all: ## Show status of all services
	$(MAKE) show_app
	@echo ''
	$(MAKE) show_monitoring
	@echo ''
	$(MAKE) show_logging

# ============================================
# 5. MAINTENANCE
# ============================================

clean: ## Remove all containers and volumes (WARNING: data loss!)
	@echo 'Removing all containers and volumes...'
	$(COMPOSE) down -v
	cd $(MONITORING_DIR) && $(COMPOSE) down -v
	cd $(LOGGING_DIR) && $(COMPOSE) down -v
	@echo 'All containers and volumes removed'

prune: ## Clean unused Docker resources
	@echo 'Pruning unused Docker resources...'
	docker system prune -f
	@echo 'Docker cleanup complete'

# ============================================
# HELP
# ============================================

help: ## Display this help message
	@echo ''
	@echo 'TaskFlow - Available Commands'
	@echo '============================================='
	@echo ''
	@echo 'App (DB + Backend + Frontend):'
	@echo '  make build_app          Build and start app stack'
	@echo '  make start_app          Start app (no rebuild)'
	@echo '  make stop_app           Stop app services'
	@echo '  make restart_app        Restart app services'
	@echo '  make delete_app         Remove app containers'
	@echo '  make show_app           Show app status'
	@echo '  make logs_app           View app logs'
	@echo ''
	@echo 'Monitoring (Prometheus + Grafana):'
	@echo '  make build_monitoring   Start monitoring stack'
	@echo '  make stop_monitoring    Stop monitoring'
	@echo '  make restart_monitoring Restart monitoring'
	@echo '  make delete_monitoring  Remove monitoring containers'
	@echo '  make show_monitoring    Show monitoring status'
	@echo '  make logs_monitoring    View monitoring logs'
	@echo ''
	@echo 'Logging (ELK Stack):'
	@echo '  make build_logging      Start ELK stack'
	@echo '  make stop_logging       Stop ELK services'
	@echo '  make restart_logging    Restart ELK services'
	@echo '  make delete_logging     Remove ELK containers'
	@echo '  make show_logging       Show ELK status'
	@echo '  make logs_logging       View ELK logs'
	@echo ''
	@echo 'Full Stack:'
	@echo '  make start_all          Start everything'
	@echo '  make stop_all           Stop everything'
	@echo '  make restart_all        Restart everything'
	@echo '  make delete_all         Remove all containers'
	@echo '  make show_all           Show all status'
	@echo ''
	@echo 'Maintenance:'
	@echo '  make clean              Remove containers + volumes'
	@echo '  make prune              Clean unused Docker resources'
	@echo ''
