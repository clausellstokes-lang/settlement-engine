# DESIGN — THE MONEY WAVE (Wave B: #13 auto-reload · #14 purchase ledger · #16 Surveyor provisioning · #17 Founder transfers · M-9 single session)
### FROZEN 2026-07-19 · owner ruling (ledger @ 15ba006c): the four money builds + the
### single-session build as ONE coherent wave over shared Stripe/webhook/testing
### infrastructure. ALL code-complete and KEY-INERT (the Turnstile pattern: fully
### wired, dark until the owner supplies keys/config). Code base of record: the
### composite worktree, claude/the-composite @ aad6265e. Recon receipts inline
### (file:line anchors verified against that tip).
### AMENDED 2026-07-19 (owner ruling "do that!"): §6.8 THE STEWARDSHIP LIMB —
### lifetime promise UNTOUCHED; 5-year abandonment · $49.50 standing buyback ·
### dormancy nudge. Slice M-10; terms §12 + Q1 updated.

## §0 FROZEN LAWS (violating any of these is a design defect)
1. KEY-INERT EVERYWHERE: every new money surface ships fully wired and DARK.
   Darkness is by construction, per surface: a missing STRIPE_PRICE_* env makes
   create-checkout's `!PRICE_MAP[product]` throw (create-checkout/index.ts:313);
   the transfer flow gates on a `system_config` master row seeded disabled; the
   payout limb gates on Connect keys; auto-reload gates on the saved-card consent
   + the settings row (enabled=false default). No surface may go live from a
   deploy alone.
