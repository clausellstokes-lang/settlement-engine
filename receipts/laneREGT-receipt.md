# laneREGT receipt — TE-REG-T · the register arc's trajectory census

Lane: TE-REG-T, SOLO, READ-ONLY RESEARCH (DESIGN_REGISTER_PROGRAM.md A5.2 REG-T row as repaired
by A6.2). Question: do the engine's generated histories produce NON-MONOTONIC settlement arcs at
meaningful rates? Chair-set parameters (ODQ §622.3, recorded before measuring, not adjustable by
this lane): N = 200 seeds stratified across all six tiers (33–34 per tier) · the five arc shapes
{MONOTONE-GROWTH · PLATEAU · BOOM-BUST · FADE · SACKED-NEVER-RECOVERED} · classifier over the
RECONSTRUCTED-EXTENT series · THIN band: any non-monotone shape below 3% of its applicable seeds.

RESUME POINT (2026-08-24, ~T+55min): **LANE COMPLETE.** Census run, all four controls executed
and green (§11), results in §10, judgment read in §12. Artifacts: `reg-t/facts.json` (200-seed
raw facts), `reg-t/facts-dump.mjs`, `reg-t/classify.mjs`, `reg-t/census-real.txt`,
`reg-t/census-misparam.txt`, `reg-t/smoke.mjs`/`smoke2.mjs`. Nothing remains to resume.

## §1 · Setup (executed)

- Worktree: `reg-t/tree` at the sealed fabric tip `8890e3f3e6b8e9e5e83a9da7191c26f768b9ec09`
  (refs/preserve/map-sandbox-reg2-walls), detached, read-only. `node_modules/seedrandom` (3.0.5)
  copied from the main repo — the established cure (laneREG0/REG1/REG2 receipts). No other deps;
  generation runs under plain node v24.12.0 (`"type": "module"`).
- Machinery read IN FULL before any rule was written: `src/domain/townMap/fabric/epochAxis.js`
  (552 lines), `snapshot.js` (272), `compile.js` (292), `tierGrammar.js` (deriveHighWater +
  tierScale + tierForPopulation scopes), `src/generators/historyGenerator.js` (event structure),
  `src/generators/steps/resolveConfig.js` (tier/population resolution),
  `src/data/constants.js` (POPULATION_RANGES), `src/data/historyData.js` (AGE_BY_TIER, event
  templates), `src/generators/history/historyPolicyData.js` (TIMELINE_CATEGORY_TYPES).
- A6's raw panel finding read (`panels/a5-panel-2026-08-24.json`, panel[0].findings[2]): the
  year-indexed series is "declared unsourceable at head… compile.js's countPeaks runs on a
  RECONSTRUCTED extent trajectory, not a recorded one."

## §2 · What a GENERATED record carries (measured, smoke run at the sealed tip)

CONFIRMED by executing `generateSettlementPipeline({settType: tier}, null, {seed, customContent:{}})`
for all six tiers:

- `history.age` and `history.founding.age` — present, integer years since founding.
- `history.historicalEvents[]` — typed and dated: `{type (category), templateType, yearsAgo,
  severity ∈ {minor, major, catastrophic}, prose}`. NO numeric population deltas anywhere.
