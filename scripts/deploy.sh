#!/usr/bin/env bash
#
# SettlementForge — Full Deployment Setup
#
# This script provisions the complete backend:
#   1. Supabase project creation + migration
#   2. Edge function deployment
#   3. Stripe product/price creation
#   4. Environment variable configuration
#
# Prerequisites:
#   - Supabase CLI (npx supabase)
#   - curl
#   - jq (optional, for pretty output)
#
# Usage:
#   bash scripts/deploy.sh
#
# The script will prompt for credentials interactively.

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

info()  { echo -e "${CYAN}[INFO]${NC}  $1"; }
ok()    { echo -e "${GREEN}[OK]${NC}    $1"; }
warn()  { echo -e "${YELLOW}[WARN]${NC}  $1"; }
fail()  { echo -e "${RED}[FAIL]${NC}  $1"; exit 1; }

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="$PROJECT_DIR/.env"
CONFIG_TOML="$PROJECT_DIR/supabase/config.toml"
# Route and schema-cache propagation normally complete quickly. Both readiness
# probes allow roughly 40 seconds before refusing a partial cutover.
EDGE_READINESS_ATTEMPTS=20
EDGE_READINESS_DELAY_SECONDS=2
STRIPE_WEBHOOK_LEASE_STALE_SECONDS=300

# Echo "--no-verify-jwt" iff config.toml pins `verify_jwt = false` for $1, else
# nothing (platform default = JWT-gated). Reads ONLY the [functions.<name>] block.
verify_jwt_flag() {
  awk -v fn="$1" '
    $0 == "[functions." fn "]" { inblock = 1; next }
    /^\[/ { inblock = 0 }
    inblock {
      line = $0; gsub(/[[:space:]]/, "", line)
      if (line == "verify_jwt=false") { print "--no-verify-jwt"; exit }
    }
  ' "$CONFIG_TOML"
}

deploy_function() {
  local fn="$1"
  local flag
  local -a args

  flag="$(verify_jwt_flag "$fn")"
  args=(functions deploy "$fn" --project-ref "$PROJECT_REF")
  if [[ -n "$flag" ]]; then
    args+=("$flag")
  fi
  npx supabase "${args[@]}"
  ok "Deployed: $fn${flag:+ (no-verify-jwt)}"
}

# Both durable workers reject GET with 405 before reading their database config.
# Waiting for that response proves the new route is live without claiming work.
wait_for_edge_function_route() {
  local fn="$1"
  local status=""
  local attempt

  info "Waiting for $fn route readiness..."
  for attempt in $(seq 1 "$EDGE_READINESS_ATTEMPTS"); do
    status="$(curl -sS -o /dev/null -w '%{http_code}' \
      "${SUPABASE_URL}/functions/v1/${fn}" || true)"
    if [[ "$status" == "405" ]]; then
      ok "Worker route is ready: $fn"
      return 0
    fi
    if [[ "$attempt" -lt "$EDGE_READINESS_ATTEMPTS" ]]; then
      sleep "$EDGE_READINESS_DELAY_SECONDS"
    fi
  done
  fail "$fn route did not become ready (last HTTP ${status:-unknown})"
}

# Read an already-active worker secret before a re-deploy so the canonical path
# does not rotate one side of the database/function trust boundary by accident.
# A brand-new project legitimately has no system_config table or row yet.
read_dispatcher_secret() {
  local key="$1"
  local response
  local status
  local body

  if ! response="$(curl -sS -w $'\n%{http_code}' \
    "${SUPABASE_URL}/rest/v1/system_config?select=value&key=eq.${key}" \
    -H "apikey: ${SERVICE_ROLE_KEY}" \
    -H "Authorization: Bearer ${SERVICE_ROLE_KEY}")"; then
    echo "Could not read existing ${key} dispatcher configuration" >&2
    return 1
  fi
  status="${response##*$'\n'}"
  body="${response%$'\n'*}"

  if [[ "$status" == "404" ]] &&
    [[ "$body" == *'"code":"PGRST205"'* || "$body" == *'"code":"42P01"'* ]]; then
    return 0
  fi
  if [[ "$status" != "200" ]]; then
    echo "Unexpected HTTP ${status} while reading ${key} dispatcher configuration" >&2
    return 1
  fi

  DEPLOY_DISPATCHER_ROWS="$body" \
    node "$PROJECT_DIR/scripts/deploy-config.mjs" read-dispatcher-secret
}

# Merge the deployed URL/secret into each migration-seeded row and prove the
# exact values were persisted. Existing tuning knobs are preserved.
configure_worker_dispatcher() {
  local key="$1"
  local worker_url="$2"
  local secret="$3"
  local response
  local status
  local body
  local payload

  response="$(curl -sS -w $'\n%{http_code}' \
    "${SUPABASE_URL}/rest/v1/system_config?select=key,value&key=eq.${key}" \
    -H "apikey: ${SERVICE_ROLE_KEY}" \
    -H "Authorization: Bearer ${SERVICE_ROLE_KEY}")"
  status="${response##*$'\n'}"
  body="${response%$'\n'*}"
  [[ "$status" == "200" ]] ||
    fail "Could not read migration-seeded ${key} configuration (HTTP ${status})"

  if ! payload="$(
    DEPLOY_DISPATCHER_ROWS="$body" \
      DEPLOY_WORKER_URL="$worker_url" \
      DEPLOY_WORKER_SECRET="$secret" \
      node "$PROJECT_DIR/scripts/deploy-config.mjs" merge-dispatcher
  )"; then
    fail "Migration did not seed exactly one valid ${key} configuration row"
  fi

  response="$(curl -sS -w $'\n%{http_code}' \
    -X PATCH \
    "${SUPABASE_URL}/rest/v1/system_config?select=key,value&key=eq.${key}" \
    -H "apikey: ${SERVICE_ROLE_KEY}" \
    -H "Authorization: Bearer ${SERVICE_ROLE_KEY}" \
    -H "Content-Type: application/json" \
    -H "Prefer: return=representation" \
    --data-binary "$payload")"
  status="${response##*$'\n'}"
  body="${response%$'\n'*}"
  [[ "$status" == "200" ]] ||
    fail "Could not activate ${key} dispatcher (HTTP ${status})"

  if ! DEPLOY_DISPATCHER_ROWS="$body" \
    DEPLOY_WORKER_URL="$worker_url" \
    DEPLOY_WORKER_SECRET="$secret" \
    node "$PROJECT_DIR/scripts/deploy-config.mjs" verify-dispatcher; then
    fail "${key} dispatcher verification failed"
  fi
  ok "Activated durable dispatcher: $key"
}