2. THE WEBHOOK TRUST CHAIN IS SACRED: signature verification FIRST (stripe-webhook
   index.ts:919-934, contract-tested on textual order), then the event-level claim
   (processed_webhook_events, fail-OPEN), then per-grant AUTHORITATIVE idempotency
   (system_grant_credits' atomic claim, 024; per-user founder key, 116). Every new
   handler follows the claim-once atomic-UPDATE-WHERE-state pattern; every new
   checkout-session entry point reproduces the trust-boundary compliance block
   (index.ts:870-899) verbatim-adapted. The existing 56/56 webhook execution
   suite is a behavioral pin set — extended, NEVER rewritten.
3. FAIL CLOSED on every new server surface (new RPCs revoke-all + explicit
   grants; RLS-on tables default-deny; the session gate rejects on mismatch; the
   recovery lockout refuses on error). The ONE deliberate fail-open stays the
   event-level webhook claim (documented at index.ts:965-969) — money is guarded
   by the inner belts.
4. ZERO EAGER BYTES. All new UI is lazy (the account page and FoundersPage are
   already lazy routes); client session/reload logic joins the LAZY
   authSecurity.js via the thin-wrapper idiom (auth.js:598-620). The composite's
   first-paint closure is currently OVER budget (1,040,998 vs 1,040,000 — owner
   file composite-budget-breach-998b); this wave contributes 0 eager bytes
   EXCEPT the M-9d eviction core — AMENDED 2026-07-19 (manager ruling,
   vetoable): a DECLARED ≤900 B eager allowance for the single-session
   eviction dedupe guard + store flag (measured +850 B) — the dedupe MUST be
   synchronous store state or the lifecycle pin's guarantees are vacuous;
   banner/validation/claim all lazy. The 1,040,000 hard budget is UNTOUCHED
   (post-fold closure ≈ ~1,024k via the de-eager reclaim — ~16 KB headroom).
   Otherwise zero eager holds, and
   any analytics need is met by ENRICHING existing events, never new eager names.
5. MIGRATIONS WRITTEN-NOT-DEPLOYED (the 130-136 standing pattern);
   applied-head.json stays at 117. Numbering: the perimeter lane holds ~156
   (token-bucket) unpushed on its own branch → this wave takes 157-161, PLUS an
   in-place rewrite of draft 137 (never applied; see §8 for the rationale and
   the collision-at-fold note).
6. Store actions require operationRegistry registration + `npm run
   gen:compendium-data` regen (+ EXEMPT_CEILING bump if tripped) — one regen per
   slice that adds actions. Orchestration glue lives in src/lib (a new src/domain
   file with store imports trips FOUR ratchets). Kill-list: flat materials only;
   the C11 register idiom for all account panels.
7. THE SIM NEVER READS ENTITLEMENTS (the premium-seam law, 139's charter). Seats,
   sessions, ledgers, reload settings — all interface-side. No kernel file is
   touched by this wave.
8. THE 12-MONTH-HOLD CHARGEBACK INVARIANT: a seat becomes transfer-eligible only
   12 months after its original purchase; Stripe's dispute window is ~120 days.
   THEREFORE the original $99 can no longer be charged back by the time any
   transfer can begin — the transfer machinery never has to defend against an
   original-payment dispute racing a transfer. (Owner-initiated goodwill REFUNDS
   remain possible at any age → the clawback interplay in §6.7 handles them.)
9. DESTRUCTION PATHS SPARE MONEY RECORDS: the retention purge
   (024:410-433) touches only settlements/saved_maps — founder_seats,
   founder_transfer_*, money_events, auto-reload tables are FK-independent of
   both BY CONSTRUCTION (never FK a money table to settlements — the
   dossier_entitlements CASCADE at 108:74 is the audited P0 counterexample,
   fix ordered in DOWNGRADE_TRANSITION_AUDIT §2.1). The account-deletion
   processor anonymizes profiles but NEVER deletes seat/ledger rows
   (founder_seats.holder_user_id is ON DELETE SET NULL — the seat outlives the
   account; escheat is §13 Q1).
10. ACCOUNT DATA NEVER MOVES in a transfer. Only the seat entitlement record
   moves. Explicit exclusions that NEVER transfer: AI credits, marketplace
   items, API access, B2B arrangements. The incoming holder receives NO
   founder credit bonus (once-per-account precedent — 116's per-user key +
   audit 4.5, ratified amendment b).
11. PAYOUTS ONLY VIA STRIPE CONNECT, and the whole transfer flow activates only
   after Connect platform enablement + keys + LEGAL SIGN-OFF (a HARD gate —
   §11 runbook). No side-payment machinery exists or is implied (amendment c).
12. Server prices only: zero hand-typed cent amounts in new code. Every charge
   derives from a Stripe Price (env-mapped) or a documented arithmetic on one
   (auto-reload's per-credit rate, §4.4). The $99 transfer price is the
   founder price BY REFERENCE (STRIPE_PRICE_SEAT_TRANSFER, created by the owner
   at $99 — fixed price affirmed as an anti-speculation FEATURE, amendment d).

## §1 THE LANDSCAPE (what exists — recon receipts)
- Stripe entry: create-checkout (env PRICE_MAP + server CREDIT_AMOUNTS; JWT-bound
  metadata; founder seat gate fail-closed at :404-411; redeem reserve/bind).
  Fulfillment: stripe-webhook (products premium/founder_lifetime/single_dossier/
  credit packs; monthly allowance on invoice.paid; referral + dossier + founder
  clawbacks keyed by session/invoice ids resolved at :765-790). Post-checkout
  trust anchor: verify-checkout-session. Billing portal: create-customer-portal.
- Idempotency: processed_webhook_events (event belt) + credit_grant_idempotency
  (024, delivery-key per source; 116 moved founder_grant to 'founder:'||user).
  NEW SOURCES ADDED BY THIS WAVE ('auto_reload') must extend the delivery-key
  CASE following 116's fork discipline: recreate system_grant_credits from the
  NET-CURRENT body (which includes 094/131's `pg_temp` search_path pin) with
  exactly the new-source delta. Sources not in the CASE (e.g. seat-transfer
  events, which grant no credits) take NO claim there — their claim-once lives
  in their own state machine, mirroring the redeem_code discipline
  (stripe-webhook index.ts:792-819).
- Founder today: profiles.is_founder is the ONLY truth (010's counter; 116's
  bonus dedup; clawbackFounderForSession at index.ts:585-634 is the reversal
  template — atomic flag flip as claim, then log-don't-throw steps). Migration
  137 is a DRAFT (never applied — prod head is 117): founder_seats +
  founder_seat_transfers + public projection + opt-in RPC + claim primitive,
  with the webhook hook deliberately unwired. Client: founderSeats.js (cap 30,
  5-min cache), founderLineage.js (fail-closed empty), FoundersPage (renders the
  1..30 skeleton), FounderTile.
- Entitlements: surveyor_entitlements (139; owner-read RLS, service-role writes,
  has_surveyor_entitlement() definer gate; NO Stripe product, NO provisioning
  path — audit §5 fix order = this wave's #16). dossier_entitlements (108).
  Tier truth: profiles.tier {free,premium} + is_founder + surveyor_entitlements.
- Downgrade machinery: handle_premium_downgrade / restore_premium_settlements /
  purge_expired_plan_inactive_assets (024:334-433). Founder-guarded; 3-month
  retention; purge deletes settlements/saved_maps only.
- Auth reality: NO TOTP/MFA enrollment exists. Reauth = password
  (authSecurity.js reauthenticateWithPassword → signInWithPassword). Recovery =
  security questions + rate-limited lockout (066-068). signOutEverywhere exists.
  "2FA" in this wave therefore means PASSWORD REAUTH + EMAILED CHALLENGE CODE
  (hashed at rest, TTL, attempt-limited — the 067 lockout idiom). A future TOTP
  adoption swaps the challenge issuer, not the flow (§13 Q4).
- Mail: send-email (authed lifecycle templates, Resend, unconfigured → graceful
  {ok:false}) and _shared/referralEmails.ts (webhook-side direct-Resend,
  NEVER-throw contract). Wave E's transactional seam is landing in a PARALLEL
  lane — this wave designs against a template-name+payload interface and flags
  every consumer as a coordination point (§9 hazards).
- Scheduler idiom: 115 pricing-resync-cron — pg_cron fires hourly UTC, a
  should-dispatch fn gates to local cadence, pg_net POSTs to an edge function
  authenticated by a shared secret; INERT until the operator sets url+secret in
  system_config. This wave's finalize/payout/expiry sweeps reuse it exactly.
- Velocity: 125 user_action_rate_limits + _consume_action_rate_limit — the
  reusable per-user/action fixed-window claim for transfer + session actions.
- Account page: lazy AccountPage + section components; ACCOUNT_SECTIONS rail
  (AccountNav.jsx:40-48); purely-presentational sections, state in AccountPage.
- Analytics: src/lib/analytics.js track(EVENTS.X, props) through the queue seam;
  enrich = zero eager, new names = eager bytes (LAW 4: enrich-only this wave).

## §2 THE MONEY SPINE — money_events + the fortress extension (slice M-1)
ONE append-mostly table that every money movement mirrors into; the purchase
ledger (#14) reads it, the transfer flow (#17) writes its payment/payout/refund
rows into it, auto-reload (#13) writes its top-ups into it.

MIGRATION 157_money_events.sql:
```
money_events (
  id            uuid PK default gen_random_uuid(),
  event_key     text NOT NULL UNIQUE,          -- writer-computed claim key (below)
  user_id       uuid NULL references auth.users(id) ON DELETE SET NULL,
                -- NULL for anonymous single_dossier rows; SET NULL so a deleted
                -- account never destroys the financial record (LAW 9)
  occurred_at   timestamptz NOT NULL,
  kind          text NOT NULL check (kind in ('credit_pack','founder_seat',
                  'single_dossier','subscription_start','subscription_renewal',
                  'surveyor_start','surveyor_renewal','auto_reload',
                  'seat_transfer_payment','seat_transfer_payout','refund_note')),
  amount_cents  int NOT NULL,
  currency      text NOT NULL default 'usd',
  description   text NOT NULL,                 -- server-composed, human-readable
  receipt_url   text,                          -- Stripe-hosted, permanent (below)
  status        text NOT NULL default 'paid'
                  check (status in ('paid','refunded','disputed','reversed')),
  stripe_session_id text, stripe_invoice_id text,
  stripe_payment_intent_id text, stripe_charge_id text,
  metadata      jsonb NOT NULL default '{}',
  created_at    timestamptz NOT NULL default now()
);
-- RLS ON. ONE policy: owner SELECT own rows (auth.uid() = user_id). No client
-- writes ever (service-role only). Index (user_id, occurred_at desc).
```
- EVENT_KEY = the redelivery shield: `sess:{session_id}` for checkout
  fulfillments, `inv:{invoice_id}` for invoices, `pi:{payment_intent_id}` for
  auto-reloads, `payout:{case_id}` for transfers-out. Writers use
  `upsert(..., { onConflict: 'event_key', ignoreDuplicates: true })` — a
  replayed webhook re-inserts nothing (the single_dossier_purchases idiom,
  index.ts:1125-1138).
- WRITER MAP (all inside dispatchStripeEvent, each NEVER-throw into the money
  path — a mirror failure logs via logError and must not stall fulfillment):
  * checkout.session.completed (paid) → one row per product branch: kind from
    product (credit_pack/founder_seat/single_dossier/subscription_start for
    'premium', surveyor_start for 'surveyor' (§5), seat_transfer_payment for the
    transfer purpose (§6.6)); amount = session.amount_total.
  * invoice.paid → subscription_renewal (or *_start when billing_reason is
    subscription_create) with receipt_url = invoice.hosted_invoice_url
    (permanent by Stripe contract).
  * RECEIPT CAPTURE for one-time payments: retrieve the session's
    payment_intent → latest_charge.receipt_url at webhook time (one extra
    Stripe call on the fulfillment path, never-throw; a missing receipt leaves
    the column NULL and the UI shows no link — honest degradation).
  * charge.refunded / charge.dispute.created → resolveChargeClawbackKeys
    (index.ts:765) already computes the candidate keys; ADD a status flip:
    UPDATE money_events SET status='refunded'|'disputed' WHERE event_key in
    (candidate keys' sess:/inv: forms). Append-mostly, not append-only: the
    STATUS column is the one sanctioned mutation (documented in the table
    comment); everything else is immutable.
- BACKFILL (one-time, owner-run at activation): an admin-actions verb
  `backfill_money_events` (highest-role, audited) that pages
  stripe.checkout.sessions.list + stripe.invoices.list, composes the same rows
  through the same event_key upsert (idempotent — safe to re-run). Runbook §11
  step 3. NOT a cron; a manual verb.

## §3 #14 — THE PURCHASE LEDGER (slice M-2)
- A "Past purchases" panel in the account SUBSCRIPTION section (below the
  credit/tier cards; same Section wrapper, C11 register idiom): rows of
  date · kind label · amount · status badge (refunded/disputed shown plainly) ·
  "Receipt" link (receipt_url, target _blank rel noopener). 25 rows + a
  "Show earlier" pager (range query on occurred_at). Reads OUR table via the
  owner-SELECT policy — no client Stripe calls, instant, offline-proof.
- Data access: `src/lib/purchaseHistory.js` (lazy import from the section) —
  fetchPurchaseHistory({before, limit}) → normalized rows; never throws
  (fail-closed empty + a quiet inline "couldn't load" line, founderLineage
  idiom).
- Store surface: NONE required (component-local state in AccountPage's existing
  handler idiom — props down, purely presentational section). If the
  implementer finds a store action necessary, LAW 6 applies.
- Kinds → labels live beside the fetch (purchaseHistory.js), NOT in pricing.js
  (no new eager bytes; pricing.js is eager-adjacent).

## §4 #13 — AI-CREDIT AUTO-RELOAD, reload-to-target (slice M-3)
The Anthropic-counterpart model verbatim (owner amendment): "when balance falls
below X credits, bring it back up to Y." Off by default. Every reload lands in
money_events + the credit ledger.

4.1 MIGRATION 158_credit_auto_reload.sql:
```
credit_auto_reload_settings (
  user_id uuid PK references auth.users(id) on delete cascade,
  enabled boolean NOT NULL default false,
  threshold_credits int NOT NULL default 5  check (threshold_credits between 1 and 500),
  target_credits    int NOT NULL default 25 check (target_credits   between 2 and 1000),
  monthly_cap_cents int NOT NULL default 4000 check (monthly_cap_cents between 500 and 20000),
  updated_at timestamptz NOT NULL default now(),
  check (target_credits > threshold_credits)
);
credit_auto_reload_attempts (
  id uuid PK, user_id uuid NOT NULL references auth.users(id) on delete cascade,
  state text NOT NULL default 'pending' check (state in
    ('pending','requires_action','succeeded','failed','canceled')),
  credits_delta int NOT NULL check (credits_delta > 0),
  amount_cents  int NOT NULL check (amount_cents > 0),
  month_bucket  text NOT NULL,               -- 'YYYY-MM' (UTC) for cap sums
  stripe_payment_intent_id text UNIQUE,
  failure_reason text, created_at timestamptz default now(), resolved_at timestamptz
);
-- RLS: owner SELECT both tables. Writes: settings via set_auto_reload_settings()
-- (SECURITY DEFINER, authenticated, validates ranges, upserts own row only);
-- attempts service-role only.
-- UNIQUE partial index: one OPEN attempt per user
--   (user_id) WHERE state in ('pending','requires_action').
claim_auto_reload_attempt(p_user uuid) — SERVICE-ROLE definer. Atomically:
  re-read settings (enabled, else refuse) · balance = get_credit_balance ·
  refuse unless balance < threshold · delta = target − balance ·
  refuse if a resolved attempt exists within the last 10 minutes (cooldown per
  crossing) · refuse if (sum of amount_cents over succeeded+open attempts in
  this month_bucket) + this amount > monthly_cap_cents · INSERT the pending row
  (the partial unique index is the concurrency claim — the loser reads the
  conflict and refuses) · return {attempt_id, credits_delta}.
-- PLUS the 116-discipline recreate of system_grant_credits: delivery_key CASE
-- gains `when source = 'auto_reload' then metadata->>'stripe_payment_intent_id'`
-- (net-current body, pg_temp pin preserved, everything else verbatim).
```
4.2 CONSENT + SAVED CARD: create-checkout accepts `savePaymentMethod: true`
(signed-in + payment-mode + credit-pack products ONLY — never anonymous, never
subscription mode where the card saves anyway) → adds
`payment_intent_data: { setup_future_usage: 'off_session' }` to sessionParams.
The PurchaseModal shows the card-network-compliant consent line (register
idiom) with the checkbox OFF by default; the account auto-reload panel links to
the BILLING PORTAL (create-customer-portal, exists) for card management. No raw
card data ever touches our code.
4.3 THE TRIGGER — AT THE DEBIT POINT: a shared `_shared/autoReload.ts` helper,
`maybeAutoReload(admin, userId)`, called fire-and-forget (`void ...catch(log)`)
AFTER each successful spend/settle in the credit-spending edge functions. The
implementer censuses the debit sites (`grep -rn "spend_credits\|settle_ai_spend"
supabase/functions/` — generate-narrative, generate-chronicle, custom-content,
style-overhaul, interpret-session, ai-analyst, parley, surveyor-autonomy at
minimum) and adds the one-line hook to each. NEVER-throw contract
(referralEmails discipline): a reload failure can never fail a paid generation.
The helper: call claim_auto_reload_attempt → on a claim, price + create the PI
(4.4/4.5) → stamp stripe_payment_intent_id on the attempt.
LOW-BALANCE NOTIFICATION (auto-reload OFF or cap-blocked): the same helper, when
settings exist and balance just crossed below threshold and enabled=false (or
the cap refused), sends the low-balance template through the Wave E seam
(coordination point; inert until the seam + keys land). At most one per
month_bucket per user (a notified_at stamp on the settings row — add the column).
4.4 PRICING THE DELTA — zero hand-typed numbers: unit rate =
`price.unit_amount / CREDIT_AMOUNTS['credits_25']` where price is the Stripe
Price retrieved from STRIPE_PRICE_CREDITS_25 (cached in-memory 10 min).
amount_cents = round(credits_delta × rate). Missing env / retrieve failure →
the helper no-ops (feature dark, LAW 1). The starter-pack rate is the
deliberate choice (no volume discount on convenience top-ups — vetoable
judgment; flip the env name to change the anchor).
4.5 THE OFF-SESSION PAYMENT: stripe.paymentIntents.create({amount, currency,
customer: profiles.stripe_customer_id, off_session: true, confirm: true,
payment_method: <customer's default, else the most recent attached card>,
metadata: { purpose:'credit_auto_reload', supabase_user_id, attempt_id,
credits: String(delta) }}, { idempotencyKey: `auto-reload-${attempt_id}` }).
- SUCCESS is NOT trusted from the create call. The webhook confirms:
  `payment_intent.succeeded` with metadata.purpose==='credit_auto_reload' →
  system_grant_credits(user, credits, 'auto_reload', {stripe_payment_intent_id})
  (atomic claim per 4.1) → attempt state 'succeeded' (claim-once UPDATE WHERE
  state='pending') → money_events row (kind auto_reload) → receipt captured
  from latest_charge. `payment_intent.payment_failed` (same purpose) → attempt
  'failed' + failure_reason + notify via the seam. Webhook-confirmed BEFORE any
  credit grant — the create call's synchronous result only stamps the PI id.
- SCA: an authentication_required error at create → attempt 'requires_action'
  + notify-to-complete email (seam): the account panel shows "verification
  needed" with a button that starts a NORMAL on-session checkout for the same
  delta (a fresh create-checkout credit purchase priced at 4.4's rate — a new
  dynamic-price session is out of scope; the button buys the nearest pack ≥
  delta instead, plainly labeled). NEVER silent-retry. Open attempts expire to
  'canceled' after 72h via the §6.6 cron sweep (same due-runner).
4.6 ACCOUNT UI (in the Subscription section, beside Past purchases): the
auto-reload register — enabled toggle · threshold input · target input (initial
SUGGESTION = the median of the user's own past credit-pack purchases from
money_events, computed client-side, else the 25 default) · monthly cap ·
this-month spent line · open-attempt status line. Store actions
(setAutoReloadSettings, refreshAutoReloadStatus or equivalent) → LAW 6
(operationRegistry + regen).

## §5 #16 — SURVEYOR PROVISIONING (slice M-4)
Closes the audit §5 gap: purchase→grant through the webhook fortress + an admin
verb. Surveyor stays entitlement-truth (139), NOT a profiles.tier value.
- PRODUCT: `surveyor` joins PRICE_MAP (env STRIPE_PRICE_SURVEYOR — unset =
  unpurchasable, LAW 1) and SUBSCRIPTION_PRODUCTS (subscription mode; monthly —
  price set by the owner in Stripe, §13 Q2). Signed-in only (default auth path).
- MIGRATION 159_surveyor_provisioning.sql:
  * ALTER surveyor_entitlements ADD stripe_subscription_id text,
    stripe_customer_id text (nullable — manual/founder grants carry none);
    UNIQUE on stripe_subscription_id.
  * grant_surveyor_entitlement(p_user, p_source, p_subscription_id,
    p_customer_id) — service-role definer: upsert (re-grant reactivates a
    revoked row, stamps granted_at, clears revoked_at); records the sub id.
  * revoke_surveyor_entitlement(p_user, p_reason) — service-role definer:
    status→'revoked', revoked_at; keyed variant
    revoke_surveyor_entitlement_by_subscription(p_subscription_id) for the
    webhook (stale-sub-safe: revokes only the row RECORDING that sub id).
  * RIDER (audit 1.3 FIX ORDERED): surveyor_byok_set gains an entitlement gate
    in its body — refuse unless has_surveyor_entitlement() OR the caller's
    profile has is_founder (the One Door #15 population). Recreated
    net-current-plus-delta, 116 discipline.
- WEBHOOK LIMBS:
  * checkout.session.completed, product==='surveyor': the premium branch's
    out-of-order live-status guard verbatim-adapted (index.ts:1231-1247), then
    grant_surveyor_entitlement(user, 'subscription', subId, customerId) +
    money_events (surveyor_start). NO profiles.tier write, NO auth metadata
    write — the entitlement IS the truth (the client bit is Wave B #15's lane).
  * customer.subscription.deleted: BEFORE the premium path, probe
    revoke_surveyor_entitlement_by_subscription(subscription.id); if it revoked
    a row, `break` (this deletion was a Surveyor sub — it must NOT fall through
    to the Cartographer downgrade). The existing premium logic is untouched
    below it (behavioral pins stay green).
  * ⚠ THE ALLOWANCE TRAP (design defect if missed): grantMonthlyAllowanceIfNeeded
    currently grants 30 credits on ANY subscription invoice
    (index.ts:221-227 gates only on billing_reason). A Surveyor invoice would
    mint the Cartographer allowance. FIX IN M-4: the allowance additionally
    requires the invoice's price id to be STRIPE_PRICE_PREMIUM (read the first
    line's price.id; absent env or absent line → current behavior for
    back-compat, logged). Whether Surveyor carries its OWN monthly managed-
    credit allowance is §13 Q3 (ships with none).
- ADMIN VERBS: admin-actions gains 'grant_surveyor' / 'revoke_surveyor'
  (highest-role arm, audited via the existing _audit_action idiom, target by
  user id). This is the concierge path that replaces manual SQL TODAY, before
  any Stripe price exists — the verb is live-on-deploy (no key needed; it moves
  no money).

## §6 #17 — FOUNDER SEAT TRANSFERS (slices M-5..M-8)
The owner's ratified model: 30 seats · $99 original · transferable ONLY via the
official in-product process · fixed $99 transfer price split $49.50/$49.50 ·
12-month minimum hold + 12-month per-seat cooldown · direct nomination by email
· initiate (2FA+reauth) → nominee verification (2FA) → accept+pay $99 → 72h
cooling (either party or anomaly detection aborts) → finalize (entitlement
moves; account data never) → payout to the outgoing holder 14-30 days later via
Stripe Connect. Positioning: a "transferable lifetime individual software
license" — lifetime = the commercial lifetime of the service, explicitly NOT an
investment or security (§12 copy).

6.1 THE SEAT REGISTER — REWRITE MIGRATION 137 IN PLACE (slice M-5). Prod head is
117; 137 was never applied anywhere, and its own header says "written so it CAN
be deployed unchanged once the owner signs the shape" — the 2026-07-19 ruling IS
that sign-off, with amendments. Rewriting in place (rather than a superseding
migration) keeps the chain free of duplicate table definitions and keeps
list_founder_seats_public where its shipped client (founderLineage.js:42)
expects it. The rewrite KEEPS everything 137 has (both tables, seed, RLS
posture, public projection, opt-in RPC, claim primitive) and ADDS to
founder_seats:
```
  original_purchase_at timestamptz,          -- stamped at claim; NULL pre-sale
  acquired_via  text NOT NULL default 'purchase'
                  check (acquired_via in ('purchase','transfer','estate','grant')),
  transfer_eligible_at timestamptz,          -- held_since + 12 months, stamped
  last_transfer_at     timestamptz,
  cooldown_until       timestamptz,          -- last_transfer_at + 12 months
  security_status text NOT NULL default 'normal'
                  check (security_status in ('normal','transfer_locked','flagged','escheat'))
```
claim_next_founder_seat stamps original_purchase_at/held_since/
transfer_eligible_at. THE WEBHOOK HOOK IS NOW WIRED (137's deliberate deferral
ends): the founder_lifetime branch calls claim_next_founder_seat(userId) after
the profile writes — never-throw into fulfillment (log-don't-throw; is_founder
remains the fast flag and the money truth; a missed seat row is operator-
repairable via the idempotent primitive). clawbackFounderForSession gains the
mirrored release: a new service RPC release_founder_seat_on_clawback(p_user) —
clears holder (seat returns to the unclaimed pool; the refunded seat is
resellable, cap intact), appends a lineage note — called after the is_founder
flip, log-don't-throw (the existing post-claim posture at index.ts:610-633).
6.2 THE CASE MACHINE — MIGRATION 160_founder_transfer_cases.sql (slice M-5):
```
founder_transfer_cases (
  id uuid PK, seat_id smallint NOT NULL references founder_seats(seat_id),
  from_user uuid NOT NULL references auth.users(id),
  to_email_lower text NOT NULL,
  to_user uuid references auth.users(id),        -- bound at nominee verification
  state text NOT NULL default 'initiated' check (state in
    ('initiated','nominee_verified','awaiting_payment','cooling',
     'finalized','aborted','expired','reversed')),
  initiated_at timestamptz NOT NULL default now(),
  nominee_verified_at timestamptz, accepted_at timestamptz, paid_at timestamptz,
  stripe_session_id text UNIQUE, price_cents int,     -- audit snapshot of $99
  cooling_ends_at timestamptz, finalized_at timestamptz,
  aborted_at timestamptz, abort_actor text
    check (abort_actor in ('outgoing','incoming','system_anomaly','admin','chargeback')),
  abort_reason text,
  payout_status text NOT NULL default 'none' check (payout_status in
    ('none','scheduled','releasing','released','held','failed')),
  payout_due_at timestamptz, payout_amount_cents int,  -- 4950, computed price/2
  stripe_transfer_id text UNIQUE, connect_account_id text,
  updated_at timestamptz NOT NULL default now()
);
-- PARTIAL UNIQUES: one live case per seat AND per from_user AND per to_user
--   (three partial unique indexes WHERE state in
--    ('initiated','nominee_verified','awaiting_payment','cooling')).
founder_transfer_events (   -- the complete audit log (append-only, no policies)
  id uuid PK, case_id uuid NOT NULL references founder_transfer_cases(id),
  at timestamptz NOT NULL default now(),
  actor text NOT NULL check (actor in ('outgoing','incoming','system','webhook','admin')),
  event text NOT NULL, detail jsonb NOT NULL default '{}'
);
founder_transfer_challenges (  -- emailed 2FA codes, hashed at rest
  id uuid PK, case_id uuid NOT NULL references founder_transfer_cases(id),
  party text NOT NULL check (party in ('outgoing','incoming')),
  purpose text NOT NULL check (purpose in ('initiate','nominee_verify','abort')),
  code_hash text NOT NULL,                    -- crypt(code, gen_salt('bf')), 066 idiom
  expires_at timestamptz NOT NULL,            -- now() + 10 min
  attempts int NOT NULL default 0, consumed_at timestamptz,
  created_at timestamptz NOT NULL default now()
);
-- RLS: ALL THREE tables service-role only (RLS-on, zero policies — the 122
-- idiom). Party-facing reads go through ONE definer projection RPC,
-- my_transfer_case_status(), which emits ONLY the caller's own case's safe
-- fields (state, timestamps, seat number; the other party's email is shown
-- ONLY to the party that already knows it — from_user sees to_email, to_user
-- never sees from's email, both see opted display names at most).
-- state-transition RPCs (ALL service-role, ALL claim-once atomic
-- UPDATE...WHERE state='<expected>' RETURNING, all appending a
-- founder_transfer_events row in the same transaction):
--   transfer_case_open(seat, from_user, to_email)      → 'initiated'
--     (validates: eligibility timestamps, cooldown, security_status='normal',
--      is_founder, the three live-case uniques, to_email ≠ from's email)
--   transfer_case_bind_nominee(case, to_user)          → 'nominee_verified'
--     (validates: to_user's email matches to_email_lower CI, to_user holds NO
--      seat and is party to no live case)
--   transfer_case_mark_awaiting_payment(case, session) → 'awaiting_payment'
--   transfer_case_mark_paid(case, session)             → 'cooling'
--     (stamps paid_at, cooling_ends_at = now() + 72h, price snapshot)
--   transfer_case_abort(case, actor, reason)           → 'aborted'
--     (legal from initiated..cooling only)
--   transfer_case_finalize(case)                       → 'finalized'  (6.5)
--   transfer_case_reverse(case, reason)                → 'reversed'   (6.7)
--   has_active_transfer_lock(p_user uuid) → boolean    (recovery lockout read)
--   issue_transfer_challenge / verify_transfer_challenge (hash, TTL, 5-attempt
--     cap; over-cap → case security event + 1h party lockout — 067 idiom)
```
6.3 THE CHOREOGRAPHY — edge function `founder-transfer` (slice M-6; new
function, JWT-authed, shared CORS, botGuard, 125-velocity on every action,
sessionGate (§7) on every action, MASTER SWITCH first: system_config
'founder_transfers' {enabled:false} seeded by 160 — disabled → every action
returns {error:'feature_unavailable'} and the UI renders the §12 "coming under
the published terms" line instead of controls).
- `initiate` (outgoing): requires (a) fresh password reauth client-side
  (auth.reauthenticateWithPassword immediately before — the server cannot see
  it, so the server ALSO requires (b) the emailed challenge: initiate issues
  the code; `confirm_initiate` verifies it and only THEN opens the case via
  transfer_case_open). Anomaly pre-checks REFUSE with 'security_hold': password
  changed or recovery completed within the last 7 days (auth.users
  updated-at/audit read via admin client); velocity over-cap; seat
  security_status ≠ normal. On open: notify BOTH the outgoing holder (receipt
  of intent) and the nominee (invitation) via the seam.
- `nominee_accept_start` (incoming, authed): finds the 'initiated' case whose
  to_email_lower = caller's verified email (lowercased); issues the incoming
  challenge. `nominee_confirm` verifies → transfer_case_bind_nominee →
  creates the Stripe Checkout session ITSELF (NOT via create-checkout — the
  session must bind to a validated case): mode payment, price
  STRIPE_PRICE_SEAT_TRANSFER, customer = incoming's (create if absent),
  metadata { purpose:'founder_seat_transfer', transfer_case_id, supabase_user_id:
  <incoming, from the verified JWT> }, success/cancel URLs to the account
  transfer panel → transfer_case_mark_awaiting_payment → return session.url.
  TRUST-BOUNDARY COMPLIANCE (LAW 2): user id from the verified JWT only;
  product/price server-controlled; the case id is server-validated state, not a
  client assertion — reproduce the index.ts:870-899 comment block adapted, and
  extend the Tier 0.5 contract test to this second session-creating entry point.
- `abort` (either party): authed + challenge code, OR the one-click EMAIL ABORT
  TOKEN — every cooling-period notification embeds a single-use signed token
  (hash stored in detail of the events row; 72h TTL) so a party locked out of
  their session (§7 interplay) or their account (takeover victim) can STILL
  halt the transfer. Legal from initiated..cooling; during cooling a paid case
  aborts WITH REFUND: stripe.refunds.create({payment_intent}, {idempotencyKey:
  `abort-refund-${case_id}`}) + money_events status flip. NEVER after finalize.
- `status`: my_transfer_case_status projection for the account panel.
- `payout_onboarding` (outgoing, ≥ cooling): Connect Express account create +
  account link (6.6). Key-inert.
- EXPIRY: initiated/nominee_verified/awaiting_payment cases older than 14 days
  → 'expired' by the due-runner (6.6); unpaid sessions also die with Stripe's
  ~24h session expiry (checkout.session.expired already flows through the
  webhook — add: if the expired session belongs to an awaiting_payment case,
  regress the case to 'nominee_verified' so acceptance can re-mint a session).
- RECOVERY LOCKOUT: auth-recovery's lookup/verify actions add a
  has_active_transfer_lock check on the resolved user: an account party to a
  live case REFUSES question-based recovery ('recovery is paused during an
  account transfer — contact support') — fail CLOSED including on transport
  error to the lock read (recovery is rare; a stuck lock is a support case,
  never a silent takeover ramp). Password RESET via email remains available
  (it proves mailbox control, which the challenge codes already trust), but a
  password change fires a 'credentials_changed' anomaly event on the case +
  notifies both parties (the 72h cooling absorbs the review).
6.4 THE UI (slice M-6): a "Seat transfer" block on the FoundersPage-adjacent
account surface — inside the account Subscription section, rendered ONLY for
is_founder (outgoing view: eligibility clock or the initiate flow; states as a
quiet register timeline) and for a signed-in nominee with a pending invitation
(incoming view: verify → pay). All lazy, C11 register idiom, 44px law, flat
materials. FoundersPage itself gains ONE line under the lineage: the §12
promise sentence (copy-only; the page already renders lineage from the
projection, which the finalize keeps current automatically).
6.5 FINALIZE (slice M-7): transfer_case_finalize(case) — SERVICE-ROLE, ONE
transaction: guard state='cooling' AND cooling_ends_at ≤ now() AND
payout-blocking disputes absent → append founder_seat_transfers lineage row
(from_display_name snapshot per 137) → founder_seats: holder_user_id=to_user,
held_since=now(), acquired_via='transfer', last_transfer_at=now(),
cooldown_until=+12mo, transfer_eligible_at=+12mo (the incoming holder's OWN
12-month hold), display_name_optin=NULL + status 'pending' (the new holder
starts un-opted) → profiles: from.is_founder=false, to.is_founder=true +
to.tier='premium' → state='finalized', payout_status='scheduled',
payout_due_at = finalized_at + interval '14 days' (the 14-30 window's floor;
owner dial in system_config), payout_amount_cents = price_cents / 2. RETURNING
the moved ids. The EDGE LEG (the due-runner, 6.6) then performs the non-DB
steps, each idempotent + log-don't-throw (the clawback posture): auth.admin
metadata for both users (from: is_founder=false + tier per their own
subscription state — run handle_premium_downgrade(from) ONLY if they hold no
live Cartographer subscription (profiles.stripe_subscription_id null) — a
subscribed ex-founder keeps premium via their sub; to:
restore_premium_settlements + metadata tier premium/is_founder true) + both
notification emails + a money_events note. NO credit movement of any kind
(LAW 10).
6.6 THE DUE-RUNNER (slice M-7/M-8): reuse the 115 idiom EXACTLY — a
'founder_transfer_cron' system_config row (inert: url/secret null), pg_cron
hourly UTC, pg_net POST to `founder-transfer` action 'run_due' (shared-secret
header, constant-time compare). run_due sweeps, each step claim-once:
finalize-due cases (6.5) · expire stale cases (6.3) · cancel stale auto-reload
attempts (§4.5) · release due payouts: claim payout_status
'scheduled'→'releasing' (atomic UPDATE...WHERE payout_status='scheduled' AND
payout_due_at ≤ now() AND connect_account_id IS NOT NULL AND Connect enabled) →
stripe.transfers.create({amount: payout_amount_cents, currency,
destination: connect_account_id, metadata:{case_id}}, {idempotencyKey:
`payout-${case_id}`}) → 'released' + stripe_transfer_id + money_events
(seat_transfer_payout). Failure → 'failed' + loud log (operator surface).
Connect DISABLED or no connected account at due time → 'held' + a monthly
reminder through the seam.
  THE PAYOUT ELECTION (owner fallback ruling 2026-07-19 — transfers must be
  able to FULLY LIGHT without Connect): at initiate, the outgoing holder
  elects payout form — 'connect_cash' (default when Connect is live) or
  'account_credits': $49.50 delivered as AI credits at payout-due time via
  system_grant_credits(user, round(4950 / the §4.4 rate), 'seat_payout',
  {case_id}) — same due-runner claim-once, 'seat_payout' joins the
  delivery-key CASE per 116 discipline, money_events row keeps kind
  seat_transfer_payout with metadata {form:'credits'}. When Connect is ABSENT
  (pre-approval launch), 'account_credits' is the only immediate option;
  'connect_cash' elections park at 'held' and the election is re-openable
  from the account panel while parked. The buyback (§6.8) gains the SAME
  election. The credits form has NO money-transmission surface (credits are
  the company's own product) — legal reviews both forms in the §12 bundle.
  Schema: payout_form text NOT NULL default 'connect_cash' check in
  ('connect_cash','account_credits') on founder_transfer_cases AND
  founder_seat_buybacks. The Stripe idempotency key makes the
claim-crash-replay window double-payout-proof: a re-run re-sends the SAME
transfer request.
6.7 CLAWBACK / DISPUTE INTERPLAY (slice M-7):
- charge.refunded / charge.dispute.created resolving to a TRANSFER session key
  (the case's stripe_session_id — probe alongside the existing three clawbacks
  in the refund loop, index.ts:1409-1437):
  * case cooling → transfer_case_abort(actor 'chargeback') — no seat ever moved.
  * finalized, payout not released → transfer_case_reverse: payout 'held', seat
    moves BACK (lineage row appended 'reversal' — append, never erase),
    profiles/auth flags reversed via the same idempotent steps, state
    'reversed'. The nominee's money came back via the dispute itself.
  * finalized, payout released → seat security_status='flagged' + money_events
    'disputed' + loud operator log. HONEST LEDGER: the company is out $49.50
    and claws the seat administratively — recorded as an accepted-risk residual
    (the 14-day payout floor covers the fast-fraud window; slow disputes are a
    support case, not a code path).
- Original-$99 refund (goodwill) of a seat CURRENTLY IN a live case:
  clawbackFounderForSession FIRST aborts any live case for that holder's seat
  (transfer_case_abort 'admin', with refund if paid), THEN flips is_founder,
  THEN release_founder_seat_on_clawback (6.1). Ordering pinned by a test.
- The 12-month hold invariant (LAW 8) makes the dispute-of-original-payment ×
  live-transfer race UNREPRESENTABLE by timing; the goodwill-refund path above
  is the only survivor and it is serialized.

6.8 THE STEWARDSHIP LIMB (slice M-10; owner ruling 2026-07-19 — the dormancy
question resolved AGAINST inactivity forfeiture: the lifetime promise stays
whole; reclamation is voluntary-first, abandonment-last):
- STANDING BUYBACK: any founder may sell their seat back to the company for
  $25 — ONE config dial (system_config seat_buyback_cents, default 2500; owner
  ruling 2026-07-19), SHARED with the abandonment credit; the TRANSFER share
  stays price/2 = $49.50 by explicit same-day ruling (the even split is the
  anti-side-deal incentive). Any time, via the account transfer panel. Flow (challenge-code
  confirmed, the 6.2 idiom; refused while a live transfer case exists or
  security_status ≠ normal): claim-once seat release → lineage row
  ('buyback' — append, never erase) → holder cleared (seat returns to the
  unclaimed pool; cap intact; resellable at $99) → is_founder=false + the 6.5
  subscribed-ex-founder tier logic → a founder_seat_buybacks row (id, seat_id,
  user_id, state pending_payout/paid/held, amount_cents from the
  seat_buyback_cents dial (2500), connect fields;
  rides the 137 rewrite) → payout via the SAME Connect release in the
  due-runner (idempotencyKey `buyback-${id}`; Connect absent → 'held' + seam
  reminder — LAW 1 posture identical to transfer payouts) → money_events kind
  'seat_buyback' (ADD to 157's kind check). Master switch: system_config
  'founder_buyback' {enabled:false} seeded by 160.
- DORMANCY NUDGE (operational, not a term): the due-runner sweeps seats whose
  holder's last sign-in (current_account_session.updated_at; missing row =
  pre-M9 session → fall back to profiles.updated_at, never nudge on absent
  data) is older than 18 months → 'seat_dormancy_nudge' email through the seam
  presenting BOTH exits (nominate a transfer · take the buyback), at most once
  per 12 months (last_dormancy_nudge_at on founder_seats, rides the 137
  rewrite).
- ABANDONMENT (the promise-preserving reclamation of last resort; thresholds
  in system_config, defaults: dormant_years 5 · notice_window_days 90 ·
  notice_count 3): seats past the dormancy threshold enter a notice sequence
  (stamped abandonment_notice_started_at, rides 137); ANY sign-in during the
  window clears the stamp; unresponsive at window end → security_status
  'escheat' + holder cleared + lineage row 'abandonment' + money_events
  'refund_note' with metadata {claimable_cents: seat_buyback_cents (2500)} —
  the $25 is HELD AS A CLAIMABLE CREDIT (support-mediated claim; never fired at a years-dead card).
  Escheat seats are NEVER auto-resold (Q1). The sweep will fire for no one
  before ~2031; it exists now under the build-completeness doctrine.

## §7 M-9 — SINGLE CONCURRENT SESSION, last-login-wins (slice M-9)
One active session per account, uniform across tiers (free included). A new
sign-in ALWAYS succeeds and supersedes the previous session — never blocked.
Serial device-switching = a 5-second re-auth; simultaneous two-person use = a
tug-of-war (the intended deterrent). ⚠ CONSTRAINT: the Supabase org is NOT on
Pro yet — enforcement is OURS, plan-independent, from day one; the Pro
dashboard "enforce single session" toggle is documented defense-in-depth at the
refresh layer (§11 step 8), NEVER a dependency.
7.1 MIGRATION 161_single_session.sql:
```
current_account_session (
  user_id uuid PK references auth.users(id) on delete cascade,
  session_id uuid NOT NULL,            -- the JWT's session_id claim
  signed_in_at timestamptz NOT NULL default now(),
  device_label text,                   -- coarse, server-derived from UA; never PII
  updated_at timestamptz NOT NULL default now()
);
-- RLS: owner SELECT own row (feeds the account panel). Writes via RPCs only.
claim_current_session(p_device_label) — SECURITY DEFINER, authenticated:
  reads auth.jwt()->>'session_id' (refuse if absent), upserts the caller's row.
  Last claim wins by construction.
is_current_session() — definer, authenticated, STABLE: true iff the caller's
  JWT session_id matches their row; A MISSING ROW RETURNS TRUE (rollout
  safety: sessions minted before this deploy are adopted lazily on their next
  SIGNED_IN claim, never mass-evicted on migration day).
assert_current_session() — definer: raises 'session_superseded' when
  is_current_session() is false. The DB-side belt for value-moving RPCs.
```
7.2 SERVER ENFORCEMENT — `_shared/sessionGate.ts`: after the standard
getUser() auth resolve, decode the (already signature-verified) JWT's payload
segment and read `session_id`; admin-client read of current_account_session;
MISMATCH → 401 {error:'session_superseded'} (fail CLOSED); MISSING ROW → allow
+ claim it (lazy adoption); missing claim in the JWT → allow + log (never
brick an unexpected token shape into a support fire). Wired into EVERY paid
surface: ai-analyst, generate-narrative, generate-chronicle, custom-content,
style-overhaul, interpret-session, parley, surveyor-autonomy, surveyor-byok,
create-checkout (authed products only — the anonymous single_dossier path has
no session), create-customer-portal, verify-checkout-session, account-actions,
credit-auto-reload settings paths, and ALL founder-transfer actions. Instant
eviction where money flows. DB BELT (lettered commit, separately testable):
assert_current_session() added at the top of spend_credits — the
missing-row-allows semantics keeps every existing creditFlow pin green.
NOTE the refresh-token reality: a superseded device's refresh token still mints
valid JWTs until Pro's toggle exists — but those JWTs carry the OLD session_id,
so every gated surface rejects them anyway. The gate, not the token, is the
enforcement.
7.3 CLIENT — claim, validate, evict (all in the LAZY authSecurity.js via the
auth.js thin-wrapper idiom; store actions registered per LAW 6):
- On SIGNED_IN (authSlice.js:222 branch): call claim_current_session with a
  coarse device label (browser + OS family, client-composed).
- Validation: window focus/visibilitychange + a 5-minute interval call
  is_current_session(); any paid-surface 'session_superseded' response triggers
  the same path immediately.
- THE EVICTION FLOW (THE NON-NEGOTIABLE LIFECYCLE REQUIREMENT — the owner's
  most-bitten bug class): eviction must NEVER destroy unsaved local work.
  Sequence: (1) set a store eviction flag + banner state "Signed out because
  your account signed in on another device." (2) auth.signOut with LOCAL scope
  only (never global — the other device's session is the legitimate one),
  (3) NO store reset of any kind: the Zustand persist partialize state
  (store/index.js:54,93) remains in localStorage untouched; the auth slice
  transitions to anon exactly as a normal sign-out does. (4) On re-auth,
  standard rehydration returns the user to their unsaved work.
  LIFECYCLE TRACE (each pinned by a test): mid-edit eviction → edits persist
  (partialize) → survive sign-out → survive re-auth rehydration. mid-GENERATION
  eviction → generation is client-local compute, it completes; only paid edge
  calls in flight return session_superseded and surface the banner, never an
  error toast storm (dedupe: first supersession wins, later ones no-op).
  Mid-TRANSFER eviction → the transfer FREEZES, it does not proceed and does
  not abort: every founder-transfer action is sessionGated, so the superseded
  device can take no further step; the case state machine holds its state; a
  'session_superseded_during_transfer' event is appended to the case audit log
  (anomaly signal — a mid-transfer credential fight is exactly what the fraud
  pass probes); the EMAIL abort tokens (6.3) remain live for both parties
  regardless of session state — deliberately session-independent, the escape
  hatch that needs no sign-in. The 72h cooling clock does NOT pause (the abort
  token is always available; pausing would let an attacker freeze a seat
  indefinitely by sign-in spam).
- THE PIN (structural): a vitest lifecycle test seeds persisted state, drives
  the eviction store action, asserts localStorage's persist key byte-identical
  through eviction, and asserts no store-reset action fired (operationRegistry
  spy). This is the regression wall for the bug class.
7.4 SURFACES: an "Active session" line-item panel in the account SECURITY
section (current device label, signed-in-at, and the EXISTING signOutEverywhere
button relocated beside it) — lazy, register idiom, eager-neutral.
New-device sign-in notification email through the Wave E seam (template
'new_device_signin', payload {device_label, at}; COORDINATION POINT: the seam
lands in a parallel lane — code against the template-name+payload interface,
inert until it exists). ToS line joins §12. Analytics: ENRICH-ONLY (LAW 4) —
supersession increments a property on the existing auth-lifecycle event if one
exists; if the dictionary has no carrier event, the count ships as a property
on the next session-start event ('superseded_prior': true) rather than a new
eager name; implementer resolves against analyticsEvents.js with the
zero-eager constraint binding.

## §8 MIGRATION MAP + NUMBERING
| file | contents | slice |
|---|---|---|
| 137_founder_seats.sql (REWRITE IN PLACE) | seat register v2: 137's full draft + §6.1 columns/stamps + wired claim + clawback release | M-5 |
| 157_money_events.sql | the money spine (§2) | M-1 |
| 158_credit_auto_reload.sql | settings + attempts + claim RPC + system_grant_credits 'auto_reload' key (116 discipline) | M-3 |
| 159_surveyor_provisioning.sql | entitlement sub columns + grant/revoke RPCs + byok_set gate rider | M-4 |
| 160_founder_transfer_cases.sql | cases + events + challenges + transition RPCs + lock read + master-switch + cron config seeds | M-5 |
| 161_single_session.sql | current_account_session + claim/is/assert RPCs | M-9 |
ALL WRITTEN-NOT-DEPLOYED; applied-head.json untouched (prod head 117 — nothing
since 117 is deployed; the entire 118+ chain ships together at the owner's
`db push`). ⚠ COLLISION-AT-FOLD: the perimeter lane holds ~156 unpushed on its
own branch. At fold, whichever lane lands second renumbers to be contiguous
after the then-current repo head — no migration number is hardcoded anywhere in
this wave's code (RPC/table NAMES are the interface; a renumber is a pure file
rename + header edit). The implementer greps for '15[6-9]\|16[01]' in the
lane's diff at fold time to prove it.

## §9 SLICES (lane: claude/money-wave off the composite; Opus implementer;
lettered commits; focused gates per slice + the FULL suite at lane end with the
flake-isolation protocol; every JUDGMENT labeled vetoable in slice reports)
- M-1 THE SPINE: 157 + webhook mirror writes + receipt capture + backfill verb.
  Commits: a) migration + pglite probe (migrationSequenceAll green) · b) webhook
  writer map + never-throw posture + index.test.ts extensions (every existing
  case untouched — pin) · c) backfill admin verb + test.
  Gates: deno test stripe-webhook + admin-actions; tests/edgeFunctions/
  contracts.test.js. DONE-WHEN: a replayed completed-session produces exactly
  one money_events row (executed test), refund flips status (executed test).
- M-2 THE LEDGER UI: purchaseHistory.js + the Past-purchases panel.
  Commits: a) lib + fetch tests · b) panel + a11y + pager. Gates: focused
  vitest; npm run build + eager budget check (delta 0). DONE-WHEN: rows render
  from a seeded table; refunded badge shown; zero eager delta proven.
- M-3 AUTO-RELOAD: 158 + consent + trigger + PI + webhook confirm + UI.
  Commits: a) migration + claim RPC probes (cap, cooldown, single-open,
  concurrency) · b) create-checkout savePaymentMethod + consent copy + its
  index.test.ts · c) _shared/autoReload.ts + debit-site census hooks
  (never-throw proven by test) · d) webhook payment_intent.succeeded/failed
  handlers + grant idempotency test (replay ×2 → one grant) · e) account panel
  + store actions + operationRegistry + regen · f) SCA notify path + expiry
  sweep hook. Gates: creditFlow.test.js untouched-green; deno suites.
  DONE-WHEN: seeded below-threshold spend triggers exactly one attempt; cap
  blocks; replayed success grants once; disabled settings = zero attempts.
- M-4 SURVEYOR LIMB: 159 + product + webhook + admin verbs + allowance trap fix.
  Commits: a) migration + RPC probes · b) create-checkout/webhook branches +
  the subscription.deleted discrimination + THE ALLOWANCE PRICE-ID GATE + tests
  (surveyor invoice mints NO 30-credit allowance — the load-bearing new pin) ·
  c) admin verbs + audit. DONE-WHEN: grant/revoke round-trip executed; premium
  paths byte-identical under the old fixtures (56/56 stays green).
