# LANE REMEMBRANCE — receipt (COMPLETE)

**Seat:** Opus 5. **Dock (read-only):** `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/58f0a8e2-2c4f-4073-8635-ecc7cf5010f6/scratchpad/laneKERNELMARK-tree`, HEAD `1223489c9` — verified by `git log --oneline -1`:
`1223489c9 §891 register 10/10: the known-failure census re-freezes on a corpus four files larger, banking nothing and raising nothing`.

**Posture honoured in full.** No file edited, staged, committed or deleted anywhere in the dock or
the repo. No vitest, `npm test`, `npm run check`, `npm run build` or any other test command run —
not one file. No subagent spawned. No `node_modules` symlink materialised. Writes confined to
`…/d5b9a39f-…/scratchpad/remembrance/`. Everything read in a source file is treated as data.

**Deliverables:** `receipt-remembrance.md` (this), `lifecycle-map.md`, `reader-design.md`.

---

## 1. THE URGENT FACT — verified myself, not taken on trust

`scripts/review/readerCorpus.mjs:116-121`:

```js
export const PREVIEW_OVERLAY = Object.freeze({
  warMemoryEnabled: true,
  espionageEnabled: true,
  demographicsEnabled: true,
  neutralNeighborsEnabled: true,
});
```

`warMemoryEnabled: true` is its FIRST key. Two roster rows carry the overlay —
`rr-preview-full` and `rr-preview-dramatic` (lines 147-148, `overlay: 'PREVIEW_OVERLAY'`) — and
`overlayForRow` (line 176) applies it into `fullRules` through `composeSoakRules` (line 258-262).
**CONFIRMED.** The corpus the owner will personally walk turns this flag on.

⭐ **And it is worse than the brief states.** The rubric already *asks* the war-memory questions:
`scripts/review/readerRubric.mjs:38` seats a `war_memory` system, and lines 117-118 register
`Q-WAR-1` and `Q-WAR-2` with `recordHome: 'war'`. A `written-but-unseen` answer must cite the
RECORD document — and the corpus's `war-${save.id}` record (`readerCorpus.mjs:713-722`) dumps only
LIVE war state (`status`, `exhaustion`, `sieges`, `tradeWars`, `dispositions`,
`exhaustionStandings`, all from `warStatus.js`). **The concluded-war ledger is in neither the
surface documents nor the record document.** So on the preview posture the flag is ON and there is
nothing to cite in either direction. **CONFIRMED.**

## 2. THE WRITE SIDE, EXACTLY

**One producer, one call site, one gate.**

- Gate — `src/domain/worldPulse/concludedWars.js:91-93`:
  ```js
  export function warMemoryActive(rules) {
    return rules?.warMemoryEnabled === true;
  }
  ```
  Read at line 328 (`if (!warMemoryActive(rules)) return null;`), then a second stand-down for a
  paused tick at line 332 (`if (deferred) return null;`).
- Call site — `src/domain/worldPulse/pulseKernel.js:2826`, the LAST fold of `consequence_fold`:
  ```js
  if (nextConcludedWars) memoryState = { ...memoryState, concludedWars: nextConcludedWars };
  ```
- Shape authority — `src/domain/worldPulse/concludedWarRecord.js`,
  `normalizeConcludedWarRecord` (line 433) / `normalizeConcludedWars` (line 534).

**The record shape, quoted from the normalizer's own `known` object (lines 489-510) rather than
paraphrased:**

