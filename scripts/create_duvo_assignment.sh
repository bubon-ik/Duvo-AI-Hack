#!/usr/bin/env bash
set -euo pipefail

DUVO_API_VERSION="${DUVO_API_VERSION:-v1}"
BASE_URL="${DUVO_BASE_URL:-https://api.duvo.ai/$DUVO_API_VERSION}"
PAYLOAD_PATH="${1:-duvo/create_assignment_payload.json}"

if [[ -z "${DUVO_API_KEY:-}" ]]; then
  echo "DUVO_API_KEY is not set. Run: export DUVO_API_KEY='dv_...'" >&2
  exit 1
fi

if [[ ! -f "$PAYLOAD_PATH" ]]; then
  echo "Payload file not found: $PAYLOAD_PATH" >&2
  exit 1
fi

if [[ "$DUVO_API_VERSION" == "v2" ]]; then
  if [[ -z "${DUVO_TEAM_ID:-}" ]]; then
    echo "DUVO_TEAM_ID is required for DUVO_API_VERSION=v2." >&2
    exit 1
  fi
  ENDPOINT="$BASE_URL/teams/$DUVO_TEAM_ID/agents"
else
  ENDPOINT="$BASE_URL/agents"
fi

curl -sS -X POST "$ENDPOINT" \
  -H "Authorization: Bearer $DUVO_API_KEY" \
  -H "Content-Type: application/json" \
  -d @"$PAYLOAD_PATH"
