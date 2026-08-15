# WF-ARCHITECTURE — THE FAITH PROGRAM, COMPILED FOR BUILD

## Program architect layer, 2026-08-04, compiled in the war-volume idiom against
## the LIVE tree (claude/composite-r4 @ e564e135, minifold worktree). BOUND BY:
## DESIGN_FP_SPINE.md (constitution; 12 core requirements + chair amendments 13/14)
## → DESIGN_FP_FAITH.md (the volume this compiles; its §6 judgment blocks stand)
## → DESIGN_WAR_RULINGS_ARCHITECTURE.md §1/§10 (inherited laws + protocol, verbatim)
## → the WR-era laws L1–L9 (each proven by execution; bound per wave below).
## Where this document and the faith volume disagree on a SUBSTRATE FACT, this
## document's executed receipt wins (live code outranks the volume's 2026-08-02
## census — its own rule). Where they disagree on DESIGN, the volume wins and the
## disagreement is a bug to report. Every judgment below is labeled JUDGMENT
## (vetoable). Nothing here is scheduled; every wave ships DARK.

**Build placement:** FAITH is FP program 5 of 6 (SP → GRAMMAR → INFO → TRADE →
FAITH → POP → INTERIOR → COUPLINGS). Nothing in this program lights a flag, runs a
soak, or ratifies a band — owner-held. The implementer protocol of the war volume
§10 binds verbatim, plus the faith addenda (DESIGN_FP_FAITH.md §10), plus the
measured deltas in §1 below.

---

## §1 SUBSTRATE CLAIMS — every existing-code premise, re-measured 2026-08-04

Method: multi-spelling greps + reads against the live tree; receipts are
file:symbol (line numbers current at e564e135 — navigate by SYMBOL, the
hand-keyed-line-address-rot law). The tree moved materially since the volume's
census: the war program landed WR-7 (all slices), WR-8, WR-9 (partial), and
WR-10 dark, and two extractions relocated load-bearing catalogs. **The REFUTED
rows are the most valuable output — three would have mis-built waves.**

### 1a REFUTED / MOVED (build-blocking corrections; each cured in its wave spec)

**R1 — TERM_CATALOG no longer lives in peaceTerms.js, and the counts are stale.**
The volume cites "TERM_CATALOG (peaceTerms.js:164-188), eleven TERMS across SEVEN
families." Executed: the catalog was EXTRACTED to
`src/domain/worldPulse/peaceTermsCatalog.js` (235 raw / ~80 effective lines);
peaceTerms.js:126 re-imports `TERM_FAMILIES, TERM_TYPES, termLabel` from it. At
HEAD the catalog holds **TWELVE terms across EIGHT families** —
`sovereignty_transfer` (family `sovereignty_transfer`, peaceTermsCatalog.js:185)
landed with WR-10 — and `TERM_FAMILIES` is **DERIVED** from the catalog at
peaceTermsCatalog.js:192 (`[...new Set(TERM_TYPES.map(t => catalog[t].family))]`).
Consequences compiled into WF-6: (i) GR-3's faith rows land in
peaceTermsCatalog.js, NOT peaceTerms.js; (ii) every WF-6 sizing pin derives its
family census from the live `TERM_FAMILIES`, never a hand count; (iii) landing
faith families MECHANICALLY grows `TERM_FAMILIES` and trips the WR-10 tripwire
`catalogGrewSinceWr10()` (sovereigntyBundle.js:166) — see §5 seam 1.

**R2 — "the Schism realm arc EXISTS (realmEvents.js:104)" is FALSE at HEAD.**
Executed enumeration of `COMPOUND_SIGNATURES` (realmEvents.js:24-~90): exactly
five keys — `gods_abandonment` (:26), `the_wasting` (:37), `starving_city`
(:47), `calling_of_debts` (:57), `shadow_court` (:67). Tree-wide grep for a
realm-scale schism arc (`schism` over realmEvents.js, pantheon.js,
src/domain/realm/): zero hits. realmEvents.js:104 is now the WAR_SHAPED_TYPES
belligerent-counting block (a war-lane addition postdating the census). The only
"schism" in the tree is the SETTLEMENT contest (resolvePatronContest,
religionState.js:371/:436 — verified). **WF-8's realm-arc battery therefore
mints FIVE arcs, not four** (Schism joins Great Pilgrimage / Persecution /
Awakening / Reformation as NEW WORK), each with its own reachability pin and
WF-9 occurrence envelope. Per J-WR-13's standing STOP rule (imported by the
faith volume's protocol), this correction is REPORTED here, not silently built
around.