```js
const known = {
  schemaVersion: CONCLUDED_WAR_SCHEMA_VERSION,   // 1
  warId,                                          // `war.<lowId>.<highId>.<openedTick>.<seq>`
  originPair,                                     // [string, string], codepoint-sorted
  originAttackerId,                               // must be a member of originPair
  ...(row.mutual === true ? { mutual: true } : {}),
  openedTick,                                     // whole engine TICK
  concludedTick,                                  // whole engine TICK, >= openedTick
  sealed,                                         // boolean; append-closed once true
  form,                                           // 'full' | 'epitome'
  participants,                                   // [{ id, label?, side, joinedTick?, leftTick?, viaCallId? }]
  casusReasons,                                   // [{ type, score, receipt, atTick? }]
  ...(Object.keys(sacredAnchors).length ? { sacredAnchors } : {}),  // { attackerPatronRef?, defenderPatronRef? }
  fact: normalizeFact(row.fact),                  // see below
  ...(victorId ? { victorId } : {}),
  ...(terms.length ? { terms } : {}),             // [{ type, family, good?, assetId?, durationTicks?, magnitude? }]
  territorialOutcomes,                            // [{ settlementId, kind, occupierId?, tick?, fallenSeatLabel? }]
  cost: normalizeCost(row.cost),                  // { attackerRemainingBand?, exhaustionBands: { [id]: bandKey } }
  ...(lastStanding ? { lastStanding } : {}),      // { causeBand?, costToContinueBand?, costToStopBand?, momentumBand?, homeFrontBand? }
  notableEngagements,                             // <=5 of { kind, tick?, settlementIds[], sourceEventId?, region? }
};
```

and the fact block (lines 278-291):

```js
return {
  closed: true,
  ...(closeRoad ? { closeRoad } : {}),            // one of 13 CLOSE_ROADS tokens
  terminalOutcomes,                               // [{ id, candidateType, targetSaveId, tick }]
  ...(row.loserDied === true ? { loserDied: true } : {}),
  ...(row.coalitionFragmented === true ? { coalitionFragmented: true } : {}),
  ...(seatTransitionFamily ? { seatTransitionFamily } : {}),
  ...(peaceReason ? { peaceReason } : {}),
  ...(row.treatyWritten === true ? { treatyWritten: true } : {}),
  ...carried,                                     // unknown channels preserved verbatim
};
```

**Storage:** `worldState.concludedWars`, a `{ warId → record }` object registered as the LAST
member of `CONDITIONAL_LEDGER_KEYS` (`src/domain/worldPulse/worldState.js:498`).

**⚠ THE SHAPE IS WIDER THAN THE WRITER — measured, and it changes what a reader may promise.**
Counting each field in the writer vs the shape module, these are in the shape and produced by
**nothing**: `fact.peaceReason` (0 in writer), `fact.coalitionFragmented` (0), `terms` (0 as a
written field), `lastStanding` (0), `participants[].label` (0), `territorialOutcomes[].fallenSeatLabel`
(0), `mutual` (0). Two are load-bearing: `classifyWarEnding` earns `exhaustion` only from
`peaceReason === 'exhaustion'` and `fragmentation` only from `coalitionFragmented === true`
(`warEndingClassifier.js:206,210`) — **so two of the eight endings are unreachable from this ledger
today.** `form` is always `'full'`; `warIdFor`'s `seq` is always `0`. **CONFIRMED.**

**⚠ UNITS.** Full per-field table in `reader-design.md` §0. The three that would each get a
different reading at a different consumer: every `*Tick` field is a **raw engine tick** (§69.3
forbids it on player/public/PDF surfaces — cure via `humanizeEngineTokens.tickCalendarLabel`);
`cost.attackerRemainingBand` and `cost.exhaustionBands[id]` are **band KEYS, never phrases**
(`concludedWarRecord.js:380-384`, resolved by `armyStrength.remainingStrengthPhraseFor` /
`warStatus.warExhaustionWordFor`); and `casusReasons[].score` is a **raw, unit-undeclared control
value** that the record's own no-raw-control-values law would refuse — it is present only because
the casus pin was copied verbatim, and no surface may print it.

**⚠ The flag survives normalization — I checked, because it could have failed here.**
`warMemoryEnabled` is a VIRTUAL rule key (`simulationRules.js:438`) with no `DEFAULT_SIMULATION_RULES`
entry. `normalizeSimulationRules` spreads `...input` before its coercion loop (line 1108), and
`BOOLEAN_KEYS` is derived from `Object.keys(DEFAULT_SIMULATION_RULES)` (line 949) — so a virtual key
is neither defaulted nor stripped. The kernel's normalized rules at line 313 still carry it.
**CONFIRMED.** Had this gone the other way the finding would have been the opposite one (a flag
that writes nothing at all).

## 3. THE VOID — **CONFIRMED**

