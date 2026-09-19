---
name: es5d-compiled-architecture-beta
description: "ES-5d compiled as DRAFT — COMPILABLE under the one-tick deposit idiom, a REFUSE-FORWARD under the errand-row carrier; CR-ES5C-3's \"BUILD four things\" is measurably two builds and two reuses"
metadata: 
  node_type: memory
  type: project
  originSessionId: 0e891b2f-8f5a-4f56-bc66-d7add755cac2
  modified: 2026-08-11T10:59:15.130Z
---

ES-5d (the career CREDIT, §3.14 arm B) compiled as a DRAFT at HEAD `857e3a1a` (scratchpad
`es5d-packet-draft-ES-5D.md`). **NOT a refusal — but only under one of two architectures**,
and the choice is the budget. ⚠ INDEX LINE OWED — this file was written by a lane that
declined to race a concurrent lane on MEMORY.md.

## ⭐⭐ THE ARCHITECTURE DECISION IS THE BUDGET DECISION

- **α — carry the grade on the errand row** (a new `COVERT_KEYS` field): needs **FOUR**
  existing logic-bearing production files against a cap of THREE ⇒ **REFUSE-FORWARD**.
  The fourth is `npcLadderState.js`, because a persisted consume-once marker must be taught
  to BOTH explicit key lists — `normalizeStanding` (`:326-346`) and `sortedStanding`
  (`:768-801`) — or it EVAPORATES (the normalizeErrand class).
- **β — a one-tick deposit ledger** (the `readRoadsBondEvents` idiom): **TWO** modified files
  ⇒ **FITS**. The strict `depositTick === tick - 1` window plus the writer's own prune make
  the fold fire once with **NO persisted marker**, so neither key list is touched.
- ⛔ The tempting third option — reuse the already-persisted `st.week` as the marker — is
  **REJECTED**: `st.week` is CALENDAR WEEKS (`npcLadderKernel.js:418`) but an errand's
  `homeTick` is a TICK (`envoyErrand.js:412-449`). **Never cross the clocks to save a file**;
  this volume was bitten once already by `whereabouts.sinceTick`, whose name lies.

## The four CR-ES5C-3 claims, ALL RE-VERIFIED at `857e3a1a` — and all four hold

1. `momentum` — `grep -rn "momentum" src/domain/worldPulse/npcLadder*.js` → **exit 1, ZERO**.
2. `maintainMarks` never writes `stock` — `npcLadderState.js:318` spreads `st` and overrides
   only `stigma`/`grudges`/`lastExposed`/`wasOusted` (+optional `bonds`/`lastLieSeen`).
3. No `stock` writer takes external input — the road's only one, `applyGoalLifecycle`
   (`npcLadderKernel.js:330-364`), is `stakes × delta × attributionWeight × DEPOSIT_SCALE`,
   every term ladder-internal.
4. The grade dies unread — and the trace is ONE HOP LONGER than §3.1b said: it reaches
   `envoyPulse.js:469 espionageLandings` and is discarded at **`pulseKernel.js:2031-2054`**,
   which destructures seven other fields off `envoys` and never touches it.

## ⭐ WHAT §3.1b DID NOT MEASURE — "build four" is really two builds + two reuses

- **THE MAINTENANCE ROAD IS `npcLadderKernel.js:624-671`** (advanceLitLadder PASS-1 rung loop):
  decay/seed `stock` → `freshLieExposureFor` (`:643`) → `maintainMarks` (`:644`) →
  `applyGoalLifecycle` (`:647`) → two `mintBond` folds (`:653`, `:661`).
  ⭐⭐ **The two external deposit Maps are HOISTED ONCE PER ADVANCE at `:439` and `:444`, then
  `.get()` per rung.** That hoist is the file's own answer to the hot-path problem and it is
  the shape to copy — NOT `freshLieExposureFor`, which is O(1) only because the credibility
  ledger is already nid-keyed and an errand ledger is not.
- **The espionage set ALREADY owns persistence:** `setSpatialLedger(worldState,'beliefMaps',…)`
  at `espionageProducts.js:509-511`, and `writeErrands` routed by `amendCovert`
  (`espionageProductStage.js:365-373`).
