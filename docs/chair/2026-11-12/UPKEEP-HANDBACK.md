# COHERENCE-UPKEEP: the hand-back (item 4, built)

Lane `lane/coherence-upkeep-2026-11-12`, cut from AGREE's final tip `65ce74ce6`. Built by COHERENCE-AGREE-2 to the chair's ruling of 2026-11-12 on item 4, and the chair's ruling (A) on the services STOP. The proposal it builds is `docs/chair/2026-11-11/UPKEEP-PROPOSAL.md` (on the AGREE lane).

**AN INDEPENDENT REVIEWER READS THE WHOLE LANE NEXT**, from base `65ce74ce6` to the tip, before the merge seat takes it.

## The owner's words, and the one home

> "prosperity should also scale the rest including healing, magic, etc. everything is based on what can be stockpiled, refilled, rebuilt, etc."

**The home is the prosperity label.** `src/domain/facts/keep.js` holds it:
- `KEEP_TUNING`: one table keyed by label, with two named columns. `bought` is the share of what is bought outright. `funded` is the funding of wages and works.
- `KEEP_SCALE_TUNING`: the floors for the bought families (services 0.7, stores 0.7) and magic's line (`magicBelow` 0.6).
- One reader, `keepOf(prosperity)`, plus `fundedGate` and `boughtShare`.
- The `keep` getter in `factsOf`, beside the prosperity fact.

Both tables are registered DRAFT in `tests/lint/.tuning-register.json`; the values are the owner's to sign. No vocabulary atom was added: the page lines use the existing `prosperity` band atom, because `keep.bought ≥ 0.6` is exactly `prosperity: ≥ moderate`.

**Nothing feeds back.** Prosperity reads no score, availability or months, and is written before every reader of the home. **Prosperity moves in 0 of the 360 births at every commit.**

## The corpus

The 360 births on seeds `agree-<tier>-<i>` (60 villages, 160 towns, 100 cities, 40 metropolises), every browser dial random, `grounded`: the AGREE lane's corpus. Every before and after below is on these seeds.

## The guard (d7d7f7787, red first)

1. **The home**, as above.
2. **The upkeep-reader walker**: `tests/lint/upkeepReaders.walker.test.js` with `upkeepReaders.register.json`.
   - **What it counts:** every read of the economy's OUTPUT used to gate upkeep. In the upkeep writers it counts every read. Elsewhere it counts a gate's shape, over the whole statement.
   - **The register:** shrink-only, and two-way (every live read is a row, every row is a live read). It also checks that `KEEP_TUNING` is named only in its home.
   - **Size:** 10 rows at the base, 4 at the tip. Six gate rows retired in 07ebe8bdc. The commercial demand roll's row is HELD under ruling (A), its reason saying exactly what it reads. The other three rows are the defence economic score's capacity term (`economic += econOutput × 0.2`), which is not an upkeep gate, and the two hand-offs that carry the output to it.
3. **The counterfactual** (`tests/generators/upkeepHired.test.js`), pinned on the pure score: **for every place with hired force and no standing force, its military score is not above the same place's score with a watch in the hired force's stead.** It was red at the base on all 5 hired-only corpus villages; for agree-village-45 the score was 97 against a watch's 93. The same file pins each family red first, as its own describe.

## The families: commit, before → after on the 360

| Family | Pin (red) | Cure | Before → after |
|---|---|---|---|
| Hired force (ruling 2) | d7d7f7787 | 0b5dc10b5 | The company, the charter hall and the contract chain are worth `keep.bought`, added after the wage gate. A hired-only place takes the slider term at its share, and its military is capped at a watch in its stead. **10 readiness labels move (6 up, 4 down).** 0 of 158 places without a hired force move. agree-village-45 goes 97 → 91 (its watch is 93) and Defensible → Lightly Defended; agree-village-40 37 → 26; agree-city-17 (Wealthy) is unchanged. |
| The five gates (ruling 3, B) | e55b52675 | 07ebe8bdc | `fundedGate(floor, keep)`: floors kept, identity at Comfortable and above. **86 labels move in this family (53 up, 33 down).** |
| Services (ruling 4, (A)) | 948c274af | c19e96e23 | See below. |
| Magic (ruling 5) | 4895854ad | e2ebb6447 | **99 availability bands, every one a single step down, all in Struggling (42 places) or Poor (57) places**: moderate→limited 32, broad→common 24, limited→rare 22, pervasive→broad 12, common→moderate 9. The world's magic level is never pervasive in these; a pervasive world is pinned unmoved. The profile is derived for display, so no draw moves. |
| Stores (ruling 6) | d1be3be10 | 05ec9b601 | See below. |
| The page (ruling 7) | acb2fd22d | 11662262e | See below. |

The scale table (`KEEP_SCALE_TUNING`, `boughtShare`) landed alone, with no reader, in 357f15758, and magic's line joined it in e2ebb6447.

### Readiness: the STOP, measured lane-wide