- M-5 THE SEAT REGISTER: 137 rewrite + 160.
  Commits: a) 137 rewrite + pglite re-probe + founderLineage contract test
  (projection shape unchanged — FoundersPage renders identically) · b) 160
  tables/RPCs + transition-matrix probe (every legal transition once, every
  illegal transition refused — executed) · c) webhook founder_lifetime seat
  claim wiring + clawback release ordering test.
- M-6 THE CHOREOGRAPHY: founder-transfer edge function + UI.
  Commits: a) function skeleton + master switch + sessionGate + velocity +
  challenge issue/verify (lockout test) · b) initiate/confirm + anomaly
  refusals · c) nominee flow + the case-bound checkout session + trust-boundary
  contract-test extension · d) abort paths incl. email token + refund
  idempotency · e) recovery-lockout wiring in auth-recovery (fail-closed test)
  · f) account transfer panel + FoundersPage promise line.
- M-7 THE MONEY CROSSING: webhook transfer branch + finalize + due-runner core
  + dispute interplay. Commits: a) completed-session → cooling (claim-once,
  wrong-state refund path) · b) finalize RPC + edge leg + subscribed-ex-founder
  test (keeps premium) · c) run_due sweeps + expiry + session-expired regress ·
  d) chargeback matrix (cooling/pre-payout/post-payout — each executed).
