# SKEPTIC §911 — LENS: THE CONFIGURATION
Seat: Opus 5 — Fable-unvalidated. Read-only on every tree. Dock porcelain 0 before, 0 after.
Every figure below came from a command executed in this session.

## 0. THE QUESTION
The receipt's headline 3 calls 0.4787 (§907, y300) vs 0.6443 (this lane, y300) a **SEED** fact,
asserting "same configuration, different seed". §907 reached the world through
`realm-scale-certification.mjs --profile research-lit-4s`; this lane called
`whole-world-soak.mjs` directly. Is anything but the seed different?

## 1. WHAT THE PROFILE ACTUALLY PASSES (read at the dock tip 3b1c0eaa5)
`REALM_SCALE_PROFILES['research-lit-4s']` (`realm-scale-certification.mjs:107`):
`lighting {demographicsEnabled:true}`, one cell `{years:300, settlements:4, seedIndices:[1]}`.
`buildRealmScalePlan` composes seed `realm-scale-research-lit-4s-300y-4s-seed1` and case id
`research-lit-4s-300y-4s-seed1`. `behavioralControlsFor` returns **null** for this profile
(the branches key on 'release' and 'research' only), so **no** `--neighbor-control-years`,
**no** `--dark-control`. `soakArgsFor` therefore emits exactly:

`--years 300 --settlements 4 --seed <seed> --case-id <id> --receipt <path> --lighting demographicsEnabled=true`

No `--preset`, no `--rules-json`, no `--seasons`, no `--divergence-years`, no `--source-sha`.
`runSoak` spawns `process.execPath` with `env: process.env`, `cwd: ROOT` — no V8 flags added.

Against this lane's argv (`--years 600 --settlements 4 --seed …-600y-4s-seed1
--lighting demographicsEnabled=true --receipt …`), the differences are exactly **three**:
`--years`, `--case-id`, `--seed`. Plus one wrapper difference: this lane's node child carried
`--max-old-space-size=6144`; §907's child did not (the flag was on the *parent* certification
process and V8 flags are not inherited by `spawn`).

### Are the three differences confounds?
- **`--case-id`** — grep of `whole-world-soak.mjs` finds `CASE_ID` at `:161` (parse), `:198`
  (refusal gate) and `:1023` (`...(CASE_ID ? {caseId: CASE_ID} : {})` in `receiptBody`).
  It never reaches the fixture or the simulation. **NOT a confound.**
- **`--years`** — grep of `YEARS` shows it as the run-loop bound, `DIVERGENCE_YEARS =
  min(YEARS,5)` (5 in both) and `NEIGHBOR_CONTROL_YEARS` (0 in both). `runYears` builds its
  world by `buildFixture(seed, {variant})` — **years is not an input to the fixture**. So a
  600-year run's year-300 state is the same state a 300-year run of that seed would reach.
  **NOT a confound for the y300 comparison.**
- **`--max-old-space-size=6144`** — cannot affect determinism. Measured peak heaps:
  §907 509,407,024 B, this lane 563,801,984 B — both far under any default old-space limit,
  so it is not a plausible GC-timing confound either. **Named, immaterial.**
- **`--seed`** — the only difference that reaches the world. **THE CONFOUND IS THE SEED, as
  the receipt says.**

## 2. THE SOURCE COMMITS DIFFER — AND THE RECEIPT NEVER SAYS SO (but the claim survives)
§907's plan records `source.commit 4243bdc610fe…`; this lane ran at `3b1c0eaa51f7…`.
Eighteen commits apart. Measured:
```
git diff --stat 4243bdc61 3b1c0eaa5 -- src                                    → EMPTY
git diff --stat … -- tests/fixtures/spatialPackFixtures.js package.json package-lock.json → EMPTY
git diff --stat … -- src scripts  → 10 files, all under scripts/
```
The only behavioural line in the changed scripts is in `behavioral-observation.mjs:962`, where
the literal `0.0025` became `MOTION_FLOOR_01`; `soakInvariants.mjs:158` reads
`export const MOTION_FLOOR_01 = 0.0025` — **value-preserving**, and it feeds `populationMoved`,
not `loadRatio01`. `observeRealmDemography` lives in `src/`, unchanged.
**So the simulation and the loadRatio instrument are byte-identical across the two runs.**
This is the strongest available support for the seed-fact headline — and the receipt does not
present it. A reader given only the receipt cannot tell the runs were at different commits.

## 3. RECEIPT-VS-RECEIPT, KEY BY KEY (script `cmp.mjs` / `cmp2.mjs`)
Top-level keys: `caseId` only in the 300y receipt; `yearlyPopulations` / `yearlyDiedFlags` only
in the 600y one (the §909 additive series). Everything else present in both.
```
schemaVersion 5 | 5        kind whole_world_soak | same    settlements 4 | 4
now 2026-07-12T00:00:00.000Z | same               years 300 | 600
subsystems.presetId      IDENTICAL (full_simulation)
subsystems.ruleKeysRecorded / stateKeysComplete / schemaVersion / kind  IDENTICAL
subsystems.rules — 57 keys compared, 0 differ  (demographicsEnabled true | true)
```
The 94 flattened `subsystems` differences are ALL under `stateKeys` and are all
observed-years / entry counts — outcomes of a longer, different world, not configuration.
**VERDICT: the configuration blocks are identical. The "same configuration" half of the
headline is CONFIRMED on the receipts' own bytes.**

## 4. THE TWO FIGURES, READ OFF THE RECEIPTS
```
300y receipt behavioral.yearly[299].realmDemography
  population 12289  capacity 26292  bound 25674  realmPressure01 0.4674  loadRatio01 0.4787