**R3 — the war-reason taxonomy was extracted and grew to 16↔16.** The volume
cites warReasons.js for the taxonomy and `warReasons.js:804` for schism_axis.
Executed: `WAR_REASON_TYPES`/`PEACE_REASON_TYPES`/`REASON_MIRRORS` live in
`src/domain/worldPulse/warReasonTaxonomy.js` (:25-40 war, :45-60 peace — 16
entries each incl. `atrocity_answer` ↔ `atrocity_atoned`, WR-8's pair);
warReasons.js re-exports them as a compatibility surface (warReasons.js:~12-40).
`schism_axis` no longer appears in warReasons.js at all (sacredClaim.js owns the
quadrant tables — verified below). Any WF pin touching the taxonomy anchors on
warReasonTaxonomy.js by symbol.

**R4 — pulseKernel chokepoint line cites rotted.** `advanceReligionStates` is
invoked at pulseKernel.js:1183 (imported :23; the volume said :1106-1141 — the
lane-gate comment block now sits at :1138-1145); `advancePantheon` at :1556
(volume: :1662-1675); `collectFaithDeltas` at :1197. Symbols verified, addresses
dead. pulseKernel.js is FROZEN at 1580 effective (scripts/.size-baseline.json)
and receives ZERO edits ever (L1) — every WF fold mounts through the leaves
`advanceReligionStates` already calls, never a kernel edit.

**R5 — the war-side neighbors the volume treated as planned are now BUILT, and
one is closed against reuse.** Verified on disk: `envoyErrand.js` (823 raw),
`foreignGuestHold.js` (527 — WR-7b's one writer, the hold WF-2b consumes),
`negotiationPictures.js` (618 — the two-picture seam WF-6 consumes),
`sovereigntyTransfer.js` (399), `treatyOrientation.js` (178). BUT the envoy
ledger's purpose vocabulary is CLOSED and narrow: `ENVOY_PURPOSES =
['sue', 'self_parlay']` (envoyErrandVocabulary.js:119). **SP-1 (the generalized
errand ledger, `spatialLedgers.errands`, typed purpose `religious`) remains
ABSENT tree-wide** (grep: zero hits). WF-2b's movers ride SP-1 when it exists;
they must NOT be built by widening war's envoy vocabulary (that ledger's
walkers pin its closure). Hard precondition, restated in WF-2.

**R6 — the narration baseline moved; WF-8's 3× census re-baselines at build.**
Since the survey (~9 phrased tokens): `deity_war_pressure` /
`deity_peace_pressure` are phrased (settlementRumors.js:140-141 — WR-2's deity
war-pressure landed) and WR-10 landed the first faith-desk kind,
`sovereignty_sale_judged: 'faith'` (heraldRouting.js:143). The heraldRouting
faith token map now carries ~17 kinds (:132-144). WF-8's acceptance stays "≥3×
the surveyed baseline" but the census walker measures the LIVE baseline at its
own commit, never inherits 9 (L8's never-inherit-a-figure, applied to a count).

**R7 — line-rot sweep (substance verified, addresses moved; navigate by
symbol):** whole-world-soak.mjs:112 → **:131** (empty `customContent: {}`);
mutateEntities.js:832/:877 → **:820 (SET_PRIMARY_DEITY) / :864 (IMPOSE_CULT)**;
SessionMode.jsx:206 → **:205** (`isFaithEventEntry` filter); STAIN_DECAY 0.06
lives at **religionLegitimacy.js:79** (consumed :529), not religionState.js:56;
`FLIP_MARGIN`/`FLIP_TICKS` are spelled **PATRON_FLIP_MARGIN / PATRON_FLIP_TICKS**
(religionState.js:51-52); the divination token map sits at heraldRouting.js:~300;
the mediation machinery sits at peaceTerms.js:550/:782-786, not :1121-1140.
journalPages.js:345 is EXACT at HEAD (`gateFaithEvents`, src/foundry/
journalPages.js:345 — one census row that did not rot).

**R8 — an UNDECLARED seam the volume never carries: the dossier state-prose
corpus has already pre-authored the WF state shape.** Executed:
`src/data/dossierStateProse/warFaith.generated.js` holds 7 `DS-FTH-` blocks
projected from `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md`
(scripts/generate-dossier-state-prose.mjs:57), and **DS-FTH-3's title binds the
future spellings verbatim**: `worldState.religionStates[cid] {patronRef,
deities{share, standing, legitimacy, niche, tenure, suppressed, covert},
patronFalls[]}` × `templeWealth` (warFaith.generated.js:2586), plus "falls,
rank, wealth and season". The content program (Lane P, closed) wrote prose for
state WF-1/WF-5/WF-7 have not yet built. Consequence: the §3 canonical model's
spellings are BOUND to this corpus (they already agree); any WF wave that would
diverge is a STOP-and-report, and any wave that amends a DS-FTH row re-runs
`npm run gen:dossier-prose` in the same commit (Lane P's standing law). §5 seam 7.

### 1b VERIFIED (the physical layer; receipts current at e564e135)

| # | Claim (volume) | Live receipt | Status |
|---|---|---|---|
| V1 | Two-lane gate: LOCAL on deity presence, SPREAD behind faithSpreadEnabled w/ legacy alias | religiousContest.js:17-36 (header law) + :536-542 (`isSubsystemActive(snapshot,'religion')` short-circuit, spread gate inside); isSubsystemActive at subsystemActivation.js:68 | VERIFIED |
| V2 | faithSpreadEnabled default-false + religionDynamicsEnabled lockstep alias | simulationRules.js:76-83 (defaults), :363-367 (preset lockstep note). NOTE: a REAL default-false key, NOT virtual — the WF flags do not copy its shape (§2) | VERIFIED |
| V3 | PATRON_HOLD 0.35 (+ decay 0.02, hold not perpetual), flip margin 6 × 3 ticks | religionState.js:49-52, :298-301, :382-384 | VERIFIED (names per R7) |
| V4 | pruneSuppressed keeps ≤3, deletes in codepoint order, no timestamp on suppressed entries | religionState.js:353-357 (`KEEP = 3`, `sort(codepoint)`); suppression transitions religionState.js:262/:277 write `{suppressed:true, share:0}` with NO tick stamp | VERIFIED — WF-1's suppressedAtTick is genuinely new |
| V5 | SINK_MAX 45; revival 0.06 outpaces drift 0.02 | religionState.js:77, :78-79 (SINK_SECULAR_RATE 0.02 / SINK_REVIVAL_RATE 0.06) | VERIFIED |
| V6 | Legitimacy weights 0.42/0.20/0.30/0.08; institution slot W_INSTITUTION 0.12; stain decay 0.06 | religionLegitimacy.js:85, :92, :79, :484-489 | VERIFIED |
| V7 | Piety lag 0.06, DRIFT_ASYMMETRY 2, W_INSTITUTION 0.35 | piety.js:61, :70, :44, :257-270 | VERIFIED |
| V8 | One conversion vehicle (religious_conversion_fracture), MIN_CARRIER 0.15, warbound ×1.35, CONTEST_LEGIT_W 0.78 | religiousContest.js:383-432, :89, :119 (WARBOUND_CONVERSION_MULT), religionState.js:58/:396 | VERIFIED |
| V9 | SLOTS_BY_TIER thorp 1 → metropolis 7 | cultImpositionApply.js:42 (+ :46 default 2) | VERIFIED |
| V10 | Axes: temper derived W_EVIL 0.7 / W_CHAOS 0.3, dead-band 0.15; rank → authority 18/10/5 | deityAxes.js:61-63/:78-79; deityConstants.js:29 (DEITY_RANK_AUTHORITY) | VERIFIED |
| V11 | Deity minting custom-content only, refs `deity:<scope>:<slug>`; latentPantheon legacy-save reader only | customRegistry.js:133-141 (mintDeityRef); mutateEntities.js:820/:864; latentPantheon.js:6-13 (legacy-only seam comment) | VERIFIED |
| V12 | Stance: aggression + treatyDurability UNCONSUMED, owner-gated W-F4 resurrection, G1c ledger | deityStance.js:160-174 (the deferral comment, verbatim); STANCE_TUNING :53-73 | VERIFIED — WF-3's premise holds |
| V13 | Stance lanes: cooldowns 8/6/6, realm caps per tick, pact/foothold news-only, named minister recruit | deityStanceLane.js:52 (BETRAYAL 8), :58 (PACT 6), :59 (FOOTHOLD 6), :17-18 (realm cap), pactOutcome :238-246 | VERIFIED |
| V14 | sacred_claim quadrant table (0.75/0.60; rite 0.80/0.45), both-patrons guard load-bearing, flag+patrons dual gate | sacredClaim.js:39-49 (guards), :67-84 (CLAIM_BY_QUADRANT / RITE_BY_QUADRANT) | VERIFIED |
| V15 | Amendment-C dissolution keyed on patron-anchor change; anchor_unavailable legacy arm; warTerminationEnabled BUILT and read | warTermination.js:225-259 (sacredAnchors mint via patronRefOf), :320-345 (re-read + `anchor_unavailable`); flag read applyWorldPulse.js:536 | VERIFIED — WF-1's join surface is live |
| V16 | Realm pantheon: seats/tier lazy view, dwell + hysteresis, no deletion path, Ascendancy/Twilight | pantheon.js:8-57 (MINOR_PROMOTE 2 / MAJOR_PROMOTE 4 / MAJOR_DEMOTE 2); zero `delete` statements in pantheon.js; realmEvents.js:270-294 (tier-change beats) | VERIFIED (J-WF-1's ground) |
| V17 | Church agency: CHURCH_OBJECTIVE missionize/legitimacy levers; temple_authority prize; tithe_rights token; clergy roles; deityWriteGate fail-closed | scoringObjective.js:86-96; factionCompetition.js:29/:62/:74; npcAgency.js:42-46; settlementDeityHelpers.js:~96-112 | VERIFIED |
| V18 | Divine mandate → publicLegitimacy, theocracy 1.0 / royal 0.45 | religionState.js:~557-575 (MANDATE_GOV_WEIGHT, MANDATE_RANGE 30, MANDATE_PULL 0.15, MANDATE_STEP 2) | VERIFIED |
| V19 | beliefMap faithLabel + observanceLabel (stale rite beliefs) | beliefAxes.js:8-18 | VERIFIED |
| V20 | Herald: 'faith' + 'divination' sections; divination = forecast-shaped, structural | heraldRouting.js:64 (HERALD_SECTIONS), :132-144 (faith tokens), :~300 (pressure tokens → divination), :26-38 (structural doctrine) | VERIFIED (WF-4's routing split stands) |
| V21 | FaithSection ACTIVE/TEASER/HIDDEN; shared premium pantheon renders read-only to any viewer | FaithSection.jsx:11-24; faithPanelModel.js | VERIFIED |
| V22 | FAITH_EVENT_TYPES filters DM EVENT-LOG entry types only (['SET_PRIMARY_DEITY','IMPOSE_CULT']); cannot see news kinds | faithEventFilter.js:28-33; consumers journalPages.js:345 + SessionMode.jsx:205 | VERIFIED (the §3c corrected premium map holds) |
| V23 | D.0 LOCKED: premium by pulse inheritance; client-only fail-open accepted; composer-lane UI-only gate residual | GEOPOLITICAL_WAR_LAYER.md:335-341; settlementDeityHelpers.js:49-57 (the R-4 deferral comment) | VERIFIED |
| V24 | pilgrimage.js: deity-agnostic draw (scaleBand + act only), aspatial ⇒ 0, bounded [0, 0.1] lift, who-from-where discarded | pilgrimage.js:31-38 (dials incl. PILGRIM_MAX 0.1, GRAND_SCALE_MIN 3, PILGRIM_ACTS {procession, offering, fair}), :59-62 (drawsPilgrims), :82 (aspatial guard), header :1-22 (returns only the host lift) | VERIFIED — WF-2a's co-location gate is genuinely new work |
| V25 | Institution rows creed-agnostic presence records; backing lends to the SEAT; no congregation concept | religionLegitimacy.js:175-185 (INSTITUTION_SCALE, "creed-agnostic", STANDING_BACKING); foundingCatalog.js:36-55 (FoundingEntry shape — no creed field); `grep congregation` over worldPulse/institutions: zero | VERIFIED — WF-5a's creedRef + creed-aware backing are new, and the anti-entrenchment hazard is real |
| V26 | clandestineFacet criminal-only, zero faith references | clandestineFacet.js — grep faith/deity/religio: 0 hits in 53 lines | VERIFIED |
| V27 | The only "tithe" is the granary reserve; tithe_rights is a prize token; no temple wealth anywhere | foodStockpile.js:12-21; factionCompetition.js:74; grep templeWealth in src/domain: 0 (only the DS-FTH-3 prose title, R8) | VERIFIED |
| V28 | gods_abandonment = coincidence recognition (three co-present stressors), not a reading | realmEvents.js:26-35 (types: famine, disease_outbreak, religious_conversion_fracture) | VERIFIED |
| V29 | Five dedicated religion soaks; release corpus deity-free; certification names the missing observation + bearer census | scripts/audit/religion-{balance,coup-soak,plane-soak,soak}.mjs; subsystemRowsBaseline.js:38-60 (FAITH_SPREAD_OTHER verdict UNOBSERVED, names the needed soak case + "v5 subsystems.stateKeys census"); whole-world-soak.mjs:131 | VERIFIED — WF-0's premise exact |
| V30 | D3 crown-commitment amplifier deliberately deferred, owner-gated | religiousContest.js:773-781 (the seam comment, verbatim) | VERIFIED (J-WF-14 stands) |
| V31 | Temple mediation narrow + scalar; faithTerm temple 0.4; mediator machinery reads faith proximity | generosityEV.js:243-253 (faithTerm); peaceTerms.js:115 (imports faithProximityOf from sacredClaim), :550/:782-786 (mediator) | VERIFIED |
| V32 | Per-term compliance union {honored, strained, defaulted, expired} + trueState fog twin — owned by peaceTerms family, cited never re-minted | peaceTermsCatalog.js:122-123 | VERIFIED (WF-6's vocabulary correction holds) |
| V33 | ROUTE_FLOW_SOURCES frozen one-line table; countCrossings | routeNetworkFlows.js:82 (+ the class-attribution doctrine :15-25); entrepots.js:245 | VERIFIED (the WF-2a road-town deferral's substrate) |
| V34 | INTERVAL_WEEKS canonical home | intervalWeeks.js:7 (NOTE: foodStockpile.js:66 and populationDynamics.js:18 carry LOCAL frozen copies — WF clocks import the canonical leaf, never mint a fourth copy) | VERIFIED |
| V35 | hash01 keyed-hash idiom home | contestMath.js:45 (src/domain/region) | VERIFIED (L1's tool exists) |
| V36 | ENGINE_GATED_VIRTUAL_RULE_KEYS + one-key-delta walker | simulationRules.js:185-194 (five keys: beliefAxes, conquestDoctrine, infoStatecraft, migrationRumors, sovereigntyTrade); tests/lint/engineGatedRuleKeys.walker.test.js; certification consumers subsystemCertification.js + subsystemRowsVirtual.js | VERIFIED — see §2 for the nuance |
| V37 | Herald totality walkers + WHAT_PHRASES home | settlementRumors.js (WHAT_PHRASES; faith tokens :263-267); tests/lint/{heraldRouting.walker,phrasedKindPools.walker,wizardNewsAuthoring.walker}.test.js | VERIFIED |
| V38 | mutationCoverageManifest exists (L7's register) | tests/lint/mutationCoverageManifest.test.js + mutationCoverage.shared.mjs | VERIFIED |
| V39 | Size law: domain ceiling 800 effective; over-ceiling files frozen in a shrink-only JSON map | eslint.config.js:42-52 + :537-560; scripts/.size-baseline.json; tests/lint/sizeBaseline.test.js | VERIFIED — figures in §4's per-wave rows |
| V40 | SP substrate ABSENT: no spatialLedgers.errands (SP-1), no postureOf/pacing governor/significance registry (SP-4/SP-6), no peacetime formation (SP-3), no believed-devotion family (SP-2) | tree-wide greps, zero hits each; alignmentOf (spine req 13) DOES exist: beliefMap.js:915, informationStatecraft.js:584 | VERIFIED — FAITH builds after SP by construction, and every SP-consuming line below is precondition-marked |
| V41 | Spine reqs 13/14 exist as chair amendments with receipts | DESIGN_FP_SPINE.md:76-107 | VERIFIED |
| V42 | Name-collision hazard, new: `riskToleranceOf` is ALREADY an export of src/domain/roads/state.js:319 (npc-scoped, roads lane) | grep | VERIFIED — SP-4a's temple-appetite read must take a distinct name or namespace; a faith wave importing the roads symbol would typecheck and be silently wrong (§5 seam 4, §6 Q2) |

**Tally: 42 verified (7 with line-rot noted in R7), 8 refuted/moved/undeclared
(R1–R8).** Standing rule imported from J-WR-13: any implementer finding another
census overstatement STOPS and reports before correcting or building on it.

---

## §2 THE FLAG FAMILY (eight flags; law-2 shape; manifest timing)

The eight flags and their lanes are the volume's §3, unchanged: 

| Flag | Lane (ANDs with) | Wave | First real gate read (manifest-timing commit) |
|---|---|---|---|
| `faithUnseatingEnabled` | LOCAL (deity presence) | WF-1 | the fall-classification fork in the WF-1 leaf, consumed at advanceReligionStates' fold |
| `pilgrimageEnabled` | SPREAD + SP-1 lit | WF-2a | pilgrimSeason.js's subsumption switch |
| `faithStanceConsequencesEnabled` | SPREAD | WF-3 | the aggression-threshold read in the WF-3 leaf |
| `omenReadsEnabled` | LOCAL | WF-4 | omenReading.js's qualifying-calamity gate |
| `faithSchismEnabled` | LOCAL (+ covert seam arm) | WF-5a | the split-condition gate in the WF-5 leaf |
| `faithTermsEnabled` | SPREAD + SP-3 lit + GR-3 rows landed | WF-6 | the formation-trigger gate in the WF-6 executor leaf |
| `titheEnabled` | LOCAL | WF-7 | tithe.js's quarterly-fold gate |
| `faithNarrationEnabled` | LOCAL; lights LAST | WF-8 | the voice-fork at the first silent-transition receipt site |

**Law-2 shape (all eight):** VIRTUAL — absent from DEFAULT_SIMULATION_RULES;
read `worldState.simulationRules.<flag> === true` (strict, dark-never-permissive
— the live war idiom, e.g. disposition.js:248, applyWorldPulse.js:536); never
normalized into a preset by default. **They do NOT copy `faithSpreadEnabled`'s
shape** — that is a REAL default-false key with a legacy alias (V2);
`religionDynamicsEnabled` gains NO new consumers (volume law, re-affirmed).

**Manifest timing (the measured nuance):** each flag joins
`ENGINE_GATED_VIRTUAL_RULE_KEYS` (simulationRules.js:185) **in the SAME commit
as its first real gate read**, with tests/lint/engineGatedRuleKeys.walker.test.js
asserting exactly that one-key delta and the certification row shell landing
through subsystemRowsVirtual.js in the same commit. Measured: the registry is
NOT a historical totality (warTerminationEnabled etc. predate it and are
absent); the WW-A / sovereigntyTradeEnabled row (2026-08-04) is the current-law
precedent WF follows — certification tracks reality, never precedes it.
JUDGMENT: WF-0 registers NO flag (it mints none — J-WF-12's receipt-field
ruling); the eight rows land one per wave, never batched.

**The four-fence dormancy set, per flag (L2, executed per wave):**
1. OWN-FOOTPRINT GOLDEN — a deity-BEARING fixture world advanced dark is
   byte-identical (captured BEFORE wiring, the J1 precedent). The deity-free
   corpus golden is NOT this fence (it is vacuous for faith by §1d's №1 hazard);
   both are carried.
2. ABSENT-vs-FALSE differential — `{}` vs `{<flag>: false}` byte-identical.
3. CALL-PATH SPY — the leaf's evaluator is provably not invoked dark (spy or
   counter at the one apply chokepoint).
4. GATE-POLARITY CENSUS — source scan: every read of the flag token is a strict
   `=== true` conjunct; count asserted non-zero (non-vacuity) and shrink-only.
Plus the LIT-MUTANT CONTROL: a fixture with the flag lit must move at least one
fenced byte — proving the fences can see (differential alone is blind by
design). Conjunction-gate hole guard: at least one BY-NAME read per flag (no
flag read only through a frozen-list `.every()`).

**Lane enforcement:** SPREAD-lane flags AND with `isFaithSpreadEnabled(rules)`
exactly as religiousContest.js:536-542 does; a SPREAD WF flag lit while spread
is dark is an invalid config WF-9's certification walker reds (rowed at WF-9).
LOCAL-lane flags additionally sit behind `isSubsystemActive(snapshot,
'religion')` by construction (the outer data gate, V1) — the deity-free world
is byte-identical even lit, asserted on rendered projections (§3c of the
volume, verified via V22/V23).

---

## §3 CANONICAL MODEL — zero new top-level keys (the fight, won)

No new `worldState.*` top-level key anywhere in the program. Six persisted
additions, all conditional (drop-when-absent — absent, never null; an empty
array is a key and a key is a byte), each with exactly ONE writer, every
spelling ALREADY BOUND by the DS-FTH corpus where it names them (R8):

```
worldState.religionStates[cid]          EXISTS (one writer: the advanceReligionStates
                                        fold, pulseKernel.js:1183 call site — V/R4)
  .patronFalls[]                        WF-1  { ref, cause, atTick } ring, cause in the
                                              closed five-token vocabulary (J-WF-5);
                                              capped <= 3 (the pruneSuppressed idiom)
  .deities[ref].suppressedAtTick        WF-1  stamped by the two existing suppression
                                              transitions (religionState.js:262/:277)
                                              when lit; absent => legacy codepoint prune
  .deities[ref].covert                  WF-5b { share(band), sinceTick, shepherdRef? }
                                              (J-WF-4: in place, never a parallel ledger)
  .templeWealth                         WF-7  { band, movedTick } — banded stock, not
                                              books (J-WF-3); PER-SETTLEMENT (J-WF-15)
settlement.institutions[] rows
  .creedRef                             WF-5a minted ONLY by the split's reduced-ceremony
                                              founding call; absent => creed-agnostic,
                                              today's semantics byte-identical
worldState.spatialLedgers.omenReadings  WF-4  the ONE new sub-ledger (writer
                                              omenReading.js), the warReasons
                                              conditional-materialization idiom
                                              (spatialLedgers family carries the name,
                                              zero eager bytes)
```

Everything else in the program is receipts or derived reads: the pilgrim season
(pure evaluator, never stored), faith terms (the treaty artifact's own
serialization — peaceTerms family owns it), legate/pilgrim errands (SP-1's
ledger under SP-1's lifecycle, when built), fall/split/exposure receipts
(receipt-only).

**Lifecycle-paths clause (L4, per addition — lands BEFORE each writer builds):**
- **CREATE:** each field materializes only at its own transition through its one
  writer (patronFalls at a classified fall; suppressedAtTick at the suppression
  write; covert at the suppression/imposed-flip fraction; templeWealth at the
  first non-zero quarterly fold; creedRef at the split founding; omenReadings at
  a qualifying calamity on a deity-bearing settlement). No load-time
  normalizer exists for religionStates or spatialLedgers sub-ledgers — shape
  discipline is pinned AT the writer (the occupations precedent, war §5 WR-10).
- **READ:** consumers read through the leaves' published reads only; the
  dossier prose reader (DS-FTH-3) and FaithSection model read the same
  spellings — the corpus is the reader-side contract (R8).
- **PERSIST:** all six ride existing serialization homes (religionStates,
  settlement.institutions, spatialLedgers). JSON-round-trip pinned per shape,
  both arms (with/without the conditional field). The JSON-alias trap applies to
  shepherdRef/clergy (factions[].members[] ARE npcs[] — fixtures round-trip).
- **REGENERATE (THE PROMISE):** all folds are keyed hash01
  (`wf.<facet>.<realmId>.<cid>...`, codepoint-ordered enumeration; zero new PRNG
  streams dark AND lit) so same-seed replay is byte-identical and the kernel's
  existing fork order never moves. Falls/readings are HISTORY: regen that
  rebuilds religionStates preserves rings with the entry; a full regen that
  drops religionStates drops them with it, by design (declared). creedRef rides
  the roster's regen path; a single-settlement regen preserves institutions.
- **UNDO:** the pulse undo ring restores preWorldState wholesale; every touched
  home rides it (the WR-10 precedent clause, verified in its §5 declaration).
- **MIGRATE/IMPORT:** import validates closed vocabularies (fall causes, reading
  kinds, band words) and clamps covert share/wealth band; a dangling creedRef or
  shepherdRef heals to ABSENT through the one writer with a receipt, never a
  crash; account import starts a fresh campaign world (ledgers do not cross —
  standing law).
- **VEIL:** no new public payload builder; every new projection rides
  includeCovert/includeGroundTruth (covert = DM-truth, double-gated); Herald
  kinds ride the governed projector; actor-id keys spread only when non-empty
  (T4 byte-neutrality).

**What is deliberately NOT modeled** (volume §4, re-affirmed with receipts): no
realm unseating (V16), no faith-edge ledger (J-WR-11's duplicate), no temple
books (J-WF-3), no per-head pilgrims, no separate covert ledger, no new
relationship vocabulary, no edits to pulseKernel/applyWorldPulse/momentum
(frozen — V39/R4).

---

## §4 THE WAVES (dependency order; one commit each, WF-2/WF-5 two slices; every
## wave DARK; every fixture deity-bearing through SET_PRIMARY_DEITY/IMPOSE_CULT
## (mutateEntities.js:820/:864), never config poking)

Common per-wave obligations (stated once, discharged per wave): the four-fence
set + lit-mutant (§2); an executed mutant per load-bearing conjunction (cp
backup, cmp/md5-exact restore, NEVER checkout-family) + a
mutationCoverageManifest entry (V38); `// anchored:` on new negative
assertions; generation-tree tests use tests/helpers/{anchoredNegatives,
seedFailures}.js; every doc-reading pin asserts EXACTLY-ONCE on its target;
receipts GAME-GRADE (one band per clause, comparisons in words, no floats —
runtime no-decimal pins on composed output); pathspec commits; python3
byte-scan on every authored file; new kinds register in WHAT_PHRASES +
heraldRouting with their OWN walker rows (V37) and carry id + full address
chain + typed action + settlements by name + reason (L6).

### WF-0 — THE OBSERVATION FLOOR (no flag; instrument-side)
- **Files touched (measured eff/ceiling):** subsystemRowsBaseline.js (469 raw;
  certification layer) — the two faith rows (:38-60 area) gain the bearer-count
  invariant; the v5 receipt schema gains `deityBearers`; ONE authored
  deity-bearing soak case beside whole-world-soak.mjs:131's grid (spatial canon
  + two opposed-quadrant deities + a qualifying grand observance scaleBand ≥ 3
  with act ∈ {procession, offering, fair} at the patron host + ≥1 mapped
  reachable neighbour — pilgrimage.js:31-38's own bar, V24).
- **New leaves:** none (fixture + receipt fields).
- **Pins:** bearer field correct on the bearing fixture; ZERO on the deity-free
  corpus (non-vacuous — both arms); doctrine pin (deities round-trip the
  custom-content path); the WF-2 precondition pins (observance qualifies by
  drawsPilgrims' live bar). Never derived from wizard_news.* ids (moverFamily
  skew law).
- **Mutants:** flip the bearer predicate to count cult embeds only → the pin
  must red (manifest row).
- **Dormancy:** no flag, no world state — receipts only (J-WF-12); dormancy
  proof is the deity-free corpus's byte-identical receipts minus the new field.
- **Req 13:** alignment-empty WITH REASON (a count instrument reads no axes).
  **Req 14:** no player/DM-visible state minted — recorded "engine-only,
  instrument" per the spine's own escape, with the certification-surface render
  pin as the dossier landing (volume WF-0's corrected clause).
- **Collisions:** none vs war; vs FP: the soak case feeds every later WF-9
  envelope — spelling of the case id is program-owned.

### WF-1 — THE UNSEATING (`faithUnseatingEnabled`; LOCAL)
- **Files (measured):** religionState.js 356 eff/800 (~440 headroom — the
  suppressedAtTick stamps at :262/:277 and the prune's flag-forked narrative
  sort key at :353-357 are small in-place edits, legal); NEW leaf
  `patronFall.js` (classification + ring writer helper consumed by the fold;
  budget ≤ 200 eff); warTermination.js **FROZEN 818** — the
  dissolution-names-the-fall join lands as a PURE READ (the receipt site calls
  the WF-1 leaf's `fallCauseFor(religionStates, ref)`) at NET-ZERO effective
  lines in warTermination.js, or the wave STOPS and proposes the extraction
  recipe (L8) — no silent growth against a frozen ceiling.
- **Mechanism deltas from the volume:** none — five closed causes; the
  settlement-scoped obituary fires only at the ≥4-suppressed prune bar with
  narrative (longest-dormant) selection when lit, codepoint when dark
  (flag-forked, dormancy golden covers the fork; V4 verified the substrate);
  realm last-seat beat joins the tier-change beats (realmEvents.js:270-294
  site, realmEvents 283 eff/800).
- **Pins:** the volume's list stands (fall-names-its-cause walker over all five
  fire sites; pressured-patron-holds negative; last-altar narrative-key +
  never-prune-the-cellar sequencing; dissolution-names-the-fall TWO-FLAG
  fixture — `warTerminationEnabled` + `faithUnseatingEnabled`, the join surface
  verified live at warTermination.js:320-345; anchor_unavailable legacy arm gets
  NO invented cause; no-clergy office-voice fixture; dormancy golden).
- **Mutants:** cause-classifier collapse (all falls → `displaced`) must red the
  histogram pin; prune-key mutant (narrative sort reversed) must red the
  obituary pin; ring-cap mutant (uncapped) must red the ≤3 pin.
- **Dormancy:** four fences + lit mutant; dark ⇒ prune codepoint order and
  every receipt byte-identical (own-footprint golden on a deity-BEARING world).
- **Req 13:** the `imposed` cause's receipt names the garrison's act, never an
  axis judgment — alignment-empty with reason (falls are believer bookkeeping);
  the discredited fall's amplifiers ride the existing conversionOutcome
  legibility discipline. **Req 14:** patronFalls is DM-visible history —
  RECORDED decision: engine-only (history is not editable; the DM's lever is
  the existing SET_PRIMARY_DEITY verb which CREATES an `imposed` fall through
  the same classifier — the verb story is the existing verb, declared).
- **Collisions:** war family — warTermination (read-only join, net-zero);
  DS-FTH-3 corpus (spellings bound, R8); WF-5 (prune cure sequenced), WF-8
  (Reformation detector reads the ring).

### WF-2 — PILGRIMS + LEGATES (`pilgrimageEnabled`; SPREAD; two slices)
- **HARD PRECONDITION (measured):** SP-1 absent at HEAD (V40/R5). WF-2b does
  not build until `spatialLedgers.errands` exists with typed purpose
  `religious`; war's ENVOY_PURPOSES is closed ['sue','self_parlay'] and is NOT
  extended (its walkers pin closure). WF-2a (the season) has no SP-1
  dependency and may land first within the slice discipline.
- **Files (measured):** pilgrimage.js 41 eff (the subsumption seam — the scalar
  source switch is a ~5-line fork); NEW leaf `pilgrimSeason.js` (season
  composition over the existing draw math; budget ≤ 250 eff); NEW leaf
  fixtures. routeNetworkFlows.js UNTOUCHED (the `pilgrim` source row is the
  volume's declared deferral — ROUTE_FLOW_SOURCES is a frozen table, V33, and
  stays frozen this program).
- **WF-2a deltas:** the co-location gate is this wave's own composition (V24
  verified the tree has NO faith-site linkage); believed-devotion input is
  SP-2's family — until SP-2 lands, the pull's belief leg reads the beliefMap
  observanceLabel substrate (V19) with the composition seam injectable
  (`beliefLegsFor`-style, the WR-10/CR-WR10-H precedent) so SP-2 supplies legs
  without touching the leaf; declared in the wave's spec, receipted honestly.
- **WF-2b deltas:** interception rides WR-7b's foreignGuestHold.js (BUILT, 527
  raw — R5); `envoyDiplomacyEnabled` dark ⇒ the declared harassment/turn-back
  degraded arm (receipted, no hold). Never-resolve absolute.
- **Pins:** the volume's list stands (roads-fill-at-the-feast on WF-0's
  authored preconditions; the THREE-WAY split negative — no-observance /
  aspatial / unmapped-or-no-neighbour each its own seeded arm; war-on-the-road
  counterforce; K3-shape import pin on pilgrimSeason.js; dormancy — dark ⇒
  pilgrimage.js scalar byte-identical). ADD (this layer): the subsumption-seam
  disclosure pin — lit vs dark observance-success delta measured on one seed
  (J-WF-13's addendum, quantified for WF-9).
- **Mutants:** season-band saturation mutant (all bands → feast) reds the
  distribution pin; co-location gate mutant (patron requirement dropped) reds
  the three-way negative.
- **Dormancy:** four fences + lit mutant on `pilgrimageEnabled`; the traditions
  golden (pilgrimage scalar) is the own-footprint fence.
- **Req 13:** season pull is belief-side; alignment-empty with reason (roads
  and belief, not axes). **Req 14:** season is derived (no state ⇒ no verb —
  recorded); named movers' verbs are SP-1's own (DM KILL/ASSIGN semantics ride
  SP-1's registered verbs).
- **Collisions:** traditions lane (J-WF-13 disclosed shift at lighting); war
  (WR-7b consumption read-only); TRADE (CPL-12 port only when lit — §5 seam 2);
  GRAMMAR (pilgrimage_right forms only with WF-2 lit — §3 precondition, both
  docs).

### WF-3 — STANCE CONSEQUENCES (`faithStanceConsequencesEnabled`; SPREAD)
- **Files (measured):** deityStance.js 60 eff (READ-ONLY — the deferral comment
  :160-174 stays; fields stay); deityStanceLane.js 235 eff/800 (the three
  consumptions mount here or in a NEW leaf `stanceConsequences.js` ≤ 200 eff —
  JUDGMENT: leaf, keeping the lane file's betrayal machinery untouched);
  sacredClaim.js 85 eff (threshold-modifier seam, ~6 lines).
- **Deltas:** none from the volume (aggression as threshold colour never
  selector — E3; durability → SP-3's fraying clock WHEN SP-3 exists — until
  then the durability consumption builds against the pact's existing news-only
  cadence with the SP-3 hook declared-dark; over-extension fraying is the
  counterforce, off the pact ledger).
- **Pins:** volume's list stands (REVERSAL pin both directions on one fixture;
  COLOUR-NEVER-DROWN cap; G1c fence captured FIRST — dark ⇒ the two consumed
  fields and every receipt byte-identical; departed-minister lifecycle;
  guard-absoluteness regression).
- **Mutants:** cap-removal mutant reds COLOUR-NEVER-DROWN; fraying-scale zero
  mutant reds the over-extension counterforce pin.
- **Dormancy:** four fences + lit mutant; the G1c golden shift becomes a
  lighting-day disclosure (J-WF-8).
- **Req 13:** THE ONE PLACE faith reads authored truth — stances read the
  deities' authored axes (declared engagement: quadrant reads colour bars);
  consequences land on believer state only. **Req 14:** no new state (rides
  relationship/stressor homes) — no verb, recorded.
- **Collisions:** war (betrayal stressor untouched); INTERIOR (seatBooks seam
  deliberately NOT reserved — the volume's declared decision, re-affirmed);
  WF-5b (foothold seed consumed where lit — a declared degraded-dark read
  otherwise).

### WF-4 — OMEN READS (`omenReadsEnabled`; LOCAL)
- **Files (measured):** NEW leaf `omenReading.js` (ONE writer for
  spatialLedgers.omenReadings; budget ≤ 300 eff — five kinds, five opposable
  arms, the lens, the caps); religionState/piety/religionLegitimacy UNTOUCHED
  (the write moves EXISTING state through EXISTING laws at the fold);
  heraldRouting.js 246 eff (two token rows: readings → faith, open expectation
  → divination — V20's structural doctrine honored).
- **Deltas:** none from the volume (every kind carries its opposable arm on the
  SAME row; the credibility echo is a pure read off the ring — no new stock,
  SP-5 closure honored; the INFO source-credibility coupling deferred-declared).
- **Pins:** volume's list stands (two-towns-one-famine TELLABLE; secular-town
  negative non-vacuous; NO-PHYSICS byte-diff over physical ledgers with the
  import pin on omenReading.js excluding every physical-state writer — the K3
  idiom pointed inward; failed-prophecy arm seeded ONCE PER KIND; damped-lens
  echo; no-clergy office voice; cooldown/caps; dormancy).
- **Mutants:** expectation-window never-closes mutant reds the per-kind
  failed-arm pin; lens-damp zero mutant reds the echo pin; the razed-mid-
  expectation close path gets a seeded fixture (lifecycle).
- **Dormancy:** four fences + lit mutant; dark ⇒ no ledger key materializes
  (drop-when-empty asserted at the byte level).
- **Req 13:** the lens reads patron temper × quadrant (authored axes colour the
  READING, declared engagement); the write side moves constituents through
  existing writers only. **Req 14:** omenReadings is DM-visible — RECORDED:
  engine-only v1 (a reading is the pulpit's speech, not the DM's pen; the DM's
  existing event verbs already author calamities upstream). Vetoable at the
  chair per the spine's req-14 escape clause; the decision is written here.
- **Collisions:** INFO (the false-omen LURE builds THERE, consumed here —
  deferred-declared); POP (flight coupling read-only); WF-8 (voices the
  resolution beats).

### WF-5 — SCHISM + UNDERGROUND (`faithSchismEnabled`; LOCAL + covert seam; two slices)
- **Files (measured):** religionState.js 356 eff (covert field folds through
  the existing suppression/resurgence arms — in-place, small);
  religionLegitimacy.js 222 eff (the creed-aware backing fork for creedRef rows
  — the anti-entrenchment cure, V25); institutionRoster.js 10 eff +
  foundingCatalog.js 57 eff (reduced-ceremony founding call surface —
  VERIFY-AT-BUILD its exact shape); institutionTolerance.js 123 eff (read-only);
  NEW leaf `covertCongregation.js` (growth/assimilation/surfacing/exposure
  evaluators; budget ≤ 300 eff).
- **Deltas:** none from the volume. The two named clocks stand (growth
  half-life default 520w, assimilation 156w — INTERVAL_WEEKS-derived from the
  canonical leaf, V34, never a fourth local copy). The exposure seam: the
  covert/revealed discipline is faith's OWN read (clandestineFacet stays
  criminal-only — V26); VERIFY-AT-BUILD the reusable seam surface.
- **Pins:** volume's list stands, with the PREMIUM-ISOLATION pin hardest
  (covert receipts absent from every non-includeCovert projection — free,
  shared, lapsed, premium-player renders all audited); the ANTI-ENTRENCHMENT
  pin (winner's backing does NOT rise vs pre-split baseline; the loser's
  creedRef row backs the loser only); exposure-at-zero-covert unreachable
  (seeded lower-bound); backfire wins on a weak seat; assimilation empties a
  cellar in-horizon; never-resolve walker (no npc-death write in the faith
  arm); dormancy golden.
- **Mutants:** backing-fork mutant (creedRef rows back the seat) reds
  anti-entrenchment; prune-cure mutant (covert>0 entries prunable) reds the
  never-prune-the-cellar pin; covert-share leak mutant (share not banded) reds
  the finite-semantics render pin ({a handful, a score, a congregation in all
  but name} — the closed covert-size vocabulary).
- **Dormancy:** four fences + lit mutant per slice.
- **Req 13:** the purge/backfire arms read seat legitimacy and piety, never
  alignment; declared alignment-empty with reason (suppression is posture and
  legitimacy, not axes — the world's judgment of purges is WF-8's voice).
  **Req 14:** creedRef + covert are DM-visible state — the split rides the
  institution roster's EXISTING founding/abolition verb lane (the reduced-
  ceremony call is the same lane); covert is engine-only-with-reason v1 (a
  hidden congregation the DM can already extinguish via the existing
  suppression/imposition verbs; a dedicated verb is a recorded deferral).
- **Collisions:** WF-1 (prune sequencing — the cellar empties before the
  obituary); WF-3 (foothold seed feeds covert); INFO (informant exposure arm
  consumed when INFO lights); GRAMMAR (tolerance_guarantee surfacing arm —
  declared fallback if GR-3 declines the term).

### WF-6 — FAITH TERMS (`faithTermsEnabled`; SPREAD; needs SP-3 lit + GR-3 rows)
- **Files (measured):** peaceTermsCatalog.js 80 eff/800 — GR-3's five faith
  rows land HERE (R1; membership + spelling are GRAMMAR's, GR-3's minting
  site); peaceTerms.js **776 eff/800 — ~24 lines of headroom**: net-zero seam
  lines ONLY (the volume's ceiling claim, now measured); ALL executors land in
  NEW leaf siblings (`faithTermExecutors.js` or per-family leaves; budget
  ≤ 300 eff total); negotiationPictures.js (BUILT, R5) consumed never forked.
- **Deltas from the volume (compiled):** (i) the SIZING pin derives from the
  LIVE `TERM_FAMILIES` (twelve terms / eight families today + faith's rows —
  R1), and the families walker + TREATY_COMPLIANCE_VOICE family×state table
  update in GR-3's same-commit discipline; (ii) the GR-3 landing commit TRIPS
  `catalogGrewSinceWr10()` — handled per §5 seam 1, in THAT commit, by the
  landing lane; (iii) per-term compliance vocabulary is peaceTermsCatalog.js:
  122-123's own union (observed complianceState {honored, strained, defaulted,
  expired} + trueState fog twin) — cited, never re-minted.