# Migration 181 validates the empty event id before any INSERT. The expected
# P0001 response therefore proves PostgREST can resolve the lease RPC without
# creating a probe row. Canonical deploy refuses to cut over stripe-webhook while
# schema cache still returns PGRST202; the runtime direct-insert fallback remains
# transitional rolling-deploy compatibility only.
wait_for_stripe_webhook_lease_rpc() {
  local response=""
  local status=""
  local body=""
  local attempt
  local probe_payload

  printf -v probe_payload \
    '{"p_event_id":"","p_event_type":"deployment_readiness_probe","p_stale_after_seconds":%d}' \
    "$STRIPE_WEBHOOK_LEASE_STALE_SECONDS"

  info "Waiting for Stripe webhook lease RPC readiness..."
  for attempt in $(seq 1 "$EDGE_READINESS_ATTEMPTS"); do
    if response="$(curl -sS -w $'\n%{http_code}' \
      -X POST \
      "${SUPABASE_URL}/rest/v1/rpc/claim_stripe_webhook_event" \
      -H "apikey: ${SERVICE_ROLE_KEY}" \
      -H "Authorization: Bearer ${SERVICE_ROLE_KEY}" \
      -H "Content-Type: application/json" \
      --data-binary "$probe_payload")"; then
      status="${response##*$'\n'}"
      body="${response%$'\n'*}"
      if [[ "$status" == "400" ]] &&
        DEPLOY_RPC_PROBE_BODY="$body" \
          node "$PROJECT_DIR/scripts/deploy-config.mjs" verify-lease-probe; then
        ok "Stripe webhook lease RPC is ready"
        return 0
      fi
    fi
    if [[ "$attempt" -lt "$EDGE_READINESS_ATTEMPTS" ]]; then
      sleep "$EDGE_READINESS_DELAY_SECONDS"
    fi
  done

  fail "Stripe webhook lease RPC did not become ready (last HTTP ${status:-unknown}); refusing webhook cutover"
}

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  SettlementForge — Deployment Setup"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# ── Step 1: Supabase Login ──────────────────────────────────────────────────