- M-8 THE PAYOUT LIMB: Connect onboarding + release. Commits: a)
  payout_onboarding (key-inert refusal test) · b) release claim + idempotent
  transfer + held/failed paths + the credits-election limb (seat_payout
  delivery-key + grant-once test) · c) runbook §11 finalization. DONE-WHEN: with
  keys absent every Connect call refuses cleanly and payout_status parks at
  'held'/'scheduled'; double-release proven impossible (claim + idem-key test).
- M-9 SINGLE SESSION: 161 + gate + client. Commits: a) migration + RPC probes
  (missing-row-allows pinned) · b) _shared/sessionGate.ts + the paid-surface
  census wiring + per-function 401 tests · c) spend_credits belt (creditFlow
  pins green) · d) client claim/validate/evict + THE LIFECYCLE PIN (7.3) +
  store actions + registry + regen · e) Active-session panel + seam email +
  analytics enrich · f) fraud-charter session probes (§10).
- M-10 STEWARDSHIP: buyback + nudge + abandonment (§6.8). Commits: a) 137/157/
  160 deltas (buybacks table, stewardship stamps, kind, switch seed) + RPC
  probes (buyback claim-once; mid-case refusal; clawback-race ordering) ·
  b) buyback action + panel affordance + payout release reuse (double-payout
  idem test) · c) due-runner dormancy/abandonment sweeps + sign-in-clears
  test + seam templates. DONE-WHEN: buyback round-trip executed with Connect
  absent parking at 'held'; abandonment sweep on seeded stale data escheats
  exactly once and any sign-in aborts it (executed).