- **Pins:** volume's list stands (the GUARD pin — sacredClaim.js:39-49's
  both-patrons gate imported verbatim as the formation gate; executor honesty —
  missionary_access moves the CHANNEL never share; breach reachability under
  tolerance_guarantee; dictated + negotiated arms both reachable; Law One
  walker over executor writes; dormancy — dark ⇒ the catalog rows are
  flag-shaped per GR-3's dormancy idiom, VERIFY-AT-BUILD against W1's
  precedent).
- **Mutants:** executor-writes-share mutant reds the no-instant-conversion pin;
  guard-drop mutant reds the mixed-fixture negative; a bundle-composition
  fixture proves a faith term composes (or is cleanly excluded) in the
  sovereignty bundle per the chair's Q3 answer (§6).
- **Dormancy:** four fences + lit mutant; the catalog extension's dormancy is
  GR-3's to fence, consumed here.
- **Req 13:** term appraisal rides need-weighted valuation (the §15.1 lens) —
  alignment engagement declared where the world judges an imposed access (the
  observer-axis voice is WF-8's). **Req 14:** terms ride the treaty artifact —
  the existing REPUDIATE_TREATY-family verb lane is the edit story (declared);
  no faith-side state to verb.
- **Collisions:** GRAMMAR (R3 catalog consumership — the sharpest cross-program
  edge, §5 seam 1); WR-10 (faith families become bundle-composable the day they
  land — §5 seam 1); WAR (negotiationPictures consumed; peaceTerms stays the
  single terms writer — the seam ruling extends verbatim); WF-2
  (pilgrimage_right cannot form with `pilgrimageEnabled` dark — refusal
  receipted, no dead guarantee certified).

### WF-7 — THE TITHE (`titheEnabled`; LOCAL)
- **Files (measured):** NEW leaf `tithe.js` (draw + wealth fold + disposition;
  budget ≤ 250 eff); religionState.js (the fold applies through the one writer
  — in-place, small); generosityEV.js 401 eff (wealth-band scaling of the
  existing templeMediated 0.4 arm — small read); religionLegitimacy.js (the
  splendor term rides INSIDE W_INSTITUTION's existing 0.12 slot, banded within
  it — never a new additive; ~4 lines); warDeployment.js (sack-loot weight —
  NOT in the frozen map, but war-family territory: the coupling lands as a
  read the SACK arithmetic consumes, conservation pinned; collision declared).
- **Deltas:** none from the volume (quarterly fold = 13 weeks off the CANONICAL
  intervalWeeks.js:7 — V34; J-WF-15 coffers-at-the-fall disposition through the
  one writer, inherit named / dispersal conserved).
- **Pins:** volume's list stands (secular/temple-less negative non-vacuous;
  resentment arm WINS measurably; conservation through sack; SPLENDOR CAP
  (gold gilds, never buys — cannot push past the institution slot ceiling);
  remission both arms priced; fall→coffer both arms; dormancy).
