# Monitoring Setup Guide

## Start Services

### Option A: Using Make (recommended)
```bash
cd infra
make up
```

### Option B: Manual
```bash
# Terminal 1: Monitoring
cd infra/monitoring
docker-compose up -d

# Terminal 2: Logging
cd infra/logging
docker-compose up -d
```

---

## Configure Grafana

### Initial Access
- **URL**: http://localhost:3000
- **User**: admin
- **Password**: admin123

### Add Prometheus Data Source

1. Go to **Connections** → **Data Sources**
2. Click **Add data source**
3. Select **Prometheus**
4. **URL**: `http://prometheus:9090`
5. Click **Save & Test**

### Create Your First Dashboard

1. Click **+ Create** → **Dashboard**
2. Click **Add visualization**
3. **Query**: `rate(http_requests_total[5m])`
4. **Title**: "Requests per Second"
5. **Save**

---

## Useful Queries

Copy and paste in Grafana:

### Traffic
```promql
rate(http_requests_total[5m])
```

### Latency
```promql
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))
```

### Errors
```promql
rate(errors_total[5m])
```

### Memory
```promql
process_resident_memory_bytes / 1024 / 1024
```

### CPU
```promql
rate(process_cpu_seconds_total[5m]) * 100
```

### Top Routes
```promql
topk(10, sum by (route) (rate(http_requests_total[5m])))
```

---

## Alerts

Alerts are configured in `prometheus/alerts.yml`:

- Error rate > 5%
- Latency P95 > 1s
- Memory > 500MB
- CPU > 80%
- Backend down

View alerts at: http://localhost:9090/alerts

---

## Logging with Kibana

- **URL**: http://localhost:5601
- Logs are collected from Filebeat
- Search by timestamp, app, severity, etc.

---

## Useful Commands

```bash
# View status
make status

# Restart
make restart

# View logs
make monitor-logs
make logs-view

# Clean everything
make clean
```

---

## Metrics Structure

Your backend automatically exports:

```
http_requests_total         -> request counter
http_request_duration_seconds -> latency histogram
errors_total                -> error counter
process_resident_memory_bytes -> memory used
process_cpu_seconds_total   -> CPU consumed
```

More at: http://localhost:3003/metrics

---

## Next Steps

- [ ] Create custom dashboard
- [ ] Configure webhooks for alerts
- [ ] Add database metrics
- [ ] Create SLAs

---

**¡Todo listo! 🚀**
