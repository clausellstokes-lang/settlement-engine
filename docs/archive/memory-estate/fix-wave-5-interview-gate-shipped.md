---
name: ""
metadata: 
  node_type: memory
  title: Fix wave 5 — the interview audience gate holds across hops
  date: 2026-07-20
  branch: claude/fix-wave5-interview
  tip: 431572fd
  base: 8dfd2aed
  status: "shipped (NOT folded, NOT pushed — owner-gated)"
  tags: 
    - secrets-seam
    - interview
    - surveyor
    - audience-gate
    - multi-hop
    - fix-wave
  originSessionId: ff8b4b71-3ea5-4d7a-9793-42190018c11f
  modified: 2026-07-21T00:29:14.543Z
---

## What / Why
idx34 secrets-seam (CONFIRMED). The multi-hop Interview leaked DM-secret answers
into player-audience prompts. A DM asked hop 1 under audience='dm' (answer names a
secret), flipped to 'Player-safe', asked a follow-up; the client sent
history=[{q, a: dmSecret}] and the server embedded that prior DM answer into the
player prompt. The audience gate applied only to the current question + the bundle
(`bundleIsPlayerSafe`), never to the HISTORY. So a player hop could be seeded with
DM secrets via the prior-exchange block.

## The chokepoint / fix
Project the HISTORY to the current audience, not just the current question. A prior
turn may enter a player prompt only if it was itself produced under a player audience.

SERVER (authoritative backstop, `supabase/functions/interview/`):
- `interviewCore.ts`: `PriorTurn` gains an `audience` field. `buildPriorExchange`
  now takes `currentAudience` and drops any turn whose audience is not exactly
  'player' when current audience is 'player' (FAIL CLOSED on missing/unknown tag).
  `buildInterviewPrompt` passes its `audience` down. Empty history still yields a
  byte-identical first-hop prompt (strict no-op preserved).
- `index.ts`: the multi-hop history mapping now forwards each turn's `audience`.

CLIENT (defense in depth, wire already safe):
- `src/lib/interview.js`: new pure export `projectHistoryForAudience(history, audience)`
  drops DM turns under a player-safe EFFECTIVE audience + tags carried turns;
  `askInterview` uses it before POSTing.
- `src/components/InterviewPanel.jsx`: each thread turn records
  `turn.result.audience` when building the follow-up history.

## How to apply / hazards
- ⚠ `buildPriorExchange(history, currentAudience='dm')` default is PERMISSIVE ('dm'
  = no filter) purely for the existing single-arg unit-test calls. Production always
  passes audience via `buildInterviewPrompt`. A NEW caller that omits audience under a
  player context would fail OPEN — always pass the audience explicitly.
- CANNOT-CATCH (documented in interviewCore.ts): the gate reads the per-turn audience
  tag; it cannot inspect free-text prose for DM-ness. A client that actively mislabels
  its own DM turn as 'player' routes its own secret into its own player view (same
  trust class as posting mislabelled slices, structurally guarded by
  `bundleIsPlayerSafe`). The threat CLOSED is the honest client accidentally leaking
  into the shareable player view.
- The effective-audience path matters: a player-FRAMED question forces audience to
  'player' inside `selectSlices`; the client filter keys off `effectiveAudience`, so
  the forced-player case also drops DM history (not just the explicit toggle).
- `interviewCore.ts` is NOT part of the `_shared` edge bundle → editing it does NOT
  churn `aiGroundingBundle`. But `build:edge-shared` still rewrites the two meta.json
  `generatedAt` timestamps (sourceHash unchanged) — revert that spurious churn:
  `git checkout -- supabase/functions/_shared/aiGroundingBundle.meta.json supabase/functions/_shared/analyticsEventsBundle.meta.json`.

## Pins
- `tests/domain/interview.test.js` — new describe "the audience gate holds across
  hops (secrets-seam)": server buildInterviewPrompt + buildPriorExchange level.
- `tests/domain/interviewHistoryAudienceGate.test.js` — NEW file: client
  `projectHistoryForAudience` (mocks supabase.js/analytics.js/domain/ai/index.js so
  the pure helper imports without spinning a real Supabase client).
- Both proven must-fail-pre-fix via in-place negative control (filters disabled →
  DM secret appeared in player prompt, 5 assertions failed; restored → green).

## Gate (all green @ 431572fd)
check-domain-strict bare exit 0 · full tsc (tsconfig.full) exit 0 · eslint touched 0
errors · focused suites 600 passed / 24 files (interview, interviewHistoryAudienceGate,
interviewCampaignScope, aiAnalyst, tests/edgeFunctions incl sessionGateCensus) ·
validate:edge 59 files valid · python NUL scan 0. Foreign stash@{0} untouched.