- **Mutants:** splendor-cap removal reds the cap pin; dispersal-fraction 1.0
  mutant reds conservation; quarterly-cadence drift mutant (12 ticks) reds the
  clock pin (the peace-terms 12-tick trap is cured law — the pin names 13).
- **Dormancy:** four fences + lit mutant; dark ⇒ no templeWealth key ever
  materializes (byte-level drop-when-empty).
- **Req 13:** the sack lure's moral price reads the OBSERVER's axis (declared
  engagement — the one WF-7 axis read; rides the existing world-judges
  machinery, WR-8's). **Req 14:** templeWealth is DM-visible — RECORDED:
  engine-only v1 with the remission lever as the seat's ACT (an engine act
  through posture, not a DM verb); a DM wealth-set verb is a recorded deferral.
- **Collisions:** WAR (sack arithmetic read + conservation — coordinate with
  the war family's warDeployment ownership; STOP if warDeployment's headroom
  is gone at build); TRADE (CPL-7 port when lit — §5 seam 2); POP (resentment
  → commons voice, read-only); DS-FTH-3 (`templeWealth` spelling bound — R8).

### WF-8 — NARRATION 3× (`faithNarrationEnabled`; LOCAL; lights LAST)
- **Files (measured):** settlementRumors.js 482 eff/800 (WHAT_PHRASES rows —
  ~20 new kinds; headroom real but watch the ceiling — extraction of the faith
  pool to a leaf is the fallback, budgeted now); heraldRouting.js 246 eff
  (token rows); realmEvents.js 283 eff (FIVE new compound arcs — R2; if the
  arc battery pushes past ~700 eff the arcs land in a NEW leaf
  `realmFaithArcs.js` consumed at the existing compound-signature surface,
  budget ≤ 250 eff — VERIFY-AT-BUILD that surface's exact extension shape);
  the honesty fix (Ascendancy clause keyed to WF-2's season) in realmEvents'
  ascendancy copy.
- **Deltas from the volume (compiled):** the realm battery is FIVE arcs
  (Schism + Great Pilgrimage + Persecution + Awakening + Reformation — R2),
  each with a seeded-cluster reachability pin and a WF-9 occurrence envelope;
  the ≥3× census re-baselines against the LIVE phrased-token count at the
  landing commit (R6) — the walker records baseline and multiple in its own
  receipt; the Reformation detector is a pure derived read over WF-1's
  patronFalls rings (window 260w / ≥3 settlements / one cause token — banded).
- **Pins:** volume's list stands (TOTALITY walker — every program kind in
  WHAT_PHRASES + heraldRouting; flag-dark ⇒ zero new entries byte-identical;
  GOVERNOR pin — the flood fixture holds under the pacing caps, noting SP-6's
  governor is a SPINE deliverable (V40): until SP-6 lands, the caps are
  program-local constants registered for adoption, declared; PREMIUM pin on
  RENDERED projections; five realm-arc reachability pins; count parity by
  census walker).
- **Mutants:** governor-cap removal reds the flood pin; a kind dropped from
  WHAT_PHRASES reds the totality walker (that IS the walker's own mutant —
  executed once as a control).
- **Dormancy:** four fences + lit mutant; J-WF-9 (dark worlds stay silent, no
  retroactive narration).
- **Req 13:** the voices speak the believers' words; observer-axis judgments
  (purge, plunder, sale) name the OBSERVER's axis — declared engagement at the
  mouth. **Req 14:** receipts only — no state, no verb (recorded).
- **Collisions:** WR-10's `sovereignty_sale_judged` shares the faith desk
  (R6) — the WF-8 walker's census INCLUDES war-minted faith-desk kinds and
  must not double-register them; SP-6 (significance classes referenced, never
  minted — §1b-12 discipline: each earlier wave registered its kinds at mint,
  WF-8 gathers and adds only its own).

### WF-9 — CONVERGENCE INSTRUMENTATION (no flag; the acceptance harness)
- **Files:** the WF-0 case grown to a small grid; envelope + certification-row
  modules beside the war program's WR-9 instruments; the invalid-config walker
  (SPREAD flag lit while faithSpreadEnabled dark ⇒ red; lighting order = build
  order).
- **Content:** the volume's §5-WF-9 stands whole (eight-token endings walker
  with `faith_converted` qualified spelling; instrument-arc vocabularies
  OUTSIDE the mix with `roads_closed` + `plundered` floors; tenure tail;
  per-mechanism envelopes incl. the subsumption-seam delta and per-kind
  reading ratios; the NINE-row counterforce audit + sack lure), with ONE
  compiled correction: the realm-arc occurrence envelope covers FIVE arcs (R2).
