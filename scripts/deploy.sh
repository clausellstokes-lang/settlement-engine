#!/usr/bin/env bash
#
# SettlementForge — Full Deployment Setup
#
# This script provisions the complete backend:
#   1. Supabase project creation + migration
#   2. Edge function deployment
#   3. Stripe webhook + price-ID secret wiring
#      (Stripe products/prices are provisioned OUT OF BAND in the dashboard;
#       this script wires the resulting price IDs into function secrets, it
#       does not create any Stripe products or prices.)
#   4. Environment variable + secret configuration
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
read -rsp "  Supabase access token: " SUPABASE_TOKEN
echo ""
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

# ── Step 3: Run migration ───────────────────────────────────────────────────

info "Step 3: Running database migration..."
npx supabase db push
ok "Migration applied"

# ── Step 4: Get project API keys ────────────────────────────────────────────

info "Step 4: Retrieving API keys..."
API_KEYS=$(npx supabase projects api-keys --project-ref "$PROJECT_REF" 2>/dev/null || echo "")
SUPABASE_URL="https://${PROJECT_REF}.supabase.co"

# Parse anon key
ANON_KEY=$(echo "$API_KEYS" | grep "anon" | awk '{print $NF}')
SERVICE_ROLE_KEY=$(echo "$API_KEYS" | grep "service_role" | awk '{print $NF}')

if [[ -z "$ANON_KEY" ]]; then
  warn "Could not auto-detect keys. Find them at:"
  warn "https://supabase.com/dashboard/project/$PROJECT_REF/settings/api"
  read -rp "  Anon key: " ANON_KEY
  read -rp "  Service role key: " SERVICE_ROLE_KEY
fi

ok "API keys retrieved"

# ── Step 5: Deploy edge functions ───────────────────────────────────────────

info "Step 5: Deploying edge functions..."

