---
name: ""
metadata:
  node_type: memory
  title: "ENFORCER E-D shipped — the AI wall proven per-surface + no load-bearing AI (bar 19)"
  date: 2026-07-21
  tags:
    - tranche-2-enforcer
    - E-D
    - ai-wall
    - finite-semantics
    - no-load-bearing-ai
    - aplus
    - bar-19
    - not-folded
  branch: claude/e-aiwall
  tip: e1fbbbef
  base: b339e178
  originSessionId: ff8b4b71-3ea5-4d7a-9793-42190018c11f
  modified: 2026-07-26T18:59:06.507Z
---

# Enforcer E-D shipped — the AI wall proven per-surface + no load-bearing AI

⭐ TRANCHE-2 ENFORCER E-D (remainder) @ claude/e-aiwall tip **e1fbbbef** (base b339e178,
composite-r4; NOT folded/pushed). Spec: docs/THE_APLUS_EXECUTION_ARCHITECTURE.md §E-D
(closes bar 19 AI STRUCTURE, repo-provable half). ONE commit, tests only, eager Δ 0.
C4 had already built the RLS/AI-metering/model-drift/session censuses — E-D adds the two
remaining pieces.

## What the enforcers are
- **tests/security/aiSurfaceSourceScan.test.js** — the finite-semantics wall proven PER
  SURFACE (generalizes the one-wall tableEventsNoFreeText). Derives the AI roster from
  source (every supabase/functions/<fn> whose .ts tree matches the model-call regex), then
  a `AI_SURFACE_WALLS` disposition manifest declares how each keeps model output off typed
  engine state: **shadow** (narrative→aiSettlement display-only, never state.settlement;
  verifyAiOverlay+scrubClerkRegister), **walled** (surveyorWrite raw output re-projected by a
  deterministic domain wall before apply), **display** (read-only prose answers), **none**
  (parley — no client seam), **byok** (surveyor-byok status transport). Census completeness
  test reds when a NEW model-calling surface has no disposition.
- **tests/domain/aiFallbackTotality.test.js** — no load-bearing AI. Runs AI-off
  (isConfigured false in test env): the deterministic generator makes a complete typed
  settlement and runTemplateNarrative (src/generators/aiLayer.js) dresses it fully with zero
  AI; every surface degrades to a coherent fallback. Coverage checked against the discovered
  roster (a new surface without a driver reds).

