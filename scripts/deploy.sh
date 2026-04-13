#!/usr/bin/env bash
#
# Settlement Engine — Full Deployment Setup
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

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  Settlement Engine — Deployment Setup"
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
  read -rp "  Project name [settlement-engine]: " PROJ_NAME
  PROJ_NAME="${PROJ_NAME:-settlement-engine}"

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

npx supabase functions deploy create-checkout --project-ref "$PROJECT_REF" --no-verify-jwt
ok "Deployed: create-checkout"

npx supabase functions deploy generate-narrative --project-ref "$PROJECT_REF"
ok "Deployed: generate-narrative"

npx supabase functions deploy stripe-webhook --project-ref "$PROJECT_REF" --no-verify-jwt
ok "Deployed: stripe-webhook"

# ── Step 6: Stripe setup ───────────────────────────────────────────────────

info "Step 6: Stripe product and price setup"
echo ""
echo "  Get your Stripe secret key from:"
echo "  https://dashboard.stripe.com/apikeys"
echo ""
read -rsp "  Stripe secret key (sk_...): " STRIPE_SK
echo ""
[[ -z "$STRIPE_SK" ]] && fail "Stripe key required"

# Create products and prices via Stripe API
info "Creating Stripe products..."

# 10 Credits Pack
CREDITS_10=$(curl -s https://api.stripe.com/v1/prices \
  -u "$STRIPE_SK:" \
  -d "unit_amount=299" \
  -d "currency=usd" \
  -d "product_data[name]=10 AI Credits" \
  -d "product_data[metadata][product]=credits_10" \
  | grep -o '"id": *"price_[^"]*"' | head -1 | cut -d'"' -f4)
ok "10-credit pack: $CREDITS_10"

# 50 Credits Pack
CREDITS_50=$(curl -s https://api.stripe.com/v1/prices \
  -u "$STRIPE_SK:" \
  -d "unit_amount=999" \
  -d "currency=usd" \
  -d "product_data[name]=50 AI Credits" \
  -d "product_data[metadata][product]=credits_50" \
  | grep -o '"id": *"price_[^"]*"' | head -1 | cut -d'"' -f4)
ok "50-credit pack: $CREDITS_50"

# Premium Subscription
PREMIUM=$(curl -s https://api.stripe.com/v1/prices \
  -u "$STRIPE_SK:" \
  -d "unit_amount=499" \
  -d "currency=usd" \
  -d "recurring[interval]=month" \
  -d "product_data[name]=Settlement Engine Premium" \
  -d "product_data[metadata][product]=premium" \
  | grep -o '"id": *"price_[^"]*"' | head -1 | cut -d'"' -f4)
ok "Premium subscription: $PREMIUM"

# ── Step 7: Create Stripe webhook ──────────────────────────────────────────

info "Step 7: Setting up Stripe webhook..."
WEBHOOK_URL="${SUPABASE_URL}/functions/v1/stripe-webhook"

WEBHOOK_RESULT=$(curl -s https://api.stripe.com/v1/webhook_endpoints \
  -u "$STRIPE_SK:" \
  -d "url=$WEBHOOK_URL" \
  -d "enabled_events[]=checkout.session.completed" \
  -d "enabled_events[]=customer.subscription.deleted")

WEBHOOK_SECRET=$(echo "$WEBHOOK_RESULT" | grep -o '"secret": *"whsec_[^"]*"' | head -1 | cut -d'"' -f4)

if [[ -n "$WEBHOOK_SECRET" ]]; then
  ok "Webhook created: $WEBHOOK_URL"
  ok "Webhook secret: $WEBHOOK_SECRET"
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
read -rp "  Client URL [http://localhost:5173]: " CLIENT_URL
CLIENT_URL="${CLIENT_URL:-http://localhost:5173}"

npx supabase secrets set \
  --project-ref "$PROJECT_REF" \
  STRIPE_SECRET_KEY="$STRIPE_SK" \
  STRIPE_WEBHOOK_SECRET="$WEBHOOK_SECRET" \
  STRIPE_PRICE_CREDITS_10="$CREDITS_10" \
  STRIPE_PRICE_CREDITS_50="$CREDITS_50" \
  STRIPE_PRICE_PREMIUM="$PREMIUM" \
  ANTHROPIC_API_KEY="$ANTHROPIC_KEY" \
  CLIENT_URL="$CLIENT_URL" \
  SUPABASE_SERVICE_ROLE_KEY="$SERVICE_ROLE_KEY"

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

# ── Done ───────────────────────────────────────────────────────────────────

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo -e "  ${GREEN}Deployment complete!${NC}"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "  Supabase URL:    $SUPABASE_URL"
echo "  Project ref:     $PROJECT_REF"
echo "  Edge functions:  3 deployed"
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
