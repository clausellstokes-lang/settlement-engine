# THE SHARED SUBSTRATE CENSUS — the ground all eight FP programs stand on

## Cross-program verification pass, 2026-08-04. Measured READ-ONLY against
## `.claude/worktrees/minifold`, branch `claude/composite-r4`, HEAD `3754c6f3`
## ("WR-10w wave close: the two proofs no single lane could make").
## Tree state at measurement: clean apart from two untracked test files
## (`tests/domain/sovereigntyWaveCloseIntegration.test.js`,
## `tests/property/sovereigntyWaveMultiYearDormancy.test.js`) — the wave-close lane's own.

**Status: CENSUS. Nothing here is a design ruling.** This document exists because eight FP
architects are each about to write a wave spec against the same substrate, and the WR-era
laws are unambiguous that a premise inherited rather than measured is how this estate's
worst defects have entered (the WR-7 wiring blocker measured wrong; the WR-9d year-boundary
census that reported an empty world; CR-WR10-B's amendment row that two documents each
believed the other had landed). Every row below carries its receipt.

**LIVE CODE OUTRANKS THIS TABLE.** The war volume's §2 says so and it is right for the same
reason here: this is a snapshot of a tree three concurrent lanes write. Re-verify anything
you build on, with the multi-spelling grep that found it.

**No test, gate, build or `npm` command was run.** The build wave was live. Every figure is
from a read, a grep, or a `python3` parse of a file, and the two parses each carry an
executed positive control (below). Where a figure could only come from a runner it is
labelled and left to the implementer.

---

## §0 METHOD, AND THE TWO CALIBRATIONS THAT MAKE THE COUNTS RECEIPTS

Two figures in this document are produced by scripts rather than by reading. An
uncalibrated parser is exactly the "analytic pin that recomputes the value it guards"
this estate has been bitten by, so each carries a positive control against a number the
tree itself asserts.

**Calibration 1 — the annex parser** (`annex_census.py`, this scratchpad dir). It counts
`^### <kind>` headings and `^N. ` rows per block. Positive controls, each an independent
count the annex declares in its own prose:

| Annex | Self-declared | Parser measured | |
|---|---|---|---|
| `RECEIPT_POOLS_TRADE.md`:136,156 | "one hundred seven kinds at seven hundred ninety variants" | 107 kinds / 790 variants | EXACT |
| `RECEIPT_POOLS_FAITH.md`:23,131 | "One hundred three kinds at seven hundred thirty-six variants" | 103 / 736 | EXACT |
| `RECEIPT_POOLS_COUPLINGS.md`:156 | "The census (23 phrased kinds)" | 23 | EXACT |
| `RECEIPT_POOLS_INTERIOR.md`:121 | "seventy-six phrased kinds" | 76 | EXACT |
| `RECEIPT_POOLS_POPULATIONS.md`:95 | "seventy phrased kinds" | 70 | EXACT |
| `RECEIPT_POOLS_WAR.md`:123 | "one hundred fifty-eight phrased kinds" | 158 (159 `###` blocks − 1 prose heading) | EXACT |
| `RECEIPT_POOLS_LEGACY.md`:2822 | "the census returned 200 of the spine's ~269" | 200 | EXACT |

Seven of seven. CONFIRMED.

**Calibration 2 — the effective-line parser** (`effective_lines.py`). `sizeBaseline.test.js`
measures with eslint's own `Linter` (`max-lines`, `skipBlankLines` + `skipComments`), and L8
says never inherit a figure. I cannot run eslint here, so the script approximates the same
strip and is calibrated against all ten entries of `scripts/.size-baseline.json`, which ARE
enforcer measurements:

```
   OK  src/App.jsx: baseline=650 approx=650 delta=+0
   OK  src/domain/explanation.js: baseline=827 approx=827 delta=+0
   OK  src/domain/worldPulse/applyWorldPulse.js: baseline=941 approx=941 delta=+0
   OK  src/domain/worldPulse/npcAgency.js: baseline=833 approx=833 delta=+0
   OK  src/domain/worldPulse/pulseKernel.js: baseline=1580 approx=1580 delta=+0
   OK  src/domain/worldPulse/roadsKernel.js: baseline=838 approx=838 delta=+0
   OK  src/domain/worldPulse/settlementStrategy.js: baseline=812 approx=812 delta=+0
   OK  src/domain/worldPulse/warTermination.js: baseline=818 approx=818 delta=+0
   OK  src/generators/npcGenerator.js: baseline=1350 approx=1350 delta=+0
   OK  src/store/settlementSlice.js: baseline=994 approx=994 delta=+0
   VERDICT: 10/10 exact — approximation is calibrated
```

Ten of ten, zero delta. The §5 numbers are therefore CONFIRMED as *approximation-with-a-
ten-point-exact-control*, not as enforcer output. **An implementer who is about to spend a
file's last three lines still re-measures with the enforcer at the publishing commit** —
that is L8, and the calibration does not retire it.

---

## §1 THE ANNEX WIRING SURFACE — twelve annexes, 9,072 authored variants,
## and SEVEN OF THE EIGHT FP ANNEXES ARE READ BY NOTHING

### 1a The corpus, measured

| Annex | Kinds | Authored variants | Depth min–max | Forwarded to LEGACY | Below its SP-6 floor |
|---|---|---|---|---|---|
| `RECEIPT_POOLS_TRADE.md` | 107 | 790 | 5–10 | 0 | **0** |
| `RECEIPT_POOLS_FAITH.md` | 103 | 736 | 4–10 | 0 | **0** |
| `RECEIPT_POOLS_INTERIOR.md` | 76 | 498 | 5–9 | 0 | **0** |
| `RECEIPT_POOLS_POPULATIONS.md` | 70 | 508 | 5–9 | 0 | **0** |
| `RECEIPT_POOLS_GRAMMAR.md` | 66 | 456 | 4–8 | 0 | **0** |
| `RECEIPT_POOLS_INFORMATION.md` | 64 | 489 | 6–9 | 0 | **0** |
| `RECEIPT_POOLS_COUPLINGS.md` | 23 | 202 | 5–10 | 0 | **0** |
| `RECEIPT_POOLS_WAR.md` | 158 | 773 | 5–12 | **23** | **0** |
| `RECEIPT_POOLS_LEGACY.md` | 200 | 1,474 | 4–14 | — | **0** |
| `RECEIPT_POOLS_CAUSAL.md` | 89 | 743 | 6–24 | 0 | n/a (no significance field) |
| `RECEIPT_POOLS_CAUSAL_DOSSIER.md` | 80 | 473 | 2–6 | 0 | n/a |
| `RECEIPT_POOLS_DOSSIER_STATE.md` | 55 | 1,930 | 5–96 | 0 | n/a |
| **TOTAL** | | **9,072** | | 23 | **0** |

