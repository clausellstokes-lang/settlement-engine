# AGREE-FOLLOW-UP: the hand-back (point 47's two carried reds, explained by measure and trace)

The seat: AGREE-FOLLOW-UP, seated by the chair (session_01FE9mEws7PXYRYdjQPbSX15) on 2026-11-13. It owns the two tests that STOP 47d (merge book §2i.6, ruled in §2i.7) carried red and named.
- Lane: `lane/agree-follow-up-2026-11-13`, cut from the line's tip `aac79b808` (point 47), read back from origin at the cut.
- The line before the point is `f572d12b7`.
- The agreement lane's own range is `3575cf061..69b53decd`. It merged the line at `3575cf061` (d0f0d022b); its earlier commits sit on the line at point 43.

Rulings worked to: the brief (this file's only source of rulings so far). Nothing in `src/` is changed, no test is touched, and no baseline row is banked. This seat's commits are probes and this file.

Probes (`docs/chair/2026-11-13/probes/AGREE-FOLLOW-UP/`), each runnable as `node <probe> <tree root> ...`:
1. `siteScan.mjs`: the site ratchet's 462-town corpus, row by row.
2. `siteDiff.mjs`: two scans compared, every changed town listed.
3. `siteAttribute.mjs`: one changed town's key and roster commit by commit.
4. `sewerProsperity.mjs`: the arm's 42 births at the two prosperity extremes.
5. `sewerProsperityIdentities.mjs`: each RAISES cause over the 42 × K identities.
6. `sewerWitnessCivic.mjs`: the sewer witness's civic houses at one tree.

## 1. The site inventory

(Pending: the per-town bisect is running. This section lands in the next commit.)

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
