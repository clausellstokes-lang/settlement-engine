# Catalog hygiene / MF-CH3 — THE DATA SLIPS: the UI stops offering ten institutions the generator will never roll, five rows leave the military quarter, eleven strings stop overstating, and a cathedral city may keep its monasteries

- **Status:** LANDED
- **Packet version:** 1
- **Verified base:** `claude/composite-r4` at `373bbaa8457b6030fdb159d7164313c498d7ebe8`
  ⚠ **RE-STAMPED AT THE LANDING ACT (§556.10, executed by lane TE-RESIDUE-1).** This member's
  CODE landed as car 57 of TE-STACK-5 (`86794b5d2` → `510c51b76`, ODQ §548.1) and the packet was
  never flipped, so it wore DRAFT for six catalog-train landings while its own code sat in the
  branch. The status above and `PACKET_MANIFEST.json`'s are moved together, because
  `implementation-packets.mjs` reds when they disagree, and the base is re-stamped to the tip the
  ARMS WERE RE-CERTIFIED AT rather than left at the slot the figures were measured against — the
  two are different shas and the distinction is the point of §556.10.
  ⚠ **EVERY FIGURE IN §0–§6 BELOW REMAINS A READING AT `86794b5d2`, THE SLOT THIS CAR WAS BUILT
  AND MEASURED ON.** They are a historical record and are NOT re-derived here: eight catalog-train
  landings have moved the corpus since, and re-deriving a landed car's declared figures at a later
  tip would overwrite the evidence the landing was accepted on. What is certified at the new base
  is the ACCEPTANCE — the walker, the reachability suite and the four TEST-action suites — not the
  arithmetic.
  ⚠ The status value above stands ALONE on its line because `parsePacketHeader`
  (`scripts/implementation-packets.mjs`) anchors the status row at end-of-line (J-TEWF1B-1).
- **Provenance:** implemented by lane **TE-CH-3**. Third and final car of the catalog-hygiene
  train, after `MF-CH1` (`b2a3b463d`) and `MF-CH2A` (`17fe89763`), both LANDED at this base.
- **Charter and rulings:** `draft-CATALOG-HYGIENE-PLAN.md` §3, the CH skeptic panel over it,
  and three chair rulings — **J-CH-3-1** (close the reader gap, do not move the data),
  **J-CH-3-2** (`religiousCenter` rides as its own commit, ruled explicitly against THE
  PROMISE), and **delete the 26 redundant `minTier` rows** in a commit of their own. Every
  figure below is **re-derived at this base**; where a charter figure is carried, the
  re-derivation is named. **Five charter/panel claims are corrected here by execution** (§0.2).

---

## §0 · THE THREE THINGS THAT DECIDE THIS CAR'S SHAPE

### §0.1 · The measurement instrument, and the fact that the chair's target digest could not land

Every same-seed figure is measured over one corpus: **420 settlements** = 6 tiers × 2 cultures
× 7 terrains × 5 seeds, each terrain paired with its terrain-honest route, whole-record
sha256. The base digest at this slot is
`1cb39d7d9086dd875df32bb37e2d2965774b1d89b65967f47fd3250c1c65d25f`.

The chair required §3.2's shift to land at
`6127eae762dc8b4c4ef41b6ea1006d527c238cd679e45020fe9c3b776b600c18`, and to **stop and report
rather than re-record to match** if it did not. **It did not, and it could not.** `MF-CH1` and
`MF-CH2A` both landed between the charter's tip `00e7af612` and this slot, and both move
records, so the BASE the charter measured from is gone. Rather than re-record, the figure was
**proved where it was measured**: a detached worktree at `00e7af612` with its own `npm ci`
node_modules reproduces the charter's base `1a4a8d3f85e6424a427167ddc44a5e3d7a0e63a9316dab2894632883cf9c9c84`
exactly, and the `religiousCenter`-only variant there reproduces
`6127eae762dc…` **exactly**, at ROSTER_CHANGED 81 / 113 records moved / 0 settlement names.
The charter's figure is **CONFIRMED**; only its base is stale. The isolated shift at this base
has the identical shape — 81 / 113 / 0 and the same per-row table — which is the evidence that
what moved is the starting point, not this change's effect.

### §0.2 · Five claims corrected at this base, each by execution