## Why (durable facts about the AI architecture — verify before asserting)
- The **model-calling edge roster** = 12 at b339e178: ai-analyst, construct-realm,
  construct-settlement, custom-content, generate-chronicle, generate-narrative,
  interpret-session, interview, parley, style-overhaul, surveyor-autonomy, surveyor-byok
  (surveyor-byok calls the model with the USER's key for a health verify; the other 11 are
  C4's credit-spending set).
- **The finite-semantics wall per surface** = a deterministic domain validator/vocabulary
  that re-projects raw model output onto a FINITE typed set before it can touch engine state.
  The walls: buildContentVocabulary (contentVocabulary.js), validateBespokeStyle/
  buildStyleVocabulary (townMapStyleWall.js), buildConstructVocabulary (configVocabulary.js),
  buildOpVocabulary (opVocabulary.js)+applyDispatch, validateStopCondition (stopConditions.js)
  +validateNudge (accelerationOps.js). surveyorWrite.js returns model output RAW; the panels/
  domain walls re-validate ("the suspenders").
- ⚠ **aiSettlement is a DISPLAY-ONLY shadow** (src/store/aiSlice.js setAiSettlement, line
  ~309/329): the AI overlay commits to `state.aiSettlement`, NEVER `state.settlement`. The
  typed settlement is immutable to the model; verifyAiOverlay only REPORTS drift.
- ⚠ Every streamed narrative string passes **scrubClerkRegister** (src/lib/ai.js: em-dash→
  comma, `!`→`.`) before the store meets it.

## ⭐ 2026-07-26 EXTENSION — the census is now TWO-SIDED (composite-r4 @ **59f76448**)
Committed in worktree `minifold` (branch claude/composite-r4, base 8033ddbe). Enforcement
only; tableClerk.js runtime untouched. 19 → 27 tests.

**The gap that was closed.** Discovery walked `supabase/functions/*` only, so it was blind
to a client transport whose edge half is not in the tree — and one is: `src/lib/tableClerk.js:59`
invokes `'table-clerk'`, an edge function that **has never existed** here (confirmed
`git log --all --diff-filter=A`; the string appears in NO other file in the repo, so
scripts/deploy.sh — which iterates `supabase/functions/*/` — would never deploy it either).
The census asserted nothing about it; only tests/domain/tableLedger.test.js:111-131 protected it.

**The new client pass** (independent of edge-directory presence):
- PASS A (direct): `invoke('slug')` literals + `functions/v1/<slug>` URLs. Precise, so
  single-word slugs (`interview`) are kept — a kebab-only pattern silently drops them.
- PASS B (indirect): only files where `functions.invoke(<variable>)` appears — those
  demonstrably route slugs through a helper/const/ternary (lib/surveyorWrite.js posts SIX
  AI surfaces via its `postWrite` helper, two of them ternary-assigned). In those files only,
  harvest kebab literals + any single-word literal naming a real edge dir. Restricting the
  harvest to indirect routers is what keeps it noise-free: **zero false positives, 23 slugs**.
- ⚠ A refined "first-call-argument" variant was tried and is STRICTLY WORSE — it lost the
  ternary-assigned `construct-realm`/`construct-settlement` and added noise (`abort`,
  `initiate`, `welcome`). Don't re-derive it; position-agnostic kebab harvest is the answer.

**New contract**: every client-invoked edge must be dispositioned — an `AI_SURFACE_WALLS`
entry, or a row in the new `NON_AI_CLIENT_TRANSPORTS` allowlist (11 rows) giving the reason
it carries no model output. Exact-set checked both ways. `table-clerk` = **walled**
(client re-validates via `domain/tableLedger.reviewClerkProposals`) + **`edge: 'absent'`**.
That marker is checked BOTH directions: an undeclared dir-less AI surface reds, AND an
'absent' marker whose directory has since landed reds — so the owner-gated fold must
re-enter the edge-side census instead of coasting on a stale claim.
The `'none'` tripwire (parley) now rides the shared census; `clientFilesInvoking()` retired.

**Accepted regex-gate gaps, recorded in the file header**: a slug assembled from fragments
(`'construct-' + scope`) is invisible to both passes; inside an indirect-router file a
single-word slug with no edge dir is missed. Both fail toward review, never toward silence.

**Proof it bites** — 7 planted mutations each red the intended test, then revert green
(new undispositioned transport · helper-routed surface · parley client seam · dropped
`edge:'absent'` · landed dir with stale marker · stale allowlist row · AI smuggled into the
non-AI allowlist). The repo's OWN sweep mutation (scripts/mutation-sweep.sh #25,
`supabase/functions/zzz-mutsweep-aiwall`) still reds → the relaxed stale-entry check did NOT
weaken the edge-side guarantee. eslint clean; tests/lint 264/265; 36 non-pglite security
files 446 passed.

## ⭐ 2026-07-26 PART-2 EXTENSION — ONE census, imported twice @ **e8a65e20**
Closes OPEN gap #1 below, by exactly the cure that note named. Worktree `minifold`
(claude/composite-r4, base 59f76448). COMMITTED, not pushed. 3 files, +324/−153.
Enforcement only; `src/lib/tableClerk.js` verified byte-identical to HEAD at commit time.

- **NEW `tests/security/aiSurfaceCensus.js`** (plain helper, not `*.test.js`, so vitest never
  collects it — the creditLedgerHarness.js / netExecuteGrants.js idiom). Owns the whole
  census: `MODEL_CALL`, `tsFilesUnder`, `clientFilesUnder`, `callsModel`, `EDGE_DIRS`,
  `AI_SURFACES`, the 4 slug regexes, `discoverClientTransports`, `CLIENT_TRANSPORTS`,
  `invokersOf`, and the relocated `NON_AI_CLIENT_TRANSPORTS` (both halves classify against
  it; part 1 still enforces its honesty). Derives `ROOT` from `import.meta.url`, not
  `process.cwd()`.
- **`AI_SURFACE_ROSTER` = the union**: model-calling edge surfaces ∪ client-invoked AI
  transports. **12 edge + table-clerk = 13** today (23 client transports, 11 declared non-AI).
  `CENSUS_FLOORS` = {edgeSurfaces:11, clientTransports:20, roster:13}, shared so the two
  walls cannot drift on the bar either; lowering one is the only legal move.
- **Part 2 now drives `table-clerk`** — CONFIRMED shape AI-off: `{ok:false, error:'The clerk
  is resting — record it by hand below.', refusalKind:'tier'}`. The driver asserts
  `refusalKind === 'tier'` **specifically** because the empty-input path returns
  `refusalKind:'input'` and would satisfy `expectWriteRefusal` without ever reaching the
  `isConfigured` branch — a green check proving nothing. Also asserts the manual picker's
  closed vocabulary stands AI-off (4 kinds / 3 bands / 6 obligation types), so "record it by
  hand" points somewhere real.
- **Part 2 gained the reverse check** it never had: `no fallback driver outlives its surface`
  (exact set, not a floor) + a two-sided non-vacuity guard pinning `table-clerk` by name.