The floors applied are SP-6's frequency-scaled amendment, quoted verbatim from
`docs/DESIGN_FP_SPINE.md`:264-269:

> the flat ≥4 floor is the MINIMUM for rare/major kinds only; variant depth scales with
> FIRING CADENCE … chronic/routine kinds (weekly-to-seasonal cadence) carry ≥8–12
> angle-distinct variants; notable ≥6; major/rare ≥4.

**ZERO kinds sit below their scaled floor in any annex.** The content program's completion
claim survives an independent re-count. There is no authoring debt in the corpus.

### 1b THE FINDING: the FP annexes are UNWIRED, and it is not a small gap

`grep -rln 'RECEIPT_POOLS_<X>.md' src tests scripts`, per annex:

| Annex | Read by |
|---|---|
| `RECEIPT_POOLS_WAR.md` | `tests/helpers/receiptAnnex.js`, `scripts/mutation-coverage-manifest.json`, `src/domain/worldPulse/warReceiptPools.js`, `sovereigntyReceiptPools.js`, `sovereigntyNews.js` |
| `RECEIPT_POOLS_LEGACY.md` | 4 kind-pool walkers, 3 rumor-pool tests, `tests/helpers/receiptAnnex.js`, the mutation manifest, `settlementRumors.js`, `rumorPhrasePools.js`, `rumorFallbackPhrasePools.js`, `rumorFallbackPhrasePoolsEvents.js` |
| `RECEIPT_POOLS_CAUSAL.md` | `heraldCausalGrammar.js`, `heraldIntegrity.js`, `heraldJoinMolds.js`, `tests/domain/heraldIntegrity.test.js` |
| `RECEIPT_POOLS_CAUSAL_DOSSIER.md` | `scripts/generate-dossier-state-prose.mjs`, `dossierCausalProse.generated.js`, `causalDossierProse.js`, one contract test |
| `RECEIPT_POOLS_DOSSIER_STATE.md` | the same generator + six `dossierStateProse/*.generated.js` + `stateProseKernel.js` |
| **`RECEIPT_POOLS_TRADE.md`** | **nothing** |
| **`RECEIPT_POOLS_FAITH.md`** | **nothing** |
| **`RECEIPT_POOLS_GRAMMAR.md`** | **nothing** |
| **`RECEIPT_POOLS_INFORMATION.md`** | **nothing** |
| **`RECEIPT_POOLS_INTERIOR.md`** | **nothing** |
| **`RECEIPT_POOLS_POPULATIONS.md`** | **nothing** |
| **`RECEIPT_POOLS_COUPLINGS.md`** | **nothing** |

**3,679 authored variants across 509 kinds** (TRADE 790 + FAITH 736 + POPULATIONS 508 +
INTERIOR 498 + INFORMATION 489 + GRAMMAR 456 + COUPLINGS 202) sit in annexes that **no
source file consumes and no walker addresses.** Each of the seven FP programs will be the
FIRST lane to wire its own annex.

Two consequences every FP wave spec must carry:

1. **The address class is unclosed for seven annexes.** `tests/helpers/receiptAnnex.js`
   is THE one reader — line-anchored regexes asserted to match exactly once, every failure
   a THROW — and it is hard-wired to two URLs (`WAR_ANNEX_URL` and a module-private
   `LEGACY_ANNEX`). A GRAMMAR or FAITH lane that hand-rolls `indexOf` slicing re-mints the
   two defects WW-G measured and cured: *the address lie* (a pointer block carries no
   numbered rows, the extractor returns `[]`, the pin reddens against emptiness — 13 rows
   across 3 walkers) and *the first-match hole* (`indexOf('# WR-7')` matches `## WR-7a`).
   **The FP annex readers must extend `receiptAnnex.js`, not fork it**, and the extension
   is a shared prerequisite, not each lane's private cost.
2. **The volumes do not name their annexes.** `grep -o 'RECEIPT_POOLS_[A-Z_]*\.md'` over
   `docs/DESIGN_FP_*.md` returns **one hit in eight volumes**: `DESIGN_FP_SPINE.md`:454 →
   `RECEIPT_POOLS_DOSSIER_STATE.md`. The COUPLINGS/FAITH/GRAMMAR/INFORMATION/INTERIOR/
   POPULATIONS/TRADE volumes never name the annex that carries their prose. The binding is
   convention. Nothing reds if an annex is renamed, relocated, or never wired at all.

### 1c The one-kind-one-pool forward, and why it matters to a new lane

`RECEIPT_POOLS_WAR.md` carries exactly **23** `→ pool lives in RECEIPT_POOLS_LEGACY.md`
forwards (`grep -c`, and it is the only annex with any). The relocated shape is RICHER than
the war-volume shape: 7–9 rows of which the wired subset is tagged `` `[live, verbatim]` ``
and every row declares its own `` `requiredSlots: [...]` ``. The FP annexes today carry
NEITHER tag. **A wave that wires an FP pool decides which shape it is authoring against,
and the walker's orthogonal witness (registry `requiredSlots` vs. the annex's own
declaration) only exists in the richer one.** Choosing the flat shape means the walker can
prove the count but not that the RIGHT rows were selected — which is the hole WW-G's
"selecting the wrong five would still render five plausible sentences" names.

---

## §2 THE BELIEF SURFACES TODAY — one of four legs exists,
## and it is the lighting precondition for more than WR-10

### 2a What `BeliefRecord` actually carries

`src/domain/worldPulse/beliefMap.js`:335-346, verbatim:

```
 * @typedef {Object} BeliefRecord
 * @property {number} readiness        believed war readiness 0..1
 * @property {number} strengthBand     believed strength band 0..STRENGTH_BANDS-1
 * @property {string} allianceLabel    believed relationship label (observer↔subject)
 * @property {string | null} faithLabel believed dominant faith (public deity name)
 * @property {number} confidence01     0..1
 * @property {number} lastUpdateTick   tick of the last refresh
 * @property {{kind:'envoy_silence',errandId:string,sinceTick:number,
 *   priorAllianceLabel:string,priorLastUpdateTick:number}} [hostilityInference]
 * @property {number} [populationTrendBand]  D-1 DEMOGRAPHIC axis: believed −2..+2 (emptying…swelling); present only when beliefAxesEnabled
 * @property {string | null} [observanceLabel]  D-1 CULTURAL axis: believed dominant rite `${motif}:${patron}`; present only when beliefAxesEnabled
```

So the **banded** legs are exactly two, plus one optional:

- `strengthBand` — an integer 0..4 (`const STRENGTH_BANDS = 5;`, beliefMap.js:159). Always present.
- `populationTrendBand` — integer −2..+2, **present only when `beliefAxesEnabled`**.
- `observanceLabel` — categorical (`motif:patron`), same flag, same conditionality.

`readiness` and `confidence01` are raw 0..1 floats and are NOT banded. **L5 applies at every
consumer**: a receipt that speaks `readiness` speaks a float, and no band exists to say it
in words. An FP program that wants to narrate believed readiness mints the ladder itself —
and J-WR-10-B's rule binds that mint (*"J-WR-10 forbids a SECOND spelling of an existing
concept"*): borrow before minting, and if you mint, say in the spec why nothing existed.

### 2b What `NEGOTIATION_SUBJECT_BANDS` carries

`src/domain/worldPulse/negotiationPictures.js`:32-43 — ten banded fields over four ladders:

| Field | Ladder | Members |
|---|---|---|
| `strengthBand` | STRENGTH | `unknown · spent · strained · ready · strong · dominant` |
| `storesBand` | STORES | `unknown · bare · thin · stocked · deep` |
| `foodPressureBand` `economyPressureBand` `tradePressureBand` `threatBand` `allyStrengthBand` `restitutionClaimBand` `warExhaustionBand` | PRESSURE (one shared ladder, seven fields) | `unknown · quiet · present · pressing · decisive` |
| `alignmentPressBand` | ALIGNMENT | `unknown · merciful · measured · hard · punitive` |

Two more closed vocabularies live beside them but are NOT in the bands map: `ARCHETYPES`
(`unknown · merchant · military · religious · other`) and `CAUSE_STATUSES`
(`unknown · dissolved · anchor_unavailable · live`).

**The structural fact that matters to every FP program: these bands live inside an ERRAND.**
`negotiationPictures.js` is a stateless wrapper over `peaceTerms.js`'s leaves; a picture
exists only while two courts are negotiating. Its two live consumers are
`envoyInterceptionStage.js`:43,249 and `armyTransitKernel.js`:51,435. **There is no
(observer, subject) query that returns these bands** the way `beliefRecord(world, a, b)`
does. An FP program that wants a believed stores or pressure reading for an arbitrary pair
does not have one.

### 2c The four appraisal-class legs — three exist NOWHERE

Multi-spelling grep (`tierBand|believedTier|tier_band`, `routeBand|believedRoute|
route_band|routePositionBand`, `storesBand`, `trajectoryBand|populationTrendBand`) over
`src tests scripts`:

| Leg | Producer in `src/` | State |
|---|---|---|
| `trajectoryBand` | `sovereigntyMarketStage.js`:157-166 `beliefLegsOf`, from `beliefRecord().populationTrendBand` | **EXISTS**, and only when `beliefAxesEnabled` |
| `storesBand` | `negotiationPictures.js` / `envoyDiplomacy.js`:408 / `envoyNegotiationPictureBuilder.js`:232 — all INSIDE an errand | **ERRAND-SCOPED**; no arbitrary-pair read |
| `tierBand` | none. Every `src/` hit is the CONSUMER's declared input shape (`sovereigntyAppraisal.js`:228,287,297,306) or `rulingPower.js`'s unrelated private `tierBand(tier)` helper | **NOWHERE** |
| `routeBand` | none. Every `src/` hit is the consumer's input shape (`sovereigntyAppraisal.js`:230,287,299,308) | **NOWHERE** |

The war volume states the precondition; `docs/DESIGN_WAR_RULINGS_ARCHITECTURE.md`,
the "**THE WR-10 LIGHTING PRECONDITION**" paragraph (navigate by heading — the
hand-keyed :1616-1633 range rotted +17 at the queue fold), verbatim:

> **THE WR-10 LIGHTING PRECONDITION (added 2026-08-04, chair ruling CR-WR10-H — closing a
> dead-lighting trap in writing):** `sovereigntyTradeEnabled` lights only AFTER the belief
> surfaces carry the appraisal's four legs — believed tier, believed stores, believed route
> position and the believed demographic trajectory. Measured at the wiring wave, exactly ONE
> of the four exists for an arbitrary (court, holding) pair: `beliefRecord`'s
> `populationTrendBand` (present only when `beliefAxesEnabled`, and mapping exactly onto the
> trajectory ladder). The negotiation picture's `storesBand` lives inside an ERRAND, so it
> exists only while two courts are already negotiating; believed tier and believed route
> position have no surface at all. Three legs missing ⇒ `appraiseSettlementAsset` returns
> `known: false` ⇒ the market clears NOTHING and emits an honest receipted no-trade. Lighting
> the flag before the belief-legs wave (queued) would therefore light a market that can never
> trade — a subsystem that is dark by arithmetic while its flag says lit, which is worse than
> a flag that is off.

**This is NOT a WR-10-only precondition, and no FP volume records it.** The queued
belief-legs wave is a shared dependency of every FP program that prices, appraises,
compares or narrates what a court BELIEVES about a settlement it does not own — which
reads, on the volume list, as at least TRADE (a house valuing a market it has not visited),
INFORMATION (credibility over a believed state), COUPLINGS (any cross-layer read whose
source is a rival's picture) and GRAMMAR (a causal clause whose subject is a believed
condition). **Every FP wave that consumes a believed leg must state which of the four it
needs and whether it degrades or blocks**, and the answer "it degrades" must be mechanical,
not promised — the `sovereigntyBundle` precedent (§3 of the war volume): derive the
component set at call time so a leg that does not exist cannot be named.