- **⚠⚠ ES-5c's REPAIRED SCAN CARRIES A SECOND PIN NOBODY RECORDED OUTSIDE ITS OWN FILE:**
  `tests/domain/espionageProducts.test.js:311-315` asserts `amendersOf(sources)` equals
  **exactly `[espionageProductStage.js]`** — only ONE espionage module may route `writeErrands`.
  It binds every later espionage wave and it is why architecture α is doubly expensive.
- **THE IDENTITY BRIDGE is three hops that all exist; only the composition is new.**
  `errand.from` → sid (`envoyErrand.js:268`) → `rosterPersonById(…)` → the roster npc
  (`envoyCasting.js:178-190`) → `npcId(sid, npc, index)` (`npcAgency.js:193`).
  ⚠⚠ The two spellings are **structurally disjoint forever**: a ladder nid is always
  `` `${sid}:…` ``; an errand `npcId` is `wnpc_<hex8>` (FNV1a, `npcLedger.js:548-567`) or a
  bare rosterId. `errand.npcId === ladderNid` is impossible, not merely unlikely.
  ⭐ **Do the bridge on the ESPIONAGE side at deposit time** — both inputs (`npcAgency.js`,
  `envoyCasting.js`) are UNLAYERED, so they mint ZERO coupling pairs.

## Mechanics that bite

- ⚠⚠ **`thirdPartyRansom.js:358-359`: the CALLER must spell the ledger key as a STRING
  LITERAL at the `setSpatialLedger` call site**, or `spatialLedgerCoverage.walker` cannot see
  the write. And a TRACKED `spatialUsage` classification **FAILS OPEN** — it needs a
  behavioral pin run as two mutants.
- **Only ONE new coupling pair is minted:** `npcLadderKernel.js → <the new INFO leaf>`,
  `INFO→INTERIOR`, needing its OWN row under `pairId: CPL-20`. ES-5c's row does NOT license
  it — `licensingRows` joins on the IMPORTER module and ES-5c's read is
  `npcLadderChallenge.js#defenseScore`. `npcLadderKernel.js` holds ZERO espionage refs today.
- Measured effective lines at `857e3a1a`: npcLadderKernel **577**, npcLadderState **604**,
  npcLadderChallenge **181** (= ES-5c's projected 172+9, the projection held),
  espionageProductStage **540**, espionageCareer **30**, envoyErrandRecords **685** (only 115
  headroom), couplingRegistryEspionage **165**, spatialUsage **176**.
  ⛔ `npcAgency.js` **833/833 EXACT, zero headroom** — the ONLY size-baseline entry in any of
  these families.
- Lighting census row at compile: **`2389/364/2025/19610/5543`**
  (`sovereigntyLightingContract.walker.test.js:3581`).

## Open items the chair must close (full text in the draft §13)

O1 the architecture (recommend β) · O2 the credit magnitude + its tuning HOME (recommend the
leaf's own frozen export, NOT `LADDER_TUNING`, because that file is otherwise untouched) ·
O3 the grade→credit map (recommend exceeded/met credit 2:1, partial/empty zero, no debit —
`freshMissionGradeFor` already caps an unfilled-leg mission at `partial` so crediting it
would undo that cap) · O4 the ledger key name + TRACKED classification · O5 whether a
ladder-dark world still deposits · O6 whether a new `spatialLedgers` key is owner-gated ·
**O7 ⚠⚠ `PACKET_STANDARD.md:125`'s "exactly one named writer" is genuinely ambiguous — under
a per-PACKET reading NO handoff wave can ever ship, because a handoff has a depositor and a
consumer by definition. Read it PER-STATE.** · O8 the id-less operative · O9 the fold's
placement.

Parity grid for O2, measured: `STAND_MAX: 10`, `STAND_BASELINE: 3.0`,
**`SEED_SPREAD: 3.0` = the ENTIRE structural height of the ladder in stock units**,
`STAND_HALF_LIFE_WEEKS: 156`, `GOAL_TUNING.DEPOSIT_SCALE: 1.5`.
⚠ The espionage `*_W` 0.5 parity does NOT transfer (weights in a 0..1 ratio vs an additive
delta on a 0..10 stock) — the same warning ES-5c carried.