From `65ce74ce6` to the tip, **93 readiness labels move (54 up, 39 down)**. By direction:

| Before → after | Count |
|---|---|
| Defensible → Well-Defended | 22 |
| Well-Defended → Fortress | 17 |
| Defensible → Lightly Defended | 12 |
| Lightly Defended → Vulnerable | 12 |
| Lightly Defended → Defensible | 8 |
| Vulnerable → Undefended | 7 |
| Well-Defended → Defensible | 7 |
| Vulnerable → Lightly Defended | 5 |
| Undefended → Vulnerable | 1 |
| Defensible → Vulnerable | 1 |
| Defensible → Fortress | 1 |

By prosperity: Comfortable 25, Moderate 18, Poor 18, Struggling 16, Prosperous 16, Wealthy 0.

**Well-Defended plus Fortress went 36.7% → 41.1%, +4.4 points of the corpus**, inside the STOP at 5. It peaked at +4.7 after the gates; the stores then lowered it 0.3. 93 labels is inside the STOP at 120.

Safety and food labels move 0, and prosperity 0, at every commit.

### Services (ruling (A) on the STOP)

**The STOP, and how it was resolved.** As first built, the services step's seeded stream moved and 44 standing institutions were emptied, so I stopped. The chair ruled (A).

**How it is built under (A).** The commercial demand roll still reads the output, for its threshold and for whether it draws, exactly as before this lane. What a place can keep up is applied after that roll: healing, lodging, food, equipment, transport and the commercial services keep `boughtShare('services', keep)` of their rows. That decision is a draw-free roll keyed on the seed, the institution and the service, and a standing institution keeps at least one row.

The chair's five conditions, measured on the 360 (base = the tip before services, tip = with them):
1. **The walker row** says that the roll reads the output for both its threshold and whether it draws, and why it is held.
2. **Rows added: 0.** Rows removed: 439, in 175 settlements. Institutions with no rows: **565 at the base, the same 565 at the tip, so 0 newly empty**, out of a roster of 15,976. Pinned (`services are kept as far as the place can pay`: the Struggling read's rows are a subset of the full read's).
3. **Healing** by band: Struggling 183 → 161 (−12.0%), Poor 287 → 257 (−10.5%), Moderate 298 → 279 (−6.4%), Comfortable 617 → 600 (−2.8%), Prosperous and Wealthy 0. All inside the STOP at 25%.
4. **Criminal rows** by band, base → tip: Struggling 56 → 56, Poor 94 → 92, Moderate 130 → 130, Comfortable 417 → 416, Prosperous 297 → 297, Wealthy 97 → 97. None rises.
5. **The debt** (a proposal for after the release; not built and not measured). A single read would take the commercial roll's threshold from the home while holding its draw pattern. The roll would still draw where `output/50 < 1`, but compare against a home value, so that no draw moves. That needs one owner value: the home's equivalent of today's 0–2 demand scale for a commercial service. It would move rows only in the towns where the label and the output disagree: the 97 listed in `UPKEEP-ECONOMICS-PAGE-97.md`, and only for their commercial services with a roll probability below 1. Until then, the commercial roll and the home's share both apply, in that order.

### Stores (ruling 6)

**How it is built.** The full granary keeps `boughtShare('stores', keep)` of its months, at the stores' writer, on a second call after prosperity. The writer's one draw is a pure label-keyed fork, so the second call draws the same crop fortune. The first call, the one prosperity reads, lays by in full, and prosperity reads no months. The months, the food record's months, the storage note and the resilience all follow the kept months.

**What moved:**
- **Months** fall in 225 places: Comfortable 74, Poor 57, Moderate 54, Struggling 40.
- **Food bands: 0 moves. Prosperity labels: 0 moves.** The STOP holds.
- **Storage notes crossing a threshold: 22.** Seasonal buffer → minimal storage 14; strategic reserve → buffer 7; buffer → seasonal buffer 1.
- **Defence:** the economic score falls in 202 places and the disaster score in 183. 6 readiness labels fall one step: agree-village-50, agree-town-41, -65, -73, -76, agree-city-52.

**The famine towns, line by line** (all Struggling; the food band holds in each):

| Town | Months | Storage note |
|---|---|---|
| agree-village-8 | 0.1 → 0.1 | minimal, unchanged |
| agree-village-39 | 1 → 1 | minimal, unchanged |
| agree-town-66 | 3.1 → 1.9 | seasonal buffer → minimal storage |
| agree-town-99 | 4 → 2.8 | "4 months buffer" → seasonal buffer |
| agree-city-58 | 7 → 5.4 | buffer → buffer |
| agree-metropolis-5 | 11.8 → 9.1 | strategic reserve → strategic reserve |

### The page (ruling 7)

There are four lines, declared in `SAFETY_LINE_SIBLINGS` by the `prosperity` atom, each with today's line as its twin, all in the field that exists (`guardEffectivenessDesc`). The safety profile is written before prosperity, because prosperity reads its black-market figure, so the lines resolve after prosperity, draw-free (`safetyProfile.js :: keptGuardLine`).