- **Pins/mutants:** every envelope carries a mutant negative control (L7);
  certification rows grown from WF-0 shells render on the certification
  surface (the dossier landing, pinned from a fixture).
- **Req 13/14:** instrument — alignment-empty with reason; no state, no verb
  (recorded). **The program is DONE when these envelopes hold on the
  owner-ordered soak, and not before.**

---

## §5 SEAM CONTRACTS (pre-pins toward unbuilt neighbors; pinned seams honored)

1. **GR-3 / TR-5 / WR-10 — the catalog tripwire (the TR-5 pattern, live).**
   `TERM_FAMILIES` is DERIVED (peaceTermsCatalog.js:192) and
   `catalogGrewSinceWr10()` (sovereigntyBundle.js:166) reds the moment any
   family lands beyond WR-10's landing set — the pin
   tests/domain/sovereigntyBundleWr10.test.js:321 asserts `false` TODAY.
   **The GR-3 landing commit (GRAMMAR's) trips it BY DESIGN**: per the war
   volume's own §3 instruction, that commit re-reads WR-10's degradation note,
   widens the bundle expectations, and deletes the dependency row. THIS
   program's obligation, pre-pinned from the faith side: WF-6's executors
   derive family membership from `TERM_FAMILIES` at call time and spell no
   family literal outside the catalog (comment-stripped source scan, both
   directions — the sovereigntyBundle idiom), so faith terms become
   sovereignty-bundle-composable the day they land without an edit (§6 Q3).
2. **TRADE (TR-5 executors unbuilt; CPL-7 / CPL-12 ports unbuilt).** WF-2a and
   WF-7 own their executors END TO END; the TRADE-lit lane registers stream
   entries ONLY through TRADE's own writer at the couplings volume's declared
   ports. Pre-pins: (i) source-scan — tithe.js / pilgrimSeason.js import
   nothing from TRADE's internals (K3-shape, both directions with a
   guard-the-guard positive control); (ii) the TRADE-dark degraded arm
   (wealth-fold + receipts only) is a seeded fixture in each wave; (iii)
   tripwire — a pin asserting the CPL port symbols are UNCONSUMED by faith
   goes red when the port lands, instructing the widening (the
   catalogGrewSinceWr10 shape, applied to the port).
