# DESIGN — THE SP PROGRAM ARCHITECTURE (the shared spine compiled for build)

## SP program architect, 2026-08-04. Compiles DESIGN_FP_SPINE.md §2 (SP-1..SP-8,
## the believed-world / posture / banded-stock / temporal-walker / narration-kit
## infrastructure) into implementation-grade wave specs in the war-volume idiom
## (DESIGN_WAR_RULINGS_ARCHITECTURE.md is the template and the sibling).
## Substrate re-measured against the live tree (worktree minifold, branch
## claude/composite-r4, HEAD e564e135) on 2026-08-04. LIVE CODE OUTRANKS EVERY
## TABLE IN THIS DOCUMENT. Every judgment below labeled JUDGMENT is the SP
## architect's ruling under delegation — vetoable, never silently re-ruled.

**Status: ARCHITECTURE. Nothing here is scheduled until the chair sequences it
against the standing pipeline. Where this document and DESIGN_FP_SPINE.md
disagree, the constitution wins and the disagreement is a bug to report — with
ONE class of exception: where the constitution disagrees with the LIVE TREE
(three cases measured in §2), the tree wins, the correction is recorded here,
and the constitution owes an erratum row.**

**Reading order for the implementer:** this document top to bottom →
DESIGN_FP_SPINE.md §1–§2 (the law behind every spec) →
DESIGN_WAR_RULINGS_ARCHITECTURE.md §1/§10 (the laws and protocol, binding here
verbatim) → the per-volume documents only where a seam names them.

---

## §1 THE LAWS THAT BIND EVERY WAVE (the WR-era laws, bound not restated)

The nine law families L1–L9 from the war program bind every SP wave verbatim.
SP-specific bindings, each proven by execution in the WR/H/P lanes:

1. **L1 DETERMINISM:** zero new PRNG streams anywhere in SP. Every stochastic
   choice is keyed `hash01` (`src/domain/region/contestMath.js:45`, re-exported
   at `settlementStrategy.js:1356`), key = `'sp.<facet>.<realmId>.<id>...'`,
   codepoint-ordered enumeration. Weighted races are `w * hash01` products with
   BOTH sides of every weight proven live — the dead-band law binds every band
   this program authors (three shapes have bitten: unreachable ratios,
   never-written fallbacks, per-digest-calibrated spectra; `beliefRecord(x,x)`
   is the never-written-fallback exemplar and it lives in THIS program's
   substrate). `pulseKernel.js` (measured 2,820 lines at HEAD — the banked
   figure in older memory is stale as a number; the law is not) and
   `applyWorldPulse.js` (measured 1,291) receive ZERO edits ever. SP stages
   mount via the lifecycle host (`settlementLifecycleKernel.js:537` is the
   pattern: own-flag-before-host-gate) or ride existing fold call sites.
