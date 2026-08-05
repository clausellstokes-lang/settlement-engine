# INT — THE INTERIOR PROGRAM, COMPILED IMPLEMENTATION LAYER

## Compiled 2026-08-04 by the INT program architect against minifold @ e564e135
## (branch claude/composite-r4). Source volume: docs/DESIGN_FP_INTERIOR.md
## (census dated 2026-08-02 @ 38f81d05). Template: docs/DESIGN_WAR_RULINGS_ARCHITECTURE.md.
## Every premise below was RE-MEASURED against the live tree by read-only grep/read;
## live code outranks both this table and the volume's §2. Judgments are labeled
## JUDGMENT (vetoable). The war volume's §10 implementer protocol binds every wave
## VERBATIM (the volume's §11 already orders this; nothing here weakens it).

**The single most important compilation finding:** the source volume was written
BEFORE the war program built. Since its census, WR-1..WR-10 have ALL landed dark.
Four of the volume's "verified ABSENT" list entries are now BUILT (§1 R1–R4 below),
the §4 decision-grievance sketch is superseded in shape by WR-5's landed home (R5),
and the WR-2 disposition-decay precondition is satisfied (R6). INT-1 and INT-3 are
therefore GENERALIZATION waves over live, pinned war modules — not greenfield
builds — and every spec below is recompiled against that reality.

---

## §1 SUBSTRATE CLAIMS — re-measured 2026-08-04, file:symbol receipts

### 1a VERIFIED (26 claims; line numbers are TODAY's — cite symbols, not lines, at build)

