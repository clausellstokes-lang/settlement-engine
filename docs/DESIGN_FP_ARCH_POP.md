# POP — THE COMPILED IMPLEMENTATION LAYER (FP POPULATIONS)

## Compiled 2026-08-04 by the POP program architect against the LIVE minifold tree
## (branch claude/composite-r4, HEAD e564e135). Source volume:
## docs/DESIGN_FP_POPULATIONS.md (drafted 2026-08-02 @ 38f81d05; the tree has moved
## since — every §1 verdict below is a fresh grep/read receipt, not the volume's).
## Template discipline: DESIGN_WAR_RULINGS_ARCHITECTURE.md §10 binds verbatim.
## LIVE CODE OUTRANKS THIS TABLE — re-verify anything you build on at build time.
## Every judgment below is labeled JUDGMENT and is vetoable.
[CORRECTED 2026-10-16 (coherence fold) — THE STATUS OF RECORD IS docs/DESIGN_FP_COHERENCE_FOLD.md §2; this header is history. In one line: LIT: none (`demographicsEnabled`, `commonsVoiceEnabled`, `migrationRumorsEnabled`, `routeLifecycleEnabled` true in no preset at 00b648c9d — OD-FC-18, OD-FC-3) · BUILT DARK: Wave P entire; the commons voice kernel (no cert row, not in the manifest, no dossier consumer); `MIGRATION_REFUSALS` (P2's) · UNBUILT: POP-1..POP-7 (zero tokens); the TC26 pop-1 train compiled and never landed; and the route network is never written (`ensureGenesisRouteNetwork`/`accrueRouteFlows` uncalled), so the migration menu is empty in every shipped world. The §1 measurements below are 2026-08-04 history; the corrections of record are bracketed in DESIGN_FP_POPULATIONS.md and here.]
[ADDED 2026-10-16 (coherence fold §3.4, requirement 24 — the owner's HEARING WEEK) — ENGAGEMENT KINDS this program registers in the wave that builds each: `column_at_the_wall` (POP-1). Once `hearingWeekEnabled` is lit no kind resolves in the tick it arrives at a one-week advance: it mints its pending verdict and the DM may leave it, tilt it or give a verdict (never a "decree" — the Decree Registry's word); month/season/year advances run the engine default; the hearing never parks the advance cursor (skeptic S5). Each kind's pending card is its FIRST-VISIBLE sign.]

---

## §1 SUBSTRATE CLAIMS — re-measured 2026-08-04

### 1a VERIFIED (34 rows; receipt = file:symbol or file:line as measured today)

| # | Volume premise | Live receipt (2026-08-04) | Verdict |
|---|---|---|---|
| S1 | Named-cast mercy: `pool = before − named`, `after = max(named, …)` | `demographicsKernel.js:282-297` — `const pool = Math.max(0, before - named)`; `const after = Math.max(named, before + births - deaths)`; `npcReplacement.js:329` `residentNamedNpcCount` | VERIFIED [CORRECTED 2026-10-16 (coherence fold) — the expression is now `Math.max(Math.min(named, before), …)` (demographicsKernel.js:313, CS-B2); see DESIGN_FP_POPULATIONS.md §1b.] |
| S2 | migrationDebt deliberately not built | `demographicsKernel.js:49` (header comment, standing) | VERIFIED |
| S3 | Herald mint site bypasses every governor | `demographicsKernel.js:402` `newsEntries: demographicNewsEntries({...})` — direct into the kernel result | VERIFIED (line survives at HEAD) [CORRECTED 2026-10-16 (coherence fold) — the mint is demographicsKernel.js:424 at 00b648c9d, and a feed-side governor now exists (CW-1, dark, display/cascadeBraid.js) — see POP-6.] |
| S4 | Demographics mounts via the lifecycle host, not pulseKernel | `settlementLifecycleKernel.js:83` imports `advanceDemographics` (L1 mount law confirmed) | VERIFIED |
| S5 | THE PULL SEAM: `destinationMenuFor` is the ONE menu builder; readings truth-side | `demographicsMigration.js:276-315`; readings from `demographicReadings`, viability from `tierViabilityOf` (:292-293, :311), spare/inbound at :301-302 (`room = floor(bound*DESTINATION_FILL_TARGET) − pop − enRoute`) | VERIFIED |
| S6 | Closed refusal vocabulary; `no_capacity` is PRE-departure | `demographicsMigration.js:108` `['none','partial','unreachable','no_capacity','unattractive']`; minted inside `competeForDestinations` :234-237 | VERIFIED |
| S7 | The landing is UNCONDITIONAL; `returned` fires only when the destination is unwritable; `lost` only when both ends are gone | `demographicsMigration.js` stage 1 (~:444-481): `target = writable(destId) ? destId : writable(originId) ? originId : null`; no capacity read anywhere at landing | VERIFIED — the fp-audit's arrival-clearing correction is TRUE at HEAD |
| S8 | 300-tick executed conservation identity WITH leak-detecting negative control | `tests/domain/demographicsMigration.test.js:209` (exact identity), `:234` "NEGATIVE CONTROL: break the release and the identical run LEAKS every traveller", `:273` restore, `:282` drop-when-empty | VERIFIED |
| S9 | travelClass mutex, fails closed toward M4 | `spatial/migration.js:474-485` `DEMOGRAPHIC_COLUMN_CLASSES = ['refugee','voluntary']`, `isDemographicColumn`; `releaseArrivals` (:578+) explicitly skips demographic columns ("NOT this pass's to land") | VERIFIED |
| S10 | P2 columns carry zero road mortality BY DESIGN | `demographicsMigration.js:36-43` header ("ZERO ROAD MORTALITY HERE, ON PURPOSE") | VERIFIED |
| S11 | M4: two mortality sinks, ZERO news of any kind | `migrationKernel.js:432,495,503` receipts `{originDeaths, roadDeaths}`; `grep -c newsEntries` = 0 in migrationKernel.js; `spatial/migration.js:114` `W_REFUGE: 0.18` | VERIFIED |
| S12 | Plan lane emits ZERO news; PATIENCE 78; closed RESPONSE_REFUSALS incl `absorbed` | `grep -c newsEntries` = 0 in demographicsPlans.js AND demographicsResponses.js; `demographicsPlans.js:162` `PATIENCE: 78`; `demographicsResponses.js:132-136` | VERIFIED |
| S13 | Permit table 5×6, default-false; failing.destination=true ("that is how it recovers"); promotion authored false below viable; ONE consumer (founding) | `demographicsLadder.js:79-101` grades `{viable, failing, evacuating, remnant_occupied, remnant_empty}`; :83-86 the authored comment; `moverPermitted` :209-213; sole consumer tree-wide `demographicsResponses.js:244` | VERIFIED |
| S14 | Promotion response gates on `no_next_tier`/`no_headroom` only, never the grade | `demographicsResponses.js:296-297` | VERIFIED (J-POP-17's premise) |
| S15 | Risk couplings capped, at the ONE pressure seam | `demographicsRisk.js:88,97` `DISEASE_LIFT_CAP: 0.22`, `RAID_LIFT_CAP: 0.20`; consumed `pressureModel.js:226-252` | VERIFIED |
| S16 | `perceivedScarcityOf` + `mistaken` clause — the one belief selector population math consumes | `demographicsWar.js:206` export; `:214-229` `mistaken` computed both arms; consumer :302 | VERIFIED |
| S17 | `populationTrendBand` behind `beliefAxesEnabled` | `beliefAxes.js:5-7, 61, 124` | VERIFIED |
| S18 | Commons kernel: weights 0.55/0.35/0.55; rungs at 0.35/0.55/0.75; DWELL 3; LEGIT_DIP `[0,1,2,3]` (FOUR slots); riot unrest +0.10; strict flag read | `commonsVoiceKernel.js:56-64, 50` | VERIFIED (J-POP-16's four-slot premise true) [RULED 2026-10-16 (coherence fold §3.1.3) — the blend is now `commonsGrievance01` (commonsVoiceKernel.js:102-109; 365 lines at 00b648c9d), also read by W-SEAT D10 (irregularForce.js:131); POP owns the composite AND a closed `GRIEVANCE_INPUTS` registry (kind · owning program · weight · cap) — every other program lands a ROW (see DESIGN_FP_POPULATIONS.md THE VOICE SEAM RULING).] |
| S19 | The ladder escalates ONE rung per dwell (the jump-rule premise) | `commonsVoiceKernel.js:266-271` "Escalate by at most one step once DWELL_TICKS…" | VERIFIED |
| S20 | Commons beat ids are `wizard_news.*`-shaped | `commonsVoiceKernel.js:168` `` id: `wizard_news.${tick}.${RUNG_KIND[rung]}.${sid}` `` ; the observation classifier files every `wizard_news.*` id under moverFamily `knowledge` (`subsystemRowsWaves.js:55`, recorded in prose) | VERIFIED — §1c skew prohibition stands |
| S21 | Commons runs BEFORE the assize, same tick | `assizeKernel.js:428-441` — the combined mover runs `advanceCommonsVoice` at :435 with the comment "first, so the petition it deposits is answerable THIS tick"; mounted `pulseKernel.js:2553-2563` | VERIFIED |
| S22 | The built answer reaches only named-accused / corruption-kind grievances | `assizeKernel.js:344-347` (`coupled = … namedAccused===accusedNid || (kind==='corruption' && charge==='corruption')`) | VERIFIED — POP-2's misrule-answer gap is real |
| S23 | The crowd's corruption input is REVEALED-only (POP-2's VERIFY-AT-BUILD, answered now) | `commonsVoiceKernel.js:134-150` `corruptionSignalOf` requires `corrupt===true && ousted!==true && timesExposed>0`, OR a live `exposedCorruption` ledger entry | VERIFIED — pin it as the volume orders |
| S24 | Commons three kinds registered in ALL THREE walkers (the shape POP-2 copies) | `display/settlementRumors.js:353-355` (WHAT_PHRASES); `tests/domain/impactKindWalkers.test.js:134-136` (EXPECTED_VOICE, `null` = deliberately crier-unvoiced); `realm/heraldRouting.js:228` | VERIFIED |
| S25 | Traditions adoption: ≥12% influx over 3y, fed from the live column ledger | `traditions/relations.js:48-49` (`ADOPTION_THRESHOLD: 0.12`, `INFLUX_WINDOW_YEARS: 3`); `traditionsKernel.js:624-644` influx captured from in-transit columns | VERIFIED |
| S26 | Arrival folds to a count + one history line; origins survive only in the transient receipt | `demographicsMigration.js:~483-497` (`demographic_arrival` receipt carries `origins[]`; settlement gets population + populationHistory row only) | VERIFIED |
| S27 | Lifecycle: 104-tick terminal dwell; resettlement is a privileged birth site; remnant scarcity law | `settlementLifecycleKernel.js:225` `TERMINAL_DWELL: 104`; header :22-25 | VERIFIED (52-tick fallow rebirth NOT re-measured — VERIFY-AT-BUILD) |
| S28 | Herald: hunger line (deficit01≥0.20 AND netLoss≥4), departure line (departures≥12 OR unplaced≥6), QUANTITY_BANDS-only; rides existing kinds, names the three walkers in its own header | `demographicsHerald.js:69-80` (floors exactly 0.20/4/12/6/200), :58 QUANTITY_BANDS, :22-31 header | VERIFIED [CORRECTED 2026-10-16 (coherence fold) — floors now demographicsHerald.js:86-93; THREE line kinds (`hungry_gap` :344, `migration_flight` :409, `population_crowding` :447 — CAPACITY C1 `ec6b0a1328`), `significance` authored per row (:352, :417, :455).] |
| S29 | Rumor lane gated `migrationRumorsEnabled`; two products (migrantPaths + flightEntries); one-directional TODAY only because no return column exists — the carrier itself reads ALL in-flight columns with NO direction or class filter (POP-1's VERIFY-AT-BUILD, answered now) | `spatial/migrationRumors.js:54-56` gate; `:83-91` `columnOf` filters only origin≠dest ∧ arrivals>0 | VERIFIED + ANSWERED — homeward carriage is automatic once a return column exists on the ledger |
| S30 | WHAT_PHRASES rows for the eleven population kinds ABSENT (de-underscore fallback) | zero hits for population_decline/population_growth/tier_change/steading_*/settlement_terminal_death/settlement_resettled in `display/settlementRumors.js`; the fallback arm is documented at :381-383 (107 kinds) | VERIFIED [CORRECTED 2026-10-16 (coherence fold) — NEWSTRAIN `6c862159ed` deleted the fallback and authored three of the rows; see POP-6.] |
| S31 | Pestilence front is a genuine traveling arc; materializes the ONE canonical `disease_outbreak` stressor; burial line is food-gated only | `pestilenceKernel.js:7-14, 223-234`; `demographicsHerald.js:175` | VERIFIED |
| S32 | Certification: `demographicsEnabled` row soakEvidence 'indirect'; the v5 stateKeys census walks `spatialLedgers` one level — a NEW ledger key is automatically census-visible | `certification/subsystemRowsGrowth.js:214-217`; the census mechanics recorded at :189-190 (upswing row) | VERIFIED |
| S33 | v5 realm demography instrument, additive, null-on-dark | `demographicsObservation.js:103` `measureRealmDemography`; wired `scripts/audit/behavioral-observation.mjs:~868-914` (note: path is scripts/audit/, the volume never named it) | VERIFIED |
| S34 | Push side: FIVE drivers each guarded; VOLUNTARY_MARGIN 0.06; CW-0 registry EXISTS with the full row shape; TERM_CATALOG carries NO migration_right/settlement_provision (⏱ SUPERSEDED: GR-3's population term family LANDED 2026-08-06 — `peaceTermsCatalog.js:247-254`, live reader `treatyEnforcement.js:301`, CPL-17 at `couplingRegistryGrammar.js:196-198`); `catalogGrewSinceWr10` tripwire FIRED-AND-DISCHARGED (see §5); six POP flags + departureMemory/calamityArcs unminted at the survey; SP-2 believed-conditions LANDED at SP-B 2026-08-05 (`believedConditionsEnabled`) | `demographicsPushPull.js:117-119, 218`; `certification/couplingRegistry.js` `COUPLING_REGISTRY` (⚠ ADDRESS SUPERSEDED — the registry is now a 178-line COMPOSITION over six desk leaves at schema v4, no POP leaf yet; the `:532` row-authoring address points past EOF; POP rows follow C-POPF-6's desk-leaf decision) (rows carry couplingId/pairId/direction/read/receiptField/counterforce/flags/owningVolume/owningWave/intendedDesk); `sovereigntyBundle.js` + `tests/domain/sovereigntyBundleWr10.test.js`; tree-wide greps empty | VERIFIED |

⚠ ADDRESS-ROT NOTE (POP-F round): twelve `file:line` addresses in this
section rotted between the survey and the POP-F stamp (R-1..R-8,
R-13..R-15 in the round's absorption table carry each corrected
address). NAVIGATE BY SYMBOL, never by the drafted line numbers; the
annex + the POP-F round outrank every address in this file. CROSS-
REFERENCES POP now serves (appended per C-POPF-4): §46c (the LG
reception contract — C-POPF-2 is the charter), [CORRECTED 2026-10-16 (coherence fold) — C-POPF-2's text is not in this file; see the bracket at §6] LG §C (member minting is
POP's alone; the class-intake door is C-POPF-2 item 5), [RULED 2026-10-16 (coherence fold §3.1.7) — amended: POP owns the CIVILIAN column classes, WC the MILITARY classes, ONE union, one `columnOf` whitelist; see the bracket at §6 Q1] LG §D and Q3
(the population-shape law — the canonical `settlement.population` is
THE PLAIN NUMBER; C-POPF-3).

Two OPEN-DEFECT statuses re-measured (the volume's check-first orders, discharged
here): **R-28 is STILL OPEN** — `demographicsHerald.js:257` reads
`` headline: `${quantityWords(departures || unplaced)} left ${origin}` `` and the
departures=0 arm still says "left" (POP-6(g) is live work, not a no-op). [CORRECTED 2026-10-16 (coherence fold) — still open at 00b648c9d, now demographicsHerald.js:420; plus a second R-28-class verb at :403 ("were turned back toward" for people who never left) — see DESIGN_FP_POPULATIONS.md §2's R-28 entry.] **The
stale P4 decline promise is STILL OPEN** — `populationDynamics.js:~370-385`: "P4
reconciles the decline term with the demographic death term; until then a
pressured settlement is answered by both." POP-4's substrate gate remains binding. [CORRECTED 2026-10-16 (coherence fold) — DISCHARGED: ODQ §219.3 → `0f59d0ead0` (2026-08-17; populationDynamics.js:407-450); see POP-4 below.]

### 1b REFUTED / SUPERSEDED (4 — the premises an implementer must NOT build on)

**RF-1 — "column records EXTEND IN PLACE; verify only that in-flight columns
serialize" (volume §4) is FALSE AS STATED. The column normalizer is a WHITELIST
that strips every unknown field on every ledger rebuild.** `columnOf`
(`spatial/migration.js:505-522`) rebuilds each record as exactly
`{originId, destId, arrivals, departTick, arrivalTick, ...(travelClass? )}` — and
it runs at THREE sites: `enqueueColumns` (which rebuilds the WHOLE ledger on every
M4 dispatch tick), `releaseArrivals`, and the demographic stage-0 read
(`readMigrationColumn`, `demographicsMigration.js:447`). POP-1's frozen
departure-belief field and POP-5a's `events[]` array would survive serialization
fine and then be silently deleted by the first same-tick M4 dispatch. The
travelClass field's own comment records this exact class ("the M4 enqueue pass
would silently strip P2's ownership mark off a column"). CONSEQUENCE: POP-1 and
POP-5a each amend `columnOf` with a CONDITIONAL carry-through of their field
(the travelClass idiom: present-and-valid ⇒ spread in, else no key), byte-identical
for every record that lacks the field, pinned by a round-trip-through-enqueue test
— not merely a save/load test. The volume's serialization VERIFY-AT-BUILD is
answered: columns persist (spatialLedgers rides worldState serialization), and
that was never the hazard.

**RF-2 — the return column's travelClass is unstated and the default is WRONG.**
`isDemographicColumn` fails closed toward M4; a column minted with any class
outside `['refugee','voluntary']` is landed by M4's `releaseArrivals`, which
credits it with M4's own story ("Refugee column arrives from a shed settlement",
`migrationKernel.js:~352-360`) and never routes it through THE ARRIVAL CLEARING —
conservation attribution breaks and the homecoming is narrated as a flight.
CONSEQUENCE: POP-1 must rule the class (chair question Q1 below; my
recommendation: extend the closed set with `'returning'`). [RULED 2026-10-16 (coherence fold §3.1.7) — `column_return`, not `returning`; see the bracket at Q1.]

**RF-3 — the volume's L2/§3 flag-manifest mechanics are SUPERSEDED by CR-WR10-C
(2026-08-04, post-dates the volume).** `ENGINE_GATED_VIRTUAL_RULE_KEYS`
(`simulationRules.js` — ⚠ RE-DERIVE-AT-COMPILE: TWENTY members at `a6fd6395`, moving; never the five this section was drafted against) is now proven by a TWO-WAY
engine-source census walker (`tests/lint/engineGatedRuleKeys.walker.test.js`):
every manifest member must really be gated in src/, and every strict-gate read
(`.<key> === true`, JSDoc-cast spelling tolerated) must be declared, manifested,
EXEMPT, or in the shrink-only measured BACKLOG (≤17; `commonsVoiceEnabled` sits
there TODAY at :111 with no certification row). A manifest member OWES its
AUTHORED certification row — ⛔ the "declared-pending entry" and
"backlog" doors are STRUCK (C-POPF-1): both pending surfaces are
frozen-and-pinned EMPTY at two homes (walker `:234`/`:836`;
`subsystemRowsVirtual.js:595`/test `:403`) and the backlog is capped
17/17 shrink-only — lighting a POP flag means authoring the real row. [CORRECTED 2026-10-16 (coherence fold) — at 00b648c9d `ENGINE_GATED_VIRTUAL_RULE_KEYS` holds 43 keys (simulationRules.js:230-668, counted) and the BACKLOG 16 entries (walker :193-210), `commonsVoiceEnabled` still among them (:195) with no row; coherence fold §3.2.14 confirms the declared-pending door STRUCK (`VIRTUAL_PENDING_RULE_KEYS = []`, shrink-only) — every flag lands its AUTHORED row in the same commit as its first gate read.]
CONSEQUENCE for every POP wave: the flag
joins the MANIFEST + its AUTHORED certification row in the SAME
commit as the first strict gate read — three artifacts, one commit, exactly as
`sovereigntyTradeEnabled` did on 2026-08-04 (the precedent is quoted in the
manifest's own comment).

**RF-4 — "capacityModel/stressorGates read stressors nothing writes" is
OVERBROAD.** `mass_migration` is a first-class mintable stressor type
(`stressorPicker.js:50`; `stressorDynamics.js:321-331` with causal sources
housing_pressure/labor_capacity/admin/social_trust). What is absent is the
ARRIVAL→stressor coupling specifically: no landing or dispersal path raises it.
The reads (`capacityModel.js:633` regex `/refugee|migrant|influx/i` demand +12;
`stressorGates.js:476` mass_migration contagion ×1.4) are orphans of the arrival
lanes, not of the taxonomy. CONSEQUENCE: POP-3/POP-1 must NOT assume the reads are
dead vocabulary they can repurpose — a DM- or pressure-born mass_migration
stressor already flows through both. Whether arrivals should FEED it is chair
question Q4.

---

## §2 THE FLAG FAMILY (six flags; law-2 shape; CR-WR10-C manifest mechanics)

All six are VIRTUAL: absent from DEFAULT_SIMULATION_RULES and every preset spread,
read ONLY through the strict idiom `rules.<key> === true` (the JSDoc-cast spelling
is walker-visible — RF-3), dark-never-permissive. Confirmed unminted at HEAD
(zero hits tree-wide), so every name below is claimable.

| Flag | Gates | Wave | Lit-preconditions (walker-enforced orderings) |
|---|---|---|---|
| `believedMigrationEnabled` | the belief arm at the pull seam; arrival disappointment; letters home; THE ARRIVAL CLEARING + return column | POP-1 | `demographicsEnabled` lit · SP-2 believed-conditions subject family LANDED (SATISFIED — SP-B landed `believedConditionsEnabled` 2026-08-05; the `beliefSubjectsGrewSincePop1()` tripwire baselines against a NON-EMPTY family measured at compile) · `migrationRumorsEnabled` lit (the carrier half of the correction loop) · [CORRECTED 2026-10-16 (coherence fold) — AND the route-network mount (nothing writes the network at 00b648c9d: `ensureGenesisRouteNetwork`/`accrueRouteFlows` uncalled — the menu is empty in every shipped world) with its no-flow-yet artery arm: RULED BY DELEGATION 2026-10-16, OD-FC-18; see DESIGN_FP_POPULATIONS.md §3] |
| `commonsArcEnabled` | the REFUSAL rung; plan/levy/emigration refusal pricing; THE MISRULE ANSWER; answered-petition receipts | POP-2 | `commonsVoiceEnabled` lit (extends that kernel's ladder) [RULED BY DELEGATION 2026-10-16 (OD-FC-3 — `commonsVoiceEnabled` is lit in no preset and absent from the manifest today; RULED: lit in every world-alive preset including the default once POP's grievance registry lands, the kernel being aspatial-safe)]; `demographicsEnabled` lit for the plan-refusal arm ONLY (declared arm by arm) |
| `departureMemoryEnabled` | the departureMemory ledger both ends; kin-pull arm; spent-tie write; remembrance crossings | POP-3 | `demographicsEnabled` lit |
| `calamityArcEnabled` | arc staging; cause-attributed burial lines; aftermath/recovery voice [RULED 2026-10-16 (coherence fold §3.1.9) — the arc staging FOLDS INTO PG; POP keeps the bells line and the disaster cause] | POP-4 | `demographicsEnabled` lit |
| `roadDramaEnabled` | column en-route events; road-death narration; lost-column inference; road-reputation belief write | POP-5a | `demographicsEnabled` lit · spatial column lane live (`spatialCanonVersion` — VERIFY-AT-BUILD the exact predicate `migrationActive` uses) · `migrationRumorsEnabled` lit |
| `moverPermitsEnabled` | the four dark permit consumers + J-POP-11 gate reconciliation + treaty-input reads | POP-5b | `demographicsEnabled` lit · (treaty inputs additionally degrade — §5 seam contract, never a hard block) |

**Manifest timing (RF-3, binding on every wave):** first strict gate read +
`ENGINE_GATED_VIRTUAL_RULE_KEYS` membership + the AUTHORED certification
row land in ONE commit (the pending-entry door is STRUCK — C-POPF-1).
Never the backlog. The walker asserts the exact one-key census delta,
re-measured against the landed manifest count at each wave's own base
(TWENTY at `a6fd6395`), never against the volume's five.

**Four-fence dormancy set per flag (L2), each with the lit-mutant control proving
the fences see:** (1) own-footprint dormancy golden at the flag's write surface;
(2) absent-vs-false differential; (3) call-path spy on the gate function; (4)
gate-polarity census (source scan for the strict idiom). Plus the
conjunction-gate-hole guard: every flag lands at least one BY-NAME read (no flag
read exclusively through a frozen-list `.every()`).

**Name-collision fences (the warDispositionEnabled lesson):** `commonsArcEnabled`
is one word from the live `commonsVoiceEnabled`; `believedMigrationEnabled` is one
word from the live `migrationRumorsEnabled`. Each wave's walker commit includes a
grep-proof that the OLD name still resolves to its own gates only (the
concurrent-lane rename hazard).

**JUDGMENT (vetoable):** `commonsArcEnabled`'s petition-side independence from
`demographicsEnabled` is kept exactly as the volume splits it — the grievance read
(legitimacy/corruption/unrest) has no demographic input at HEAD (S18), so the
walker reds only the plan-refusal arm's ordering, not the whole flag's.

---

## §3 CANONICAL MODEL (zero new top-level worldState keys; two new spatialLedgers
## keys; three conditional-field families)

`getSpatialLedger`/`setSpatialLedger` are generic (`distanceRead.js:166`) — no key
registry exists to edit; the v5 stateKeys census sees new ledger keys automatically
(S32). Everything below is drop-when-empty at every level, absent ⇒ byte-identical,
exactly ONE writer module each.

```
worldState.spatialLedgers.departureMemory     — POP-3; writer departureMemory.js (NEW leaf)
  { "<originId>><destId>": { kinBand, causeClass, lastFlowTick, sinceTick, rememberedAs } }
  // closed sets per the volume §4 (kinBand none|thin|present|strong|binding;
  // causeClass flight|opportunity|expulsion|dispersal; rememberedAs
  // mourned|sent_forth|cast_out|scattered). Banded memory, never accounting.

worldState.spatialLedgers.calamityArcs        — POP-4; writer calamityArc.js (NEW leaf) [RULED 2026-10-16 (coherence fold §3.1.9) — NOT MINTED; POP-4 folds into PG]
  [ { id, settlementId, cause:'sickness', openedTick, crestTick|null, closedTick|null,
      peakBand } ]
  // pruned after close + aftermath window (the volume's ruled retention);
  // the chronicle carries the durable verdict.

migration column records (EXISTING spatialLedgers.migration) — EXTENDED IN PLACE
  + travelClass: 'returning'                  — POP-1 (RF-2; pending Q1) [RULED 2026-10-16 (coherence fold §3.1.7) — `column_return`]
  + believedBand: { axis→band }               — POP-1 (frozen departure belief; K.2 idiom)
  + events: [ { tick, kind, band, receipt } ] — POP-5a (closed kind set)
  // RF-1 GOVERNS: each new field is added to columnOf's conditional carry-through
  // IN THE SAME COMMIT as its writer, with a round-trip-THROUGH-ENQUEUE pin
  // (enqueueColumns rebuild + releaseArrivals rebuild + stage-0 read), not merely
  // a save/load pin. columnOf IS the load-time normalizer for this family — shape
  // discipline pins live AT it (L4's records-with-no-normalizer clause is
  // satisfied by the normalizer that exists).

commons ledger rows (EXISTING spatialLedgers.commonsVoice) — POP-2 EXTENDS IN PLACE
  + refusal-rung fields: { targetKind, targetRef } on the existing row shape
  // one writer (commonsVoiceKernel.js) — THE VOICE SEAM stands.

believed destination conditions               — NOT this program's state (SP-2 family)
plan abandonment word `refused_by_the_commons` — joins the CLOSED vocabulary
  (RESPONSE_REFUSALS' sibling surface), registered, not a key.
landing-refusal word `refused_at_the_wall`    — accounting word, not a key.
```

**Lifecycle-paths clause (L4, per family — lands BEFORE each writer builds):**

- **departureMemory** — CREATE: fed at the P2 landing stage, M4 arrivals, orbit
  dispersal, (dark until WR-8 lights) the razing escape share — all through the ONE
  writer. READ: kin-pull arm (destination-side), remembrance crossings, dossier
  panel, grievance-at-a-distance coupling. PERSIST: rides spatialLedgers
  serialization; JSON-round-trip pinned; import validates all three closed sets.
  REGENERATE (THE PROMISE): a same-seed replay re-derives identical bands
  (determinism pin); zero PRNG (decay and refresh are pure functions of ticks and
  flows). UNDO: pulse undo ring restores wholesale. MIGRATE: none (new key,
  drop-when-empty — an old save simply lacks it). Terminal death FREEZES the
  pairs; resettlement re-opens the destination end only. VEIL: dossier panel rides
  the governed projector; the plant-provenance arm is includeCovert-gated.
- **calamityArcs** — CREATE: opens on existing outbreak/pestilence evidence
  through calamityArc.js only. READ: burial attribution, aftermath voice, dossier
  health line, POP-7 census. PERSIST/round-trip/import: stamp monotonicity
  openedTick ≤ crestTick ≤ closedTick validated (stages are DERIVED, per the
  volume's corrected line). REGENERATE: re-derived from replayed evidence
  identically. UNDO: ring. MIGRATE: none. Mid-arc settlement death closes the arc
  `terminal` via the lifecycle's own path. Prune: closed + aftermath-window-passed
  rows drop; drop-when-empty extends to the whole key. VEIL: banded stage words
  only.
- **column extensions** — CREATE: `believedBand` frozen at dispatch by the P2
  dispatch stage; `events` appended by the POP-5a event pass; `'returning'`
  columns minted ONLY by THE ARRIVAL CLEARING. [RULED 2026-10-16 (coherence fold §3.1.7) — the class is `column_return`.] READ: disappointment gap at
  landing; the herald lines; the rumor carrier (class-agnostic — S29). PERSIST:
  through columnOf's amended carry-through (RF-1). REGENERATE: a regen that
  rebuilds columns re-freezes belief from the live beliefMap. UNDO: ring.
  MIGRATE: none — absent fields on old columns stay absent (the conditional
  spread mints no key). VEIL: `believedBand` never reaches a public payload
  (belief provenance is dm-side; the herald prints bands, not the raw map).

**What is deliberately NOT modeled** — unchanged from the volume §4 (no pyramids,
no epidemiology, no households, no wage market, no crowd NPC, no new mortality
sinks, no remittance economy).

---

## §4 THE WAVES (dependency order; 8 build units; each: one commit, DARK per §2,
## focused gates per slice, full gate at wave end, CW-0 rows in the same commit,
## mutationCoverageManifest entry per executed mutant, byte-scan on every authored
## file, spine reqs 13/14 discharged per wave)

Size reality (measured 2026-08-04; domain-layer ceiling is 800 EFFECTIVE lines,
comment-stripped, eslint-mirrored; `scripts/.size-baseline.json` holds NO entry for
any POP-touched file, so none is over-ceiling today; raw wc-l follows —
⚠ RE-DERIVE-AT-COMPILE: two figures below are EFFECTIVE units presented
as raw (R-17/18/19); measure with the enforcer Linter at the publishing
commit, state the unit, never inherit):
`demographicsMigration.js` 658 · `demographicsPlans.js` 658 · `demographicsPushPull.js`
643 · `spatial/migration.js` 616 · `demographicsRates.js` 592 · `populationDynamics.js`
556 · `migrationKernel.js` 517 · `demographicsResponses.js` 470 · `assizeKernel.js` 459 ·
`npcReplacement.js` 434 · `demographicsKernel.js` 410 · `traditions/relations.js` 398 ·
`pressureModel.js` 366 · `commonsVoiceKernel.js` 340 · `demographicsWar.js` 334 ·
`pestilenceKernel.js` 305 · `demographicsHerald.js` 266 · `demographicsRisk.js` 244 ·
`demographicsLadder.js` 241 · `settlementLifecycleKernel.js` 1194 (hot — receives
ZERO POP edits; the kernel mount at :83 already exists) · `pulseKernel.js` (BANKED
1580) and `applyWorldPulse.js` (941) receive ZERO edits ever [CORRECTED 2026-10-16 (coherence fold §3.3.8) — cite `scripts/.size-baseline.json` and eslint's EFFECTIVE count, never a raw `wc`: at 00b648c9d pulseKernel 1581 (frozen), applyWorldPulse 907; commonsVoiceKernel.js is 365 raw (was 340). The ZERO-edits rule stands.] — every POP mount is
the lifecycle host, an existing seam, or a new lazy leaf.

### POP-1 — THE BELIEVED ROAD (`believedMigrationEnabled`)
[ADDED 2026-10-16 (coherence fold, req 16/17) — FIRST-VISIBLE: the rush line ("They say in Emberhold …") within weeks of a planted or drifted belief band — inside a one-month advance; the bust line at letter travel (weeks); the burned generation's forgetting is the yearly+ slow verdict. TODAY: none in any shipped world (the migration menu is empty — nothing writes the route network; OD-FC-18) · TIER: spatial canon + belief infoMode (SP-B's `believedConditionsEnabled` lit via FP_LIT_BELIEF in three presets) · host flags: `demographicsEnabled` (lit in no preset — OD-FC-18), `migrationRumorsEnabled` (lit in no preset), the route-network mount (OD-FC-18) · DEGRADED ARM: omniscient infoMode ⇒ belief resolves to truth ⇒ lit byte-identical to dark (THE OMNISCIENCE COLLAPSE); aspatial ⇒ dark]
- **Files touched:** `demographicsMigration.js` (the seam + clearing; raw 658 —
  headroom exists but the arm bodies go OUT: budget ≤ +40 raw here, seam calls
  only) · `spatial/migration.js` (columnOf carry-through for `believedBand` +
  `'returning'`; ≤ +25) · `simulationRules.js` (manifest row) ·
  `subsystemRowsVirtual.js` (cert row — ⛔ CORRECTED, C-POPF-1: all six
  POP flags are VIRTUAL keys; each row lands in the VIRTUAL lane with
  its `VIRTUAL_RULES` twin, NEVER `subsystemRowsGrowth.js` — a POP key
  with its row in the growth lane has no twin and reds the 20↔20
  bijection at `subsystemRowsVirtual.test.js:407` in the wave's own
  commit). **New leaves:** `believedMigrationRead.js`
  (the ONE reading resolver: axes from SP-2 belief lit, `demographicReadings`
  dark; ≤ 250) · `arrivalClearing.js` (the clearing + return-column mint +
  letters-home evidence; ≤ 300).
- **Mechanics (per the re-ruled seam):** (a) ONLY the attraction axes resolve
  belief-side lit; admission/spare/capacity/viability stay truth BOTH lit and dark
  (S5's over-send guard untouched); (b) the clearing lands where stage 1 today
  lands unconditionally (S7): capacity re-read at the wall, refusal word
  `refused_at_the_wall`, return column minted class `'returning'` (Q1), [RULED 2026-10-16 (coherence fold §3.1.7) — class `column_return`]
  conserved inTransit homeward, `returned` stamped at the home landing through the
  SAME clearing; (c) disappointment = frozen `believedBand` vs lived reading at
  landing, gap ≥ band ⇒ the letter (news-speed correction addressed to the
  origin).
- **Pins:** dormancy golden at the pull seam · four-fence set + lit-mutant ·
  THE OMNISCIENCE COLLAPSE (infoMode omniscient ⇒ lit byte-identical to dark) ·
  THE GOLD RUSH PIN (plant → column → wall → letter → flow stops, no clamp) ·
  conservation RE-DERIVED + re-executed at 300 ticks over both new arms with a
  rush-bust fixture · no-belief-no-change negative · never-outruns-the-road
  negative (J-P3) · RF-1's round-trip-through-enqueue pin for BOTH new fields ·
  RF-2's wrong-lane negative (a `'returning'` column is NEVER landed by
  `releaseArrivals` — executed mutant: revert the class-set extension, watch M4
  steal the column, restore by cmp).
- **Mutants (manifest-entered):** break the clearing's capacity re-read (bust
  impossible → rush pin reds); strip the columnOf carry-through (belief field
  ghosts → disappointment pin reds); leak one returned traveller (conservation
  reds — the existing :234 control extended).
- **Dormancy proof:** flag absent ⇒ resolver returns `demographicReadings`
  verbatim + clearing branch unreachable ⇒ stage-1 bytes identical (golden).
- **Req 13 (alignment):** engagement — belief-chasing colored by `riskToleranceOf`
  (SP-4) on the voluntary margin, receipted. **Req 14 (edit verbs):** the seam
  swap, the clearing insertion, the two columnOf spreads — enumerated in the
  commit story. [CORRECTED 2026-10-16 (coherence fold) — spine req 14 is the DM's EDIT VERB (the DM's pen and the clerk's proposal), not the code-edit list. Each wave names its DM verb through the store-action lane OR records "engine-only, because X" for its new DM-visible state (the believed band and the return column here; departureMemory, the refusal rung, column events in the waves below). The Req 13 clause's `riskToleranceOf` reads `courtRiskAppetiteOf` (coherence fold §3.3.3).]
- **Collisions:** none with the war family (no shared file); with FP-INFO — the
  planted-wealth lure feeds this arm (CPL row lands here); with the live
  validation-queue decline lane — none (no decline-term file touched).
- **CW-0 rows:** INFO→POP lure; TRADE↔POP sibling-family declaration; GRAMMAR→POP
  labor_compact lift (reachability-pinned on a signed-compact corpus, or declared
  degraded while GR-3 is unbuilt — §5). [CORRECTED 2026-10-16 (coherence fold) — GR-3 is LANDED; the degraded arm is history (C-5/C-6). And the labor_compact lift has no target: no wages axis exists and GR colours production (see DESIGN_FP_POPULATIONS.md POP-1 Couplings).]

### POP-2 — THE COMMONS ARC (`commonsArcEnabled`)
[ADDED 2026-10-16 (coherence fold, req 16/17) — FIRST-VISIBLE: the refusal beat and the answered-petition beat ("the seat heard them, and the square emptied") at the built 3-tick dwell — weekly, the family's most felt clock, inside a one-month advance · TIER: aspatial-safe · host flags: `commonsVoiceEnabled` (in no preset, not in the manifest — OD-FC-3); `demographicsEnabled` for the plan-refusal arm only; a lit war lane for the levy arm · DEGRADED ARM: `commonsArcEnabled` dark ⇒ the built three-rung ladder (petition → gathering → riot), itself dark until OD-FC-3]
- **Files touched:** `commonsVoiceKernel.js` (raw 340 — the rung, the jump rule,
  LEGIT_DIP to five slots, the refusal fields; ≤ +120 raw keeps it far under
  ceiling) · `demographicsPlans.js`/`demographicsResponses.js` (the read of the
  live rung + `refused_by_the_commons`; ≤ +30 combined) · manifest + cert row
  files. **New leaf:** `commonsAnswer.js` (THE MISRULE ANSWER — the receipted seat
  verb + legitimacy repair + stressor stand-down; ≤ 200).
- **Pins:** dormancy INCLUDING skip-path shape · THE JUMP-RULE PIN (lit-no-target
  time-to-riot equals dark tick-for-tick; S19's one-rung premise is the baseline)
  · legitimacy-gate negative · priced-not-forbidden (pressed plan completes AND
  pays, one fixture) · REFUSED-LEVY end-to-end (smaller real muster, reason named)
  · reversal on BOTH answering arms (corruption fixture + misrule fixture — the
  corruption-only version is vacuous by construction, S22) · no-target negative ·
  revealed-only pin (S23 — covert corruption moves nothing until exposed) · every
  pin seeds live grievance state first.
- **Herald:** kinds `commons_refusal` + `commons_answered`, all three walkers same
  commit (S24 is the copied shape); the wizard-news skew prohibition restated at
  the mint (S20).
- **Mutants:** disable the misrule verb (reversal-misrule pin reds); widen the
  assize coupling to unexposed corruption (revealed-only pin reds).
- **Reqs 13/14:** seat answer posture-colored (SP-4), crowd has none (Law One);
  verbs: rung insertion, dip re-author, three read-sites. [CORRECTED 2026-10-16 (coherence fold) — see the bracket at POP-1's Req 14: spine req 14 is the DM's edit verb.]
- **Collisions:** WAR — the levy shortfall consumer (⚠ the muster MOVED:
  `warHomeCosts.js:443-450` at the POP-F round — the old
  `warDeployment.js:1259` cite is dead; the seam is READ, not edited;
  the shortfall lands as a smaller real number at the muster site —
  VERIFY-AT-BUILD the exact site); [CORRECTED 2026-10-16 (coherence fold) — there is no discrete levy call: conscription is a continuous per-deployed-tick rate (warHomeCosts.js:281; vassal levy :82); see DESIGN_FP_POPULATIONS.md POP-2's levy bracket.] INTERIOR —
  declared-distinct coup lane (kernel header stands).

### POP-3 — DEPARTURE MEMORY (`departureMemoryEnabled`)
[ADDED 2026-10-16 (coherence fold, req 16/17) — FIRST-VISIBLE: the PLANTING LINE (coherence fold §4): at the flow that writes the pair, one dossier/Herald sentence naming the cause in the record's voice (who left, from where, to where, after what — nothing about the future); the remembrance line is the decade-crossing slow verdict (epoch clock, `a_generation` 1040 weeks) · TIER: spatial canon + the route-network mount for the flows (OD-FC-18) · host flags: `demographicsEnabled` · DEGRADED ARM: dark]
- **Files touched:** feeding call sites in `demographicsMigration.js` (landing) and
  `migrationKernel.js` (M4 arrivals — READ-side receipts only; the writer is
  called, never inlined; ≤ +15 each) · manifest + cert row. **New leaf:**
  `departureMemory.js` (the ONE writer + decay + spent-tie; ≤ 300).
- **Pins:** dormancy + BYTE-ABSENT drop-when-empty (no migration ⇒ no key) · THE
  GENERATION-THAT-LEFT PIN (one fixture, both ends) · decay-to-none-stays-none ·
  kin-cap negative (never unreachable, never outweighs crisis push — J-P3/J-POP-7)
  · THE SPENT-TIE PIN (loop converges through the counterforce, cap untouched) ·
  adoption double-count negative (S25's checkpoints identical lit vs dark) ·
  writer/reader spelling pin booting the REAL writer · freeze-at-death +
  reopen-at-resettlement (S27's lifecycle laws extended).
- **Mutants:** sever the spent-tie write (stationarity envelope reds at POP-7);
  resurrect a decayed pair without flow (decay negative reds).
- **RF-4 note:** the ledger does NOT write mass_migration stressors — the reads at
  capacityModel:633/stressorGates:476 keep their existing (non-arrival) writers;
  Q4 owns the coupling question.
- **Reqs 13/14:** declared-empty posture (memory is not a decision surface;
  consumers inherit) with reason; verbs: two feed-site calls, one new leaf. [CORRECTED 2026-10-16 (coherence fold) — see the bracket at POP-1's Req 14: spine req 14 is the DM's edit verb.]

### POP-4 — THE PLAGUE ARC (`calamityArcEnabled`)
[ADDED 2026-10-16 (coherence fold, req 16/17) — FIRST-VISIBLE: THE BELLS LINE within weeks of an outbreak (outbreak/crest in weeks) — but `disease_pressure` fired 0 times in 193 soak years, so at default tuning: none (OD-FC-28); the arc staging itself is PG's (coherence fold §3.1.9) · TIER: spatial canon for the pestilence front (diseaseLift01 is aspatial) · host flags: `demographicsEnabled`, and PG's flags for the arc · DEGRADED ARM: the existing deficit-gated hunger burial line only]
[RULED 2026-10-16 (coherence fold §3.1.9) — POP-4 FOLDS INTO PG (`calamityArc.js` and the ledger are not minted); POP keeps the bells line and the disaster cause — see DESIGN_FP_POPULATIONS.md POP-4.]
- **Files touched:** `demographicsHerald.js` (burial-line generalization; raw 266,
  ≤ +60) · manifest + cert row. **New leaf:** `calamityArc.js` (staging + prune +
  attribution reads; ≤ 300).
- **SUBSTRATE GATE (still armed — §1a re-measure):** the decline double-shed is
  OPEN at HEAD (`populationDynamics.js:~376-385`). Attribution covers KERNEL
  deaths only; legacy decline sheds keep the existing departure/decline voice.
  STOP-and-report if the validation-queue ruling has landed by build time and says
  otherwise. [CORRECTED 2026-10-16 (coherence fold) — the ruling LANDED (`0f59d0ead0`, 2026-08-17): this STOP fires; the fallback arm is retired (see DESIGN_FP_POPULATIONS.md POP-4's gate).]
- **Pins:** dormancy · ZERO-NEW-MORTALITY (lit vs dark identical death totals —
  THE defining pin) · THE BELLS PIN (plague year sans famine ⇒ sickness line, not
  hunger line; the food gate at herald :175 preserved for hunger) · attribution
  negatives incl. the mixed case says mixed (J-POP-9) · FIRST-MARKET-DAY
  walk-backward fixture · stage monotonicity + no zombie arcs · stamp-ordering
  import validation · named-cast pin under arc conditions (S1 machinery) ·
  the 193-year zero-fire counterforce fact carried to the owner's tuning table
  UN-retuned. [RULED BY DELEGATION 2026-10-16 (OD-FC-28 — the `disease_pressure` 0.5 floor joins the end tuning review's roster.]
- **Mutants:** open an arc without evidence (arc-open negative reds); attribute a
  deficit-bound death to sickness (attribution negative reds).
- **Reqs 13/14:** seat's answer posture-colored via existing surfaces; verbs:
  staging leaf, burial-line generalization, chronicle write at close. [CORRECTED 2026-10-16 (coherence fold) — see the bracket at POP-1's Req 14: spine req 14 is the DM's edit verb.]
- **Collision:** FAITH's omen read is THEIR write (coupling row only).

### POP-5a — ROAD DRAMA (`roadDramaEnabled`)
[ADDED 2026-10-16 (coherence fold, req 16/17) — FIRST-VISIBLE: the graves line on M4 road deaths and P2 column events per leg per tick (weeks) — inside a one-month advance wherever a column walks; the lost-column inference at arrival window + slack (weeks–season) · TIER: spatial canon · host flags: `demographicsEnabled`, `migrationRumorsEnabled`; the P2 arm also needs the route-network mount (OD-FC-18) · DEGRADED ARM: spatial without the route network ⇒ the M4 graves line only; aspatial ⇒ dark (the aspatial 55% lane is not narrated, §2)]
- **Files touched:** `spatial/migration.js` (columnOf `events` carry-through —
  RF-1; ≤ +15) · manifest + cert row. **New leaf:** `columnEvents.js` (typed
  banded events on per-column keyed forks `column:<id>` — the ONE new rng surface,
  draw-accounted; the lost-column inference; the road-reputation belief write;
  ≤ 350).
- **Pins:** dormancy · conservation EXTENDED-UNWEAKENED (every kind closes into
  the identity; split sums exact; the 300-tick pin gains event fixtures) · THE
  LOST COLUMN PIN both arms (M4 graves line; P2 inference then honest resolution)
  · no-new-mortality negative on P2 (J-POP-10) · THE RE-ROUTE PIN as a
  ROUTE-CHOICE assertion with `populationLegCost` output byte-identical (the leg
  cost is grade+season only at `demographicsMigration.js:142-147` — S-verified;
  belief re-ranks, physics does not) · draw accounting green · split
  double-count negative at the menu's spare read · RF-1 round-trip-through-enqueue
  for `events`.
- **Mutants:** leak a split column's second half (conservation reds); price danger
  into legCost (re-route pin's byte-identity arm reds).
- **Reqs 13/14:** departure timing colored by origin posture at existing
  machinery; verbs: event pass, carry-through spread, inference read. [CORRECTED 2026-10-16 (coherence fold) — see the bracket at POP-1's Req 14: spine req 14 is the DM's edit verb.]
- **Collisions:** TRADE — `tolled` ships dormant behind the trade program's toll
  read unless J4 charters expose one (VERIFY-AT-BUILD; declared, not faked);
  WAR — interdiction is the couplings volume's row.

### POP-5b — THE PERMIT TABLE GOES LIVE (`moverPermitsEnabled`)
[ADDED 2026-10-16 (coherence fold, req 16/17) — FIRST-VISIBLE: the permit-refusal receipt the tick a caller asks (weekly) — but it bites only at the evacuating/remnant grades (findings POP C-1); the felt arm is the treaty inputs (`migration_right` / `settlement_provision` pacts are signable TODAY in lit presets with no consumer) · TIER: aspatial-safe (levy/institution/trade/promotion columns) · host flags: `demographicsEnabled`; the destination arm needs the route-network mount (OD-FC-18) · DEGRADED ARM: aspatial or unrouted ⇒ every column except destination]
- **Files touched:** the four calling surfaces gain `moverPermitted` reads —
  levy (muster site, VERIFY-AT-BUILD near `warDeployment.js:1259`'s conscription
  block) [CORRECTED 2026-10-16 (coherence fold) — the muster moved to warHomeCosts.js, and it is a continuous per-tick rate (:281), not a call], institution seeding, trade/caravan assignment (or declared into
  FP-TRADE's seam if that program rebuilds it — report, don't duplicate),
  promotion (`demographicsResponses.js:296-297` gains the grade read beside
  no_next_tier/no_headroom — J-POP-17) · the J-POP-11 reconciliation at
  `destinationMenuFor`'s viable read (:293/:311 — the wired nonviable refusal
  narrows to the grades the TABLE refuses; failing may receive) · the treaty-input
  reads at the founding mint (`demographicsResponses.js:244` gains the
  settlement_provision read) and the destination lane (migration_right depth
  step) · manifest + cert row. **No new leaf needed** (reads compose existing
  pure functions); budget ≤ +30 per touched file.
- **Pins:** BOTH arms per consumed column on real corpora (permitted fires,
  refused fires — seeded failing-town fixture) · recovery in-migration pin
  (J-POP-11's proof) · levy/consent double-bind fixture (grade-refused AND
  commons-refused, one muster receipt, two named reasons) · treaty-input
  reachability pins with unsigned-pair negatives (DEGRADED while GR-3/TR-5
  unbuilt — §5's tripwire owns the widening) [CORRECTED 2026-10-16 (coherence fold) — GR-3 is LANDED (§5 contract 2 says so); and pacts carrying these terms are signed TODAY in lit presets with no consumer (DESIGN_FP_POPULATIONS.md POP-5b treaty-inputs bracket)] · dormancy.
- **Mutants:** collapse the two levy evidences into one (double-bind fixture
  reds); read the permit table for admission where the treaty licenses deeper
  (depth-step pin reds).
- **Reqs 13/14:** permit consumes no posture (declared empty, table lookup);
  caller posture at calling surfaces (INT-1 coupling declared dark). Verbs: four
  read insertions + one gate narrowing + two treaty reads. [CORRECTED 2026-10-16 (coherence fold) — see the bracket at POP-1's Req 14: spine req 14 is the DM's edit verb.]
- **Collisions:** WAR (levy read beside the untouched capability damper — two
  evidences declared); the CW-0 rows CPL-3/CPL-8/CPL-17/CPL-18 land this commit.

### POP-6 — THE HOPEFUL HALF (rides its machinery's flags + the J-POP-12
### disclosed-shift lane)
[ADDED 2026-10-16 (coherence fold, req 16/17) — FIRST-VISIBLE: per voiced line: the R-28/:403-repaired departure headline and the arrival line in weeks (the arrival line needs the route network); the dwindling line at the 13-tick season window; plan voice and recovery seasonal–yearly · TIER: rides each voiced mechanism's tier (aspatial-capable for plans and dwindling; spatial canon + route network for arrivals) · DEGRADED ARM: per voiced flag; a dark machine mints no news]
- **Files touched:** `display/settlementRumors.js` (WHAT_PHRASES rows for the
  eleven fallback kinds — S30; authored prose, world-law-bound) ·
  `tests/domain/impactKindWalkers.test.js` + `realm/heraldRouting.js`
  (registrations) · `demographicsHerald.js` (R-28 repair — CONFIRMED still open at
  :257, §1a; the honesty fix is live work) · manifest rows for ridden flags only.
  **New leaf:** `populationEditor.js` (item (h) — the per-tick per-settlement
  significance budget over SP-6 classes applied where `demographicNewsEntries`
  returns; kernel untouched, the budget wraps the RETURN — the kernel's :402 mint
  site keeps its line) · `populationLines.js` (the mint list a-f; ≤ 400). [CORRECTED 2026-10-16 (coherence fold) — three premises moved: NEWSTRAIN (`6c862159ed`) already authored the resettled/terminal-death/steading rows (item f shrinks to three kinds); R-28 is now at demographicsHerald.js:420 with a second verb at :403; and CW-1 landed a feed-side governor, so `populationEditor.js` registers as a CW-1 / feed-composition rule, not a second editor wrapping the kernel return (DESIGN_FP_POPULATIONS.md POP-6 brackets).]
- **J-POP-12 discipline:** prose rows for LIVE kinds (tier_change, steading_*,
  terminal death, resettled) land WR-0c-style — own commit, disclosed same-seed
  prose shift, goldens re-recorded ONLY under a recorded ruling.
- **Pins:** every kind fires + its near-floor silence negative · dwindling-window
  arithmetic exact (13-tick season; VERIFY-AT-BUILD populationHistory's 12 rows vs
  the window — if short, read the receipts stream and REPORT which) · totality
  walkers assert the program's FULL kind roster · THE FLOOD PIN + its
  quiet-world-single-line negative · R-28-class honesty pins on EVERY headline
  verb · dormancy per underlying flag.
- **Mutants:** un-budget the editor (flood pin reds); overlap two season windows
  (double-count negative reds).
- **Reqs 13/14:** req 12's force/counterforce IS this wave; verbs: mint list,
  editor wrap, three-walker registrations, R-28 verb repair. [CORRECTED 2026-10-16 (coherence fold) — see the bracket at POP-1's Req 14: spine req 14 is the DM's edit verb.]
- **Collisions:** THE R-33 register lane (narration honesty pinned here, behavior
  fix belongs there — check the register at build time); the Herald's existing
  ridden kinds (`hungry_gap`/`migration_flight`) keep their gates.

### POP-7 — CONVERGENCE INSTRUMENTATION (no flag)
[ADDED 2026-10-16 (coherence fold, req 16/17) — FIRST-VISIBLE: none — instrumentation · TIER: host flags: every POP flag lit (the soak harness) · DEGRADED ARM: dark]
- Endings mix envelopes over the SEVENTEEN producer-mapped tokens (J-POP-18);
  health metrics (rush:bust band · no-permanent-rush horizon · rung pyramid ·
  THE PARITY METRIC · memory-decay stationarity · conservation UNCHANGED with
  every flag lit); certification rows for all six flags with dispositive
  stateKeys channels (`spatialLedgers.departureMemory`, `spatialLedgers.calamityArcs`,
  the commons rung field, column event arrays — the census sees them for free,
  S32); the `commonsArcEnabled` row declares stateKeys channels ONLY (S20's skew);
  v5 rush/commons/arc censuses join `measureRealmDemography` (additive,
  null-on-dark — S33). Every envelope carries a mutant negative control.
- **JUDGMENT (vetoable):** POP-7 also lands the `commonsVoiceEnabled`
  certification row, clearing its BACKLOG entry (RF-3) — the backlog is
  shrink-only and this program is the natural owner of that row's evidence. One
  commit, census shrinks by one. [RULED 2026-10-16 (coherence fold §6 chain 3) — PULLED FORWARD: the `commonsVoiceEnabled` certification row (with its manifest entry), the commons dossier landing (no display consumer exists today) and POP-2's ladder are chain 3's first cars, ahead of POP-7; the row lands before OD-FC-3's lighting.]
- **This wave is the acceptance harness: the program is DONE when the envelopes
  hold on the owner-ordered soak, and not before.**

Internal order: POP-1 → POP-2 → POP-3 → POP-4 → POP-5a → POP-5b → POP-6 → POP-7
(5a/5b may share a wave as two commits). The whole program sits BEHIND the spine's
§5 order (POP is SIXTH) and the sim-proof path; nothing here lights a flag, runs a
soak, or ratifies a band.

---

## §5 SEAM CONTRACTS (the TR-5 pattern: pinned from BOTH sides with a tripwire)

**Contracts this program PRE-PINS toward unbuilt neighbors:**
1. **SP-2 believed-conditions (spine, unbuilt — zero tokens at HEAD, S34):** [CORRECTED 2026-10-16 (coherence fold) — SP-2 (SP-B) is LANDED (S34's own row says so; this contract's 'unbuilt' arm is history). The "closed four" are SP-B's `CONDITIONS_KEYS` {pullBand, routePositionBand, storesBand, tierBand} (beliefAxisSubjects.js:123), not the volume's wages/land/grain/safety; the resolver reads `pullBand` for the attraction term and `storesBand` for grain (DESIGN_FP_POPULATIONS.md POP-1 Force); `beliefSubjectsGrewSincePop1()` baselines against THESE keys, and an axis addition is SP-B's (a ROW under its extension clause, the ES legRefs census amended in the same commit — coherence fold §3.1.21's idiom).]
   `believedMigrationRead.js` derives its axis set from SP-2's subject family AT
   CALL TIME and spells no axis literal beyond the closed four; the dark arm reads
   `demographicReadings` byte-identically. TRIPWIRE `beliefSubjectsGrewSincePop1()`:
   a comment-stripped source scan pins that the resolver names no axis outside the
   closed set, and the pin reds the moment SP-2's family carries an axis POP-1
   cannot resolve — the red is the instruction to widen the resolver and delete
   the row. (The catalogGrewSinceWr10 shape verbatim — S34 proves the idiom live.)
2. **GR-3 term catalog (LANDED 2026-08-06 — contract COLLAPSED to one
   state):** POP-5b's treaty reads resolve
   `migration_right`/`settlement_provision` from TERM_CATALOG at call
   time (`peaceTermsCatalog.js:247-254` live; reader
   `treatyEnforcement.js:301`) and spell no term literal in the gate
   composition; the degraded-pair posture below is HISTORY — the rows
   exist, and POP-5b's compile carries required REACHABILITY pins
   (C-POPF-7) instead of an absence arm (the unsigned-pair
   negative is the SAME pin). TRIPWIRE: the reachability pins flip from
   degraded-declared to required the commit GR-3 lands — the POP-5b commit records
   both states.
3. **FP-TRADE toll physics:** `tolled` ships dormant unless J4 charters expose a
   toll read (VERIFY-AT-BUILD); the dependency is DECLARED in the event-kind
   registry comment, and a source-scan pin asserts POP-5a prices no toll number of
   its own.
4. **INT-1 seatBooks:** the caller-posture coupling [CORRECTED 2026-10-16 (coherence fold) — the books read is `readWarSeatBooks`, opponent-keyed, over four books; see DESIGN_FP_INTERIOR.md §3's SEAM RULING bracket] at the permit surfaces is
   declared dark behind BOTH flags, absent-not-zero, receipt naming seatBooks —
   the CPL-18 row lands with POP-5b and its reachability pin is written
   INTERIOR-side (their volume builds last).
5. **FP-COUPLINGS diaspora-reconquest:** departureMemory is the read that pair
   will name; POP-3 pins the ledger's read API (band words only, no raw ticks
   cross the seam) so the couplings volume consumes a stable surface.

**Already-pinned seams this program must HONOR (tripwires named):**
- **`catalogGrewSinceWr10` (sovereigntyBundle.js + tests/domain/sovereigntyBundleWr10.test.js):**
  ⏱ FIRED AND DISCHARGED (GR-3's landing tripped it as designed;
  asserted in its fired state at `sovereigntyBundle.js:55-62`, pin
  `sovereigntyBundleWr10.test.js:336`). The rule survives on its REAL
  ground (C-POPF-7): POP-5b touches TERM_CATALOG **never** — it only
  READS live treaty terms — so no POP commit widens the catalog or the
  landing record; the "must not be the one that trips it" ceremony is
  unfireable and struck.
- **The WR-4 conscript-share read (`deployedPopulation` −
  `leviedPopulationBySource`):** POP-2's levy shortfall must arrive as a smaller
  REAL muster number UPSTREAM of that read, never a parallel multiplier — the
  double-count fence is the levy/consent fixture.
- **The wave-E draw-accounting instrument:** POP-5a's `column:<id>` forks are the
  program's ONE declared rng surface; every other POP draw is keyed hash01
  (`demographicsPlans.js` already imports the idiom — S34).
- **THE PROMISE / dormancy fences:** every fence golden captured BEFORE wiring;
  a golden that moves is STOP-and-report (war §10 binds).
- **The commonsVoice walkers (EXPECTED_VOICE `null` rows, S24):** POP-2's new
  kinds copy the existing three-kind registration exactly; a kind absent from its
  wave's MINTED/RIDDEN line is a defect (§1c law).

---

## §6 OPEN CHAIR QUESTIONS (max 4, each with the architect's recommendation)
[CORRECTED 2026-10-16 (coherence fold) — C-POPF-2 THE RECEPTION CONTRACT (ODQ §92.1, signed: "POP-1's §6 contract now specifies exactly what §46c's journey fates consume") is NOT in this file — this section holds only four chair questions, and ARCH_PG cites items "C-POPF-2(2)/(4)/(5)" that exist in no POP volume copy. Its text is imported here (or pointed at by path) before pg-3 / LG-9..12 / §46c compile against "C-POPF-2(n)".]

**Q1 — The return column's travelClass (RF-2).** Extend
`DEMOGRAPHIC_COLUMN_CLASSES` with `'returning'`, or reuse `'voluntary'` plus a
conditional `returnOf` marker field? RECOMMENDATION (JUDGMENT, vetoable): extend
the closed set with `'returning'` — the mutex comment says the class IS the
ownership mark; a marker field would put ownership in two places and the
fail-closed hazard would survive for any site that checks only the class.
Dormancy-safe: no existing world holds such a column. Lands in the same commit as
the clearing with the wrong-lane negative executed. [RULED 2026-10-16 (coherence fold §3.1.7) — WC-0B widened the column union (`MILITARY_COLUMN_CLASSES` incl. `veteran_return`, `shed_column`; spatial/migration.js:488-511) without a POP wave, contrary to LG §C; ownership is AMENDED to "POP owns the CIVILIAN classes, WC the MILITARY classes, ONE union, one `columnOf` whitelist". The return class is ruled ONCE across POP/WC/LG/ES as `column_return` — not `returning`, which collides with three existing states (envoyErrand.js:395, roadsKernel.js:521, livedExperienceSources.js:90). The recommendation's shape (extend the closed set, not a marker field) stands.]

**Q2 — The `commonsVoiceEnabled` backlog row (RF-3).** Should POP-7 land the
commonsVoiceEnabled certification row and shrink the walker BACKLOG, or leave it
to the certification register lane? RECOMMENDATION: POP-7 lands it beside the
commonsArcEnabled row — same evidence family, one commit, the backlog is
shrink-only and this program is its natural owner. (If the register lane lands it
first, POP-7's item is a no-op — check-first, the R-28 discipline.) [RULED 2026-10-16 (coherence fold §6 chain 3) — the row is chain 3's first car; see the bracket at POP-7.]

**Q3 — The homeward column's rumor face.** `flightEntryFor` (S29) will mint a
`migration_flight` event for a RETURNING column — the road home narrated with the
flight vocabulary. Accept for v1, or class the event? RECOMMENDATION: accept for
v1 — the event's causeClass band is magnitude-derived, not direction-derived, and
POP-6's honesty pins govern every printed verb; a return-classed rumor kind is a
POP-6 mint-list candidate IF the soak shows the flight framing misleading. Record
the acceptance in POP-1's ledger row so it is a decision, not a drift.

**Q4 — Feeding `mass_migration` (RF-4).** Should heavy arrivals raise the
mass_migration stressor's causal sources, giving capacityModel:633 and
stressorGates:476 their missing arrival-side writer? RECOMMENDATION: NO in this
program — it is a new pressure mechanism wearing staging's clothes (the J-POP-14
shape exactly), its counterforce unpriced, and the NO-NEW-MORTALITY-SINKS law is
one contagion multiplier away from being tested. Record as deliberately deferred
beside J-POP-14 for one owner ruling covering both arrival-side couplings. [CORRECTED 2026-10-16 (coherence fold §3.1.9) — the CONTAGION half is ANSWERED by the owner's §136 directive (2026-08-16) and is PG's (pg-1 contagion-on-arrival). The mass_migration-stressor half stays open and is no longer "deliberately deferred":] [RULED BY DELEGATION 2026-10-16 (OD-FC-40 — the chair SLOTS Q6 / J-POP-14's sibling (arrivals feeding `mass_migration`) as a row of chain 3's clearing (POP-1) under the never-deferred law; confirm or close.]

---

## PROCESS BINDINGS (restated once; the war volume's §10 verbatim otherwise)
Per-wave implementer + adversarial verifier with reject gates (L9); pathspec
commits under the staged-set law; python3 byte-scan on every authored file; new
generation-tree tests use tests/helpers/{anchoredNegatives,seedFailures}.js; every
executed mutant is cp-backed, cmp/md5-restored, NEVER checkout-family, and
manifest-entered; every doc-reading pin asserts exactly-once; gates through
check:tail / gate-tail.sh only; STOP-and-report is a success mode.
