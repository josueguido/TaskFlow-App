#!/bin/sh
set -e

awk '{
  line = $0
  for (k in ENVIRON) {
    gsub("\\$\\{" k "\\}", ENVIRON[k], line)
  }
  print line
}' /etc/alertmanager/alertmanager.tmpl > /etc/alertmanager/alertmanager.yml

exec alertmanager --config.file=/etc/alertmanager/alertmanager.yml "$@"