The seam is already injectable and should be reused, not re-cut:
`sovereigntyMarketStage.js`:311 takes `beliefLegsFor = beliefLegsOf` as an argument
precisely so the belief-legs wave "can supply them without touching this file"
(`sovereigntyMarketStage.js`:63-67).

### 2d The K3 pin geometry an FP belief consumer inherits

Two shapes are already ruled and an FP lane picks one, never invents a third:

- **Zero-import appraisal leaf.** `sovereigntyAppraisal.js` takes already-banded WORDS and
  is pinned at zero imports. A leaf that scores from bands is the K3-clean shape.
- **Pinned-import composer.** `sovereigntyMarketStage.js` assembles the words from a belief
  map and is therefore OUTSIDE the zero-import set; its OWN import list is pinned instead
  (the P4 no-hidden-governor pattern). Its header states the rule that binds every FP
  composer: *"It NEVER backfills a counterpart's leg from true state — that is the one
  translation K3 exists to forbid, and doing it here would make the belief seam a
  decoration."*

---

## §3 THE PLANS-LANE DISCIPLINE — one ladder, one writer, and exactly one
## cross-program consumer today

### 3a The `demographicsPlans.js` header law (the four clauses, as written)

`src/domain/worldPulse/demographicsPlans.js`:1-61. The header is the contract; an FP wave
that touches the plans lane is bound by all four:

1. **THE DEFECT §5c EXISTS TO PREVENT** — *"A response chosen every tick is not a decision,
   it is weather."* The draw fires on a band CROSSING; the selection becomes ONE PERSISTENT
   PLAN (`proposed → underway → completed | failed | abandoned`) with startup cost,
   duration, progress, named failure conditions, a reconsideration threshold that is a
   band-crossing MAGNITUDE rather than drift, a cooldown, and a receipt naming why.
   **ONE active plan per settlement.** *"This is not a general planning system and must not
   become one."*
2. **ASK P2 FIRST, ALWAYS** — the lane runs AFTER the homeostat in the same tick and is
   handed its per-origin answer. *"A realm with empty houses in it does not mint
   settlements."*