3. **SP-1 (absent — V40/R5).** WF-2b binds by SP number; the errand ledger's
   name resolves at build (VERIFY-AT-BUILD). Pre-pin: WF-2b's spec carries a
   red-until-built existence probe (module + purpose-token `religious`), so
   the wave cannot silently build against war's closed ENVOY_PURPOSES
   (['sue','self_parlay'], envoyErrandVocabulary.js:119 — the wrong ledger).
4. **SP-4 posture (absent) — the name-collision tripwire.** `riskToleranceOf`
   already exports from src/domain/roads/state.js:319 (npc-scoped). Pre-pin:
   every WF posture-consuming spec names the SP-4 module PATH it expects and
   carries an import-source pin (the read resolves to SP-4's module, never
   roads/state.js); until SP-4 lands, posture reads are declared-dark arms
   with neutral-posture fallbacks receipted honestly (§6 Q2).
5. **WR-1 dissolution join (pinned from both sides).** War's side is BUILT and
   pinned (sacredAnchors + anchor_unavailable, warTermination.js:225-345).
   Faith's side pre-pins: `pin:dissolution-names-the-fall` (the two-flag
   fixture) + the legacy arm (anchor_unavailable gets no invented cause) + the
   NET-ZERO rule against warTermination's frozen 818 ceiling (WF-1).
