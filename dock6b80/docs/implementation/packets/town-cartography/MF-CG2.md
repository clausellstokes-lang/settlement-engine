# Town cartography / MF-CG2 — the cell address: a quarter of every drawn map was one building standing inside another

- **Status:** LANDED
- **Packet version:** 1
- **Verified base:** `claude/composite-r4` at `373bbaa8457b6030fdb159d7164313c498d7ebe8`
  ⚠ **RE-STAMPED A SECOND TIME AT THE LANDING ACT (§556.10, executed by lane TE-RESIDUE-1).** This
  member's CODE landed as car 58 of TE-STACK-5 (ODQ §548.1) beside `MF-CH3`, and like its sibling
  the packet was never flipped out of DRAFT afterwards. The base above is now the tip the
  ACCEPTANCE ARMS were re-certified at, not the slot the figures were measured against; the
  paragraph below records the FIRST re-stamp and is kept because the chain of bases is what makes
  a stacked landing auditable. Every figure in §1–§5 remains a reading at `86794b5d2` and is NOT
  re-derived here — including the `DUPLICATES.city.permille` 51 → 50 move ODQ §548.6 ratified.
  ⚠ **TWO `checks` ROWS WERE PRUNED IN THE SAME ACT, AND THE REASON IS A SILENT INSTRUMENT.**
  This packet's third check named `tests/ui/settlementMapPropertyLine.test.jsx` and
  `tests/ui/mapCartographySubTab.test.jsx`; TE-STRIP-1 deleted both with the map (`5d839e198`,
  "the map's tests leave with the map"). Executed at the certification tip the row reports
  **10 files passed** for twelve named paths — vitest neither errors nor warns on an argv path
  that does not exist, and `implementation-packets.mjs` only asserts that a `checks` row is a
  non-blank argv array, never that its paths resolve. A certification that quietly runs less
  than it names is worse than one that reds, so the two dead paths are removed rather than left
  to make a future re-run look complete. **This is a CLASS, not this packet's slip:** a census
  over all 182 records at this tip found **23 dead path-shaped argv tokens across 10 LANDED
  packets**, all strip residue; the other 21 are carried to the chair rather than swept here,
  because the strip lanes are still landing and a sweep would be stale on arrival.
  ⚠ **RE-STAMPED BY THE TE-STACK-5 LANDING (§5c).** This member was BUILT on `79b78881ca86612ec312602c2e3dc6d06aa34df8`
  and every figure in §1–§5 was measured there. It landed STACKED ON `MF-CH3`, whose own verified
  base was then `86794b5d2480d6bf7821aa390a82f99f4babeeca` — the slot both cars were certified
  against, and the value this line carried until the landing-act re-stamp above superseded it. The
  member's own commits sit on the MF-CH3 tip
  `da2c7085ced2891c3967e5ae21a804fdb8efd537` and the whole stack landed against that slot.
  Both stamped places — this line and `PACKET_MANIFEST.json`'s `verifiedBase` — were moved
  together, because `implementation-packets.mjs` reds when they disagree.
  ⚠ Read with `git rev-parse --verify -q` at this lane's opening, never extended from a quoted
  prefix (§381's fabricated-SHA law) and never taken from the dispatch text.
  ⚠ The status value above stands ALONE on its line because `parsePacketHeader`
  (`scripts/implementation-packets.mjs`) anchors the status row at end-of-line (J-TEWF1B-1).
- **Depends on:** `MF-CG1` (LANDED) — this member measures itself through the calibration corpus
  that member built. `MF-CG1b` (LANDED) — its 287-of-504 → 0-of-504 cure is the CONTROL this
  member may not regress, and it is re-proved at this tip.
- **Family preamble:** `docs/implementation/preambles/MF-PREAMBLE.md`, SHA-256
  `0706aad6a84e4f74ec47602e9e3222fc398c4c8864bb38c79ac480c2a11db4ed` — recomputed from the file at
  THIS base by this lane, identical to the value MF-CG1b carries, so no re-stamp occurred.
- **Charter:** the chair's TE-CG-2 dispatch — *"roughly 13% of drawn buildings have footprints
  identical to another building in the same settlement… it blocks the estate/property-line wave."*
  **The 13% is corrected by this member, upward** (§1).
- **Collision group:** none. `PACKET_MANIFEST.json` at the member's build base held **175 packets:
  174 LANDED and 1 SUPERSEDED — ZERO non-terminal** (measured by execution against the manifest,
  not remembered), so no packet reserved any path this member names.
  ⚠ **RE-DERIVED AT THE STACKED TIP BY EXECUTION, and NEITHER car's own count was carried:**
  `MF-CG2` and `MF-CH3` each independently measured the surface at 176 from the same 175 base, so
  the arithmetic a stack invites is wrong by one. `npm run validate:packets` at the stacked tip
  reads **`valid: 177 packets (0 READY)`** — 174 LANDED, 1 SUPERSEDED and the TWO DRAFTs this
  landing carries. The two cars' change manifests remain path-disjoint: `MF-CH3` names
  `src/data/**`, `src/generators/**`, `src/domain/display/**`, `src/domain/data/**` and
  `supabase/functions/_shared/**`; `MF-CG2` names `src/domain/townCartography/**`. The only files
  both touch are the shared landing surfaces — `INDEX.md`, `PACKET_MANIFEST.json` and the
  calibration corpus — and §5c prices the last of those.
- **Commit authority:** this lane commits on its own detached worktree ref. **No ref is moved.**
- **⚠ THIS MEMBER MOVES `src/**` AND DECLARES A SAME-SEED SHIFT AT EVERY TIER.** §5 prices it.

---

## §1 · THE MEASUREMENT CAME FIRST, AND IT CORRECTED THE BRIEF

The 13% was inherited. It is not reproducible: no reading, no corpus and no denominator this lane
tested lands near it, and no derivation of it exists anywhere in the repo. The lane therefore
re-derived it before touching a line.

**Denominator.** Every row of `manifest.cartography.buildings` over the MF-CG1 calibration corpus —
6 tiers × 12 cultures × 7 terrains = **504 settlements**, threat rotated `i % 4`, seed rotated
`i % 12` over `cg1-seed-00..11` — compiled through the real `generateSettlementPipeline` and the
real `compileTownSceneManifest` with `townCartographyEnabled`. **504 of 504 compiled, 0 threw**
(MF-CG1b's cure, re-proved at this base). **53,420 buildings**: 29,482 institutions, 23,938
dwellings. The rate is the share of buildings sharing a footprint with **at least one other
building in the same settlement**, counting every member of a duplicate group.

**"Identical" is not one question, so the lane answered it five ways.**

| reading                                        | rate | dup / total |
|---|---:|---|
| **exact** — vertex-for-vertex, same absolute coordinates | **26.42%** | 14,112 / 53,420 |
| exact, cycle-canonical (any starting vertex)   | 26.42% | 14,112 / 53,420 |
| **translate** — same shape and size, moved     | **63.30%** | 33,814 / 53,420 |
| congruent — SSS, rotation and reflection too   | 75.44% | 40,300 / 53,420 |
| area within 1%                                 | 95.08% | 50,793 / 53,420 |

Macro (mean of per-settlement rates): exact 44.43%, translate 69.12%, congruent 77.88%.

**The distribution is not uniform — it is concentrated at the SMALL tiers**, monotonically
improving with tier size, which is the opposite of what "a hamlet is legitimately less varied"
would predict for a healthy stage:

| tier | exact | translate | congruent | buildings/settlement |
|---|---:|---:|---:|---:|
| thorp | 55.63% | 64.67% | 72.18% | 10.1 |
| hamlet | 66.67% | 74.96% | 81.23% | 23.0 |
| village | 66.64% | 82.09% | 86.39% | 44.9 |
| town | 49.05% | 80.99% | 84.27% | 110.5 |
| city | 19.74% | 59.04% | 73.31% | 197.0 |
| metropolis | 9.61% | 54.36% | 70.87% | 250.5 |

By role, exact/translate: institution 47.87% / 67.77%, dwelling 0.00% / 57.79% — **the exact
duplicates are institution-to-institution**, which is the first clue to the mechanism. By ward
kind the translate reading runs `other` 80.45%, merchant 72.27%, industrial 65.77%, religious
50.43%; no ward kind is clean.

The old synthetic ground reads worse still: over `V2_GOLDEN_CONFIGS`'s twenty rows, 820 buildings,
**exact 82.93% / translate 85.37% / congruent 87.80%** — the same wrong-population blindness
MF-CG1's header documents, in a second dimension.

**So the corrected figures are 63.30% for the headline reading and 26.42% for the strictest one.**

---

## §2 · THE MECHANISM, AT CODE LEVEL

Two defects in `src/domain/townCartography/cartographyBuildings.js`, plus one property of the
geometry that turns both of them from crowding into *identical coordinates*.

**M1 — the packer took a mod-4 SLOT.** `packFootprint(parcel, index, start)` built the footprint
from `[[v0,m01,m20],[v1,m12,m01],[v2,m20,m12],[m01,m12,m20]][index]` scaled toward its own
centroid. The footprint is a **pure function of (parcel, slot, shrink)**. The flagship path took
`subcell = arrived % 4` off an uncapped per-parcel counter, so the FIFTH institution bound to a
parcel was handed the cell the first one already held.

**M2 — TWO counters over one parcel.** `flagshipsAt` for round-1 institutions and `occupancy` for
instances and dwellings. A flagship never touched `occupancy`, so an instance or a dwelling
started again at slot 0 on top of the flagship that had taken it.

**G1 — the four medial subcells are TRANSLATES of one another.** Proved by execution over 20,000
pseudo-random integer triangles: subcells 0, 1 and 2 are exact translates in **20,000 of 20,000**
and all four are congruent in 20,000 of 20,000 (subcell 3 is the point reflection). So one parcel
at one class shrink has a **one-shape vocabulary**, and with `FOOTPRINT_SHRINK_PERMILLE` carrying
only four class values the whole footprint vocabulary of a settlement was (its parcels) × 4.

**THE EVIDENCE THAT THIS IS THE MECHANISM AND NOT A STORY**, measured over the same 504 rows:

- exact-duplicate groups: **5,932**, of which **5,932 lie entirely inside a SINGLE parcel** and
  **0** span two parcels — so the defect is intra-parcel, which M1 and M2 predict and a
  "congruent parcels" theory does not;
- parcels holding more buildings than the four cells the old theorem afforded: **4,518**, the worst
  holding **29** in a parcel that affords 4;
- group composition: **1,772 flagship-only** (M1, the wrap) + **4,160 flagship-plus-other** (M2,
  the two-counter split) + **0 other-only**. Instances and dwellings alone never collide, because
  they share one honest counter. **The two code defects map one-to-one onto the two group classes.**

Two candidate mechanisms the brief named were tested and DISPROVED. *A small footprint catalogue
sampled without replacement*: there is no catalogue — the footprint is computed, and the counted
parcel shapes are all distinct (60 parcels, 60 distinct shapes at metropolis). *A seeded RNG
stream reused across buildings*: this leaf roots no stream at all; every choice is a `sceneDigest`
of named inputs, and the determinism scan pins that. *A quantisation step*: the integer rounding is
real but it is not the cause — the duplicates are exact at every scale, including parcels hundreds
of plan units across.

### 2a · Why a stacked pair is worse than a repeated one

`cartographyProperty.js` `openGroundOf` returns the parcel ring together with its members'
footprints as HOLES, and states that it performs no polygon algebra because `footprint ⊂ parcel`
is a theorem and the renderer subtracts exactly, under `fill-rule: evenodd`
(`SettlementMapPropertyLine.jsx:27-28`). **Two identical holes cancel under an even-odd fill**, so
the yard beneath a stacked pair renders as solid ground. And a canonical institution drawn exactly
underneath another one does not "appear" in any sense the ONE LAW means.

---

## §3 · THE CURE

### 3a · The slot becomes a recursive medial ADDRESS

The medial subdivision RECURSES. A cell of the tree is inside its parent by construction, so a cell
at any depth is inside the parcel by induction — the containment theorem is unchanged, and the
integer rounding is still re-checked against the parcel by the exact predicate on every vertex and
the anchor, exactly as before.

```
depth d holds 4^d cells and starts at (4^d − 4) / 3
  0..3    the four depth-1 subcells      (the cells the old slots named)
  4..19   the sixteen depth-2 cells
  20..83  the sixty-four depth-3 cells      … to FOOTPRINT_CELL_MAX_DEPTH = 5
```

`cellAt(parcel, index)` walks the base-4 digits of the local index. The descent is a **bounded
`for`**, never a `while`, and an address past the tree returns `null` rather than wrapping —
because wrapping is precisely the defect. Depth 5 addresses 1,364 buildings inside ONE parcel
against a measured corpus worst case of 29. The two integer loops replace a `4 ** step` place
value: TC-2's purity scan bans `**` outright, and it caught the first draft.

### 3b · One cell ledger

`flagshipsAt` is deleted. A flagship draws `occupancy.get(parcelId)` and increments it. **It stays
exempt from the per-parcel BAND and from the total cap** — a canonical institution always appears —
but an exemption from a density band was never a licence to be issued a cell another building
holds. The dwelling fill's `free` term is now clamped at zero, which is load-bearing: occupancy can
legitimately exceed the band on a parcel flagships over-subscribe, and an unclamped term would let
one crowded parcel borrow free slots away from its own siblings.

### 3c · The footprint is DRESSED, exactly as the height and the age already are

A unique cell fixes WHERE a building stands, not what shape it is — G1 says two cells of one parcel
are translates. So the footprint carries a **form**: a size step (±`FOOTPRINT_FORM_SHRINK_STEP` =
45 permille of the class shrink) and an optional **corner truncation**
(`FOOTPRINT_CORNER_CUT_PERMILLE` = 340, giving a trapezoid). Both are read off one `sceneDigest` of
the same `(digest, subject, instance)` triple the height and age nudges already read, under its own
`aspect` key so a form step cannot alias an age step.

- **It is dress, not repair.** No retry, no clipping, no positional jitter, no "try again with a
  smaller box". Every vertex of a truncated cell is a convex combination of the cell's own
  vertices, so containment stays a theorem rather than becoming a check that happens to pass.
- **It adds no second digest LABEL.** TC-2's determinism scan pins ONE `carto:` label per leaf and
  it is right to; the separation is a distinct key in the digest OBJECT. The landed scan is green
  **unedited**.
- **45 permille cannot make prominence a lie.** The tightest gap between adjacent shrink classes is
  120 (`medium` 540 → `small` 420), so a stepped `medium` (495) never crosses a stepped `small`
  (465).

### 3d · THE VARIETY BANDS BY TIER, and here is where the line is drawn

`PLAN_UNIT_CM_BY_TIER` (`compileTownSceneManifest.js:99-108`) sets a thorp's plan unit at 10 cm
against a metropolis's 80. A thorp's buildings are genuinely smaller and genuinely less varied,
because a thorp IS a dozen of the same cottage. So `FOOTPRINT_FORM_VARIANTS` bands
**3 / 3 / 6 / 9 / 12 / 12** (each a multiple of three: the size step is `variant % 3` and the cut
slot is `floor(variant / 3)`, so a non-multiple would starve one size of one cut). A thorp draws
three sizes of one triangle and never a quadrilateral; a metropolis draws twelve forms.

**THE LINE, stated:**

- **EXACT duplication is never correct at any tier. Ceiling ZERO, flat, no headroom.** It is not
  low variety — it is one building standing inside another, invisible to a reader, and it makes the
  yard render as solid ground (§2a). A tier-scaled allowance for it would be an allowance for a
  rendering defect.
- **TRANSLATE duplication IS legitimately tier-scaled**, and its ceiling bands with the vocabulary.
  `hamlet` is the loosest reading in the corpus and that is the band doing what it was asked to:
  three forms over a block of seventeen buildings cannot help repeating a shape.

---

## §4 · THE PIN, AND THE MUTATION THAT CONVICTS IT

The census is recorded **into the corpus** rather than computed in an assertion, so the rate is a
property of 504 settlements rather than of whichever one a reviewer opened, and MF-CG1's existing
W2 live-sample arm re-measures the new fields for free — a frozen measurement that cannot decay
into a frozen fiction.

`measureCalibrationRow` gains `cartoDupExact` and `cartoDupTranslate`, off two exported readings
(`exactFootprintKey`, `translateFootprintKey`) and one exported counter
(`duplicateFootprintRows`) that the suite consumes — ONE definition, so the pin and the recording
cannot drift into measuring two different things.

**W8** then asserts:

1. `cartoDupExact` is **0 on every drawn row of the corpus**, with an anti-vacuity floor of 40,000
   drawn buildings and an exact row-count arm — because `cartoDupExact` reads −1 on a row that
   could not draw, and a corpus that stopped drawing would otherwise satisfy the zero by drawing
   nothing.
2. Each tier's translate rate equals its frozen reading **exactly** (drift in either direction is
   loud, as `maxInstitutions` already is) **and** sits under a ceiling **derived** as
   `ceil(reading × CARTOGRAPHY_HEADROOM_PERMILLE)` — the estate's one owner-signed headroom, the
   same operator the three coupled caps use. No number here was chosen to make a test pass.
3. **A LIVE arm, because arms 1 and 2 read the FROZEN record and a packer regression cannot red a
   frozen number until somebody re-records it.** It re-measures through the real pipeline on the
   six rows carrying each tier's largest canonical roster — not an arbitrary sample:
   over-subscription is what the old wrap turned into stacking, so the argmax rows are where a
   regression appears FIRST. Six generations cost a second or two; the corpus would cost ninety.
   This is the arm the §8 source mutation reds.

**THE CONVICTING CONTROLS.** Three, and each can fail:

- **The instrument control** (in W8): three distinct footprints read zero under both readings; one
  copied footprint convicts THREE rows in a trio, not one; the same shape MOVED is acquitted by the
  exact reading and convicted by the translate reading; the same shape ROTATED to another starting
  vertex is still convicted, which is the property the start-rotation buys and which a naive JSON
  key would miss.
- **The mechanism control** (`townCartographyBuildings.test.js`): N institutions bound to ONE
  parcel emit N DISTINCT footprints for N = 1…12, every vertex still inside the parcel and every
  area positive. **RUN AGAINST THE PRE-CG-2 LEAF AT `79b78881c`, THE SAME CALL EMITTED
  `1→1 2→2 3→3 4→4 5→4 6→4 7→4 8→4 9→4 10→4 11→4 12→4`** — it saturates at the wrap. The assertion
  is false at the parent commit and true here, which is what makes it a control.
- **The source mutation**: the one-line restoration of `% 4` on the flagship's cell index, run
  against the pin. It reds **exactly one arm — W8's LIVE arm — and nothing else**: 55 of 56 tests
  in the two suites still pass. Four of six tiers stack again the moment the wrap returns:

  ```
   FAIL  W8 the drawn corpus does not repeat itself > LIVE: each tier's argmax row re-measures
         at ZERO stacked buildings, and matches its record
  AssertionError: expected [ …(8) ] to deeply equal []
  +   "hamlet hamlet|arabic|desert|road|plagued|cg1-seed-03: 6 of 25 rows stacked LIVE",
  +   "hamlet hamlet|arabic|desert|road|plagued|cg1-seed-03: translate live 11 vs recorded 6",
  +   "thorp thorp|celtic|hills|road|plagued|cg1-seed-03: 4 of 11 rows stacked LIVE",
  +   "thorp thorp|celtic|hills|road|plagued|cg1-seed-03: translate live 6 vs recorded 2",
  +   "town town|celtic|coastal|port|frontier|cg1-seed-06: 6 of 100 rows stacked LIVE",
  +   "town town|celtic|coastal|port|frontier|cg1-seed-06: translate live 6 vs recorded 0",
  +   "village village|celtic|desert|road|safe|cg1-seed-08: 19 of 47 rows stacked LIVE",
  +   "village village|celtic|desert|road|safe|cg1-seed-08: translate live 20 vs recorded 8",
  ```

  ⚠ **AND THE MUTATION TAUGHT SOMETHING THE LANE DID NOT EXPECT, so it is recorded rather than
  smoothed over.** The mechanism control did NOT red under it, and the reason is that the form
  dress is a SECOND, INDEPENDENT barrier: two flagships handed the same cell still draw different
  footprints whenever their form variants differ, because `formOf` reads the anchor key. That is a
  real defence, but a PROBABILISTIC one — roughly a one-in-`variants` chance of collision per pair
  — which is precisely why the address fix is the load-bearing one and why the corpus-wide LIVE
  arm, not the crafted probe, is what convicts. The mechanism control still fails at the PARENT
  commit, where no form dress existed; §8 A5 and A7 state the two facts separately.

---

## §5 · ⚠ THE DECLARED SAME-SEED SHIFT

**Every drawn map moves at every tier.** Stated, not buried, and priced:

| | base `79b78881c` | this member ALONE | ⭐ the STACKED tip (§5c) |
|---|---:|---:|---:|
| exact duplicate rate | 26.42% | **0.00%** | **0.00%** |
| translate duplicate rate | 63.30% | **5.93%** | **5.91%** |
| congruent duplicate rate | 75.44% | 10.96% | — (not re-measured; see §5c) |
| drawn buildings over the corpus | 53,420 | 44,293 | **44,322** |
| lit throw census | 0 of 504 | **0 of 504** | **0 of 504** |
| distinct `institutionRef` per row | — | **identical on 504 of 504** | **identical on 504 of 504** |

Per tier after, translate reading, in permille: **109 / 181 / 72 / 68 / 51 / 48** for this member
alone, and **109 / 181 / 72 / 68 / 50 / 48** at the stacked tip; the ceilings derived from them at
the declared headroom are **175 / 290 / 116 / 109 / 82 / 77** and **175 / 290 / 116 / 109 / 80 / 77**
respectively. **The city column is the ONE figure the stack moves, and §5c prices it.**

- **THE ROW COUNT FELL BY 9,127, AND THE MAP HAD 14,112 STACKED ROWS.** A flagship now consumes a
  cell from the one ledger, so a parcel that flagships over-subscribe no longer offers the same
  cell to a dwelling. The rows that stopped being drawn are rows that were being drawn on top of
  another row. `FROZEN.maxBuildings` moves `13/31/57/152/208/261` → `12/25/47/114/196/261`.
- **THE PER-ROW BYTE FIGURE ROSE, 443 → 450**, and the derivation's input with it. A truncated cell
  is a quadrilateral and a fourth plan point costs a row about seven bytes; every tier moved up by
  four to ten bytes and none moved down, which is the signature a fourth vertex on roughly two rows
  in three should leave. The derived band rises `709 → 720`, which only loosens a ceiling.
- **MF-CG1b IS NOT REGRESSED.** The lit throw census is 0 of 504 at every tier and the recorded
  institution maxima are unchanged at `11/24/41/62/55/63`, which is the evidence the generator did
  not move underneath this re-record.
- **THE ONE LAW HOLDS.** `cartoInstitutionRefs` is identical on 504 of 504 recorded rows: every
  canonical institution still draws its flagship.

### 5a · Goldens

- **`tests/fixtures/town-cartography-dormancy-golden.json` did NOT move** and is green unedited.
  It is a DARK-path projection by construction, so a geometry change inside the lit stage cannot
  reach it.
- **`tests/fixtures/generator-golden-master.json` did NOT move.** The cartography stage is virtual
  and dark by default; the generator's own output is upstream of it.
- **ONE RE-RECORD, DELIBERATE:** `tests/fixtures/cartography-calibration-corpus.json`, through the
  committed `UPDATE_CARTOGRAPHY_CALIBRATION=1` path, with a SHIFT RECORD row added to the suite
  header before commit as that file's own rule requires.

---

## §5b · ⛔ THE VERIFICATION ENVIRONMENT WAS REBUILT MID-LANE, AND EVERY FIGURE HERE POSTDATES IT

The lane opened by symlinking the shared `/Users/cstokes/Desktop/settlement-engine/node_modules`,
as LANE-LAW §1 directs. That directory carries a **36-dependency** manifest against this slot's
**40** — `three`, `pg`, `espree` and `@types/node` are slot-only — and it was rewritten twice while
this lane was mid-run. **Every gate result taken before the rebuild is void and none is quoted
here.** The cure, per the chair: `rm -f node_modules && npm ci --no-audit --no-fund` in this
worktree, whose own `package.json` / `package-lock.json` are the correct pair. Exit 0, 589
packages, all four slot-only modules resolvable, vitest back at the locked **4.1.8** from the
shared tree's drifted 4.1.11.

Two consequences are recorded rather than absorbed:

1. **`npm ci` ran husky's `prepare`, so `.husky/_` now EXISTS in this worktree and `core.hooksPath`
   is repo-level.** LANE-LAW §1's "a lane worktree silently bypasses pre-commit" is **REVERSED
   here**: pre-commit runs `npx lint-staged` = `eslint --fix`, which RE-STAGES. Every green in §8
   is therefore re-earned AT the committed tip, never at the pre-commit working tree.
2. **The base measurement was re-run after the rebuild and reproduced to the digit** — 504/504
   compiled, 53,420 buildings, exact 26.42%, translate 63.30%, every per-tier figure identical —
   in a throwaway worktree at `79b78881c` symlinked at THIS worktree's `node_modules` (the two
   lockfiles hash identically, proved by execution). The measurement is pure domain code and was
   never dependency-sensitive; the TEST RESULTS were.

