#!/usr/bin/env bash
# Idempotently start the Docker daemon and wait until it is ready.
# Safe to call from both install.sh and start.sh.
set -euo pipefail

log() { printf '\n\033[1;32m[docker]\033[0m %s\n' "$*"; }

if docker info >/dev/null 2>&1; then
  log "Docker daemon already running"
  exit 0
fi

log "Starting dockerd"
sudo mkdir -p /var/log
sudo nohup dockerd >/var/log/dockerd.log 2>&1 &
disown || true

log "Waiting for the Docker daemon to become ready"
for _ in $(seq 1 60); do
  if sudo docker info >/dev/null 2>&1; then
    # Make the socket usable by the current (non-root) user for this boot.
    sudo chmod 666 /var/run/docker.sock 2>/dev/null || true
    log "Docker daemon is ready"
    exit 0
  fi
  sleep 1
done

log "ERROR: Docker daemon did not become ready in time"
sudo tail -n 40 /var/log/dockerd.log || true
exit 1