6. **WR-7b hold consumption.** foreignGuestHold.js is the ONE writer;
   WF-2b consumes read-only + close-through-the-writer; degraded arm when
   `envoyDiplomacyEnabled` dark (declared, pinned).
7. **The DS-FTH dossier-prose corpus (R8 — pinned now).** Spellings in §3 are
   bound to docs/content/RECEIPT_POOLS_DOSSIER_STATE.md's DS-FTH blocks;
   pre-pin: a doc-reading pin (exactly-once discipline) asserting DS-FTH-3's
   state signature matches the canonical model's spellings, landing with WF-1
   (the first writer) — divergence is a STOP; a wave amending a row re-runs
   `npm run gen:dossier-prose` in the same commit.
8. **The Herald faith desk.** New kinds join the LIVE walkers
   (tests/lint/{heraldRouting.walker,phrasedKindPools.walker,
   wizardNewsAuthoring.walker}.test.js) with their OWN walker rows;
   `sovereignty_sale_judged` (war-minted, faith-routed) is the precedent row
   WF-8's census must count once, not twice. Missing identities return null
   never throw; covert ⇒ fail-closed upstream.

---

## §6 OPEN CHAIR QUESTIONS (max 4; each with recommendation — JUDGMENT, vetoable)

**Q1 — The Schism realm arc (R2).** The volume premised WF-8 on an existing
realm Schism arc; none exists. Accept the re-scope to FIVE authored arcs (each
with reachability pin + envelope), or cut Schism from the battery?
**Recommendation: accept five.** The settlement schism contest (verified,
religionState.js:371-450) supplies the compound signature's ingredients; the
arc is the same class of new work as the other four, and cutting it would
leave the program's namesake drama voiceless at realm scale.

