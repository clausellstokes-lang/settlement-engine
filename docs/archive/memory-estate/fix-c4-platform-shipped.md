---
name: fix-c4-platform-shipped
description: "C4 platform/AI-cost/edge cluster shipped @ b4656857 on claude/c4-platform (base 982290ed, NOT folded): 6 fixed / 3 struck / 5 flagged of 14 findings; the REAL fix = construct-realm+construct-settlement had NO request-layer session gate (N-1 census gap)."
metadata:
  node_type: memory
  type: project
  modified: 2026-07-21T05:43:29.935Z
  originSessionId: ff8b4b71-3ea5-4d7a-9793-42190018c11f
---

**C4 — PLATFORM / AI-COST / EDGE cluster shipped 2026-07-21** (dedicated agent, worktree vision-i).

- **claude/c4-platform @ `b4656857`** (base 982290ed, NOT folded/pushed). 8 files, +269/-6, 3 new test files. Migration head untouched (169). **Eager Δ = 0** (all server-side/CI/tests; no client bundle).
- Gate: domain-strict 0 (ceiling 0) · tsc 0 · eslint 0 · vitest 129 (my 5 censuses) + 77 (construct/config/RLS-pglite) green · validate:edge pass (59 files) · NUL scan clean.

**THE REAL FIND (bar-19, was a live N-1 gap):** `construct-realm` + `construct-settlement` are credit-spending AI surfaces (`spend_credits` + `ai_usage_events`) that ran with **NO** request-layer `isSessionSuperseded` gate, and were absent from `sessionGateCensus`. Denominator = 11 spend_credits callers, 9 gated, exactly these 2 ungated. Fix = the exact interpret-session gate pattern (import `../_shared/sessionGate.ts`; call after getUser, before ipGate) + added both to REQUIRED + AI_SPENDING (9→11). DB belt already blocked the credit; this closes the instant-eviction layer. Hardening of an existing invariant, not a posture change.

**Pins added (structural-prevention):**
- `tests/edgeFunctions/aiMeteringCensus.test.js` — DISCOVERS every spend_credits caller from source, requires each inserts ai_usage_events (COGS anti-N-1).
- `tests/security/publicTableRlsCensus.test.js` — enumerates all 70 `create table public.*`, requires newline-tolerant `enable row level security`; EXEMPT list empty, 0 gaps today.
- `tests/edgeFunctions/edgeModelDefaultsCensus.test.js` — binds each `ANTHROPIC_CLAUDE_<FAMILY>_*_MODEL` default to a `claude-<family>` id (source tier-misroute wall). Note: generate-narrative uses `sonnet-4-6` + dated haiku NOT in ANTHROPIC_SUPPORTED_MODELS, so DON'T bind edge defaults to that set.
- `scripts/mutation-sweep.sh` #13 — flips an authenticated verify_jwt pin true→false, asserts verifyJwtPins reds (proved mutated=red/clean=green/byte-identical revert); config.toml added to the dirty-tree guard.
- `.github/workflows/ci.yml` — non-blocking (continue-on-error) dev-inclusive `npm audit --audit-level=high`.

**STRUCK (non-real):** CSP Report-Only (DELIBERATE per cspHeaderShape.test.js "enforce flip is deliberate + future" — owner-gated to arm) · prop-hygiene static gaps (already documented lines 29-36; dynamic/spread props pervasive+legit; runtime scrubber would add eager) · table-clerk missing server half (tableClerk.js documents it as an owner-gated deploy seam; already degrades to a cordial message).

**FLAGGED (owner-gated / cross-lane):** prompt caching across the other 10 AI fns (no chokepoint, broad paid-surface change) · clerk accuracy harness (blocked on unbuilt table-clerk edge) · resolved-model logging / runtime-env override (deeper than a source census) · cold-boot splash index.html (client eager, ~C5) · flood-year generosityEV.js + wizardNews "Unknown settlement" (src/domain — C1 lane).

**HAZARDS confirmed this run:**
- ⚠ `build:edge-shared` churns `aiGroundingBundle.meta.json` + `analyticsEventsBundle.meta.json` generatedAt (sourceHash unchanged) — REVERT them (brief rule). Bit again here.
- ⚠ `check:edge-behavior` (deno check --frozen) fails PRE-EXISTING/environmental in worktrees: `Could not find a matching package for 'npm:@types/node'` (node_modules walk-up + no `deno install`). Reproduces on unmodified functions; my edited files `deno check` green. NOT a regression; NOT in the required gate (validate:edge is).