| Line | Needs | Where it prints | On the 360 |
|---|---|---|---|
| "There is no standing guard; a hired company is paid to keep the peace, and gives what it is paid for." | `prosperity: ≥ moderate` | A hired company and no standing guard | 0 (no corpus town has one); pinned on a planted roster |
| "A hired company is on the books, but the coin to keep it runs short; it comes when called and leaves when the coin does." | `prosperity: ≤ poor` | The same | 0; pinned |
| "Hired swords back the garrison when the purse allows." | `prosperity: ≤ comfortable` | A hired company beside a garrison | 36 (Struggling 1, Poor 6, Moderate 10, Comfortable 19); its twin "Hired swords back the garrison." 48 (Prosperous 39, Wealthy 9) |
| "The adventurers' charter hall takes bounty work against threats, as far as the purse runs." | `prosperity: ≤ comfortable` | A charter hall with no garrison and no watch | 4 (Poor 3, Comfortable 1) |

The proposal put the charter line "beside the monster row (`deriveSupportingCapabilities`)". **That function has no monster row**, so the line went into the charter hall's own guard sentence, which is the monster sentence that exists.

**The 97 towns where label and output disagree.** What the Economics page prints in each is in `docs/chair/2026-11-12/UPKEEP-ECONOMICS-PAGE-97.md`. Every sentence follows the label (DS-ECO-1 and the rung are keyed on the prosperity rank), so **no sentence is a class member, and none was cured**. What disagrees is the header chip "Output N/100", which is a number and not a sentence:
- 43 Comfortable or Prosperous towns print it red.
- 7 Poor or Struggling towns print it green.

That chip is the owner's UI ruling (T2-1), so it is reported and was not changed.

## Found, and not this lane's

- **agree-village-45's 97 is not the hired slider term.** Measured by the counterfactual: its palisade is a work, and a work already earns the full slider term, so a watch in the charter hall's stead scores 93. The gap was the charter hall's +10 against a watch's +7. Under the rule, the cap at the watch holds it at 91. The slider term for a hired-only place with no works (`0.06 + 0.29 × bought` against a standing force's 0.35) is built, but no corpus place takes it.
- **The Output chip** (above).

## EQUAL-FAILING-SET

See the section appended below.

## What was banked

- **Registers:** two DRAFT tuning rows (`KEEP_TUNING`, `KEEP_SCALE_TUNING`), and the upkeep-reader register (10 rows at its first commit, 4 at the tip, one of them held by ruling (A)).
- **Re-takes:** the tuning inventory and the wiring census, each re-taken by its own writer (named below).
- **Nothing else:** no test was skipped and no pin was loosened.

## L2, the wider corpus (the chair's review laws of 2026-11-12): a STOP, sent and held

The wider corpus is the 360, plus 60 thorps and 60 hamlets (`agree-thorp-i`, `agree-hamlet-i`), plus 180 forced births (`agree-force-<famine|wartime|under_siege>-<tier>-<i>`, six tiers × 10). The base is `65ce74ce6` and the tip is this lane, both measured as archives.

**Readiness, against the STOP at 5 points of the corpus:**
- The 360: +4.4 (36.7% → 41.1%), 93 labels.
- Thorps and hamlets: 12 labels, the share unchanged.
- **Forced: 53 of 180 labels move (48 down), and Well-Defended+Fortress goes 16.7% → 8.9% (−7.8, OVER).** By stress: famine 8 → 1, siege 5 → 0, wartime 17 → 15. Of the 53 movers, 44 are Struggling: a famine or siege caps prosperity at Struggling, so `funded` = 0 and every gate stands at its floor.
- All 660: +0.3, 158 labels.

**Stores:** printed storage thresholds crossing: 58 on the 660 (the 360 22, thorps and hamlets 3, forced 33). Food bands 0 and prosperity 0 everywhere, including all 77 famine births.

**Holding on the wider corpus:**
- The hired counterfactual: 9 hired-only places (6 villages, 3 hamlets), every one at or under its watch.
- Services: 0 rows added, 0 institutions newly empty.
- Safety, food and prosperity: 0 moves.

**L1, the type gates:**
- The domain strict check reads exactly the one inherited error (`src/domain/defense/defenseFacts.js`, AGREE's).
- The typecheck ratchet: this lane's one error (`safetyProfile.js`) is cured in b95ba62e0; what remains is AGREE's first seat's (`generationCoherence.js` +3, `resourceGenerator.js` +15).
- Eslint is clean on every file the lane touched.

**STOP sent to the chair with three options for the gates (lift Struggling's `funded`, exempt stress-capped labels, or accept) and the stores choice.** The lane is held until the ruling.

**Still running when this was written:** the base-against-tip field diff over the golden 525 and the 660, and the equal-failing-set suites.