info "Step 1: Supabase authentication"
echo ""
echo "  Generate an access token at:"
echo "  https://supabase.com/dashboard/account/tokens"
echo ""
read -rp "  Supabase access token: " SUPABASE_TOKEN
[[ -z "$SUPABASE_TOKEN" ]] && fail "Token required"

export SUPABASE_ACCESS_TOKEN="$SUPABASE_TOKEN"
ok "Token set"

# ── Step 2: Create or link project ──────────────────────────────────────────

info "Step 2: Supabase project setup"
echo ""
echo "  Existing projects:"
npx supabase projects list 2>/dev/null || warn "Could not list projects"
echo ""
echo "  Options:"
echo "    1) Create a new project"
echo "    2) Link to an existing project"
echo ""
read -rp "  Choice [1/2]: " PROJ_CHOICE

if [[ "$PROJ_CHOICE" == "1" ]]; then
  read -rp "  Project name [settlementforge]: " PROJ_NAME
  PROJ_NAME="${PROJ_NAME:-settlementforge}"

  read -rp "  Organization ID (from list above): " ORG_ID
  [[ -z "$ORG_ID" ]] && fail "Organization ID required"

  read -rp "  Region [us-east-1]: " REGION
  REGION="${REGION:-us-east-1}"

  read -rsp "  Database password: " DB_PASS
  echo ""
  [[ -z "$DB_PASS" ]] && fail "Database password required"

  info "Creating project '$PROJ_NAME'..."
  npx supabase projects create "$PROJ_NAME" \
    --org-id "$ORG_ID" \
    --region "$REGION" \
    --db-password "$DB_PASS"

  # Wait for project to be ready
  info "Waiting for project provisioning (30s)..."
  sleep 30

  # Get the project ref from the list
  PROJECT_REF=$(npx supabase projects list 2>/dev/null | grep "$PROJ_NAME" | awk '{print $1}' | head -1)
  [[ -z "$PROJECT_REF" ]] && fail "Could not determine project ref. Check dashboard."

  ok "Project created: $PROJECT_REF"
else
  read -rp "  Project ref (e.g. abcdefghijklmnop): " PROJECT_REF
  [[ -z "$PROJECT_REF" ]] && fail "Project ref required"
fi

# Link the project
cd "$PROJECT_DIR"
info "Linking project $PROJECT_REF..."
npx supabase link --project-ref "$PROJECT_REF"
ok "Project linked"

# ── Step 3: Get project API keys ────────────────────────────────────────────

info "Step 3: Retrieving API keys..."
API_KEYS=$(npx supabase projects api-keys --project-ref "$PROJECT_REF" 2>/dev/null || echo "")
SUPABASE_URL="https://${PROJECT_REF}.supabase.co"

# Parse anon key
ANON_KEY=$(echo "$API_KEYS" | grep "anon" | awk '{print $NF}')
SERVICE_ROLE_KEY=$(echo "$API_KEYS" | grep "service_role" | awk '{print $NF}')

if [[ -z "$ANON_KEY" || -z "$SERVICE_ROLE_KEY" ]]; then
  warn "Could not auto-detect keys. Find them at:"
  warn "https://supabase.com/dashboard/project/$PROJECT_REF/settings/api"
  if [[ -z "$ANON_KEY" ]]; then
    read -rp "  Anon key: " ANON_KEY
  fi
  if [[ -z "$SERVICE_ROLE_KEY" ]]; then
    read -rp "  Service role key: " SERVICE_ROLE_KEY
  fi
fi

ok "API keys retrieved"

# ── Step 4: Bootstrap durable workers before their migrations ───────────────
#
# Migration 175 unschedules the legacy SQL deletion cron, while migrations 175
# and 180 deliberately seed inert dispatch rows. Install the function-side
# secrets and both worker binaries first, then migrate and activate the matching
# database rows in the same run. Existing secrets are reused on a re-deploy.