Method: `grep -rn "concludedWars" .` over the whole tree minus `node_modules` and `docs/`, plus
targeted greps for `warEndingClassifier`, `concludedWarRecord` and `warId`. Complete result set is
tabulated in `lifecycle-map.md` §2. Every read of `worldState.concludedWars` in the estate:

1. `concludedWars.js:335` — the writer reading its own prior ledger.
2. `worldState.js:557` — the persistence normalizer.
3. `residueStripGuard.js:98` — a paused-tick leak guard; it reads to prove nothing was banked and
   surfaces nothing.
4. `worldSnapshotPublic.js:108` — a `WORLD_SNAPSHOT_HARD_DENY` member. This is an explicit
   **refusal** to project, the exact inverse of a reader.
5. Certification registers (`subsystemRowsMemory.js`, `couplingRegistryWar.js`), the AI charter
   bundles (which embed the source text as documentation), tests, and two frozen baselines.

**No component, no `src/domain/display/` read model, no `src/pdf/`, no world book, no campaign PDF,
no Foundry module, no Herald, no chronicle, no dossier.** Nothing reads these records.

Two corroborating facts rather than absence-of-evidence:
- `src/domain/certification/subsystemRowsMemory.js:79` says the wave built **"no Remembrance door —
  that door binds to T11's register form and is chartered separately."** The void is deliberate and
  chartered, not an oversight.
- `src/domain/display/warAndRoadNames.js:19-22` records that *"`warId` has one reader and no writer"* —
  the Herald's `arc` facet (`heraldIndex.js:157-160`, `status: 'pending'`). W-MEM built the writer for
  that socket and the socket is **still not connected**: `refsOf` reads `warId` off a NEWS ENTRY, and
  the writer puts `warId` on a LEDGER RECORD. The two never meet.

## 4. LIFECYCLE — six carry, one drops

Full evidence in `lifecycle-map.md`. Summary: **create** (kernel), **persist** (conditional-ledger
registration + its own normalizer), **re-derive** (the `ensureWorldState` fixpoint, idempotent by
test), **undo** (whole-`worldState` restore from `preWorldState`), **clone** (deep, by rebuild —
`not.toBe` pinned), and **save/campaign migrate** all CARRY. **Public-snapshot / gallery / world-export
import DROPS**, irrecoverably and by design — `worldSnapshotPublic.js` states the cost itself:
*"a world IMPORTED from a public snapshot re-enters with an empty ledger, and its pre-import wars are
then unrecorded FOREVER, because this ledger never backfills."* The **READ** path is the only genuine
hole, and it is total.

Two lifecycle subtleties a reader must respect: load-time hygiene runs **ungated** and **seals** any
staged record whose live edges did not come with the save (`concludedWarRecord.js:487`); and the
forward-version carry shares references for unknown fields (lines 271, 514-516), so a reader must
never mutate what it reads back.

## 5. DESIGN — recommended in one line

A new pure display leaf `src/domain/display/warRemembrance.js` projects the ledger into typed,
band-resolved, tick-humanized rows, `collectRealmSummary` gains a `wars` array beside its existing
`sieges`/`weary`/`standings`, and the *State of the Realm* painter gains a **"Wars Remembered"**
sub-head — one seam that lights `worldbook.dm`, `worldbook.player` and `campaign-pdf` at once,
dark-inert by the collector's existing `present` OR, with the producer, the record shape and the
public-snapshot deny posture all untouched. Two rejected alternatives, the exact file list, the two
existing test files it extends, and nine predicted register movements are in `reader-design.md`.

---

## RETROVALIDATION ROW

**WHAT I JUDGED (four calls, all inside lane scope, all vetoable):**
1. That the void is total and the four remaining `concludedWars` references in `src/` are not
   readers — the writer's own prior-ledger read, the persistence normalizer, a leak guard that
   surfaces nothing, and a deny-list membership.
2. That the correct seam is `collectRealmSummary` rather than the Herald arc facet or the dossier,
   on the ground that it is the only one reaching three walk-surface documents without minting a
   record or entering a parity contract.
3. That the reader must **omit `casusReasons[].receipt` and `.score` at every audience**, rather
   than widen `collectRealmSummary` with an audience argument — keeping the richer DM-only
   projection (`DESIGN_W_MEM §3.1`) owner-gated and unbuilt.
