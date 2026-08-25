---
name: ""
metadata: 
  node_type: memory
  created: 2026-07-19
  tags: 
    - money-wave
    - founder-seats
    - single-session
    - stewardship
    - buyback
    - session-gate
    - edge-functions
  branch: claude/money-wave
  status: shipped-not-folded
  originSessionId: c7979c3b-d9d7-48bb-a499-e2271011bf43
  modified: 2026-07-19T21:25:51.581Z
---

# Money Wave FINAL slices shipped (M-9e/f, M-10, census)

⭐ The Money Wave's final implementation dispatch is COMPLETE on `claude/money-wave`
(base 91a6b2df = M-9d; NOT folded). Five lettered commits atop M-9d:
- `d46d6570` M-9e — active-session panel + new_device_signin seam consumer + supersession enrich
- `93fd9ed4` M-9f — §10.7 fraud-charter session probes + the session-independent abort escape hatch
- `da2f3e12` M-10a — stewardship migrations (137/157/160 deltas + NEW 164) + 162 search-path repair
- `998ed817` M-10b/c — buyback edge action + payout release + dormancy/abandonment sweeps + panel affordance
- `0c2244b8` census upgrade — request-layer sessionGate on all 8 credit-spending AI surfaces

## Why (load-bearing facts a successor/fold needs)
- **The `seat_buyback_cents` dial (owner ruling 2026-07-19)**: the standing-buyback price AND
  the abandonment claimable credit are ONE shared `system_config` figure (default 2500 = $25),
  READ AT CLAIM TIME via `_seat_buyback_cents()` (160) — NEVER hand-typed. The TRANSFER payout
  is UNTOUCHED: it stays `price_cents/2` = $49.50 (the ratified even split). The LADDER
  (transfer $49.50 > buyback $25) is test-pinned; so is dial-is-read.
- **M-10 migration homes**: table/stamps/challenges ride 137; kind 'seat_buyback' rides 157;
  master switch `founder_buyback` + dials + readers ride 160; ALL action RPCs
  (claim_founder_seat_buyback, claim_due_buyback_payout, issue/verify_buyback_challenge,
  sweep_seat_dormancy_nudges, sweep_seat_abandonment, _seat_holder_last_active) ride NEW **164**
  (163 already forward-referenced `claim_due_buyback_payout@164`; system_grant_credits already
  dedups `seat_payout` on `buyback_id`). Escheat seats are NEVER auto-resold —
  claim_next_founder_seat now requires `security_status='normal'`.
- **The buyback rides the SHARED performPayout** (founder-transfer/index.ts): idempotencyKey
  `buyback-${id}`, eventKey `buyback:${id}`, kind seat_buyback; outcome 'released'→state 'paid'.
- **The buyback has its OWN master switch** (founder_buyback), independent of founder_transfers —
  the action-aware switch check in the edge, and the panel BuybackAffordance reads it via a
  `buyback_status` action so it lights (and darkens) independently.

## JUDGMENTS (vetoable — flagged for the Fable fraud pass / owner)
- **The abort-token gate bypass (M-9f, security-sensitive)**: a token-bearing `abort` now SKIPS
  the single-session gate, so a party locked out of their session (superseded) can STILL halt the
  transfer via the email token — implementing §6.3/§7.3's explicit "session-INDEPENDENT escape
  hatch" (repair of a spec-conformance gap the landed M-6 gate left; the token hash is the
  authorization; a bad token still 403s; abort only cancels). NOT extended: a fully UNAUTHENTICATED
  token abort (account-takeover victim who cannot sign in at all) — abort still needs a valid JWT.
- **Supersession detection is CLIENT-SIDE** (authSecurity claim pre-read), leaving the landed 161
  claim RPC + its pglite probe frozen. The enrich rides a fresh session_started + superseded_prior.

## Pre-existing findings surfaced by the lane-end full suite (NOT my slices — flagged)
- **162 `run_founder_transfer_due` had a bare `search_path = public`** (CVE-2018-1058 class the
  migrationSearchPathPin ratchet guards) — REPAIRED byte-neutrally to `public, pg_temp`.
- **verifyJwtPins RED: `founder-transfer` has no explicit verify_jwt pin in config.toml** (M-6 gap).
  Its run_due action is tokenless (cron secret) → it needs `verify_jwt = false` AND membership in
  the test's SELF_AUTH_FALSE set. Deploy-config decision — left for the fold/owner.
- **guidanceRegistry title= census 488 vs baseline 487**: PRE-EXISTING (src title= = 513 at base
  91a6b2df AND at HEAD — my delta 0). An earlier money-wave commit's tooltip; bump-or-reroute is
  that author's/the fold's call.

## How to apply / expected reds at lane-end (fold owns these)
- FULL suite: 19 fails, ALL pre-existing/fold-owned/flake. The **4 parked goldens** =
  beliefMapGolden, goldenViewModel, generatorGoldenMaster, worldpulseDeityGolden. The
  **doc/contract cluster** (fold-owned, tripped by +1 migration 164 + branch doc staleness):
  migrationContiguity, migrationSequenceAll (the 156 gap), docCounts, architectureFreshness,
  deployRunbookFreshness, abuseModelFreshness. advancePauseResume = parallelism flake (9/9 isolated).
- Deno edge suite: **391 passed | 0 failed**. `check:edge`/`deno check` is the known CI-only
  environmental red (@types/node node_modules resolution) — the TESTS run clean.
- **Final eager closure = 1,041,856 B** (budget 1,040,000; the standing verify:dist red /
  composite-budget-breach-998b). Delta from the M-9d base (1,041,848) = **+8 B** — all new UI is
  lazy; ~0 as promised. §16 declared ≤900 B allowance untouched.
- NO store actions added (panels stay component-local per §6.4) → no operationRegistry/regen.
- Next: the manager folds; the Fable fraud-pass runs over the assembled wave.