| # | the claim as it reached this lane | measured here |
|---|---|---|
| **C1** | **H12 (charter) and §2 (skeptic panel): the `minTier` gate sits before the toggle read, "so a user force-requiring an above-block row at its own tier gets silence"** | **REFUTED.** Both read only the probabilistic loop's early return. There are **two further forced-toggle loops** (`assembleInstitutions.js:391`, the `_`-form, and `:457`, the `::`-form) and **neither consults `minTier`**. Measured: all ten gated rows appear in **70 of 70** settlements when force-required at their authoring tier, with no `outOfTier` flag. Positive control live — an ungated row goes 43/70 → 70/70 and a genuinely metropolis-only row goes 0/70 → 70/70 **with** the flag. A first attempt at this probe was VACUOUS (it passed `institutionToggles` in config; the reader is `config._institutionToggles`) and the control caught it |
| **C2** | §3.6: the two subterranean rows take "an affordance already landed on three sibling rows" | **The sibling shape is the WRONG shape and would have been an unpriced behaviour change.** The three `Underground network` rows declare `{ clandestine, subterranean }`. `clandestine` is a LIVE facet kind read by `domain/worldPulse/clandestineFacet.js`, whose `settlementHasUnderways` drives D6 couplings in `supplyKernel`, `foodStockpile` and `settlementLifecycleFirstClass`. Settled by execution at the charter's own base: the **one-key** form reproduces the charter's priced `a542cc2e9470ed95…` exactly; the sibling two-key form yields `5ceac4433aa7c739…`. Shipped one-key; the second key is deferred to the undercity train and is now **pinned** so it cannot arrive by a tidy-up |
| **C3** | §3.7: `Kidnapping ring`'s engine-unreachable description is one string | **THREE.** Both `city\|Criminal\|Kidnapping ring` desc VARIANTS assert the same claim the `exclusionConditions` refute, and the variant pick is a hash over three entries — a reader had a **2-in-3** chance of being shown the uncorrected sentence. Widened by §3.4's own reasoning |
| **C4** | §3.2 (charter): "at city the group holds two members, so a city gets one or the other, never both" | **FALSE, as the skeptic panel found and this lane re-executed.** `Multiple monasteries` reaches a city's final roster **0 of 70** times at base. The exclusive group is one cause; the other is `coherenceRepairPass` deleting it as `unsupported_institution`, because the dependency it needs also carried the group |
| **C5** | §3.2: the declared shift is 81 rosters and ~130 names | **CONFIRMED exactly** (81 / 113 records / 376 distinct new name strings / **0 settlement names**) — **and incomplete.** The charter never priced the **`Monastery or friary` injection**: freeing the dependency lets a TOWN-tier row into cities, 0 → 21 at city and 0 → 5 at metropolis. Declared in §4 |

### §0.3 · The environment, and why every figure was measured twice

An earlier pass of this lane symlinked the MAIN worktree's `node_modules`, which declares
**36** dependencies against this slot's **40**. On the chair's instruction the tree was rebuilt
with its own `npm ci` (468 entries) and **every figure in this packet was re-measured**. All
five corpus digests, both retrovalidation digests and the golden totality check reproduce
**byte-identically** before and after; the values quoted are the post-reinstall run. The
reinstall also installed the husky shim, so commits from that point run `eslint --fix`, which
re-stages — probed and **inert here**: `eslint` exits 0 over all eight touched files and
`--fix` rewrites none of them, so no hook edit can diverge a committed digest from its
declared value. Each commit's digest was additionally **re-derived at its committed sha**.

---

## §1 · WHAT THIS CAR IS

Seven items from charter §3, landed as **five separable commits plus a bundle rebuild**, so
that each declared same-seed movement is attributable to exactly one commit.