**Q2 — SP-4 posture absence (V40/V42).** Build WF waves with declared-dark
posture arms (neutral fallback, receipted) or hard-block posture-consuming
waves on SP-4? **Recommendation: declared-dark arms with the §5-4 import-source
tripwire.** The spine's build order already puts SP first; the arms exist so a
re-sequenced build cannot silently consume the WRONG riskToleranceOf (the
roads npc read) — the collision is the real hazard, the fallback is honest.

**Q3 — Faith terms in the sovereignty bundle (R1/§5-1).** When GR-3 lands
faith families, the WR-10 bundle mechanically gains them as consideration (a
settlement sold for missionary access). Compose, or exclude faith families
from the bundle? **Recommendation: compose.** Amendment S's "compose for free"
doctrine and the derived-families mechanism both point one way; exclusion
would require the first family literal in sovereigntyBundle.js and break its
own source-scan pin. The GR-3 landing commit handles the tripwire; WF-6 adds
one herald sentence for the faith-consideration sale (the faith desk already
routes sale judgments — heraldRouting.js:143).

**Q4 — The DS-FTH spelling bind (R8).** Treat the pre-authored dossier corpus
as BINDING spelling law for WF-1/5/7's writers? **Recommendation: yes.** The
corpus and this model already agree (patronFalls, covert, templeWealth,
season); binding them costs one doc-reading pin (§5-7) and prevents the
writer/reader payload-spelling drift class (which has bitten this estate) from
opening between the engine and ~400 authored prose variants. Divergence
becomes a STOP instead of a silent ghost.

---

## CLOSING PROTOCOL NOTE

The war volume's §10 binds verbatim (worktree/branch discipline, no stash,
pathspec commits, gate-tail, one wave one commit, golden discipline,
STOP-and-report), plus the faith addenda (deity-bearing fixtures through the
doctrine path; two-way kind registration; no wizard_news.* ids on
certification rows; the VERIFY-AT-BUILD register — to which this layer ADDS:
the reduced-ceremony founding call surface (WF-5a), the compound-signature
extension surface (WF-8), the SP module names/paths (all), the covert seam's
reusable surface (WF-5b), and warDeployment headroom at WF-7's build). Report,
don't rule: any conflict between this layer, the volume, the spine, the
amendments, or the tree is a STOP-and-report to the validation chair.