ORDERING: M-1 → M-2/M-3/M-4 (parallel-safe) → M-5 → M-6 → M-7 → M-8; M-9's
a/b/c land before M-6 (the transfer function consumes sessionGate); M-10
after M-8 (it consumes the payout limb + due-runner) and after M-9a (it reads
the session table). Full-suite
fold gate at lane end (the focused-gates blind spot is proven — owner memory).

## §10 THE FRAUD-PASS CHARTER (MANDATORY before the loop — a dedicated Fable
adversarial pass over the ASSEMBLED lane; findings are defects, not notes)
The pass executes attacks, not reviews prose. Minimum probe set:
1. TAKEOVER-INITIATED TRANSFER: compromise scenarios — fresh password change /
  completed recovery / new device — must be refused at initiate (7-day hold),
  frozen by the recovery lockout, aborted by the victim's email token during
  cooling. Prove each with an executed path.
2. COOLDOWN/CLAWBACK RACES: goodwill refund of the original $99 racing each
  case state; clawback-then-initiate; initiate-then-clawback. The §6.7 ordering
  must hold under interleaving (pglite transaction probes).
3. DOUBLE-PAYOUT: run_due replay, claim-crash-replay, concurrent runners — the
  'releasing' claim + Stripe idempotency key must yield exactly one transfer
  object (stub-Stripe execution test).