| commit | item | rosters / 420 | corpus digest after |
|---|---|---|---|
| `dd731e3f3` | §3.1 **J-CH-3-1** — the reader fix, the walker, the ratchet amendment | **0** | `1cb39d7d…` (**unmoved**) |
| `916ede2d7` | §3.3 five `priorityCategory` + §3.6 two `facets` | **0** | `ad3eb015bc798ed47b6491eebb1e845faa211ade8ab0f99a61077c3eb65b5ba9` |
| `c6e3eda51` | §3.4 + §3.5 + §3.7 — the eleven-string prose sweep | **0** | `85132b1976e4a1af98eb1519888d0960cbd5df42ed9f18c0167757cafe9a0e83` |
| `c4d71b4ea` | §3.1 tail — the 26 redundant `minTier` | **0** | `bc5079e823b34075196733da5e827a128dcd20fdfcc2221830902e49915b8995` |
| ~~`1d1e8fc86`~~ | §3.2 first form — delete `exclusiveGroup` | ~~81~~ | ~~`036f620a…`~~ **SUPERSEDED** |
| `2a8e7f26a` | the three edge bundles that carry the catalog | — | unchanged (bundles are outputs) |
| **`501122493`** | **§3.2 REVISED (J-CH-3-2 as re-ruled)** — the coexistence rides a side stream | **30** | `ae67602f44c3a27081aaa7ca0f121a667ac0652abe8c086bc7f2424eca1f65e1` |

---

## §2 · §3.1 — THE `minTier` READER GAP, CLOSED AT THE READER

**Re-derived at this base:** 311 rows, 36 carry `minTier`, **26 REDUNDANT**, **10 ABOVE-BLOCK**,
0 BELOW — the charter's figures exactly. For all ten, `getInstitutionalCatalog(tier)`,
`getInstitutionsForTier(tier)` and `getFullCatalogWithTierMeta()` returned the row at its
authoring tier while the generator refused it there.

**The ruling (J-CH-3-1).** Close the reader gap; do not move the data. The measurement decides
it: deleting `minTier` changes 97 of 420 rosters and moving the rows changes 108 while
clobbering the city's own `Smuggling network`. Both are content changes wearing a hygiene
label. The reader fix costs **zero**. *This contradicts §491's "the tier block is the
structural truth" framing; the chair corrected that framing on the measurement and asked that
the divergence be recorded here with the correction in the chair's name.* **It is the
charter's one substantive divergence from §491, and the chair owns the correction.**

**Why the ten are an idiom and not a paste**, which is the evidence §491's framing lacked: the
gated rows are **interleaved** with un-gated neighbours inside the same shelf — city
Entertainment gates positions 5, 6, 8, 9 of 10 and city Exotic gates 1, 2, 5, 6, 7 of 7. An
author who interleaves is exercising judgement.

**What changed in `lookups.js`.** `institutionAvailableAtTier` reuses `tierAtLeast` from
`constants.js` — the predicate `institutionLifecycle` already uses — and is applied to
`getInstitutionalCatalog` and `getInstitutionsForTier`. `getFullCatalogWithTierMeta` keeps
every row and instead reports `nativeTier` as the **effective** tier: that view spans all
tiers, so nothing there was unreachable — what was wrong was the LABEL `InstitutionalGrid`
renders, including its "Out-of-tier (… tier)" affordance. `'all'` is exempt by design (a
metropolis-gated row IS reachable, at metropolis) and the walker pins the exemption. Empty
categories are dropped, mirroring `filterCatalogForMagic`, which runs immediately after this in
`selectCurrentCatalog`.

**The zero-shift claim is STRUCTURAL, not merely observed.** The corpus digest is unmoved, but
for a `lookups.js` change **the digest is an instrument that cannot fail** — nothing on the
generation path imports the module. That is stated rather than leaned on. The load-bearing
evidence is walker arm **A5**, an import census over `src/generators`, `src/domain` and
`src/lib` that finds zero importers and carries a positive control proving the scan finds one
when it exists.

**The ratchet amendment, recorded as the decision it is.**
`tests/generators/metropolisCatalogReachable.test.js`'s RATCHET arm asserted every block row is
reachable at every tier whose block names it. That was right while the lookups returned raw
blocks and is wrong now. It is amended to **"reachable at every tier the row can actually fire
at"**, and the amendment is written into the file header as a contract change. It is not a
weakening: two arms are ADDED so the file says strictly more than before — a gated row must be
**absent below its gate and present at it**, and `nativeTier` must be gate-honest.

---

## §3 · §3.3 · §3.4 · §3.5 · §3.6 · §3.7 — THE REST OF THE SLIPS