⚠ **`node scripts/check-observed-shape-readers.mjs` is RED AT THE SLOT BASE, UNEDITED**, with the
byte-identical message it gives at this tip (*"observed-shape detector or unscanned execution input
changed since the schema-10 instrument was governed"*), proved in that same base worktree after the
rebuild. It is a pre-existing base red, not a CG-2 regression, and it is the chair's to place.

---

## §5c · ⭐ THE STACK: WHAT MOVED WHEN THIS MEMBER WAS REBASED ONTO `MF-CH3`

Added by the **TE-STACK-5 landing**, which carries `MF-CH3` and `MF-CG2` through ONE gate. This
member's five commits were rebased `--onto da2c7085c` (the MF-CH3 tip) from `79b78881c`.

**THE REBASE PRESERVED THIS MEMBER'S CONTENT, PROVED BY BLOB SHA rather than by reading a diff.**
All seven files this member owns —`MF-CG2.md` (pre-restamp), `cartographyBuildings.js`,
`cartographyTuning.js`, `townCartographyBuildings.test.js`, `townCartographyCalibration.test.js`
(pre-re-record), `cartographyCalibrationCorpus.js` and the corpus JSON — are **byte-identical**
between `44b83a882` and the rebased tip. Rebase completion was proved explicitly and not from an
exit code alone: no `rebase-merge` / `rebase-apply` under the worktree's own git-dir, an EMPTY
`git status --porcelain`, and a `git grep` for conflict markers that returns nothing.

**TWO CONFLICTS, BOTH RESOLVED SEMANTICALLY RATHER THAN TEXTUALLY.**

1. **`docs/implementation/PACKET_MANIFEST.json`.** `MF-CH3` CANONICALISED the whole file
   (`JSON.stringify(x, null, 2) + "\n"`; `\uXXXX` escapes became literal characters), so the hunk
   merge was meaningless. Resolved by a three-way analysis of the PARSED records: base 175,
   MF-CH3 side 176 (`+MF-CH3`), MF-CG2 side 176 (`+MF-CG2`), **zero pre-existing records altered
   on either side and the base order preserved as a prefix by both**. The resolution is the
   MF-CH3 side with this member's record appended, re-serialised canonically — and then
   **re-derived by execution**: `validate:packets` reads `valid: 177 packets (0 READY)`.
2. **`tests/fixtures/cartography-calibration-corpus.json`.** BOTH cars re-record it, so there is
   no textual merge that means anything: MF-CH3 moves the institution counts and this member
   moves the geometry. It was regenerated at the stacked tip through the committed
   `UPDATE_CARTOGRAPHY_CALIBRATION=1` path — the FOURTH SHIFT RECORD row in the suite header
   states what moved and why. **The stale-corpus state was OBSERVED before the regeneration, not
   assumed:** the suite red at `city …cg1-seed-02: drew 163 live vs recorded 165` and
   `metropolis …cg1-seed-10: translate live 14 vs recorded 13`.

**ONE FIGURE OF THIS MEMBER'S MOVED, AND IT IS DECLARED RATHER THAN RE-RECORDED QUIETLY:**
`DUPLICATES.city.permille` **51 → 50** and its derived ceiling **82 → 80**. `MF-CH3` admits
`Multiple monasteries` and `Monastery or friary` into city and metropolis rosters, so 25 of the
504 rows carry more canonical institutions and the corpus draws **+29** buildings (44,293 →
44,322). The city tier's repetition count barely moves; the denominator grows, and the quotient
rounds down by one permille. The ceiling is the same derivation re-evaluated — `ceil(50 × 1600 /
1000)` — not a number relaxed to pass.

**EVERYTHING ELSE THIS MEMBER CLAIMS WAS RE-CHECKED AT THE STACKED TIP AND HOLDS:** exact
duplication **0 of 44,322** and 0.00% at every tier (the cure is intact under the stack);
`FROZEN.maxBuildings` `12/25/47/114/196/261`; `maxInstitutions` `11/24/41/62/55/63`; the throw
census 0 of 504; worst `cartoRowBytes` 450 so the derived byte band stays 720; the other five
tiers exactly `109/181/72/68/48`; and THE ONE LAW — `cartoInstitutionRefs === institutions` on
**504 of 504** rows, with `cartoInstitutionRefs` differing from the MF-CH3-tip recording on
**ZERO** rows and from this member's own recording on exactly the **25** MF-CH3 admitted.

**AND `MF-CH3`'s DECLARED DIGESTS WERE RE-EXECUTED HERE, NOT ASSUMED.** Its 420-settlement corpus
digest reads `ae67602f44c3a27081aaa7ca0f121a667ac0652abe8c086bc7f2424eca1f65e1` at the stacked tip
— byte-identical to the value `MF-CH3` declares — at ROSTER_CHANGED **30 of 420** and
SETTLEMENT_NAME_CHANGED **0**. The instrument is not a cannot-fail one: run unchanged in a
worktree at the slot `86794b5d2` it reads `MF-CH3`'s declared base
`1cb39d7d9086dd875df32bb37e2d2965774b1d89b65967f47fd3250c1c65d25f`. So this member's geometry
does not reach the generator, which is what §5a's "the generator's own output is upstream of it"
asserted from the other direction.

---

## §6 · EXACT CHANGE MANIFEST

| Action | File | Symbol/region | Maximum delta | Coding instruction |
|---|---|---|---:|---|
| `MODIFY` | `src/domain/townCartography/cartographyBuildings.js` | `medialSubcells`, `cellAt`, `cutCorner`, `packFootprint`, `formOf`, `dressRow`, the flagship branch, the dwelling `free` term | 279 eff (from 229; layer ceiling 800) | the slot becomes an address, the two counters become one, the footprint gains a dressed form |
| `MODIFY` | `src/domain/townCartography/cartographyTuning.js` | `CARTOGRAPHY_CALIBRATION.MAX_BUILDING_ROW_BYTES`, `FOOTPRINT_FORM_VARIANTS`, `FOOTPRINT_FORM_SHRINK_STEP`, `FOOTPRINT_CORNER_CUT_PERMILLE`, `FOOTPRINT_CELL_MAX_DEPTH` | 171 eff (from 165) | four new named bands; the byte calibration moves because the measurement moved |
| `MODIFY` | `tests/fixtures/cartographyCalibrationCorpus.js` | `exactFootprintKey`, `translateFootprintKey`, `duplicateFootprintRows`, `measureCalibrationRow` | 174 eff (from 140) | the corpus records the duplicate census it did not have |
| `MODIFY` | `tests/fixtures/cartography-calibration-corpus.json` | 504-row frozen measurement | n/a | re-recorded ONLY by the committed regeneration path |
| `MODIFY` | `tests/domain/townCartographyCalibration.test.js` | `FROZEN`, `DUPLICATES`, `duplicateCeilingPermille`, the shift record, and the new W8 | 532 eff (from 463) | the census pin and its instrument control |
| `MODIFY` | `tests/domain/townCartographyBuildings.test.js` | one `it` beside the flagship-exemption arm | 628 eff (from 584) | the mechanism control |
| `DOC` | `docs/implementation/packets/town-cartography/MF-CG2.md` | this packet | n/a | — |
| `DOC` | `docs/implementation/INDEX.md` | one row | n/a | — |
| `MODIFY` | `docs/implementation/PACKET_MANIFEST.json` | one packet record | n/a | — |

Generated artifact: `tests/fixtures/cartography-calibration-corpus.json`, by
`UPDATE_CARTOGRAPHY_CALIBRATION=1 npx vitest run --pool=threads --maxWorkers=2 tests/domain/townCartographyCalibration.test.js`.

**No migration is minted. No `package.json` byte moves** (so no mint trigger). **No edge bundle
names any file this member touches. No flag, persisted field, store verb, catalog row or
user-visible copy string moves.**

---

## §7 · CENSUS

> **`censusAuthorization`:** this member moves the test census by
> **`+0 files / +0 parked / +0 credited / +5 titles / +1 suiteTitles`** — no new test FILE; the
> calibration suite gains W8 (one `describe`, four `it`s) and the buildings suite gains one `it`
> beside the flagship-exemption arm. Measured by execution, not counted by eye.

⭐ **RE-DERIVED AT THE NEW BASE BY THE TE-STACK-5 LANDING, and not carried.** The delta above was
measured against `79b78881c`; a delta measured at one base is a hypothesis at another. Re-walked
with ONE lifted classifier driven over three checkouts, the member's own seam reads
`2525/366/2159/21012/5846` → `2525/366/2159/21017/5847` = **`+0 / +0 / +0 / +5 / +1`**, the
declared figure exactly, attributed PER FILE: `townCartographyBuildings.test.js` 23 → **24**
titles at 5 suite titles, and `townCartographyCalibration.test.js` 28 → **32** titles and 8 → **9**
suite titles. ⚠ The calibration suite is **CREDITED, not PARKED**, at both ends — this file's own
docstring records a CONDITIONAL DRAFT that would have parked, and the shipped form does not, so
the four W8 titles are visible to the census and are counted here. The census ROW itself belongs
to the landing act (§417) and is written once at the stacked tree, never by a member.

---

## §8 · ACCEPTANCE

| id | case |
|---|---|
| A1 | **THE EXACT RATE IS THE ACCEPTANCE.** Over MF-CG1's committed 504-row corpus, `cartoDupExact` is 0 on every drawn row — against 14,112 of 53,420 rows at the base, measured through the COMMITTED instrument rather than a scratch probe. Anything other than 0 is a STOP with the measured residue. |
| A2 | **THE CG-1b CONTROL IS UNREGRESSED:** the lit throw census stays 0 of 504 at every tier, the dark census stays 0, and the recorded institution maxima stay `11/24/41/62/55/63`. |
| A3 | **THE ONE LAW HOLDS:** the drawn block's distinct `institutionRef` set is unchanged on 504 of 504 rows against the base recording. A cure that lost an institution would be a worse defect than the one it cured. |
| A4 | **THE TRANSLATE CEILING IS DERIVED, NOT PICKED:** each tier's rate equals its frozen reading exactly and sits under `ceil(reading × CARTOGRAPHY_HEADROOM_PERMILLE)`, with the six evaluated ceilings pinned and a live arm proving the derivation is evaluated rather than transcribed. |
| A5 | **THE MECHANISM CONTROL FAILS AT THE PARENT:** N flagships bound to ONE parcel emit N distinct contained footprints for N = 1…12; the same call at `79b78881c` emits at most 4. |
| A6 | **THE INSTRUMENT CONTROL CANNOT PASS VACUOUSLY:** the census counter is exercised on a clean block (0), a copied footprint (2), a copied trio (3), a MOVED shape (exact 0, translate 2) and a ROTATED shape (exact 0, translate 2). |
| A7 | **THE SOURCE MUTATION CONVICTS, AND CONVICTS PRECISELY:** restoring `% 4` on the flagship's cell index reds **exactly one arm, W8's LIVE arm** — 55 of 56 tests in the two suites still pass — with thorp 4 of 11, hamlet 6 of 25, village 19 of 47 and town 6 of 100 rows stacking again. It does NOT red the mechanism control, because the form dress is an independent probabilistic barrier on a crafted six-institution probe; that is measured and stated rather than assumed away. The restore is proved by digest (`bba1f24c…`) and `git status` is clean against the committed tip. |
| A8 | **CONTAINMENT SURVIVED THE CURE:** `townCartographyBuildings.test.js` C3 — every emitted footprint contained, integer, positive-area, anchor inside — is green with the corner truncation and the depth-2 cells live, over the twenty-row geometry ground it has always used. |

---

## §9 · EXPLICITLY EXCLUDED

- **`CARTOGRAPHY_HEADROOM_PERMILLE`** — owner-signed at ODQ §515; this member REUSES it as the
  ceiling operator and does not re-open its value.
- **`BUILDINGS_PER_PARCEL` and `PARCELS_PER_WARD`** — density dials. The address tree makes the
  "≤ 4 always" comment false as arithmetic, and the comment is corrected, but the VALUES are
  authored taste and belong to the tuning pass. Raising them is the obvious next lever for map
  richness and it is deliberately not pulled here: this is a repair, not a re-tune.
- **`DWELLING_TARGET`, `FOOTPRINT_SHRINK_PERMILLE`, the condition ladder** — authored intent.
- **The SHAPE FAMILY of a footprint.** Every drawn building is still a triangle or a truncated
  triangle similar in kind to its parcel; a true quad/L-shape vocabulary driven by the canonical
  building's own footprint aspect is a design move, not a repair, and it is recorded as
  deliberately deferred rather than smuggled in. See §10.
- Any migration, flag, persisted field, store verb, catalog row, dependency bump, or
  `tests/lint/**` edit. The census row is deferred to the landing act.

---

## §10 · DELIBERATELY DEFERRED — documented, not a bug to re-find

1. **SHAPE MONOTONY BELOW THE TRANSLATE READING.** Under a *similar* reading (shape up to scale)
   the rate stays high, before and after: every footprint is a triangle or a chamfered triangle
   whose angles are its parcel's. This member removes stacking and repetition of *size and shape
   together*; it does not give the estate a building-shape vocabulary. The right cure is to inscribe
   a form derived from the canonical building's OWN footprint aspect — which would also make the
   map truer to the dossier, not merely more various — and it is the estate wave's to take.
2. **THE `other` WARD KIND stays the worst cohort** at 20.10% translate against a 4-7% floor
   elsewhere. It is a fallback label; the honest fix is upstream classification, not geometry.
3. **CITY AND METROPOLIS ARE STILL CAP-BOUND** at 208 and 261 rows (MF-CG1b's own deferral, unmoved
   by this member).
