#!/usr/bin/env bash
# scripts/verify-email-setup.sh — Tier 8.5 Resend smoke test.
#
# Verifies the send-email edge function can actually deliver mail.
# Run AFTER setting RESEND_API_KEY + RESEND_FROM_EMAIL secrets via:
#   npx supabase secrets set RESEND_API_KEY=re_xxx
#   npx supabase secrets set RESEND_FROM_EMAIL="SettlementForge <hello@you.com>"
#
# Usage:
#   scripts/verify-email-setup.sh <your-supabase-user-jwt>
#
# Outputs the edge function response. Expected:
#   ok:true id:<resend-message-id> → all wired
#   ok:false reason:unconfigured  → secrets not set, see docs/email-lifecycle.md
#   ok:false reason:provider_error→ Resend API rejected; check API key / domain
#   ok:false reason:auth_*        → JWT invalid or missing

set -euo pipefail

if [ "${1:-}" = "" ]; then
  echo "Usage: $0 <user-jwt>"
  echo ""
  echo "Get the JWT by signing in on the live app, then in browser devtools:"
  echo "  > (await window.__store.getState().auth.session)?.access_token"
  exit 64
fi

JWT="$1"

# Read the project ref from .vercel or fall back to env.
PROJECT_REF="${SUPABASE_PROJECT_REF:-}"
if [ -z "$PROJECT_REF" ] && [ -f .vercel/project.json ]; then
  # Best effort; the project ref is on Supabase, not Vercel. Just fail
  # with a clear message if it's missing.
  :
fi

if [ -z "$PROJECT_REF" ]; then
  PROJECT_REF="uhozyhcdccbhigvlacdu"  # current project; override via env if you migrated
  echo "[verify-email] using project ref: $PROJECT_REF (override via SUPABASE_PROJECT_REF)"
fi

URL="https://${PROJECT_REF}.supabase.co/functions/v1/send-email"

echo "[verify-email] POST ${URL}"
echo "[verify-email] template: welcome"
echo ""

curl -sS -X POST "$URL" \
  -H "Authorization: Bearer ${JWT}" \
  -H "Content-Type: application/json" \
  -d '{"template":"welcome","payload":{"displayName":"verify-email smoke test"}}' \
  | jq . 2>/dev/null || cat