| # | Volume premise | Measured receipt | Verdict |
|---|---|---|---|
| S1 | Legitimacy: persisted 0–100 stock, Endorsed ≥75 ×1.30 → Crisis <30 ×0.60, cause-reseeded on transfer, moved only by typed hits, no passive decay | rulingPower.js:286-290 (band table verbatim), :274 (`── Legitimacy reseed ──`), :374 `transferRulingPower`, :472-496 previousGovernments append; assizeKernel.js:77-78 `LEGIT_JUST:2`/`LEGIT_SHAM:2` (+:83 COUPLE_LEGIT), upswingKernel.js:112 `RECON_LEGITIMACY_DIVIDEND:4` | VERIFIED |
| S2 | Legitimacy readers end-to-end incl. the fragility cliff | momentum.js:713-717 `cliffStockFor` consumes `legitimacyFragility01`; :826-828 `entityThreshold` returns it; rulingPowerCoup.js:141/:173 economicAdj | VERIFIED |
| S3 | Coup lane: verdict recomputed live; war-sentiment weight 0.22; `economicCoupReadEnabled` VIRTUAL-dark | coup.js:45 `WAR_SENTIMENT_PHOLD_WEIGHT = 0.22`, :113 warSentimentAdj, :118-127 economicCoupReadEnabled strict `=== true` virtual read | VERIFIED |
| S4 | Bloc substrate: MAX 3, formation floor 0.55, warm-tie 1.4, rivalry 0.12, MIN_DWELL 8, clamp 1 ± DECISION_LOAD_SPAN, revanchism pull, leaderTiePosture | settlementPolitics.js:81/:89/:96/:101/:115/:140 (`DECISION_LOAD_SPAN: 0.3`), :596-617 `blocDecisionFactor` + clamp, :610 revanchism comment verbatim, :328 `leaderTiePosture`, :164 `settlementPoliticsActive` = both flags `=== true` | VERIFIED (consumption MOVED: settlementStrategy.js:1220, was :1044 — navigate by symbol) |
| S5 | `factionCompetitionEnabled` default TRUE; `quiet_local` sets it false | simulationRules.js:45 (exact); :339-345 quiet_local preset `factionCompetitionEnabled: false` (was :306 — rot) | VERIFIED |
| S6 | relationshipMemory D5 seam: half-life 4, lookback 24, hard-zero BEFORE half-life, both constants threadable, seam comment documents the deferral | relationshipMemory.js:12-13 (both constants), :14-23 (D5 SEAM comment verbatim, names the wiring point), :116-117 (threadable options), :127 `if (age > maxLookbackTicks) return 0`, :128 half-life after | VERIFIED at census-exact lines |
| S7 | The D5 band multiplier the seam adopts exists | relationshipEvolution.js:168 `memoryHorizonMultiplierOf` | VERIFIED |
| S8 | Grievance read: 0.65/0.35 composite, per-wound 0.35, OPEN substring regex is the only wound typing | grievanceRead.js:29-30/:33, :48 `WOUND_TYPE_RE` (verbatim the open regex), :56 `scoreGrievanceLean`, :82 iteration | VERIFIED |
| S9 | Commons rung ladder: LEGIT_FLOOR 55, rung-entry dips, no persisted unrest scalar | commonsVoiceKernel.js:55 `LEGIT_FLOOR: 55`, :63 `LEGIT_DIP: [0,1,2,3]`, :155-183 rung kinds | VERIFIED |
| S10 | `coup_detat` is one-strain by construction: pressureKinds `['legitimacy']` only | stressorsCore.js:236-239 | VERIFIED |
| S11 | Tribute feeds ECONOMY not the coup kind; war_exhaustion/famine absent from LEGITIMACY_ARCHETYPES; flat +0.16 | pressureModel.js:39 (TRADE_ARCHETYPES incl. `vassal_extraction`), :40 (LEGITIMACY_ARCHETYPES — no exhaustion/famine), :296-298 (+0.16) | VERIFIED |
| S12 | V-7 heirs-lite: inherit at 0.4, `inherited:true`, NO originHolderId anywhere | npcLadderState.js:72 `HEIR_INHERIT_FRACTION: 0.4`, :264-266/:306/:386 inherited markers; `originHolder` grep: ZERO hits | VERIFIED (INT-5's field is genuinely new) |
| S13 | Reframe lane dark; DARK_ENTER 0.35; no deliberate forgive/amnesty VERB | reframeKernel.js:67-80 virtual `reframeEnabled`, :135 `DARK_ENTER: 0.35`; realm verb grep: no FORGIVE/AMNESTY/BURY verb. ⚠ CAVEAT: WR-6 landed a coalition-settlement action `'forgiveness'` (relationshipState.js:205-211, status `'forgiven'`) — DEBT forgiveness between coalition partners, not a grudge burial; INT-6's vocabulary must not collide with it (see INT-6 spec) | VERIFIED with caveat |
| S14 | Deliberate levers: SUE_FOR_PEACE, DECLARE_CASUS, REPUDIATE_TREATY | realmManifest.js:257/:275/:288; realmVerbExecution.js:116/:131-133/:177 | VERIFIED |
| S15 | Treaties are settlement-plane; no signer identity | treatyBreach.js `hasParties` reads `treaty.parties[]` only | VERIFIED |
| S16 | momentum.js FOREIGN, export surface sufficient | export census: commitmentStockOf/commitmentCoursesOf/cliffStockFor/pastCliff/reconsiderationMultiplier/temperamentMomentumOf/entityThreshold/climbDownConsequence… all published; warTermination.js already consumes them read-only | VERIFIED |
| S17 | deploymentReturn voice defect live | deploymentReturn.js:471 `Hold chance ${verdict.pHold}, roll ${verdict.roll}` — census-exact line | VERIFIED |
| S18 | proseNumericsWalk push-indirection blind spot persists | tests/helpers/proseNumericsWalk.js header: follows `.push(...)` on PROSE-NAMED arrays only; relationshipMemory.js:300-302 `toFixed(2)` interpolations still present (the `out` array is non-prose-named) | VERIFIED (both INT-8 cures still owed) |
| S19 | informationStatecraft seat_held drift stands | informationStatecraft.js:126-128 doctrine ("a new dynasty inherits the paper…"), :133 typedef `@property {'people_held'} holder`, :350 writer stamps `'people_held'` only | VERIFIED (fix stays FP-INFORMATION's) |
| S20 | factionPair clocks: 156w half-life; ONE incident writer | factionPairLedger.js:44 `HALF_LIFE_WEEKS: 156`, :148 `mintFactionPairIncident` (the one writer INT-3 must route through) | VERIFIED |
| S21 | Legitimacy has NO standalone certification row — proxy `strategy_legitimacy` only | subsystemRowsBaseline.js:94 `'strategy_legitimacy'`; grep for a legitimacy rule row elsewhere: none | VERIFIED (INT-7's gap is real) |
| S22 | Chronicle bounds: wizardNews 240, turningPoints 24, previousGovernments bounded | region/wizardNews.js:21 `MAX_ENTRIES = 240` (was :12 — rot), relationshipState.js:136 `RELATIONSHIP_TURNING_POINT_CAP = 24` (census-exact), rulingPower.js:200 "intentionally bounded" | VERIFIED |
| S23 | Dossier surfaces for the round-trip pins | EngineSections.jsx:225 previousGovernments render (census-exact); PowerStructure.jsx:291 Rule & Succession; SettlementDetailLinkNeighbourCard.jsx EXISTS; map/TreatyPanel.jsx EXISTS (realm surface, secondary landing per the volume) | VERIFIED |
| S24 | Herald registries: WHAT_PHRASES + heraldRouting + war-grade pools | display/settlementRumors.js:116 `WHAT_PHRASES` (63-kind canonical arm at :381), realm/heraldRouting.js exists, worldPulse/warReceiptPools.js exists (the WAR_RECEIPTS shape INT-8 copies) | VERIFIED |
| S25 | relationshipStates is an unconditional per-pulse container — structurally unobservable, certified as such | relationshipEvolution.js:124-126 `ensureRelationshipStatesForGraph`, :213-228 unconditional rebuild+spread | VERIFIED (every new INT record must be drop-when-empty) |
| S26 | Size-ratchet reality at the touchables | scripts/.size-baseline.json (15 entries): pulseKernel.js **1580** (banked), applyWorldPulse.js **941** (zero headroom), settlementStrategy.js **812**, warTermination.js **818** — all four frozen, tolerance-zero. NOT baselined (under layer ceiling in effective lines today; re-measure with the enforcer Linter at the publishing commit, never inherit): coup.js 226 raw, rulingPowerCoup.js 204, settlementPolitics.js 1043 raw, relationshipMemory.js 599, grievanceRead.js 130, commonsVoiceKernel.js 340, npcLadderState.js 932, factionCompetition.js 996, factionPairLedger.js 238, warSeatBooks.js 515, warPeaceDecision.js 468, rulingPower.js 508, npcLadderKernel.js 1101, deploymentReturn.js 507 | VERIFIED |

### 1b REFUTED / SUPERSEDED (7 — the census was honest at issue time; the tree moved)

**R1 — "The two-books mechanism verified ABSENT (no books module)": REFUTED BY
LANDING.** `src/domain/worldPulse/warSeatBooks.js` (515 lines) is WR-5's pure
ruler/realm objective read. Exports: `readWarSeatBooks({worldState, snapshot,
actorId, opponentId})` and `authoritySignatureFor(...)`. Return shape (measured):
`{ interestKind:'realm'|'seat'|'patron', settlementWeight01, seatWeight01,
patronWeight01, securityBand:'secure'|'contested'|'precarious'|'unseated',
lawfulness01/malice01 + bands, continueBias01, peaceBias01, factionId?,
factionName?, patron* fields }`. It already composes THE THREE §2-row-10
substrates: security from legitimacy (0.35) + faction share (0.25) + standing
(0.25) + `coalitionConsolidation01` from settlementPolitics when lit (0.15); the
patron arm reads `foreignAssetsByPatron` (corruptionWeb's covert seam, consumed
not extended); character from npcTraitWeights/facets. **Consequence: J-INT-1's
fork resolves — WR-5 built it as a MODULE, not inline. INT-1 is NOT an
extraction wave; it is a generalization wave over a live, pinned module** (§INT-1
below). Note the landed shape differs from the volume's `booksOf → {
settlementPosition, rulerPosition, weight01, receipt }` sketch: weights are a
three-way split, the receipt lives on warTermination's receipt lane as
`booksDirection`/`booksInterest`.

**R2 — "The refusal-price lane (G2) ABSENT": REFUTED.**
`warPeaceRefusal.js#applyWarPeaceRefusal` (250 lines), registered
`CPL-21.GRAMMAR_TO_INTERIOR.WR-5.refusal_price` in
src/domain/certification/couplingRegistry.js. INT waves CONSUME this; never
rebuild it.

**R3 — "The succession re-read and installed-successor demand ABSENT": REFUTED
for the war arm.** `warPeaceDecision.js#readWarPeaceDecision` carries
`inheritedDemand: null | {decisionId, desiredAction:'peace'|'continue', actorId,
targetId}` (:166, resolved :315-331 — an inherited demand OVERRIDES the current
books read, exactly WR-5's D/H arm); the demand travels as
`carriedDemand: outcome.proposalPayload.warDemand` through applyWorldPulse.js:943.
**INT-3's remaining work is the NON-WAR generalization** (pacts, the full decision
vocabulary, the pact re-read) — the war half exists and is the template.

**R4 — "Coup-verdict decision naming ABSENT / no organizing-grievance
mechanism": PARTIALLY REFUTED.** `warPoliticalLoop.js#applyWarDecisionPolitics`
(231 lines) deposits typed `'war_decision'` incidents with
`context.{decisionId, actualAction, desiredAction}` through
`mintFactionPairIncident` (registry row
`CPL-6.WAR_TO_INTERIOR.WR-5.war_decision_grievance`), capped
`MAX_OPPOSITION_DEPOSITS: 3`, severity `BASE_SEVERITY 0.36 + POWER_SEVERITY_SPAN
0.34`, resentment gain 0.14; `selectWarDecisionIncident`
(factionPairLedger.js:91) is the read-back. **STILL ABSENT: the JOIN RECEIPT —
no verdict surface names the decision.** That sentence remains INT-3a's core
deliverable; the write-side mechanism it narrates is built for the war
vocabulary.

**R5 — §4's decision-grievance home ("rides factionStates through the records'
own writers"): SUPERSEDED IN SHAPE.** The landed home is
`worldState.factionPairStates[...].incidents[]` via the ONE existing writer
`mintFactionPairIncident`, gated by `warLayerEnabled` + `warTerminationEnabled` +
`factionCompetitionEnabled` + `memoryWeaveEnabled` (the registry row lists all
four). INT-3 generalizes THIS home — J-INT-2's spirit (no new ledger, no new
writer) is satisfied by the landed lane, and re-homing to factionStates now
would mint the second memory plane J-INT-2 vetoes.

**R6 — "dispositionStats has NO decay; build nothing that assumes it decays
(WR-2 precondition unbuilt)": RESOLVED SINCE.** WR-2 landed: dispositionChannels.js
(orchestration), dispositionLedger.js (`advanceDispositionChannels`, decay-typed
transitions `source:'decay'|'outcome'|'mixed'`), dispositionProfile.js (the pure
read side — `thresholdFactorOf`, import-pinned so it cannot name a victim), dark
behind `dispositionChannelsEnabled`, certified subsystemRowsWar.js:391. The
ruler-position read MAY consume banded channels when lit; dark, the undecaying
single-channel legacy still feeds it — INT-1 carries the degraded-arm note, no
longer a hard warning.

**R7 — Census omission: `memoryWeaveEnabled`.** A virtual flag the volume never
names (relationshipEvolution.js:305-316 `memoryWeaveActive`, deliberately absent
from DEFAULT_SIMULATION_RULES per simulationRules.js:266/:282; grievanceRead.js:15
documents that the gate lives at the CONSUMER). The entire grievance/revanchism
consumer lane INT-3/INT-5/INT-6 sit on is memory-weave-gated. **Every INT flag
composition below that touches grievance reads must declare its relationship to
`memoryWeaveEnabled` explicitly** (§2). A dormancy proof that ignores it proves
the wrong conjunction.

**Also re-measured, still true:** SP-1..SP-7 spine infrastructure remains ABSENT
(`postureOf`/`riskToleranceOf` grep hits only in roads modules — a different
posture; no generic errand kernel, no confidence-stock family, no narration kit,
no temporal walker). WR-7's envoy errands EXIST but with the closed war
vocabulary `ENVOY_PURPOSES = ['sue', 'self_parlay']`
(envoyErrandVocabulary.js:119) — a candidate host for INT-3b but NOT SP-1
(open question Q1). The volume's BUILD-PRECONDITION list therefore still binds:
INT-3b (SP-1), the posture consumptions (SP-4), the SP-5 grammar, SP-6 kit, SP-7
walker are all still unbuilt — every wave below names its degraded arm or STOP
condition for them.

---

## §2 FLAG FAMILY — law-2 shape and manifest timing (measured against the live manifest law)

**Measured manifest reality (differs from the briefed idiom in one respect):**
`ENGINE_GATED_VIRTUAL_RULE_KEYS` (simulationRules.js) holds FIVE members today
(beliefAxesEnabled, conquestDoctrineEnabled, infoStatecraftEnabled,
migrationRumorsEnabled, sovereigntyTradeEnabled) with matching rows in
subsystemRowsVirtual.js. The five dark WR flags are NOT members — they certify
in the subsystemRowsWar.js LANE instead ("Lane placement is free …
the totality walker asserts the PARTITION, not the address"). The binding
precedent is the WW-A comment inside the manifest itself: a flag joins **in the
SAME commit as its first real gate read AND its certification row —
"certification tracking reality instead of preceding it."**

**JUDGMENT (vetoable):** the six INT flags certify in a NEW lane file
`subsystemRowsInterior.js` (subsystemRowsWar's shape, the add-a-row protocol in
subsystemRowsWaves.js), and each joins `ENGINE_GATED_VIRTUAL_RULE_KEYS` in the
same commit as its first real gate read + its lane row, with the walker
asserting exactly that one-key delta. Rationale: the virtual cohort is the
correct manifest for engine-gated virtual rules; the lane file keeps the
interior's evidence rows out of the war lane. (Open question Q4 offers the
chair the alternative.)

| Flag | Status @ e564e135 | Gates | Law-2 shape | Composition partners (measured) | Wave |
|---|---|---|---|---|---|
| `seatBooksEnabled` | UNMINTED (grep: zero hits) | the generalized books read's NON-WAR consumers | virtual, absent from DEFAULT_SIMULATION_RULES, strict `=== true`, dark-never-permissive | war arm rides `warTerminationEnabled` (already live-dark); politics term inside warSeatBooks already self-gates on `settlementPoliticsActive` | INT-1 |
| `settlementPoliticsEnabled` | EXISTS, dark (settlementPolitics.js:164; pulseKernel.js:377) | bloc formation + decision loading (BUILT); INT-2 adds counsel receipts, generalization, dossier projection UNDER THE SAME FLAG | already law-2 shaped | `factionCompetitionEnabled` (DEFAULT-TRUE, simulationRules.js:45; quiet_local FALSE :345 — the preset-negative pin is mandatory) | INT-2 |
| `interiorVetoEnabled` | UNMINTED | organizing grievance generalization, causal-join receipts, re-read triggers, émigré arm | law-2 | `memoryWeaveEnabled` (the landed grievance lane's gate — R7) + `settlementPoliticsEnabled` (bloc-held entries) + the WR-5 quartet on the war-decision arm | INT-3 |
| `strainAttributionEnabled` | UNMINTED | attributed pressure receipts, commons tribute term, rally receipt | law-2 | `economicCoupReadEnabled` (declared degraded-dark arm), `warDispositionEnabled` (lit in full_simulation) | INT-4 |
| `memoryHorizonSeamEnabled` | UNMINTED | band-scaled half-life AND lookback + founding-wound reads | law-2; LIVE-MODULE flag (relationshipMemory is lit-path — fence golden FIRST, J-INT-6) | `memoryWeaveEnabled` at the revanchism consumers | INT-5 |
| `deliberateForgivenessEnabled` | UNMINTED | burial verb (both arms), suppression reads, dig-up | law-2 | `memoryWeaveEnabled` (suppression consumers), `reframeEnabled` UNTOUCHED (organic lane stays separate) | INT-6 |
| `legitimacyCrossingsEnabled` | UNMINTED | crossing receipts (SP-5 instantiation); INT-7's row keys on them | law-2 | none (reads the stock after existing writers) | INT-7 |
| `economicCoupReadEnabled` | EXISTS, VIRTUAL-dark (coup.js:118-127) | tribute-drain → coup footing | already law-2 | registered for the owner's lighting queue — NO code change (volume §3 note stands) | INT-4 note |

INT-8 carries NO flag of its own (volume §3): new-kind pools ride their kinds'
flags; LIT-kind upgrades are J-INT-13 OWNER-GATED (open question Q3).

**Four-fence dormancy set per flag (L2, mandatory, with the lit-mutant
control):** own-footprint golden · absent-vs-false differential · call-path spy ·
gate-polarity census — plus the conjunction-gate hole check: every flag lands at
least one BY-NAME strict read (a read only through a frozen-list `.every()` is
invisible to the gate walker). For `settlementPoliticsEnabled` the fences pin
BOTH compositions dark AND the quiet_local preset-negative (§INT-2).

---

## §3 CANONICAL MODEL — fought to ONE new persisted key

**New top-level/ledger keys: exactly one.**

```
worldState.spatialLedgers.burials            — INT-6, writer burialLedger.js (ONE
  [ { id, pairKey, woundFamily,              //   writer; decree/dig-up/lapse all
      decreedTick, decreedBy,                //   close through it). woundFamily =
      price: { receiptId },                  //   INT-6's seven-family closed enum
      state } ]                              //   (held | dug_up | lapsed).
                                             //   Drop-when-empty at every level;
                                             //   absent ⇒ byte-identical; zero
                                             //   eager bytes (S25's law).
```

**Field additions on existing records (drop-when-absent, never null — T4):**
- `LadderGrudge.originHolderId?` — INT-5, stamped ONCE by the V-7 inheritance
  writer (npcLadderState.js) at the FIRST succession crossing, immutable across
  chains. Measured: no such field exists today (S12).
- Decision-grievance entries — INT-3: NO new field shape. New incident TYPES
  (sibling to the landed `'war_decision'`) written through
  `mintFactionPairIncident` with the same `context.{decisionId, actualAction,
  desiredAction}` shape (R5). JUDGMENT: sibling types per decision kind
  (`pact_decision`, `severance_decision`, `stance_decision`, `sale_decision`,
  `burial_decision`), never a re-type of the landed rows (persisted rows sit
  under THE PROMISE; open question Q2 offers the chair the unified-type
  alternative).

**Pure reads, receipts only, NO state:** the generalized books read (INT-1, on
warSeatBooks.js), `woundFamilyOf` classifier + suppression reads (INT-6),
`foundingWoundOf`/`grudgeLineageOf` (INT-5), legitimacy crossing detector
(INT-7 — NEVER a second legitimacy writer), co-presence pressure read (INT-4),
counsel receipts (INT-2 — news-plane).

**Lifecycle-paths clause (L4, per state-writing wave — lands BEFORE the writer builds):**
- **burials (INT-6):** create = burialLedger.js mint on the executed price
  package (a decree whose package fails to execute binds NOTHING — receipted);
  read = grievanceRead-side suppression (both J-INT-14 arms) + dossier
  neighbour-card line; persist = spatialLedgers serialization, JSON-round-trip
  pinned; regenerate-under-THE-PROMISE = held burials survive regen with the
  pair (the ledger is campaign-level state, not generated), a regen that removes
  a pair lapses its burials through the writer (`lapsed_with_the_pair`), never
  dangles; undo = restores the ledger byte-exact with worldState; migrate/import
  = `woundFamily` validated against the closed enum, unknown family ⇒ row
  dropped to absent with a load receipt, never a free string; veil = burial rows
  are public-plane (a decree is proclaimed), the PRICE receipt routes through
  the existing includeCovert projection where the package touched covert state.
- **originHolderId (INT-5):** create = stamped at inheritance only; read =
  grudgeLineageOf; persist = with the ladder record (JSON-round-trip); regen =
  re-stamps only where inheritance re-occurs (fence: a regen that rebuilds the
  ladder without a succession does NOT invent one); undo = with the record;
  import = validated against the roster's durable ids, unresolvable ⇒ dropped to
  absent, never a dangling read.
- **decision-grievance siblings (INT-3):** create = the override/join writer
  through mintFactionPairIncident ONLY; read = selectDecisionIncident
  (generalized from factionPairLedger.js:91); persist/undo/import = the
  factionPairStates ledger's existing paths (already pinned by WR-5's wave —
  verify, do not re-pin); regen = entries die with their producing pair exactly
  as the landed war rows do; decay = state-derived (bloc dissolves or decision's
  object ends) + the banded tail, denominated INTERVAL_WEEKS.

**Deliberately NOT modeled (volume §4 upheld, re-verified):** no unrest scalar
(S9) · no court-opinion stock · no dynasty graph (S12) · no stored books (R1's
module is pure) · no second legitimacy writer (S1's writers stay the total set) ·
no tribute→legitimacy write (J-INT-3; S10/S11 prove the coup kind never reads
economy — attribution, not amplification) · no new relationship vocabulary
except woundFamily (S8: the only typing in the tree is the open regex).

---

## §4 THE WAVES (dependency order; one commit per wave — INT-3 two commits;
## every wave DARK per §2; war volume §10 protocol VERBATIM; focused gates per
## slice, full gate at wave end via check:tail / gate-tail.sh, ledger row each)

**Standing collision map (all waves):** this tree is LIVE and shared. Files
recently edited by war-era lanes and likely under concurrent pins:
warSeatBooks.js, warPeaceDecision.js, warPoliticalLoop.js, factionPairLedger.js,
settlementPolitics.js (WR-10's §4 differential-burden block at :638),
warTermination.js (baselined 818), applyWorldPulse.js (941, zero headroom),
pulseKernel.js (1580, banked). Every INT wave: `git log --oneline -5 -- <file>`
before first edit; re-grep renamed symbols after every rename
(concurrent-lane silent-revert hazard); cp-backups for negative controls, NEVER
checkout-family; byte-scan every authored file for NULs; `// anchored:` on new
negative assertions; every doc-reading pin asserts EXACTLY-ONCE; every
load-bearing conjunction gets an executed mutant with a
mutationCoverageManifest entry; pathspec commits only.

### INT-1 — THE BOOKS GENERALIZED (flag `seatBooksEnabled`)
**Premise delta (R1/R6):** the evaluator EXISTS (warSeatBooks.js, 515 lines,
pinned by war-era tests). INT-1 = (a) the generalized consumer seam, (b) the
change-gated books-standing receipt, (c) the dossier line, (d) the ONE-evaluator
census. **JUDGMENT (vetoable):** warSeatBooks.js IS the volume's `seatBooks.js`
— no rename, no facade that recombines weights (a shape-adapting facade is a
second evaluator wearing a shim's clothing; a rename breaks filename-anchored
war pins and invites the concurrent-lane revert class). The volume's module-name
clause is satisfied by the one-evaluator PROPERTY, recorded here as the
naming ruling. Non-war consumers import `readWarSeatBooks` directly.
- **Files + budgets:** warSeatBooks.js (515 raw — headroom exists; new exports
  only, target ≤ +80 lines: the generalized `booksStandingOf` band projection +
  the change-gate signature). New leaves: `seatBooksReceipt.js` (≤200 — the
  banded receipt composer + agreement deadband + change-gate memory read),
  `seatBooksCensus` walker test (the shrink-only consumer census). Receipt
  emission mounts at the existing warTermination receipt lane for the war arm
  (NO growth — 818 frozen) and via the lifecycle host for the non-war standing
  receipt (never pulseKernel/applyWorldPulse — both frozen).
- **Flag + fences:** `seatBooksEnabled` four-fence set + lit-mutant control;
  by-name strict read in seatBooksReceipt.js; dark ⇒ zero receipts, zero new
  news kinds, byte-identical goldens.
- **Determinism:** the read is already pure/rng-free (verified: no hash01 in
  warSeatBooks); the receipt composer adds NO new stream — variant selection
  (INT-8's pools) keys `int1.books.<settlementId>` when that wave lands.
- **Pins (negative hardest):** CONVERGENCE negative (secure/endorsed/aligned
  seat ⇒ books agree, receipt says "of one mind" — seed the secure state, §1c
  vacuity law); both WR-5 divergence shapes REUSED from war pins (verify they
  exist; do not duplicate); BOOKS-COLLAPSE general case; patron arm projected
  includeCovert-only (the patron fields already exist — R1); K3 structural set
  on the receipt composer (import pin + token scan + guard-the-guard with the
  positive control pointing at a truth-reader OUTSIDE the set); the
  CYCLE-ABSENCE import pin (no postureOf — trivially true today, SP-4 absent;
  the pin is the tripwire for when SP-4 lands); CHANGE-GATE pin (same weights
  two pulses ⇒ ONE receipt; oscillation within deadband ⇒ ZERO); dormancy
  golden; ONE-EVALUATOR census: a comment-stripped source scan proving no
  second module computes a settlement/seat weight split, with an executed
  third-evaluator plant as the mutant.
- **Lifecycle:** none (pure read; receipts on the news plane follow news
  lifecycle).
- **Req 13 (alignment):** engagement — the ruler-position term reads
  TRAIT_ALIGNMENT axes (measured: warSeatBooks imports TRAIT_ALIGNMENT); the
  receipt's lawfulness/morality bands are the alignment story. Req 14
  (edit-verb): none — no DM-editable field is touched; declared-empty with that
  reason.
- **Collisions:** war certification contract (warConvergenceContract.js — its
  deciding-term keys import into warTermination; do not disturb);
  sovereigntyIntent.js already consumes the books (WR-10's stated seam — the
  census must count it from day one).

### INT-2 — THE POSITIONS WIRED (flag `settlementPoliticsEnabled`, EXISTS dark)
**Premise delta:** none material — S4/S5 verified; the chooser loading is
consumed at settlementStrategy.js:1220 (moved line). WR-10-era code already
extended settlementPolitics.js (§4 differential burden :638, succession glue
:771, WR-10 sale note :645) — collision care, not premise change.
- **Files + budgets:** settlementPolitics.js (1043 raw — effective count near
  the domain ceiling; MEASURE FIRST with the enforcer; the counsel-receipt
  composer does NOT go here). New leaves: `blocCounsel.js` (≤250 — counsel
  margin read + receipt mint + override detection), `blocCounselNews.js` (≤150
  — the news-plane join, WHAT_PHRASES + heraldRouting + own walker file per
  L6). The override handoff writes through mintFactionPairIncident (INT-3's
  sibling type `*_decision` — the entry mints HERE, consumed there; both waves
  touch factionPairLedger.js:148's caller list, coordinate by build order).
- **Flag + fences:** same-flag completion — the four-fence set pins BOTH
  compositions dark (politics off / factionCompetition off) AND the
  quiet_local PRESET NEGATIVE (S5: `factionCompetitionEnabled:false` at
  simulationRules.js:345 ⇒ zero blocs, zero counsel, INT-3's bloc lane empty,
  while re-read/demand/émigré arms still function — the declared degraded arm,
  pinned, which the dormancy golden cannot catch).
- **Pins:** CLAMP negative (property-shaped over generated bloc states — no
  composition zeroes or forces a verb; DECISION_LOAD_SPAN 0.3 bounds it,
  clamp at settlementPolitics.js:616-617); quiet-town negative (seed blocs
  non-empty FIRST, then remove — vacuity law); override handoff EXACTLY-ONE
  entry (dedup pinned against mintFactionPairIncident's dedup);
  survival-bloc dissolution honesty (siege lifts ⇒ counsel stops);
  JSON-alias round-trip (factions[].members[] ARE npcs[] — S-hazard);
  dossier round-trip on the faction-card FOREIGN-COUNSEL line
  (VERIFY-AT-BUILD panel; fallback = faction-card family).
- **Bands:** per-verb loading tables CLOSED (deploy/sue_for_peace exist at
  :609-616; the generalization adds rows ONLY as each program's verbs land —
  J-INT-12's law: the vocabulary never leads the events); counsel margin;
  patience band; SP-6 class ASSIGNMENT (SP-6 absent — the assignment ships as
  a named constant with a TODO-tripwire pin that reds when the significance
  family lands without this class registered; the pacing governor's existing
  machinery gates emission meanwhile).
- **Req 13:** engagement — leaderTiePosture (:328) casts the champion; counsel
  receipts name the bloc's leading NPC. Req 14: none — declared empty (no
  DM-editable surface).
- **Collisions:** settlementStrategy.js (baselined 812 — the factorFor seam at
  :1220 is the consumption point; extending the move vocabulary must not grow
  the file past its frozen number — budget a leaf if needed).

### INT-3 — THE INTERIOR VETO COMPLETES (flag `interiorVetoEnabled`; two commits)
**Premise delta (R3/R4/R5):** the war arm is BUILT — warPoliticalLoop deposits
`war_decision` incidents; warPeaceDecision honors `inheritedDemand`;
applyWorldPulse:943 carries `carriedDemand`. INT-3a therefore: (i) the
SIBLING-TYPE generalization of the deposit lane (pact/severance/stance/sale/
burial decisions — each mints only when its producing event exists, J-INT-12);
(ii) THE JOIN RECEIPT (still absent — R4): when a verdict lands in a settlement
holding a live decision incident that materially loaded it, the verdict receipt
NAMES the decision; (iii) the `decision` pressureKind sibling reading these
entries into coup pressure through existing clamps; (iv) the PACT re-read
(the war re-read exists; the pact half triggers SP-3's writer — SP-3 ABSENT, so
the TRIGGER ships behind the flag with the writer-call dormant and a
STOP-and-report if tempted to mint pact state here).
- **Files + budgets:** warPoliticalLoop.js (231 — the generalization either
  extends it ≤ +120 or lands `decisionPolitics.js` as a sibling leaf; JUDGMENT:
  sibling leaf, keeping the war module war-only and its pins untouched);
  factionPairLedger.js (238 — `selectDecisionIncident` generalization ≤ +40);
  coup.js (226) + rulingPowerCoup.js (204) for the pressureKind sibling and the
  join-margin receipt — both small files, headroom real, but coup.js is
  live-lit: FENCE GOLDEN FIRST. The verdict receipt composer is a new leaf
  `decisionJoinReceipt.js` (≤180).
- **INT-3b (second commit) — THE ÉMIGRÉ: BLOCKED as specced.** SP-1 is absent;
  the envoy family's vocabulary is closed war-scope (ENVOY_PURPOSES
  ['sue','self_parlay'] — R-note). Open question Q1 rules the host. Until
  ruled: INT-3b does not build. The volume's own law ("the vocabulary never
  leads the events") backs the hold. STOP-and-report is the SUCCESS mode here.
- **Pins:** BOTH polarities at pact grain (sign-party vs refuse-party — the war
  polarity pins exist in WR-5's suite; verify then extend); THE JOIN NEGATIVE
  (hardest — a coup from pure legitimacy collapse with NO live decision
  incident names no decision; seed the legitimacy collapse, prove
  decision-silence; the positive control seeds a live entry and proves the
  naming); reversal defusal (decision reversed ⇒ entry dies state-derived ⇒
  tilt returns, receipted); installed-successor honour generalized + the
  CHARACTER pin (two tempers ⇒ honoured vs betrayed); re-read bidirectional
  (repudiates under one character, REAFFIRMS under another — both receipted);
  reachability pin on every ANDed gate (real generated corpora);
  memoryWeave-composition pin (weave dark ⇒ the deposit lane is exactly as
  dark as WR-5's — no new leak path); dormancy golden.
- **Req 13:** engagement — the join receipt names the champion and the seat's
  holder through existing casts. Req 14: none; declared empty.
- **Collisions:** INT-2's override writer (same mint site — build order
  resolves); WR-5's warPoliticalLoop pins (do not retype `war_decision`);
  applyWorldPulse.js FROZEN at 941 — the pressureKind mounts through the
  stressor lane's existing composition, NEVER a new applyWorldPulse edit.

### INT-4 — THE NARRATED MIDDLE (flag `strainAttributionEnabled`)
**Premise delta:** none — S10/S11 verified at today's lines (coup_detat
one-strain; tribute in TRADE_ARCHETYPES; +0.16 flat term). The co-presence
respec (chair ruling R7 in the volume) compiles as written.
- **Files + budgets:** NEW leaves only: `strainAttribution.js` (≤250 — the
  co-presence read over live state at the pressure crossing: treaty installment
  streams, exhaustion scar, famine/occupation conditions, corruption plane;
  closed burden vocab {tribute_strain, war_exhaustion, famine, occupation,
  corruption}; banded presence, band words only per L5) +
  `strainAttributionNews.js` (≤150, L6 five-joins + own walker).
  commonsVoiceKernel.js (340, live-lit): the treaty-burden term feeds the
  EXISTING composite through the existing writer — fence golden FIRST; the
  term's reader resolves the treaty's own cadence marker (WR-0c item 4:
  52-week current / legacy 12 — never re-price). rulingPowerCoup.js: the rally
  receipt's margin read (≤ +30; :184's generic fallback stays the sub-margin
  arm).
- **Pins:** CO-PRESENCE NEGATIVE + positive control (pure legitimacy collapse
  with no tribute ⇒ no tribute named; same crossing WITH a live stream ⇒ named
  — seed BOTH states); CAUSAL-CLAUSE negative (only a matched
  LEGITIMACY_ARCHETYPES condition — corruption_exposed is the only §5 burden in
  that set (S11) — ever words as CAUSE); dividend pin (two believed severities
  ⇒ two banded magnitudes); rally margin negative (sub-margin ⇒ generic
  receipt); DOUBLE-COUNT guard (attribution adds WORDS never weight —
  property-shaped with both flags lit); degraded-arm validity
  (economicCoupReadEnabled dark ⇒ fewer named burdens, receipts honest);
  no-decimal runtime pin on composed output (L5 — source scans cannot see
  composers); dormancy.
- **Req 13:** engagement — facets color the payer's naming. Req 14: none;
  declared empty. **Dossier:** town-page strain line = NEW UI WORK owned here
  (fallback: power-structure card family, S23); TreatyPanel.jsx line is the
  cheap secondary landing (surface verified — S23).
- **Collisions:** INT-7 (crossing receipts — INT-4 receipts at the STRESSOR
  crossing, INT-7 at the legitimacy BAND crossing; two distinct kinds, both
  pacing-registered; the walker files stay separate per L6).

### INT-5 — THE MEMORY SEAM + THE FOUNDING WOUND (flag `memoryHorizonSeamEnabled`)
**Premise delta:** none — S6/S7/S12 verified at census-exact lines; both
constants threadable; the module's own header still documents the deferral.
- **Files + budgets:** relationshipMemory.js (599, LIVE lit-path — the seam
  threads {halfLifeTicks, maxLookbackTicks} × memoryHorizonMultiplierOf through
  collectMemories' call sites; ≤ +40 lines; FENCE GOLDEN FIRST, J-INT-6);
  npcLadderState.js (932 — originHolderId stamp at the inheritance sites
  :264-266/:306/:386, ≤ +15); new leaf `foundingWound.js` (≤180 —
  foundingWoundOf(pairKey) + grudgeLineageOf over stored {type, tick} rows).
  NOTE the existing decay math uses Math.pow (relationshipMemory.js:128) —
  pre-existing; the seam SCALES CONSTANTS ONLY and introduces no new
  transcendental.
- **Pins:** BOTH-SIGNS × BOTH-CONSTANTS anti-ratchet (the band lengthens
  bright rows exactly as wounds, on the half-life AND the lookback —
  property-shaped over the weight function); THE FORTY-YEAR pin (EXECUTED on a
  real generated corpus under an undying band: a 40-campaign-year row scores
  non-zero and returns from foundingWoundOf — the proof the seam opened the
  24-tick window); dark byte-identity golden FIRST; fleeting negative (decays
  FASTER than default); asymmetric-pair fixture (one wound, two bands,
  receipted when it decides); chain-immutability (originHolderId survives a
  second succession UNCHANGED); JSON-round-trip + regen/undo/import per §3's
  lifecycle clause; memoryWeave composition pin (the seam's consumers gate on
  the weave — seam lit + weave dark must move NOTHING the weave gates).
- **Req 13:** declared-empty WITH reason: a memory-clock law touches no
  alignment surface. Req 14: none — no DM-editable field (hooks/DM prose
  untouched; the causal-prose boundary holds).
- **Collisions:** INT-8 consumes foundingWoundOf (build order); INT-6's dig-up
  age pricing reads the seam-corrected clock (lighting order:
  memoryHorizonSeamEnabled before deliberateForgivenessEnabled).

### INT-6 — DELIBERATE FORGIVENESS (flag `deliberateForgivenessEnabled`)
**Premise delta:** S13 verified with ONE new caveat — WR-6's coalition
`'forgiveness'` settlement action exists (relationshipState.js:205-211).
**Naming ruling (JUDGMENT):** INT-6's vocabulary uses `burial`/`buried`/`dug_up`
exclusively; the word `forgiveness` never enters an INT-6 type, status, or id
(the flag name, owner-authored in the volume, is the sole exception) — the
collision-free spelling is load-bearing for greps and walkers.
- **Slice 1 (own commit): the woundFamily classifier.** `woundFamilyOf(incidentType)`
  single-writer typed classifier replacing WOUND_TYPE_RE at its call sites
  (grievanceRead.js:48/:82 — the ONLY typing in the tree, S8), seven families
  partitioning the regex exactly; behavior-identical golden (every incident
  type in the live corpus classifies to a family whose membership implies the
  regex matched, and vice versa — pinned in both directions); walker asserts
  TOTALITY over the incident-type inventory (a new type with no family reds).
- **Slice 2: the ledger + both arms.** New leaf `burialLedger.js` (≤300, the
  ONE writer per §3); grievanceRead.js (130 — the two J-INT-14 arms: revanchism
  family-scoped exact suppression over typed rows; grievance BANDED RECEIPTED
  DISCOUNT, never zero; ≤ +50); the DM verb arm (realmManifest + approval
  routing, the REPUDIATE_TREATY twin — J-INT-5's both-arms law) and the
  autonomous plan-lane arm priced by the books read (INT-1); the domestic
  dividend + hold-dwell verdict per the volume's corrected spec.
- **Pins:** SUPPRESSION-NOT-DELETION two arms (held ⇒ covered reads 0 WITH
  receipt AND every incident row byte-identical; dig-up ⇒ reads RESUME + new
  betrayal wound); unilateral-burial negative (counterpart's casus untouched —
  seed counterpart ledger non-empty FIRST); family-scope negative on one
  two-family fixture (revanchism arm exact, grievance arm banded-never-zero);
  DOMESTIC VERDICT pin (surrender vs statesmanship, both receipted);
  price-executes gate (insufficient stores ⇒ binds NOTHING, receipted);
  bloc-override entry exactly-one (`burial_decision` sibling via INT-3's lane);
  age-scaled dig-up price (two ages, two banded prices, on INT-5's corrected
  clock); burial-gate reachability on real corpora; full lifecycle battery per
  §3's clause; writer/reader spelling pin (boot burialLedger, read through
  grievanceRead); dormancy golden; v5 absence-is-evidence (drop-when-empty
  joins the census — S25's law).
- **Req 13:** engagement — the proud ruler's burial prices dearer (facets).
  Req 14: none; declared empty.
- **Collisions:** grievanceRead.js is memoryWeave-gated at consumers (R7 — the
  suppression must sit INSIDE the weave-gated read path, or dark-weave worlds
  leak the discount); INT-3's decision lane (the `burial_decision` entry);
  generosityReactions (spatial/ path — note the census's bare filename) for the
  price package.

### INT-7 — LEGITIMACY'S ROW + THE INTERIOR ENVELOPES (flag `legitimacyCrossingsEnabled`)
**Premise delta:** S21 verified — `strategy_legitimacy` proxy only
(subsystemRowsBaseline.js:94), no standalone row. WR-9 LANDED since the volume
(memory: 9a repaired, 9c/9d closed) — the envelope harness ADOPTION arm of the
volume's coordination note applies, not the standalone arm: VERIFY the WR-9
harness location at build and adopt its pattern.
- **Files:** crossing detector = new leaf `legitimacyCrossings.js` (≤200 —
  reads the stock AFTER existing writers, hysteresis on the existing band
  edges, one receipt per crossing, cause-typed reseed case); certification =
  the new `subsystemRowsInterior.js` lane (§2 JUDGMENT) with the
  crossing-has-a-hit invariant (the a_coup_verdict discipline pointed at the
  typed-hit vocabulary from S1's writer census); the interior envelopes TOTAL
  over all 20 declared endings tokens by family + the TWO-PART tempo envelope
  (regression floor per-settlement-year on the named 4-settlement fixture —
  0.005/settlement-year baseline; fresh floor-AND-ceiling band over new kinds).
- **Pins:** crossing-has-a-hit walker; hysteresis negative (oscillation within
  a band ⇒ ZERO crossings — seed the oscillation); reseed crossing cause-typed
  as the transfer's, never a phantom hit; dormancy for the flag; every envelope
  carries its executed mutant negative control; the envelope harness boots on a
  real soak corpus (owner-ordered soak = the program's acceptance gate —
  nothing here runs one).
- **Req 13:** declared-empty with reason (an instrument bench). Req 14: none.
- **Collisions:** subsystemCertification.js composition + the partition walker
  (the new lane must join the registry in the same commit); INT-4's distinct
  receipt kind (see INT-4).

### INT-8 — THE INTERIOR VOICE (no flag of its own)
**Premise delta:** S17/S18 verified — both voice defects live at census-exact
lines; the walker's blind spot persists (push on NON-prose-named arrays inside
prose-named functions still escapes). warReceiptPools.js is the landed
war-grade pool shape to copy (S24).
- **Scope split by gate:** NEW-KIND pools (books-standing, counsel, crossings,
  burial family, attribution, join receipts) ride their kinds' flags — build
  freely, dark. LIT-KIND upgrades (coup 2-template inventory, faction verb
  table, investiture) are J-INT-13 OWNER-GATED: they proceed ONLY against a
  ruling recorded in FABLE_VALIDATION_QUEUE.md BEFORE the wave starts (open
  question Q3 — the recommended default is the DARK prose-version-flag arm so
  the wave is never blocked).
- **The two cures + the habitat (one commit, J-INT-9):** deploymentReturn.js:471
  drops the pHold/roll interpolation for pool prose (dice stay in metadata);
  relationshipMemory.js:300-302 banded phrase tables replace toFixed(2); AND
  proseNumericsWalk.js extends to follow push-target arrays out of prose-named
  functions, with the guard-the-guard fixture proving the extended walker
  CATCHES the planted pre-fix postureReasons pattern. Both ratchet baselines
  DELETE their rows and shrink (L8's follow-the-debt-down; the volume's §1a-4).
- **Pins:** attribution margin negative (sub-margin ⇒ generic prose, both the
  rally and payoff shapes); pool determinism (same seed ⇒ same sentence,
  per-entity keys `int8.<kind>.<entityId>`, draw-accounted); walker
  guard-the-guard; ratchet down-only assertions; id-carry on every new push
  site; every kind completes the L6 five-joins with its OWN walker file; the
  dossier/Herald round-trip (every sentence's id walks back to its ledger row).
- **Req 13:** engagement — facet-colored variants. Req 14: THE ONE REAL
  EDIT-VERB STORY of the program: pool prose lands ONLY on machine-owned
  receipt surfaces; DM-editable fields (hooks, dossier free text) are never
  written by INT-8 — the walker asserting the write-target set discharges it.
- **Collisions:** deploymentReturn.js (war family, 507 lines); the prose
  ratchet baselines are SHARED surfaces (receipt-vacuity/shared-ratchet laws —
  re-measure at the publishing commit, per-file claims never inherited).

**Build order:** INT-1 → INT-2 → INT-3a (→ INT-3b when Q1 unblocks) → INT-4 →
INT-5 (parallel with INT-4 by path — the only sanctioned parallelism) → INT-6
(slice 1 then 2) → INT-7 → INT-8. The lighting order is §3 of the volume,
unchanged; nothing here lights a flag, runs a soak, or ratifies a band.

---

## §5 SEAM CONTRACTS (the TR-5 pattern: pinned from BOTH sides, with a tripwire)

**Seams this program must HONOR (already pinned or landed by others):**
1. **WR-10 → books (LIVE consumer):** sovereigntyIntent.js already reads
   warSeatBooks — INT-1's consumer census counts it from day one; its pins are
   war-owned, do not touch.
2. **warConvergenceContract:** WAR_TERMINATION_DECIDING_TERM_KEYS imports into
   warTermination — INT-1's receipt work must not alter the deciding-term key
   set (the contract is pinned both ways; navigate by symbol, the file's line
   numbers have rotted before — `sovereigntyTradeEnabled` is at :283 per the
   WR-10 memory, not :54).
3. **catalogGrewSinceWr10 (the pattern exemplar):** sovereigntyBundle.js +
   tests/domain/sovereigntyBundleWr10.test.js — the tripwire INT-1's consumer
   census copies in shape.
4. **memoryWeaveEnabled composition (R7):** INT-3/5/6 sit on weave-gated
   consumers; each wave's dormancy proof covers the weave-dark arm explicitly.
5. **WR-5's landed interior halves:** warPoliticalLoop's deposit shape,
   inheritedDemand's override-the-books contract, applyWarPeaceRefusal's price
   — INT-3 extends by SIBLING, never edits the war rows' type or shape.

**Seams this program must PRE-PIN toward unbuilt neighbors (each: one line in
the neighbor's spec + a tripwire pin on this side):**
6. **TR-7 venture appetite (RESERVED — volume cohesion pass):** TRADE reserved
   `booksOf` behind `seatBooksEnabled` AND `venturesEnabled` with the receipt
   clause. INT-1 pins its side: the consumer census names TR-7 as a DECLARED
   FUTURE consumer; the tripwire reds when a trade module imports the books
   without its CW-0 registry row.
7. **POP-5b permit posture (RESERVED):** same form, same tripwire.
8. **FAITH stance choices (OPEN DEFERRAL — the one unreserved seam):** INT-1
   pins the ABSENCE (no faith-family module imports the books; census-asserted)
   — the pin's red IS the lift signal, per §3's rule in the volume.
9. **SP-4b posture formula:** the books term is ABSENT-not-zero until
   `seatBooksEnabled` lights; the spine owns the degraded-arm sentence — INT-1
   lands the cycle-absence import pin NOW (no postureOf import) so the seam is
   pinned from this side before SP-4 exists; if SP-4 lands without the
   degraded-arm sentence, STOP-and-report.
10. **GRAMMAR oath-holder identity (J-INT-10):** INT-3's heir clause ships
    dormant at settlement grain; the pin asserts the clause's dormancy AND its
    activation shape, so GRAMMAR's landing lights it without an interior edit.
11. **FP-INFO seat_held restoration (S19's drift):** INT-3 declares the
    succession trigger it would consume and ships the consumption dormant;
    STOP-and-report if tempted to write credibility state from an interior
    module (INFO owns the writer).
12. **CW-0 registry (LIVE — couplingRegistry.js, schema v2):** every INT wave
    landing a cross-layer read adds its row IN THE SAME COMMIT; the walker
    already reds a read with no row. The interior's §6 rows map onto CPL-6,
    CPL-11, CPL-15, CPL-18, CPL-20, CPL-21 — WR-5 has already claimed four
    CPL-6/CPL-21 rows; INT rows are NEW rows on the same pairs (schema v2
    permits multiple independently-owned reads per directional pair — measured
    in the registry header).

---

## §6 OPEN CHAIR QUESTIONS (max 4, each with recommendation)

**Q1 — INT-3b's errand host.** SP-1's generic errand kernel is absent; WR-7's
envoy family exists with the closed war vocabulary
(`ENVOY_PURPOSES ['sue','self_parlay']`). Build INT-3b on a widened envoy
vocabulary, or hold for SP-1? **Recommendation: HOLD.** The envoy purposes are a
foreign program's closed, walker-asserted vocabulary; widening it from the
interior is exactly the cross-program write the estate forbids. INT-3b stays
blocked-and-recorded until SP-1 lands or the chair commissions the
envoy-kernel generalization as an explicit SPINE wave (which WR-7's machinery
would make cheap — legs, snapshot, interception, K.7 window all exist).

**Q2 — Decision-grievance typing.** Adopt sibling incident types per decision
kind alongside the landed `war_decision`, or migrate to one unified `decision`
type with a kind field? **Recommendation: SIBLING TYPES.** The landed rows are
persisted state under THE PROMISE; a re-type is a shape migration purchasing
nothing but tidiness. The classifier (`woundFamilyOf`-style totality walker
over decision types) gives the unified view read-side.

**Q3 — J-INT-13's ruling, requested NOW.** INT-8's lit-kind pool upgrades need
a recorded ruling BEFORE the wave starts. **Recommendation: pre-record the DARK
arm** (lit-kind pools ship behind a prose-version flag, light with the batch,
every existing golden byte-identical) as the standing ruling in
FABLE_VALIDATION_QUEUE.md, so INT-8 is never blocked; the owner may later
upgrade to the re-record arm with the field-level diff quoted per WR-0b.

**Q4 — Flag certification cohort.** The §2 JUDGMENT places the six INT flags in
ENGINE_GATED_VIRTUAL_RULE_KEYS + a new `subsystemRowsInterior.js` lane (WW-A
precedent: manifest + row in the same commit as the first real gate read). The
alternative is the war pattern (lane rows only, no manifest membership — the
five WR flags are NOT manifest members today). **Recommendation: the §2
JUDGMENT stands** — the manifest is the estate's virtual-flag registry and the
war flags' absence reads as pre-WW-A history, not doctrine; but the two
patterns genuinely coexist in the tree, so this is the chair's call to make
uniform.

---

## §7 COMPILATION NOTES
- Every line number above was measured 2026-08-04 at e564e135 and WILL rot;
  build-time navigation is by symbol (the hand-keyed line-address hazard has
  bitten this estate).
- The volume's §5 wave prose remains the design authority for mechanism detail
  (forces, archetypes, band semantics); this document is the implementation
  compilation — where the two disagree on SUBSTRATE, this document's §1
  measurements win until re-measured; where they disagree on DESIGN, the volume
  wins and the disagreement is a bug to report.
- Three read-only surveys' receipts (volume §2) covered engine substrate only;
  every dossier panel not quoted here with a component file:line stays
  VERIFY-AT-BUILD.
- No file outside the scratchpad was written by this compilation; no test, npm,
  or vitest command was run (build wave in progress on the tree).