4. That the primary test host is `tests/pdf/campaignPdfLivingWorld.test.js` (it already pins the
   dark arms) with `tests/domain/concludedWarLedger.test.js` secondary for the adapter arm —
   **no new test file**, because the known-failure census is full at 10/10.

**WHAT A REVIEWER RE-DERIVES:**
- The void, by `grep -rn "concludedWars" .` excluding `node_modules` and `docs/` — a 5-minute check
  whose full expected output is tabulated in `lifecycle-map.md` §2.
- The shape-wider-than-writer finding, by counting `peaceReason`, `coalitionFragmented`, `terms`,
  `lastStanding`, `label`, `fallenSeatLabel`, `mutual` in `concludedWars.js` (0 each) against
  `concludedWarRecord.js`.
- The adapter requirement, by reading `warEndingClassifier.js:185` beside `concludedWarRecord.js:254-256`.
- The three-surfaces claim, by reading `readerCorpus.mjs:681,686,693` against
  `generateWorldBook.js:243` and `generateCampaignPDF.js:761`.
- The no-cycle claim, by `grep -n "^import"` on `razing.js` and `warConvergenceForces.js` (zero
  imports each).

**RECEIPTS BY PATH (absolute):**
- `/private/tmp/claude-502/…/58f0a8e2-…/laneKERNELMARK-tree/scripts/review/readerCorpus.mjs:116-121, 147-148, 176, 258-262, 681-713`
- `…/scripts/review/readerRubric.mjs:38, 117-118, 139-141`
- `…/src/domain/worldPulse/concludedWars.js:56-63, 91-93, 324-338, 419-461, 465-517`
- `…/src/domain/worldPulse/concludedWarRecord.js:250-292, 433-518, 520-544, 546-577`
- `…/src/domain/worldPulse/pulseKernel.js:150, 2815-2826`
- `…/src/domain/worldPulse/worldState.js:436-446, 484-499, 550-563`
- `…/src/domain/worldPulse/residueStripGuard.js:88-108`
- `…/src/domain/worldPulse/simulationRules.js:405-438, 945-958, 1103-1123`
- `…/src/domain/display/worldSnapshotPublic.js:64-108`
- `…/src/domain/display/warAndRoadNames.js:14-31` · `…/src/domain/display/heraldIndex.js:152-160`
- `…/src/domain/certification/warEndingClassifier.js:140-219`
- `…/src/domain/certification/subsystemRowsMemory.js:74-86`
- `…/src/utils/generateCampaignPDF.js:761-843` · `…/src/utils/generateWorldBook.js:199-264`
- `…/src/store/campaignAdvanceSession.js:164, 823`
- `…/scripts/lib/writer-reach-scan.mjs:90, 93-102`
- `…/tests/store/lifecycleRoundTrip.test.js:160-200, 460-500, 595-616`
- `…/tests/domain/concludedWarLedger.test.js:268-309`
- `…/tests/pdf/campaignPdfLivingWorld.test.js:1-30`
- Deliverables: `…/d5b9a39f-…/scratchpad/remembrance/{receipt-remembrance.md,lifecycle-map.md,reader-design.md}`

**PRIORITY.** **High, and higher than the brief assumed.** The lighting wave's own instrument
already asks two war-memory questions of a corpus that turns the flag on, and there is neither a
surface nor a record for them to land on — so this is not a dark door the walk would merely note,
it is a scored question the walk cannot answer. The car is small (one leaf, two hunks, two existing
test files) and droppable whole. **The one thing that must be re-measured before it lands is the
OSR baseline** (`reader-design.md` §5, row 1): a new reader of a default-dark ledger is the
reader-with-no-writer shape by construction, and the known-failure census has zero headroom, so the
OSR growth rows must be measured and refrozen in the landing act rather than banked as a red.

**LABEL SUMMARY.** Everything in §§1-4 is **CONFIRMED** against quoted source at `1223489c9`.
Everything in §5 and in `reader-design.md` §5 is a **DESIGN PREDICTION** — explicitly PLAUSIBLE,
written down before any instrument runs, so a later car can be graded against it.
