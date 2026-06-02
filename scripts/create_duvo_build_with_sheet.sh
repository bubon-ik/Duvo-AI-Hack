#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${DUVO_BASE_URL:-https://api.duvo.ai/v1}"
AGENT_ID="${DUVO_AGENT_ID:-6a59a0d6-7b63-4809-b389-a8b4a1b8f4c8}"
PAYLOAD_TEMPLATE="${1:-duvo/create_assignment_payload.json}"

if [[ -z "${DUVO_API_KEY:-}" ]]; then
  echo "DUVO_API_KEY is not set. Run: export DUVO_API_KEY='dv_...'" >&2
  exit 1
fi

if [[ -z "${GOOGLE_SHEET_URL:-}" ]]; then
  echo "GOOGLE_SHEET_URL is not set. Run: export GOOGLE_SHEET_URL='https://docs.google.com/spreadsheets/d/...'" >&2
  exit 1
fi

if [[ ! -f "$PAYLOAD_TEMPLATE" ]]; then
  echo "Payload template not found: $PAYLOAD_TEMPLATE" >&2
  exit 1
fi

TMP_PAYLOAD="$(mktemp)"
trap 'rm -f "$TMP_PAYLOAD"' EXIT

python3 - "$PAYLOAD_TEMPLATE" "$TMP_PAYLOAD" "$AGENT_ID" "$GOOGLE_SHEET_URL" <<'PY'
import json
import sys
from datetime import datetime, timezone

source, target, agent_id, sheet_url = sys.argv[1:5]

with open(source, encoding="utf-8") as file:
    assignment = json.load(file)

config = assignment["build"]["config"]
data = config["data"]
base_input = data["input"]

data["input"] = (
    f"{base_input}\n\n"
    f"Use this Google Sheet as the system of record: {sheet_url}\n\n"
    "Read tabs exactly named vendors, purchase_orders, and invoice_reviews. "
    "Write all new review rows to invoice_reviews. "
    "Search Gmail for new messages whose subject starts with 'DUVO DEMO Invoice'. "
    "For the live demo, process the newest matching invoice email first."
)

payload = {
    "agent_id": agent_id,
    "name": "hackathon-demo-with-sheet-" + datetime.now(timezone.utc).strftime("%Y%m%d-%H%M%S"),
    "config": config,
}

with open(target, "w", encoding="utf-8") as file:
    json.dump(payload, file, indent=2)
PY

curl -sS -X POST "$BASE_URL/builds" \
  -H "Authorization: Bearer $DUVO_API_KEY" \
  -H "Content-Type: application/json" \
  -d @"$TMP_PAYLOAD"