3. **THE FOUNDING ITSELF IS NOT WRITTEN HERE (single writer)** — a completed satellite plan
   emits an INTENT; the steading is minted by `mintSteading` in
   `settlementLifecycleKernel.js`. *"Forking a second mint here would have been the fastest
   way to make the two foundings silently disagree about what a steading is."* **AND
   NEITHER IS THE TIER LADDER** — a completed promotion plan raises no tier; the transition
   has one writer already (tier drift's eligibility).
4. **ZERO PRNG STREAMS** — *"Not one draw is taken from any fork."* The response race is
   per-response keyed hash; the site pick is keyed by the episode; provisioning is
   arithmetic. P1's pin that each settlement consumes EXACTLY TWO draws from
   `demographics:<id>` still holds with this lane lit.

This is L1 and L4 in one header, and it is the closest thing the estate has to a worked
example of a wave that adds a persistent record without adding a writer. **An FP wave that
mints state should read it before writing its own Lifecycle-paths clause.**

### 3b The ONE pressure ladder — definition and total consumer census

`src/domain/worldPulse/demographicsResponses.js`:88-116:

```js
export const OVERFLOW_BANDS = Object.freeze(['easy', 'filling', 'pressed', 'overflowing']);
export const OVERFLOW_DEMAND_BAND = 'pressed';
export const OVERFLOW_THRESHOLDS = Object.freeze({ filling: 0.70, pressed: 0.88, overflowing: 1.05 });
export function overflowBandOf(pressure01) { … }
export function overflowRankOf(band) { … }
export function bandDemandsResponse(band) { return overflowRankOf(band) >= overflowRankOf(OVERFLOW_DEMAND_BAND); }
```

**Dead-band check, executed by reading the arithmetic (the memory-recorded ratio-band
class):** `pressureOf` (`demographicsRates.js`:446-449) returns
`clamp(pop / max(1, bound), 0, T.PRESSURE_MAX)` with `PRESSURE_MAX: 2`
(`demographicsRates.js`:233). The top rung fires at ≥1.05 and the read can reach 2.0, so
**all four rungs are arithmetically reachable.** No dead band here. (Recording the negative
result deliberately: the class has bitten this estate three ways, and "checked, clean" is
a receipt an FP architect should not have to re-derive.)

**Total consumers in `src/`, both functions, measured:**

| Symbol | Consumers |
|---|---|
| `overflowBandOf` | `demographicsPlans.js`:80,364 (the owner) · `sovereigntyMarketStage.js`:92,286 |
| `bandDemandsResponse` | `demographicsPlans.js`:78,523 (the owner) · `sovereigntyMarketStage.js`:92,352 |
| `plansLedgerOf` | `demographicsPlans.js` (self) · `sovereigntyMarketStage.js`:93,336 |

**Exactly ONE non-owner consumer exists, and it is WR-10's market stage.** Its header states
the rule it entered under (`sovereigntyMarketStage.js`:8): *"shares the ONE pressure ladder
(`overflowBandOf` / `bandDemandsResponse` — J-WR-10-B)"*. The ruling itself
(`docs/FABLE_VALIDATION_QUEUE.md`:1766-1774) reads:

> **J-WR-10-B (vetoable) — ONE LADDER WAS MINTED.** Three input ladders are borrowed
> VERBATIM (tier ← `TIER_ORDER`, stores ← the negotiation picture's `storesBand`, route ←
> `ROUTE_FLOW_BANDS`) and the firesale reads `WAR_COST_TRAJECTORIES`, each pinned equal to
> its source. The DEMOGRAPHIC growth/decline DIRECTION was minted: no direction ladder
> exists to borrow (`OVERFLOW_BANDS` is a pressure LEVEL). J-WR-10 forbids a SECOND
> spelling of an existing concept; minting a synonym for `OVERFLOW_BANDS` would have been
> the violation.

Note the distinction the ruling turns on and that an FP lane will meet again: **`OVERFLOW_BANDS`
is a LEVEL, not a DIRECTION.** A program needing "growing / shrinking" borrows
`SOVEREIGNTY_TRAJECTORY_BANDS` or `populationTrendBand`; a program needing "how full"
borrows `OVERFLOW_BANDS`. Reading the wrong one is a silent semantic error no walker
catches.

**⚠ NOTHING ENFORCES THE SINGLE LADDER.** There is no walker, no source-scan census, no
shrink-only ratchet over `OVERFLOW_BANDS` spellings. The discipline is J-WR-10-B plus two
header comments. With seven FP programs about to read pressure, the structural-prevention
move — a shrink-only census of pressure-ladder mints, in the style of the satellites-writer
census that ratcheted 2→1 under CR-WR10-I — is worth pricing into whichever FP wave reads
pressure first. Recorded as an observation, not a ruling.

### 3c Wider pressure readers (`pressureOf`, unbanded)

`migrationKernel.js`:121 · `demographicsPlans.js`:363 · `demographicsWar.js`:118,171 ·
`demographicsRisk.js`:164 · `demographicsKernel.js`:285 · `sovereigntyMarketStage.js`:286.
Seven sites read the raw 0..1; only two band it. **L5 note:** a receipt sourced from
`pressureOf` without `overflowBandOf` is a float on a surface.

---

## §4 THE VIRTUAL-FLAG MANIFESTS, VERBATIM

### 4a `ENGINE_GATED_VIRTUAL_RULE_KEYS` — five members

`src/domain/worldPulse/simulationRules.js`:185-194, verbatim:

```js
export const ENGINE_GATED_VIRTUAL_RULE_KEYS = Object.freeze([
  'beliefAxesEnabled',
  'conquestDoctrineEnabled',
  'infoStatecraftEnabled',
  'migrationRumorsEnabled',
  // Joined 2026-08-04 by lane WW-A under CR-WR10-C item 4, in the SAME commit as its
  // first real gate read (sovereigntyAssets.sovereigntyTradeActive) and its
  // certification row — certification tracking reality instead of preceding it.
  'sovereigntyTradeEnabled',
]);
```

The membership law, from the same file (:175-181): *"MEMBERSHIP IS NOT A JUDGMENT CALL: a
key belongs here when `src/` gates on it with the strict idiom and neither surface above
declares it."* The list is UNIONED INTO THE CENSUS ONLY — *"Nothing here is written into a
rules object, spread into a preset, or persisted."* Each member owes a certification row in
`src/domain/certification/subsystemRowsVirtual.js` (all five present: rows at :57, :109,
:157, :209, :249).

`PENDING_MANIFEST_KEYS` is **empty** (`engineGatedRuleKeys.walker.test.js`:151) — emptied by
WW-A, which is the atomicity mechanism working: the wiring lane landed the gate, the walker
went red with all three of its failure modes naming the key, and the same commit moved it in.

### 4b `EXEMPT_RULE_KEYS` — one member

`tests/lint/engineGatedRuleKeys.walker.test.js`:82-92. `routineMajorApproval`, with a
recorded rationale: *"NOT A SUBSYSTEM — an opt-in campaign ROUTING POLICY … it moves no
world state of its own and owns no vocabulary … Exempt BY RECORDED RATIONALE, never by
silence."*

### 4c `BACKLOG_RULE_KEYS` — seventeen members, SHRINK-ONLY, asserted EXACT

`tests/lint/engineGatedRuleKeys.walker.test.js`:109-127, verbatim:

```js
const BACKLOG_RULE_KEYS = Object.freeze({
  assizeEnabled: 'THE ASSIZE — a pulse-tick kernel behind its own virtual flag (worldPulse/assizeKernel.js).',
  commonsVoiceEnabled: "THE COMMONS' VOICE — a pulse-tick kernel behind its own virtual flag (worldPulse/commonsVoiceKernel.js).",
  contestedGoalsEnabled: 'D-4 CONTESTED GOALS — an npc-ladder sub-layer behind its own virtual flag (worldPulse/npcLadderKernel.js).',
  corruptionWebEnabled: 'THE CORRUPTION WEB — beliefs-conjoined, behind its own virtual flag (worldPulse/corruptionWeb.js).',
  discourseProseEnabled: 'DISCOURSE PROSE — a display kernel consumed only behind its own virtual flag (display/discourseKernel.js).',
  economicCoupReadEnabled: 'THE ECONOMIC COUP READ — a coup-verdict term behind its own virtual flag (worldPulse/coup.js).',
  heirsEnabled: 'V-7 HEIRS-LITE — an npc-ladder sub-layer behind its own virtual flag (worldPulse/npcLadderKernel.js).',
  heraldCausalVoiceEnabled: 'THE HERALD CAUSAL VOICE — a display layer dark behind its own virtual flag (display/heraldCausalVoice.js).',
  intelTradeEnabled: 'D-3 THE INTEL LANE — the bounded event-driven belief trade (spatial/intelActs.js).',
  ladderPoliticalWindowsEnabled: 'LADDER POLITICAL WINDOWS — an npc-ladder sub-layer behind its own virtual flag (worldPulse/npcLadderKernel.js).',
  memoryWeaveEnabled: 'THE MEMORY WEAVE — a relationship-evolution layer behind its own virtual flag (worldPulse/relationshipEvolution.js).',
  migrationCorruptionPushEnabled: 'THE MIGRATION CORRUPTION PUSH — a migration multiplier dark at x1 (worldPulse/migrationKernel.js).',
  neutralNeighborsEnabled: 'NEUTRAL NEIGHBOUR EDGES — a region-layer edge class behind its own virtual flag (region/neutralNeighbourEdges.js).',
  npcCredibilityEnabled: 'THE PER-NPC CREDIBILITY LAYER — behind its own virtual flag (worldPulse/npcCredibility.js).',
  seaRoadsEnabled: 'D-6 SEA ROADS — a roads layer dark behind its own virtual flag (roads/seaRoads.js).',
  thirdPartyRansomEnabled: 'D-5 THIRD-PARTY RANSOM — a roads layer dark behind its own virtual flag (roads/thirdPartyRansom.js).',
  upswingHazardReadEnabled: 'THE UPSWING HAZARD READ — a piety multiplier dark at x1 (worldPulse/piety.js).',
});
```

The cap is asserted at `≤ 17` (:453) and the set is asserted EXACT (:448). The header rule
(:105-107): *"a key leaves only by joining the manifest (with its row) or the exempt list
(with its rationale), and a NEW dark gate cannot join — it reds as unaccounted until
somebody decides which it is."*

**⚠⚠ THE HOLE EVERY FP LANE WILL MEET, recorded at :141-149 by the lane that hit it.** The
gate scanner `GATE_RE` (:207) matches only the dot-access idiom
(`/\b(?:rules|simulationRules)\s*\)?\s*\??\.\s*([A-Za-z_$][\w$]*)\s*===\s*true/g`). The WR-10
wiring lane first spelled its gate as a conjunction over a frozen rule list —
`REQUIRED_RULES.every((key) => rules[key] === true)` — a COMPUTED member access that
*"attributes to no key at all: the flag was fully wired, genuinely engine-gated, and
invisible to this walker, which stayed green."* The lane cured it locally by also reading
its own flag BY NAME. **The class is open.** L2's instruction — *always land one by-name
read* — is not style advice; it is the only thing keeping a new FP flag visible to the
certification census. Widening `GATE_RE` is recorded there as a chair decision, not a lane
one.

**Scale note for FP flag budgeting:** the walker measures **51** gate-read keys in `src/`
against 5 manifested + 1 exempt + 17 backlog = 23 accounted virtual keys; the balance are
DECLARED in `DEFAULT_SIMULATION_RULES` or a preset spread and were already census-visible.
The header records that the chair's own pre-ruling census measured 18 and that
CR-WR10-C's "blast radius is FIVE keys" was computed on the smaller number — *the cast is a
gate*, and fifteen of the seventeen backlog keys use the JSDoc-cast spelling. **An FP
architect estimating "how many flags does my program add to the certification bill" should
quote 51, not 18.**

---

## §5 THE HOT-FILE SIZE GROUND (L8)

All figures below are the calibrated approximation of §0's Calibration 2; the layer ceiling
is **800** for every `src/domain/**/*.js`, `src/generators/**`, `src/store|lib|hooks|utils/**`,
and 600 for `src/components/**.jsx` + `src/*.jsx`. `sizeBaseline` is **tolerance-zero in both
directions** — over reds eslint, under reds the house test until the number is LOWERED.

### 5a The named hot files

| File | Effective | Headroom to 800 | Note |
|---|---|---|---|
| `src/domain/worldPulse/peaceTerms.js` | **776** | **+24** | decomposed 1680→765 by the war tranche; has since grown +11. NOT baselined — the layer ceiling guards it. |
| `src/domain/worldPulse/beliefMap.js` | **773** | **+27** | not baselined |
| `src/domain/worldPulse/informationStatecraft.js` | **763** | **+37** | not baselined |
| `src/domain/worldPulse/settlementLifecycleKernel.js` | 721 | +79 | CR-WR10-I moved the satellites LEDGER half out to `satellitesLedger.js`; the RECORD shape stays here |
| `src/domain/worldPulse/negotiationPictures.js` | 512 | +288 | |
| `src/domain/display/settlementRumors.js` | 482 | +318 | |
| `src/domain/worldPulse/demographicsPlans.js` | 374 | +426 | |
| `src/domain/realm/heraldRouting.js` | 246 | +554 | note the path: `src/domain/realm/`, not `src/domain/display/` |
| `src/domain/worldPulse/demographicsResponses.js` | 232 | +568 | |
| `src/domain/worldPulse/sovereigntyMarketStage.js` | 223 | +577 | |
| `src/domain/worldPulse/sovereigntyAppraisal.js` | 160 | +640 | |
| `src/domain/worldPulse/beliefAxes.js` | 95 | +705 | |

**The three FP programs will graze first — `peaceTerms` (+24), `beliefMap` (+27),
`informationStatecraft` (+37) — have less than fifty lines between them and a red gate.**
Any FP wave adding a read to those three budgets a lazy leaf in the same commit (L8: new
logic is a lazy leaf; hot files at ceiling get an extraction FIRST).

### 5b ⚠⚠ FIVE FILES SIT WITHIN THREE LINES OF THE CEILING

Full sweep of `src/{domain,generators,store,lib,hooks,utils,pdf}/**/*.js` in the band
740–800 effective — 28 files. The top of that list is the finding:

| Effective | Headroom | File |
|---|---|---|
| **800** | **0** | `src/domain/worldPulse/generosityKernel.js` |
| **799** | **+1** | `src/generators/generationReceiptJudgments.js` |
| **798** | **+2** | `src/domain/worldPulse/convergence.js` |
| **798** | **+2** | `src/domain/worldPulse/armyTransitKernel.js` |
| **797** | **+3** | `src/domain/worldPulse/envoyDiplomacy.js` |
| 796 | +4 | `src/domain/certification/behavioralContract.js` |
| 791 | +9 | `src/generators/economy/economicState.js` |
| 787 | +13 | `src/domain/realm/realmItemReadModel.js` |
| 785 | +15 | `src/lib/contentPacks.js` |
| 784 | +16 | `src/lib/campaigns.js` |
| 784 | +16 | `src/domain/worldPulse/institutionLifecycle.js` |
| 781 | +19 | `src/store/campaignSlice.js` |
| 780 | +20 | `src/domain/townScene/manifestRecordValidation.js` |
| 776 | +24 | `src/domain/worldPulse/peaceTerms.js` |
| 773 | +27 | `src/domain/worldPulse/beliefMap.js` |
| 771 | +29 | `src/lib/gallery.js` |
| 771 | +29 | `src/domain/events/mutateWorld.js` |
| 763 | +37 | `src/domain/worldPulse/informationStatecraft.js` |
| 761 | +39 | `src/lib/customContentServiceRuntime.js` |
| 759 | +41 | `src/domain/worldPulse/stressorDynamics.js` |
| 757 | +43 | `src/store/aiSlice.js` |
| 753 | +47 | `src/domain/content/reviewedSupplyChainPersistence.js` |
| 752 | +48 | `src/domain/worldPulse/factionCompetition.js` |
| 751 | +49 | `src/domain/worldPulse/eventProse.js` |
| 748 | +52 | `src/generators/narrativeGenerator.js` |
| 745 | +55 | `src/lib/customContentLocalLedger.js` |
| 742 | +58 | `src/domain/worldPulse/warCoalitionSettlement.js` |
| 740 | +60 | `src/domain/worldPulse/relationshipRulesCore.js` |

`generosityKernel.js` at **exactly 800 with zero headroom** is the sharpest fact in this
section: it is NOT baselined (so the layer rule guards it), it imports `BeliefRecord`, and
**one effective line reds the gate.** `armyTransitKernel.js` (+2) is the M speed-floor spine
and imports `NEGOTIATION_SUBJECT_BANDS`; `envoyDiplomacy.js` (+3) writes `storesBand`. All
three are exactly the files a belief-legs or FP-INFORMATION wave reaches for.

`eventProse.js` at 751 (+49) deserves a note of its own: it is the SHAPE PRECEDENT the
annexes name (`WAR_RECEIPTS`, a per-type pool seeded on a stable entity key) and the war
tranche already decomposed it 1334→751. **The seven unwired FP annexes cannot all land
their pools in it.** Each FP program's pools want their own leaf module from the first
commit — `warReceiptPools.js` / `sovereigntyReceiptPools.js` are the pattern.

### 5c The two files that receive ZERO edits, ever

`pulseKernel.js` **1580 — BANKED PERMANENTLY** by chair ruling R-BLD-10, recorded verbatim
in `scripts/.size-baseline.json`. It is a CEILING, not debt: *"the 800 layer ceiling was
proved STRUCTURALLY UNREACHABLE… extracting the ENTIRE `consequence_fold` body — the
largest stage, 718 effective — still lands the head at 864."* And the reason it stops
there: *"the kernel's PRNG call order IS the stream identity ('a seed is a world,
forever')… That trade is refused."* It carries 22 `rng.fork` sites (the circulating figure
of 54 is corrected in that same key).