info "Step 4: Bootstrapping durable external-work workers..."
echo ""
echo "  Get your Stripe secret key from:"
echo "  https://dashboard.stripe.com/apikeys"
echo ""
read -rsp "  Stripe secret key (sk_...): " STRIPE_SK
echo ""
[[ -z "$STRIPE_SK" ]] && fail "Stripe key required"

if ! EXISTING_ACCOUNT_DELETION_SECRET="$(
  read_dispatcher_secret "account_deletion_cron"
)"; then
  fail "Could not safely inspect the existing account-deletion worker secret"
fi
if ! EXISTING_PAYMENT_REFUND_SECRET="$(
  read_dispatcher_secret "payment_refund_recovery_cron"
)"; then
  fail "Could not safely inspect the existing payment-refund worker secret"
fi
ACCOUNT_DELETION_CRON_SECRET="${ACCOUNT_DELETION_CRON_SECRET:-$EXISTING_ACCOUNT_DELETION_SECRET}"
PAYMENT_REFUND_CRON_SECRET="${PAYMENT_REFUND_CRON_SECRET:-$EXISTING_PAYMENT_REFUND_SECRET}"
ACCOUNT_DELETION_CRON_SECRET="${ACCOUNT_DELETION_CRON_SECRET:-$(openssl rand -hex 32)}"
PAYMENT_REFUND_CRON_SECRET="${PAYMENT_REFUND_CRON_SECRET:-$(openssl rand -hex 32)}"

npx supabase secrets set \
  --project-ref "$PROJECT_REF" \
  STRIPE_SECRET_KEY="$STRIPE_SK" \
  ACCOUNT_DELETION_CRON_SECRET="$ACCOUNT_DELETION_CRON_SECRET" \
  PAYMENT_REFUND_CRON_SECRET="$PAYMENT_REFUND_CRON_SECRET"
ok "Durable-worker secrets configured"

deploy_function "account-deletion-worker"
deploy_function "payment-refund-worker"
wait_for_edge_function_route "account-deletion-worker"
wait_for_edge_function_route "payment-refund-worker"

# ── Step 5: Run migrations ──────────────────────────────────────────────────

info "Step 5: Running database migrations..."
npx supabase db push
ok "Migrations applied"

# ── Step 6: Activate workers and prove webhook-lease schema readiness ────────

info "Step 6: Activating durable worker dispatch..."
configure_worker_dispatcher \
  "account_deletion_cron" \
  "${SUPABASE_URL}/functions/v1/account-deletion-worker" \
  "$ACCOUNT_DELETION_CRON_SECRET"
configure_worker_dispatcher \
  "payment_refund_recovery_cron" \
  "${SUPABASE_URL}/functions/v1/payment-refund-worker" \
  "$PAYMENT_REFUND_CRON_SECRET"

# PostgREST may briefly serve a pre-migration schema cache after db push. Do not
# create the Stripe endpoint or deploy the new webhook until the migration-181
# lease RPC is resolvable.
wait_for_stripe_webhook_lease_rpc

# ── Step 7: Deploy the remaining edge functions ─────────────────────────────
#
# The verify_jwt posture lives in ONE place: supabase/config.toml. We DERIVE the
# `--no-verify-jwt` flag from it per function instead of hardcoding a second list
# here — that duplicated list was the config/deploy split-brain (create-checkout
# shipped --no-verify-jwt with no config entry; verify-checkout-session was never
# deployed at all). Auto-discovering the functions from the filesystem also means
# a new function can never be silently left undeployed. The two workers were
# deployed before migrations; stripe-webhook is intentionally deployed last,
# after its signing secret exists and the lease RPC readiness probe has passed.

info "Step 7: Deploying remaining edge functions..."

