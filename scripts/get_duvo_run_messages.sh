#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${DUVO_BASE_URL:-https://api.duvo.ai/v1}"

if [[ -z "${DUVO_API_KEY:-}" ]]; then
  echo "DUVO_API_KEY is not set. Run: export DUVO_API_KEY='dv_...'" >&2
  exit 1
fi

if [[ -z "${DUVO_RUN_ID:-}" ]]; then
  echo "DUVO_RUN_ID is not set. Run: export DUVO_RUN_ID='...'" >&2
  exit 1
fi

curl -sS "$BASE_URL/runs/$DUVO_RUN_ID/messages?limit=50" \
  -H "Authorization: Bearer $DUVO_API_KEY"