`applyWorldPulse.js` **941 — baselined, STILL OVER 800 BY 141**, and the residue is inside
`applyWorldPulseOutcomes` itself: *"banked debt, not this commit's work."*

**L1's instruction stands unqualified: FP waves mount through the lifecycle host
(own-flag-before-host-gate), the treaty mint folds, or the mover seam. Neither file is
edited.**

---

## §6 THE SP-6 KIND-POOL WALKER STATE, POST-WW-G

### 6a What WW-G closed (`398f26bc`, "Lane WW-G (D-W1)")

Four walkers — `warRulingKindPools`, `warCoalitionKindPools`, `warCostKindPools`,
`envoyKindPools` — each hand-rolled an `annexLines(kind)` that sliced
`RECEIPT_POOLS_WAR.md` with `indexOf`. Two defects rode in that shape; both are now cured
at one chokepoint, `tests/helpers/receiptAnnex.js` (182 lines, 8/8 own tests green per the
commit body):

- **The address lie** — the one-kind-one-pool merge relocated 23 pools and left a forward
  pointer; a pointer block carries no numbered rows, the extractor returned `[]`, and the
  comparison reddened against emptiness. **13 rows across 3 walkers.** Cured: the reader
  follows the forward and parses the richer legacy shape, selecting the
  `` `[live, verbatim]` `` rows and returning the annex's own `requiredSlots` as an
  orthogonal witness against the registry's parallel array (all 13 kinds match today,
  measured).
