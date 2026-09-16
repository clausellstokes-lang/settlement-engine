---
name: ""
metadata: 
  node_type: memory
  title: THE PERIMETER FINISHER (Wave-D code-complete) shipped
  date: 2026-07-19
  branch: claude/wave-d-perimeter
  tips: 
    - d0893f56 WD-h
    - 5651bd80 WD-i
    - 301fbcd7 WD-j
    - d93197da WD-k
  base: 4b65ab82 (WD-g)
  status: "BUILT, NOT FOLDED, NOT DEPLOYED"
  tags: 
    - perimeter
    - turnstile
    - captcha
    - rate-limit
    - ai-limiter
    - security-pins
    - wave-d
  originSessionId: c7979c3b-d9d7-48bb-a499-e2271011bf43
  modified: 2026-07-19T15:35:09.249Z
---

# THE PERIMETER FINISHER — Wave-D to code-complete form

Manager veto of the prior lane's scope-stop: activation must be KEYS + DASHBOARD
ONLY, never code steps. Four lettered commits on `claude/wave-d-perimeter` atop
WD-g (4b65ab82), NOT folded, NOT pushed. All INERT/written-not-deployed.

## What shipped
- **WD-h (d0893f56) TURNSTILE CODE-COMPLETE (item 1).** The Cloudflare Turnstile
  seam is wired end to end and ships OFF (flag `perimeterCaptcha`, default false).
  `src/components/perimeter/CaptchaGate.jsx` = the ONE flag-gated + lazy mount
  (uses non-reactive `flag()`, NOT `useFlag` — the codebase-wide test-mock
  convention provides `flag` only; `useFlag` broke ~1 test). Rendered in AuthPanel
  (covers modal + /signin·/register pages), PurchaseModal, BuyThisDossier (anon +
  durable), SingleDossierSuccessPage. `captchaToken` threaded ADDITIVELY through
  authSignIn/authSignUp (Supabase-native) + startCheckout/verifySingleDossierPurchase.
  Server `verifyTurnstile` in create-checkout (FAIL-CLOSED) and verify-single-dossier
  (VERIFY-ONLY-IF-PRESENT — post-payment, never trap a paid buyer). CSP: added
  `challenges.cloudflare.com` to app-block script-src+frame-src (report-only CSP),
  pinned in cspHeaderShape.test.js. Runbook updated (docs/PERIMETER_RUNBOOK.md).
- **WD-i (5651bd80) AI LIMITER HARDENING (item 2).** Migration **156**
  (`156_ai_ip_token_bucket.sql`, WRITTEN-NOT-DEPLOYED): `token_buckets` +
  `consume_token_bucket` (cross-instance smooth-refill bucket, atomic
  SELECT…FOR UPDATE) + operator config `ai_ip_rate_limit` (40 burst / ~40/hr).
  `_shared/rateLimit.ts` → `checkAiIpRate`/`aiIpRateGuard`: FAIL-CLOSED (over→429,
  infra-error→503, never silent open — the spend-cap posture, NOT the fail-open
  per-user limiter). Wired into all 11 AI functions after auth, before spend. The
  per-user daily limiter (consume_ai_generate_rate_limit) is UNCHANGED (fail-open).
- **WD-j (301fbcd7) PIN BACKFILL (item 3).** 5 pglite pin files / 37 tests over the
  census's real-but-unpinned walls: enforce_save_limit trigger (014),
  claim_ai_request idempotency (119), the email/dossier/recovery limiter RPCs
  (034/035/066), world_pulse_effects + analytics_identity_links/analytics_device_links
  deny-all RLS (041/036), credit_ledger + credit_spend_allocations money CHECKs (007/018).
- **WD-k (d93197da) DOC FRESHNESS.** Migration 156 advanced the head → refreshed
  ARCHITECTURE.md `**migrations/** (156)` + DEPLOY.md head `156_ai_ip_token_bucket.sql`.

## Hazards / judgments (vetoable)
- ⚠️⚠️ **MIGRATION 156 NUMBER COLLISION AT FOLD.** The sibling lane
  `claude/wave-e-launch-ops` ALSO minted a migration 156 (admin errors RPC). Mine is
  `156_ai_ip_token_bucket.sql`. In ISOLATION my branch is cleanly contiguous
  (155→156, validate:migration-head green). But folding BOTH wave-d + wave-e yields
  a duplicate 156 → the manager MUST renumber one to 157 (and update its doc-freshness
  head refs). This is a fold-time task, not fixable in either branch alone.
- ⚠️ **verify-single-dossier is VERIFY-ONLY-IF-PRESENT** (JUDGMENT): a post-payment
  endpoint, so a missing/blocked captcha token NEVER blocks a paid buyer — only a
  present-but-invalid token is rejected. Differs from create-checkout (fail-closed,
  pre-payment). Protects the paid-surface law.
- ⚠️ **AI IP gate is FAIL-CLOSED** (JUDGMENT, brief-directed): infra error → 503. So
  migration 156 MUST deploy WITH/BEFORE the edge-function deploy (`supabase db push`
  before `functions deploy`) — the helper fails closed on a missing RPC, which would
  503 the whole AI path. The gate SKIPS on the '0.0.0.0' sentinel (no cf-connecting-ip)
  → inert locally/in tests (why the 11 AI-fn tests stay green).
- ⚠️ **Full-suite pglite tests FLAKE under concurrency** (WASM cold-start timeouts):
  advancePauseResume, ordering, and the new *.pglite pins can fail in the full run and
  PASS in isolation. Re-run failures alone / with --no-file-parallelism before treating
  as real. Expected full-suite reds after this work: the 4 parked goldens
  (generatorGoldenMaster, beliefMapGolden, worldpulseDeityGolden, pdf/goldenViewModel)
  + the sibling first-paint budget red (verify:dist 1,041,066 > 1,040,000, ~1,066 B,
  NOT from this work — CaptchaGate/TurnstileGate/stripe.js are all lazy chunks).
- ⚠️ **deno check:edge** is blocked in the worktree by an environmental `@types/node`
  resolution miss (present only in the MAIN tree's node_modules); files type-check
  green under `deno task check:edge` before the abort. Single-file `deno check` also
  surfaces spurious SupabaseClient-generic errors (documented in deno.json). CI has the dep.

## Remaining (owner-gated)
- ACTIVATION = keys + dashboard only: Turnstile site/secret keys, Supabase Auth
  captcha toggle, `TURNSTILE_SECRET_KEY` edge secret (checklist in the runbook).
- DEPLOY of migration 156 + the edge functions (owner batch). NOT pushed, NOT folded.
