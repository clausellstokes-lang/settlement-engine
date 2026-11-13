# AGREE-FOLLOW-UP: the hand-back (point 47's two carried reds, explained by measure and trace)

The seat: AGREE-FOLLOW-UP, seated by the chair (session_01FE9mEws7PXYRYdjQPbSX15) on 2026-11-13. It owns the two tests that STOP 47d (merge book §2i.6, ruled in §2i.7) carried red and named.
- Lane: `lane/agree-follow-up-2026-11-13`, cut from the line's tip `aac79b808` (point 47), read back from origin at the cut.
- The line before the point is `f572d12b7`.
- The agreement lane's own range is `3575cf061..69b53decd`. It merged the line at `3575cf061` (d0f0d022b); its earlier commits sit on the line at point 43.

Rulings worked to: the brief, then the chair's rulings of 2026-11-13 18:02 UTC on the two tables (section 3; the chair's messages are not on the branch, so they are restated there). Nothing in `src/` is changed. One test file is changed as ruled (7e471bb23). No baseline row is banked.

Probes (`docs/chair/2026-11-13/probes/AGREE-FOLLOW-UP/`), each runnable as `node <probe> <tree root> ...`:
1. `siteScan.mjs`: the site ratchet's 462-town corpus, row by row.
2. `siteDiff.mjs`: two scans compared, every changed town listed.
3. `siteAttribute.mjs`: one changed town's key and roster commit by commit.
4. `sewerProsperity.mjs`: the arm's 42 births at the two prosperity extremes.
5. `sewerProsperityIdentities.mjs`: each RAISES cause over the 42 × K identities.
6. `sewerWitnessCivic.mjs`: the sewer witness's civic houses at one tree.
7. `sewerHighWaterPath.mjs`: HIGH_WATER's rung lifts, split by the path they take.

## 1. The site inventory (siteCoherenceRatchet C1)

**Verdict: ORIGIN 0, EXPOSURE 14, TRUE AND RIGHT 4, over the 18 towns whose row moved.**
- No token the lane wrote is false of its town: every decisive export line is backed by a resource the town's own roster holds, plus the institution that gates it or a chain that works it.
- What reads false is the site deriver's old rules, which SITE_COHERENCE_PLAN's Waves 3 and 4 own.

### The instrument, and what it checked
- **The scan.** `siteScan.mjs` re-births the test's frozen corpus with the same literals and computes each town's `(terrain, siteKind, decisiveToken)` exactly as `scanCorpus` does: the production kind from `buildTownLayoutV2`, and the token by leave-one-out against the real `generateSite`.
- **Checks:**
  - At f572d12b7 the 462 keys aggregate EXACTLY to `.site-coherence-baseline.json`'s rows, and the key-derived category totals equal its frozen totals.
  - The reconstruction disagrees with the production kind on 0 towns at either tree.
  - `src/domain/townMap/`, `canonicalAccessors.js` and `resolveTerrain.js` are unchanged f572d12b7..aac79b808: the deriver did not move, its inputs did.
- **The test's own runner at the tip** (`sh scripts/gate-tail.sh npx vitest run tests/lint/siteCoherenceRatchet.test.js`) exits 1, with 1 failed and 8 passed. It reports **16 rows, not 14**: the book's fourteen (2 added, 9 grown, 3 shrunk) plus **2 VANISHED**, `desert|mountain-flank|iron` (frozen 2, now absent) and `plains|mountain-flank|stone` (frozen 1, now absent). Row 47 and §2i.6 omit those two.
- **The totals.** The test's next assertion (`scan.totals`, hidden behind the first red) is also off: water-on-dry 112 → 117, marsh-on-dry 24 → 27, flank-on-flat 38 → 40, dunes-on-wet 0 → 0, any-contradiction 150 → 157.
- **The bisect.** It scans the corpus at 15 commits: the lane's A′ pair on its own base (`6b932d3e8^`, `6b932d3e8`, `1dde265d8^`, `1dde265d8`, `8866a0ddd`), then 3575cf061, d0f0d022b, e449afc4e, 97804b535, e11750d62, df2249ff8, aa08dc10b, 1359d2435, 69b53decd and aac79b808. `siteAttribute.mjs` reads each town's key and roster across them.
  - The line's 3575cf061 equals f572d12b7 on all 18 towns, so points 44–46 move none of them.
  - Between scanned commits nothing moves any of the 18 except where named below. A move and its reversal inside an unscanned span cannot be excluded; none of the 18 shows a net move outside the named commits.

