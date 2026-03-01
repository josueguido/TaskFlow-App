# TaskFlow - Infrastructure & Monitoring

Complete observability stack for TaskFlow: logs, metrics, and dashboards.

## Architecture

### Monitoring (Prometheus + Grafana)
- **Prometheus**: Scrapes metrics every 15s
- **Grafana**: Interactive dashboards and alerts
- Prometheus port: `9090`
- Grafana port: `3000` (admin/admin123)

### Logging (ELK Stack)
- **Elasticsearch**: Log indexing and search
- **Logstash**: Log processing from Filebeat
- **Kibana**: Log visualization
- Kibana port: `5601`

---

## Quick Start

### 1. Start Monitoring
```bash
cd infra/monitoring
docker-compose up -d
```
Access: http://localhost:3000 and http://localhost:9090

### 2. Start Logging (ELK)
```bash
cd infra/logging
docker-compose up -d
```
Access: http://localhost:5601

### 3. Backend must run on port 3003
```bash
cd backend
npm run dev
```

---

## Grafana Dashboards

### Available automatic metrics:

**HTTP Requests**
```promql
rate(http_requests_total[5m])
```

**Latency P95**
```promql
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))
```

**Memory Usage**
```promql
process_resident_memory_bytes / 1024 / 1024
```

**CPU Usage**
```promql
rate(process_cpu_seconds_total[5m]) * 100
```

**Error Rate**
```promql
rate(errors_total[5m])
```

---

## Recommended Alerts

Create alerts in Prometheus for:
- Error rate > 5%
- Latency P95 > 1s
- Memory > 500MB
- CPU > 80%

---

## Directory Structure

```
infra/
├── monitoring/          # Prometheus + Grafana
│   ├── docker-compose.yml
│   ├── prometheus/
│   │   └── prometheus.yml
│   ├── grafana/         # (optional configs)
│   └── .env
│
├── logging/             # ELK Stack
│   ├── docker-compose.yml
│   ├── logstash/
│   │   └── pipeline/
│   ├── filebeat/
│   └── .env
│
└── Makefile/            # Useful commands
```

---

## Useful Commands

```bash
# View logs
docker logs prometheus
docker logs grafana

# Restart services
docker-compose restart

# Clean volumes
docker-compose down -v

# View status
docker ps
```

---

## Links

- Grafana: http://localhost:3000
- Prometheus: http://localhost:9090
- Kibana: http://localhost:5601
- Backend API: http://localhost:3003

---

**Tip**: For production, change credentials in `.env` and use secure environment variables.