**§3.3 — the `priorityCategory` run.** Four contiguous city/Economy rows (`Mint (official)`,
`Auction house`, `Harbour master's office`, `Furrier's district`) and city/Criminal's
`Contract killer` read `'military'`. The honest frame is stated rather than assumed: a
catalog-wide modal audit shows `priorityCategory` divergence is systemic and **owner-settled**,
and `priorityCategoryPlausibility.test.js`'s own header says so — a departure is not by itself
a defect. What identifies these five is the contiguous-run signature that header names plus a
measured live consequence: `CATEGORY_AFFINITY` ranked all five
`["military","civic","noble","residential","other"]`, placing an auction house, a furrier's
district and a contract killer in the **military quarter**. Executed after: economy →
`["merchant","civic","craft",…]`, criminal → `["criminal","residential",…]`.

**§3.4 — the tanner overstatement, all FIVE spellings.** R-INST-2 §9(c)'s three negation rounds
found "Null for tanners specifically"; Coventry 1421 concerns butchers, and Northampton,
Norwich, Gloucester, York and Nottingham are intramural. **No engine reader enforces it** —
`townLayoutV2.js:209`'s regex reads a QUARTER's own `location` prose and `townMapModel.js:516`'s
haystack is `name + priorityCategory + category + tags`; neither reads the catalog `desc`, and
`tannery` already matches the layout regex by NAME, so the placement weight survives. All five
move into the register the village row already uses; every stated fact is kept and only the
false universals (MUST / always / keeps) go.

**§3.5 — HK-6.** The three "Eberron" strings. `grep -rn Eberron src/` is now **empty**. The
shift is narrower than "goldens move": `assembleInstitutions` picks among
`[canonicalDesc, ...variants]` with a pure fnv hash of `${seed}:${name}` — zero draws,
text-blind — so the strings change, never the chosen index and never the roster.

**§3.6 — the two subterranean rows.** `Underground city` and `Black market bazaar` are
explicitly subterranean in their own prose and seeded the undercity sheet **zero** times.
Verified through the live chokepoint: both now yield
`{class:'subterranean', licence:'INSTITUTION_FACET', anchor:'underground_city' / 'black_market_bazaar'}`.
See §0.2 C2 for the one-key ruling and its receipt.

**§3.7 — `Kidnapping ring`.** The description yields to the condition, across all **three**
homes (§0.2 C3). The authored specificity (forged provenance documents) is **preserved** rather
than replaced: the charter's proposed replacement dropped that mechanism, and deleting authored
content is a larger change than matching the condition requires. Changing
`exclusionConditions` instead would be a roster shift and is refused (§5 anti-scope 7).

---

## §4 · THE DECLARED SHIFT

### §4.1 · The zero-roster half — a clean seven-template census

`base → c4d71b4ea`, all 525 golden settlements regenerated as OBJECTS from COMMITTED BYTES in a
separate detached worktree with its own `npm ci`, deep-diffed with array indices collapsed:

```
$.institutions[*].minTier                            1,410 removals / 168 rows
$.defenseProfile.institutions.charter[*].minTier        168 removals / 168 rows
$.defenseProfile.institutions.magicDef[*].minTier       138 removals /  82 rows
$.defenseProfile.institutions.garrison[*].minTier        84 removals /  84 rows
$.institutions[*].priorityCategory                      181 changes  / 109 rows
$.institutions[*].desc                                  104 changes  / 104 rows
$.institutions[*].facets                                 84 additions /  84 rows
```

**Zero array-length moves, zero key-order moves, zero other additions or removals.** Those are
exactly the car's four declared classes and nothing else. No name, count, id or rng draw moves,
and the corpus measurement agrees at **ROSTER_CHANGED 0 of 420** for all three commits.

### §4.2 · The coexistence — J-CH-3-2, ruled against THE PROMISE and then RE-RULED

`c4d71b4ea → tip`: **22 of 525** golden rows move across 65 path templates, all of them
inside the 272 half A already moved.

⚠⚠ **THE CHAIR REVISED THIS ITEM MID-BUILD (§538.5 revised), and the revision is the point.**
The first form deleted `exclusiveGroup: 'religiousCenter'` from the two city rows and cost
**81 of 420 rosters / 144 golden rows / 314 templates**. That price bought the wrong thing.
The *intent* is that a cathedral city may also hold friaries and a nunnery — which the
metropolis block already permits, making the city rows the inconsistency. The 81-roster
reshuffle was an **artifact of where the exclusivity check sits**: the early return precedes
the `rng.chance` draw, so a suppressed row consumes NO draw, and un-suppressing it makes it
start consuming one and re-rolls every later draw in that settlement.