- **The first-match hole** — `indexOf('# WR-7')` matches `## WR-7a`. Cured at all four
  sites: every anchor is a line-anchored regex asserted to match EXACTLY ONCE, and every
  failure THROWS. *"An extractor that returns `[]` is the bug; this one cannot."*

Executed receipts from the commit body (violation ROWS diffed against a git-archive of base
`106df58e` — the L7 attribution discipline, not walker colour):

```
  base   32 failing rows / 11 files
  final  19 failing rows — exactly the 13 Class-A rows removed, ZERO added
  the four surviving kind-pool rows are exactly the Class-B set
```

Four executed mutants, each restored by cmp-exact `cp`: retargeted forward pointer → 13 rows
red as a loud THROW; changed `[live, verbatim]` tag → "tags no row" throw on all 13; live
rows reversed → 13 red (order is load-bearing); requiredSlots corrupted only → exactly the
13 red on the slots assertion with the prose comparison untouched.

### 6b CLASS B — the four rows still RED, and the fork D-W3 must rule

Measured at HEAD from `RECEIPT_POOLS_WAR.md` (these four are authored IN the war annex, NOT
forwarded — zero `[live, verbatim]` rows exist for them in LEGACY):

| Kind | Annex heading | Significance | Annex depth | Walker's `requiredSlots` length | SP-6 floor |
|---|---|---|---|---|---|
| `war_trajectory_winning` | WAR.md:428 (WR-4) | notable | **6** | 5 (`warCostKindPools`:37) | 6 |
| `war_trajectory_losing` | WAR.md:438 (WR-4) | notable | **6** | 5 (`warCostKindPools`:38) | 6 |
| `trajectory_misread` | WAR.md:472 (WR-4) | routine | **10** | 5 (`warCostKindPools`:45) | 8 |
| `succession_demand_inherited` | WAR.md:568 (WR-5) | notable | **6** | 5 (`warRulingKindPools`:31) | 6 |

The deepening was `1e8bf8a8` (chronic-tier). The walkers assume a fixed five rows via their
per-kind `requiredSlots` arrays and the `pool.length === requiredSlots.length` law.

**⚠ THE FORK IS NOT SYMMETRIC, AND THE CENSUS SAYS SO.** D-W3 states the choice as *"cap
raised vs corpus trimmed"* (`docs/DISPOSITION_WAVE_PROPOSAL.md`:57-59). Measured against
SP-6's frequency-scaled floor, **trimming the corpus to five would put THREE of the four
kinds BELOW their own floor** — `war_trajectory_winning` 6→5 (floor 6), `war_trajectory_losing`
6→5 (floor 6), `succession_demand_inherited` 6→5 (floor 6); only `trajectory_misread` (10,
floor 8) has slack, and trimming it to 5 breaks its floor too. **The trim arm is forbidden
by SP-6 for all four.** This is offered to the chair as a measurement, not a ruling — the
ruling is D-W3's — but an architect sequencing FP content work should not plan around a
corpus trim that the spine's own law refuses.