2. **L2 FLAGS:** every SP flag is virtual — ABSENT from
   DEFAULT_SIMULATION_RULES and from every preset spread, strict `=== true`
   reads, dark-never-permissive. Manifest timing is MECHANICAL, not a judgment
   call: `tests/lint/engineGatedRuleKeys.walker.test.js` source-scans the tree
   both directions, so each flag joins `ENGINE_GATED_VIRTUAL_RULE_KEYS`
   (`simulationRules.js:185`) in the SAME commit as its first strict gate read,
   with a certification row (or declared-pending entry) owed the same commit.
   Display-side flags take the EXEMPT_RULE_KEYS rationale row instead
   (`heraldCausalVoiceEnabled` at the walker's `:117` is the precedent). The
   FOUR-FENCE dormancy set per flag (own-footprint golden · absent-vs-false
   differential · call-path spy · gate-polarity census) with the lit-mutant
   control. Beware the conjunction-gate hole — SP-2's axis flags read as
   conjunctions with `beliefAxesEnabled`; each lands one BY-NAME read.
3. **L3 EPISTEMICS:** belief-side modules never import truth-side state for
   the counterpart legs (K3 pattern: zero-import pins on appraisal-class
   leaves, pinned import rows on composers). SP-2 is the belief substrate
   itself, so the law runs the OTHER way too: the axis fold's ground-truth
   inputs enter ONLY through `axisGroundTruth`-shaped seams
   (`beliefAxes.js:120`), never ad-hoc truth reads inside the fold; the
   infoMode gate (`simulationRules.js:739 infoModeOf`) stays the one door.
4. **L4 PERSISTENCE:** ZERO new top-level worldState keys in this program
   (achieved — §4). Conditional fields drop-when-absent (T4: a key is a byte;
   absent, never null). Every state-writing wave lands its canonical-model
   entry + Lifecycle-paths clause BEFORE the writer builds. Single-writer
   families enforced by shrink-only source-scan censuses with executed
   third-writer plants.
5. **L5 RECEIPTS:** GAME-GRADE TRANSLATE — no raw floats in prose; each clause
   names ONE band, comparisons in words; scalars stay on the returned read;
   runtime no-decimal pins on composed output.
6. **L6 HERALD:** every new kind = the five joins (annex-verbatim pool row ·
   registry row with requiredSlots + slotless fallback · WHAT_PHRASES
   (`settlementRumors.js:116`) · EXACT_SECTION/sectionAuthority
   (`heraldRouting.js:81`) · full address chain). Kinds get their OWN walker
   file (the envoy template: `tests/lint/{warRuling,warCoalition,sovereignty,
   lineage}KindPools.walker.test.js` are the four live exemplars), never rows
   in a foreign walker. dm-only means covert:true fail-closed UPSTREAM.
7. **L7 VERIFICATION:** attribute by VIOLATION ROWS against a git-archived
   base with node_modules symlinked; every load-bearing conjunction gets an
   executed mutant (cp backup, cmp/md5 restore, never checkout-family) + a
   mutationCoverageManifest entry; new negatives carry `// anchored:`; every
   doc-reading pin asserts its target appears EXACTLY ONCE; analytic pins that
   recompute from tokens prove nothing — pin the rendered/executed artifact.
8. **L8 SIZE:** sizeBaseline is tolerance-zero (`tests/lint/sizeBaseline.test.js`,
   `scripts/.size-baseline.json`); new logic = lazy leaves under the 800
   effective-line ceiling; hot files at ceiling get an extraction FIRST;
   measure with the enforcer at the publishing commit, never inherit a figure
   (this document's own size figures are pre-build measurements, not budgets
   to inherit).
9. **L9 PROCESS:** pathspec commits under the staged-set law; python3
   byte-scan every authored file; per-wave implementer + adversarial verifier
   with reject gates; STOP-and-report on measured blockers is a SUCCESS mode;
   spine requirements 13 (Alignment line) and 14 (Edit-verb story) are
   per-wave totality obligations — every wave below carries both.

---

## §2 SUBSTRATE CLAIMS (every existing-code premise the constitution's §2 makes
## about the spine, re-measured against the live tree 2026-08-04 by grep/read;
## live code outranks this table; any implementer finding another overstatement
## STOPS and reports — the J-WR-13 standing rule binds here)

### 2a VERIFIED (22 rows, each with its receipt)

| # | Premise | Receipt (file:symbol) | Measured state |
|---|---|---|---|
| V1 | The beliefMap's per-observer, per-faction-slot partition is BUILT, rigorous | `beliefMap.js:224 beliefRecord(worldState, observerId, subjectId, factionId = GOVERNING_SEAT_KEY)`; file measured 1,564 lines | BUILT. SP-2 extends, never forks |
| V2 | Existing decay/update/forgetting laws exist for beliefs to ride | `beliefMap.js:112-128 BELIEF_TUNING {SILENCE_DECAY: 0.92, HOP_DECAY: 0.75, RECENCY_DECAY: 0.85}`; the byte-identity decay anchor at `:660-669` | BUILT — new axes ride the same fold |
| V3 | Truth never leaks past the infoMode gate | `simulationRules.js:739 infoModeOf` (fail-closed string enum) | BUILT |
| V4 | The axis-extension pattern exists (the fold SP-2's three families join) | `beliefAxes.js` (204 lines): `AXIS_TUNING:32`, `trendBandFromHistory:71`, `axisGroundTruth:120`, folded at `beliefMap.js:654 foldBeliefAxes`; gated by `beliefAxesEnabled` (in ENGINE_GATED list) | BUILT with TWO axes: `populationTrendBand` (numeric −2..+2) and `observanceLabel` (cultural rite). SP-2's families are axes #3-#5+ |
| V5 | SP-2's three subject families do not yet exist | `grep believedScarcity\|believedConditions\|believedDevotion src` → zero hits | Verified ABSENT — new work, homed in SP-B |
| V6 | WR-10's appraisal has ONE of four belief legs (CR-WR10-H) | `sovereigntyMarketStage.js:156 beliefLegsOf` returns only `trajectoryBand` from `beliefRecord(...).populationTrendBand`; the injectable seam `beliefLegsFor = beliefLegsOf` at `:311`; header `:64` names "the belief-legs wave, queued" | CONFIRMED. Believed tier, believed stores, believed route position have NO (court, holding) surface. SP-B + SP-B2 discharge this (§9) |
| V7 | The negotiation picture's stores band is errand-scoped, not general | `envoyErrandVocabulary.js:71 ENVOY_STORES_BANDS` — lives in the errand vocabulary; exists only while two courts negotiate | CONFIRMED, exactly as CR-WR10-H measured |
| V8 | The errand substrate exists with one writer and the ruled lifecycle | `worldState.js:432 'envoyErrands'` (conditional materialization); writer `envoyErrand.js` (823 lines), `'lost'` close paths at `:425/:473/:528`; `ENVOY_ERRAND_STATES` in `envoyErrandVocabulary.js:42`; DM-KILL-closes-lost lifecycle landed with WR-7 | BUILT — SP-1 generalizes IN PLACE (§3 seam ruling 2) |
| V9 | The purpose vocabulary is war-scoped today | `envoyErrandVocabulary.js:119 ENVOY_PURPOSES = ['sue', 'self_parlay']` | The six-class vocabulary {diplomatic, commercial, religious, factional, personal, covert} is NEW WORK (SP-D) |
| V10 | The two-picture contract exists for SP-3 to point at | `negotiationPictures.js` present (29.6 KB), the WR-7 seam | BUILT — SP builds nothing here (§3 ruling 3) |
| V11 | The treaty term catalog + tripwire state | `peaceTermsCatalog.js:141 TERM_CATALOG` — 12 types, 8 families (economic, relational, security, territorial, political, informational, sovereignty, sovereignty_transfer); `TERM_FAMILIES:192`; `catalogGrewSinceWr10` live in `sovereigntyBundle.js` + `tests/domain/sovereigntyBundleWr10.test.js` | Trade-rights rows, faith families, population families all ABSENT — GR-3/TR-5 territory; SP must honor the tripwire (§8) |
| V12 | Disposition channels are BUILT (dark) for SP-4b to compose | `dispositionLedger.js` (560 lines): channel list at `:31` {martial, mercantile, diplomatic, insular}, per-channel decay at `:62`; `dispositionChannelsEnabled` read in 10+ modules (warTermination.js, settlementStrategy.js, sovereigntyIntent.js…); `dispositionProfile.js` (156 lines) pure read-side | BUILT dark. SP-4b's channel term gates on it (degraded arm when dark) |
| V13 | The ruler's books are unbuilt; the SP-4 degraded arm binds | `grep seatBooksEnabled src` → zero hits | Verified ABSENT — the constitution's INT-1 degraded-arm correction is live law for SP-C |
| V14 | The appetite-stock idiom exists to generalize | `supplyKernel.js:566-578` — `spatialLedgers.merchantAppetite` written via `setSpatialLedger`/`dropSpatialLedger` (drop-when-cold); idiom reused by `tradeOverture`, `lendAppetite`, `intelCooldown` (`src/lib/spatialUsage.js:243-269`) | BUILT as idiom; the SETTLEMENT appetite stock is new work (SP-C) |
| V15 | SP-5's existing family members are real | confidence-in-god substrate: `religionState.js` (641 lines; `PATRON_HOLD_DECAY:50`, deities share/standing/legitimacy); source credibility: `brokerageStamps.js` (610 lines, `tavern_talk` ladder); domestic credit substrate: publicLegitimacy + `generosityUpdates.js:80 applyLegitimacyDeltasToUpdates` | BUILT — the family GRAMMAR (SP-5b) is what SP builds; instances extend in their volumes |
| V16 | TRADE's house books and FAITH's templeWealth are unbuilt | `grep templeWealth src` → only `src/data/dossierStateProse/warFaith.generated.js:2586` (authored prose data, not engine state); no `books.holdings`/`books.credit` engine surface | Verified ABSENT — SP-5b ships the idiom module they will instantiate |
| V17 | The banded-stock idiom was instantiated with independently-authored decay laws (the SP-5b motivation) | Measured, at least six distinct authored decay shapes: `dispositionLedger.js:62` (per-channel 0.12/0.10), `relationshipEvolution.js:135 RELATIONSHIP_RELAX 0.12`, `beliefMap.js:112-128` (three-constant decay family), `religionState.js:50` (0.02/tick erosion), generosity obligations (`generosityKernel.js:1064 decayPerTick`), merchantAppetite softening (supplyKernel M6c) | CONFIRMED — the per-volume-minting problem is real; SP-A ships the shared shape |
| V18 | The narration-kit registration surfaces exist | `WHAT_PHRASES` at `settlementRumors.js:116`; `heraldRouting.js` (525 lines): `HERALD_SECTIONS:64`, `EXACT_SECTION:81`, `SECTION_OF:360`; four per-program kind-pool walker files (V6's L6 row) | BUILT — SP-E codifies the checklist and adds the floor walker |
| V19 | The causal voice + state-prose substrate is BUILT dark | display: `heraldCausalGrammar/Voice/JoinMolds/Integrity/Index.js`, `rumorHeraldLink.js` (pacing-floor read at `:8/:101`), `PortablePopup/CausalityPopup`; dossier: `src/domain/display/stateProse/` (five modules) + `src/data/dossierStateProse/*.generated.js` + `package.json:27 gen:dossier-prose` | BUILT (lanes H/HG/HR/P/PR/CF). SP-E extends; never rebuilds |
| V20 | The pacing governor exists and is frozen | `narrativeTempo.js` (511 lines): `TEMPO_BUDGETS:125` (classMax/arcMax/graceWeeks per tier), `narrativeTempoOf:141` (absent ⇒ DORMANT, budget ∞); docs/DESIGN_PACING_GOVERNOR.md present | BUILT — but see R4: it has no news-kind registration surface |
| V21 | The temporal spine is single-sourced and mirror-guarded; the transit kernel + totality walker exist | `intervalWeeks.js:7 INTERVAL_WEEKS` re-exported `worldState.js:38`; `tests/domain/temporalGates.w0.test.js` (calendar-mirror drift guards over the two documented local copies in foodStockpile.js/populationDynamics.js + sim-path wall-clock backstop); `tests/lint/namedPersonTransitTotality.walker.test.js` + `npcCirculationTransit.js:131 planWanderLeg` | SP-7 is MOSTLY BUILT. Remaining: the mode-speed table (grep `kmPerWeek|MODE_SPEED` → zero hits — J-D11(b)'s, cross-referenced, NOT SP work) and extending walker totality to new SP consumers (folded into each wave's pins) |
| V22 | J-D12 (the age toggle) exists with veto open; WR-9's instrument surface exists for the era envelopes | `docs/DESIGN_REALM_DIRECTIVES.md:1511 J-D12`; `src/domain/certification/warConvergenceContract.js` (820 lines) + `tests/simulation/distributionEnvelopes.test.js` | SP-8 owes only the ERA-PRESET-ELIGIBLE marking rule (§7) — the preset tables are the age wave's own, owner-signed |

Also verified in passing, carried for the flag family: the WR flags
(`warTerminationEnabled` etc.) are declared `false` on the full_simulation
ceiling ONLY (simulationRules.js:445-472) — a pattern CR-WR10-C superseded
with the zero-byte enumeration list. SP flags take the LIST, never the preset
declaration (+32 serialized bytes per key is the measured cost of the old way).

### 2b REFUTED (4 rows — the most valuable output; nothing builds on these)

| # | The constitution's premise | What the tree actually holds | Consequence |
|---|---|---|---|
| R1 | `alignmentOf(id) → { lawfulness01, malice01 }` lives at `beliefMap.js:915` and `informationStatecraft.js:584` (req 13's anchor) | NO exported `alignmentOf` exists anywhere. It is an INJECTED CLOSURE PARAMETER: `beliefMap.js:1025 applyAllyIntelSharing({ ..., alignmentOf })` (typed at `:1021`), `informationStatecraft.js:500` (typed at `:485`), composed at the pulse call sites. Both cited line numbers have rotted | Req-13 consumers in every SP wave bind the INJECTION SEAM, never an import; navigate by symbol, never by the constitution's line addresses. Constitution owes an erratum. The hand-keyed line-address-rot class, again |
| R2 | SP-1's ledger home is `spatialLedgers.errands` | The live errand ledger is TOP-LEVEL `worldState.envoyErrands` (`worldState.js:432`, conditional materialization; `ENVOY_ERRAND_LEDGER_KEY = 'envoyErrands'` at `envoyErrandVocabulary.js:24`), with a landed writer, lifecycle, persistence pins, and WR-7c/d pulse wiring | JUDGMENT (§3 ruling 2): SP-1 generalizes the EXISTING ledger in place. Migrating a live persisted key to a new home is persistence-shape churn for zero behavior — owner-gated and not proposed. Open question Q1 |
| R3 | SP-4 exposes `riskToleranceOf(actor)` (an unclaimed name) | `src/domain/roads/state.js:319` ALREADY exports `riskToleranceOf(npc)` — an NPC-grain roads-courage read, consumed by `roadsKernel.js:36,982` | The constitution's export name COLLIDES with a live symbol in another domain. §3 ruling 4 + open question Q2. Any grep-driven sweep touching this name must scope by module or it conflates two contracts (the concurrent-lane rename hazard class) |
| R4 | News classes "register with the pacing/significance machinery" (§1.12) — implying a registration surface exists | The governor exists (V20) but throttles STRESSOR/ARC BIRTHS via `dramaClassOf(candidate)`; there is NO registration surface for Herald news kinds, and display significance is ad hoc — `components/map/heraldFeed.js:95` mixes `record.significance === 'major'` with a raw `severity >= 0.72` float threshold | SP-6a's one-scale family and its registration walker are genuinely NEW WORK (SP-E), and the fp-audit's "dozen independently-authored significance scales" direction is confirmed by sample. The governor is the CONSUMER of the family, not its home |

---

## §3 THE FLAG FAMILY + THE FOUR SEAM RULINGS

Five new virtual flags. All absent from DEFAULT_SIMULATION_RULES and every
preset; all join `ENGINE_GATED_VIRTUAL_RULE_KEYS` in the same commit as their
first strict gate read (the walker enforces this mechanically, both
directions); each owes a certification row the same commit; each ships the
four-fence dormancy set with the lit-mutant control.

| Flag | Gates | Wave |
|---|---|---|
| `believedScarcityEnabled` | the BELIEVED SCARCITY axis family joining the beliefAxes fold (trade's subject) | SP-B |
| `believedConditionsEnabled` | the BELIEVED CONDITIONS axis family — believed tier + believed stores + believed route position + destination attractiveness (populations' subject AND WR-10's three missing legs) | SP-B |
| `believedDevotionEnabled` | the BELIEVED DEVOTION axis family (faith's subject; distinct from the existing observanceLabel rite-identity axis) | SP-B |
| `strategicPostureEnabled` | the settlement appetite stock's learn/decay writer + the posture composition's appetite term | SP-C |
| `errandSpineEnabled` | the generalized errand mint head (six purpose classes, declared/true split) for non-war consumers | SP-D |

Every SP-2 axis flag reads as a CONJUNCTION with `beliefAxesEnabled` (the
axis machinery is the host; a family cannot be lit under dark axes — the
lighting-order idiom of the WR flag-dependency ruling), and each lands one
BY-NAME read so the gate walker sees it (the frozen-list `.every()` hole).
Consumer-volume flags (TRADE/POP/FAITH/INFO) are ADDITIONAL preconditions on
their own waves — own-flag-before-host-gate, both flags checked at the
consumer's mount.

Zero flags elsewhere, and each zero is a decision: SP-A's leaves are pure and
consumed by nothing at land time (dark by construction — the lane-P
precedent); SP-2's second-order belief read is a pure derivation over the
outbound record with no writer, gated by its INFO consumers' own flags; SP-E's
walkers and soak instruments are test/certification estate; SP-6 display
surfaces that later gate take EXEMPT_RULE_KEYS rationale rows (the
`heraldCausalVoiceEnabled:117` precedent).

**SEAM RULING 1 — THE AXIS SEAM (binding; the largest architectural decision
in this document):** SP-2 does NOT build a believed-world module. The three
subject families are NEW AXES in the EXISTING `beliefAxes.js` fold family —
each is (a) a ground-truth derivation joining `axisGroundTruth` (`:120`), (b)
a fold arm joining `foldBeliefAxes` (consumed at `beliefMap.js:654`), (c)
conditional fields on the EXISTING `beliefRecord` rows, drop-when-absent. All
ride BELIEF_TUNING's decay/forgetting and the infoMode gate for free. A
parallel believed-scarcity ledger, a second fold, or a second decay law
anywhere is a design defect. The accuracy-gated adoption idiom
(`AXIS_TUNING:32` — above the accuracy bar the observer adopts current truth;
below it the stale prior survives) is the house pattern every new axis reuses.

**SEAM RULING 2 — THE ERRAND LEDGER STAYS WHERE IT LIVES:** SP-1 generalizes
`worldState.envoyErrands` IN PLACE — one ledger, one writer (`envoyErrand.js`),
the existing states, caps, and lifecycle. The constitution's
`spatialLedgers.errands` address is treated as descriptive (the SP-FLAG-NAMES
correction's own logic: the constitution could not cite what build would
resolve), and the resolution is recorded here. Consumers arriving from other
volumes (factors, legates, pilgrims, couriers, the ambitious) mint through the
SAME writer with new purpose classes — never a second errand ledger, never a
per-volume mover ledger. Migration/columns stay flows, not errands (the
constitution's own boundary).

**SEAM RULING 3 — SP-3 IS DELEGATED, NOT BUILT HERE:** the pact grammar's
peacetime formation is FP-GRAMMAR's core (the constitution's own §3-GRAMMAR:
"SP-3 IS this program's core"; GR-3 mints the one TERM_CATALOG list under
chair ruling R3). The SP program builds NOTHING against `peaceTermsCatalog.js`
and spells NO term-family literal in any SP module (source-scan pinned,
SP-A) — the `catalogGrewSinceWr10` tripwire (`sovereigntyBundle.js`) stays
green until GR-3 lands, and when it reds, that red belongs to WR-10's
re-widening, not to SP. What SP owes SP-3 is carried as seam contracts (§8):
the treaty artifact untouched, the two-picture wrapper untouched, the
directional-term hosting unblocked.

**SEAM RULING 4 — THE APPETITE HOME:** SP-4a's settlement appetite stock lands
as a conditional facet ON `worldState.dispositionStats` rows — same ledger,
same ONE writer (`dispositionLedger.js`), the J-WR-11 extend-never-duplicate
idiom exactly. It is outcome-learned and decay-inherent, which is precisely
the machinery that ledger already runs; a parallel appetite ledger would be
J-WR-11's double-count risk reborn. The house/temple appetite classes of
SP-4a's CLOSED actor set land in THEIR volumes' actor records when those
records exist, instantiating SP-5b's idiom — never a third stock minted in a
volume (the constitution's own amendment rule). Vetoable: Q3.

---

## §4 CANONICAL MODEL — new state, and it is deliberately small

ZERO new top-level worldState keys. Three conditional field families, each
with exactly one writer, all drop-when-absent:

```
worldState.envoyErrands[] (EXISTS; writer envoyErrand.js — unchanged)
  purposeClass?: string       // SP-D: one of the six closed classes
                              // {diplomatic, commercial, religious, factional,
                              //  personal, covert}; ABSENT on legacy rows —
                              // readers derive 'diplomatic' from the war
                              // purposes ('sue'/'self_parlay') so no migration
                              // and no re-serialization of an installed save
  declaredPurpose?: string    // SP-D: the covert/revealed seam (the Q
  truePurpose?: string        //   amendment generalized). Present TOGETHER
                              //   and ONLY when they differ; absent means the
                              //   declared purpose IS the true purpose (the
                              //   overwhelming case, zero bytes)

worldState.dispositionStats[sid] (EXISTS, LIT via warDispositionEnabled;
                                  writer dispositionLedger.js — unchanged)
  appetite?: { stock01, band, updatedTick }
                              // SP-C: outcome-learned risk appetite, decayed
                              // toward neutral on the SP-5b shared half-life
                              // shape. Written ONLY under
                              // strategicPostureEnabled === true, so on every
                              // installed save and every dark config the field
                              // never exists and the LIT ledger's bytes are
                              // untouched (the conditional-field dormancy
                              // argument — pinned, not asserted)

beliefRecord rows (EXIST, inside the beliefMap partition; writer: the
                   beliefMap fold — unchanged)
  scarcityBands?: { [goodClass]: band }   // SP-B, believedScarcityEnabled;
                                          // codepoint-ordered closed good-class
                                          // keys, drop-when-empty
  conditionsBands?: { tierBand, storesBand, routePositionBand, pullBand }
                                          // SP-B, believedConditionsEnabled;
                                          // the WR-10 legs + the migration pull
  devotionBand?: string                   // SP-B, believedDevotionEnabled;
                                          // how the neighbours' gods fare,
                                          // banded — never a theology
```

Plus three PURE modules with no state and no writer: `bandedStock.js` (SP-A —
the SP-5b shared idiom: half-life shape, crossing-receipt grammar, the
anti-ratchet assertion), `bandFamilies.js` (SP-A — SP-6a significance
{routine, notable, major} + SP-6b severity ladder, minted ONCE), and
`strategicPosture.js` (SP-C — `postureOf`/`riskToleranceOf` reads).

**What is deliberately NOT modeled:** no second errand ledger; no appetite
ledger; no believed-world module; no nested second-order belief map (the
heuristic derives from the outbound record); no news-kind significance stored
on records beyond the existing significance field (the family is a vocabulary,
not state); no era-preset state (J-D12's wave owns it).

**Lifecycle paths (the L4 clause, per field family):**
- `envoyErrands[].purposeClass/declaredPurpose/truePurpose` — persist with the
  errand row through the existing serializer; JSON-round-trip pinned (the
  alias trap — an errand's npc IS a roster object in memory); regen under THE
  PROMISE replays the same keyed mints so rows re-mint identically; undo rides
  the pulse ring wholesale; import validates purposeClass against the closed
  vocabulary and DROPS unknown fields (never null-fills); a DM KILL mid-errand
  closes `lost` through the one writer exactly as today; VEIL: truePurpose is
  covert-side — every projection carrying it routes includeCovert fail-closed
  (the errand projection module `envoyErrandProjection.js` already owns the
  audience split; the new fields join ITS discipline, pinned).
- `dispositionStats[sid].appetite` — persists inside the existing lit ledger;
  the load-time normalizer that owns dispositionStats learns the OPTIONAL
  facet (shape discipline at the normalizer since one exists — the
  occupations-had-none contrast case); JSON-round-trip pinned both shapes
  (with and without the facet); regen: dispositionStats is campaign state, not
  a generated field — it survives single-settlement regeneration by existing
  law (pinned); undo rides the pulse ring; a mid-world `strategicPostureEnabled`
  flip reads absent-as-neutral and begins writing — it never back-derives
  history (pinned: flip-lit produces the same next-tick appetite as a
  fresh-world lit run from the same outcomes); MIGRATE: none needed —
  absent-is-legal is the schema.
- `beliefRecord` axis fields — persist wherever the belief partition already
  persists, ride its decay and its forgetting; regen/undo/import follow the
  partition wholesale (no per-axis lifecycle anywhere); VEIL: belief rows are
  observer-private by construction and no new projection is added; the axes
  drop-when-absent so dark configs and pre-SP saves are byte-identical (the
  own-footprint golden per flag proves it).

---

## §5 THE WAVES (dependency order; each: one commit, focused gates per slice,
## full gate at wave end, ledger row; every wave DARK per §3)

### SP-A — THE PURE FOUNDATIONS (no flag; dark by construction)
**Scope:** the three shared-idiom leaves every later wave and every volume
consumes.
- **`bandedStock.js` (new leaf, budget ≤ 250 lines):** the SP-5b family —
  ONE half-life shape (a small closed table of named half-life bands the
  instances draw from), ONE crossing-receipt grammar (band-crossing receipt:
  {stockKind, from, to, cause, tick} — words, never floats), the anti-ratchet
  guarantee asserted ONCE (every instance decays toward neutral — a property
  test over the shape, not per-instance faith).
- **`bandFamilies.js` (new leaf, budget ≤ 150 lines):** SP-6a SIGNIFICANCE
  {routine, notable, major} with the section-cap and significance-floor
  shapes; SP-6b SEVERITY ladder. Minted once; volumes assign, never author.
- **The reconciliation walker (test estate):** `tests/lint/
  spBandFamilies.walker.test.js` — every named band in an SP/FP wave's Bands
  line lands in its volume's tuning table and vice versa (both directions);
  volume-local bands self-declare. Lands SCOPED to SP's own §7 initially and
  grows with each volume (the shrink-only frozen-backlog idiom for the
  pre-existing war tables, so the walker does not red the estate at birth).
- **The no-term-literal source scan:** no SP module spells a TERM_CATALOG
  family literal (seam ruling 3), with the guard-the-guard positive control
  (the scan FINDS the literal in `peaceTermsCatalog.js` itself).
- **Files touched:** new leaves only; test estate. No existing src edits.
- **Pins:** each family scale appears EXACTLY ONCE in the doc-reading pins
  (the first-match retargeting law); the anti-ratchet property with an
  executed ratchet-mutant (a stock that never decays reds); the walker's
  negative control (plant an unregistered band, walker reds, restore by cmp).
- **Dormancy:** nothing imports the leaves at land time — dark by
  construction, stated in the wave's ledger row (the lane-P precedent).
- **Alignment line (req 13):** declared-empty WITH REASON — pure vocabulary
  and shape modules read no world state and colour no verb.
- **Edit verb (req 14):** RECORDED decision — engine-only, because these are
  authored constants under the owner's tuning signature, not player/DM state.
- **Collision map:** zero — new files plus test estate; no war-lane file is
  opened.

### SP-B — THE BELIEVED-WORLD AXES (flags `believedScarcityEnabled`,
`believedConditionsEnabled`, `believedDevotionEnabled`)
**Scope:** the three subject families as beliefAxes fold arms (seam ruling 1).
- **Extend `beliefAxes.js` (204 lines, headroom ~600):** three ground-truth
  derivations joining `axisGroundTruth` — scarcity from the existing supply/
  flow state (banded per closed good class), conditions from tier + granary
  stores band + route-network position band + the composed pull band,
  devotion from religionState's share/standing (banded; the engine still
  never confirms the god — Law One). Each arm gates on ITS flag ∧
  `beliefAxesEnabled`, strict, one by-name read each. If the file crosses its
  ceiling, the extraction lands FIRST (`beliefAxisSubjects.js` leaf) per L8.
- **The fold arms** join `foldBeliefAxes` under the accuracy-gated adoption
  idiom; conditional fields per §4; drop-when-absent at every level.
- **Second-order belief (the heuristic):** a pure read module
  (`outboundImpression.js`, budget ≤ 200) deriving "what they likely believe
  of us" from the OUTBOUND record only (what was shared, leaked, planted, or
  shown toward that observer — all already ledgered in the brokerage/
  statecraft records); zero-import pin excluding the belief partition itself
  (it reads the outbound ledgers, never the counterpart's beliefs — that
  would be the recursion Law One forbids). No flag (no writer, no consumer at
  land time).
- **Files touched (measured):** `beliefAxes.js` (204), `beliefMap.js` (1,564 —
  fold call-site only, few lines; the file is at scale, so NO new logic lands
  in it), `simulationRules.js` (896 — three list rows), certification rows.
- **Pins:** per flag, the FOUR-FENCE set + lit-mutant control; the
  conjunction-reachability pin per axis (a real generated corpus reaches the
  TRUE branch — the unreachable-conjunction class); the wrong-belief pin per
  family (belief diverges from truth under infoMode fog and the receipt can
  say so — the K.7 jewel's shape); the never-written-fallback audit (every
  fold-arm default proven reachable or deleted — the dead-band law, and
  `beliefRecord(x,x)`'s lesson lives in this exact file family); the
  three-family independence pin (lighting one family moves ONLY its fields —
  per-flag own-footprint goldens).
- **Mutants:** executed per family — a fold arm that reads truth past the
  infoMode gate must red the K3-style source scan (guard-the-guard against
  `axisGroundTruth`, which legitimately reads truth); restore by cmp.
- **Dormancy:** all three flags dark ⇒ beliefRecord bytes identical (golden
  before wiring, the J1 precedent); `beliefAxesEnabled` lit but families dark
  ⇒ the two existing axes behave byte-identically (the differential fence).
- **Alignment line:** engagement declared — the devotion family's ground
  truth reads the pantheon through existing planes only; no alignment axis is
  read or written by the fold (declared-empty on both axes WITH REASON: belief
  formation is perception, and the world's judgment on observers rides
  consumers, not the substrate).
- **Edit verb:** RECORDED decision — belief rows are engine-derived fog;
  DM-visible surfaces render them read-only; no DM verb edits another mind's
  belief (finite-semantics: the DM edits the WORLD, beliefs re-derive). The
  decision is written into the wave's ledger row, never silence.
- **Collision map:** `beliefMap.js` is war-lane-adjacent (WR waves read it)
  and the tree is LIVE — re-read before editing, pathspec commit, re-grep
  after (the concurrent-lane silent-revert class). `sovereigntyMarketStage.js`
  is NOT touched in this wave (SP-B2's job).

### SP-B2 — THE BELIEF-LEGS DISCHARGE (rides SP-B's flags; no new flag)
**Scope:** the queued "belief-legs wave" named at `sovereigntyMarketStage.js:64`
— the WR-10 lighting precondition CR-WR10-H discharged.
- **`beliefLegsOf` (`sovereigntyMarketStage.js:156`) widens** from one leg to
  four: `trajectoryBand` (existing) + `tierBand`, `storesBand`,
  `routePositionBand` read from SP-B's conditionsBands through `beliefRecord`
  — through the EXISTING injectable seam, so the stage's composition logic is
  untouched (the seam exists precisely so this wave supplies legs without
  touching the stage — honored, not bypassed).
- **The lit-with-legs contract fixture** (already present per CR-WR10-H)
  flips from proves-the-seam to proves-the-supply: with
  `believedConditionsEnabled` ∧ `beliefAxesEnabled` lit on the fixture, the
  appraisal returns `known: true` and the market clears end to end; with the
  family dark, the honest receipted no-trade stands (both arms pinned).
- **Files touched:** `sovereigntyMarketStage.js` (486 lines — the one
  function), its test file.
- **Pins:** the four-leg totality pin (each leg present ⇒ named in the
  appraisal receipt; each absent ⇒ `known:false`, never a guess — R-28's
  grain); the degraded-arm pin (three legs lit, one dark ⇒ still
  `known:false` — partial knowledge does not clear a market, per the
  appraisal's own contract).
- **Dormancy:** dark families ⇒ `beliefLegsOf` returns exactly today's
  one-or-zero legs — byte-identical goldens.
- **Alignment line:** declared-empty with reason (a supply shim; the
  appraisal's own alignment reads are WR-10's).
- **Edit verb:** n/a — no new state; recorded as such.
- **Collision map:** `sovereigntyMarketStage.js` is the WAR lane's file
  (WW-A/WW-B lanes live on it as of 2026-08-04) — CHECK-GIT-FIRST, re-read at
  edit time, coordinate through the queue if dirty.
- **THIS WAVE PLUS SP-B IS THE EXACT DISCHARGE of the WR-10 lighting
  precondition:** after SP-B (axes exist) + SP-B2 (legs supplied),
  `sovereigntyTradeEnabled`'s §9 lighting-order row is satisfiable; the WR-9
  certification walker's invalid-config red for out-of-order lighting gains
  its green path. Named here so the war program can cite "SP-B/SP-B2 landed"
  as the precondition's receipt.

### SP-C — THE POSTURE READ (flag `strategicPostureEnabled`)
**Scope:** SP-4a's settlement appetite stock + SP-4b's posture composition.
- **Extend `dispositionLedger.js` (560 lines, headroom ~240):** the
  `appetite` facet per §4 — learned from OUTCOME EVENTS only (war won/lost,
  treaty held/broke, trade enriched, venture failed — the ledger's existing
  event diet), decayed toward neutral on `bandedStock.js`'s shared shape (the
  first in-tree instantiation of SP-5b, deliberately). THE REVERSAL PIN is
  mandatory (no courage ratchets — the constitution's own law).
- **New leaf `strategicPosture.js` (budget ≤ 300):** `postureOf(settlementId)`
  composing state × disposition channels × appetite × (the ruler's books —
  ABSENT term until INT-1); `riskToleranceOf(actorRef)` for the closed actor
  set (settlement today; house/temple bind when their records exist — a
  tripwire pin reds an unknown actor class rather than guessing).
  Threshold-shaped reads ONLY (E3's law): the import list is pinned (the P4
  no-hidden-governor pattern — no relationship graph, no target lists), the
  module CANNOT name a victim.
- **THE DEGRADED ARMS, both declared:** books term ABSENT (not zero) until
  `seatBooksEnabled` exists (V13); channels term ABSENT while
  `dispositionChannelsEnabled` is dark. The posture receipt NAMES which
  inputs it had (the constitution's own correction, honored); the golden pair
  (posture with and without each term) lands here; lighting either upstream
  flag is a disclosed same-seed shift for every posture consumer (carried on
  INT-1's and WR-2's disclosed-shift lists).
- **Files touched (measured):** `dispositionLedger.js` (560),
  `simulationRules.js` (896 — one row), new leaf, certification row.
  `dispositionProfile.js` (156) is READ, not edited.
- **Pins:** four-fence + lit-mutant; the reversal pin; the
  conditional-field dormancy pin (lit ledger, dark flag ⇒ ledger bytes
  identical across a 10-tick pulse — hash-compared, the lane-W idiom); the
  E3 import pin with executed violation mutant; the two-realms divergence
  property (same config, different outcome histories ⇒ different postures —
  E2's payoff at posture grain); the band-word receipt pin (no float in any
  posture receipt — L5).
- **Dormancy:** flag dark ⇒ no appetite facet ever written ⇒ every golden
  byte-identical (own-footprint golden captured BEFORE wiring).
- **Alignment line:** engagement declared — SP-4b's composition reads the
  disposition channels which already blend alignment-adjacent inputs; the
  posture module itself reads NEITHER alignment axis directly (declared, with
  the import pin as proof); consumers that colour verbs by alignment do so in
  their volumes under req 13.
- **Edit verb:** RECORDED decision — the appetite stock is engine-learned
  memory (engine-only, because a DM-set courage would be a stored opinion the
  outcome stream would immediately fight); the DM's hand on posture arrives
  via J-D12's age presets (SP-8), which is the owner's designed instrument
  for exactly this. Recorded in the ledger row.
- **Collision map:** `dispositionLedger.js` is dark-war-lane substrate
  (WR-2's file) — the WR lanes are build-complete on it, but re-read before
  editing; the R3 name collision (roads `riskToleranceOf`) is documented AT
  the new module's header and in the memory estate; imports disambiguate.

### SP-D — THE ERRAND SPINE GENERALIZATION (flag `errandSpineEnabled`)
**Scope:** SP-1 — the war errand becomes the estate's one purposeful-travel
substrate, in place (seam ruling 2).
- **Extend `envoyErrandVocabulary.js` (315 lines):** the six purpose CLASSES
  as a closed vocabulary beside the existing purposes; the mapping row
  ('sue'/'self_parlay' → diplomatic) as data, not inference.
- **Extend `envoyErrand.js` (823 lines — AT the effective ceiling per the
  WR-7 decomposition history: the mint-head extension lands in a NEW leaf
  `errandMint.js` (budget ≤ 250) that the existing writer delegates to;
  `envoyErrand.js` gains only the delegation call — the L8 recipe, and the
  measured reason the lane-W deferral retired):** the generalized mint head
  accepts purposeClass + declared/true split, gated `errandSpineEnabled ===
  true`; dark, only the war path exists, byte-identical.
- **The declared/true split** rides the covert/revealed seam: truePurpose is
  covert-side (fail-closed in `envoyErrandProjection.js`'s audience split);
  interception exposure of a true purpose routes the EXISTING covert→revealed
  machinery, never a new one.
- **Per-errand keyed forks** (exists — the WR-7 stream discipline), the K.2
  snapshot, interceptability, and the M speed law all apply to every class BY
  CONSTRUCTION (same writer, same transit kernel — the totality walker
  `namedPersonTransitTotality.walker.test.js` extends to the new mint leaf).
- **The consumer registration tripwire:** a frozen consumer map (GRAMMAR's
  envoys today; factors/legates/pilgrims/couriers/ambitious as volumes land)
  with a both-ways walker — a volume minting errands without a registry row
  reds; a registry row with no minting consumer reds (the TR-5 pattern,
  pointed at five unbuilt programs).
- **Files touched (measured):** `envoyErrandVocabulary.js` (315),
  `envoyErrand.js` (823 — delegation only), new `errandMint.js`,
  `envoyErrandProjection.js` (audience rows), `simulationRules.js`,
  certification row.
- **Pins:** four-fence + lit-mutant; JSON-round-trip on the new fields (the
  alias trap); the fail-closed truePurpose projection pin (the hardest
  negative: a non-covert projection NEVER carries truePurpose, proven with a
  seeded covert errand, not an empty harness — the vacuous-absence class);
  the legacy-row derivation pin (absent purposeClass reads diplomatic, and a
  legacy save round-trips byte-identically); DM-KILL-closes-lost re-proven on
  a generalized errand.
- **Dormancy:** flag dark ⇒ mint head unreachable ⇒ `envoyErrands` bytes
  identical dark (hash-compared through the live pulse, the lane-W idiom).
- **Alignment line:** declared-empty with reason at the substrate (purpose
  classes are typed travel, not moral verbs); the covert class's
  interception consequences engage alignment in INFO/GRAMMAR consumers.
- **Edit verb:** PARTIAL — the DM already kills movers (KILL closes `lost`);
  a DM "recall errand" verb is deliberately NOT minted here (recorded:
  engine-only until a volume's story needs it, because a recall without the
  volume's politics is a free undo of a priced act). Recorded, not silence.
- **Collision map:** the envoy file family is the war lane's most-recently
  edited surface (Aug 3 timestamps) — CHECK-GIT-FIRST is mandatory; the
  extension is delegation-shaped precisely to keep the diff small and
  attributable.

### SP-E — THE NARRATION KIT ASSEMBLY (no engine flag; test/walker/soak estate
plus one pure leaf consumption)
**Scope:** SP-6 completed as machinery, not hope.
- **The registration checklist codified:** the five L6 joins + pool floor +
  pacing assignment, as a walker template file the volumes copy (the envoy
  kind-pool walker generalized into `tests/helpers/kindPoolWalker.js` so new
  programs get frequency-scaled floors by import, not by transcription).
- **THE FREQUENCY-SCALED FLOOR walker:** every registered phrased kind
  asserts variant depth ≥ its cadence class (major/rare ≥4, notable ≥6,
  chronic ≥8-12), reading the kind's own Clock/significance entries. Lands
  with a FROZEN BACKLOG of the ~269 legacy single-voiced tokens (shrink-only
  ceiling — the EP burn-down idiom; the walker cannot red the estate at
  birth, and the legacy pools are the content annexes' wiring waves' work).
- **THE PHRASE-REPETITION ENVELOPE:** a soak instrument in the
  warConvergenceContract family (`src/domain/certification/`, 820-line file
  measured — new instrument lands as its own leaf): rendered-sentence repeats
  per settlement per season window under an authored band, with the executed
  collapse-mutant negative control (one-variant pool ⇒ envelope reds).
- **SP-6a/6b consumption:** `heraldFeed.js:95`'s ad-hoc significance read is
  RECORDED as the first migration target (a consumer census + shrink-only
  scale-spelling scan lands here; the actual display migration is each
  surface's own small wave — assessment first, the census names the debt).
- **Files touched:** test estate + one certification leaf + the census scan.
  Zero engine behavior changes; zero flags.
- **Pins:** the walker's own negative controls (unregistered kind reds;
  two-variant chronic kind reds exactly as an unregistered one — the
  constitution's sentence, executed); the envelope's mutant; the
  exactly-once doc pins on the family scales.
- **Dormancy:** n/a (no engine path) — declared in the ledger row.
- **Alignment line:** declared-empty with reason (measurement estate).
- **Edit verb:** n/a — recorded (test estate).
- **Collision map:** the certification directory is shared with the war
  lane's WR-9 instruments — additive files only, no edits to
  `warConvergenceContract.js`.

### SP-F — THE AGE-LAYER MARKING (declared NON-WAVE)
SP-8 owes this program exactly one obligation: every SP band row in §7 below
carries an ERA-PRESET-ELIGIBLE column (a preset may move only marked bands).
The preset tables, the drift/dwell/hysteresis machinery, and the ERA EVENTS
are J-D12's own owner-signed wave (`DESIGN_REALM_DIRECTIVES.md:1511`), NOT
built here. Deliberately deferred — documented, not a bug to re-find.

---

## §6 JUDGMENT BLOCKS (the SP architect's rulings under delegation — vetoable;
## an implementer NEVER re-rules these silently)

- **J-SP-1 (the axis seam):** SP-2 = new axes in the existing beliefAxes fold;
  no believed-world module, no second decay law. VETO builds a parallel
  believed-subjects partition.
- **J-SP-2 (the errand ledger stays):** SP-1 generalizes `envoyErrands` in
  place; the constitution's `spatialLedgers.errands` address is recorded as
  resolved-at-build. VETO migrates the ledger home (owner-gated persistence
  shape — goes to the owner, not to an implementer).
- **J-SP-3 (three axis flags, not one):** per-family flags let TRADE/POP/FAITH
  light their subjects independently, matching the corpus's per-volume
  lit-preconditions; the cost is two extra walker rows. VETO collapses to one
  `believedWorldEnabled` and accepts all-or-nothing lighting.
- **J-SP-4 (the appetite home):** the settlement appetite is a facet of
  dispositionStats under its one writer (J-WR-11's idiom). VETO mints
  `spatialLedgers.settlementAppetite` and accepts a new key + a second
  outcome-learning writer.
- **J-SP-5 (the posture export names stand):** `postureOf`/`riskToleranceOf`
  keep the constitution's spellings despite the measured roads collision
  (R3); module scoping disambiguates; the collision is documented at both
  sites. VETO renames SP's read (`riskAppetiteOf`) — which requires a
  constitution erratum, since five volumes bind the current name.
- **J-SP-6 (second-order belief has no flag):** a pure read with no writer
  and no land-time consumer ships dark by construction; INFO's consumers gate
  it. VETO adds `secondOrderBeliefEnabled` and its four-fence cost now.
- **J-SP-7 (SP-3 delegation):** SP builds nothing against the term catalog;
  GRAMMAR owns formation, families, and the one list. VETO pulls any GR wave
  forward into SP — and must then also own the catalogGrewSinceWr10 red and
  WR-10's re-widening in the same breath.
- **J-SP-8 (the legacy floor backlog):** the frequency-scaled floor lands
  shrink-only over the ~269 legacy tokens rather than redding the estate.
  VETO demands green-at-birth — which either blocks SP-E on a content program
  or invites floor-gaming stubs; both worse.

---

## §7 THE TUNING SURFACE (owner-signed at the soak redo, per THE PROMISE;
## every band ERA-PRESET-ELIGIBLE-marked per SP-F; none in proposedSoakBands
## until ratified)

SP-A: the shared half-life band table (the SP-5b shapes) · the SP-6a
significance family (scale itself, owner-signed ONCE) · the SP-6b severity
ladder. SP-B: per-family accuracy-adoption bars · scarcity good-class band
edges · conditions band edges (tier/stores/route-position/pull) · devotion
band edges — each family's rows marked era-eligible ONLY where J-D12's axes
name them. SP-C: appetite learn rates + the shared half-life instance row ·
posture composition weights · threshold caps (a posture COLOURS, never
drowns). SP-D: per-class interception weight deltas · the declared/true
divergence share band. SP-E: the phrase-repetition envelope band + the
season-window width · the frequency-cadence class boundaries.

## §8 SEAM CONTRACTS (pre-pinned toward unbuilt neighbors — the TR-5 pattern —
## and the already-pinned seams this program must honor, with their tripwires)

**Honored (existing pins SP must not disturb):**
1. `catalogGrewSinceWr10` (`sovereigntyBundle.js` +
   `tests/domain/sovereigntyBundleWr10.test.js`) — SP never grows
   TERM_CATALOG; the SP-A source scan proves no SP module can name a family.
   When GR-3 lands and the tripwire reds, that red is WR-10's re-widening
   instruction, not an SP defect.
2. The `beliefLegsFor` injectable seam (`sovereigntyMarketStage.js:311`) —
   SP-B2 supplies THROUGH it; the stage's composition is never edited by SP.
3. The K3 structural pin set (envoy/negotiation modules' import pins) — SP-B's
   axis arms feed `beliefRecord`, which those modules already read lawfully;
   no SP module joins the negotiation set.
4. The named-person transit totality walker — SP-D's mint leaf registers with
   it; the M speed floor binds every new purpose class by construction.
5. The engineGatedRuleKeys walker — every SP flag joins the list in its gate
   commit or the walker reds (mechanical, not promised).

**Pre-pinned by SP toward the unbuilt volumes (each with its tripwire):**
6. THE AXIS VOCABULARY CONTRACT (toward TRADE/POP/FAITH): SP-B pins the axis
   field names, band vocabularies, and closure BOTH ways (a closed-vocabulary
   pin SP-side; each volume's first consumer wave owes the its-side pin).
   Tripwire: an axis field spelled anywhere outside the SP-B vocabulary
   module reds the closure scan — writer/reader spelling drift dies at birth.
7. THE POSTURE CONSUMER CONTRACT (toward all five posture consumers + INT-1):
   the with/without-books golden pair IS the both-sides pin; lighting
   `seatBooksEnabled` is a pre-declared disclosed shift (INT-1's list carries
   it). Tripwire: a posture receipt that fails to name its input set reds.
8. THE ERRAND CONSUMER REGISTRY (toward GRAMMAR/TRADE/FAITH/INFO/INTERIOR):
   the frozen consumer map with the both-ways walker (SP-D). Tripwire: an
   unregistered minting consumer reds; a consumerless registry row reds.
9. THE APPETITE ACTOR-CLASS CLOSURE (toward TRADE's houses, FAITH's temples):
   `riskToleranceOf` reds on an unknown actor class rather than guessing;
   widening the class set is an explicit SP-4a amendment at the constitution,
   never a volume-local mint. Tripwire: the closed-set pin.
10. THE WR-10 LIGHTING RECEIPT (toward the war program): SP-B + SP-B2 landed
    = CR-WR10-H discharged; the WR-9 certification walker's lighting-order
    row cites those two wave ids as its green condition.
11. THE BAND-FAMILY RECONCILIATION (toward every volume's §7/§8): the SP-A
    walker grows one volume at a time; a volume shipping a Bands line without
    a table row (or vice versa) reds — the fourteen-drift class dies
    mechanically.

## §9 SEQUENCING + THE LIGHTING CONTRACT

Behind the sim-proof path, SP builds FIRST among the seven programs
(constitution §5: SP → GRAMMAR → INFO → TRADE → FAITH → POP → INTERIOR).
Internal order: **SP-A → SP-B → SP-B2 → SP-C → SP-D → SP-E** (A feeds C's
stock shape and E's families; B feeds B2; C and D are independent of each
other but D's projection rows read no posture — order kept for lane
serialization on the shared envoy files). Every wave dark; no SP flag is in
any standing lighting batch; SP flags light at the owner-signed soak redo, in
build order, with the axis flags requiring `beliefAxesEnabled` lit first (the
conjunction). THE WR-10 CONVERGENCE, stated once more for the record: the
exact waves that discharge `sovereigntyTradeEnabled`'s belief-legs
precondition (CR-WR10-H) are **SP-B (the conditions axis family) and SP-B2
(the beliefLegsOf supply)** — until both land, that flag's lighting row stays
red by design. The owner-held boundary is unchanged: soaks, lighting, tuning
ratification, pushes.

## §10 IMPLEMENTER PROTOCOL

The war volume's §10 binds verbatim (worktree/branch hard-gate; no
`git add -A`; stash forbidden; gates through `check:tail`/`gate-tail.sh`; one
wave = one commit; goldens captured before wiring; STOP-and-report on any
conflict; every claim CONFIRMED or labeled PLAUSIBLE). SP additions: (a) the
tree is LIVE with concurrent lanes on `beliefMap.js`, the envoy family, and
`sovereigntyMarketStage.js` — CHECK-GIT-FIRST before every edit session and
re-grep renamed symbols after; (b) python3 byte-scan every authored file (the
NUL class has bitten six times); (c) new tests in generation trees use
tests/helpers/{anchoredNegatives,seedFailures}.js; (d) the R1/R3 name
hazards (injected `alignmentOf`, roads `riskToleranceOf`) are quoted in the
relevant modules' headers so a grep-led successor cannot conflate them.

## §11 OPEN CHAIR QUESTIONS (max 4, each with recommendation)

- **Q1 — The errand ledger address (R2/J-SP-2):** keep `worldState.envoyErrands`
  as the generalized spine's home, or migrate to the constitution's
  `spatialLedgers.errands`? RECOMMENDATION: keep; record the constitution
  erratum; migration is persistence churn on a live save shape with zero
  behavioral payoff and a full lifecycle re-proof bill.
- **Q2 — The riskToleranceOf collision (R3/J-SP-5):** keep the constitution's
  export name beside roads' existing `riskToleranceOf(npc)`, or amend the
  constitution to `riskAppetiteOf`? RECOMMENDATION: keep the name,
  module-scoped, documented at both sites — five volumes already bind the
  spelling and an erratum cascade costs more than the disambiguation.
- **Q3 — The appetite home (J-SP-4):** dispositionStats facet (recommended:
  zero new keys, one writer, the learn/decay machinery already there) versus
  a new `spatialLedgers.settlementAppetite` family (cleaner separation of
  "who I am" from "what I risk", at the price of a key and a writer)?
  RECOMMENDATION: the facet; the conditional-field dormancy pin makes the
  lit-ledger risk provable.
- **Q4 — SP-2 flag granularity (J-SP-3):** three per-family axis flags
  (recommended: per-volume lighting independence, matching the corpus's
  lit-precondition grammar) versus one spine flag (fewer fences, coarser
  lighting)? RECOMMENDATION: three.
