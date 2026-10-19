# L-PL — CURE LOG for `docs/DESIGN_FP_ARCH_PL.md` (lane L-PL, chair a73343ed; seat Opus 5.5; 2026-10-17)

Code of record: the detached master worktree `…/scratchpad/master-81f1cd963` (read-only). Probes: `cure/L-PL-probe/` (`effLines.mjs` = R4's eslint max-lines counter; `effLines.out`, `stageHosts.eff`, `vassalReaders.txt`, `tokens.out`). Nothing written to either tree; no git; no test suite.

## 1. FIRST ACT — the measurements that could refute the brief (all CONFIRMED unless marked)

(a) EFFECTIVE LINES (eslint's own, `effLines.out`): warSeatBooks 492 · settlementStrategy 763 · warCapacityReads 143 · warHomeCosts 324 · relationshipRulesCore 744 · tradeWar 449 · warPeaceDecision 370 · convergence 764 · generosityKernel **800** · peaceTerms **799** · peaceTermsGraph 78 · rulingPowerSeat 295 · relationshipState 360 · relationshipEvolution 438 · relationshipRuleHelpers 486 · hegemony 154 · hegemonyFear 92 · traditionsKernel 493 · traditions/relations 212 · religionLegitimacy 227 · religiousContest 493 · factionCompetition 775 · stressorGates 609 · mediationPressure 154 · pactFormation 565 · warIntent 154 · armyTransitKernel 798 · occupation 738 · treatySuccession 106 · generosityUpdates 90 · realmManifest 474 · entrepots 151 · rulingPower 288 · dispositionChannels 55 · envoyPulse 332 · warReasons 515 · peaceReasons 362 · rumorNetwork 364. Every brief count matches R4's.

(b) `allianceCalls` (relationshipState.js): `RELATIONSHIP_ALLIANCE_CALL_CAP = 24`; `normalizeAllianceCalls` (closed row, dedupe by id, oldest-wins, `.slice(-CAP)`); KEPT by `ensureRelationshipState` (`const allianceCalls = normalizeAllianceCalls(existing.allianceCalls)` → drop-when-empty spread); APPENDED ONLY by the one relationship writer `relationshipEvolution.js :: applyRelationshipPatch` from `outcome.metadata.allianceCall` via `appendRelationshipAllianceCall`. ⇒ REFINES SPL-B5's ruling: the fealtyRecord's row is MINTED by the polity leaf but APPENDED by `applyRelationshipPatch` (`outcome.metadata.fealtyRow`), normalized in `ensureRelationshipState` — never a second writer of relationship state.

(c) `warSeatBooks.js :: foreignBookFor(state, snapshot, actorId)` — three inputs, no opponent; but its only caller `readWarSeatBooks` holds `opponentId` in scope (`const opponent = String(opponentId || '')` before `const foreign = foreignBookFor(state, snapshot, actor)`), so the directional term composes by passing `opponent` into the module-private function (host 492, room). `const keep = 1 - foreignWeight01;` is the single place the ceiling binds. Gate `simulationRules.foreignSeatEnabled !== true → return null` stands (owner-lit).

(d) `canonLabelFor` is an INJECTED resolver `(centerId) => string|null` (`hegemony.js :: hegemonyRead`); no persistence exists anywhere (`RealmDashboard.jsx`: "DM-christened canon label (when the persistence lane lands)"). ⇒ the lane names the home: `spatialLedgers.polityNames` (one DM writer, never the engine).

(e) NO single record carries every seat change. Two grains: RULING-POWER grain — `rulingPower.js :: transferRulingPower` (callers: `applyWorldPulse.js` powerTransfer incl. `cause === 'conquest'`, `applyWorldPulseFactionRoster.js` government_change `appointment`, `mutateWorld.js` DM event `{ cause }` with NO tick) appends `{ label: fromGovernment, cause, tick }` to the persisted `powerStructure.previousGovernments` (cap 6); PERSON grain — `npcLadderKernel.js` `seatTransitions` (coup · challenge · succession · vacancy · government_change). DM KILL/ASSIGN writes neither (`treatySuccession.js` header). ⇒ REFINED (the ruling's "rulingPowerHistory" does not exist): the fealty question reads BOTH tails; KILL/ASSIGN is the OWED producer with a slot.

(f) The `vassal` edge's readers: 52 files in `src/domain`+`src/lib` (`vassalReaders.txt`). The war/peace/hostility readers beyond the ruling's nine: `deploymentReturn.js`, `warCosts.js`, `warAllianceRisk.js`, `mobilizationReactions.js`, `conquestDoctrineStage.js`, `warIntent.js` (HOSTILE_TYPES = `hostile · cold_war · rival`). ⇒ the predicate list grows; a walker pins GUARDED ∪ EXEMPT.

(g) extra: `warPeaceDecision.js :: PEACE_STEP = { hostile:'cold_war', cold_war:'rival', rival:'trade_partner' }` and the peace suit validates `currentTypes` from storage and writes `toType` — THE PEACE ROAD IS A RELABEL (⛔ STOP-1 below). Stage host for the polity leaf: `dispositionChannels.js :: advanceTreatiesWithDisposition` (55 lines; called by the kernel after the treaty advance with snapshot, worldState, graph, tick, now; the kernel reads `.newsEntries`, `.coalitionEvidence`, `.worldState`). Stressor normalize keeps `originContext: stressor.originContext || null` (`stressorsCore.js`); the vassal rule's stressor today has no originContext. Tokens (`tokens.out`): `sound` LANDED (`houseActs.js`: `'overdrawn', 'tight', 'sound', 'flush'`) ⇒ the hold's third word is `staunch` (free 0/0/0); `apex` landed (13 src) ⇒ root class `paramount` (free); `lapsed` · `withheld` · `recognized` · `submit` · `partition` · `renew` landed elsewhere (registered homonyms); every compound minted is FREE.

## 2. ⛔ STOPS
- **STOP-1 · SPL-B4/SX-20 (the ending road).** The ruling "PEACE_STEP's existing rows apply … NOTHING is relabeled" cannot both hold: `PEACE_STEP.rival = 'trade_partner'` and the peace suit writes `toType` after checking the STORED type; a peace on a suspended sworn edge either fails validation (stored `vassal`) or relabels the link to `trade_partner`. The decision-side predicate is CURED; the ending arm is left marked in §5 with two buildable alternatives for the chair: (A) the suit is refused on a suspended edge and member wars end when the verdict lifts the suspension (edges read `vassal` again → no war target; the war record's closure on that read is UNMEASURED); (B) a flagged PEACE_STEP polity arm `rival(suspended) → (stored label)` whose patch is a truce mark in `polityContests` (no label write). Receipt: `warPeaceDecision.js :: PEACE_STEP`, the validation `currentTypes.some((currentType) => currentType !== offeredFromType) || PEACE_STEP[offeredFromType] !== offeredToType`.
- **STOP-2 · SPL-M2 producer (KILL/ASSIGN).** The ruling's "one landed record that carries every seat change" does not exist (measurement e). Built on the two landed tails; DM KILL/ASSIGN opens no question until a producer is chartered (slot: GR's six-site succession record).

## 3. REFINED — see the volume's brackets (each also listed in the structured return)

## 4. OPEN QUESTIONS FOR THE CHAIR
1. STOP-1's choice (A) or (B).
2. The fealty question's DM-seat-change producer (STOP-2): charter the six-site record or accept the gap.

## 5. REFINED (each marked in the volume)
1. fealtyRecord appended by the one relationship writer (`outcome.metadata.fealtyRow`), not a polity-module writer (§4.6).
2. The hold's third word `staunch` (the chair's `sound` is landed in `houseActs.js`) (§2).
3. Root class `paramount` (`apex` landed) (§2).
4. The sphere keyed to the IMMEDIATE liege's own hold over its vassals (§3.1).
5. The polity stage hosted in `dispositionChannels.js :: advanceTreatiesWithDisposition` (PL14, OD-PL-20).
6. Five more guarded war-side readers + the sworn-reader walker (§5.3, OD-PL-21).
7. The fealty question reads `previousGovernments` and `seatTransitions` (no single record exists) (§5.6).
8. `politySuccessionEnabled` freed of `oathHolderEnabled` (§8).
9. Christening home `spatialLedgers.polityNames` (§10).
10. `readWarSeatBooks` default class `peace_abroad` (the frozen callers); army transit `exempt` inline (§3.4).
11. Autonomy charter token `narrowed_sphere` (avoids `ESCALATION_HINT`) (§3).
12. R4-1..R4-14 applied (§14, §15): link-scaled rites, culture as convergence, faith via legitimacy sampled yearly, recognition as an act, fault line once, wear as typed incidents, appointment via government_change, token renames, banner facts corrected.

## 6. COUNTS
Disposed 48 of 48 ids (28 SPL + 20 SX naming PL): cured 46 · refuted 0 · stop 2 (SPL-B4, SX-20 — STOP-1). STOP-2 (owed DM-kill producer) is recorded under SPL-M2, which is otherwise cured. Volume 103 KB; 42 CURED and 15 REFINED brackets.