600y receipt behavioral.yearly[299].realmDemography
  population 15450  capacity 25535  bound 23978  realmPressure01 0.6051  loadRatio01 0.6443
600y receipt behavioral.yearly[599] loadRatio01 0.7251  bound 24185
```
0.4787 **CONFIRMED**. 0.6443 **CONFIRMED**. Δ = 0.1656; window `[0.6, 1.05]`
(`tripwires.mjs:530`) width 0.45; 0.1656/0.45 = **36.8 %** — the receipt's "37 %" **CONFIRMED**.
Both profiles carry `seedIndices: [1]` (`realm-scale-certification.mjs:97`, `:107`) **CONFIRMED**.
Minor: the receipt's bound pair "(24,185 vs 25,674)" pairs the 600y run's **year-600** bound with
§907's **year-300** bound. The like-for-like y300 pair is 23,978 vs 25,674 (−6.6 %); the claim
"essentially unchanged" survives either way.

## 5. THE SEED STRING AND WHAT THE DIVERGENCE ARM ACTUALLY TESTS
Seeds: `realm-scale-research-lit-4s-300y-4s-seed1` vs `realm-scale-research-lit-4s-600y-4s-seed1`
— the sole difference is the `300y`/`600y` token. **CONFIRMED.**

The divergence arm (`seedDivergence`, `instrument event_type_total_variation_v1`) compares
`SEED` against `${SEED}-divergent` over `windowYears: 5`. It is evidence that *a* seed change
moves the event mix; it says nothing about these two particular seeds. The receipt's R6 cites
`TV 0.273` — that figure is **§907's** run (`capacity/soak-300y.log` line 20: TV 0.273); the
600-year run's own arm reads **TV 0.271** (`soak-horizon-600y-4s-lit.log:19`). Real figure,
unattributed run. **PARTLY.**

**The direct proof the receipt did not use, and it is stronger:** the two worlds differ at
generation. `startPopulations` 300y `[15548,4213,1426,657]` (Σ 21,844) vs 600y
`[15287,3321,1958,558]` (Σ 21,124), and `yearlyHashes[0]` differs. The worlds are unrelated
from year one — the seed-fact reading is sound.

## 6. ⛔ THE CONFOUND THE RECEIPT DID NOT NAME — `f_S(12) = ×1.4821` COMPARES TWO SEEDS
`f_S` is the settlement term in the SOAK-1 price and the ground of R5's `k = 1.358`
"superlinearity exponent in SETTLEMENT COUNT". Measured from the receipts it rests on:
```
909 lit 30y×4s      seed w0-soak                                    primary 55,243 ms  0.4604 s/sy
909 lit 30y×4s (b)  seed w0-soak                                    primary 54,790 ms  0.4566 s/sy
this lane 30y×12s   seed realm-scale-research-lit-4s-30y-12s-seed1  primary 244,623 ms 0.6795 s/sy
mean 4s rate 0.4585 · 0.6795/0.4585 = 1.4821 · cost ratio 4.4464 · ln/ln = 1.3581
```
Both presets `full_simulation`, both `demographicsEnabled true`, both `caseId` absent — so the
*lighting* configuration matches. **But the seeds differ, and so do the worlds' sizes:**
```
start souls   4s 17,682 (4,420.5/settlement)   12s 75,790 (6,315.8/settlement)   ratio 1.4288
ms per soul-year   4s 0.10371   12s 0.10759    ratio 1.0373
```
The receipt's own century analysis argues that per-year cost tracks the number of souls ("the
600-year world is simply dearer per year because it holds ~17,500 souls…"). By that same
argument **1.4288 of the 1.4821 settlement term is a population-level difference introduced by
the seed**, leaving ×1.0373 attributable to settlement count itself. `k = 1.358` is therefore
not merely "two points on a possible power law" (R5's stated caveat) — it is a ratio taken
across two different fixtures, and the receipt names the seed confound in R6 and R10 while
missing it here. A same-seed 30y×4s control was ~2 minutes of the lane's own machine time.
**Direction of the error: the price estimate is too HIGH, so the owner-facing "≈4.0–5.1 h vs
≈35 h" conclusion is not endangered — but the mechanism is misattributed.**
The same seed break contaminates "the dark penalty SHRINKS with scale" (×1.2120 at 4s on
`w0-soak` vs ×1.1094 at 12s on the research seed): each ratio is internally same-seed and sound,
but the *comparison between them* crosses fixtures.

## 7. ⛔ A FIGURE THAT DOES NOT REPRODUCE — `rate(4,300) seed B = 0.8051 s/sy`
The final price table sources it as "the 600-year world's OWN first 300 years, from `yearlyMs`".
Measured: `sum(yearlyMs[0..299]) = 938,161 ms → 938,161/1000/1200 = 0.7818 s/sy` — which is the
figure the receipt itself prints one section earlier ("through y300  938.2 s  0.7818 s/sy").
0.8051 would need 966,120 ms, which is the run's cumulative cost at **year ~307**, not 300.
`0.8051` appears exactly once in the receipt and nowhere in the lane's working files.
Consequences: the band's top `1.1933 = 0.8051 × 1.4821` becomes `1.1587`; run A+B
8,592 s → 8,343 s; the lit cell 2.39 h → 2.32 h; **the "1.9–2.4 h / 4.0–5.1 h" headline survives**.
The caveat sentence "rate(4,300) moves +26.7 % between two seeds" does not: with 0.7818 the move
is **+23.1 %**, and comparing like with like (both from `yearlyMs`: 0.6254 vs 0.7818) it is
**+25.0 %**. The receipt mixes a wall-clock rate with a `yearlyMs` rate in the same ratio.

## 8. BOTTOM LINE FOR THE CHAIR
The headline this lens was pointed at — **0.4787 → 0.6443 is a seed fact** — **survives**, and
survives more strongly than the receipt argues it: the configuration blocks match on all 57 rule
keys and the preset, `--case-id` and `--years` provably do not reach the world, and `src/` is
byte-identical between the two commits. What does **not** survive is (a) the unnamed seed
confound inside `f_S`/`k = 1.358`, and (b) the unreproducible 0.8051 and the "+26.7 %" that
rests on it. Neither moves an owner-facing conclusion; both move a stated mechanism.
