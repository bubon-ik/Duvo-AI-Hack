#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${DUVO_BASE_URL:-https://api.duvo.ai/v1}"
PAYLOAD_PATH="${1:-duvo/create_assignment_payload.json}"

if [[ -z "${DUVO_API_KEY:-}" ]]; then
  echo "DUVO_API_KEY is not set. Run: export DUVO_API_KEY='dv_...'" >&2
  exit 1
fi

if [[ ! -f "$PAYLOAD_PATH" ]]; then
  echo "Payload file not found: $PAYLOAD_PATH" >&2
  exit 1
fi

curl -sS -X POST "$BASE_URL/agents" \
  -H "Authorization: Bearer $DUVO_API_KEY" \
  -H "Content-Type: application/json" \
  -d @"$PAYLOAD_PATH"
