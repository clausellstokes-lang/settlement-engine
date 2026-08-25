---
name: ""
metadata: 
  node_type: memory
  created: 2026-07-19
  branch: claude/money-wave
  tips: 
    - 2c65ad7d
    - 6019daf4
    - 91a6b2df
  topic: "MONEY WAVE resume — M-8 / M-6f / M-9d landed; M-9e/f, M-10, census remain"
  originSessionId: c7979c3b-d9d7-48bb-a499-e2271011bf43
  modified: 2026-07-19T20:06:58.464Z
---

# MONEY WAVE resume (claude/money-wave) — 3 slices landed 2026-07-19

Resumed a session-limit-killed lane (dirty M-8 payout files were in-flight). Base
aad6265e; spec docs/DESIGN_MONEY_WAVE.md. NOT folded, NOT pushed. Landed, in order:

- **M-8 THE PAYOUT LIMB @ 2c65ad7d** — release claim + credits election + Connect
  onboarding + migration 163. Deno 21/21, pglite founderTransferPayout 15/15.
- **M-6f THE TRANSFER PANEL @ 6019daf4** — account seat-transfer surface +
  FoundersPage promise line. Zero eager (closure held at 1,040,998).
- **M-9d SINGLE SESSION client @ 91a6b2df** — claim + validation + THE LIFECYCLE
  PIN. 24/24 focused gate.

## Load-bearing findings (verify against code before trusting)
- **M-8 held-payout re-arm gap (FIXED):** claim_due_transfer_payout only claims
  scheduled/stale-releasing — a connect_cash payout that parks 'held' is NEVER
  re-swept. Added `reelect_transfer_payout` RPC (163) + `reelect_payout` edge
  action + a held→scheduled re-arm inside payout_onboarding. Without these,
  completing Connect or re-electing to credits would strand the payout.
- **migration 163 is contiguous on THIS branch (157–163); gap is at 156** (sibling
  perimeter/token-bucket lane, unpushed). migrationSequenceAll's gapless-at-156 red
  is FOLD-OWNED, not a lane defect. 163's system_grant_credits recreate is
  158-net-current + only the seat_payout delta (116 discipline verified by diff).
- **M-9d store-action machinery is heavyweight but LAW-6-authorized:** evictSession
  registered EXEMPT in src/store/operationRegistry.js + EXEMPT_CEILING 70→71 +
  `npm run gen:compendium-data` (compendiumDataFreshness byte-checks it). The
  "operationRegistry spy" the PIN needs DOES NOT EXIST (registry is a static
  manifest, not a runtime dispatcher) — the PIN BUILDS it via vi.spyOn over the
  registry-derived reset/clear family. Model for a new store action: DOOR 2
  (fogEditSlice) 4-touch-point template.
- **⚠ M-9d EAGER BUDGET (OWNER-GATED):** verify:dist closure went 1,040,998 → 
  **1,041,848** (+850 B), EXCEEDING the §16 ≤600 B ceiling. Minimized hard
  (validation+claim+banner all lazy; banner is its own 975 B chunk) — the residual
  is the IRREDUCIBLE floor of a store-integrated eviction (store state can't be
  lazy; the dedupe guard must be synchronous). Budget is already an owner-gated
  breach at base (composite-budget-breach-998b). Needs owner-signed raise; do NOT
  treat the verify:dist red as shippable without it.

## REMAINING (successor scope, in order)
- **M-9e** — Active-session panel in account SECURITY section (fetchActiveSession
  is BUILT in authSecurity.js; import it directly/lazy, don't add an auth.js
  wrapper — eager budget) + signOutEverywhere relocated beside + seam email
  'new_device_signin' + analytics ENRICH-only.
- **M-9f** — §10 fraud-charter session probes (alternating claims, replayed old
  JWTs rejected, eviction-mid-transfer resumable + email-abortable).
- **M-10 THE STEWARDSHIP LIMB** — buyback ($49.50, founder_seat_buybacks table,
  SAME performPayout machinery + credits election, idempotencyKey buyback-${id},
  master switch 'founder_buyback', money_events kind 'seat_buyback') · dormancy
  nudge (18mo) · abandonment (5y/90d/3 notices, escheat + claimable_cents 4950).
  sweepReleaseBuybacks + sweepStewardship are STUBS in founder-transfer/index.ts.
- **Census upgrade** — request-layer sessionGate on the 8 belt-only AI surfaces
  (ai-analyst, generate-narrative, generate-chronicle, custom-content,
  style-overhaul, interpret-session, parley, surveyor-autonomy) + extend
  tests/edgeFunctions/sessionGateCensus.test.js to require it; verify-checkout-session
  stays DEFERRED.

Discipline: lettered commits; gates bare; kill-list tolerance-0 on new UI; new
store actions trip the registry+regen+ceiling machinery; NEVER push/fold here.