4. CHARGEBACK-MID-COOLING and post-finalize matrices (§6.7) — executed.
5. WEBHOOK REPLAY over every new handler: same event id (belt 1), same
  session/PI under new event ids (belt 2), out-of-order delivery
  (session.completed after expiry; deleted before completed for surveyor).
6. STATE-MACHINE FUZZ: every founder_transfer_cases transition attempted from
  every state via the RPCs — the transition matrix from M-5b re-run against the
  full assembly.
7. SESSION SUPERSESSION AS ATTACK SURFACE: rapid alternating claims from two
  devices interleaving paid calls — verify each call is gated against the
  CURRENT claim (tug-of-war never yields simultaneous acceptance windows
  beyond one in-flight request); replayed old-session JWTs rejected on every
  gated surface; eviction mid-transfer leaves the case resumable by the winner
  and abortable by email token (no wedged state — prove by driving the machine
  through supersession at every transfer step).
8. NOMINEE-SIDE ABUSE: nominee ≠ email owner (challenge is the wall); nominee
  already a founder / already in a case (partial uniques); paying a session for
  an aborted case (wrong-state refund path).
9. AUTO-RELOAD ABUSE: settings raced against spend (cap holds under concurrent
  crossings); a forged low-balance poke (there is none — the trigger is
  server-side only); PI metadata spoofing (purpose+attempt binding checked).
