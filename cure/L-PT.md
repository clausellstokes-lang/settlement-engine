# L-PT — compile log for `docs/DESIGN_FP_ARCH_PT.md` (lane L-PT, Opus 5.5, chair a73343ed; 2026-10-17)

Probes: `cure/L-PT-probe/` (`effLines.mjs` = R2's eslint max-lines reproducer; `effLines.out`; `tokens.out`). Code of record: master worktree `master-81f1cd963` (read-only). No git, no test suite.

## §1 FIRST ACT — the measurements that could refute the brief (all CONFIRMED by read or execution)

| # | Seam | Receipt | Verdict |
|---|---|---|---|
| M1 | the one party door | `partyImpact.js :: applyPartyImpact({ campaign, saves = [], action, now = null } = {})`; `buildPartyImpactOutcomes(action, { worldState, snapshot, tick = 0, now = null })`; host 327 eff. | holds; the deed mint is one call here |
| M2 | no undo on the door | `operationRegistry.js` `recordPartyImpact: { … undoToken:null, undoState:'none' }` | holds; the deed's `struck` mark is the undo (RN §3.3) |
| M3 | the sixth door | `src/store/roadsRescueInflame.js` (9 eff.): `get().recordPartyImpact(campaign.id, {` | holds; it mints through the same door |
| M4 | the composer doors | `mapEventToPartyImpact` callers: `src/store/settlementLifecycleHelpers.js` (139 eff.), `src/domain/events/drainQueuedEvents.js` (168 eff.); `partyEventLinkage.js` 27 eff. | holds; `party_event` deeds mint at both, room |
| M5 | the ban writer is dark-gated and person-keyed | `npcLedger.js :: addExclusionEdge(worldState, wnpcId, edge)` → `if (!npcConsequencesActive(worldState)) return { worldState, changed: false };` (also `liftExclusionEdges`) | REFINES ruling 13: the party's ban rides the widened key and carries `npcConsequencesEnabled` (no second gate — RULINGS §1) |
| M6 | the gate table is a FACTION-seating table | `npcCirculationTable.js :: rejectionFor({ faction, believed, factionAlignmentRead = 'unknown', history = {} })`: ban → scandal (when loud) → `alignmentReadsOppose` → `notoriety_too_loud` | holds for CH's projection; the PARTY's gate default reads the court's net regard (RN) first and the table only for the projected facets (§9.2) |
| M7 | the actor convention | `strategicPosture.js :: POSTURE_ACTOR_KINDS = Object.freeze(['settlement'])` | the SP-4a widening to `settlement · person · party · menace` is the chair's fold row (RULINGS §4) |
| M8 | the travel physics | `distanceRead.js :: hopWeeks(digest, fromId, toId, season = null, mode = null)` (544 eff.); `modeSpeeds.js :: reachBandOf(weeks)`; `namedPersonTransit.js :: namedPersonLegTicks(input)` with `UNPRICED_LEG_WEEKS: 1` | holds; REFINED: the party's journey uses the named-person physics, so aspatial worlds price legs at one week a hop |
| M9 | the fixed weathering order | `settlementRumors.js` `RUMOR_DETAIL_THRESHOLD = 0.75` · `OUTLINE 0.5` · `VAGUE 0.3` (567 eff.); `rumorNetwork.js` 364 eff. | holds; the parts' thresholds are a read-model table |
| M10 | the kernel persists only the rumor ledger from the rumor stage | `pulseKernel.js`: `memoryState = setSpatialLedger(memoryState, 'rumorLedgers', rumors.next);` | confirms RN-S1; PT writes nothing in the rumor stage |
| M11 | the weekly host | `envoyPulse.js` (332 eff.): "⛔ ENC-3 — THE DROP PASS, AND IT RUNS ABOVE THIS FUNCTION'S OWN EARLY RETURN" above `if (!envoyDiplomacyActive(worldState)) {`; kernel `const envoys = advanceEnvoyDiplomacyPulse({` after `const rumors = advanceRumorLedgers({`, then `memoryState = envoys.worldState;` | holds: PT's engagement pass mounts as one leaf stage in the same pre-gate block CH's weekly pass uses (RULINGS §3) |
| M12 | the need's clock | `stressorsCore.js :: normalizeStressor` carries `severity`, `age`, `durationPolicy`, `decayRate`, `status`, `lifecycleStage`, `affectedSettlementIds` — NO forward end date | REFINES ruling 7: a crisis need yields a THRESHOLD read weekly from its own state; a DEADLINE exists only where the actor sets a term (summons, invitation, offer); no forecast is computed |
| M13 | route closures | `hopWeeks` prices the frozen matrix; route impedance is news-only (`distancePricedNews.js :: routeAwareHopDelayTicks`, R2 Q7) | ⛔ STOP PT-S1 (below) |
| M14 | the IN plant road for slander | `infoLure.js :: LURE_AXES` settlement axes only; `lureCommission` no caller (R3 §1b); `informationStatecraft.js` 781 eff. (19 headroom) | ⛔ STOP PT-S2 (below) |
| M15 | `told` is landed on the information surface | `infoLure.js :: LIE_OUTCOMES = Object.freeze(['told', 'believed', 'caught'])` | REFINES RULINGS §5's `proof: kept · told · shown` → `unspoken · spoken · shown` (both FREE as literals: 10 / 65 prose files, 0 literals) |
| M16 | tokens | `tokens.out`: all eleven RULINGS party kinds + `party_banned`, `backing_voided`, `backing_repudiated`, `party_pledge`, `engagementState`, `pursuitClock`, `patienceClock`, `partyView`, `earliestArrival*`, `lastHeard`, `menace_weakened`, `menace_ended` = 0 src · 0 tests · 0 ledger docs (FREE); `presence` 197 src prose files (avoided as a field: `presentAt`, 1 prose hit); `backing` 51 prose · 0 literal | FREE as minted |

Nothing measured refutes a chair ruling outright; four rulings are REFINED by measurement (7 the clock, 13 the ban's gate, §5's `proof` words, ruling 18's flag name) and two passages are ⛔ STOPs.

## §2 THE STOPS
- ⛔ **PT-S1 — "a road a menace closed is not on the party" (party brief §6, ruling 7's "as it unfolded")**: the one travel physics has no closed-edge read — `hopWeeks` reads the frozen `distanceMatrix` via `pathCost`; the only route-state-aware delay is NEWS (`distancePricedNews.js :: routeAwareHopDelayTicks`, "recomputed on EVERY read"), not travel. Built: the siege that ends early (the clock ends earlier — the as-unfolded arm holds); NOT built: a road closed by a menace or a war. Degraded arm: the frozen journey plus the DM's amend in the pledge's week. Slot: C7 WAYFARE'S BODIES (route states) with MN's `where: road`. The chair rules whether the slot stands.
- ⛔ **PT-S2 — the slander's producer**: `party_slander` rides IN's plant road with a person axis (RULINGS §4), but `lureCommission` has no caller (U123's transport is C1's car), `LURE_AXES` holds only settlement axes (reopening it is deliberate, `axisFamiliesGrewSinceIn2`), and the lie host `informationStatecraft.js` has 19 lines of headroom. The kind, its card, its default and its lifecycle are designed (§7); the PRODUCER is C1's (IN-2), never invented here; dark until then.

## §3 REFINED (each marked in the volume)
R-PT-1 `proof` words · R-PT-2 `partyBackingEnabled` · R-PT-3 `earliestArrivalTick` (one integer per pledge, min over weeks) replaces the boolean · R-PT-4 the named-person physics for the journey (aspatial reachability) · R-PT-5 the need's clock (threshold from the need, deadline from the actor's term; two present facts on the card, no forecast) · R-PT-6 `presentAt` · R-PT-7 one party-engagement shape; five CLIMAX kinds named · R-PT-8 three counterforce kinds added · R-PT-9 `party_pledge` deed source · R-PT-10 unregistered `party_event` kinds read ambiguous · R-PT-11 the menace broken by the party's hand · R-PT-12 the party ban's gate · R-PT-13 invitations are an offer kind · R-PT-14 the engagement pass's host.

## §4 OPEN QUESTIONS FOR THE CHAIR
1. RN-S1: rule the envoyPulse pre-gate block knowing CH (ruled) and PT (this volume) mount there too — one host for the three person passes.
2. PT-S1's slot (C7) and PT-S2's slot (C1).
3. RN's deed table lists `proof: kept · told · shown`; PT owns the field and renames it (R-PT-1) — the chair brackets RN at P4.
4. Whether the `party_pledge` deed source (R-PT-9) is accepted into RN's `DEED_SOURCES` (RN closes the list "by a registry row in its owner's wave").
