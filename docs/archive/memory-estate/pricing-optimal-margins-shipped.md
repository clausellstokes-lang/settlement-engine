---
name: ""
metadata: 
  node_type: memory
  type: project
  date: 2026-07-22
  tags: 
    - pricing
    - margins
    - ai-credits
    - cogs
    - prompt-cache
    - migration
    - byte-budget
    - edge-functions
  branch: claude/pricing-optimal-margins (off composite-r4 182f98f8)
  status: committed-inert (owner deploy = sign-off)
  originSessionId: 230c87b4-b237-4d1b-a63e-af48dfb233a0
  modified: 2026-07-22T04:56:02.526Z
---

# Pricing optimal-margins reprice — shipped (inert)

Owner order 2026-07-21 ("with opus as the default update all the prices for
optimal margins"). Dispatched by Fable as the PRICING-OPTIMAL-MARGINS lane.

## What shipped (all inert until the owner deploys)

Schedule change, standard (Opus-default) path only:
- **narrative 3 -> 5** (the only action below the 2.5x margin floor at Opus
  economics; the margin hole this closes).
- **progression 5 -> 6** (coupled bump to preserve the `progression > narrative`
  invariant pinned by tests/edgeFunctions/aiGroundingContract.test.js:833).
- dailyLife 4, chronicle 2, and the whole fast/subsidy schedule (2/3/4)
  UNCHANGED (all already clear their floors).
- knob **targetMultiplier 1.2 -> 2.5** (so the nightly calibrator MAINTAINS the
  policy; applyCreditCosts kill switch stays OFF, so the seed is authoritative).

COGS engineering (prompts.ts) that makes the price optimal:
- `capStr` per-field prose caps in summarizeSettlement (bounds re-sent input).
- `cachePadding`: pads the stable prompt prefix past the 4096-token cache floor
  so cache_control finally engages on the Opus + Haiku paths (it was silently a
  no-op below the floor). Deterministic, byte-stable across a run's calls.

## KEY HAZARDS (each bit this lane)

1. **Migration is 180, NOT 170 — cross-worktree collision.** First cut used 170
   (contiguous after the 169 head), but the parallel admin lane (vision-i,
   claude/admin-twokey-founders-roll) had ALREADY committed migrations 170-173
   (founders roll / content moderation / comment tombstone / map reports). Two
   170s cannot fold, so the manager (Fable) ordered the renumber into the
   reserved 180 band. TRADE-OFF: on an isolated branch `check-migration-head.mjs`
   (contiguityGaps) reports a gap 170-179 and FAILS the gate; the merged tree
   still has a 174-179 gap. That gap is a KNOWN FOLD-TIME item — the fold
   renumbers 180 -> 174 (next contiguous after the admin lane's 173). Do NOT fill
   it with dummy migrations. Lesson: a "next contiguous" number is only safe if
   you can SEE every parallel lane's committed migrations; when lanes are
   invisible, use the reserved band and let the fold renumber.

2. **The spend_credits CASE is duplicated across 8 migrations** (009/018/024/057/
   114/131/140/149/151/153/161) and different tests EXECUTE or GREP different
   bodies. To change a price you must touch: pricing.js NEW_AI_COSTS, the edge
   CREDIT_COSTS, migration 024 CASE (feeSchedule + creditLedgerHarness load it),
   057 CASE (accountStatusGate; must == 114 CASE for the contract test), 114
   CASE + seed + get_ai_pricing defaults (contract test greps these), AND a NEW
   migration (180) that recreates spend_credits (fork of the net-current 161
   body) + get_ai_pricing (fork of net-current 131) + UPDATEs the live config +
   knob. The historical CASE edits are INERT for prod (superseded by 161->180);
   feeSchedule.pglite.test.js's own comment sanctions editing the 024 CASE in
   lockstep with pricing.js. The prod charge change is 180's config UPDATE
   (ai_credit_costs seed is on-conflict-do-nothing, so prod's row is only moved
   by an UPDATE, never a re-insert).

3. **BYTE-BUDGET WALL blocks config-driven displays.** The eager first-paint
   static closure is at 1,039,995 / 1,040,000 (5-byte margin, owner-gated,
   "safe reclaim EXHAUSTED"). Adding `import {getAiCost} from config/pricing.js`
   to even a LAZY display component (LandingArtifacts / AccountFAQ /
   WelcomeCreditCard) triggers a vite shared-chunk REBALANCE of +9 bytes ->
   1,040,004 -> gate FAILS. Measured directly. So the four display-honesty
   fixes shipped as CORRECT STATIC literals (landing chip 5, FAQ 5/4/6 + fast
   disclosure, WelcomeCreditCard 5) — byte-neutral, but they will drift again on
   the next reprice (the same bug class). Config-driving them needs an
   owner-signed byte-budget raise. pricing.js single-digit swaps (3->5, 5->6)
   ARE byte-neutral (closure stays 1,039,995, Δ0).

4. **livePricing.js is built but UNWIRED** (src/config/livePricing.js: the
   get_ai_pricing() RPC read-path with graceful fallback to the shipped
   constants, no console spew). Wiring it into ANY display statically also trips
   the byte wall (a dynamic import() avoids the eager closure but the display
   fixes still needed a sync value, so they went static). It is the leaf the
   deferred AiPricingResyncPanel fix and any future live display should import.

5. **AiPricingResyncPanel dead read DEFERRED (cross-lane).** src/components/admin/
   AiPricingResyncPanel.jsx:82 reads `useStore(s => s.aiPricing)` which no slice
   writes, so "Schedule last updated" always shows "never". The exact fix is to
   read get_ai_pricing().updatedAt via livePricing.js. NOT applied: admin/ is the
   vision-i lane AND on this lane's FORBIDDEN list, yet Part C item 2 assigned it
   — a genuine brief self-conflict. Flagged, not crossed.

6. **pglite cold-start hook-timeout flake.** accountStatusGate /
   creditAllocationTrigger / moneyPathJourney had un-timed 10s `beforeAll` hooks;
   PGlite WASM cold-start is ~20-27s on a loaded machine, so they time out (most
   tests "skipped") EVEN when the assertions are correct. Added `}, 30000)` to
   match the feeSchedule/creditLedger siblings. When a pglite test shows a
   beforeAll timeout, ISOLATE it (or `--hookTimeout 60000`) before believing a
   real failure.

7. **Cartographer / Stripe verdict.** pricing.js:205 = 599 = $5.99 and every
   RENDERED surface shows $5.99 (the surveyed "600" was a stale 2026-07-13 note
   predating the 2026-07-17 rebaseline). The actual Stripe charge is the
   STRIPE_PRICE_PREMIUM price id whose amount lives in the Stripe dashboard, NOT
   the repo — only confirmable there. Residual dead $6/600 literals in
   src/lib/stripe.js:31, en.js upgradeCta, LockedDestination.jsx default (none
   rendered). No change made.

## Deploy order (owner sign-off)

CLIENT first (ships new constants + would read live config with fallback), THEN
migration 180 + edge fn together. Migration 180 is NOT applied (applied-head
stays 117). The server precheck + spend_credits RPC stay authoritative and
fail-safe: a stale client can never over/under-charge.

## Judgment calls (vetoable at deploy)

- narrative = 5 (not 6): meets 2.5x on the careful realistic COGS (~$0.31,
  output-dominated ~7,000 tokens -> ~2.57x) and preserves the invariant with
  progression = 6. If the owner judges realistic COGS higher, narrative = 6
  (progression -> 7, or break the invariant since narrative is genuinely the
  highest-COGS action). The calibrator now targets 2.5x against real telemetry.
- Owner sheet: docs/PRICING_MARGIN_SHEET.md.

## Gate receipts (this machine)

vitest pricing/contract/grounding 319; pglite money 76; copy 98; doc-freshness
108; tsc 0; domain-strict 0; full eslint 0; deno test:edge 452 (+3 new Part B
pins); build green; closure test PASSES at 1,039,995 (Δ0). check:edge FAILS on a
PRE-EXISTING worktree env issue (deno can't resolve npm:@types/node via walked-up
node_modules; crash is at type-reference resolution, not my code; test:edge green
exercises the code) — needs `deno install` / a proper CI deno env.
