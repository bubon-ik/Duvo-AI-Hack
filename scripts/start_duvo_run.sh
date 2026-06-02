#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${DUVO_BASE_URL:-https://api.duvo.ai/v1}"
AGENT_ID="${DUVO_AGENT_ID:-6a59a0d6-7b63-4809-b389-a8b4a1b8f4c8}"

if [[ -z "${DUVO_API_KEY:-}" ]]; then
  echo "DUVO_API_KEY is not set. Run: export DUVO_API_KEY='dv_...'" >&2
  exit 1
fi

curl -sS -X POST "$BASE_URL/runs" \
  -H "Authorization: Bearer $DUVO_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"agent_id\":\"$AGENT_ID\"}"
