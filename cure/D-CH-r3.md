# D-CH-r3 — DISPOSITION LOG for `docs/DESIGN_FP_ARCH_CH.md`, P3 round 3a (lane D-CH-r3, Opus 5.5; chair a73343ed continued by 0a2e8bd9; 2026-10-18 17:44–18:08 EDT by `date`)

## OUTCOME
All 26 inputs that reach CH in round 3a are disposed: **20 CURED · 0 REFUTED · 0 STOP · 6 NOTED**, with 6 REFINED brackets and 1 withdrawn REFINED (round 2b's same-pass waypoint leg, per A.13).

- The one FAIL (SEAMS-r2-11) and the two new MAJORs (CH-V3, CH-V4) are cured. Each was re-checked against the receipt that convicted it, and CH-V4 was re-executed.
- Inputs:
  - `skeptic/CH-r2-verify.md`: its FAILS, its NEW FINDINGS and its eight minor notes.
  - The rows the other eight `*-r2-verify.md` files route to CH: MN's `paragonLean` form, PL-r1-15's tier line, PT-V1's lift, two RN minors, ST note 2 and PR-V6, PR-V9 and PR-V8, and the three FOLD minors.
  - Every A-row and the CH B-section of `briefs/RULINGS-ROUND3.md`, plus its §D.2 correction.
- The volume went from 1,053 lines (321,689 B, sha1 `b4d4e534…`, unchanged since round 2b) to 1,094 lines (351,944 B, sha1 `1c821fcb…`). The diff removes 41 lines and adds 88 (82 text lines and 6 blank).
- The edits are 56 anchored replacements and 5 line edits, spliced on one snapshot and all or nothing (`D-CH-r3-probe/apply-r3.py`). Four small post-apply touch-ups are listed in `apply-r3.notes`.
- Other files in `D-CH-r3-probe/`: the pre-round copy `CH.before-r3.md` and `volume.diff`.
- Every table's row-pipe count matches its header (checked).
- I did not touch git or the test suite. Master `81f1cd963` was only read.

## 1. FIRST ACT — the measurements that could refute the dispositions
CONFIRMED by code read at master unless marked.

**`npcDmVerbs.js :: assignRoamer` (CH-V3).**
- Its own law: "opening a DM assignment beside it would create two lifecycle owners and whichever pulse ran last would appear to teleport the person".
- Where `routeLifecycleActive` and `origin !== target`, it writes `transit: departure.leg` and `dmAssignment: { targetSettlementId, atSettlementId: '', issuedTick }`.
- Otherwise it places at once: `placeNpcRecord(worldState, wnpcId, target, at, { residency: null, transit: null, whereaboutsUnknown: null, dmAssignment: null })`.
- `npcDmVerbAuthority.js :: assignmentOrigin` returns `''` for a record in transit, so an assignment under the lit lifecycle refuses `no_route` mid-leg.
- `advanceAssignedNpcTransits`, on arrival: `placeNpcRecord(state, wnpcId, target, tickOf(tick), { residency: null, transit: null, dmAssignment: null })`.
- Kernel order: `advanceEnvoyDiplomacyPulse(` comes at `pulseKernel.js` l.2194 and `advanceAssignedNpcTransits({` at l.2222.
- `simulationRules.js` l.1119 has `routeLifecycleEnabled: false`, so the two-mover hazard is latent today.

**`rumorNetwork.js` (CH-V4, the leak).**
- The relay's guard: "`if (record.relayedTick != null) continue; // continuation guard`".
- `maxHopsFor` returns 2 for any non-major record.
- `RUMOR_TTL_TICKS = { major: 26, notable: 13 }`, and expiry is `now - arrivalTick > ttl`.
- `mergeArrival` keeps `arrivalTick: Math.min(...)` ("FIRST-HEARD wins the arrival").
- **EXECUTED, `findingsHome.out`:**
  - A findings seed at the home seat with `relayedTick` pre-stamped is held by `home` alone.
  - The round-2b shape, unstamped, reaches `home`, `meet` and `third` (two hops).
  - A notable, score-0 record has `maxHopsFor` 2. A record that arrived at tick 10 is gone at tick 24.

**The landed pair state (SEAMS-r2-11 · A.4).**
- `roads/embassyHazard.js :: atWarWith` = `atOpenWar(graph, a, b) || relationshipTypeBetween(graph, worldState, a, b) === 'hostile'`. `relationshipTypeBetween` reads the graph edge's `relationshipType`, else `relationshipStates`.
- `relationshipEvolution.js :: applyRelationshipPatch` clamps `trust`/`resentment` from the patch and appends `{ tick, type: metadata.incidentType … }` to `recentIncidents` (`slice(-7)`, so at most 8).
- The precedent, `sovereigntyTransfer.js :: accrueSaleGrievance`, writes `resentment: clamp01(r + m)` and `trust: clamp01(t − m)` with `metadata: { incidentType: 'sovereignty_sale' }` and `proposalPayload: null`. On a missing edge it is a no-op.
- The person stage receives `regionalGraph` (`envoyPulse.js`).

**The coast voyage (A.13).**
- `openNamedPersonLeg` takes any `fromId`/`toId` with a priced `nominalWeeks`.
- `namedPersonPathPosition` projects one leg onto a multi-node route, as Roads and `seaRoads.js` already do.
- `hopWeeks` → `pathCost` → `candidateRoutes(digest, a, b, 1)` is sea-augmented, and its storm law is applied with a season.
- **EXECUTED, `voyage.out`** (an eight-port coast with sea lanes, both seasons). There are 72 voyages that pass a harbour at sea. In every one:
  - the one-leg voyage is never at a settlement mid-voyage;
  - it is never slower than the landed hop-by-hop walker;
  - it is at least one week long.
- The landed walker re-plans from each port it reaches and makes 156 intermediate arrivals in all. `voyagePath.out` shows one example: the route p000→p001→p004 by sea, walked hop by hop as p000→p001→p002→p003→p004.

**The exclusion edges (PT-V1, CH's half).**
- `npcLedgerFacets.js :: normalizeExclusionEdges` keeps one edge per (settlementId, kind), and an indefinite edge beats any window.
- `liftExclusionEdges` with a door removes whatever edge stands there.
- **EXECUTED, `banLapse.out`:** a windowed ban alone lifts. An emergent ban merged under the DM's indefinite one stays under the guarded lapse; an unguarded lapse erases it.

**`seasonsEnabled`.** `pulseKernel.js` l.575 has `const roadSeason = seasonForTick(worldState.calendar.elapsedWeeks).season;`, with the comment "seasonal roads gate on the digest's seasonalOverlay, not seasonsEnabled".

**Sibling text (read 17:5x–18:1x, while the round-3a lanes were writing).**
- RN: the refused pairs (l.171), the doer rule (l.126), `believedWhereabouts` "whose doer is the paragon" (l.180), and `TELLING_SOURCES` with "hop-0 origin the meeting town" and the person-pair `eventRef` (l.200, l.261).
- PL: the REQUESTED family, "the REQUESTER's own flag ∧ `polityEnabled`" (l.368); the one ban grammar and P40's `polity_ban:p:…`/`polity_ban:u:…` (D-PL-r3).
- PT: shape 3's key grammar `wnpc_…` · `party` · `u:<unitKey>`, "which CH writes" (l.131).
- PR: §2.2's `stretch:<a|b>`, `cut01` and the leg-position half rule (D-PR-r3). §10.5 now calls `paragonLean(…, 'wildland', side)` as a multiplier (D-PR-r3).
- PS2 cites A.13 with "CH owns the paragon's legs".
- MN §5.2/§5.5 still apply the paragon terms additively. MN's lane owns A.15 on its side.

**Token census** (`census-r3.out`).
- `PARAGON_LEAN_SEAMS`, `menace_siege_draw`, `menace_raid_wear` and `patrol_rider_quality` have 0 hits everywhere.
- `paragon_leak` has 0 hits in src, tests and master docs, and 1 in the ledger docs (CH).
- `relayedTick` and `incidentType` are LANDED and reused in their landed meanings.

## 2. THE RECORD (round 3a)
| Id | Sev | Disposition | Where | Receipt |
|---|---|---|---|---|
| SEAMS-r2-11 (FAIL) · A.4 | M | CURED | §11 step 3; §9 accused; §2.2 `gateDefault` (+`graph`); §2.3; §21 L5; S7; S44 | `enemy_in_service` is the `hostile` pair label (`relationshipTypeBetween`), and `at_war_with_employer` is a live front (`atOpenWar`); together they are `atWarWith`. A heard leak writes one state-only `paragon_leak` incident on the real pair edge per band step (the `accrueSaleGrievance` idiom). RN's refused pairs and R51 |
| CH-V3 (NEW) | M | CURED + REFINED | CH8; §4.2 `work_here` + "One mover per record; the DM's post holds"; S6; S43; OD-CH-32 | the `assignRoamer` law and `advanceAssignedNpcTransits`' placement, quoted above. A posted paragon's walking purposes are not candidates (REFINED) |
| CH-V4 (NEW) | M | CURED | §8; §21 L9; CH-7 car-0; S6; OD-CH-32; OD-CH-40 | origin is the employer's seat, with `relayedTick` pre-stamped. EXECUTED `findingsHome.out` |
| CH-r2-verify m1 (leak re-seed; significance and score) | m | CURED + REFINED | §9 road 1; OD-CH-40; S7 | `mergeArrival` folds. Declared `notable`/0. The `eventRef` is per hire (REFINED) |
| m2 `seasonsEnabled` | m | CURED | §15 #12; CH-1 TIER | `roadSeason`, quoted |
| m3 gate/lens residue | m | CURED | §11 step 2, §11 belief, S40, §5 patrols | the word rule. The quoted PS words and chair words are kept |
| m4 §5 (d) wording | m | CURED | §5 patrols (d) | PR5 (a): "raiding menaces and untied dens" |
| m5 corps ban episode · A.8 | m | CURED | §11; S12; OD-CH-13 | PL §4.6, OD-PL-46, P40 |
| m6 PT corps edge arm | m | CURED | §11 corps step 1; §11 actor refs; §16b; CH-10 | PT shape 3 |
| m7 waypoint leg · A.13 | m | CURED (r2b REFINED withdrawn) | §11 voyage paragraph; §5 sea; CH-1 car-0; S41; OD-CH-39 | EXECUTED `voyage.out` |
| m8 actor kinds · A.7 · FOLD-r2v | m | CURED (CH's cite) | §0 row; §16b | A.7's text |
| MN-r2v `paragonLean` · A.15 | m | CURED | §2.2; §6.2 wildland; §5 patrols (d); S42; CH-3 leaves; §2.3 | one multiplier over `PARAGON_LEAN_SEAMS`, applied as `x × mult` |
| PL-r1-15 (CH's tier line) · A.5 | M (PL's) | CURED | §11 FLAGS/Tier; §19; CH-5 TIER; OD-CH-13; S12 | PL l.368 REQUESTED family |
| PT-V1 (CH's half) | M (PT's) | CURED + REFINED | §11 Lifted | EXECUTED `banLapse.out`. Eviction past eight (REFINED) |
| RN-r2v `believedWhereabouts` · A.12 | m | CURED | §2.2; §7 | RN l.180 |
| RN-r2v corps reading · A.12 | m | CURED | §16b | A.12's text |
| ST-r2v note 2 · PR-V6 · A.9 | m | NOTED | — | CH's body names only `settlementFundingBand` (3 hits). The single other hit is the round-2b record row |
| FOLD-r2v `a␟b` · PR-V9 · A.14 | m | CURED | §5 patrols (a) | PR l.151 `stretch:<a\|b>`. `hashInt` has 0 hits in CH |
| FOLD-r2v `cut01` · PR-V8 · A.14 | m | CURED | §5 patrols (a)/(b) | PR l.151 |
| A.1 | — | CURED (cite) | §5 patrols (d) | the one cap `min(0.25, σ_site + σ_patrol)` |
| A.2 | — | NOTED | — | 0 `holdBeforeNode`; CH holds nothing |
| A.3 | — | CURED (cite) | §5 patrols (d) | PR's feeder of the shared car |
| A.6 | — | NOTED | — | CH has no relief or incursion text |
| A.10 | — | NOTED | — | 0 `garrison`. CH's `readiness` (§14) is `beliefMap.js`'s "believed war readiness 0..1"; the homonym is routed |
| A.11 | — | NOTED | — | 0 `party_voiced` in CH. A paragon voice is RN §5.5's person arm |
| §D.2 (cults) | — | NOTED | — | 0 `cult` / `conclave` in CH |

## 3. STOPS
None. Every cure executes a RULINGS-ROUND3 row (A.4, A.5, A.7, A.8, A.12–A.15, the B-section) or a verifier's own cure line, re-checked at master.

One judgment is recorded as REFINED and vetoable: A.4 says `enemy_in_service` reads "(`hostile`, or at war)", which would make it name the same fact as `at_war_with_employer`. I split the one landed read (`atWarWith`) between the two words: the live front goes to `at_war_with_employer`, the `hostile` label to `enemy_in_service`.

## 4. REFINED (each bracketed in the volume, vetoable)
1. The `atWarWith` split between the two reason words (§11 step 3).
2. The accusation's bound: one `paragon_leak` pair incident per band step, at most two per court and hire (§9).
3. A posted paragon's candidate set: `work_here`, `take_rest` and `keep_rendezvous` only. Going home is the DM's assign home or a resignation (§4.2).
4. The leak `eventRef` per hire, `leak:<wnpcId>:<employerId>:<retainer.sinceTick>` (§9).
5. `banKeys` past eight: the oldest evicts first, and its edge then lapses only by its window or a pardon (§11).
6. The header and S1 say six flags. This was pre-existing: §19 has listed six since round 2's `paragonCorpsEnabled`.

**WITHDRAWN:** round 2b's same-pass next leg at a waypoint at sea, replaced by A.13.

## 5. ROUTED — the other volumes' halves (this lane wrote none of them)
- **RN** (§3.4 l.261, §2.4 l.200):
  - The `TELLING_SOURCES` arm copies a row's declared `relayedTick` onto the seed (the findings' pre-stamped guard).
  - The findings' origin is "the employer's seat", not "the meeting town".
  - The leak `eventRef` gains `:<retainer.sinceTick>`.
  - Each row declares `significance`/`score`.
- **MN** (A.15, its B row): §5.2 and §5.5 apply `paragonLean(…, 'menace_siege_draw' | 'menace_raid_wear').mult` as `x × mult`. §5.2 orients its draw so that a factor above one reads toward holding.
- **PR** (§10.5 l.420): the warden's call names the seam word, `paragonLean(worldState, settlementId, 'wildland', 'patrol_rider_quality')`, with d 0.10.
- **PT:**
  - l.323 restates `enemy_in_service` as "a court this court regards at `enmity` or worse". It should be the `hostile` pair label (A.4).
  - `party_gate`'s `gateDefault` calls (l.280, l.323, l.325) pass the stage's `regionalGraph` as `graph`.
- **THE FOLD** (P4):
  - §3.1.25 (l.320) and the §5 reason rows (l.710–711) restate `enemy_in_service` the old way.
  - §5 should register `PARAGON_LEAN_SEAMS` and `paragon_leak` as an `incidentType`.
  - §5 should note A.10's readiness words beside `beliefMap.js`'s `readiness` (believed war readiness), a homonym.
  - A.7's five kinds go in the §1 bracket and the spine.
- **PS:** "meets a town through CH's gate" (PS1 (d), l.578, OD-PS-34, l.725) should read "CH's town's gate" (the word rule).

## 6. OPEN FOR THE CHAIR
1. REFINED 1, the two reason words as the halves of `atWarWith`. The alternative strikes one word, which PT's card also cites.
2. REFINED 3, a posted paragon holds its post. The alternative lets it drift home on its own nature, and S6 then fails.
3. REFINED 4, the leak key per hire.
4. The PT and fold restatements of `enemy_in_service` (§5) are not in either lane's round-3 B row.

## 7. CONFIRMED vs PLAUSIBLE
**CONFIRMED by execution against master's own modules:**
- the home-only findings record and its two-hop control (`findingsHome.out`);
- the one-leg voyage against the landed walker (`voyage.out`, `voyagePath.out`);
- the guarded ban lapse (`banLapse.out`).

**CONFIRMED by code read:** every symbol in §1.

**CONFIRMED by quoting:** the sibling texts.

**PLAUSIBLE, not upgraded:**
- That `hopWeeks(embark, landing, season)` prices the same sub-path the route search took. The probe shows the landed walker re-plans onto a different path, so the voyage's own path is CH's leaf's choice.
- That RN, MN, PR, PT and the fold apply their routed halves.
- Every DRAFT constant: `m` 0.02, and the three `d`.
