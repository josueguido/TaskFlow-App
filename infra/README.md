# TaskFlow - Infrastructure

Complete observability and deployment infrastructure for TaskFlow: metrics, dashboards, alerting, and centralized logging.

> **Note:** In a production GitOps setup, `k8s/` and `terraform/` would live in a dedicated infra repository. They are co-located here for portfolio clarity.

---

## Architecture

```
infra/
├── k8s/                         # Kubernetes + Kustomize (base + overlays)
│   ├── base/
│   │   ├── namespaces/          # taskflow-app + observability namespaces
│   │   ├── apps/                # backend + frontend deployments/services
│   │   ├── data/                # redis + postgres stateful workloads
│   │   └── observability/       # prometheus + grafana manifests
│   └── overlays/
│       ├── dev/                 # local/minikube-focused overrides
│       ├── staging/             # pre-prod overrides
│       └── prod/                # production overrides
│
├── monitoring/                  # Prometheus + Grafana + Alertmanager
│   ├── docker-compose.yml
│   ├── prometheus/
│   │   └── prometheus.yml       # Scrape config + alerting rules
│   ├── grafana/
│   │   └── provisioning/
│   │       ├── datasources/     # Auto-provisioned Prometheus datasource
│   │       └── dashboards/      # Auto-provisioned TaskFlow dashboard
│   └── alertmanager/
│       └── alertmanager.yml     # Routing: warnings→Discord, critical→Discord+Slack
│
└── logging/                     # ELK Stack
    ├── docker-compose.yml
    ├── logstash/
    │   └── pipeline/
    └── filebeat/
```

---

## Services

| Service | Port | Purpose |
|---------|------|---------|
| Prometheus | `9090` | Metrics collection (scrapes every 15s) |
| Grafana | `3000` | Dashboards + alert visualization |
| Alertmanager | `9093` | Alert routing to Discord & Slack |
| Elasticsearch | `9200` | Log indexing and search |
| Kibana | `5601` | Log visualization |
| Logstash | `5044` | Log processing from Filebeat |

---

## Quick Start

All commands from the **project root**:

```bash
make build_monitoring   # Start Prometheus + Grafana + Alertmanager
make build_logging      # Start ELK stack
make start_all          # Start everything (App + Monitoring + Logging)
```

### Manual start

```bash
# Monitoring (requires .env at project root for webhook secrets)
cd infra/monitoring
docker compose --env-file ../../.env up -d

# Logging
cd infra/logging
docker compose up -d
```

---

## Kubernetes (Kustomize)

All commands from project root.

### Render manifests

```bash
kubectl kustomize infra/k8s/base
kubectl kustomize infra/k8s/overlays/dev
kubectl kustomize infra/k8s/overlays/staging
kubectl kustomize infra/k8s/overlays/prod
```

### Deploy by environment

```bash
kubectl apply -k infra/k8s/overlays/dev
# or
kubectl apply -k infra/k8s/overlays/staging
kubectl apply -k infra/k8s/overlays/prod
```

### Overlay intent

- `dev`: reproducible images via `sha-<commit>` tags + local storage class compatibility patches
- `staging`: semver image tags and environment-tuned resources
- `prod`: semver image tags and production resource profile

### CI/CD interaction

- `publish-main-images.yml` publishes `latest` and `sha-<commit>` tags on `main` (for dev flow)
- `release.yml` publishes semantic tags only (for stable production flow)

---

## Grafana — Auto-Provisioning

Grafana starts with everything pre-configured — no manual setup needed:

- **Datasource**: Prometheus auto-provisioned via `grafana/provisioning/datasources/prometheus.yml`
- **Dashboard**: TaskFlow dashboard auto-loaded via `grafana/provisioning/dashboards/`

Default credentials: `admin` / value of `GRAFANA_ADMIN_PASSWORD` in `.env`

### Dashboard panels

| Panel | Query |
|-------|-------|
| Requests/sec | `rate(http_requests_total[5m])` |
| Error Rate | `rate(errors_total[5m])` |
| Latency P95 | `histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))` |
| Heap Memory | `process_heap_bytes / 1024 / 1024` |
| CPU Usage | `rate(process_cpu_seconds_total[5m]) * 100` |
| DB Connections | `db_active_connections` |
| Authenticated Users | `authenticated_users_total` |
| Tasks Created | `tasks_created_total` |

---

## Alertmanager — Alert Routing

Alerts are routed based on severity label:

| Severity | Channel |
|----------|---------|
| `warning` | Discord (`DISCORD_WEBHOOK_URL_WARNINGS`) |
| `critical` | Discord (`DISCORD_WEBHOOK_URL_CRITICAL`) + Slack (`SLACK_WEBHOOK_URL_CRITICAL`) |

Webhook URLs are injected at runtime via `envsubst` (Alpine init container) — never hardcoded in config files. Set them in your `.env`:

```env
DISCORD_WEBHOOK_URL_WARNINGS=https://discord.com/api/webhooks/...
DISCORD_WEBHOOK_URL_CRITICAL=https://discord.com/api/webhooks/...
SLACK_WEBHOOK_URL_CRITICAL=https://hooks.slack.com/services/...
```

---

## Custom Metrics (Backend)

The backend exposes custom Prometheus metrics at `GET /metrics`:

| Metric | Type | Description |
|--------|------|-------------|
| `http_requests_total` | Counter | Total HTTP requests by method/route/status |
| `http_request_duration_seconds` | Histogram | Request latency |
| `errors_total` | Counter | Application errors |
| `authenticated_users_total` | Gauge | Currently logged-in users |
| `tasks_created_total` | Counter | Tasks created, labeled by project |
| `db_active_connections` | Gauge | Active PostgreSQL pool connections |

---

## Useful Commands

```bash
make build_monitoring    # Start Prometheus + Grafana + Alertmanager
make stop_monitoring     # Stop monitoring
make restart_monitoring  # Restart monitoring
make show_monitoring     # View monitoring status
make logs_monitoring     # View monitoring logs

make build_logging       # Start ELK stack
make stop_logging        # Stop ELK stack
make show_logging        # View logging status
make logs_logging        # View logging logs

make start_all           # Start everything
make stop_all            # Stop everything
make help                # View all targets
```

---

## Access Points

| Service | URL |
|---------|-----|
| Grafana | http://localhost:3000 |
| Prometheus | http://localhost:9090 |
| Alertmanager | http://localhost:9093 |
| Kibana | http://localhost:5601 |
| Backend metrics | http://localhost:3003/metrics |

---

**Security note:** Always rotate default credentials and webhook URLs before any non-local deployment. Use environment-specific `.env` files — see `.env.staging.example` and `.env.production.example` at the project root.