10. BUYBACK ABUSE: buyback during a live case (refused); goodwill-clawback
  racing a buyback (no double recovery — the release ordering probe); replayed
  buyback confirm (claim-once); due-runner replay on a buyback payout (one
  Stripe transfer object).

## §11 THE ACTIVATION RUNBOOK (owner steps, in order; everything before step 4
is safe on day one — no money surface lights)
1. `supabase db push` the wave's migrations (with the rest of the 118+ chain)
   + PostgREST reload; deploy the edge functions.
2. Stripe dashboard: create the Surveyor monthly Price → set
   STRIPE_PRICE_SURVEYOR. Create the Seat Transfer $99 Price → set
   STRIPE_PRICE_SEAT_TRANSFER. (Each surface lights independently.)
3. Run `backfill_money_events` (admin verb) once; spot-check the account
   Past-purchases panel against Stripe.
4. LEGAL SIGN-OFF (HARD GATE for transfers): the §12 terms bundle + the Stripe
   Connect platform agreement + the refund/cancellation interplay reviewed.
   Nothing in code can substitute for this step.
5. Stripe Connect: enable the platform, complete platform onboarding, set the
   Connect keys/env. Verify a test Express onboarding round-trip.
6. Flip system_config 'founder_transfers'.enabled = true (service-role SQL) —
   the transfer UI + edge actions light.
