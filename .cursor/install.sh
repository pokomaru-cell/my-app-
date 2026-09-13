#!/usr/bin/env bash
# Durable, idempotent setup for the my-app (Next.js + Supabase) Cloud Agent environment.
# Installs system dependencies, the Supabase CLI, Node dependencies, and pre-pulls the
# local Supabase Docker images so subsequent boots start quickly.
set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_DIR"

log() { printf '\n\033[1;34m[install]\033[0m %s\n' "$*"; }

APT_OPTS=(-y -o Dpkg::Options::=--force-confold -o Dpkg::Options::=--force-confdef)

log "Installing system packages (docker, fuse-overlayfs, iptables)"
sudo apt-get update -qq
sudo DEBIAN_FRONTEND=noninteractive apt-get install "${APT_OPTS[@]}" \
  docker.io fuse-overlayfs iptables uidmap curl ca-certificates

log "Configuring Docker to use the fuse-overlayfs storage driver (nested-container safe)"
sudo mkdir -p /etc/docker
echo '{ "storage-driver": "fuse-overlayfs" }' | sudo tee /etc/docker/daemon.json >/dev/null
sudo update-alternatives --set iptables /usr/sbin/iptables-legacy >/dev/null 2>&1 || true
sudo update-alternatives --set ip6tables /usr/sbin/ip6tables-legacy >/dev/null 2>&1 || true

log "Granting the current user access to the Docker socket"
sudo groupadd -f docker
sudo usermod -aG docker "$(id -un)" || true

log "Installing the Supabase CLI"
SUPABASE_TARGET_VERSION="2.116.0"
if ! command -v supabase >/dev/null 2>&1 || [ "$(supabase --version 2>/dev/null)" != "$SUPABASE_TARGET_VERSION" ]; then
  tmp_deb="$(mktemp --suffix=.deb)"
  curl -fsSL -o "$tmp_deb" \
    "https://github.com/supabase/cli/releases/download/v${SUPABASE_TARGET_VERSION}/supabase_${SUPABASE_TARGET_VERSION}_linux_amd64.deb"
  sudo dpkg -i "$tmp_deb"
  rm -f "$tmp_deb"
fi
supabase --version

log "Installing Node dependencies (npm ci)"
npm ci

log "Starting the Docker daemon so the Supabase images can be pre-pulled"
"$REPO_DIR/.cursor/start-docker.sh"

log "Pre-pulling and initialising the local Supabase stack (baked into the snapshot)"
supabase start || true
# Leave the images cached in the image store; the per-boot start script brings the
# stack back up from a clean state.
supabase stop --no-backup >/dev/null 2>&1 || true

log "install.sh complete"