**THE SHIPPED FORM.** A row declaring `exclusiveGroupCoexists: true` stays IN its group but is
no longer BLOCKED by it, and its chance is drawn from
`rng.fork('exclusiveCoexist::<tier>::<category>::<name>')`. Staying in the group is the
load-bearing half: `coherenceRepairPass` refuses a same-group dependency add, so the TOWN-tier
`Monastery or friary` the first form dragged into 21 cities never appears. Measured:

| row | city | metropolis |
|---|---|---|
| `Cathedral (10,000+ only)` | 26 → 26 (unmoved) | 29 → 29 (unmoved) |
| `Multiple monasteries` | **0 → 12** | 32 → 50 |
| **`Monastery or friary`** | **0 → 0** | **0 → 0** |
| `Great cathedral` | 0 → 0 | 45 → 45 (unmoved) |

**ROSTER_CHANGED 30 of 420** (was 81) · 87 records · 123 distinct new name strings (was 376)
· **settlement names 0**. 12 city + 18 metropolis = the 30, so the row the ruling is about is
now the dominant term rather than collateral.

⭐ **AND IT DISSOLVED A BILL THE CHARTER NEVER SAW.** Under the first form the
live-reconstructed Wizard News corpus moved (`introductions` 272 → 270), cascading into two
frozen baseline JSONs, a 106-row address digest, and `activeRules` 15 → 14 — which would have
required an **authored** written reason for a headline rewrite rule going permanently inert,
prose in a protected substrate with **no `UPDATE_*` path by design**. That absence was the
codebase saying the substrate is not to be moved by a catalog repair. Executed under the
shipped form: both news walkers are **2 files / 16 tests / EXIT 0**.

⚠ **WHAT IT COSTS, NAMED:** `exclusiveGroupCoexists` is a new one-key catalog affordance and a
new engine branch. The panel variant hard-coded the group name inside `assembleInstitutions.js`
and was explicitly a probe, so the permission had to become data. The affordance is general and
outlives this car: it is how the estate can un-suppress or add a catalog row **without
re-rolling every existing seed** — THE PROMISE as a mechanism rather than a hope.

**The estate's own precedent:** the metropolis block's `Great cathedral` and
`Major monasteries (5-10)` carry **no** `exclusiveGroup`. The same pair, one tier up, already
coexists; the city rows were the outlier.

### §4.3 · The golden re-record

**272 of 525** rows move; 0 added, 0 removed. **TOTALITY:** the base-side regeneration
reproduced the OLD manifest on all 525 rows (0 mismatches, key set identical), which proves
this car is the only source of the drift. A SHIFT RECORD row is added to
`generatorGoldenMaster.test.js`'s docstring, as that file's own law requires.

---

## §5 · ACCEPTANCE — EIGHT ARMS, EIGHT MUTANTS DRIVEN

`tests/lint/catalogTierGateParity.walker.test.js`. The parity arms rebuild the eligible set
from the RAW catalog using the gate **parsed out of the shipped engine source** (A0), never
from the predicate under test — a set compared with itself is not a proof.