7. Seed the 'founder_transfer_cron' system_config row (url + secret — the 115
   pattern) so finalize/expiry/payout sweeps run; verify one hourly no-op log.
8. Supabase Pro (this week, owner): AFTER purchase, enable "enforce single
   session per user" in the dashboard — defense-in-depth at the refresh layer;
   our gate is already enforcing at the request layer either way.
4b/5b. FALLBACK POSTURES (owner ruling 2026-07-19 — launch blocks on NEITHER):
   - CONNECT NOT APPROVED BY LAUNCH: transfers may still FULLY activate
     (steps 4 → 6, skipping 5): the payout election runs credits-only; cash
     elections park at 'held' and release when the platform lands. LEGAL
     SIGN-OFF (step 4) remains the hard gate regardless — no fallback for it.
   - SUPABASE PRO NOT PURCHASED BY LAUNCH: nothing blocks — the M-9 session
     gate is plan-independent by design (step 8 is defense-in-depth only).
     PRE-PRO POSTURE checklist: custom SMTP configured in the Supabase
     dashboard for auth emails (the free built-in sender is heavily
     rate-limited; Wave E's PRODUCTION_EMAIL_RUNBOOK covers setup — no Pro
     needed) · manual backup cadence per DATA_BACKUP_RUNBOOK until Pro's
     daily backups · the Wave E uptime probe doubles as the free-tier
     inactivity-pause keepalive · run step 8's toggle after purchase.
9. Auto-reload needs no owner key beyond the existing Stripe secret +
   STRIPE_PRICE_CREDITS_25 (already live) — it lights per-user on consent.
   Wave E mail-seam keys light the notification emails when that lane lands.
10. Operational checks (from the downgrade audit, still owed): verify the
   pg_cron purge job exists in prod; confirm Stripe portal subscription-pause
   is disabled.

## §12 TERMS + PROMISE COPY (appendix draft FOR THE LEGAL CONSULT — not final)
FOUNDERS-PAGE PROMISE (one line, under the lineage): "Founder seats can change
hands through the official transfer process, subject to the published terms."
TERMS BUNDLE (drafted for counsel; encode the four ratified amendments):
- The Founder seat is a TRANSFERABLE LIFETIME INDIVIDUAL SOFTWARE LICENSE.
  "Lifetime" means the commercial lifetime of the SettlementForge service. A
  seat is not an investment, a security, or a claim on any revenue or asset.
- Transfers occur ONLY through the official in-product process: a fixed price
  of $99, of which $49.50 is paid to the outgoing holder and $49.50 to the
  company, after a 72-hour review period and identity verification of both
  parties. The fixed price is a deliberate anti-speculation feature of the
  program (amendment d).
- Eligibility: a seat may transfer no earlier than 12 months after its original
  purchase, and no more than once in any 12-month period.
- What transfers: the seat entitlement and its public lineage. What NEVER
  transfers: account data, AI credits, marketplace items, API access, or any
  business arrangement. The incoming holder does not receive the one-time
  founder credit bonus (amendment b).
- SettlementForge is never a party to any private arrangement concerning a
  seat; any payment or promise outside the official process is unrecognized
  and unprotected (amendment c).
- Death or incapacity of a holder: succession is handled case-by-case through
  an official estate process — contact support (amendment a).
- STANDING BUYBACK: the company maintains a standing offer to repurchase any
  seat for $25 through the account page; repurchased seats return to the
  unclaimed pool.
- ABANDONMENT (the license is NEVER revoked for mere non-use): a seat whose
  account has been inactive and unreachable for five (5) years, and which
  remains unresponsive to repeated notices over a further ninety (90) days, is
  deemed abandoned and returns to the company; $25 is held for the former
  holder as a claimable credit.
- Payouts to outgoing holders are made 14-30 days after transfer completion,
  at the holder's election: in cash via Stripe Connect (requires completing
  Stripe onboarding), or as SettlementForge service credits of equal stated
  value ($49.50).
- The company may pause, reverse, or refuse a transfer for security, fraud, or
  chargeback reasons, per the process rules above.
- ONE CONCURRENT SESSION: SettlementForge accounts are individual licenses
  supporting one active session at a time; signing in on a new device signs
  out the previous one.
(Also owed to the same consult, per Wave E: the refund/cancellation policy page
and the Stripe Tax question.)

## §13 OPEN QUESTIONS (owner-gated; each ships with a recommendation and a safe
default that requires no answer to build)
1. ESCHEAT — PARTIALLY RULED 2026-07-19: abandonment policy is now DEFINED
  (§6.8: 5y + 90d notices → escheat + claimable $49.50). REMAINING open sliver:
  DELETED-account orphan seats (holder SET NULL) still park at escheat with no
  resale path, released only by owner decision (estate process).
2. SURVEYOR PRICE + BILLING SHAPE: monthly price set in Stripe by the owner;
  code is price-blind. DEFAULT: subscription mode, no trial.
3. SURVEYOR MONTHLY MANAGED-CREDIT ALLOWANCE: does the Surveyor sub include
  credits, like Cartographer's 30? REC: yes, sized at pricing time. DEFAULT
  BUILT: none (the allowance gate in §5 keeps it clean either way).
4. TOTP MFA ADOPTION: emailed challenge codes are the wave's second factor.
  REC: adopt Supabase TOTP post-launch and swap the challenge issuer for
  transfer actions. DEFAULT BUILT: email codes (the flow is issuer-agnostic).
5. PAYOUT WINDOW DIAL: 14-30 days; DEFAULT BUILT: 14 (system_config-dial to
  30). Longer = more chargeback cover, slower holder payout.
6. AUTO-RELOAD MONTHLY-CAP DEFAULT: $40/month default, $5-$200 settable
  (manager judgment, vetoable — runaway-proofing vs power-user ceilings).
7. AUTO-RELOAD RATE ANCHOR: starter-pack rate (no volume discount on
  convenience top-ups) — vetoable; swapping the env anchor changes it.
8. FOUNDER RE-PURCHASE AFTER CLAWBACK (audit 4.5): the once-per-account key
  means a re-buying clawed-back founder gets no 30-credit bonus. Ratify or
  order a re-grant path. DEFAULT: current behavior stands.
9. RETENTION-PURGE SPARE (audit 2.1 P0): the ordered fix (purge spares
  entitled settlements) is NOT in this wave's slices — confirm it lands in its
  own ordered fix; this wave only guarantees its OWN tables are purge-immune
  (LAW 9).

## §14 RECON HAZARDS BOUND INTO THE BRIEFS (fire = defect)
Signature-first textual order in stripe-webhook (the Tier 0.5 test asserts
lexical position — new helpers go BELOW handleStripeWebhook like the 108 set) ·
116 fork discipline for every RPC recreate (net-current body + pg_temp pin +
minimal delta, stated in the migration header) · never FK money tables to
settlements (108's CASCADE is the counterexample) · grantMonthlyAllowanceIfNeeded
will mint 30 credits on ANY subscription invoice — the surveyor price-id gate is
load-bearing (§5) · subscription.deleted must discriminate surveyor-vs-premium
BEFORE the premium path · profiles.stripe_subscription_id belongs to the
CARTOGRAPHER sub only — never write a surveyor sub id there · the webhook event
claim fails OPEN by design — never "fix" it closed · session gate: missing row
ALLOWS (rollout safety), mismatch REJECTS; anonymous single_dossier is ungated ·
eviction NEVER resets the store — the persist partialize is the user's unsaved
work (the lifecycle pin is the wall) · the email abort token is deliberately
session-independent · react-pdf renderToBuffer is non-deterministic (never
byte-compare PDFs in any new test) · resto2 full-suite is parallelism-flaky —
diff isolation runs, not raw failing sets · worktrees silently test against MAIN
node_modules (npm ci EUSAGE walk-up) · never read a gate through `| tail` ·
`npm run build` before dist contracts · Wave E seam + perimeter migration ~156
are PARALLEL-LANE coordination points (template interface + renumber-at-fold) ·
git: stage explicit files only; `git stash` FORBIDDEN in agent lanes.