- `populationHistory` — ABSENT on every generated record (matches snapshot.js's header).
- `calamityHistory` — ABSENT on every generated record (worldPulse writes it during lived
  simulation, never at generation).
- `population` — one scalar; `tier` — stamped from config.settType, population rolled uniform in
  the GENERATOR's band.
- `simulationTrace` is a causal provenance log (`ts` = step counter), NOT year-indexed data.

THE ONE DECLINE SOURCE A FRESH RECORD CAN HOLD — the band mismatch, measured:

| tier | generator band (constants.js) | fabric band (TIER_PROFILE.pop) | demotion-expressible |
|---|---|---|---|
| thorp | 8–60 | 1–60 | no |
| hamlet | 61–400 | 61–400 | no |
| village | 401–900 | 401–900 | no |
| town | 901–5,000 | 901–8,000 | no |
| city | 5,001–25,000 | 8,001–40,000 | pop ≤ 8,000 → fabric derives 'town' (~15% of band) |
| metropolis | 25,001–100,000 | 40,001–200,000 | pop ≤ 40,000 → fabric derives 'city' (~20% of band) |

`deriveHighWater` evidence channel 1 (stored tier above derived tier = "a recorded demotion")
fires ONLY there; channels 2 (populationHistory ring) and 3 (calamityHistory exodus) are
structurally silent on generated records. The census below measures the real rates.

AGE_BY_TIER (series-length driver): thorp 15–300 · hamlet 30–120 · village 30–250 ·
town 50–300 · city 100–500 · metropolis 200–800.

## §3 · THE SERIES, STATED (chair requirement: construction + length per seed)

The RECONSTRUCTED-EXTENT series is the year-indexed trajectory the fabric's own machinery
implies but never materializes (A6's finding). Construction, per seed:

- Axis: t = 0..A, A = trunc(history.age). **Length = A+1 points, one per year since founding.**
- Units: souls (occupancy). The fabric's drawn EXTENT is a monotone image of this series'
  running maximum (tierScale: extent follows the high water and never shrinks); the arc lives in
  occupancy, and this is the same series `compile.deriveWallVintage` walks ("Growth is treated
  as monotone to the high water — the only shape the record can defend": pop(t) = peak·t/age is
  its exact arithmetic, since crossed-share = TOWN_FLOOR/peak of the whole life).
- P = `deriveHighWater(s).population` (the fabric's own derivation, called, not re-implemented);
  C = `s.population`.
- CASE P ≤ C (no demotion evidence): R(t) = C·t/A. Peak at the present. Monotone by the fabric's
  own reconstruction law — reported as such, never disguised.
- CASE P > C (recorded demotion): the record dates no decline directly; the only dated loss
  anchors are loss-class events.
  - LOSS_TEMPLATES = { external_threat, great_fire, plague_years, great_flood, occupation_legacy,
    popular_uprising, tyranny, market_crash, trade_collapse, resource_scarcity,
    demographic_pressure, population_friction } — or category `type === 'disaster'`.
  - MILITARY_TEMPLATES = { external_threat, occupation_legacy, popular_uprising, tyranny } —
    the sack class (also category `type === 'occupation_infiltration'`).
  - t_peak = A − max(yearsAgo over loss anchors), clamped to [1, A−1]. Rise R(t) = P·t/t_peak.
  - Decline: D = P − C stepped down at each loss-anchor year (ascending), share proportional to
    severity weight {minor 1, major 2, catastrophic 3}; flat between steps and after the last.
  - ZERO loss anchors: the decline is UNDATABLE — a single step P→C at the final year, the seed
    is stamped `undatedDecline: true`, counted and reported separately (the chair's two-point
    warning honored: these seeds' SHAPE assignment (§4 rule F2) rests on elimination, not dates).

## §4 · THE CLASSIFIER RULES — pre-registered, frozen BEFORE any census run

Inputs per seed: R(t), P, C, A, deficit d = (P−C)/max(1,P), the loss anchors, the largest
down-step's anchor. Tolerances (part of the pre-registration): ε_flat = 0.02 (final deficit for
"still at peak"), δ = 0.05 (plateau flatness band), τ = 0.15 (plateau tail share),
d_deep = 0.25 (deep-bust deficit).

Decision order (first match wins):
1. **MONOTONE-GROWTH** — R has no down-step AND d ≤ ε_flat AND R does NOT satisfy the plateau
   tail test.
2. **PLATEAU** — R has no down-step AND d ≤ ε_flat AND R(t) ≥ (1−δ)·R(A) for all t in the last
   τ·A years (rise finished early; the tail is flat-within-5%).
3. **SACKED-NEVER-RECOVERED** — d > d_deep AND the largest down-step's anchor is
   MILITARY-class with severity ∈ {major, catastrophic} AND no rise after the first down-step
   (under §3's construction this last clause holds by construction; asserted, not assumed).
4. **BOOM-BUST** — d > d_deep, not rule 3 (the deep fall is dated to a non-military anchor, or
   a military-minor one).
5. **FADE** — ε_flat < d ≤ d_deep (a shallow-to-moderate decline, any anchor class), **or**
   (F2) any decline with zero dated anchors regardless of depth (`undatedDecline` seeds: a fall
   that left no dated scar is read as gradual by elimination; count reported).

Applicable-seed denominators for THIN: **all 200 seeds for every shape** (no post-hoc
shrinking; a raid or fade is expressible at any tier and any age in the vocabulary). "Non-mono-
tone shape" for the THIN verdict = the four non-MONOTONE-GROWTH shapes (PLATEAU included, as
one of the chair's five; the reading is stated here so the verdict is mechanical). THIN fires
for a shape when its count < 6 of 200 (3%).

## §5 · CONTROLS — each able to fail, pre-registered

1. **ACCURACY (hand-classified 12)**: seeds k=1 and k=18 of each tier's stratum (deterministic,
   chosen before generation; no cherry-picking). I hand-apply §4 to the RAW FACTS (stage-1 dump)
   and write the answers into this receipt BEFORE the classifier runs. Match required 12/12.
   Supplement (pre-registered): if all 12 land in one shape, additionally hand-classify the
   first 3 demoted seeds in seed order (reported separately) so the control exercises a decline
   path.
2. **LIVENESS (mis-parameterization)**: re-run with d_deep = 0.001, τ = 0.90, severity weights
   inverted {minor 3, major 2, catastrophic 1}. The census table MUST diverge from the real run
   (diff quoted). Identical tables = dead instrument = stop and investigate.
3. **SHAPE REACHABILITY (synthetic plants)**: five hand-built fact-sets, one per shape, fed to
   the same classifier function; each must return its intended shape. Cures the "a shape the
   corpus never produces looks CLEAN" hazard: a structural zero in the census is then a fact
   about the corpus, not about the classifier.
4. **T2R CROSS-INSTRUMENT**: for every seed, the fabric's own `deriveHighWater` (peak tier vs
   `tierForPopulation(C)`) is computed by CALLING the fabric. Required: every decline-shape seed
   shows peakTier > presentTier or peak > C ("peak > present at meaningful rates" per the
   brief); and every fabric-demoted seed lands in a decline shape. Disagreement counts reported
   both ways. STATED LIMIT: my series builder takes P from the same fabric function, so this
   control catches implementation divergence (arithmetic/mapping bugs between builder and
   classifier), not an independent measurement of the world — said plainly rather than dressed
   as more than it is.

## §6 · Seed roster

Seed strings `regt-<tier>-<k>`: thorp k=1..34, hamlet k=1..34, village k=1..33, town k=1..33,
city k=1..33, metropolis k=1..33 → N = 200 (34+34+33+33+33+33). Config = `{settType: tier}`
only (the engine's plain path), `customContent: {}` (documented headless-determinism option),
`importedNeighbour = null`.

## §7 · Worked examples (per shape, applying §4 by hand)

- MONOTONE-GROWTH: town, A=200, C=P=3,400. R(t)=3400·t/200, no down-step, d=0 ≤ 0.02, tail not
  flat (linear to the end) → rule 1.
- PLATEAU: (synthetic; §3 cannot produce it — measured in the census) A=200, P=C=3,400 but R
  reaches 3,400 at t=120 and holds: last 30 years all equal R(A) → rule 2.
- BOOM-BUST: city, A=400, C=6,000, P=8,001 (demotion), anchors: market_crash (major) at
  yearsAgo 90 → t_peak=310; d=(8001−6000)/8001=0.250… > 0.25; largest step at market_crash
  (non-military) → rule 4.
- SACKED-NEVER-RECOVERED: metropolis, A=500, C=28,000, P=40,001, anchors: occupation_legacy
  (catastrophic) at yearsAgo 150, great_fire (minor) at yearsAgo 80 → t_peak=350; d=0.30 >
  0.25; largest step (weight 3) at occupation_legacy = military-catastrophic → rule 3.
- FADE: city, A=300, C=7,600, P=8,001, one anchor plague_years (minor) at yearsAgo 40;
  d=0.05 ∈ (0.02, 0.25] → rule 5. (And an undated variant: same numbers, zero anchors →
  rule F2, `undatedDecline` counted.)

— pre-registration ends; anything below this line was written AFTER the census machinery ran —

## §8 · Stage 1 executed (facts only — still no classifier at this point)

`facts-dump.mjs` → `facts.json`: **200 seeds, 0 failures**, strata exactly
34/34/33/33/33/33. Raw finding before any classification: **8 of 200 seeds carry peak >
present** (4 city, 4 metropolis, 0 elsewhere) — every one via the stored-tier-above-derived-tier
band mismatch (§2), none via any other channel.

**AMENDMENT A (recorded 2026-08-24 before the classifier was written, after stage-1 facts were
seen):** §4 rule 3/4 reads "the largest down-step's anchor", and `regt-city-31` exposes a case
the pre-registration did not cover — two anchors tied at the largest severity weight
(popular_uprising catastrophic MIL @y188 vs great_fire catastrophic civ @y225). Tie-break rule,
frozen now: **ties on largest step resolve to the EARLIEST anchor** (the first blow of equal
force is the one that initiates the decline). Recorded as an amendment rather than silently
patched, because it was minted after seeing data; it decides exactly one seed in this corpus
(city-31 → the military anchor wins → SACKED test applies).

## §9 · ACCURACY CONTROL — hand classification, written BEFORE the classifier ran

The 12 pre-selected seeds (k=1, k=18 per tier), §4 applied by hand to the §8 raw facts:
every one has deficit = 0 → CASE P ≤ C → linear ramp, no down-step, d = 0 ≤ ε_flat; the plateau
tail test fails on a linear ramp (at t = 0.85·A, R = 0.85·R(A) < 0.95·R(A)) → **rule 1,
MONOTONE-GROWTH, all 12**: thorp-1, thorp-18, hamlet-1, hamlet-18, village-1, village-18,
town-1, town-18, city-1, city-18, metropolis-1, metropolis-18.

All 12 landed in one shape → the §5.1 pre-registered supplement fires: first 3 demoted seeds in
seed order, hand-applied:
- **regt-city-13**: d = 0.2522 > 0.25; anchors 5, weights {mc-minor 1, py-major 2,
  et-catastrophic 3, ol-major 2, pf-minor 1}; largest step = external_threat, MILITARY,
  catastrophic → **SACKED-NEVER-RECOVERED** (rule 3).
- **regt-city-24**: d = 0.0295 ∈ (0.02, 0.25] → **FADE** (rule 5, dated anchor).
- **regt-city-28**: d = 0.1161 ∈ (0.02, 0.25] → **FADE** (rule 5).

Required match: 12/12 + 3/3. (Classifier output not yet produced when this section was written.)

## §10 · THE CENSUS (real run, `census-real.txt`, quoted verbatim below) — CONFIRMED

```
tier        MONOTONE-GRO  PLATEAU       BOOM-BUST     FADE          SACKED-NEVER
thorp       34            0             0             0             0
hamlet      34            0             0             0             0
village     33            0             0             0             0
town        33            0             0             0             0
city        29            0             0             2             2
metropolis  29            0             0             3             1
TOTAL       192           0             0             5             3
```

Denominators: 200 seeds total (per-tier strata 34/34/33/33/33/33); the applicable-seed set for
every shape is all 200 (§4). Rates: MONOTONE-GROWTH 96.0% · PLATEAU 0.0% · BOOM-BUST 0.0% ·
FADE 2.5% · SACKED-NEVER-RECOVERED 1.5%. Undated declines: 0 (every decline seed carried at
least one dated loss anchor).

**THIN verdicts (chair band, <3% of 200 = <6 seeds): ALL FOUR non-monotone shapes fire THIN —
PLATEAU 0/200 THIN · BOOM-BUST 0/200 THIN · FADE 5/200 THIN · SACKED-NEVER-RECOVERED 3/200
THIN.**

Series-length distribution (length = age+1, one point per year since founding):
overall min 29 · median 182 · max 704. Per tier — thorp 29/182/288 · hamlet 33/78/120 ·
village 35/116/250 · town 56/182/298 · city 104/252/454 · metropolis 205/451/704 (min/median/
max). No seed's series is a two-point record; the shortest is 29 year-points.

The eight decline seeds, with their fabric corroboration: city-13 SACKED (d .252) ·
city-24 FADE (.030) · city-28 FADE (.116) · city-31 SACKED (.291) · metropolis-9 FADE (.071) ·
metropolis-14 SACKED (.301) · metropolis-17 FADE (.026) · metropolis-30 FADE (.060). All eight
are ≥121 years old (121–683) — no young place carries a decline, consistent with L-REG-24's
direction, though that arrives via AGE_BY_TIER's floors, not via arc-coupling machinery.

## §11 · CONTROLS — executed, each could have failed, none did

1. **ACCURACY: 15/15.** The classifier returned MONOTONE-GROWTH on all 12 pre-selected seeds
   and SACKED/FADE/FADE on city-13/24/28 — byte-for-byte the hand answers written in §9 BEFORE
   the classifier existed.
2. **LIVENESS: DIVERGED as required.** `census-misparam.txt` (d_deep .001, τ .90, severities
   inverted): FADE 5→0, BOOM-BUST 0→5 (10 per-seed shape changes at city/metropolis rows).
   The instrument responds to its parameters; identical tables would have been a dead
   instrument.
3. **SHAPE REACHABILITY: 5/5 OK.** Each synthetic plant classified as its intended shape —
   so the corpus's zeros (PLATEAU, BOOM-BUST) are facts about the corpus, not classifier
   blindness. PLATEAU's plant is rule-level (series injected) because §3's construction cannot
   produce a plateau — that inexpressibility is itself a finding (§12).
4. **T2R CROSS-INSTRUMENT: 8/8 agreement, both directions, 0 disagreements.** Every
   decline-shape seed shows fabric peak > present AND fabric peakTier > present tier (city→town
   ×4, metropolis→city ×4); every fabric-demoted seed landed in a decline shape. Stated limit
   (§5.4): P is sourced from the same fabric function, so this control proves builder/classifier
   consistency, not an independent world measurement.
5. Supplementary executed checks: `countPeaks` over a generated record's populationHistory
   returns **0** (the field is ABSENT — the §161g two-peaks signal is structurally silent at
   generation); same-seed regeneration of regt-city-13 is IDENTICAL to the facts dump (age 262,
   pop 5983) — the census is reproducible.

## §12 · THE READ (labeled; the decision is the chair's — this lane reports)

**CONFIRMED (executed evidence above):**
- The engine's generated histories produce non-monotonic arcs at 4.0% overall (8/200), confined
  entirely to city and metropolis, and **every one of the chair's four non-monotone shapes is
  THIN under the chair's own band**.
- The only decline mechanism a generated record carries is the generator/fabric band mismatch
  (constants.js POPULATION_RANGES vs tierGrammar TIER_PROFILE.pop at city and metropolis —
  §2's table). populationHistory and calamityHistory are ABSENT on every generated record, and
  events carry no numeric deficits, so deriveHighWater's other channels are silent.
- Recovery (BOOM-BUST as rise-fall-rise, §161g's two peaks) is INEXPRESSIBLE at head:
  countPeaks = 0 on generated records. A reconstructed series can never rise after a fall.
- PLATEAU is inexpressible under the fabric's own reconstruction law (linear-to-peak,
  compile.deriveWallVintage's arithmetic): a structural zero, distinct from a sampled zero —
  the classifier rule itself is proven reachable.
- Robustness of the headline: no parameter choice can raise the 8-seed ceiling — the number of
  seeds with peak > present is a fact of the records, not of the classifier. Even the deliberate
  mis-parameterization moves shapes among the same 8 seeds. Per-shape THIN could flip only if
  ≥6 of the 8 landed in one shape (observed splits 5/3 real, 5/3 misparam — no shape reached 6).

**PLAUSIBLE (reasoning; the experiment that would settle each is named):**
- The 8 declines are semantically ACCIDENTAL: a "city" rolled at 5,983 souls is a demotion only
  because the fabric's city floor is 8,001 — no generation-time intent produced a decline arc.
  (Settle by asking whether the band mismatch is a known deliberate overlap or a drift; the
  constants.js comment enforces generator-internal consistency only.)
- If the chair rules that §611's decline vocabulary needs generated substrate, the two natural
  seams measured here: (a) the dated, typed, severity-graded loss events already on every
  record (this corpus: up to 8 anchors on a metropolis) are couplable to numeric deficits —
  trajectory shapes minted as a small typed vocabulary (constants tuning-class, per the A5.2
  row) could consume them without new event machinery; (b) the band mismatch, if ever ALIGNED
  as a bug-fix, would take even the current 4% to ~0 — the decline substrate would then be
  exactly zero. Both are chair decisions; neither is exercised by this lane.

**Stated omissions:** no repo writes, no refs, no gates, no memory writes (lane charter). The
classifier tolerances (ε_flat .02, δ .05, τ .15, d_deep .25) are lane-chosen within the
chair-set frame and pre-registered in §4; the chair set N, strata, the shape vocabulary, the
series, and the THIN band, and none were adjusted. The census classifies the reconstruction the
head machinery implies — it cannot and does not claim the settlements' "true" histories, which
the record does not carry (A6's finding, §11.10's law).
