FROM alpine:latest AS builder
COPY filebeat.yml /filebeat.yml.tmp
RUN install -m 0600 /filebeat.yml.tmp /filebeat.yml
RUN rm /filebeat.yml.tmp

FROM docker.elastic.co/beats/filebeat:9.3.1
COPY --chown=root:root --chmod=0600 --from=builder /filebeat.yml /usr/share/filebeat/filebeat.yml