- **Bonus fix**: `dressRoadScene` (src/lib/roadSceneAi.js) was IMPORTED by part 2 and never
  driven — a dead import that read as coverage. It posts the **already-rostered `ai-analyst`
  slug**, so the roster (keyed by SURFACE, not module) can never demand a second driver. Now
  folded into the `ai-analyst` driver, which drives BOTH transports. ⚠ General lesson: one
  slug can have N client modules with N different AI-off branches; the census counts slugs.

**Proof it bites** (each planted, observed red, reverted green): a new client-invoked AI
transport with no driver (`src/lib/zzzMutsweepAiTransport.js` → reds part 2 coverage AND
part 1 disposition) — with the **attribution control** that the edge-only denominator stayed
at 12 and never saw it, i.e. the OLD part-2 census would have stayed green; a ghost driver
key (reds the new exact-set check); `if (false && !isConfigured)` in tableClerk.js (reds the
table-clerk driver). The repo's own sweep #25 `zzz-mutsweep-aiwall` still reds part 1, so the
manifest LABEL JOIN survives the refactor.

**Gate**: 46/46 both enforcers · eslint clean · tests/lint+tests/docs 377/378 (only the known
manifest red) · tests/domain 8212/8218 (6 reds all in distribution.test.js, generation-lane
uncommitted work, imports none of these files) · 36 non-pglite security files 446/446.
⚠ `npx vitest run tests/security` shows ~20 FAKE pglite reds under parallel load — isolated,
aiSpendSafety passes 8/8. Isolate before believing any pglite red.

**Still open here**: `tests/domain/aiFallbackTotality.test.js` escapes E-A enumeration —
outside the seven ENFORCER_DIRS and its basename carries no invariant token, so it gets no
mutation-coverage manifest entry and no sweep mutation. Renaming it (or widening the rule) is
a program-level call that also touches scripts/mutation-sweep.sh + the manifest, both dirty
with parallel-session WIP. Deliberately deferred — documented, not a bug to re-find.

## ⚠ OPEN sibling gaps found 2026-07-26 (NOT fixed — flagged, not dropped)
1. ~~**E-D part 2 has the SAME blind spot.**~~ **CLOSED 2026-07-26** by the part-2 extension
   above (shared `tests/security/aiSurfaceCensus.js` + union roster + a real table-clerk
   driver). Uncommitted at time of writing.
2. **`TABLE_CLERK_FINGERPRINT` was an unenforced pin** — src/lib/tableClerk.js claimed the
   graph is "pinned via TABLE_CLERK_FINGERPRINT" while the export was consumed by NOTHING.
   ⏳ **BEING CLOSED BY A PARALLEL SESSION** as of 2026-07-26 ~14:57: `tests/build/
   tableClerkLazy.test.js` appeared UNTRACKED and tableClerk.js's header now cites it
   (always-on source scans + a dist-closure absence keyed on the fingerprint, run by
   `npm run verify:dist`). Not mine, not in e8a65e20 — verify it landed before claiming it.
3. **Pre-existing red, not ours**: tests/lint/mutationCoverageManifest.test.js reds on
   UNTRACKED parallel-session files lacking manifest entries. Reproduced identically with our
   change reverted to HEAD. Whoever authored them owes the entries. (Was three on 2026-07-26
   morning; by 14:50 the same day it was **two** — governanceNarrative + powerEconomyFreshness,
   both still `??` — commandRegistry.walker having been resolved by a parallel session. The
   list MOVES; re-measure, never quote it.)

## FINDING surfaced (queued, NOT fixed — E-D scope forbids src edits)
⚠ **parley has NO client invocation seam** in the tree at b339e178, despite being a live
model-calling, credit-spending edge surface (present in sessionGateCensus + aiMeteringCensus
rosters). Recorded as disposition 'none' with a tripwire that reds if a client seam is wired
without declaring a disposition+wall. Whoever wires parley's client must add it to both E-D
walls. Not a bug in the tests.

## How to apply / gotchas
- Gate that passed (verbatim reproducible): `node scripts/check-domain-strict.mjs` bare = 0
  → `npm run typecheck` (tsc --noEmit -p tsconfig.full.json) = 0 → eslint both files = 0 →
  both enforcers pass (35 tests) → python NUL scan = 0 → eager Δ 0.
- **Mutation-proved the enforcers bite**: dropping a manifest entry reds census completeness;
  breaking a wall symbol reds the walled per-surface check. (Ran a scratch mutant inside
  tests/, deleted after — vitest `include` only matches under tests/, so a scratch-path file
  is "No test files found".)
- The census detector scans EVERY *.ts under each function dir (not just index.ts) — parley's
  model call lives in parleyCore.ts. If you tighten the regex, re-check the roster stays ≥11.
- NOT folded/pushed (owner-gated). Sits parallel to the other vision-* E-lanes on b339e178.