### 6c The seven kind-pool walkers, and the FP obligation

`tests/lint/` carries: `envoyKindPools` · `lineageKindPools` · `phrasedKindPools` ·
`sovereigntyKindPools` · `warCoalitionKindPools` · `warCostKindPools` ·
`warRulingKindPools` (plus `noPremadeDeityPool`, which is the deity-doctrine allowlist,
not a pool-depth walker).

Their annex addresses, measured (`grep -o 'RECEIPT_POOLS_[A-Z_]*\.md\|receiptAnnex'`):

| Walker | Reads the corpus? |
|---|---|
| `warRulingKindPools` · `warCoalitionKindPools` · `warCostKindPools` · `envoyKindPools` | yes — via `receiptAnnex.js` (WAR, following forwards into LEGACY) |
| `sovereigntyKindPools` | yes — `receiptAnnex` + `RECEIPT_POOLS_LEGACY.md` by name |
| **`phrasedKindPools`** | **NO** — imports `WHAT_PHRASES`, `newsVoiceCategory`, `SECTION_OF`, `WIZARD_NEWS_SIGNIFICANCE` and `eventProse.js`'s registry only |
| **`lineageKindPools`** | **NO** — same source-only import set |

**⚠ A SECOND, QUIETER GAP.** The two annex-less walkers cover kinds whose pools were
relocated. Verified by name against the forward census (the 23 forwarded kinds enumerated
by parse): **7 of `phrasedKindPools`' 8** WR-2 kinds are forwarded — the four
`disposition_*_crossed`, `disposition_reversal`, `deity_war_pressure`,
`deity_peace_pressure`; only `war_culture_suppressed` is still authored in WAR. **3 of
`lineageKindPools`' 5** are forwarded — `lineage_edge_recorded`, `mirror_kinship_bond`,
`lineage_claim_suppressed`; `casus_lineage_claim_parent` and `casus_lineage_claim_child`
remain in WAR. For those **ten** kinds, the SP-6 floor is asserted against the SOURCE
registry's pool and nothing compares it to the authored corpus. Their headers scope
this honestly (*"This is presentation evidence, never a claim that the dark lineage scorer
has executed"*), so it is a scope boundary rather than a defect — but an FP walker that
copies `phrasedKindPools` as its template **copies a walker with no corpus cross-check**,
and the WW-G address class does not exist for it because it never takes an address. Copy
`warCostKindPools` instead.

**Every walker that DOES read a corpus addresses the WAR or LEGACY annex. There is no
FP-program kind-pool walker in the tree.** L6 is explicit that *"kinds get their OWN walker
file (envoy template, frequency-scaled floors), never rows in a foreign walker."* So each FP
program owes a new walker file, and each of those walkers owes:

- an annex read through `receiptAnnex.js` (extended, not forked — §1b);
- the frequency-scaled floor asserted from the kind's own significance, not a fixed number
  (the Class-B lesson: a hard-coded five is a ratchet that fights the corpus);
- the orthogonal `requiredSlots` witness, which needs the richer annex shape (§1c);
- an entry in `scripts/mutation-coverage-manifest.json` with an executed mutant.

---

## §7 WHAT THIS CENSUS OBLIGES EVERY FP WAVE SPEC TO SAY

Not rulings — the five places where a spec written without this census will be wrong.

1. **Name your annex and how you read it.** Seven FP annexes have no reader and no volume
   names them. A spec that says "the pools are authored" without naming the file, the
   reader, and the walker is claiming a wiring that does not exist. (§1)
2. **Declare your belief legs and your degradation, mechanically.** Three of the four
   appraisal-class legs exist NOWHERE and `storesBand` is errand-scoped. If your wave prices
   or narrates a believed condition, say which leg, say whether it blocks or degrades, and
   make the degradation derive-at-call-time rather than promised. Reuse the injectable
   `beliefLegsFor` seam. (§2)
3. **Borrow the ladder or say why you minted one.** `OVERFLOW_BANDS` is a LEVEL, never a
   DIRECTION; `NEGOTIATION_SUBJECT_BANDS` is errand-scoped; `strengthBand` is 0..4 and
   `readiness`/`confidence01` are unbanded floats with no ladder at all. J-WR-10-B binds the
   mint. (§2, §3)
4. **Land one by-name gate read.** A flag gated only through a frozen-list `.every()` is
   invisible to the certification census and stays green while uncertified. The manifest
   entry and the certification row land in the SAME commit as the first real gate read. (§4)
5. **Budget the extraction before the logic.** `generosityKernel` has zero headroom;
   `generationReceiptJudgments`, `convergence`, `armyTransitKernel` and `envoyDiplomacy`
   have one to three lines; `peaceTerms`, `beliefMap` and `informationStatecraft` have
   twenty-four to thirty-seven. `pulseKernel` and `applyWorldPulse` take zero edits. (§5)

---

## Appendix — the scripts, and what they do not prove

Both live in this scratchpad directory and are read-only against the worktree:

- `annex_census.py` — `^### ` blocks and `^N. ` rows per annex; forwards detected by
  `^→ pool lives in `; floors applied from the heading's own `significance:` field. It
  cannot see whether a pool's variants are ANGLE-DISTINCT (SP-6's family rule: *"two
  templates differing only in slot fills are ONE"*), so a depth figure is an upper bound on
  real variety. The soak's phrase-repetition envelope is the only arbiter of that, and it is
  a runner's job.
- `effective_lines.py` — comment-span strip + non-blank count, calibrated 10/10 exact
  against the enforcer-measured baseline. It does not parse regex literals, so a file whose
  code contains `/…//…/` in a regex could in principle drift; none of the ten calibration
  files exercised that and no measured figure here is within one line of a decision except
  `generosityKernel` at exactly 800 — **re-measure that one with the enforcer before acting
  on it.**

Neither script ran a test, a gate, or a build. Every claim above is either quoted from the
tree or produced by one of these two parses with its control shown.