# SOURCE-DERIVED function list: enumerate every directory under
# supabase/functions/ except _shared (a helper bundle, not a deployable
# function). Deriving the list from the tree means a newly added function is
# deployed automatically and the set can never silently drift from the repo.
#
# No --no-verify-jwt flags: verify_jwt is pinned EXPLICITLY per function in
# supabase/config.toml (the deploy source of truth per docs/DEPLOY.md), so the
# platform JWT gate is set from config, never from a stray CLI flag.
FUNCTIONS=()
for fn_dir in "$PROJECT_DIR"/supabase/functions/*/; do
  fn_name="$(basename "$fn_dir")"
  [[ "$fn_name" == "_shared" ]] && continue
  FUNCTIONS+=("$fn_name")
done

[[ ${#FUNCTIONS[@]} -eq 0 ]] && fail "No edge functions found under supabase/functions/"

DEPLOYED_COUNT=0
for fn_name in "${FUNCTIONS[@]}"; do
  npx supabase functions deploy "$fn_name" --project-ref "$PROJECT_REF"
  ok "Deployed: $fn_name"
  DEPLOYED_COUNT=$((DEPLOYED_COUNT + 1))
done

# Post-deploy verification: confirm every function we intended to deploy is
# actually present on the project. Fail loudly if any is missing so a partial
# deploy can never pass silently. `supabase functions list` prints each
# function's slug; require every name in FUNCTIONS to appear.
info "Verifying deployed functions..."
REMOTE_FUNCTIONS="$(npx supabase functions list --project-ref "$PROJECT_REF" 2>/dev/null || echo "")"
MISSING=()
for fn_name in "${FUNCTIONS[@]}"; do
  if ! echo "$REMOTE_FUNCTIONS" | grep -qw "$fn_name"; then
    MISSING+=("$fn_name")
  fi
done
if [[ ${#MISSING[@]} -gt 0 ]]; then
  fail "Post-deploy check failed — missing on project: ${MISSING[*]}"
fi
ok "All $DEPLOYED_COUNT functions verified present"

# ── Step 6: Stripe setup ───────────────────────────────────────────────────

info "Step 6: Stripe price-ID secret wiring (products provisioned out of band)"
echo ""
echo "  Get your Stripe secret key from:"
echo "  https://dashboard.stripe.com/apikeys"
echo ""
read -rsp "  Stripe secret key (sk_...): " STRIPE_SK
echo ""
[[ -z "$STRIPE_SK" ]] && fail "Stripe key required"

# Stripe products/prices are provisioned OUT OF BAND, not by this script. The
# live catalogue (25/60/150 credit packs, founder lifetime, premium, and the
# single-dossier SKU — see the PRICE_MAP in create-checkout and the secrets list
# in docs/DEPLOY.md) is maintained in the Stripe dashboard. This script only
# wires the resulting price IDs into the Supabase function secrets below.
#
# Collect each documented price ID. Leave any blank to skip wiring that key now
# (you can set it later with `supabase secrets set`). Legacy SKU keys are kept in
# the price map for refund/replay continuity and are NOT prompted for here.
info "Collecting Stripe price IDs (provisioned in the Stripe dashboard)..."
read -rp "  STRIPE_PRICE_CREDITS_25 (price_...): " PRICE_CREDITS_25
read -rp "  STRIPE_PRICE_CREDITS_60 (price_...): " PRICE_CREDITS_60
read -rp "  STRIPE_PRICE_CREDITS_150 (price_...): " PRICE_CREDITS_150
read -rp "  STRIPE_PRICE_PREMIUM (price_...): " PRICE_PREMIUM
read -rp "  STRIPE_PRICE_FOUNDER_LIFETIME (price_...): " PRICE_FOUNDER_LIFETIME
read -rp "  STRIPE_PRICE_SINGLE_DOSSIER (price_...): " PRICE_SINGLE_DOSSIER

# ── Step 7: Create Stripe webhook ──────────────────────────────────────────

info "Step 7: Setting up Stripe webhook..."
WEBHOOK_URL="${SUPABASE_URL}/functions/v1/stripe-webhook"

WEBHOOK_RESULT=$(curl -s https://api.stripe.com/v1/webhook_endpoints \
  -u "$STRIPE_SK:" \
  -d "url=$WEBHOOK_URL" \
  -d "enabled_events[]=checkout.session.completed" \
  -d "enabled_events[]=invoice.paid" \
  -d "enabled_events[]=invoice.payment_succeeded" \
  -d "enabled_events[]=customer.subscription.deleted")

WEBHOOK_SECRET=$(echo "$WEBHOOK_RESULT" | grep -o '"secret": *"whsec_[^"]*"' | head -1 | cut -d'"' -f4)

if [[ -n "$WEBHOOK_SECRET" ]]; then
  ok "Webhook created: $WEBHOOK_URL"
  # Do NOT echo the signing secret — it is the money-path trust anchor and must
  # not land in terminal scrollback or a screen recording. It is wired straight
  # into the function secrets in Step 8; the operator never needs to read it here.
  ok "Webhook signing secret captured (${#WEBHOOK_SECRET} chars) — wiring into function secrets"
else
  warn "Could not extract webhook secret. Check Stripe dashboard."
  warn "Webhook URL should be: $WEBHOOK_URL"
  read -rp "  Webhook secret (whsec_...): " WEBHOOK_SECRET
fi

# ── Step 8: Set Supabase edge function secrets ─────────────────────────────

info "Step 8: Setting edge function secrets..."

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
  STRIPE_SECRET_KEY="$STRIPE_SK" \
  STRIPE_WEBHOOK_SECRET="$WEBHOOK_SECRET" \
  ANTHROPIC_API_KEY="$ANTHROPIC_KEY" \
  CLIENT_URL="$CLIENT_URL"

# Stripe price-ID secrets (current catalogue per docs/DEPLOY.md). Set only the
# ones the operator supplied above so re-runs stay idempotent and a blank entry
# never clobbers an already-configured price ID.
PRICE_SECRETS=()
[[ -n "$PRICE_CREDITS_25" ]]       && PRICE_SECRETS+=("STRIPE_PRICE_CREDITS_25=$PRICE_CREDITS_25")
[[ -n "$PRICE_CREDITS_60" ]]       && PRICE_SECRETS+=("STRIPE_PRICE_CREDITS_60=$PRICE_CREDITS_60")
[[ -n "$PRICE_CREDITS_150" ]]      && PRICE_SECRETS+=("STRIPE_PRICE_CREDITS_150=$PRICE_CREDITS_150")
[[ -n "$PRICE_PREMIUM" ]]          && PRICE_SECRETS+=("STRIPE_PRICE_PREMIUM=$PRICE_PREMIUM")
[[ -n "$PRICE_FOUNDER_LIFETIME" ]] && PRICE_SECRETS+=("STRIPE_PRICE_FOUNDER_LIFETIME=$PRICE_FOUNDER_LIFETIME")
[[ -n "$PRICE_SINGLE_DOSSIER" ]]   && PRICE_SECRETS+=("STRIPE_PRICE_SINGLE_DOSSIER=$PRICE_SINGLE_DOSSIER")
if [[ ${#PRICE_SECRETS[@]} -gt 0 ]]; then
  npx supabase secrets set --project-ref "$PROJECT_REF" "${PRICE_SECRETS[@]}"
  ok "Stripe price IDs configured (${#PRICE_SECRETS[@]} set)"
else
  warn "No Stripe price IDs supplied — set them later per docs/DEPLOY.md before going live"
fi

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

# ── Step 9: Write .env file ────────────────────────────────────────────────

info "Step 9: Writing .env file..."

cat > "$ENV_FILE" <<ENVEOF
# ── Supabase ─────────────────────────────────────────────────────────────────
VITE_SUPABASE_URL=${SUPABASE_URL}
VITE_SUPABASE_ANON_KEY=${ANON_KEY}

# ── Azgaar FMG (set after deploying your FMG fork) ──────────────────────────
# VITE_FMG_URL=https://map.yourdomain.com
ENVEOF

ok ".env written"

# ── Completeness gate ──────────────────────────────────────────────────────
#
# Before certifying the environment, verify every secret the live app needs is
# actually wired. The success banner must never claim "complete" over a
# half-provisioned project. Two classes are required:
#   - The six current-catalogue Stripe price IDs (checkout fails without them).
#   - RESEND_API_KEY + RESEND_FROM_EMAIL — the logged-out password-recovery path
#     (auth-recovery → send-email) mails the reset link through Resend; without
#     them account recovery silently soft-fails.
#   - ANTHROPIC_API_KEY — generate-narrative + generate-chronicle call the AI
#     provider with it; a blank key fails every narrative generation.
#   - STRIPE_WEBHOOK_SECRET — stripe-webhook verifies the Stripe signature with
#     it; a blank secret rejects every webhook delivery (no credits granted).
# This check reads the values collected above (fail-closed: a blank value counts
# as missing) rather than re-querying the project, so it stays idempotent.
# Each entry is "<value>:<secret-name>"; a blank value flags that secret as
# missing. A for-loop (not chained `[[ -z ]] &&` shorthand) keeps this safe under
# `set -e`, where a non-empty match would otherwise exit 1 and abort the script.
MISSING_REQUIRED=()
for required in \
  "$PRICE_CREDITS_25:STRIPE_PRICE_CREDITS_25" \
  "$PRICE_CREDITS_60:STRIPE_PRICE_CREDITS_60" \
  "$PRICE_CREDITS_150:STRIPE_PRICE_CREDITS_150" \
  "$PRICE_PREMIUM:STRIPE_PRICE_PREMIUM" \
  "$PRICE_FOUNDER_LIFETIME:STRIPE_PRICE_FOUNDER_LIFETIME" \
  "$PRICE_SINGLE_DOSSIER:STRIPE_PRICE_SINGLE_DOSSIER" \
  "$RESEND_KEY:RESEND_API_KEY" \
  "$RESEND_FROM:RESEND_FROM_EMAIL" \
  "$ANTHROPIC_KEY:ANTHROPIC_API_KEY" \
  "$WEBHOOK_SECRET:STRIPE_WEBHOOK_SECRET"; do
  if [[ -z "${required%%:*}" ]]; then
    MISSING_REQUIRED+=("${required##*:}")
  fi
done

if [[ ${#MISSING_REQUIRED[@]} -gt 0 ]]; then
  echo ""
  echo "═══════════════════════════════════════════════════════════════"
  echo -e "  ${RED}Deployment INCOMPLETE${NC}"
  echo "═══════════════════════════════════════════════════════════════"
  echo ""
  echo "  Infrastructure is wired, but these required secrets were not"
  echo "  supplied — set them with 'supabase secrets set' before going live"
  echo "  (see docs/DEPLOY.md):"
  echo ""
  echo "    missing: ${MISSING_REQUIRED[*]}"
  echo ""
  echo "  Stripe checkout fails without the price IDs; password recovery"
  echo "  soft-fails without the Resend secrets; AI narratives fail without"
  echo "  ANTHROPIC_API_KEY; webhook deliveries reject without"
  echo "  STRIPE_WEBHOOK_SECRET."
  echo ""
  echo "  Supabase URL:    $SUPABASE_URL"
  echo "  Project ref:     $PROJECT_REF"
  echo "  Edge functions:  $DEPLOYED_COUNT deployed"
  echo "  Webhook:         $WEBHOOK_URL"
  echo ""
  exit 1
fi

# ── Done ───────────────────────────────────────────────────────────────────

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo -e "  ${GREEN}Deployment complete${NC}"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "  Supabase URL:    $SUPABASE_URL"
echo "  Project ref:     $PROJECT_REF"
echo "  Edge functions:  $DEPLOYED_COUNT deployed"
echo "  Stripe prices:   ${#PRICE_SECRETS[@]} wired (catalogue provisioned in Stripe — see docs/DEPLOY.md)"
echo "  Webhook:         $WEBHOOK_URL"
echo ""
echo "  Next steps:"
echo "    1. Run 'npm run dev' to test locally"
echo "    2. Enable Email auth in Supabase dashboard → Authentication → Providers"
echo "    3. Deploy your Azgaar FMG fork (see docs/fmg-bridge.js)"
echo "    4. Set VITE_FMG_URL in .env once FMG fork is hosted"
echo "    5. Deploy frontend (Vercel/Netlify: 'npm run build' → dist/)"
echo ""