### The chain, every town
The agreement lane removes positional slots a town's access or terrain refuses, and refills them:
1. **A′** (`6b932d3e8`, "the crossroads position requires crossroads access") strikes `crossroads_position` from road towns.
2. **A′ refilled** (`1dde265d8`) refills the slot, sometimes with `defended_pass` on a town off the mountains.
3. **P3** (`df2249ff8`, "the refill never fills a slot with a member the record's terrain refuses") replaces that refilled pass.
4. **P2 (c)** (`aa08dc10b`, "the roll keeps no mountain pass off the mountains") replaces a base-rolled pass.

The replacement resource brings an export line, and the site deriver reads that line.
- Where the token is written: `computeActiveChains.js :: deriveExportsFromChains`, from the new resource's trade goods, gated by `RESOURCE_GOOD_INST_GATES` and `RESOURCE_EXTRACTION_GATES`.
- Where it is read: `siteGenesis.js :: generateSite`, whose arms are `WATER_ECONOMY_RE` (fish|preserved|reed|peat|pearl|whal|ferry|barge|timber|lumber), the marsh split (reed|peat) and the mountain arm (/ore|iron|stone|mine|silver|gold|coal/i).

| # | Town (settType/terrain/route@seed/culture) | Old row → new row | Commit that moved it | Slot: struck → filled | Decisive export line | True of the town by its record? | Class |
|---|---|---|---|---|---|---|---|
| 140 | city/plains/road@scw0-a1/south_asian | plains\|plain\|(biome) → plains\|mountain-flank\|coal | aa08dc10b P2 (c) | defended_pass → coal_deposits | Coal | YES: coal_deposits; petty_mining (vulnerable) and fuel (running) chains work it | EXPOSURE: coal → flank on a plain (Wave 3) |
| 143 | city/plains/road@scw0-a4/germanic | plains\|plain\|(biome) → plains\|mountain-flank\|coal | df2249ff8 P3 (pass from 1dde265d8) | crossroads → pass → coal_deposits | Coal | YES: as #140 | EXPOSURE (Wave 3) |
| 150 | city/forest/road@scw0-a1/mesoamerican | forest\|plain\|(biome) → forest\|mountain-flank\|coal | aa08dc10b P2 (c) | defended_pass → coal_deposits | Coal | YES: as #140 | EXPOSURE: flank in a forest (Wave 3's forest row) |
| 153 | city/forest/road@scw0-a4/greek | forest\|plain\|(biome) → forest\|mountain-flank\|coal | df2249ff8 P3 | crossroads → pass → coal_deposits | Coal | YES: as #140 | EXPOSURE (Wave 3) |
| 175 | metropolis/plains/road@scw0-a1/greek | plains\|plain\|(biome) → plains\|mountain-flank\|iron (ADDED) | aa08dc10b P2 (c) | defended_pass → iron_deposits | Iron ore, Refined iron ingots, Pig iron | YES: iron_deposits; Mine and Smelter; smelting chain (vulnerable) | EXPOSURE (Wave 3) |
| 185 | metropolis/forest/road@scw0-a1/steppe | forest\|plain\|(biome) → forest\|mountain-flank\|iron (ADDED) | aa08dc10b P2 (c) | defended_pass → iron_deposits | as #175 | YES: as #175 | EXPOSURE (Wave 3) |
| 252 | hamlet/plains/road@scw0-b1/greek | plains\|plain\|(biome) → plains\|mountain-flank\|coal | df2249ff8 P3 | crossroads → pass → managed_forest (+ a Charcoal burner by the roll) | **Charcoal** | The CHARCOAL is true (managed_forest + Charcoal burner). **COAL is not**: its coal_deposits' fuel chain is impaired and unavailable and it exports no coal. The deriver's `/coal/` reads Charcoal as coal | EXPOSURE: Wave 4 ("Charcoal leaves the mineral class") and Wave 3 |
| 264 | hamlet/forest/road@scw0-b1/germanic | forest\|plain\|(biome) → forest\|mountain-flank\|coal | df2249ff8 P3 | crossroads → pass → managed_forest (its burner and camp already stood) | **Charcoal** | as #252 | EXPOSURE (Wave 4) |
| 306 | village/forest/road@scw0-b1/steppe | forest\|river\|timber → forest\|mountain-flank\|coal | df2249ff8 P3 | crossroads → pass → grazing_land (the roll swapped Sawmill for a Dairy farmer: Milled timber left, Charcoal entered) | **Charcoal** | as #252 (managed_forest + Charcoal burner; coal unworked) | EXPOSURE (Wave 4) |
| 107 | town/plains/road@scw0-a3/south_asian | plains\|mountain-flank\|stone → plains\|river\|timber | aa08dc10b P2 (c) | defended_pass → managed_forest | Milled timber (the old token was "stone" from "Raw gemstones") | YES: managed_forest + Sawmill | EXPOSURE: timber read as water, a river on a plain (Wave 4's "timber leaves the water class"). Its old row was the same deriver's gemSTONEs → flank |
| 112 | town/hills/road@scw0-a3/celtic | hills\|mountain-flank\|(biome) → hills\|river\|timber | aa08dc10b P2 (c) | defended_pass → managed_forest | Milled timber | YES: as #107 | EXPOSURE (Wave 4) |
| 117 | town/forest/road@scw0-a3/mesoamerican | forest\|plain\|(biome) → forest\|river\|timber | aa08dc10b P2 (c) | defended_pass → managed_forest | Milled timber | YES: as #107 | EXPOSURE (Wave 4) |
| 294 | village/plains/road@scw0-b1/south_asian | plains\|river\|timber → plains\|river\|preserved | df2249ff8 P3 | crossroads → pass → grazing_land | Preserved foods (livestock chain, running) beside Milled timber | YES. The SITE did not move (river both sides): two water-read exports now hold it, so the first in source order is named | EXPOSURE, attribution only ("preserved" leaves the water class, Wave 4) |
| 205 | metropolis/desert/road@scw0-a1/mesoamerican | desert\|mountain-flank\|iron → desert\|mountain-flank\|ore | df2249ff8 P3 | crossroads → pass → ancient_grove | Iron ore (Refined iron ingots left the list) | YES: iron_deposits; Mine; iron chain (running). The SITE did not move | EXPOSURE, attribution only (Wave 3: desert flank → 0) |
| 108 | town/plains/road@scw0-a4/steppe | plains\|plain\|(biome) → plains\|marsh\|reed | df2249ff8 P3 | crossroads → pass → marshlands | Reeds and thatch | YES: marshlands is on the roster and the terrain table admits it. No chain works it (a raw good, ungated) | TRUE AND RIGHT: a marsh site for a town whose record holds a marsh (outside Wave 3's DRY_BIOME_RE; the audit counts it in marsh-on-dry) |
| 113 | town/hills/road@scw0-a4/arabic | hills\|mountain-flank\|(biome) → hills\|marsh\|reed | df2249ff8 P3 | crossroads → pass → marshlands | Reeds and thatch | YES: marshlands; its reed_marsh chain runs | TRUE AND RIGHT |
| 118 | town/forest/road@scw0-a4/south_asian | forest\|plain\|(biome) → forest\|marsh\|reed | df2249ff8 P3 | crossroads → pass → marshlands | Reeds and thatch | YES: as #108 (no chain) | TRUE AND RIGHT |
| 135 | town/desert/road@scw0-a1/arabic | desert\|mountain-flank\|iron → desert\|dunes\|(biome) (one of the VANISHED) | 6b932d3e8 A′ | crossroads struck; the roll re-dealt 17 houses out and 13 in | none: "Refined iron ingots" left the export list | The town still holds iron_deposits, a Smelter and a smelting chain (vulnerable); its iron simply no longer exports | TRUE AND RIGHT for the site (a desert town on dunes: a contradiction falls). The unexported iron is "found, not mine" |

**By row:**
- `forest|plain|(biome)` −6: #117 #118 #150 #153 #185 #264.
- `plains|plain|(biome)` −5: #108 #140 #143 #175 #252.
- `hills|mountain-flank|(biome)` −2: #112 #113.
- `desert|mountain-flank|iron` −2: #135 #205.
- `plains|mountain-flank|stone` −1: #107.
- `forest|mountain-flank|coal` +4: #150 #153 #264 #306.
- `plains|mountain-flank|coal` +3: #140 #143 #252.
- `forest|`, `hills|` and `plains|marsh|reed` +1 each: #118, #113, #108.
- `forest|` and `plains|mountain-flank|iron` new: #185, #175.
- `hills|river|timber` +1: #112.
- `plains|river|preserved` +1: #294.
- `desert|mountain-flank|ore` +1: #205.
- `desert|dunes|(biome)` +1: #135.
- The rest offset: #107 and #117 into river|timber against #294 and #306 out.

**Amendment 303's four conditions, for the 14 EXPOSURE towns:**
1. *The rows are old on the line.* At f572d12b7 the same rules already place 3 towns on a flank by "Charcoal", 20 plains and forest towns on a flank by true "Coal", 17 dry-terrain towns on a river by "Milled timber" and 10 by "Preserved foods".
2. *A named later lane owes the cure:* SITE_COHERENCE_PLAN Wave 3 (an export-derived flank needs a mountainous biome; the exit rows `(plains|forest|desert, mountain-flank, *)` reach 0) and Wave 4 (Charcoal leaves the mineral class; preserved, mill, timber and lumber leave the water class).
3. *The rise is confined to towns whose fact the lane changed:* every one of the 18 had a pass or crossroads slot refused and refilled by A′, P3 or P2 (c), and no other town of the 462 moved.
4. *Declared with counts:* this table.

### Recommendation (for the chair; nothing touched)
- **No cure at a token's home is owed.** No token is false of its town as the record writes it. The one false reading is "Charcoal" read as coal (#252, #264, #306), and that falsehood is the deriver's `/coal/` substring, Wave 4's named item, not a token the lane wrote.
- **Carry C1 red and named, re-stated as 16 rows plus the totals line.** Owner: SITE_COHERENCE_PLAN Waves 3 and 4. They are the only route by which the grown rows can shrink, since the form is shrink-only.
- **What could move by the ratchet's own form at the chair's point:** lowering the 3 shrunk rows and removing the 2 vanished ones. Read with this table, those five are the SAME 18 towns as the rises, so lowering them alone still banks half of one movement, as §2i.7 ruled.
- **Merge book:** correct row 47 and §2i.6 from "fourteen" to sixteen, naming the two vanished rows.

## 2. The sewer's HONEST FOUNDING arm: PROSPERITY_BAND

**Verdict: neither of the brief's two readings. The cause is LIVE THROUGH THE SAME FIELD; the arm lost its only witness.**

### What the reader reads (both trees)
- `sewerDerivation.js :: sewerCauses` reads PROSPERITY_BAND as `clamp(readCorruptionClimate(s).prosperity, 0, 1)`.
- `corruption.js :: readCorruptionClimate` returns `prosperity: prosperityRank01(eco.prosperity)`, where `eco = settlement.economicState`.
- The arm perturbs `economicState.prosperity` ('Destitute' and then 'Wealthy'). That is the field the reader reads, so the premise that "the arm perturbs the printed label" and the reader reads something else does not hold. The probe reads the cause value as 0.10 at Destitute and 0.95 at Wealthy on every birth, at both trees.
- `git diff f572d12b7 aac79b808 -- src/domain/corruption.js src/domain/undercity/` is EMPTY, and `SEWER_DERIVATION_TUNING` is byte-equal at both trees (probe 3). No commit of the agreement lane changed the reader, the leaf or its weights.

### What moved: the witness
Instrument: probe 3, `sewerProsperity.mjs`. It runs the arm's own 42 births with the sanitation roster stripped exactly as `withoutSanitation` strips it.

| Tree | Births where Destitute → Wealthy raises the rung | Births where it lowers the rung |
|---|---|---|
| f572d12b7 (the line) | **1**: town/hills (`uc1-acc-town-hills`): cesspits → culvert | 0 |
| aac79b808 (point 47) | **0** | 0 |

The witness at both trees:

| `uc1-acc-town-hills` | Civic houses | CIVIC_CAPACITY | Score at Destitute | Score at Wealthy | Rung at Destitute → Wealthy |
|---|---|---|---|---|---|
| f572d12b7 | Town hall, Hireling hall | 0.50 | 0.0553 (≤ absentFloor 0.1: cesspits, no draw) | 0.2678 | cesspits → culvert |
| aac79b808 | Town hall, Hireling hall, **Courthouse** | 0.75 | 0.1178 (> 0.1: the diced band; draws culvert) | 0.3303 | culvert → culvert |

Prosperity still adds +0.2125 to the score. A third civic house lifts the Destitute floor out of the no-draw zone, and at this identity both extremes draw culvert.

**The commit that did it, bisected on the witness alone** (probe `civic.mjs` in the scratch, one birth per commit):
- Present at 3575cf061 and absent at d0f0d022b.
- Within the lane's earlier history: absent at `6b932d3e8^`, **present at 6b932d3e8**, which is COHERENCE-AGREE-3 Part B (iii) A′, "the crossroads position requires crossroads access".
- The town is a road town. A′ struck its `crossroads_position` slot, the roster shrank from 31 to 30 houses, and the institution roll re-dealt and drew a Courthouse.
- 1dde265d8 (A′ refilled) later filled the slot with `ancient_grove`. P2 (c) (aa08dc10b) swapped `defended_pass` for `coal_deposits`. Neither touched the civic count.
- The Courthouse is a true house of the record, so this is a re-deal and not a false fact.

### Is the cause live? Measured on the same 42
Instrument: probe 4, `sewerProsperityIdentities.mjs`, K = 8 re-rolled identities per birth (`{ ...s, id: 's_pros_<n>' }`, the same device as the file's own MIDDLE-BAND and BOUNDARIES arms).

| Cause | Score rises (of 42) | Rung up / down, the arm as written | Rung up / down over 42 × 8 identities |
|---|---|---|---|
| PROSPERITY_BAND, line | 33 | 1 / 0 | 7 / 0 (town hills, forest, riverside, coastal) |
| PROSPERITY_BAND, tip | 33 | **0** / 0 | **8** / 0 (the same four towns) |
| CIVIC_CAPACITY, tip | 40 | 1 / 0 | 10 / 0 |
| CALAMITY_REBUILD, tip | 33 | 1 / 0 | 4 / 0 |
| HIGH_WATER_POPULATION, tip | 29 | 26 / 0 | 208 / 0 |

- **On births with a roster** (the sanitation house kept), prosperity moves no rung at either tree: line 1, tip 0. A roster city is ROSTER_FULL_WEB whatever its causes say, and the other births are the free ones above.
- **The fragility is shared.** CIVIC_CAPACITY and CALAMITY_REBUILD each stand on ONE witness in the arm as written, so the next re-deal of a town can red them the same way.
- **The test's own runner at the tip:** `sh scripts/gate-tail.sh npx vitest run tests/domain/undercitySewerDerivation.test.js` exits 1, with 1 failed and 7 passed. At `:240:73` it reports `expected [ false, true, true, true ] to deeply equal [ true, true, true, true ]`.

### Recommendation (for the chair; nothing in the file touched)
Re-found the arm's INPUT and leave its LAW untouched.
- The liveness and the never-the-wrong-way claims both run over the 42 roster-free births × 8 fixed identities (`id: 's_pros_<n>'`, n = 0..7, the identities measured), instead of the 42 at their default identity.
- Measured at the tip: the four RAISES causes read [true, true, true, true] for "right way somewhere", and 0 wrong-way moves for each. The LOWERS arm (GRADIENT) is unchanged.
- The same measure is green at the line, so the change is not tuned to the tip.
- The alternative is a re-seeded witness, but the file holds no seed rule to re-seed by.
- No page sentence needed checking: the cause is not dead.

## 3. The chair's rulings of 2026-11-13 (received 18:02 UTC), and what was done

**The rulings, as received:**
- **(1) Site, C1.** The verdict is accepted (origin 0, exposure 14, true and right 4). No cure is owed at any token's home.
  - C1 stays CARRIED RED AND NAMED, as sixteen rows plus the totals line: water-on-dry 112 → 117, marsh-on-dry 24 → 27, flank-on-flat 38 → 40, any contradiction 150 → 157. Nothing is banked or lowered.
  - The owner is the site plan's Waves 3 and 4, after the release. The inventory is ruled ONCE, on the final merged tree, at the closing acts, with this seat's three site probes as the instrument.
  - The book's "fourteen" is the merge seat's to correct.
- **(2) Sewer.** Re-found the arm's INPUT, its law untouched, in the test file only.
- **(3)** The two found items are taken by the chair.

### The three site probes: the exact commands, on any tree
Run from any checkout holding `docs/chair/2026-11-13/probes/AGREE-FOLLOW-UP/`. `<tree>` is the root of the checkout under measure; it needs `node_modules` and `tests/helpers/sourceContract.js`.

```sh
P=docs/chair/2026-11-13/probes/AGREE-FOLLOW-UP
# 1. the 462 rows at one tree (about 30 s)
node $P/siteScan.mjs <tree> <tree-name>.json
# 2. two trees compared: the aggregate movement, and every town whose row changed.
#    Its first line checks the BEFORE scan against the frozen baseline you name
#    (pass the before-tree's own .site-coherence-baseline.json).
node $P/siteDiff.mjs <before>.json <after>.json <before-tree>/tests/lint/.site-coherence-baseline.json <changed>.json
# 3. each changed town's key and roster at each scanned commit, in the order given
#    (<dir> holds one <sha>.json from step 1 per sha)
node $P/siteAttribute.mjs <changed>.json <dir> <sha1> <sha2> ...
```

For the closing acts:
- Step 1 at the final merged tree, then step 2 against `f572d12b7`'s scan with `f572d12b7`'s baseline.
- The aggregate must read the same sixteen rows, unless a later merge moves more towns. Step 2 lists any such town by identity.

### (2) The re-founded arm, commit 7e471bb23
- **The change:** one named constant, `LIVENESS_IDENTITIES = s_pros_0 … s_pros_7`, whose comment gives the cause. The RAISES block's two claims now run over the 42 roster-free births × those eight identities.
- **Unchanged:** every expectation's value, every weight, every source file, and the LOWERS arm.
- **Green at both trees,** through `sh scripts/gate-tail.sh npx vitest run tests/domain/undercitySewerDerivation.test.js`:

| Tree | The old file | The new file |
|---|---|---|
| aac79b808 (the tip) | 1 failed, 7 passed; 7.61 s (tests 951 ms) | **8 of 8**; 7.40 s (tests 1.05 s) |
| f572d12b7 (the line) | 8 of 8; 5.60 s (tests 701 ms) | **8 of 8**; 5.96 s (tests 1.13 s) |

- `sh scripts/gate-tail.sh npx eslint tests/domain/undercitySewerDerivation.test.js` exits 0.

### (2b) TEETH: executed by plant-and-restore
- **Setup:** a scratch worktree at aac79b808 with the new test file copied in. The plant is applied to `src/domain/undercity/sewerDerivation.js :: sewerCauses`, either at the weight read (`const weight = T.weights[cause]` → 0 for one cause) or at the sign of the contribution (×−1 for one cause). Each run was restored before the next.
- **What was read:** the HONEST FOUNDING arm's own assertion and line, from vitest's JSON report beside `gate-tail`. In the new file, line 249 is "never the wrong way" and line 250 is "the right way somewhere"; in the old file they are 239 and 240.

| Plant | The arm | What it reds |
|---|---|---|
| none (control) | passed | the suite 8 of 8 |
| PROSPERITY_BAND weight 0 | **red, 250** | `[false, true, true, true]`: its own slot |
| CIVIC_CAPACITY weight 0 | **red, 250** | `[true, false, true, true]`: its own slot |
| CALAMITY_REBUILD weight 0 | **red, 250** | `[true, true, false, true]`: its own slot |
| **HIGH_WATER_POPULATION weight 0** | **PASSED: the plant does not red. STOP.** | — |
| CALAMITY_REBUILD direction inverted | **red, 249** ("never the wrong way") | `[0, 0, 4, 0]`: four wrong-way moves, its own slot |
| PROSPERITY_BAND direction inverted | red, 250, not 249 | `[false, false, false, true]`: no wrong-way move appears; it starves the others' witnesses |
| CIVIC_CAPACITY direction inverted | red, 250, not 249 | `[false, false, false, true]` |
| HIGH_WATER_POPULATION direction inverted | passed | — |

### STOP: HIGH_WATER_POPULATION's slot of "the right way somewhere" has no teeth against its weight, and never had
- **Measured** (probe 7, `sewerHighWaterPath.mjs`, over the 42 × 8): of HIGH_WATER's 208 up-moves at the tip, **207 are DERIVED → TIER_FLOOR**. The arm's `peakTier: 'metropolis'` makes the derived high-water tier metropolis, whose ladder FLOOR lifts the rung whatever the weighted score says. Only **1** of the 208 is DERIVED → DERIVED through the weighted score.
- **Not made by this change.** With the OLD file at the tip, weight 0 for HIGH_WATER also leaves HIGH_WATER's slot TRUE. The arm reds there only through CALAMITY's slot (`[true, true, false, true]`), because the lower scores starve CALAMITY's one witness. The new file's eight identities give CALAMITY more witnesses, so that incidental red goes too.
- **For the chair to rule; nothing done:**
  - (a) accept: the slot proves the CAUSE (the high-water peak) live, through the tier floor, not its WEIGHT;
  - (b) a tooth arm for the weight alone: the same perturbation with the tier floor held, i.e. the score compared, not the rung;
  - (c) another ruling.
  The test file is unchanged beyond the ruled input.

## Found, not mine (reported, not touched)
- **#135** (town/desert/road@scw0-a1/arabic): its smelting chain on iron_deposits runs (vulnerable) and a Smelter stands, yet no iron good is in its exports after A′'s re-deal at 6b932d3e8. The site's win rests on that absence.
- **#108 and #118**: they export "Reeds and thatch" from marshlands with no chain working it (a raw, ungated good). By the chain model (`chainWorksResource`, amendment 303's one home of "worked here") the marsh is not worked.
- **The sewer arm's other two RAISES causes** (CIVIC_CAPACITY, CALAMITY_REBUILD) each rest on one witness in the 42 at the default identity (section 2).

## Hazard log
The local config and refs were snapshotted before and after every suite and every push. The only differences are this seat's own branch (`agree-fu-work`) and its remote-tracking ref.