| arm | what it pins | convicted by |
|---|---|---|
| A0 | the gate this walker models is the gate the shipped `assembleInstitutions.js` contains, read against the SETTLEMENT's tier index | M5 (`<` → `<=`) |
| A1 | the gated class is the measured ten, enumerated by tier/name/minTier | M8 (delete `Colosseum/arena`'s gate) |
| A2 | `getInstitutionalCatalog(tier)` === the generator-eligible set at every tier | M1 (revert the catalog filter) |
| A3 | `getInstitutionsForTier(tier)` === the same set; non-vacuity floors | M2 (revert the names filter) |
| A4 | the `'all'` browse is the deliberate exemption and stays whole | M4 (gate the browse) |
| A5 | **no generation-path module imports `lookups.js`** — with a positive control | M6 (import it from `institutionProbability.js`) |
| A6 | the FORCE path deliberately does not consult `minTier`, pinned by position | M5, M7 (teach a forced loop the gate) |
| A7 | the tier-less preview path is the village view, gate included | M1 |

Every mutant was restored `cmp`-exact with a green control before the first and after the last.
The amended `metropolisCatalogReachable.test.js` arms are convicted by M1, M2, M3 (revert
`nativeTier`) and M8.

---

## §6 · THE CENSUSES, THE BUNDLES AND THE GATES

* **Edge bundles.** `institutionalCatalog.js` is an input to exactly three —
  `aiCharterBundle`, `aiGroundingBundle`, `aiOutputSchemaBundle` — rebuilt at the C5 tip with
  every source input **committed**, which is what `edgeSharedBundleReproducibility.test.js`
  requires (it hashes `git show :<path>`, so a bundle built from unstaged edits reds).
  ⚠ `analyticsEventsBundle.meta.json` and `intentAtlasBundle.meta.json` came back dirty in
  `generatedAt` ONLY, with `sourceHash` unchanged and their `.js` unmoved, because neither
  lists a CH file. Nothing enforces `generatedAt`. They were **reverted** rather than
  committed: two timestamp-only diffs on shared paths, with three sibling lanes live, is pure
  conflict surface for zero enforced content. §4.6's "all five as a set" is one
  `build:edge-shared` away if the chair wants the convention honoured literally.
* **The mutation-coverage manifest.** A new `tests/lint` file is enumerated by the E-A TOTALITY
  arm and owes an entry. `uncovered` is refused by the SHRINK-ONLY arm, so the entry is a
  `rationale` naming the **eight mutants this lane actually drove**, following MF-CH1's and
  MF-CH2A's precedent. `src/generators/lookups.js` is not in `MUTATED_FILES`.
* **The lighting census**, WALKED at this tree and never carried, with the ROW **DEFERRED to
  the landing act** per §417 and the MF-CG1 / MF-CH1 precedent:

  ```
  slot 86794b5d2   files 2524 / parked 366 / credited 2158 / titles 21002 / suiteTitles 5845
  this tip         files 2525 / parked 366 / credited 2159 / titles 21012 / suiteTitles 5846
  DELTA                  +1   /       +0   /        +1     /        +10   /            +1
  ```

  **ATTRIBUTED PER FILE BY EXECUTION, not by arithmetic** — the walker's own
  `parkReasonsFor` / `liveTitlesIn` / `liveSuiteTitlesIn` were run at BOTH ends:

  | file | slot | tip |
  |---|---|---|
  | `tests/lint/catalogTierGateParity.walker.test.js` | absent | credited, 8 titles, 1 suite |
  | `tests/generators/metropolisCatalogReachable.test.js` | 5 titles, 1 suite | **7** titles, 1 suite |
  | `tests/domain/undercityStrataExistence.test.js` | 8 titles, 1 suite | 8 titles, 1 suite (a body amended, no title added) |
  | `tests/property/generatorGoldenMaster.test.js` | PARKED, 0 titles | PARKED, 0 titles (the SHIFT RECORD is a docstring) |

  8 + 2 = the +10, and the one new suite title is the new walker's. The arithmetic closes:
  366 + 2,159 = 2,525. **Method:** the classifier was LIFTED out of vitest — walker lines
  485–1400 with the `vitest` import struck, run under plain node — because the gate mutex was
  held continuously by sibling lanes. Its non-vacuity is a live positive control: at the slot
  the lift reproduces the walker's own published tuple `2524 / 366 / 2158 / 21002 / 5845` exactly.
  ⚠ THE DELTA IS CARRIED, NEVER THE TUPLE: the slot moved from `79b78881c` to `86794b5d2`
  under this lane (TE-AIP-1 + MF-CH2B), which moved the absolutes by +1/+0/+1/+20/+5 and this
  car's delta not at all. Both ends were re-walked at the NEW slot.

---

## §7 · JUDGMENTS, DEFERRALS AND OPEN CALLS

### Judgments taken in-lane

* **J-TECH3-A — the `facets` declaration is one key, not the siblings' two.** *Why:*
  `clandestine` is a live D6 coupling input, so copying the sibling shape activates engine
  behaviour rather than declaring an existing truth, and it prices differently (§0.2 C2).
  *Reversal:* add the key. *Now guarded* by the amended `undercityStrataExistence` arm.
* **J-TECH3-B — §3.7 is widened from one string to three.** *Why:* the variants assert the same
  engine-unreachable claim and are chosen 2 times in 3; §3.4's own reasoning applies.
* **J-TECH3-C — the `Kidnapping ring` rewrite preserves the authored mechanism** rather than
  taking the charter's proposed replacement, which dropped "forged provenance documents".
* **J-TECH3-D — the two timestamp-only bundle metas are not committed** (§6).
* **J-TECH3-E — the `undercityStrataExistence` A8 pin is amended, not deleted.** It explicitly
  asserted the absence §3.6 removes; it now asserts the presence, plus the `clandestine` NULL.

### Deferrals — documented, not bugs to re-find

* **`clandestine` on the two subterranean rows** — a D6 coupling question with its own price;
  §5 anti-scope 8 routes it to the undercity train. Pinned so it cannot arrive by accident.
* **`institutionLifecycle.js`'s own `nativeTier` reader** (`:223`, `:272-278`) builds its
  entries from `TIER_ORDER[rank]` and does **not** honour `minTier`. It is a sibling of the gap
  J-CH-3-1 closes, in the worldPulse layer, outside the three functions the ruling names, and
  changing it is a living-history behaviour change. **Recorded, not fixed.**
* **The force path's asymmetry** (§0.2 C1) — pinned by walker arm A6, deliberately not repaired.

### The four calls, RULED BY THE CHAIR (all four as recommended)

1. **RULED: its own car. AGREED.** **The re-homed `Priest (resident)` override.** `MF-CH1`'s own packet says the chair moved
   J-CH-1's `facets: { institutionNature: 'faith' }` to **CH-3a** at §503.3 "because it lands on
   every village record and reds `generatorGoldenMaster`", and MF-CH1's walker arm A7 says it is
   "ready for CH-3a's first declaration". It is **not in this lane's brief** and
   `Priest (resident)` carries no override at this tip. **Recommendation: do NOT fold it in
   here.** It is a separate declared shift (70 of 420 records) that would arrive unbriefed
   inside a car already carrying the train's largest roster movement, muddying exactly the
   attribution the chair asked for by requiring separate commits. It is one line plus a SHIFT
   RECORD row as its own car.
2. **RULED: TAKE THE VARIANT — the chair revised J-CH-3-2 against its own first form, and this car ships the variant (§4.2).** The recommendation below is preserved as written so the reasoning that produced the revision stays legible. **The skeptic panel's rng-preserving variant B for §3.2.** A side-stream `rng.fork` delivers
   the coexistence at **34 of 420** rosters instead of 81, with **no** `Monastery or friary`
   injection and NPC name lists moving in 5 of 140 city/metropolis settlements instead of 73.
   **Recommendation at the time: do NOT take it in CH-3 —** *superseded by the chair's revision; the variant IS taken, in a shippable data-driven form.* The panel itself calls it a probe, not a
   shippable design — it hard-codes `'religiousCenter'` inside `assembleInstitutions.js`, a file
   this car does not touch, and it is a NEW mechanism rather than a repair. Its value is the
   **attribution** it proves: of the 81 changed rosters, ~34 are the intended coexistence and
   ~47 are draw-sequence collateral. That is the number worth ruling against THE PROMISE.
3. **RULED: WAIVED for this car**, with the reason recorded: the fourth file is a CONSEQUENCE of the ruling rather than a scope expansion, and splitting would put a declared shift and its own baseline in different commits. (The shipped car is in fact FIVE production files — `assembleInstitutions.js` joined it with the revision, for the same reason.) **The ≤3 production-file ceiling.** This car touches **four** — `institutionalCatalog.js`,
   `institutionDescVariants.js`, `institutionVocabulary.js`, `lookups.js` — against
   J-CH-3-5's proposed three-way split. The chair's brief directed a **single** packet minted
   last and alone, which is what this is. **Recommendation: waive the ceiling for this car.**
   The panel measured that it is a chair convention, not a validator rule
   (`implementation-packets.mjs` has no file-count check), and the split's stated benefit — one
   kind of shift per car — is already delivered by the five separated commits and their five
   separately measured digests.
4. **RULED: NEITHER. AGREED** — both are data moves, and the ruling already refused that class on measurement; consistency outweighs the individual merits. **The skeptic's two data candidates inside the `minTier` ten.** The panel recommends deleting
   the village `Smuggling network` row outright (measured dead: 0/70 at village with AND without
   its gate, and shadowed by the city row of the same name in every merged view) and ruling
   `Dragon resident` explicitly (its desc says "living in **city**", contradicting its gate;
   +7 city settlements to free it). **Recommendation: neither in CH-3** — the ruling is "do not
   move the data", and both are data moves. But the `Dragon resident` contradiction should not
   stand under a reader filter indefinitely; it is a one-row content call for the content train.