for fn_dir in "$PROJECT_DIR"/supabase/functions/*/; do
  fn="$(basename "$fn_dir")"
  # Skip shared helpers and any non-function directory (no index.ts entrypoint).
  [[ "$fn" == _* ]] && continue
  [[ -f "$fn_dir/index.ts" ]] || continue
  case "$fn" in
    account-deletion-worker | payment-refund-worker | stripe-webhook) continue ;;
  esac
  deploy_function "$fn"
done

# ── Step 8: Stripe setup ───────────────────────────────────────────────────

info "Step 8: Stripe product and price setup"

# Create products and prices via Stripe API
info "Creating Stripe products..."

# 10 Credits Pack
CREDITS_10=$(curl -s https://api.stripe.com/v1/prices \
  -u "$STRIPE_SK:" \
  -d "unit_amount=299" \
  -d "currency=usd" \
  -d "product_data[name]=10 Narrative Credits" \
  -d "product_data[metadata][product]=credits_10" \
  | grep -o '"id": *"price_[^"]*"' | head -1 | cut -d'"' -f4)
ok "10-credit pack: $CREDITS_10"

# 50 Credits Pack
CREDITS_50=$(curl -s https://api.stripe.com/v1/prices \
  -u "$STRIPE_SK:" \
  -d "unit_amount=999" \
  -d "currency=usd" \
  -d "product_data[name]=50 Narrative Credits" \
  -d "product_data[metadata][product]=credits_50" \
  | grep -o '"id": *"price_[^"]*"' | head -1 | cut -d'"' -f4)
ok "50-credit pack: $CREDITS_50"

# Premium Subscription
PREMIUM=$(curl -s https://api.stripe.com/v1/prices \
  -u "$STRIPE_SK:" \
  -d "unit_amount=499" \
  -d "currency=usd" \
  -d "recurring[interval]=month" \
  -d "product_data[name]=SettlementForge Premium" \
  -d "product_data[metadata][product]=premium" \
  | grep -o '"id": *"price_[^"]*"' | head -1 | cut -d'"' -f4)
ok "Premium subscription: $PREMIUM"

# ── Step 9: Create Stripe webhook ──────────────────────────────────────────

info "Step 9: Setting up Stripe webhook..."
WEBHOOK_URL="${SUPABASE_URL}/functions/v1/stripe-webhook"

STRIPE_WEBHOOK_EVENTS=(
  "checkout.session.completed"
  "checkout.session.async_payment_succeeded"
  "checkout.session.async_payment_failed"
  "checkout.session.expired"
  "payment_intent.succeeded"
  "payment_intent.payment_failed"
  "refund.created"
  "refund.updated"
  "refund.failed"
  "invoice.paid"
  "invoice.payment_succeeded"
  "invoice.payment_failed"
  "charge.refunded"
  "charge.dispute.created"
  "customer.subscription.updated"
  "customer.subscription.deleted"
)
STRIPE_WEBHOOK_CURL_ARGS=(
  -fsS
  https://api.stripe.com/v1/webhook_endpoints
  -u "$STRIPE_SK:"
  -d "url=$WEBHOOK_URL"
)
for event_type in "${STRIPE_WEBHOOK_EVENTS[@]}"; do
  STRIPE_WEBHOOK_CURL_ARGS+=(-d "enabled_events[]=$event_type")
done
WEBHOOK_RESULT="$(curl "${STRIPE_WEBHOOK_CURL_ARGS[@]}")"

WEBHOOK_SECRET=$(echo "$WEBHOOK_RESULT" | grep -o '"secret": *"whsec_[^"]*"' | head -1 | cut -d'"' -f4)

if [[ -n "$WEBHOOK_SECRET" ]]; then
  ok "Webhook created: $WEBHOOK_URL"
  ok "Webhook secret: $WEBHOOK_SECRET"
else
  warn "Could not extract webhook secret. Check Stripe dashboard."
  warn "Webhook URL should be: $WEBHOOK_URL"
  read -rp "  Webhook secret (whsec_...): " WEBHOOK_SECRET
fi

# ── Step 10: Set remaining secrets and cut over stripe-webhook ──────────────

info "Step 10: Setting remaining edge function secrets..."

read -rsp "  Anthropic API key (sk-ant-...): " ANTHROPIC_KEY
echo ""

# Determine client URL
read -rp "  Client URL [https://settlementforge.com]: " CLIENT_URL
CLIENT_URL="${CLIENT_URL:-https://settlementforge.com}"

# Resend (send-email function). Optional — leave blank to skip the email lifecycle.
read -rp "  Resend API key (RESEND_API_KEY) [skip]: " RESEND_KEY
read -rp "  Resend from-address (RESEND_FROM_EMAIL) [skip]: " RESEND_FROM

# NOTE: SUPABASE_SERVICE_ROLE_KEY / SUPABASE_URL / SUPABASE_ANON_KEY are RESERVED —
# Supabase injects them into every edge function automatically and rejects setting
# them via `secrets set`. Do not add them here.
npx supabase secrets set \
  --project-ref "$PROJECT_REF" \
  STRIPE_WEBHOOK_SECRET="$WEBHOOK_SECRET" \
  STRIPE_PRICE_CREDITS_10="$CREDITS_10" \
  STRIPE_PRICE_CREDITS_50="$CREDITS_50" \
  STRIPE_PRICE_PREMIUM="$PREMIUM" \
  ANTHROPIC_API_KEY="$ANTHROPIC_KEY" \
  CLIENT_URL="$CLIENT_URL"

if [ -n "$RESEND_KEY" ]; then
  npx supabase secrets set --project-ref "$PROJECT_REF" \
    RESEND_API_KEY="$RESEND_KEY" RESEND_FROM_EMAIL="$RESEND_FROM"
  ok "Resend secrets configured"
fi

# Analytics intelligence layer secrets. ANALYTICS_HASH_PEPPER peppers the device-
# token hash so a DB dump alone can't correlate tokens to actors; EXPORT_SHARED_
# SECRET gates the analytics-export function. Auto-generate strong random values
# when not supplied.
read -rp "  Analytics device-hash pepper (ANALYTICS_HASH_PEPPER) [auto-generate]: " ANALYTICS_PEPPER
ANALYTICS_PEPPER="${ANALYTICS_PEPPER:-$(openssl rand -hex 32)}"
read -rp "  Research export secret (EXPORT_SHARED_SECRET) [auto-generate]: " EXPORT_SECRET
EXPORT_SECRET="${EXPORT_SECRET:-$(openssl rand -hex 32)}"
npx supabase secrets set --project-ref "$PROJECT_REF" \
  ANALYTICS_HASH_PEPPER="$ANALYTICS_PEPPER" EXPORT_SHARED_SECRET="$EXPORT_SECRET"
ok "Analytics secrets configured (pepper + export secret)"

# OPTIONAL: also add the owner-override email (fail-closed when unset):
#   npx supabase secrets set --project-ref "$PROJECT_REF" OWNER_EMAIL="you@example.com"

ok "All secrets configured"

# The migration-181 RPC was proven through PostgREST before the endpoint was
# created. Deploying the webhook only now also ensures its Stripe signing secret
# exists before the first accepted delivery.
deploy_function "stripe-webhook"

# ── Step 11: Write .env file ───────────────────────────────────────────────

info "Step 11: Writing .env file..."

cat > "$ENV_FILE" <<ENVEOF
# ── Supabase ─────────────────────────────────────────────────────────────────
VITE_SUPABASE_URL=${SUPABASE_URL}
VITE_SUPABASE_ANON_KEY=${ANON_KEY}

# ── Azgaar FMG (set after deploying your FMG fork) ──────────────────────────
# VITE_FMG_URL=https://map.yourdomain.com
ENVEOF

ok ".env written"

# ── Done ───────────────────────────────────────────────────────────────────

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo -e "  ${GREEN}Deployment complete!${NC}"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "  Supabase URL:    $SUPABASE_URL"
echo "  Project ref:     $PROJECT_REF"
echo "  Edge functions:  all in supabase/functions/ (JWT posture from config.toml)"
echo "  Stripe products: 3 created"
echo "  Webhook:         $WEBHOOK_URL"
echo ""
echo "  Next steps:"
echo "    1. Run 'npm run dev' to test locally"
echo "    2. Enable Email auth in Supabase dashboard → Authentication → Providers"
echo "    3. Deploy your Azgaar FMG fork (see docs/fmg-bridge.js)"
echo "    4. Set VITE_FMG_URL in .env once FMG fork is hosted"
echo "    5. Deploy frontend (Vercel/Netlify: 'npm run build' → dist/)"
echo ""
