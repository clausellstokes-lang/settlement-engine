# RECEIPT — the REWRITE train

Seat: Opus 5 — Fable-unvalidated. Lane: REWRITE. Chair session 67af10e4.

---

## CAR 8a — THE KERNEL, THE INSTRUMENTS AND THE GATE

**STATUS: LANDED WHOLE — twelve commits, `f4005cccd` … `5c7eadb18`.** Chartered at SITTING §T.10 (2026-09-09); ARCH §12 row 8a; §N.2 SIGNED;
Part B §20–§23. Dock `$SC/laneREWRITE`, cut at the §917 product tip `29ec62425` (detached HEAD,
porcelain 0 at open, runners 0 at open — both executed, exit 0).

Every figure below comes from a command that ran in this dock with its exit code captured. A figure
without a command is not in this file. ZERO reader-facing bytes is the car's own fence: the manifest
classifier prints `[]` at every commit except where §N.2's RE-INDEXED row is the declared exception.

### Open state (executed at car open)

| fact | command | value |
|---|---|---|
| dock tip | `git log --oneline -1` | `29ec62425` |
| porcelain | `git status --porcelain \| wc -l` | 0 |
| runners | `V=vit; V2=est; pgrep -fl "$V$V2" \| grep -v gate-mutex \| wc -l` | 0 |
| node | `node -v` | v24.12.0 |

### The ten commits

| # | item | sha | status |
|---|---|---|---|
| 8a-1 | the index-stable draw (§N.2) | **`f4005cccd`** | **LANDED** |
| 8a-2 | passage shapes — the licensed fourth draw + the distribution report | **`39c88b02d`** | **LANDED** |
| 8a-3 | the taste's instruments landed by name, without the annex rows | **`83e8acf17`** | **LANDED** |
| 8a-4 | `armThread` + the kinship tiebreak | **`94c41fdb8`** | **LANDED** |
| 8a-5 | the wave's gate `scripts/prose-wave-gate.mjs` | **`e26ad7838`** | **LANDED** |
| 8a-6 | the arm-Q cure + the field-synonym table | **`e2ac44a9c`** | **LANDED** |
| 8a-7 | the face-count ratchet | **`99e8e56e8`** | **LANDED** |
| 8a-8 | T-F12's class list re-cut | **`31faa63aa`** | **LANDED** |
| 8a-9 | the connectives lists to the floors (public-copy drafts) | **`bc441dccc`** | **LANDED** |
| 8a-10 | the register car | **`fa6696860`** + **`12b240397`** (lighting) + **`5c7eadb18`** (voice) | **LANDED** |

---

<!-- CAR 8a body appended below as each commit lands -->
## 8a-1 — THE INDEX-STABLE DRAW (§N.2 SIGNED; ARCH §13 row 22; SHIFT REGISTER `draw-formula`)

### What landed

`drawVariant` in `src/domain/display/stateProse/stateProseKernel.js` moved from
`eligible[avalanche32(fnv1a32(seed::blockId::poolKey)) % eligible.length]` to the ARGMAX of
`avalanche32(fnv1a32(seed::blockId::poolKey::v<vid>))` over the eligible set, ties to the LOWER
vid. The seedless case still reads `eligible[0]` (law 4, unchanged and re-proven). The face draw
at `drawFace` keeps its `::w` key and its modulus, untouched.

**THE FALLBACK, AND WHY IT IS NOT TWO REGIMES.** A pool whose members carry no `vid` keeps the
shipped modulus. That is the causal register (R2) and nothing else: `vid` is the STATE schema's
by ruling (§13 row 14), and R2 carries none on any of its 468 variants. Keying such a pool on a
position inside the already-filtered `eligible` array would be exactly as unstable as the
modulus while looking stable. Two arms hold the line: the shipped state corpus is swept and must
never reach the fallback, and the causal register is swept and must agree with the pre-cure draw
seed for seed.

### ⛔ FINDING — `vid: 0` IS A REAL ID, AND A `> 0` GUARD WOULD HAVE SPLIT THE CORPUS SILENTLY

Written first as `Number.isInteger(vid) && vid > 0`. The kernel sweep convicted it: SEVEN shipped
pools lead with a `canonical` row numbered **0** and number 0..n-1, while the other 701 number
1..n. Under the `> 0` guard those seven read as ID-LESS and would have stayed on the modulus while
the other 701 moved — a silent split of one corpus into two draw regimes, invisible to every
instrument. Cured to `>= 0`; the seven are named in the test so the zero cannot be tidied away:

    DS-ECO-3 :: ADEQUATE · SHORTAGE × trade-dependent · SURPLUS × trade-dependent
    DS-ECO-6 :: TIER: minor shadow activity (≥3) · TIER: significant off-book activity (≥15)
    DS-ECO-7 :: CATALOG · TALLIES

These are exactly the seven `canonical` rows ARCH §16 item 5 names and 8a item 7 must record as
single-faced. Measured, not quoted: `vid` histogram over the six leaves is
`0:7  1:708  2:708  3:675  4:121  5:32  6:15`; pools whose vids are not contiguous from the
pool's first row: 0 of 708.

### EXECUTED ACCEPTANCE

Command: `npx vitest run tests/domain/stateProseKernel.test.js` — **37 passed, 0 failed**.

**(a) UNIFORMITY.** 547 three-variant pools x 10,000 fixed seeds = **5,470,000 reads**.

| grain | figure |
|---|---|
| pooled share by annex slot | **33.312 % · 33.375 % · 33.313 %** (§N.2 reference 33.30 / 33.35 / 33.35) |
| deepest pooled departure from one third | **0.0413 pp** |
| chi-square, df 2 | **4.201** (critical 5.991 @ .05 · 9.210 @ .01 · 13.816 @ .001) |
| deepest PER-POOL deviation, over 1,641 shares | **3.43 SE**, at economy :: DS-ECO-11 :: TERRAIN: Forest |

⛔ **REFUSAL, WITH THE MEASUREMENT — the brief's floor as literally worded is unachievable by any
uniform draw, and so is the obvious repair.** The brief asks for "on every three-variant pool over
10,000 seeds each vid within 2 SE of one third". 547 pools is 1,641 share measurements and the
largest of 1,641 standard-normal deviations is ~3.4 SE BY CONSTRUCTION; measured 3.43. A draw that
passed that floor would be suspiciously FLAT, which is a different defect. The obvious repair —
the same 2 SE floor at the POOLED grain — is also a coin flip: at n = 5,470,000 the 2 SE band is
0.081 pp wide and three shares sit in it, so a uniform draw lands outside about one time in seven.
It did, on the first run: 33.375 % against a band ending at 33.374. WHAT LANDED INSTEAD: the
textbook test the two were reaching for, a chi-square goodness-of-fit at the pooled grain held at
the 0.001 critical value, plus an absolute 0.15 pp tolerance, plus a per-pool 4.5 SE ceiling. A
draw biased toward low ids reads TENS of SE out, so the ceiling refuses the failure that matters.

**(b) APPEND-SAFETY.** 547 three-variant pools x 2,000 seeds = **1,094,000 reads**, both draws
measured in one loop so the contrast is derived and not quoted.

| draw | reads moved | of those, to the NEW wording | between two OLD wordings |
|---|---|---|---|
| **law 6 (argmax)** | 273,643 = **25.01 %** | 273,643 = **100.00 %** | **0** |
| shipped `% length` | 820,444 = **74.99 %** | 273,492 = 33.33 % | **546,952** |

The PROPERTY, not the percentage, is what the arm asserts: not one read moves between two old
wordings. (§N.2's own figures over the whole corpus were 24.17 % against 75.71 %; three-variant
pools are the exact-1/4 case.) The planted variant takes the NEXT annex row per pool (4 on the 540
numbered 1..3, 3 on the seven numbered 0..2), so the plant is a lawful append everywhere.

**(c) A4, repeat-call identity** — the same call twice is the same variant, and 400 seeds prove a
covert sibling in the pool cannot move a player read (the key names no position).
**Law 4 survives law 6** — all three spellings of "no seed" read index 0 and take NO hash, counted
on `Math.imul` with a live control.
**⛔ A FACT NEVER MOVES** — on all 708 state pools x 6 seeds (4,248 draws) the drawn variant is a
member of the same eligible set as before, proven as set membership.

### THE ONE-TIME RE-INDEX — THE OWNER'S VETO SURFACE (§N.2)

    node scripts/prose-manifest-cells.mjs --out <base>     # at 29ec62425      exit 0
    node scripts/prose-manifest-cells.mjs --out <tip>      # at the draw change exit 0
    node scripts/prose-manifest-diff.mjs <base> <tip>                          exit 0

    PROSE MANIFEST DIFF · 73284 cells on the tip side
      REPLACED       cells       0 · towns     0
      RE-INDEXED     cells   43685 · towns   525
      ADDITIVE       cells       0 · towns     0
      WORDING-ONLY   cells       0 · towns     0
      UNCHANGED      cells   29599 · towns   525
      ADDED          cells       0
      REMOVED        cells       0
      (of the UNCHANGED, cells whose audience-filtered INDEX moved with no reader-visible change: 0)

**RE-INDEXED 43,685 of 73,284 = 59.61 %**, over all 525 towns and all 40 blocks reached by DRIFT.
**REPLACED 0 is the car's fence, executed on every cell: not one changed POOL, so no fact moved.**
WORDING-ONLY 0 and ADDITIVE 0 say the same from the other side.

By audience: dm 21,994 of 36,660 = **59.99 %** · player 21,691 of 36,624 = **59.23 %**.

Per block class (share descending, all 40; blocks with zero re-indexed cells: **0 of 40**):

| block | share | block | share | block | share | block | share |
|---|---|---|---|---|---|---|---|
| DS-GEN-5 | 100.00 % | DS-DEF-2 | 61.88 % | DS-DEF-5 | 43.35 % | DS-ECO-2 | 5.71 % |
| DS-STR-1 | 100.00 % | DS-GEN-2 | 58.74 % | DS-ECO-11 | 41.99 % | DS-DEF-9 | 1.71 % |
| DS-DEF-1 | 99.91 % | DS-POW-5 | 50.76 % | DS-GEN-9 | 39.56 % | DS-FTH-2 | 1.71 % |
| DS-REL-2 | 99.71 % | DS-DEF-8 | 50.00 % | DS-SUP-3 | 35.94 % | DS-GEN-17 | 1.14 % |
| DS-ECO-8 | 99.43 % | DS-DEF-11 | 49.14 % | DS-POW-6 | 34.02 % | DS-POW-7 | 1.14 % |
| DS-POW-1 | 99.42 % | DS-ECO-6 | 49.03 % | DS-ECO-9 | 27.40 % | DS-GEN-7 | 0.68 % |
| DS-GEN-14 | 98.86 % | DS-POW-2 | 45.90 % | DS-GEN-6 | 17.43 % | DS-GEN-18 | 0.47 % |
| DS-ECO-1 | 97.33 % | DS-GEN-16 | 96.57 % | DS-ECO-10 | 12.76 % | | |
| DS-DEF-3 | 95.43 % | DS-ECO-12 | 94.57 % | DS-GEN-13 | 87.24 % | | |
| DS-GEN-12 | 84.19 % | DS-DEF-6 | 81.21 % | DS-CND-1 | 77.71 % | DS-POW-4 | 73.52 % |
| DS-GEN-3 | 64.78 % | DS-GEN-11 | 62.86 % | | | | |

The record is COMMITTED as a declared `reIndexed` block on the register's `draw-formula` row and
PRINTED by the contract test, which holds it to its own arithmetic and asserts the fence
(REPLACED / WORDING-ONLY / ADDITIVE / ADDED / REMOVED all 0). It is declared rather than pinned
because nothing recomputes it from the leaves: it takes a DRIFT run at two shas.

    npx vitest run tests/data/dossierStateProseProjection.contract.test.js   68 passed
    [re-index] REWRITE car 8a-1 over DRIFT — 525 configurations x 2 audiences, base 29ec62425
      cells 73284
      RE-INDEXED    43685  59.61 %   <- the one-time cost
      UNCHANGED     29599  40.39 %
      REPLACED          0  <- a FACT would have moved
      WORDING-ONLY      0   ADDITIVE 0   ADDED 0   REMOVED 0

### THE REGISTER ROW MOVED IN THE SAME COMMIT (the register's own idiom)

`draw-formula`'s `source` pin named the old expression verbatim, so it reds the instant the
mechanism moves — the register working exactly as designed. Row rewritten: `mechanism`, `shift`,
`door`, `idiom` and a three-substring `source` pin over the new argmax, the tie rule and the
fallback line, plus the `reIndexed` declared block. 22 insertions, 6 deletions.

### ⛔ THREE INSTRUMENTS THE DRAW CHANGE MOVED, EACH TRACED AND DECLARED

**1. The manifest recorder's `drawAgrees` footprint — a defect I introduced and cured.**
`tests/helpers/dossierManifest.js` re-derives the draw over the AUDIBLE pool to measure the
slot-anchoring filter's footprint, and `poolIndex()` handed it a stripped variant shape carrying
`idx` but not `vid`. The re-derivation therefore took the modulus FALLBACK while the page took the
argmax, and the figure read **47,227 of 73,284**. Cured by carrying `vid` through
`dossierCorpus.js` and `poolIndex()`; the figure is now **3,914**, against **5,966** at base. The
footprint genuinely SHRANK, for a reason the draw makes plain: dropping a slot-unanchored variant
moves an argmax only when that variant was the winner, where a modulus re-rolls on any change of
length at all.

**2. `tests/domain/composeStateProse.test.js` — A KNOWN BLIND SPOT CLOSED.** The arm
"⚠ THE CELL ARM CANNOT TELL `vid` FROM `index` AT THIS TIP" was written with the sentence "the day
a car makes a player face draw past a covert variant it reds here". This is that day. On
`DS-POW-1 :: governanceFractured true` (four variants, the third `dm-only`) the player's draw moved
to the fourth authored variant, which sits at audible index 2 and authored index 3. The pin moves
**0 -> 36**, the cells are named rather than counted, and the per-cell equality arm above it is
sensitive to the coordinate confusion for the first time. 47 passed.

**3. `tests/property/dossierProseManifest.test.js` — the audience-divergence pin 345 -> 309.**
Cause: exactly one draw. `DS-POW-1 :: governanceFractured true` moved off its covert variant onto
a player-visible one, so the two faces now agree there; the remaining 309 are
`DS-ECO-6 :: TIER: minor shadow activity (≥3)`, whose three covert variants leave the player one
eligible line, so its faces differ by construction and no draw rule can change that.

⚠ **FINDING RECORDED IN THE TEST, NOT ONLY HERE: 345, 309 and 36 ARE NOT THAT MANY INDEPENDENT
FACTS.** Every configuration of the DRIFT corpus carries the same `_seed` (`golden-master-v3`) and
the draw key is `seed::blockId::poolKey`, so one pool has ONE drawn variant across all 525 towns
and a per-pool count is a town count wearing a draw's clothes. The control's breadth fell from two
mixed pools to one without anything about the audience filter moving, and ANY future draw change
re-rolls it. Widening it needs the recorder's `--seeds` family rather than DRIFT — a car of its
own, flagged for the skeptic pass.

### THREE PRE-EXISTING PINS ON DRAWN TEXT, RE-SEEDED NOT DELETED

Each named a specific sentence and each is a liveness ANCHOR whose helper says in its own words
"choose an anchor that still travels this path — do not delete the anchor to get green".

| file | arm | act |
|---|---|---|
| `tests/domain/defenseStateProseDesk.test.js` | `{seat}` fills with the generated name | seed `seat-a` -> `seat-c`; only v1 of `capture capture` fills `{seat}` |
| `tests/domain/warFaithStateProseDesk.test.js` | the occupier SLOT-ROLE INVERSION | LOCAL seed `thornwall-b`, not the shared `DM` constant, so no other arm re-draws |
| `tests/domain/warFaithStateProseDesk.test.js` | the creed name reaches the slot | a second desk on seed `thornwall-b`; the original desk keeps its seed because its other assertions read POOL KEYS, which no seed can move |

91 · 28 · 28 passed. Desks otherwise untouched: economy 59, general 69, power 77, stressors 21,
causal 15, dmFieldProjection 14, dossierDepthTabs 25, faithPanelModel 11 — all passed.

### `tests/lint` WHOLE

    npx vitest run tests/lint      147 files passed / 2 failed  ·  2,490 tests passed / 2 (first run)

Both reds were mine and one is cured:

- `seedLoopTotality.walker.test.js` — my two new seed loops asserted INLINE, which is the exact
  lower-bound defect the walker refuses. Converted to `collectSeedFailures` +
  `expectNoSeedFailures`. The helper's exemption is FILE-WIDE, so the file's frozen row
  (ceiling 1, a pre-existing loop) then read 0 and the walker demanded the win be banked: the
  row is DELETED with its reason, shrink-only as the header requires. **9 passed.**
- `sovereigntyLightingContract.walker.test.js` — the lighting census `titles` 24,049 -> 24,050.
  DECLARED RED, carried to 8a-10: the refreeze ritual
  (`LIGHTING_CENSUS_REFREEZE=… LIGHTING_CENSUS_NOTE=… npx vitest run …`) REFUSES a dirty tree by
  design, so it is a register-car act and not a per-commit one. ARCH §12 lists `lighting` as a
  predicted door for this car.

### ⛔ A PRE-EXISTING RED INHERITED FROM §917, NOT THIS CAR'S — REPORTED, NOT CURED

`tests/copy/voiceMechanics.test.js` reds at the dock's base tip `29ec62425`:

    src/domain/display/labelBands.js: baseline em:0 bang:0 → current em:5 bang:0
    src/domain/display/stateProse/generalStateProse.js: baseline em:0 bang:0 → current em:3 bang:0

Established by execution, not inference: `git diff --stat 29ec62425` over both files is EMPTY
(neither is touched by this car), `tests/copy/.voice-mechanics-baseline.json` is unmodified, and
the baseline carries NO ENTRY for either file (55 entries, neither name present) so the comparison
runs against an implicit `{em:0, bang:0}`. The em dashes sit in FILE-HEADER COMMENTS, which
suggests the instrument's `stringLiteralContents` is admitting comment text — an instrument
question, not a voice question. Left for the chair: it is outside 8a's charter and the voice
baseline is a shrink-only surface belonging to whoever owns those files.

### Gates

| gate | command | result |
|---|---|---|
| typecheck | `npx tsc --noEmit -p tsconfig.full.json` | **173 errors, 0 in any file this car touched** (base 173; the one I added — `StateProseVariant` had no `vid` — cured by extending the typedef) |
| eslint | `npx eslint <the ten touched files>` | **exit 0, no output** |
| runners | before every vitest, own shell | **0** every time |


---

## 8a-2 — PASSAGE SHAPES: THE FOURTH SEEDED DRAW, LICENSED AND MEASURED

Chartered at SITTING §T.4 adopting agenda C⁗; the owner's rulings (a)–(e) of 2026-09-08 ~22:4x.
**Nothing ships a second shape.** `composeStateProse.js` is NOT a caller of the new module, the
shipped arrangement stays shape 1, and the manifest classifier prints every class at zero.

### What landed

| file | what |
|---|---|
| `src/domain/prose/passageShapes.js` (new) | the closed set of three, the lawful-set computation with every refusal carrying its reason, the seeded selection, the noun carry, and the render half |
| `scripts/lib/prose-composed-units.mjs` (new) | every composed unit a corpus LICENSES, from `poolMeta.attach` — shared so 8a-5's gate does not re-spell it |
| `scripts/prose-shape-report.mjs` (new) | ruling (c)'s distribution table |
| `tests/lint/prosePassageShapes.walker.test.js` (new) | 11 arms, each refusal convicted by a plant one fact from its lawful control |
| `src/domain/prose/composedWalker.js` | `contentWords` EXPORTED so the estate has one stop list, not two |
| `docs/content/prose-shift-register.json` | the `passage-shape` mechanism, its two source pins and its measured table |
| `scripts/mutation-sweep.sh` + `scripts/mutation-coverage-manifest.json` | the E-A plant and its entry |
| `tests/lint/proseWiringCensus.walker.test.js` | the island roster's fourteenth module |
| `docs/content/wiring-census.json` | the stamp re-taken |

### ⛔ THE CAR'S CENTRAL MEASUREMENT — THE TABLE RULING (c) ASKS FOR CANNOT BE READ ON THE SHIPPED CORPUS

    node scripts/prose-shape-report.mjs                                          exit 0
    attach-bearing pools 0 · composable units 0 · units WITH a shape question 0 · draws 0

Not one pool of the product corpus carries a non-empty `attach` set, so not one composed unit has
a modifier, so not one unit has a shape question. This is not a gap in the script and not a defect:
the SHIFT REGISTER already pins `attach-set` at **0** with the idiom *"EMPTY on every pool at this
tip, BY CONSTRUCTION: every shipped pool is a spine and a spine's attach set is empty. Car 9
authors the first non-empty one."* The composed-prose model is wired and DARK. The script prints
that finding rather than an empty table, and names the four columns it cannot supply with the car
that owes each.

### THE TABLE, DRIVEN ON THE TASTE'S COMMITTED DOCK (laneTASTE f07b98529, read-only history)

    node scripts/prose-shape-report.mjs --corpus <taste-corpus.json>             exit 0
    attach-bearing pools 7 · composable units 408 · units WITH a shape question 408 · draws 26112
    consequence.clause joints exist: NO — shape 3 is WITHHELD

| MARGINAL | draws | share |
|---|---|---|
| spine-then-sentence | 23,907 | **91.56 %** |
| sentence-then-spine | 2,205 | **8.44 %** |
| clause-seat | 0 | 0.00 % |

| CONDITIONAL on the lawful set | n | spine-then-sentence | sentence-then-spine |
|---|---|---|---|
| lawful = {1} | 21,824 | 100.00 % | — |
| lawful = {1, 2} | 4,288 | **48.58 %** | **51.42 %** |

⭐ **THIS IS THE DISCRIMINATION RULING (c) WAS WRITTEN TO MAKE, AND IT ANSWERS CLEANLY: SHAPE 1's
MARGINAL DOMINANCE IS NOT A TIC.** Conditional on both shapes being lawful the draw splits
48.58 / 51.42 %, which is a coin. Shape 1 leads the marginal only because it is the SOLE lawful
shape on 21,824 of 26,112 draws. The binding constraint is the thread rule, not the draw: **341 of
the 408 units refuse shape 2 for want of a noun carried into the spine**, and all 408 refuse shape
3 because the `consequence.clause` list is empty.

Duplicate-unit rate per shape policy, in basis points: **fixed 9,844 · licensed draw 9,818**. The
movement is 26 bp and is reported as small — shape variation is not a lever on repetition at this
sample. Ruling (c) pairs the two columns precisely so a small movement there cannot be sold as a
large one. Relation distribution: `addition` 100 % of 408. Construction via `composedOrderIdOf`:
V1 83.09 %, the empty id 16.91 %.

### The design decisions, recorded vetoably

1. **AN ARGMAX, NOT A MODULUS, for the shape draw** — a departure from the brief's literal key
   `seed::blockId::poolKey::shape`, which is kept as the PARENT and suffixed per shape. The reason
   is not consistency with law 6 but the same defect in a worse form: the lawful set's SIZE varies
   UNIT BY UNIT, so a modulus over it would make one unit's shape depend on how many OTHER shapes
   happened to be lawful for it. Under law 6 that instability was a one-time re-index; here it
   would be permanent. Driven: over 4,000 seeds, not one read moves between two already-lawful
   shapes, and the newcomer takes 40–60 % of them.
2. **The module lives in `src/domain/prose/`, not beside the composer**, and is on the wiring
   census ISLAND roster as its fourteenth module. That fence is what makes "nothing ships a second
   shape at car 8a" a MEASUREMENT: the walker asserts that no file in `src/` outside the island
   names `passageShapes`, so the day `composeStateProse.js` appears in that list, a second shape
   has shipped and the register's `passage-shape` row owes a declared movement.
3. **`contentWords` is exported rather than re-spelled.** A second stop list is two vocabularies
   that drift invisibly, because both halves would agree with themselves. The words this one
   refuses — `town`, `settlement`, `place`, `thing` — are exactly the ones that would make every
   pair of sentences in the dossier look threaded.

### EXECUTED ACCEPTANCE

    npx vitest run tests/lint/prosePassageShapes.walker.test.js        11 passed
    npx vitest run tests/data/dossierStateProseProjection.contract.test.js  68 passed
    npx vitest run tests/lint                    149 files passed / 1 failed · 2,502 passed / 1
    npx tsc --noEmit -p tsconfig.full.json       173 errors, 0 in any file this car touched
    npx eslint <the seven touched files>         exit 0, no output

**THE ZERO-BYTE FENCE**, classifier over 8a-1's tip against 8a-2's:

    REPLACED 0 · RE-INDEXED 0 · ADDITIVE 0 · WORDING-ONLY 0 · UNCHANGED 73284 · ADDED 0 · REMOVED 0

### The estate's own gates, each fired and each cured at cause

Five walkers refused the new module. Every one of them was right and none was silenced.

| walker | what it caught | the cure |
|---|---|---|
| `proseWiringCensus` (e) THE FENCE | a fourteenth src/ file naming an island module | `passageShapes.js` added to the ISLAND roster with its reason; the `composedHits` equality moved from "reached from nowhere" to "reached from exactly one place INSIDE the island", and a NEW equality pins `passageShapes` itself as reached from nowhere — the vacuous-fence shape handed on |
| `proseWiringCensus` census stamp ×2 | the committed census stale | re-taken. `--dry` first: **rows 0 · shas 0 · bytes delta 0 · only `stamp` moves**; the whole diff is `producerIndexFiles` 1154 → 1155, one line for one new src file |
| `domainAnyCastBaseline` ×4 | three `/** @type {any} */` casts | removed at cause by typing `PASSAGE_SHAPES` as `ReadonlyArray<string>`; zero casts remain |
| `negativeAssertionAnchor` | four un-anchored negatives in my walker | each given a one-line `// anchored:` marker naming the paired positive that follows it (the refusal's own `why`, read off the same result) |
| `mutationCoverageManifest` | a new invariant file with no E-A entry | a real PLANT, not a rationale and never `uncovered` |

**THE E-A PLANT, MEASURED BY EXECUTION** (cp backup, cp restore, never the checkout family;
md5 `dae4ad49fd1af7510aa59c14f1bdfd98` before and after):

    perl -0pi -e "s/carries: shared\.length > 0/carries: shared.length >= 0/" src/domain/prose/passageShapes.js

    clean tree   11 passed
    planted      EXACTLY 1 red — "SHAPE 2 NEEDS THE NOUN CARRY" — 10 passed
    restored     cmp-identical, 11 passed

One character. It makes `nounCarry` report a carry on every pair including pairs sharing no word,
so every unit becomes eligible for sentence-first: the shape stops being LICENSED by the
composition and becomes merely AVAILABLE to it, which is ruling (b)'s exact failure. Nothing
downstream would say so — the distribution table would show a healthy-looking rise in shape 2's
conditional share, which is the reading ruling (c) built that column to trust.


---

## CAR 8a — WHERE THIS SESSION STOPPED, AND THE RESUME

**LANDED, each to its full executed acceptance:** 8a-1 `f4005cccd`, 8a-2 `39c88b02d`.
**Dock tip `39c88b02d` · porcelain 0 · runners 0.**

**NOT STARTED: 8a-3 through 8a-10.** They are not partials — no byte of them is in the tree.

### The standing red, declared and owned

`tests/lint/sovereigntyLightingContract.walker.test.js` — the lighting census `titles`
24,049 → 24,050. It is the ONLY red in `tests/lint` (149 files / 2,502 tests pass). It is
carried to 8a-10 by design: the refreeze ritual REFUSES A DIRTY TREE, so it is a register-car
act and cannot be done per commit. ARCH §12 lists `lighting` as a predicted door for this car.

    LIGHTING_CENSUS_REFREEZE='<lane or seat id>' LIGHTING_CENSUS_NOTE='<why it moved>' \
      npx vitest run tests/lint/sovereigntyLightingContract.walker.test.js

⚠ It EXITS NON-ZERO BY DESIGN so a refreeze can never be mistaken for a passing gate; re-run the
walker plainly afterwards and that green is the proof.

⚠ Only +1 title was counted for 8 new `it()` blocks, so the census counts titles in CREDITED files
only and one of the two files this car touched is PARKED. Measure at 8a-10; do not assume +8.

Also standing: `tests/property/dossierProseManifest.test.js` reds in EXACTLY TWO ARMS — the DRIFT
arm and the PROVENANCE arm — and no others. Both are chartered by the brief ("the manifest fixture
is NOT re-recorded by this car; the freeze act is the REWRITE's last car"). The other 12 arms pass.

### ⛔ RECON DONE FOR 8a-3, so the next seat does not re-derive it

Item 3 is ELEVEN cherry-picks landing as ONE commit, so it cannot be part-landed. Two splits are
tangled and the recon below is executed, not guessed.

**M-2 `1af673d07` — THE RISK IS REAL BUT THE SPLIT IS CLEAN, MEASURED.** The instrument half
carries a genuine parser cure to `scripts/generate-dossier-state-prose.mjs`: the pending-bold-label
guard was `pool === null && lastBold !== null`, "which is only true for the FIRST pool of a block:
on the second and every later one a pending bold label was ignored". A parser cure taken WITHOUT
the annex rows could re-project the EXISTING annex and move reader-facing bytes, which 8a forbids
absolutely. **MEASURED against that fear and it does not hold:** across both regenerated leaves in
that commit the only REMOVED lines are the two header comments carrying the variant counts —
1 removed / 171 added in `defense.generated.js`, 1 removed / 29 added in `general.generated.js`.
No existing projected sentence moved. So the cure adds pools and changes none, and the instrument
half should leave `node scripts/generate-dossier-state-prose.mjs --check` green with the annex
untouched. **THAT CHECK IS THE FIRST THING 8a-3 MUST RUN**, before any other pick.

Also in M-2's instrument half: `--taste`, a DOCK-ONLY projector flag whose entire purpose is to
admit the taste's annex rows (an authoring marker, and T-F12's civic-object-class waivers). Landed
without those rows it is a dark flag with nothing to relax. Harmless, but it should land with a
line saying so rather than arriving unexplained.

**M-3 `69eb79415` — TWO FILES IN THE "INSTRUMENT HALF" ARE CANDIDATE PLUMBING, NOT INSTRUMENTS.**
`src/components/new/generalDeskRead.js` (+7) hands `economicGates` to the general desk and
`generalStateProse.js` (+4) widens its reading-bag typedef to receive it. Both exist solely to feed
DS-GEN-3's `purse: short` CANDIDATE FUNCTION, which the brief explicitly refuses ("NOT the seven
candidate functions — they land with their desk sections"). The chair's call: land the pair as dark
plumbing now, or refuse them to 8b with the candidate they serve. The brief's own logic points at
refusing them; recorded here rather than decided by an implementer.

**The mechanics the brief fixes, and one it does not.** Every pick is `git cherry-pick -n` and
re-staged BY FILE. To DROP a refused file the tree must be put back without `git checkout --`,
which the standing hazards call out as work-destroying: use `git show HEAD:<path> > <path>` for a
tracked file and delete an untracked one. Print the files taken and the files refused per pick.

**The acceptance, and it is sharp:** with no annex row landed, `tests/lint` WHOLE reads green at
every commit. The taste's own declared reds in its dock are the corpus-pinning walkers, and they
must NOT appear in the product. Candidates for refusal on that ground:
`tests/lint/proseTasteAnnex.walker.test.js` (a 316-line NEW file in M-2 that tests the annex rows,
which are not landed) and any arm of `proseTasteCandidates.walker.test.js` bound to the seven
candidate functions.

**Sequencing note for 8a-5.** `scripts/taste-measure.mjs` arrives at 8a-3 via M-7 + M-9 + M-9b and
is GENERALISED at 8a-5 into `scripts/prose-wave-gate.mjs`; the brief requires the old script then
become a thin alias or be removed with its walker in the same commit, never a second
implementation. `scripts/lib/prose-composed-units.mjs` already landed at 8a-2 holds the shared
unit builder (`unitsOfPool`, `attachBearingPools`, `unitsOfCorpus`) so the gate does not re-spell
what `taste-measure.mjs:250` spells today.

**Item 2's report is already wired for item 5(e).** `scripts/prose-shape-report.mjs --corpus <f>`
is the `--shapes` surface; the gate reaches it by handing it a corpus.

### The four findings this session produced that outlive it

1. **`vid: 0` is a real stable id.** A `> 0` guard silently splits the corpus into two draw
   regimes. Seven pools lead with a `canonical` row numbered 0.
2. **`attach-set` is 0 across all 708 pools**, so the composed-prose model is wired and DARK and
   NO shape, thread or band question can be asked of the product corpus until a desk section lands
   attach rows at 8b. Every 8a instrument that measures composed units must be driven on a supplied
   corpus, and must say so rather than printing an empty table.
3. **Every DRIFT configuration shares one `_seed`**, so a per-pool count over DRIFT is a town count
   wearing a draw's clothes. Any pin phrased as "N positions" over DRIFT is N towns times ONE coin,
   and any draw change re-rolls it. The audience-divergence control lost half its breadth to that.
4. **`tests/copy/voiceMechanics.test.js` is RED at the §917 product tip** and not from this car.


---

## 8a-3 — THE TASTE'S INSTRUMENTS LANDED BY NAME, WITHOUT THE ANNEX ROWS

**LANDED `83e8acf17`** over `39c88b02d`. Second seat (Opus 5 — Fable-unvalidated), continuing
the lane under the chair's ADDENDUM 1. Eleven cherry-picks, every one `git cherry-pick -n` and
re-staged BY FILE; a refused file dropped with `git show HEAD:<path> > <path>` (tracked) or
`git rm -f` (added by the pick) — `git checkout --` was never run.

### THE FIRST THING RUN, as ADDENDUM 1 required

    node scripts/generate-dossier-state-prose.mjs --check     exit 0   (before any pick)
    node scripts/generate-dossier-state-prose.mjs --check     exit 0   (after all eleven)

⭐ **THE RECON'S FEAR DOES NOT HOLD, EXECUTED.** M-2's parser cure (a pending bold label opens
its pool on EVERY pool of a block, not only the first) and its norm-denominator change
(`census.rows.length` → `census.totals.pools`) move **ZERO projected bytes** with the annex
untouched. `--check` is green on both sides and `node scripts/generate-dossier-state-prose.mjs
--taste` re-wrote the six leaves byte-identically (`git status --porcelain src/data` empty).

### THE FILES TAKEN AND REFUSED, PER CHERRY-PICK

| pick | sha | TAKEN | REFUSED |
|---|---|---|---|
| M-1 | `3844a5d8f` | `scripts/lib/prose-licence-card.mjs`, `scripts/prose-licence-card.mjs`, `tests/lint/proseLicenceCard.walker.test.js` | — (3 of 3) |
| M-2 | `1af673d07` | `scripts/lib/dossier-annex-grammar.mjs`, `src/domain/prose/wiringCensus.js`, `scripts/wiring-census.mjs`, `scripts/generate-dossier-state-prose.mjs`, `tests/lint/proseLicenceCard.walker.test.js`, `tests/lint/proseWiringCensus.walker.test.js`, `scripts/mutation-coverage-manifest.json` (the licence-card entry only) | `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md`, `docs/content/prose-shift-register.json`, `docs/content/wiring-census.json`, `src/data/dossierStateProse/defense.generated.js`, `src/data/dossierStateProse/general.generated.js`, `tests/lint/proseTasteAnnex.walker.test.js` (+ its mutation entry), `tests/lint/proseComposed.walker.test.js`, `tests/lint/proseEntryContradiction.walker.test.js`, `tests/lint/proseMoveGrammar.walker.test.js` |
| M-3 | `69eb79415` | `scripts/prose-rate-corpus.mjs`, `scripts/taste-candidates.mjs`, `src/domain/display/stateProse/legibilityRung.js`, `tests/helpers/dossierManifest.js`, `tests/property/dossierProseManifest.test.js`, `scripts/mutation-coverage-manifest.json` | `src/components/new/generalDeskRead.js`, `src/domain/display/stateProse/generalStateProse.js` (ADDENDUM 1 ruling 4), `defenseStateProseCandidates.js`, `generalStateProseCandidates.js`, `tests/lint/proseTasteCandidates.walker.test.js` (+ its mutation entry) |
| M-4 | `b37df9ec3` | `scripts/prose-rate-corpus.mjs` (the norm bit from the PREDICATE's rate) | `src/data/proseNorms.generated.js`, `docs/content/prose-shift-register.json`, `docs/content/wiring-census.json`, `tests/lint/proseTasteAnnex.walker.test.js` |
| M-5 | `e5f3f6a98` | all 4 | — |
| M-6 | `c4c2468d2` | all 3 | — |
| M-7 | `f86bd505c` | all 3 | — |
| M-8b | `93844e1c3` | `tests/lint/composeStateProseFence.test.js`, `tests/lint/proseWiringCensus.walker.test.js` | `docs/content/wiring-census.json`, `defenseStateProseCandidates.js`, `generalStateProseCandidates.js` |
| M-8d | `2dd07e72a` | both | — |
| M-9 | `4c786100c` | both | — |
| M-9b | `63d0a711e` | both | — |

**23 files taken · 15 distinct files refused.** Conflicts arose on four picks (M-2, M-4, M-8b on
data files; all resolved to HEAD content by restore-and-stage, then `git cherry-pick --quit`).

### ⛔⛔ THE CAR'S OWN FINDING — THE HARNESS CALLED AN ABSENT POOL **PASS**, AND IT IS CURED AT CAUSE

Reproduced by execution before it was cured, on the tree this car creates:

    node -e '… measure({arm:"probe", round:0, base:null, variety:0}) …'
    {"at":"DS-DEF-11 :: country: pressed (walled)","verdict":"PASS","why":"","units":0,
     "inBand":false,"walk":{"FAIL":0,"WITHHELD":0,"PASS":0}}          × all seven pools

`TASTE_POOLS` is a list of NAMES on the licence card; the pools those names point at are ANNEX
ROWS. In a tree with the instruments and without the rows every name resolves to `undefined`,
`variants` falls back to `[]`, `unitsOfPool` answers `[]`, the walk over an empty unit set
returns three zeros, and the verdict line — `verdicts.FAIL > 0 ? 'FAIL' : (WITHHELD > 0 ?
'WITHHELD' : 'PASS')` — **reads PASS with an empty `why`**. The gate would not have passed it
(`inBandOf` puts `band position: no face was measured` in `failing`, so `inBand` is false), but
the WORD a reader sees was PASS and the reason column was blank. TASTE car M-9 built
`withheldPoolRow` to stop exactly this class of lie for an UNWRITTEN set; an **ABSENT** set fell
through the guard.

`absentPoolRow` is that guard's other half, built to the same shape: `verdict:
'NOT-EXECUTABLE'`, the reason spelled out, every measure `null` rather than zero, and one
`failing` row so no arithmetic can round it up to lawful. Two branches feed it — a pool the
corpus does not carry (answered FIRST, before any branch that would read an empty variant list)
and a pool that exists but composes no unit because its attach set is empty.

### THE THREE INSTRUMENTS LANDED WITH ARMS **NOT-EXECUTABLE**, EACH ASSERTING THE CAUSE

The estate's rule is that an arm with an absent input declares NOT-EXECUTABLE and never `[]`.
Each of these asserts a fact that CAN be false, not a fact about an empty collection:

| walker | arms | what it asserts instead |
|---|---|---|
| `proseTasteCorruption` | the paired-town equality, the DM-divergence and the REVEALED arms | `COVERT_CANDIDATE_LANDED === false`, read off `defenseStateProseCandidates.js`'s own source. The equality arm would otherwise have read green forever while proving nothing: two pages that were never going to differ are byte-equal for free |
| `proseTasteMeasure` | 5 (the cartesian count, the tie rate, the whole-measure drive, the half-written rule, the fixture-shape comparison) | `TASTE_POOLS_LANDED === false`, and on the drive: every row `verdict: NOT-EXECUTABLE`, `walk` null, `band` null, exactly one `failing` row |
| `proseWiringCensus` | the modifier-side object-class SET | `modifierRows(committed.rows).length === 0` |

⚠ **THE ONE ARM THIS CAR COULD NOT KEEP ARMED, NAMED:** `proseTasteMeasure`'s "THE FIXTURE IS
THE SHIPPED SHAPE" compares the M-9 fixture's piece rows against a REAL unit from
`unitsOfPool('DS-DEF-11', 'watch: bought (revealed)')`. With no such pool the fixture's shape is
asserted only against itself. Owed to 8b, recorded here rather than papered over.

### THE SPINE/MODIFIER PARTITION IS PROVED ON A PLANT, BECAUSE ZERO CONVICTS NOTHING

`spineRows` could return its argument unfiltered and every integer in
`proseWiringCensus.walker.test.js` would still be green at a modifier population of 0. A new
arm plants four rows (no role · `spine` · `modifier` · `turn`) and asserts the filter drops
exactly the modifier, the complement names exactly it, and the two partition the input. The
shipped corpus is then asserted as the degenerate case of that same partition.

The taste's pins were RE-CUT to the product's state rather than carried: 715 → **708**, the
modifier count 7 → **0**, `ids.size` 715 → **708**, `committed.rows.length` 715 → **708**,
`rate.rows.length` 276 → **271** (twice). Each carries a comment naming what the taste read and
why this tree reads otherwise.

### THE CENSUS RE-TAKEN, BY THE CENSUS RULE (the brief pre-rules it at item 3)

    node scripts/wiring-census.mjs --dry
    [wiring-census --dry] the committed register is STALE; nothing was written
      bytes committed 2053167 · fresh 2053619 · delta 452
      sections that would move: totals · modifiers
      stamped shas that would move: (none) · candidate leaves unmoved
      ROWS that would move: 0

    node scripts/wiring-census.mjs --write   → 708 pools, 165 relation rows, 7 stamped files

The whole committed diff is **6 insertions / 1 deletion**: `totals.modifierRows: 0` and a new
`modifiers` section carrying its ruling and an empty `rows: []`. Zero rows, zero shas.

### ⛔ THE ZERO-BYTE FENCE, EXECUTED ON EVERY CELL

A read-only base dock `$SC/rw8aBASE` was cut at `39c88b02d` (`sh mkdock.sh rw8aBASE 39c88b02d`,
porcelain 0, symlinked node_modules) so the classifier had a base tree to record.

    node scripts/prose-manifest-cells.mjs --out cells-8a2.json    (at 39c88b02d)  exit 0
    node scripts/prose-manifest-cells.mjs --out cells-8a3.json    (at the tip)    exit 0
    node scripts/prose-manifest-diff.mjs cells-8a2.json cells-8a3.json            exit 0

    PROSE MANIFEST DIFF · 73284 cells on the tip side
      REPLACED 0 · RE-INDEXED 0 · ADDITIVE 0 · WORDING-ONLY 0
      UNCHANGED cells 73284 · towns 525 · ADDED 0 · REMOVED 0

Both sides also read `drawAgrees` **3914** and "variant not identified 0 · ambiguous 0", so the
M-3 recorder change (the composed-unit reader) moved no one-piece cell, which is the property
its own comment claims.

### EXECUTED ACCEPTANCE

| gate | command | result |
|---|---|---|
| projector | `node scripts/generate-dossier-state-prose.mjs --check` | exit 0 |
| `--taste` is DARK | `node scripts/generate-dossier-state-prose.mjs --taste` | `--taste was passed and NO refusal needed waiving.` |
| `taste-candidates` | `node scripts/taste-candidates.mjs` | exit 0, 768 towns, all seven pools 0/0/0 — the instrument runs with nothing to measure |
| `tests/lint` WHOLE | `npx vitest run tests/lint` | **153 files passed / 1 failed · 2,546 tests passed / 1 failed** |
| typecheck | `npx tsc --noEmit -p tsconfig.full.json` | **173 errors, 0 in any file this car touched** (base 173) |
| eslint | `npx eslint <the 21 touched js/mjs files>` | **exit 0, no output** |
| runners | own shell, before every vitest | **0**, every time |
| porcelain | after the commit | **0** |

⚠ **A CORRECTION TO THIS COMMIT'S OWN MESSAGE, RECORDED RATHER THAN AMENDED.** The message says
`tests/lint` reads "153 files passed / 1 · 2,559 passed / 1". The FILE count is right; the TEST
count is not — the whole-suite run that produced 2,559 was taken BEFORE the last two cures (the
three negative-anchor conversions in the corruption walker and the tightened measure arm), and
the number was carried forward rather than re-read. The executed figure at `83e8acf17` is
**2,546 passed / 1 failed**, from the run above. Nothing else in the message is affected; the
commit is not amended because amend is forbidden in this lane.

### The one red, DECLARED and unchanged in kind

`tests/lint/sovereigntyLightingContract.walker.test.js` — now the estate's FILE count as well as
its titles (`expected 2562 to be 2557`; this car adds five test files and removes one). Carried
to 8a-10 by ADDENDUM 1 ruling 7: the refreeze ritual refuses a dirty tree.

### The judgment calls, recorded for veto

1. **`proseTasteCandidates.walker.test.js` REFUSED WHOLE, not landed NOT-EXECUTABLE.** ADDENDUM
   1 ruling 5 left this to the lane per arm. Measured: **8 of its 9 arms red** on a tree without
   the seven candidate functions, and the ninth ("both limbs of one roster pass") passes
   vacuously. A walker whose entire subject is absent is a shell, and the estate's own rule is
   that an instrument must have something to measure. It goes to 8b with the functions it walks.
2. **The `LICENSED_LEAF_IMPORTS` table lands EMPTY** rather than carrying the taste's
   DS-DEF-11 row. The arm asserts the licence is exact in BOTH directions, so a permission for
   an import nobody makes reds as loudly as an import nobody licensed — parking the row would
   have disarmed the half that matters. 8b lands the row and the function in one commit or
   neither. The pure-leaf count is DERIVED from the table and pinned as an integer beside it.
3. **The M-2 walker deltas to proseComposed / proseEntryContradiction / proseMoveGrammar were
   refused whole rather than re-cut.** Unlike `proseWiringCensus`, whose delta is a MECHANISM
   (`spineRows`) plus pins, those three are nothing but the annex's own counts (2273 / 715 /
   5247 / 2037) and an `AUTHORING_MARKER` filter over a corpus that carries no marker. Landing
   them would have added three filters that can never fire.
4. **`absentPoolRow` answers BEFORE the marker branch.** A pool that does not exist is not an
   unwritten one, and every branch below reads a variant list that would be empty.

---

## 8a-4 — `armThread` AND THE KINSHIP HEAD (SITTING §T.4 adopting agenda C″)

**LANDED `94c41fdb8`** over `83e8acf17`. Nine files. Zero reader-facing bytes, proven.

### ⛔⛔ THE BRIEF'S LITERAL IMPLEMENTATION IS REFUSED BY THE ARCHITECTURE, WITH THE MEASUREMENT

The brief asks for the kinship tiebreak "in `composeStateProse.js` `compareSalience`
(`:496–501`)". The signal C″ describes is LEXICAL — "the modifier sharing the spine's subject
noun" — and deciding it inside the composer needs the estate's one stop list, which lives in
`src/domain/prose/composedWalker.js`. Three walls, each executed rather than recalled:

| wall | the measurement |
|---|---|
| **ARCH §4.1, verbatim** | "It imports the kernel and the three FROZEN DATA leaves … **an import from generation, the pulse kernel or `src/domain/prose/` reds**" |
| **the estate's own fence** | `tests/lint/composeStateProseFence.test.js` asserts the composer's import list is EXACTLY `['./stateProseKernel.js']` and `CAR_4_LEAF_SPECIFIERS.length === 3`, whose docblock says "a fourth dependency is a chair conversation, not an edit" |
| **the closure cost**, driven on this car's own new instrument | `closureCost(composeStateProse.js, composedWalker.js)` → **+4 files · +150,231 B** onto a host closure of **70,252 B**. It would TRIPLE a first-paint module and pull `entryWalker.js`, `entryLexicons.js` and `moveGrammar.js` onto the render path |

A second stop list inside the composer is the drift 8a-2 refused by name (two vocabularies that
each agree with themselves). A self-calibrating vocabulary derived from the block would be a
mechanism the architecture does not name.

⭐ **WHAT LANDED INSTEAD, AND WHY IT IS THE ARCHITECTURE'S OWN ANSWER RATHER THAN A DODGE.**
ARCH §4.1 rules "the DESK supplies KEYS and typed flags, the CORPUS supplies RELATIONS and
roles, the COMPOSER supplies everything else". So the lexical work happens ONCE, at PROJECTION,
in the same place and the same idiom as the SEAT LICENCE: `kinSpines`
(`scripts/lib/dossier-annex-grammar.mjs`) answers which of a modifier's attach spines it
threads with, and the projector freezes the answer onto `poolMeta.kin`. The composer reads a
frozen array — `kinOf` is an `Array.isArray` and an `includes`, and nothing else.

**EVERY FACE OF EVERY VARIANT, ON BOTH SIDES.** A spine is kin only where every face of every
variant of the modifier shares a content word with every face of every variant of that spine.
The looser reading (any face with any face) was considered and refused: `kin` is read BEFORE the
face draw, so a kinship that held on some faces would make the ORDER of composition a function
of which face the seeded draw took — two towns on one seed seating different modifiers for a
reason no instrument prints.

### THE COMPARATOR'S NEW HEAD IS ONE BIT, NOT TWO

C″ asks for a tiebreak INSIDE a band and a subject shift forced last REGARDLESS of band. With
one signal those are one rule: a candidate that is not kin is exactly one that shifts the
subject, so sorting kin first satisfies the second sentence outright and the first as its
consequence. Two bits would have been a distinction with no signal behind it and a register row
nobody could measure. The order is now **kin ↓ · band ↓ · seeded permutation ↑ · code-unit key ↑**.

⛔ **AN ABSENT LIST READS AS KIN (fail-open), and that is why this car moves nothing.** Only a
MODIFIER has an attach set; every one of the 708 shipped pools is a spine with `attach: []`, so
`kin` is emitted on no pool, every candidate scores 1, and the comparator falls straight through
to the band it used before. An implementation reading a missing list as "not kin" would have
read the whole estate as a subject shift.

### THE PLANTS, EACH EXECUTED

| arm | plant | control |
|---|---|---|
| kinship outranks the band | two pools carrying BOTH other signals (contrast + change) and `kin: []` lose to one carrying neither and `kin: [SPINE]`, over 40 seeds | the SAME corpus with the `kin` lists removed hands the seat back to the band, and the kin pool never seats |
| absent ≠ empty | no pool declares `kin` → the seeded permutation still reaches all three | `kin: []` (a measured NO) loses to `kin: [SPINE]` (a measured YES) |
| `kin` is PER SPINE | `kin: ['spine: some other']` buys nothing at THIS spine | the threading pool seats over 40 seeds |
| `kinSpines` draw-independence | ONE face of the modifier sharing nothing withdraws the kinship | the same pool without that face threads |
| the stop list bites | two sentences sharing only `town` are not kin | add one real noun and the thread appears |
| no vacuous kinship | an empty spine pool, an empty modifier, and an attach naming a pool the block does not carry all answer `[]` | — |
| Thread: carried | a shared noun passes and the carried word is PRINTED | — |
| Thread: turn outward | a last-position turn passes | — |
| Thread: ⛔ mid-passage | a shift that hands nothing back and is not last is `broken`, reason names MID-PASSAGE | the same three positions with the turn moved last read `carried, turn-outward` |
| Thread: ⛔ second turn | the one licence is spent; reason names SECOND turn outward | — |
| Thread: NOT-EXECUTABLE | a one-sentence unit reports no verdict and says how many sentences it found | — |
| ⛔ A11 counts FACTS, Thread counts NOUNS | the deliberate noun echo passes A11 because the two rows carry different facts | the SAME two rows with ONE fact between them fail A11 at once |

⚠ **A MEASURED PROPERTY OF THE RULE, recorded rather than smoothed.** The "second turn outward"
branch is NEVER REACHABLE ALONE: a turn is licensed only in the LAST position, so a first turn
anywhere else is already a mid-passage break. The plant therefore carries BOTH failures, and the
two are told apart by the REASON, which is why the reason is asserted and not only the count.

### ⛔ A RED THIS LANE'S OWN 8a-3 LEFT, FOUND HERE AND CURED

`tests/domain/economyStateProseDesk.test.js:292` pins a rung's provenance with `toEqual`, and
M-3's `pieces` — landed at 8a-3 — legitimately adds a fourth key (ARCH §4.1 in terms:
"`provenance` grows `pieces` INSIDE the object `drawnAtMount` strips on a glance row").
**8a-3's named acceptance was `tests/lint` whole, which does not reach `tests/domain`.** The pin
is re-cut to assert the key SET exactly plus the one spine piece beside it, so it still refuses
a fifth key rather than loosening to a subset match. 59 passed.

### THE REGISTER ROW MOVED IN THE SAME COMMIT

`comparator-and-band-rule`: `mechanism`, `shift`, `idiom` and `note` rewritten; the source pin
gains `if (aKin !== bKin) return bKin - aKin;` and `if (!meta || !Array.isArray(meta.kin)) return 1;`;
a SECOND integer pin holds "pools shipping a non-empty `kin` list" at **0**. The contract test
refused the pin until its recomputation was written — *"comparator-and-band-rule pin 2: nothing
recomputes it — the pin is a promise, not a measurement"* — which is the register working
exactly as designed, and is quoted here because it is the arm convicting this car.

`kin` is a MECHANISM and not a RESERVED key (the composer reads it), so it joins the projection
contract's modifier-only stray-key list beside `relation`, `form` and `move`, held at 0 pools.

### EXECUTED ACCEPTANCE

| gate | result |
|---|---|
| `tests/domain/composeStateProse.test.js` | **50 passed** (47 before) |
| `tests/lint/proseComposed.walker.test.js` | **77 passed** (68 before) |
| `tests/data/dossierStateProseProjection.contract.test.js` | **74 passed** (68 before) |
| `tests/domain/economyStateProseDesk.test.js` | **59 passed** |
| the six desk suites | **345 passed / 0** after the cure |
| `npx vitest run tests/lint` | **153 files passed / 1 failed · 2,554 passed / 1** (the declared lighting red) |
| `node scripts/generate-dossier-state-prose.mjs --check` | exit 0 |
| classifier, 8a-3 tip → 8a-4 tip | **UNCHANGED 73,284 · REPLACED / RE-INDEXED / ADDITIVE / WORDING-ONLY / ADDED / REMOVED all 0** |
| typecheck | 173 errors, **0 in any file this car touched** |
| eslint (8 files) | exit 0 |
| runners / porcelain | 0 / 0 |

### ⛔ A SECOND PRE-EXISTING RED AT THE §917 PRODUCT TIP, ESTABLISHED BY EXECUTION

`tests/property/generatorGoldenMaster.test.js` — "every config produces byte-identical output to
the golden master" fails on **all 525 configs**. Driven at three tips with clean trees:

| tip | tree | result |
|---|---|---|
| `29ec62425` (§917 product tip, `$SC/laneLIGHT`) | porcelain 0 | **RED, 525 configs** |
| `39c88b02d` (8a-2, `$SC/rw8aBASE`) | porcelain 0 | **RED, 525 configs** |
| this car's tip | porcelain 0 | RED, 525 configs |

It is INHERITED and not this lane's, exactly like `tests/copy/voiceMechanics.test.js`. Reported
to the chair; not cured, because it is outside 8a's charter and the golden master is an
owner-facing surface.

⭐ **THE SWEEP THAT FOUND IT, AND WHY IT WAS RUN.** After the economy-desk red the lane ran
`tests/domain tests/property tests/data` whole ONCE, with the load check first (`ps -r` idle) and
runners 0 — a directory sweep the brief does not name, run deliberately because 8a-3's named
acceptance had already been shown not to reach a real red. **1,092 files passed / 2 failed ·
17,494 tests passed / 3 failed.** The three: the two chartered `dossierProseManifest` arms (DRIFT
and PROVENANCE — the manifest fixture is NOT re-recorded by this car) and the inherited golden
master. Nothing else in 17,497 tests moved.

---

## 8a-5 — THE WAVE'S GATE: `scripts/prose-wave-gate.mjs`

**LANDED `e26ad7838`** over `94c41fdb8`. Five files (two of them renames). Zero reader-facing
bytes, proven.

### THE MOVE, AND WHY IT IS A MOVE

    git mv scripts/taste-measure.mjs              scripts/prose-wave-gate.mjs
    git mv tests/lint/proseTasteMeasure.walker.test.js  tests/lint/proseWaveGate.walker.test.js

The brief allows "a thin alias or removed with its walker in the same commit, never a second
implementation". Neither: the file was RENAMED, so there is one implementation and its whole
history follows it. The mutation-coverage entry's key moved with it.

### ⛔⛔ THE LARGEST FINDING — THE GATE HAD NO SUBJECT

`unitsOfPool` composed the CARTESIAN of a modifier pool and its attach set. A SPINE's attach set
is empty on all 708 pools by construction (the SHIFT REGISTER pins `attach-set` at 0), so the
gate composed **nothing** for the very pools the REWRITE rewrites. Car 8a-3 cured the SYMPTOM —
an absent pool reading as `PASS` — but a gate that answers honestly about a population of zero
is still a gate with no subject.

A spine pool now composes ONE UNIT PER FACE, one piece, `role: 'spine'`. Every composed-only arm
(A1's overlap, A2's joint, A3's contrast, Thread) declares NOT-EXECUTABLE on it rather than
inventing a second piece to have something to compare; the ENTRY arms — the claim classes, the
digits, the em dash, the fragment form — are what judge a spine face, and they are what the
REWRITE is graded on. Executed: `unitsOfPool('DS-DEF-11', 'WALLED-STRAINED')` reads **2 units**
(2 variants × 1 face), and both absent cases still answer `[]`.

### ⭐⭐ (a) THE BAND GRAIN — THE OLD PATH REPRODUCES SITTING §T.5's FIGURES TO THE DIGIT

Driven on two faces of very different length against the whole 21-metric band set:

| face | scored | exceeded | share | mean | deepest |
|---|---|---|---|---|---|
| `The wall is kept out of the purse.` (8 words) | 21 | 13 | **0.619** | **0.486** | `wordsPerSentence.neighbourVariation` **1.597 under** |
| the same plus a 17-word tail (25 words) | 21 | 13 | **0.619** | **0.486** | the same, **1.597 under** |

Identical, which is the chair's finding executed rather than recalled. **Thirteen of the
twenty-one are properties of a TEXT** — a share of sentences, a rate per sentence, a variation
BETWEEN neighbours, a repeated opener — and on ONE sentence every one reads 0 and falls under
every exemplar floor, so the budget was met vacuously at 13 ≤ floor(21 × 2/3) = 14.

**THE CURE IS A GRAIN, NOT A THRESHOLD.** `TEXT_LEVEL_METRICS` (13) score the pool's RENDERED
CORPUS; `FACE_LEVEL_METRICS` (8 — colon, em dash, question, exclamation, parenthesis,
participial opener, which-tail, dialogue) score the FACE. The two are disjoint and sum to 21,
asserted. Both grains print.

**THE PLANT, EXECUTED** — the same two faces, each inside a corpus of four sentences:

| grain | short-face corpus | long-face corpus | verdict |
|---|---|---|---|
| CORPUS (13) | exceeded **12/13** · share 0.923 · mean **0.533** | exceeded **11/13** · share 0.846 · mean **0.500** | **THEY DIFFER** |
| FACE (8) | exceeded 0 · mean 0.259 | exceeded 0 · mean 0.259 | the same — and rightly |

The face grain reads alike BECAUSE THE LEXICON AGREES: neither sentence carries any of the
eight. That is asserted with its reason, and a third face carrying an em dash is driven beside
it and MOVES, so "alike" is a reading and never a constant again.

On the real corpus the discrimination is visible in the table: `DS-DEF-11 :: WALLED-STRAINED`
prints `distinct tuples 2 of 2 face(s)` where `WALLED-QUIET` prints `1 of 3` — three faces of
identical length and lexicon, which the old grain could not have told from three of different.

### (b) THE SIBLING DISTANCE, ON THE ESTATE'S OWN RULER

`siblingSpreadOf` reports min / median / max content-token overlap in basis points, the
same-opener and same-segment pair counts, and the NEAREST pair — all through `siblingDistance`,
which already exists. **⛔ IT SEES WHAT A5 CANNOT**, driven: a paraphrase pair whose opener
differs (`The muster roll is short at the wall.` / `At the wall the muster roll runs short.`)
reads `sameOpenerPairs 0` — A5's opener test does not fire — and `overlap ≥ 6000 bp`, which is
the pair for what it is. REPORTED; the floor is set at 8b's fold (SITTING §T.3 row 8).

### (c) THE EXEMPLAR CITATION RATE — MEASURED, WITH ITS DENOMINATOR

    EXEMPLAR CITATION RATE: 0 citation(s) over 786 sentence(s) = 0 bp per unit,
                            on 3 of 10 leaf register(s)
      per leaf: leguin-fiction 0 bp · leguin-nonfiction-spoken 0 bp · leguin-nonfiction-written 0 bp
      no raw prose on this machine for: martin-chronicle, martin-narrative, tolkien-elevated,
                                        tolkien-plain, dnd-flavor, dnd-rules, dnd-rules-srd52
      the control sentence scores > 0, so a zero above is the prose's

⭐ **A FINDING FOR THE SITTING:** the three exemplar registers that can be read carry **ZERO**
provenance clauses by `provenanceCount`'s own definition over 786 sentences. SITTING §T.4 set
the budget at "≤ 1 citation per unit, provisional until this rate is read". It is read: the
exemplars do not cite at all, so a budget of one per unit is not a tight band — it is far above
anything the exemplar prose does. Reported, not ruled.

⛔ The NON-VACUITY CONTROL runs on every call, because a zero from prose that cites nothing and
a zero from a dead detector are the same number and opposite findings.

### (d) THE FIXTURE SECTION — THE INTERESTED FACT BOTH WAYS (agenda C‴)

`DS-GEN-11 :: viable: true: the arithmetic closes` (SITTING §R c-22's own row):

    ── captured (rate-9-2) · treasury · holder Town hall · standing INTERESTED
       1 PLAYER, as compiled     "The town works, and works for the reasons a town of this kind usually works."
       2 DM, INLINE replacement  "The treasury that keeps this is the Town hall, and the Town hall
                                  stands to gain by what it says."      [passages differ: YES]
       3 DM, PEN LINE beside     "The town works, and works for the reasons a town of this kind usually works."
         + pen                   "The treasury that keeps this is the Town hall, and the Town hall
                                  stands to gain by what it says."
       4 the compiled passage is identical on both audiences: YES
    ── clean (rate-3-0) · treasury · holder Weekly market · standing LICENSED
       1..4 as above, and the pen slot is EMPTY: this holder is not interested here
    PAIRED-TOWN ARM over the fixture: HOLDS

⛔ **THE DM SENTENCE IS THE GATE'S OWN ILLUSTRATION AND THE OUTPUT SAYS SO.** No pool carries a
`dm-only` face on this row, so there is nothing to draw; the gate builds one from the HOLDER
CENSUS's three facts (kind, named holder, standing) and labels it. What the sitting is being
shown is the ARRANGEMENT, which is C‴'s question, and the arrangement is real whatever the
sentence is. The CLEAN CONTROL HAS NO PEN LINE AT ALL — which is what makes the pair a pair.

### (e) `--shapes`

Shells out to `scripts/prose-shape-report.mjs` and prints its lines verbatim. It does not
import it, because that script is an ENTRY that prints at import time; a subprocess is the
honest way to say "this is the other instrument's answer".

### THE TWO-PHASE RULE, ENCODED (Part B §21.2)

`keepOrRevert` answers KEEP / REVERT / BANK. ⛔ **"NO NEW FAILURE" IS BY MEASURE NAME, NOT BY
COUNT** — two failures traded one for one hold the count and would pass a count test while the
set moved sideways, which §21.2 refuses in terms. Driven: `{a,b} → {a,c}` is a **REVERT** with
`newFailures ['c']` and `cured ['b']` at an unchanged count of 2. A KEEP names its own limit
(SITTING §T.4: the gate read 0 owned findings on all 13 kept refinements while the blind
refuters failed 26 of 42). The BANKED count is printed and shrink-only.

### ⛔ THE ROSTER — A DESK SECTION IS A LEAF, AND THE FIRST CUT WAS WRONG

Written by hand as a PREFIX list it read general = DS-GEN, DS-HK, DS-CND and warFaith = DS-WAR,
DS-FTH, DS-REL. The projector's own DESKS table
(`scripts/generate-dossier-state-prose.mjs:108`) says general = DS-GEN, DS-REL, DS-POP, DS-HK
and stressors = DS-STR, DS-CND. Two prefixes on the wrong desk and DS-POP on none: **29 of the
708 pools were reachable from no section at all.** Caught by executing the roster, not by
reading it.

Cured by deriving: a leaf IS a section. `sectionsCoverEveryPool()` asserts the partition —
**6 leaves · 708 pools · unreached 0 · counted twice 0** — and the six read
defense 126 · economy 105 · general 193 · power 79 · stressors 67 · warFaith 138.

### THE REFUTERS' GROUNDS AS ARMS (SITTING §T.5), AND THEIR RATE ON THE SHIPPED CORPUS

| arm | channel | plant | control | fires on 2,266 |
|---|---|---|---|---|
| `armTail` | REPORT | `…, at least for now.` | `…, and the purse is thin.` | **0** |
| `armAspect` | REPORT | `will never shut` · `has been paid` | `is shut at dusk` | **177** |
| `armRestatement` | REPORT | two clauses at 10,000 bp overlap | a second clause that adds a fact | **6** |
| `armAmbiguity` | **WITHHELD** | `without cover` | `behind a low wall` | **0** |

⛔ **NONE OF THE FOUR GATES**, asserted on every plant: refuters default to FAIL when uncertain
and the sitting recorded that "the count overstates; the classes are real". An arm cut from an
overstating count and gated on the first day would refuse lawful prose, and a refused lawful
face is a TRIM. The paraphrase ground is (b) above; the costume ground is the grammar walker's
own move ceiling and no second detector is minted; the C7 ground already exists.

⭐ The Aspect arm's 177 is not noise — inspected: `The margin has been narrowing…`, `it has paid
for and must keep paying for`, `The town has never needed to think about what is outside it`.
Real perfect-aspect and forecast constructions in today's prose, which is exactly the authoring
debt the REWRITE inherits. `armRestatement` is asserted NOT to fire on the same pair split
across two SENTENCES, because that is what Thread rewards — the two arms must not read each
other's evidence.

### THE GATE'S USAGE LINE, VERBATIM FROM THE HEADER

     *   node scripts/prose-wave-gate.mjs --arm draft --round 3
     *   node scripts/prose-wave-gate.mjs --arm A --base <cells.json>
     *   node scripts/prose-wave-gate.mjs --arm draft --variety 1     a cheap slice of measure (d)
     *   node scripts/prose-wave-gate.mjs --section defense           a DESK SECTION's spine pools
     *   node scripts/prose-wave-gate.mjs --shapes --corpus <f>       item 2's distribution table
     *
     * READ-ONLY except the JSON it writes at `$PACKETS/measure-<arm>.json`.

### EXECUTED ACCEPTANCE

| gate | result |
|---|---|
| the gate, driven | `node scripts/prose-wave-gate.mjs --pools "DS-DEF-11 :: WALLED-STRAINED,DS-DEF-11 :: WALLED-QUIET" --shapes` — **exit 0**, every section printed |
| `tests/lint/proseWaveGate.walker.test.js` | **41 passed** (20 before) |
| `tests/lint/proseComposed.walker.test.js` | **84 passed** (77 before) |
| `npx vitest run tests/lint` | **153 files passed / 1 failed · 2,582 passed / 1** (the declared lighting red) |
| projector | `--check` exit 0 |
| classifier, 8a-4 → 8a-5 | **UNCHANGED 73,284 · every class 0** |
| typecheck | 173 errors, **0 in any file this car touched** (one introduced and cured: `armRestatement`'s option bag was typed closed) |
| eslint | exit 0 |
| runners / porcelain | 0 / 0 |

### The judgment calls, recorded for veto

1. **RENAMED rather than aliased.** The brief allowed either. A rename keeps one implementation
   and its history; an alias is a second name that outlives the reason for it.
2. **The section roster is DERIVED FROM THE LEAVES, not from a prefix table.** The prefix table
   was written first, was wrong, and the error was silent. A derived roster cannot be wrong
   about which desk owns a block, because the leaf IS the desk.
3. **`bandPositionOf` is KEPT, not deleted.** It is the arithmetic both grains call, and the
   walker drives it on the whole 21-metric set precisely to reproduce the defect. Deleting it
   would have removed the only executable proof that the cure cures something.
4. **The fixture's DM sentence is the gate's illustration, printed with that label.** The
   alternative — authoring a real `dm-only` face — is SURFACES-DM's work and would have put an
   unwritten byte in front of the sitting as though it were the wave's.
5. **Four of the seven refuter grounds land; three do not, each with its reason** (the
   paraphrase is (b); the costume is the grammar walker's; C7 exists).

---

## 8a-6 — THE ARM-Q CURE AND THE FIELD-SYNONYM TABLE (SITTING §H rule 3; M-9 ruling 4)

**LANDED `e2ac44a9c`** over `e26ad7838`. Nine files, one of them new. Zero reader-facing bytes.

### ⛔⛔ THE ARM WAS DEFECTIVE, AND THE CURE IS THE QUESTION IT NEVER ASKED

R-DA-03 licenses a qualifier by a SECOND TYPED FIELD. `armQualify` asked two other questions —
is there a `{slot}`? is there a band word? — and could not ask the real one, because the walker
had no `reads` column to ask it with. Both convicting lines are kept, and both are driven:

| line | BEFORE (no `reads`) | AFTER (`reads` + synonyms) |
|---|---|---|
| `The threat is on the town books as plainly as the grain.` | **WITHHELD Q** | **no Q finding** |
| `Stone keeps itself, and wages do not.` | **WITHHELD Q** | **no Q finding** |
| `Built work stands on its own patience.` (the CONTROL) | WITHHELD Q | **WITHHELD Q** |

The first needed NO synonym — `threat` is the field's own word and the arm simply never looked.
The second needed the ratified row. The control still withholds, and the withhold now names the
fields it consulted (`reads [...]; none claimed`), so a reader can tell a short column from a
short line.

**THE MOVEMENT, MEASURED AND PRINTED** on the shipped corpus with both columns supplied:

    Q · the cure's movement: 890 withheld -> 875 with the reads column and the ratified
        synonyms (15 licensed)

⛔ **THE CURE IS OPT-IN BECAUSE THE DATA FLOW FORCES IT, not because that was safer.** A walker
cannot invent a pool's `reads`; it must be handed them. Every shipped walker brings no census
reader, which is why the entry walker's own 329-pin did not move. The wave gate brings both
columns, so the size of the movement is measured here rather than discovered at 8b.

### THE TABLE — `src/domain/prose/fieldSynonyms.js`, THE ISLAND'S FIFTEENTH MODULE

One ratified FIELD row (`settlement.defenseProfile.economicGates.military` → `wages` · `wage` ·
`pay` · `purse`, cited to SITTING §H rule 3) and twelve HOLDER-KIND rows generated against the
frozen `HOLDER_KINDS`. The two are kept apart on purpose: a `roll` is the record the whole ROW
is kept in, while `wages` names ONE gate, and merging them would let a `books` claim a field the
treasury does not keep. The module THROWS AT LOAD if a kind is added to `HOLDER_KINDS` with no
record noun, because a table silently covering eleven of twelve kinds is an arm quietly blind on
the twelfth.

The census writes `fieldSynonyms` + `fieldSynonymsRuling`. The gate's `censusSynonymTable` has
looked for one under three names since M-9b and now finds it: its report line moves from *"the
wiring census ships NO word-level synonym table"* to *"a word-level synonym table ships and was
applied"*.

### ⛔⛔ TWO DEFECTS THIS CAR PRODUCED AND CAUGHT, RECORDED WHERE THEY HAPPENED

**1. THE INSTRUMENT CONTAMINATED ITS OWN MEASUREMENT.** Written first as an object keyed by kind
— `{ treasury: [...], court: [...], … }` — INSIDE `wiringCensus.js`, the table changed what the
census believes the estate produces: the producer scan reads `src/` for the leaf keys writers
write, saw a property named `court:` in the module it scans, and flipped the `absent` label on
four DS-DEF-2 rows from `not-produced` to `measured`.

    node scripts/wiring-census.mjs --dry     ROWS that would move: 4   ← the object form
    node scripts/wiring-census.mjs --dry     ROWS that would move: 0   ← as a list of rows

No comment could have fixed that; the SHAPE had to stop being a write. The walker carries the
finding so the shape cannot drift back.

**2. IT TOOK `wiringCensus.js` OVER ITS 800 EFFECTIVE-LINE CEILING**, and
`tests/lint/sizeBaseline.test.js` refused it by name — *"decompose it, or add it as a burn-down
entry"*. **Decomposed**, which is the honest half of that choice and the shape ARCH car 0 already
chose once (the branch reader became `wiringBranch.js` rather than a banked row). It is also the
truer home: a ratified table is DATA a sitting signs, and the census is a SCANNER.
⭐ `src/domain/prose/wiringCensus.js` is **byte-identical to its parent commit**.

### THE ONE VOCABULARY, MOVED RATHER THAN COPIED

`claimTokensOf` and `claimsField` moved DOWN into `entryWalker.js` — arm Q needs them and
`composedWalker.js` imports that module, so the dependency could only run one way — and are
RE-EXPORTED from `composedWalker.js`. Every existing caller (the wave gate, the walkers, the
projection contract) is untouched, and there is still exactly one implementation of "does this
text claim this field".

### DS-DEF-2, PRINTED AS THE WIRING ROW IT IS

    arm Q vocabulary REPORT: "between them the town can take a failed harvest or an outbreak…"
      against spine `Disasters & Famine: granary AND hospital`
      reads [disasterRowSituation(granary, hospital, church) (via DISASTER_ROW_POOL …)]
      NOT-EXECUTABLE: the recovered reading is the census's own synthetic table label and not
      a field path, so no text can claim it
      a word-level synonym table ships and was applied

NOT cured by a synonym, exactly as the brief requires: its only recovered reading is car 3h's
synthetic table label.

### THE ISLAND FENCE MOVED FOUR EQUALITIES, EACH A NAMING AND NONE AN IMPORT

| equality | before | after, and why |
|---|---|---|
| the roster | THIRTEEN modules | **FIFTEEN** — `passageShapes` (8a-2) and `fieldSynonyms` (this car) |
| `holderTable` reached from | 3 | **4** — `fieldSynonyms` imports `HOLDER_KINDS` |
| `wiringCensus` named by | 1 | **2** — `fieldSynonyms`'s docblock says why it is not inside it |
| `wiringBranch` named by | 2 | **3** — cited as the PRECEDENT for the decomposition |
| `fieldSynonyms` named by | — | **2** — itself and `entryWalker`'s `ProseEntry` typedef |

Every one is inside the island; the breaches loop proves no product surface reaches it. Its
READERS are all outside `src/` — the census script, the wave gate and the walkers — which is
lawful because the fence is about product surfaces and a script is not one.

### EXECUTED ACCEPTANCE

| gate | result |
|---|---|
| `tests/lint/proseEntryContradiction.walker.test.js` | **29 passed** (27 before) |
| `tests/lint/proseWiringCensus.walker.test.js` | **78 passed** (73 before) |
| `tests/lint/proseWaveGate.walker.test.js` | **41 passed** |
| `npx vitest run tests/lint` | **153 files passed / 1 failed · 2,589 passed / 1** |
| `node scripts/wiring-census.mjs --dry` | ROWS 0 · shas 0 · only the two new sections |
| projector | `--check` exit 0 |
| classifier, 8a-5 → 8a-6 | **UNCHANGED 73,284 · every class 0** |
| typecheck | 173 errors, **0 in any file this car touched** |
| eslint | exit 0 |
| runners / porcelain | 0 / 0 |

---

## 8a-7 — THE FACE-COUNT RATCHET (C′; Part B §22 d)

**LANDED `99e8e56e8`** over `e2ac44a9c`. Two files. Zero reader-facing bytes.

### THE THREE ARMS

| arm | what it holds | today |
|---|---|---|
| the ESTATE-WIDE floor | `sum(faceCounts) >= 2266`, re-pinned to the measured total on the variant ratchet's own rule | **2,266** — every variant carries exactly one face |
| PER POOL, structure | one `faceCounts` entry per variant, every entry an integer ≥ 1 | 0 offenders of 708 |
| PER POOL, floor | no pool below its OWN variant count | 0 offenders |
| the DECLARED floors | the register's new `floors` block, shrink-only | **{}**, asserted empty |
| the ANNEX, append-only | the roster only grows: `>= 708`, no duplicate, no empty key | 708 |

⛔ **THE PER-POOL FLOOR IS THE ARITHMETIC WHILE EVERY FAMILY IS SINGLE-FACED, and saying so is
better than a second list of 708 integers that would all read 1.** A pool's face total is at
least its variant count, and the variant count is itself a ratchet — so the per-pool floor RISES
on its own as families grow. A floor ABOVE that universal one is a DECLARED ROW on the SHIFT
REGISTER, written in the same commit as the growth, on the `reIndexed` idiom car 8a-1 landed.

### ⭐⭐ THE SEVEN, NAMED — AND DERIVED, NOT TRANSCRIBED

They are exactly the pools whose vid list contains **0**, which the arm asserts against the
hand-written roster in both directions:

| block | pool | vids | faceCounts | angle at vid 0 |
|---|---|---|---|---|
| DS-ECO-3 | `ADEQUATE` | 0,1,2,3 | 1,1,1,1 | `canonical` |
| DS-ECO-3 | `SHORTAGE × trade-dependent` | 0,1,2,3 | 1,1,1,1 | `canonical` |
| DS-ECO-3 | `SURPLUS × trade-dependent` | 0,1,2,3 | 1,1,1,1 | `canonical` |
| DS-ECO-6 | `TIER: minor shadow activity (≥3)` | 0,1,2,3 | 1,1,1,1 | `canonical` |
| DS-ECO-6 | `TIER: significant off-book activity (≥15)` | 0,1,2,3 | 1,1,1,1 | `canonical` |
| DS-ECO-7 | `CATALOG` | 0,1,2,3 | 1,1,1,1 | `canonical` |
| DS-ECO-7 | `TALLIES` | 0,1,2,3 | 1,1,1,1 | `canonical` |

Three, two and two — ARCH §16 item 5's own arithmetic, re-measured. Each is asserted to LEAD
its pool, to be SINGLE-FACED, and to carry the angle `canonical`.

⛔ **THEIR SINGLE-FACED STANDING, RECORDED.** Each is a BYTE-COPY of a string the ENGINE already
owns and ships (the ONE-HOME rule the projector enforces). A second face on such a row would be
a second wording of a sentence the engine emits — two homes for one string, the drift class the
projector refuses by name. So "grow toward four" applies to the AUTHORED rows of these pools and
the canonical row at vid 0 keeps ONE face **by refusal** (P-F6), never by neglect. They are the
same seven car 8a-1 found, which is why `vid: 0` is a real id and a `> 0` guard would have split
the corpus into two draw regimes silently.

### EXECUTED ACCEPTANCE

| gate | result |
|---|---|
| `tests/data/dossierStateProseProjection.contract.test.js` | **77 passed** (74 before) |
| `npx vitest run tests/lint` | **153 files passed / 1 failed · 2,589 passed / 1** |
| projector | `--check` exit 0 |
| classifier, 8a-6 → 8a-7 | **UNCHANGED 73,284 · every class 0** |
| eslint | exit 0 |
| runners / porcelain | 0 / 0 |

---

## 8a-8 — T-F12's CLASS LIST RE-CUT (SITTING §T.5; TASTE M.15)

**LANDED `31faa63aa`** over `99e8e56e8`. Three files. Zero reader-facing bytes.

### ⭐⭐ THE FIVE, EACH WITH ITS NEW VERDICT — ALL FIVE LAWFUL, EACH ON A STATED GROUND

| modifier | spine | classes now | verdict |
|---|---|---|---|
| `stores: short` | `Disasters & Famine: granary AND hospital` | `[store]` × `[care, storehouse]` | **LAWFUL** — the spine lists BUILDINGS, the modifier speaks about the STOCK |
| `stores: import-fed` | the same | `[store, market]` × `[care, storehouse]` | **LAWFUL**, same ground |
| `country: pressed (walled)` | `WALLED-STRAINED` | `[]` × `[wall]` | **LAWFUL** — the marker is T-F3's word, and the COUNTRY is not a civic object of the town |
| `country: pressed (unwalled)` | `UNWALLED-LARGE` | `[]` × `[wall]` | **LAWFUL**, same ground |
| `country: pressed (unwalled)` | `UNWALLED-SMALL` | `[]` × `[wall]` | **LAWFUL**, same ground |

### THE TWO CURES

**1. THE POLARITY MARKER, STRIPPED FROM A CLOSED LIST.** T-F3 makes a relation that flips with
the spine's polarity into TWO pools with disjoint attach sets, and naming that pair puts the
SPINE'S polarity in the modifier's key. T-F12 then read `walled` as a civic object the modifier
names. The marker is stripped before classing — from a closed list of eight polarity words and
never "any trailing parenthetical", because a parenthetical can name a real object and a rule
that stripped all of them would blind the guard.
⭐ **MEASURED: ZERO of the 708 shipped keys carries a trailing polarity parenthetical**, because
only a T-F3 SIBLING PAIR needs one and no shipped pool is a modifier. The cure bites exactly
where the defect was and nowhere else.

**2. `storehouse` SPLIT OUT OF `store` AS THE ELEVENTH CLASS.** `granary` named two different
civic objects and one class could not tell them apart.

⭐⭐ **AND THE CONSERVATIVE HALF IS WHAT MAKES THE SPLIT TRUE RATHER THAN CONVENIENT.** A
storehouse named ALONE reads as its stock too, so `GRANARY: thin` classes `[store, storehouse]`
and `stores: short` is STILL refused beside it. More sharply:

    intersects('stores: short', 'Disasters & Famine: NO reserves, hospital present')      true
    intersects('stores: short', 'Disasters & Famine: NO reserves, NO medical provision')  true

The two `NO reserves` spines carry a STOCK word of their own, so they class as `store` and still
refuse the same modifier. **That is ARCH §6.4's own sentence — "only the two `NO reserves` cells
are held" — reproduced BY THE PROXY instead of waived around.** The re-cut licenses the three
BUILDING rows and refuses the two STOCK rows, which is the exact line the architecture draws in
words.

### THE TEN SHIPPED ROWS THAT MOVED, NAMED

| row | before | after |
|---|---|---|
| DS-DEF-2 :: `Disasters & Famine: granary AND hospital` | store, care | **care, storehouse** |
| DS-DEF-2 :: `Disasters & Famine: granary AND parish care only` | store, temple | **storehouse, temple** |
| DS-DEF-2 :: `Disasters & Famine: granary, NO medical provision` | store, care | **care, storehouse** |
| DS-DEF-6 :: `Logistics & Supply: Granary + port` | store, road | **road, storehouse** |
| DS-DEF-6 :: `Logistics & Supply: Granary with road supply` | store, road | **road, storehouse** |
| DS-DEF-6 :: `Logistics & Supply: Granary in isolation` | store | **store, storehouse** |
| DS-ECO-2 :: `GRANARY: well stocked` · `stocked` · `thin` · `nearly empty` | store | **store, storehouse** |

Multi-class rows **12 → 17**, and the seventeen's storehouse members are asserted by name rather
than counted. `--dry` read `ROWS that would move: 10 · stamped shas (none) · sections: rows`, and
the census was re-taken by its own rule (the brief pre-rules the move at item 8).

⭐ **NOT ONE PROJECTED BYTE MOVES**: the class column is read by the projector's ATTACH refusal
and by nothing that renders. The classifier reads UNCHANGED 73,284.

### EXECUTED ACCEPTANCE

| gate | result |
|---|---|
| `tests/lint/proseWiringCensus.walker.test.js` | **78 passed** |
| `npx vitest run tests/lint` | **153 files passed / 1 failed · 2,589 passed / 1** |
| projector | `--check` exit 0 |
| classifier, 8a-7 → 8a-8 | **UNCHANGED 73,284 · every class 0** |
| typecheck | 173 errors | 
| eslint | exit 0 |
| runners / porcelain | 0 / 0 |

---

## 8a-9 — THE CONNECTIVE LISTS TO THEIR FLOORS, AS PUBLIC-COPY DRAFTS (S12; §13 row 27)

**LANDED `bc441dccc`** over `31faa63aa`. Six files. **Zero reader-facing bytes**, and one
generated-leaf growth declared.

### THE FOUR LISTS, DRAFTED

| relation | seat | floor | joints, in order |
|---|---|---|---|
| `consequence` | `clause` | 3 | `, so` · `, and so` · `, leaving` |
| `tension` | `sentence` | 3 | `Against that,` · `Even so,` · `At the same time,` |
| `contrast` | `sentence` | 3 | **EMPTY-OPENER** · `Instead,` · `In its place,` |
| `addition` | `sentence` | 3 | **EMPTY-OPENER** · `Beside that,` · `Also,` |

They are **DRAFTS**: §13 row 27 makes the connectives' copy the owner's, signed at the walk. The
EMPTY OPENER keeps its place at the HEAD of the two lists that assert adjacency itself — S12 in
terms, and the joint the owner's own worked line uses.

### ⛔ A LIST LENGTH IS THE MODULUS OF THE JOINT DRAW — AND IT RE-ROLLED NOTHING

Growing a list is a DECLARED ROW on the SHIFT REGISTER's `connective-list-length` mechanism
(0/0/1/1 → 3/3/3/3, written in this commit). It moved no read, **measured rather than argued**:
no shipped pool declares `role: modifier`, so the composer draws no joint on any town, and
growing a list from one to three re-rolls nothing because nothing was ever rolled. The classifier
printed **UNCHANGED 73,284**.

### ⛔ STILL UNLICENSED IS NOT THE SAME AS UNWRITTEN

None of the engine's 165 relation rows joins two fields a desk reads (car 0's F1), so `seatOf`
answers `not-consequence` on all 708 pools and the composer cannot reach the `consequence` or
`tension` list at all. **What the floors buy is that the day a licence exists the writers are not
also inventing the joinery.** The leaf's own header says so, and the contract asserts the header
says so — the previous header's sentence *"The two OWED lists stand empty…"* had become false and
was cured in the projector rather than left in a generated file.

### THE ARM ASSERTS THE COPY VERBATIM, AND TWO THINGS THE PROJECTOR DID NOT CHECK

The joints are asserted by their exact strings rather than by length, because they are COPY and a
reader of the contract should meet them. Beyond the projector's four refusals (em dash, `which`,
digit, percent — re-asserted on all twelve joints of the leaf itself), the arm adds **the seat's
own shape**:

- a CLAUSE joint carries its comma at the **FRONT** (`arrange` appends it directly to the spine's
  trimmed sentence: `${trimmed}${phrase} ${text}.`);
- a SENTENCE opener carries it at the **END** and opens on a capital (`${spine} ${opener}
  ${downCased}`).

A joint on the wrong side of its comma would compose a sentence nobody intended, and nothing in
the estate said so before.

### THE BYTE ROW, DECLARED

    src/data/dossierConnectives.generated.js   1,365 -> 2,046 raw   (gzip 795 -> 1,138)
    ceiling 2,122 raw / 1,236 gzip — under both
    scripts/.prose-byte-baseline.json: one declared row appended, naming the car, the delta
    and the reason; the chain reaches today's bytes, which is what the ratchet checks

The six PROSE leaves are byte-identical.

### ⛔ A SECOND DECLARED RED, CARRIED TO 8a-10 FOR THE FIRST ONE'S REASON

`tests/lint/observedShapeReaders.walker.test.js` names the connectives leaf as a drifted
execution INPUT. Lawful, and the shrink-only re-freeze absorbs it — but the re-freeze REFUSES A
DIRTY TREE, executed:

    node scripts/check-observed-shape-readers.mjs --write
    Error: observed-shape current sourceTree is not the exact committed HEAD input tree

Exactly the lighting census's shape. It is a register-car act and cannot be done per commit.

### EXECUTED ACCEPTANCE

| gate | result |
|---|---|
| projector | `--check` exit 0; only the connectives leaf moved |
| `tests/data/dossierStateProseProjection.contract.test.js` | **77 passed** |
| `tests/domain/composeStateProse.test.js` | **50 passed** |
| `npx vitest run tests/lint` | **152 files passed / 2 failed · 2,588 passed / 2** (both declared, both 8a-10's) |
| classifier, 8a-8 → 8a-9 | **UNCHANGED 73,284 · every class 0** |
| eslint | exit 0 |
| runners / porcelain | 0 / 0 |

### The judgment call, recorded for veto

**THE COPY ITSELF IS A DRAFT AND THE LANE WROTE IT.** §13 row 27 makes it the owner's, signed at
the walk; the brief asked for drafts at this car. Each joint is cut to the register card's voice —
flat, clerkly, no figure, no forecast, no em dash, no `, which` — and the two lists that assert
adjacency keep the empty opener first. A chair or the owner may replace any of the twelve without
touching a mechanism: the lists are data behind a draw nothing reaches yet.

---

## 8a-10 — THE REGISTER CAR, IN THREE COMMITS

**LANDED `fa6696860` · `12b240397` · `5c7eadb18`** over `bc441dccc`.

⛔ **THREE COMMITS AND NOT ONE, because two rituals refuse a dirty tree.** The estate's own
precedent is the taste's M-8, which was five commits for exactly this reason. Executed proof of
the refusal, not recalled: `node scripts/check-observed-shape-readers.mjs --write` on a dirty tree
answers *"observed-shape current sourceTree is not the exact committed HEAD input tree"*, and the
lighting ritual answers the same way.

### `fa6696860` — THE REGISTER ACTS

| act | result |
|---|---|
| the wiring census | `--dry` reads **CURRENT** — delta 0, sections (none), ROWS 0. It was re-taken in the three cars that moved it (8a-3, 8a-6, 8a-8), each with its printed proof |
| the OSR re-freeze | **1,972 findings / 1,397 identities across 386 files**, absorbing the ONE drifted execution input (8a-9's connectives leaf). Shrink-only. The walker reads **44 passed** after it |
| the SHIFT REGISTER | printed by the contract test, all **fifteen** mechanisms, the train's new pin shapes visible: `passage-shape source+source` · `comparator-and-band-rule source+integer+integer` · `face-count-per-variant` with its `floors` block · `connective-list-length map` at 3/3/3/3 |
| the byte ratchets, DRY | **every one of the nine leaves EXACTLY at its pinned figure, delta 0** — the only leaf the train moved is the connectives leaf, declared at 8a-9 |
| typecheck | `check-full-typecheck.mjs` — OK, **173 errors, ceiling 173** |

### ⛔⛔ A GATE THE EARLIER CARS' ACCEPTANCES DID NOT REACH — `typecheck:domain:strict`

A SECOND typecheck, over `tsconfig.domain-strict.json`, whose rule is **"new/worsened files must
be strict-clean"** and not "stay under the ceiling". It red on three files this train touched:

    src/domain/display/stateProse/stateProseKernel.js: 2 strict errors (baseline 0) — +2   [car 8a-1]
    src/domain/prose/entryWalker.js:                   2 strict errors (baseline 0) — +2   [car 8a-6]
    src/domain/prose/fieldSynonyms.js:                 1 strict errors (baseline 0) — +1   [car 8a-6]

⭐ **NONE WAS FIXED BY WIDENING THE BASELINE; all three are cured at cause, and two of them are
the same mistake.** `stableVid`'s `Number.isInteger(vid) && vid >= 0` is not read as a TYPE GUARD
by strict tsc, so the narrowing is written out as `typeof vid !== 'number'` with the integer half
kept beside it — and `>= 0`, never `> 0`, because vid 0 is a real id on seven shipped pools. The
other two were **JSDoc blocks my own edits had SEPARATED from the declarations they document**: a
comment inserted between a docblock and its arrow function silently un-types both parameters, and
nothing but this gate said so. Both docblocks are back against their declarations.

    [domain-strict] ✓ no strict-type regressions (1120 errors, ceiling 1120).

### `12b240397` — THE LIGHTING CENSUS RE-FREEZE, BY ITS OWN RITUAL

    census REFROZEN at fa66968607aefc95097ba0e2771ea91938be1218:
      files 2557 -> 2562 · parked 375 -> 375 · credited 2182 -> 2187
      titles 24049 -> 24158 · suiteTitles 6422 -> 6451

⚠ **THE +5 FILE COUNT IS A NET**, and the note records it: the train landed nine test files and
removed one — `proseTasteMeasure.walker.test.js` RENAMED to `proseWaveGate.walker.test.js` (8a-5),
`proseTasteCandidates.walker.test.js` REFUSED to 8b (8a-3), five taste walkers landed (8a-3), and
`fieldSynonyms.js` is a src file the census counts its own way.

⭐ **THE 8a-2 RECEIPT'S WARNING HELD AND WAS MEASURED RATHER THAN ASSUMED:** *"only +1 title was
counted for 8 new `it()` blocks … Measure at 8a-10; do not assume +8."* Measured: **+109 titles
over +5 credited files.**

The refreeze run FAILS BY DESIGN so it can never be mistaken for a passing gate; the plain re-run
is the proof — **34 passed**.

### `5c7eadb18` — ⛔ THREE EM DASHES IN `src/` PROSE LITERALS, CAUGHT BY THE ESTATE AND NOT BY THE LANE

"No em dash, exclamation mark or digit in a `src/` prose literal" binds every commit of this
train. `tests/copy/voiceMechanics.test.js` is **not in `tests/lint`**, which is the acceptance the
earlier cars ran, so three literals reached the tree:

| file | car | what |
|---|---|---|
| `src/domain/prose/passageShapes.js:201` | 8a-2 (the first seat) | a `why` string |
| `src/domain/prose/composedWalker.js` | 8a-5 | `armAmbiguity`'s description |
| `src/domain/prose/fieldSynonyms.js:51` | 8a-6 | a ratified row's `at` citation |

Each cured by punctuation and not by rewording — a semicolon, a full stop and a colon carry what
the dash carried. The four walkers that read these strings pass unchanged (**214 tests**).

⚠ The two §917-INHERITED files are LEFT per ADDENDUM 1 ruling 7: `labelBands.js` (em 5) and
`generalStateProse.js` (em 3) are red at the dock's BASE tip with a clean tree, their em dashes
sit in FILE-HEADER COMMENTS, and the baseline carries no entry for either — an instrument question
about `stringLiteralContents`, not a voice question, and outside 8a's charter.

### ⭐⭐ THE NAMED ACCEPTANCE, MET

    npx vitest run tests/lint     154 files passed / 0 failed  ·  2,590 passed / 0 failed

Both declared reds are paid: the lighting census carried from 8a-1, and the observed-shape input
carried from 8a-9.

### ⛔ THE ZERO-BYTE FENCE OVER THE WHOLE TRAIN

    node scripts/prose-manifest-diff.mjs cells-8a2.json cells-8a10.json     (39c88b02d → the tip)
      REPLACED 0 · RE-INDEXED 0 · ADDITIVE 0 · WORDING-ONLY 0
      UNCHANGED cells 73284 · towns 525 · ADDED 0 · REMOVED 0
      (of the UNCHANGED, cells whose audience-filtered INDEX moved: 0)

**Not one of the 73,284 cells moved across eight commits.** The car's own fence, executed end to
end rather than per commit only.

### THE FINAL SWEEP

    npx vitest run tests/domain tests/property tests/data
      1,092 files passed / 2 failed  ·  17,497 passed / 3 failed

The three are the two CHARTERED `dossierProseManifest` arms (the manifest fixture is NOT
re-recorded by this car — the freeze act is the REWRITE's last car) and the §917-INHERITED
`generatorGoldenMaster`. Nothing else in 17,500 tests moved.

---

## CAR 8a — THE CLOSE (second seat: Opus 5 — Fable-unvalidated, continuing under ADDENDUM 1)

**LANDED WHOLE.** Dock `$SC/laneREWRITE`, tip **`5c7eadb18`**, porcelain **0**, runners **0**.

| # | item | sha |
|---|---|---|
| 8a-1 | the index-stable draw | `f4005cccd` *(first seat)* |
| 8a-2 | passage shapes, the licensed fourth draw | `39c88b02d` *(first seat)* |
| 8a-3 | the taste's instruments, without the annex rows | **`83e8acf17`** |
| 8a-4 | `armThread` + the kinship head | **`94c41fdb8`** |
| 8a-5 | the wave's gate `scripts/prose-wave-gate.mjs` | **`e26ad7838`** |
| 8a-6 | the arm-Q cure + the field-synonym table | **`e2ac44a9c`** |
| 8a-7 | the face-count ratchet | **`99e8e56e8`** |
| 8a-8 | T-F12's class list re-cut | **`31faa63aa`** |
| 8a-9 | the connectives lists to their floors | **`bc441dccc`** |
| 8a-10 | the register car | **`fa6696860`** |
| 8a-10-lighting | the lighting census, by its ritual | **`12b240397`** |
| 8a-10-voice | three em dashes cured | **`5c7eadb18`** |

### THE REFUSALS, EACH WITH ITS MEASUREMENT

1. **`tests/lint/proseTasteAnnex.walker.test.js` — REFUSED** (chair's ADDENDUM 1 ruling 5): it
   tests annex rows this car does not land.
2. **`tests/lint/proseTasteCandidates.walker.test.js` — REFUSED WHOLE** to 8b. Measured: **8 of
   its 9 arms red** without the seven candidate functions; the ninth passes vacuously.
3. **The M-2 walker deltas to `proseComposed` / `proseEntryContradiction` / `proseMoveGrammar` —
   REFUSED WHOLE**: unlike `proseWiringCensus`, whose delta is a MECHANISM plus pins, those three
   are nothing but the annex's counts (2273 / 715 / 5247 / 2037) and an `AUTHORING_MARKER` filter
   over a corpus that carries no marker.
4. **M-3's two candidate-plumbing files — REFUSED** to 8b (ADDENDUM 1 ruling 4).
5. **The composer may not read a lexicon — REFUSED, with the measurement.** ARCH §4.1: *"an import
   from generation, the pulse kernel or `src/domain/prose/` reds"*; the fence holds the import
   roster at three and calls a fourth *"a chair conversation, not an edit"*; and `closureCost`
   prices it at **+4 files / +150,231 B onto a 70,252 B closure**. The kinship signal is
   PROJECTED instead.
6. **The exemplar citation rate is executable on 3 of 10 leaf registers** — the other seven have
   no raw prose on this machine and are NAMED.
7. **`proseTasteMeasure`'s "THE FIXTURE IS THE SHIPPED SHAPE" arm could not be kept armed** — it
   needs a real unit to compare the M-9 fixture against; owed to 8b, named rather than papered.
8. **Three of the seven refuter grounds did not become new arms**, each with its reason: the
   paraphrase is item 5(b)'s distance; the costume ground is the grammar walker's own move
   ceiling; C7 already exists.

### THE FINDINGS THIS SEAT PRODUCED THAT OUTLIVE IT

1. **The wave gate had NO SUBJECT.** `unitsOfPool` composed only the cartesian of a modifier's
   attach set, and a SPINE's attach set is empty on all 708 — so the gate composed nothing for the
   very pools the REWRITE rewrites. Cured at 8a-5.
2. **The harness called an ABSENT pool `PASS` with an empty reason.** Car M-9 guarded an UNWRITTEN
   set; an absent one fell through. `absentPoolRow` is that guard's other half (8a-3).
3. **An instrument can contaminate its own measurement by being added to the file it reads.** The
   synonym table as an object keyed by kind made the census's producer scan read `court:` as a
   leaf key the estate writes, and flipped four DS-DEF-2 rows' `absent` labels. Shape, not comment,
   was the cure (8a-6).
4. **A hand-written prefix table drifted from the projector's own DESKS on its first day**, leaving
   29 of 708 pools reachable from no section. A leaf IS a section (8a-5).
5. **A comment inserted between a JSDoc block and its arrow function silently un-types both
   parameters**, and only `typecheck:domain:strict` says so (8a-10).
6. **`Number.isInteger(x) && x >= 0` is not a TYPE GUARD to strict tsc** — the narrowing has to be
   written as `typeof x !== 'number'` (8a-10).
7. **`tests/lint` does not reach `tests/domain`, `tests/copy` or the two typecheck ratchets.** Three
   real reds this train produced were invisible to its own named acceptance: an economy-desk
   provenance pin (8a-3, cured at 8a-4), three em-dash literals (8a-2/5/6, cured at 8a-10-voice)
   and three strict errors (8a-1/6, cured at 8a-10).
8. **`tests/property/generatorGoldenMaster.test.js` is RED at the §917 product tip** on all 525
   configs, with a clean tree, at `29ec62425` and at `39c88b02d` alike. INHERITED, reported to the
   chair, not this lane's.

### WHAT THE CHAIR OWES A DECISION ON

- **The exemplar citation rate is 0 over 786 sentences** on the three readable leaf registers, with
  a live detector. SITTING §T.4's provisional budget of ≤ 1 citation per unit is therefore far
  above anything the exemplar prose does. A sitting row, not a lane's.
- **The pen line vs the inline rendering** is now composed both ways on both fixture towns (8a-5).
  SITTING §T.4 said the adoption stays provisional "until the owner has seen it"; it is printable.
- **The twelve connective joints are the lane's DRAFT** (8a-9). §13 row 27 makes the copy the
  owner's, signed at the walk.
- **ARCH §2.3 gains `kin`** — a modifier-only `poolMeta` field the composer reads. Recorded on the
  SHIFT REGISTER in the same commit; the ARCHITECTURE document is the chair's to amend.


---

## CAR 8a-11 — THE CURES

**STATUS: LANDED WHOLE — nine commits, `f81b95c28` … `b005886ef`.** Chartered at SITTING §U (2026-09-09 08:1x) over
`skeptic-rewrite/FOLD.md` (CONFIRMED 48 · REFUTED 1 · PARTLY 2 · UNTESTED 3 · NEW 14); the
charter is brief ADDENDUM 3. Seat: Opus 5 — Fable-unvalidated (a fresh seat, the third of the
car). Dock `$SC/laneREWRITE` continuing at the 8a tip `5c7eadb18`.

Every figure below comes from a command that ran in this dock with its exit code captured.
⛔ THIS SECTION CORRECTS THE CAR 8a SECTION ABOVE AND DELETES NOTHING FROM IT: the corrected
sentences are struck in place under "CORRECTED AT THE FOLD" and the original wording is kept
beside the correction, because a receipt whose errors are erased cannot be audited.

### Open state (executed at car open)

| fact | command | value |
|---|---|---|
| dock tip | `git rev-parse HEAD` | `5c7eadb18105f19dce6ac04b4e2782d5bad68355` |
| porcelain | `git status --porcelain \| wc -l` | 0 |
| runners | `V=vit; V2=est; pgrep -fl "$V$V2" \| grep -v gate-mutex \| wc -l` | 0 |
| node | `node -v` | v24.12.0 |

### The commits

| # | cure | sha | status |
|---|---|---|---|
| 8a-11-1 | a-1 (§U c-4) the `>= 0` guard's green instrument | **`f81b95c28`** | **LANDED** |
| 8a-11-2 | a-2 (§U c-1) the gate's packet target, namespaced and refusing | **`2f68fdd95`** | **LANDED** |
| 8a-11-3 | a-3 (§U c-2) ONE `unitsOfPool` | **`1f7c8565d`** | **LANDED** |
| 8a-11-4 | a-4 (§U c-5) one home for the connective lists | **`872497837`** | **LANDED** |
| 8a-11-5 | a-5 (§U c-3) the false seed sentence, struck in the estate | **`73e0dd704`** | **LANDED** |
| 8a-11-6 | a-6 + a-8 two stale sentences in the two scripts | **`320ce227a`** | **LANDED** |
| 8a-11-7 | a-7 the rename's provenance record | **`b448d3498`** | **LANDED** |
| 8a-11-8 | a-9 (§U c-6) the RE-INDEXED veto surface gains machine standing | **`da350688e`** | **LANDED** |
| 8a-11-9-lighting | the rituals — ONE owed, two measured and refused | **`b005886ef`** | **LANDED** |

---

### 8a-11-1 — CURE a-1 (§U c-4): THE `>= 0` GUARD GETS A GREEN INSTRUMENT

**LANDED `f81b95c28`** over `5c7eadb18`. Two files. Zero reader-facing bytes.

`stableVid` is EXPORTED from `src/domain/display/stateProse/stateProseKernel.js` (no product
caller; the composer's import fence is untouched) and `tests/domain/stateProseKernel.test.js`
gains one arm that CALLS it rather than re-deriving its predicate over the leaves.

⛔ **THE DEFECT THE FOLD FOUND, RESTATED FROM ITS OWN MEASUREMENT.** The existing sweep
("⭐ THE SHIPPED STATE CORPUS NEVER REACHES THE MODULUS FALLBACK") spells
`!Number.isInteger(row.vid) || row.vid < 0` a SECOND time over the six leaves. It pins the
CORPUS's ids and is blind to the KERNEL, so the exact defect car 8a-1 was written to stop —
`vid <= 0` — passed both named acceptances while seven pools reverted to the modulus.

### THE ARM, AND WHY IT IS PER SEED RATHER THAN PER COUNT

| half | what it asserts | figure |
|---|---|---|
| the predicate | `stableVid({vid: 0})` is `0`; `{vid: 1}` is 1; `{vid: 6}` is 6 | — |
| the other side | nine non-ids read `null` (`undefined` · `null` · `-1` · `1.5` · `NaN` · `Infinity` · `'0'` · `'2'` · `true`), and so do `null` and `undefined` variants | 0 admitted |
| the DRAW | `drawVariant` on a synthetic four-row pool numbered 0..3, over 400 seeds | **299 of 400** disagree with the modulus · vid 0 takes **104** |
| the contrast | the modulus takes vid 0 on **110** of the same 400 | — |
| the shipped seven | read off the live leaves: 7 zero-led pools, none of which the kernel reads as id-less | 7 · 0 |

⭐ **THE COUNTS LOOK ALIKE AND THE PER-SEED ANSWERS DO NOT** (104 against 110), which is why
the arm compares the two draws SEED BY SEED. A count test would have passed under the plant.

### THE PLANT, EXECUTED

    cp src/domain/display/stateProse/stateProseKernel.js <backup>
    perl -pi -e 's/\|\| vid < 0\) return null;/|| vid <= 0) return null;/' <the kernel>
    md5 ab2e56e2c5fa7da53a4c4cb8021aeedd   (planted)

    clean tree   npx vitest run tests/domain/stateProseKernel.test.js   38 passed
    planted      1 failed | 37 passed
                 ⛔ vid 0 is a REAL id: a `> 0` guard splits the corpus: expected null to be +0
    restored     (from the pre-plant copy, never `git checkout --`)      38 passed

### EXECUTED ACCEPTANCE

| gate | result |
|---|---|
| `tests/domain/stateProseKernel.test.js` | **38 passed** (37 before) |
| `tests/lint/composeStateProseFence.test.js` + the projection contract | **86 passed** |
| eslint (2 files) | exit 0 |
| `node scripts/check-domain-strict.mjs` | **1,120 errors, ceiling 1,120** — exit 0 |
| `node scripts/check-full-typecheck.mjs` | **173 errors, ceiling 173** — exit 0 |
| `node scripts/check-observed-shape-readers.mjs` | **1,972 findings, exactly the frozen inventory** — exit 0 |
| `node scripts/wiring-census.mjs --dry` | CURRENT · delta 0 · sections (none) · ROWS 0 |
| `tests/lint/sovereigntyLightingContract.walker.test.js` | **34 passed** — the kernel's test file is PARKED, so no title moved and no ritual is owed by this commit |
| projector `--check` | exit 0 |
| runners / porcelain | 0 / 0 |

---

### 8a-11-2 — CURE a-2 (§U c-1): THE GATE'S PACKET IS NAMESPACED BY DOCK AND REFUSES A FOREIGN RUN

**LANDED `2f68fdd95`** over `f81b95c28`. Two files. Zero reader-facing bytes.
⛔ **This is the cure that BLOCKS 8b**, which runs arms A and B concurrently by design.

### WHAT LANDED

`packetDirFor` · `packetTargetFor` · `packetRefusal`, all three exported so the walker drives
them without writing a byte. `PACKETS` is now documented as what it always was — the writers'
SHARED, READ-ONLY packet root, listed by `roundsOf` and written by nothing.

| flag | what it names |
|---|---|
| (default) | `<scratch>/packets/<dock>/measure-<arm>.json` |
| `$PACKETS` | the DIRECTORY |
| `--out` | the whole PATH (8b passes it per arm as belt and braces, §U c-1) |

⛔ **THE JUDGMENT CALL, RECORDED FOR VETO — the default is NOT `<dock>/.packets/`.** ADDENDUM 3
offered that shape "or as the header decides". An untracked directory inside the worktree reads
as `?? .packets/` in `git status --porcelain`, and porcelain 0 between commits is the law every
gate run in this program is held to — so that shape would have broken, on every dock, the check
the cure exists to protect. The namespace sits BESIDE the docks and the dock's own directory
name is the namespace. `.gitignore` is untouched.

### THE REFUSAL, EXECUTED END TO END IN THIS DOCK

| run | result |
|---|---|
| `--arm cure8a11 --round 2 --pools "…WALLED-STRAINED,…WALLED-QUIET"` | **wrote** `…/packets/laneREWRITE/measure-cure8a11.json`, **17,248 B**, exit 0 |
| `--arm cure8a11 --round 0 --pools "…WALLED-STRAINED"` | ⛔ **REFUSED, exit 1** — *"the packet at this path is a LATER measurement — it carries arm "cure8a11" round 2 written at 2026-09-09T12:13:40, and this run is arm "cure8a11" round 0. Pass --out to name your own path."* · the file was still **17,248 B** afterwards |
| `--arm other --round 9 --out <that same path>` | ⛔ **REFUSED** — *"belongs to another run — it carries arm "cure8a11" round 2 …"* |
| `--arm cure8a11 --round 3` | **wrote**, exit 0 — the workflow's own next round is never refused |
| `git status --porcelain` after all four | the dock is untouched by the write |

⭐ The first of those is EXACTLY the incident: a bare `--round 0` probe against a live round-4
draft packet, which is how laneTASTE's measurement was destroyed. It now exits 1.

### THE WALKER'S TWO NEW ARMS

1. **namespaced by dock** — two arms in one tree are two paths sharing one directory; two DOCKS
   are two directories (`/tmp/scratch/laneONE` → `/tmp/scratch/packets/laneONE`); the target is
   never `PACKETS` and never inside the dock; `--out` and `$PACKETS` each override their half.
   `process.env.PACKETS` is deleted and restored inside the arm so the environment cannot
   decide the answer.
2. **a foreign packet is refused** — both refusal shapes convicted by their message, plus four
   CONTROLS so the refusal is not merely total: a re-run of the same round, the next round, no
   file at all, and a file with no header all return `null`.

### EXECUTED ACCEPTANCE

| gate | result |
|---|---|
| `tests/lint/proseWaveGate.walker.test.js` | **43 passed** (41 before) |
| `tests/data/dossierStateProseProjection.contract.test.js` | **77 passed** |
| `tests/lint/mutationCoverageManifest.test.js` | green |
| eslint (2 files) | exit 0 |
| `check-full-typecheck` / `check-domain-strict` | **173/173** · **1,120/1,120** |
| runners / porcelain | 0 / 0 |

⛔ **DECLARED RED, carried to this car's ritual commit** (the same shape car 8a used): the
lighting census reads **titles 24,158 → 24,160** for the two new `it()` blocks, and the refreeze
ritual REFUSES A DIRTY TREE. ⚠ Measured on the way: `tests/domain/` is PARKED and `tests/lint/`
is CREDITED — 8a-11-1's new arm moved no title and these two moved +2.
⛔ **INHERITED RED, unchanged**: `tests/copy/voiceMechanics.test.js`, `labelBands.js` em 5 and
`generalStateProse.js` em 3, identical at the §917 tip.

---

### 8a-11-3 — CURE a-3 (§U c-2): ONE `unitsOfPool`

**LANDED `1f7c8565d`** over `2f68fdd95`. Three files, **+119 / −93**. Zero reader-facing bytes.

The bare-spine branch moved WHOLE out of `scripts/prose-wave-gate.mjs` into
`scripts/lib/prose-composed-units.mjs` behind `bareSpine`; the gate's `unitsOfPool` is now four
lines that call it, and `facesOf` moved with it for the same reason one function smaller. The
gate lost 106 lines and the lib gained 62.

⛔ **THE LIB'S DOCBLOCK NAMED A CONSUMER IT DID NOT HAVE, FOR A WHOLE CAR.** It asserted "the
wave's gate at 8a-5" from the day it was written; the only importer was
`scripts/prose-shape-report.mjs:32`. It now names its consumers by grep, and the cross-check arm
is what keeps the sentence true.

### THE CROSS-CHECK ARM

Drives BOTH exports over `poolRosterOf({section: 'defense'})` — 126 rows — and asserts equal
counts and equal text pool by pool.

| assertion | figure |
|---|---|
| pools compared | **126** |
| units compared (the non-vacuity floor: two builders agreeing about nothing is not agreement) | **383** |
| pools the two read differently | **0** |
| the FLAG is a flag: `libUnitsOfPool(…, 'WALLED-STRAINED')` with no flag | `[]` — a spine licenses no composed unit, which is the shape report's subject |
| the same call with `{ bareSpine: true }` | **2** |

⭐ The corpus the arm hands the lib is `Object.assign({}, ...Object.values(SECTION_LEAVES))` —
built from the gate's OWN section table, because a hand-written list here would be the second
roster car 8a-5 already caught drifting once.

### THE PLANT, EXECUTED

    perl -pi -e "s/…poolKey, \{ bareSpine: true \}\);/…poolKey);/" scripts/prose-wave-gate.mjs

    clean tree   44 passed
    planted      2 failed | 42 passed
                 ⭐⭐ ONE UNIT BUILDER: the gate and the lib agree on EVERY pool of a section
                 "a pool the two builders read differently: expected [ …(5) ] to deeply equal []"
                 (and the spine-pool arm beside it: "expected +0 to be 2")
    restored     (inverse copy) 44 passed

### EXECUTED ACCEPTANCE

| gate | result |
|---|---|
| `proseWaveGate.walker` · `prosePassageShapes.walker` · `proseComposed.walker` · the projection contract | **216 passed** over four files (44 · 11 · 84 · 77) |
| `node scripts/prose-shape-report.mjs` | exit 0 — the product finding unchanged: attach-bearing pools 0 · units 0 · draws 0 |
| `tests/lint/sizeBaseline.test.js` + `tests/lint/mutationCoverageManifest.test.js` | green |
| eslint (3 files) | exit 0 |
| `check-full-typecheck` / `check-domain-strict` | **173/173** · **1,120/1,120** |
| `wiring-census --dry` | CURRENT · delta 0 · ROWS 0 |
| `check-observed-shape-readers` | **1,972**, exactly the frozen inventory |
| projector `--check` | exit 0 |
| runners / porcelain | 0 / 0 |

---

### 8a-11-4 — CURE a-4 (§U c-5): ONE HOME FOR THE CONNECTIVE LISTS

**LANDED `872497837`** over `1f7c8565d`. Six files, **+208 / −59**. Zero reader-facing bytes.

`CONNECTIVES` in `composeStateProse.js` is now `DOSSIER_CONNECTIVES`, BY IDENTITY. The import is
the FIRST of the three names ARCH §4.1 licensed and `CAR_4_LEAF_SPECIFIERS` has held since car
3a, so the fence widened by a licensed name and by nothing else.

### THE CLOSURE COST, MEASURED BEFORE IT LANDED

    node --input-type=module -e "closureCost(composeStateProse.js, dossierConnectives.generated.js)"
      hostFiles 2 · hostBytes 74,847        (without the edge)
      withFiles 3 · withBytes 76,893        (with it)
      the edge: +1 file · +2,046 B          the leaf imports nothing itself

Against the **+4 files / +150,231 B onto a 70,252 B closure** a `src/domain/prose/` lexicon was
priced at and REFUSED at car 8a-4. (The host figure moved 70,252 → 74,847 because the kernel and
the composer have both grown across this train; the comparison is the edge, not the host.)

### ⛔ ZERO READER-FACING BYTES, EXECUTED ON EVERY CELL

    node scripts/prose-manifest-cells.mjs --out cells-5c7eadb18.json   (in $SC/skepRW3 @ 5c7eadb18,
                                                                       porcelain 0 before and after)
    node scripts/prose-manifest-cells.mjs --out cells-8a11-4.json      (this tree)
    node scripts/prose-manifest-diff.mjs  <base> <tip>                 exit 0

    PROSE MANIFEST DIFF · 73284 cells on the tip side
      REPLACED 0 · RE-INDEXED 0 · ADDITIVE 0 · WORDING-ONLY 0
      UNCHANGED cells 73284 · towns 525 · ADDED 0 · REMOVED 0 · index-only 0

### ⚠ A BEHAVIOUR SHIFT ON SYNTHETIC FIXTURES, DECLARED RATHER THAN LEFT TO RIDE

The composer's `addition.sentence` list moved from ONE opener to THREE, so four fixture arms in
`tests/domain/composeStateProse.test.js` now compose an opener in front of the seated modifier.
Nothing shipped moves (0 of 708 pools are modifiers), but the arms did:

| arm | before | after |
|---|---|---|
| a pool partitioned by an UNANSWERED dimension | `The walls stand. A major wave.` | `The walls stand. Also, a major wave.` |
| DROPS a candidate whose slot has no fill | `The walls stand. The road is open.` | `The walls stand. Also, the road is open.` |
| NO CLAUSE CAN SEAT ON THE SHIPPED CORPUS | `The walls stand. the muster is thin` | `The walls stand. Beside that, the muster is thin` |
| COHERENCE IS NOT THE DRAW'S | `The walls stand. The walls stand.` | `The walls stand. Beside that, the walls stand.` |

Each carries the reason beside it: the opener is the leaf's, the list LENGTH is the SHIFT
REGISTER's `connective-list-length` mechanism, and the twelve joints are the owner's copy signed
at the walk (§13 row 27) — so a copy act moves these four lines with it, deliberately.

⛔ **TWO ARMS HAD THEIR PREMISE MOVED AND ARE RE-CUT AT CAUSE**, not re-pinned:

- *"A LICENSED CLAUSE IS STILL WITHHELD while `consequence.clause` stands empty"* — the shipped
  list is no longer empty. The withheld path is now driven on an **INJECTED empty list**; the
  shipped list is asserted at `[', so', ', and so', ', leaving']`; and a third limb drives the
  SHIPPED leaf and asserts the composed text is one of the leaf's own three arrangements.
- *"a relation whose list is EMPTY cannot seat"* — same shape for `tension.sentence`, and the
  arm now names the fact that actually stops a tension modifier seating on any town (no pool
  declares one), which lives in the projection contract.

### THE SENTENCES THAT WERE FALSE, NOW TRUE

| file | before | after |
|---|---|---|
| `src/domain/prose/passageShapes.js` | `WITHHELD: the connectives leaf carries no consequence.clause joint at all … (8a item 9 drafts the list to its floor of three)` | `WITHHELD: the composer's connective lists carry no consequence.clause joint at all, so no world can seat one` — and on the shipped tree the refusal printed is the ordinary `no modifier is seated at the clause seat` |
| `scripts/prose-shape-report.mjs` | `consequence.clause joints exist: NO — shape 3 is WITHHELD` | `consequence.clause joints exist: yes, 3 of them — shape 3 waits on a CLAUSE SEAT, not on a joint` |

⭐ **THE SITTING'S TABLE IS OTHERWISE UNMOVED**, driven on the taste corpus at this tip:

    attach-bearing pools 7 · units 408 · units WITH a shape question 408 · draws 26112
    MARGINAL     spine-then-sentence 23907 91.56 % · sentence-then-spine 2205 8.44 % · clause-seat 0
    CONDITIONAL  lawful={1} n 21824 100.00 %  ·  lawful={1,2} n 4288  48.58 % / 51.42 %
    DUPLICATE-UNIT RATE  fixed 9844 bp · licensed draw 9818 bp
    RELATION addition 408 100.00 %   ·   CONSTRUCTION V1 339 83.09 %
    REFUSALS  408 clause-seat :: no modifier is seated at the clause seat   <- the corrected one
              341 sentence-then-spine :: the added face carries no noun into the spine

Every figure is the fold's, to the digit; only the 408 refusals' ground changed, and it changed
from false to true.

### THE ARM §U c-5 ASKS FOR

`⭐⭐ ONE HOME: the composer's connective lists ARE the leaf, not a copy of it` — **identity**
(`toBe`), never deep equality, because two objects that match today are two homes that will
disagree tomorrow. It pins the four floors 3/3/3/3 beside it (the `connective-list-length`
register row, UNMOVED by this cure) and re-asserts the licensed specifier.

### ⚠ A FOLD PREDICTION MEASURED FALSE, RECORDED

FOLD §4 item 3 predicted that re-wording the WITHHELD `why` would MOVE the `passage-shape`
register row and that the register act had to land in the same commit. **It does not.** That
row's two source pins are the closed-set line and `export const SHIPPED_SHAPE = …`, both
untouched, and the contract test re-reads both from disk and passes. No register act is owed by
this commit. (§4 item 4's prediction about `comparator-and-band-rule` is answered at 8a-11-6.)

### ⛔ ONE STRICT ERROR, CURED AT CAUSE

`check-domain-strict` red once: the projector emits every generated leaf under one generic
annotation (`Readonly<Record<string, object>>`), which does not satisfy the composer's nested
type. Cured with a TYPED narrowing cast carrying its reason — never an `any` (the estate holds
those at zero, and `domainAnyCastBaseline` is green) and never by widening the baseline.

### EXECUTED ACCEPTANCE

| gate | result |
|---|---|
| `composeStateProse.test.js` · `prosePassageShapes.walker` · `composeStateProseFence` · the projection contract · `domainAnyCastBaseline` | **167 passed** over five files |
| `proseWiringCensus.walker` · `proseComposed.walker` · `observedShapeReaders.walker` | **224 passed** with the voice file's inherited red beside them |
| classifier, 5c7eadb18 → this tree | **UNCHANGED 73,284 · every class 0** |
| eslint (6 files) | exit 0 |
| `check-full-typecheck` / `check-domain-strict` | **173/173** · **1,120/1,120** |
| `wiring-census --dry` | CURRENT · ROWS 0 |
| `check-observed-shape-readers` | **1,972** |
| projector `--check` | exit 0 |
| runners / porcelain | 0 / 0 |

---

### 8a-11-5 — CURE a-5 (§U c-3): THE FALSE SEED SENTENCE, STRUCK IN THE ESTATE

**LANDED `73e0dd704`** over `872497837`. One file. Zero reader-facing bytes.

`tests/property/dossierProseManifest.test.js` carried the fold's R-1 sentence as an INHERITED
COMMENT, introduced with *"recorded here so the next reader inherits the finding instead of
re-deriving it"* — which is what made the error load-bearing.

| the DRIFT corpus's seeds, MEASURED | cells | towns |
|---|---|---|
| `golden-master-v3` | **72,108** | **516** |
| `gm-seed-a` | 394 | 3 |
| `gm-seed-b` | 390 | 3 |
| `gm-seed-c` | 392 | 3 |

Deliberate, not drift: `tests/helpers/goldenMasterCorpus.js:116-121` appends the base
configuration under three further seeds so seed sensitivity is locked by the golden master too.

**THE SUBSTANCE SURVIVES AND IS KEPT** — 516 of 525 do share one seed, so a per-pool count over
them is still a town count wearing a draw's clothes, and the 345 → 309 / 36 explanation is
untouched. What goes is the universal quantifier and the remedy sentence. **ADDENDUM 1 ruling 8's
routing of a DRIFT widening to a CAPACITY-train car is WITHDRAWN** (§U c-3); nothing is owed there.

### THE CURE IS AN ARM, NOT A BETTER SENTENCE

`⭐⭐ THE DRIFT CORPUS CARRIES FOUR SEEDS` derives the tally **twice** — from the run's own 73,284
cells (by the seed in each cell's town key) and from `goldenCorpus()`'s configurations — and
closes both halves against `run.cells.length` and `run.towns`, so a corpus that moves reds here
instead of leaving a stale paragraph behind.

| gate | result |
|---|---|
| `tests/property/dossierProseManifest.test.js` | **13 passed | 2 failed** — the two are EXACTLY the CHARTERED arms (the DRIFT arm at its declared 1,050 rows; the PROVENANCE arm), and the passing count rose **12 → 13** |
| `tests/lint/seedLoopTotality.walker.test.js` | green — the tally builds its maps first and asserts once |
| eslint | exit 0 |
| runners / porcelain | 0 / 0 |

---

### 8a-11-6 — CURES a-6 AND a-8: TWO STALE SENTENCES IN THE TWO SCRIPTS THE WAVE READS FIRST

**LANDED `320ce227a`** over `73e0dd704`. Two files, **+1 / −7**. Zero reader-facing bytes.

**a-6** — `scripts/prose-shape-report.mjs`'s OWED list still asserted *"the band position is a
CONSTANT at the face grain (SITTING §T.5), so a band column printed here would be the same tuple
on every row"*. Car 8a-5 refuted that by execution in the next commit of the same car. Re-worded
to the two grains, naming the gate as the instrument that carries them and the corpus this table
is not handed as the reason it cannot. The sitting reads this line through `--shapes`.

**a-8** — `scripts/prose-wave-gate.mjs` carried the identical "WHAT IT IS…" paragraph TWICE, at
lines 12-16 and 18-22. One copy now.

⚠ **A SECOND FOLD PREDICTION MEASURED FALSE** (FOLD §4 item 4): re-wording
`prose-shape-report.mjs:205` does NOT move the `comparator-and-band-rule` register row. That
row's source pin is over `composeStateProse.js` and names no script; the contract test re-reads
every `kind: 'source'` pin from disk and is green. **Neither of the two register acts the fold
predicted for this car is owed.**

| gate | result |
|---|---|
| `proseWaveGate.walker` · `prosePassageShapes.walker` · the projection contract | **132 passed** over three files |
| `node scripts/prose-shape-report.mjs` | exit 0, the corrected OWED line printed |
| eslint | exit 0 |
| runners / porcelain | 0 / 0 |

---

### 8a-11-7 — CURE a-7: THE RENAME'S PROVENANCE RECORD SAYS WHAT HAPPENED

**LANDED `b448d3498`** over `320ce227a`. One file. Zero reader-facing bytes.

The `proseWaveGate.walker.test.js` rationale in `scripts/mutation-coverage-manifest.json` read
*"scripts/prose-wave-gate.mjs became scripts/prose-wave-gate.mjs in the same commit, never
aliased"* — a blanket rename at 8a-5 had rewritten the OLD name too. The FACT stays verified
(one implementation, never two); the sentence is repaired and the old name is spelled
deliberately with a note saying why, so the next blanket rename cannot eat it again.

⭐ **AND THE MD5 CLAIM BESIDE IT, WHICH IS THE HALF A READER WOULD ACTUALLY CHECK.** It matched
nothing on disk. It is now stated as what it is — the digest of `scripts/taste-measure.mjs` in
laneTASTE on 2026-09-08, before and after each of three plants, a record that each plant was
restored to the byte it started from — with both live digests named beside it so the discrepancy
cannot be re-discovered as a defect:

    scripts/prose-wave-gate.mjs             a354d99e4f6a483d32a8d7c7df330482  (this tree at 8a-11-6)
    laneTASTE f07b98529 taste-measure.mjs   9c614db18ff640d9528b89bbf29d8235

| gate | result |
|---|---|
| `tests/lint/mutationCoverageManifest.test.js` | **10 passed** |
| the file re-parses as JSON | yes |
| runners / porcelain | 0 / 0 |

---

### 8a-11-8 — CURE a-9 (§U c-6): THE OWNER'S RE-INDEXED VETO SURFACE GAINS MACHINE STANDING

**LANDED `da350688e`** over `b448d3498`. Two files, **+268**. Zero reader-facing bytes.

`docs/content/prose-reindex-8a1.json` (**3,771 B**) is the classifier's own per-class,
per-audience, per-BLOCK output for car 8a-1, plus the **sha256 of the two per-cell tables** it was
classified from. The contract test recomputes every declared field from it.

| what the arm recomputes | from |
|---|---|
| `cells` and the moved total | the sum over the 40 per-block rows |
| `blocksTouched` · `blocksUntouched` | the count of per-block rows with `reIndexed > 0` and `=== 0` |
| `UNCHANGED` | cells minus moved, so the two classes cannot drift apart |
| both audience halves, every class, `indexOnly` | the classifier's own split |
| `deepest` and `shallowest` | derived block names and share, so the row's two PROSE figures are held by the same data as its integers |

⛔ **AND THE COMMITTED JSON IS ITSELF ANCHORED**, or it would be a second hand-typed number one
file over. `scripts/prose-manifest-cells.mjs` is deterministic, so the digests are re-derivable:

    base  29ec62425   5f4639665484e88cb47e43a57a8fd00991baf50dbca8699f50e8710fa9b5f5f2
    tip   f4005cccd   dfdece7e814a2cafe3b4a3f909e00c7600c7fef429972d208d1edc14d7c2c5db

⭐⭐ **THE TIP DIGEST WAS REPRODUCED THREE TIMES INDEPENDENTLY IN THIS CAR** — the table recorded
at `f4005cccd`, a fresh recording at `5c7eadb18` in `$SC/skepRW3`, and a fresh recording at
8a-11-4 in this dock are BYTE-IDENTICAL (`cmp` clean, one sha256). That is the whole 8a consist's
zero-byte fence restated as a single digest.

### THE PLANT THE FOLD NAMED, EXECUTED

    (the register row) RE-INDEXED 40000 · UNCHANGED 33284 · dm 20000 · player 20000

    clean tree   77 passed
    planted      1 failed | 76 passed
                 ⛔ the declared re-index must be the classifier's own arithmetic, block by block:
                 expected { cells: 73284, moved: 40000, …(2) } to deeply equal
                          { cells: 73284, moved: 43685, …(2) }
    restored     (git show HEAD:<path> > <path>)   77 passed

The declared FIGURES do not move — cells 73,284 · RE-INDEXED 43,685 = 59.61 % · UNCHANGED 29,599
· the five fence classes 0 · dm 21,994 of 36,660 · player 21,691 of 36,624 · blocks touched 40 of
40 · deepest DS-GEN-5 and DS-STR-1 at 100.00 % · shallowest DS-GEN-18 at 0.47 %. The row gains
standing, not a new value.

| gate | result |
|---|---|
| the projection contract | **77 passed** |
| `observedShapeReaders` · `proseCorpusBytes` · `proseWiringCensus` | **140 passed** |
| eslint · `wiring-census --dry` · `check-observed-shape-readers` | exit 0 · CURRENT, ROWS 0 · **1,972** |
| runners / porcelain | 0 / 0 |

---

## CAR 8a — CORRECTED AT THE FOLD (the receipt's b-1 … b-7, verbatim from SITTING §U)

⛔ **NOTHING ABOVE IS DELETED.** Each row names the sentence in the CAR 8a section that is
wrong, quotes it, and states what it should read. A receipt whose errors are erased cannot be
audited, so the original wording stays where it was written and this section is what a later
reader is bound by.

### b-1 (fold NEW-7) — §8a-3's "23 files taken" is **22 distinct files taken**

> **STRUCK:** "**23 files taken · 15 distinct files refused.**"
> **READS:** **22 distinct files TAKEN** · 15 distinct files refused.

`83e8acf17` changes 23 files. Deduplicating §8a-3's own TAKEN column across the eleven picks
gives **22 distinct** taken files; the 23rd file in the commit is `docs/content/wiring-census.json`,
which is the census RE-TAKE the receipt declares separately in its very next subsection, not a
file taken from a pick. The refused count (15 distinct) checks out.

### b-2 (fold R-1 + NEW-5) — §8a-1 and the CLOSE: the DRIFT corpus's seeds

> **STRUCK, in §8a-1's finding block:** "Every configuration of the DRIFT corpus carries the same
> `_seed` (`golden-master-v3`) … so one pool has ONE drawn variant across all 525 towns".
> **STRUCK, the remedy that rested on it:** "Widening it needs the recorder's `--seeds` family
> rather than DRIFT — a car of its own, flagged for the skeptic pass."
> **STRUCK, in §8a-3's "four findings" list, finding 3:** "**Every DRIFT configuration shares one
> `_seed`**".
> **READS:** **516 of the 525 configurations share `golden-master-v3`; nine carry one of
> `gm-seed-a`, `gm-seed-b` and `gm-seed-c`, three towns each** — deliberately
> (`tests/helpers/goldenMasterCorpus.js:116-121`). Cells: 72,108 / 394 / 390 / 392.

The SUBSTANCE survives: 516 of 525 do share one seed, so a per-pool count over them is still a
town count wearing a draw's clothes, and the 345 → 309 / 36 explanation is unaffected. What is
struck is the universal quantifier and the remedy. **ADDENDUM 1 ruling 8's routing of a DRIFT
widening to a CAPACITY-train car is WITHDRAWN** by §U c-3. Landed as an ARM at 8a-11-5.

### b-3 (fold P-2) — §8a-10 and any ledger row: ONE new register row, not two

> **STRUCK** (from the brief's wording, which a ledger row must not repeat): "the SHIFT REGISTER
> … with its TWO new rows".
> **READS:** **base 14 mechanisms → tip 15.** The ONE new id is **`passage-shape`**;
> `draw-formula` was **REWRITTEN IN PLACE** with its declared `reIndexed` block.

§8a-1 already says "Row rewritten" and §8a-10 already prints "all fifteen mechanisms", so nothing
in the receipt was false — this row exists so the §919 ledger cannot inherit the brief's phrasing.

### b-4 (fold NEW-14, FOLD-DERIVED) — §8a-5(a)'s corpus-grain triple is CORPUS-DEPENDENT

> **STRUCK as a portable figure:** the CORPUS row of the two-length plant table — "short-face
> corpus exceeded 12/13 · share 0.923 · mean 0.533 · long-face corpus exceeded 11/13 · share
> 0.846 · mean 0.500".
> **READS:** the PROPERTY — **THEY DIFFER** — plus the real-corpus discrimination:
> `DS-DEF-11 :: WALLED-STRAINED` prints **distinct tuples 2 of 2 faces** where `WALLED-QUIET`
> prints **1 of 3**.

An independent probe of the same shape read short 12/13 · 0.923 · mean **0.819** and long
**10/13** · 0.769 · **0.627**. Neither print NAMES its three companion sentences, and the triple
is a property of the surrounding four-sentence corpus, so the two are not comparable and one of
them would have gone into the ledger wrong. The FACE-grain figures agree exactly on both prints
(0 exceeded · mean 0.259 on both faces; the em-dash face 1 · 0.125 · 1.410), and those are
portable because a face is its own subject. **THE LEDGER CARRIES: "they differ" + the
`2 of 2` / `1 of 3` real-corpus discrimination, never the bare triple.**

### b-5 (fold NEW-5 of the gate lens) — §8a-5: the gate's DEFAULT roster composes ZERO units

**ADDED to §8a-5.** `poolRosterOf({section: null, pools: null})` returns the taste's seven pool
NAMES with `why: "no --section and no --pools: the taste's seven"`, and those seven compose
**0 units** in this tree. 8a-5's headline finding — "the gate had no subject" — is cured only
when `--section` or `--pools` is passed. It is HONEST (`absentPoolRow` reports NOT-EXECUTABLE and
the `why` line says so), which is why the fold rated it LOW, but **8b's workflow must never call
the gate bare.** The gate's header now says so in terms (landed at 8a-11-2).

### b-6 (fold NEW-4 of the kernel lens) — §8a-1: the 4.5 SE ceiling's headroom

**ADDED to §8a-1's uniformity block.** The chair's ADDENDUM 1 ruling 2 accepted a **4.5 SE**
per-pool ceiling on the strength of a measured 3.43 SE. Over SIX seed families the deepest
per-pool deviation reads **3.27 · 3.43 · 3.57 · 3.57 · 3.85 · 4.42 SE**. The margin on the PINNED
family is **1.07 SE** and one of six alternative families came within **0.08 SE** of the ceiling.
It is not flaky today — the arm's 10,000 seeds are fixed literals — but **any car that re-seeds
that arm should expect it to fire**, at roughly one in sixty per re-seeding. Carried as a warning
by §U.3.

### b-7 (fold's append-safety block) — §8a-1: carry the SHARES and the PROPERTY, never the counts

**ADDED to §8a-1's append-safety table.** An independent seed family reads
**273,629 / 820,425 / 273,218 / 547,207** at the same **25.01 % / 74.99 %** shares. The raw counts
are family-dependent; the SHARES and the PROPERTY are not. **THE LEDGER CARRIES: 25.01 % against
74.99 %, and "not one read moves between two old wordings" — never the raw counts as if they were
pins.**

---

## CAR 8a — THE THREE UNTESTED ROWS, EXECUTED (ADDENDUM 3 item 9; SITTING §U.3)

### U-4 — `proseTasteCandidates.walker.test.js`: **8 of 9 arms red, and the ninth is vacuous** — CONFIRMED

A throwaway dock `$SC/rwU4` was cut at `5c7eadb18` (`sh $SC/mkdock.sh rwU4 5c7eadb18` →
`links=453 porcelain=0`) and the walker extracted alone from its source commit with
`git show 69eb79415:<path> > <path>` — the same act as a one-file cherry-pick and without the
cherry-pick machinery on a shared tree.

    npx vitest run tests/lint/proseTasteCandidates.walker.test.js
      Test Files  1 failed (1)
      Tests       8 failed | 1 passed (9)

⭐ **THE ONE THAT PASSES IS THE ONE THE RECEIPT NAMED**, and it passes VACUOUSLY:

    ✓ DS-DEF-11 watch: both limbs of one roster pass, and the covert one is offered anyway

    node -e over the shipped leaf in the same dock:
      defenseStateProseCandidates('DS-DEF-11', <a bought town>)  ->  []
      defenseStateProseCandidates('DS-DEF-11', <a clean town>)   ->  []
      the arm asserts .every(...) over 0 rows and a `watch:` key filter over 0 rows
      [].every(x => true) === true

The arm's own comment says as much (*"the control here is the SHAPE of the call rather than a
fired pool"*), so the vacuity is admitted rather than hidden; it is still vacuity. The eight reds
are the two polarity pools, the three stores labels, the purse gate, both cross-check arms, the
cycle-load arm, the covert-seating arm and the RATE-slice census.

**The dock was deleted** (`git worktree remove --force`); `git worktree list` no longer names it
and `laneREWRITE` reads porcelain 0.

### U-5 — the closure cost of a lexicon import, PLANTED then restored — CONFIRMED, with a moved figure

    node --input-type=module -e "closureCost(composeStateProse.js, composedWalker.js)"

| state | added | host closure | with the edge |
|---|---|---|---|
| the edge ABSENT (the instrument blocks it anyway) | **4 files / 167,469 B** | 3 files / **78,782 B** | 7 / 246,251 |
| the edge PLANTED (`import { contentWords } …`) | **4 files / 167,469 B** | 3 files / 78,940 B | 7 / 246,409 |

The four are `prose/composedWalker.js` · `prose/entryLexicons.js` · `prose/entryWalker.js` ·
`prose/moveGrammar.js`, exactly the four car 8a-4 named. ⭐ **THE INSTRUMENT ANSWERS THE SAME
QUESTION WITH THE EDGE PRESENT AND ABSENT**, which is the property its own header claims and the
defect its standing plant convicts (a naive difference answers ZERO once the import is made): the
naive closure with the edge present reads **7 files**, and `closureCost` still prices the edge at
four.

⚠ **THE RECEIPT'S 8a-4 FIGURE IS SUPERSEDED, NOT REFUTED.** §8a-4 recorded **+4 files /
+150,231 B onto a 70,252 B closure**. Both sides have grown since: `composedWalker.js` and its
three gained bytes at 8a-5 and 8a-6, and the host gained the connectives leaf at 8a-11-4 plus its
own comments. **The four files and the ORDER OF MAGNITUDE are the finding and both hold**; the
byte figures are a measurement of a moment and the ledger should carry the four files and the
ratio (a lexicon costs about 170 kB against a 79 kB host; the connectives leaf costs 2,046 B).

**AND THE FENCE CONVICTS THE PLANT INDEPENDENTLY**, executed in the same window:

    npx vitest run tests/lint/composeStateProseFence.test.js
      1 failed | 8 passed — "an unlicensed import in the composer:
      expected [ '../../prose/composedWalker.js' ] to deeply equal []"

Restored with `git show HEAD:<path> > <path>`; `cmp` against the pre-plant copy is clean and
porcelain read 0.

### U-6 — the four walkers' **214** — CONFIRMED, and the four are named

Run at `5c7eadb18` in `$SC/skepRW3` (porcelain 0 before and after), which is the tip the figure
was claimed at:

    npx vitest run tests/lint/prosePassageShapes.walker.test.js \
                   tests/lint/proseComposed.walker.test.js \
                   tests/lint/proseWaveGate.walker.test.js \
                   tests/lint/proseWiringCensus.walker.test.js
      Test Files  4 passed (4)
      Tests       214 passed (214)

The commit message for `5c7eadb18` said "214 tests over four files" without naming them; they are
those four (11 + 84 + 41 + 78). At THIS car's tip the same four read **217**, because 8a-11-2 and
8a-11-3 added three arms to `proseWaveGate.walker.test.js`.

---

### 8a-11-9-lighting — THE RITUALS: ONE OWED, TWO MEASURED AND REFUSED

**LANDED `b005886ef`** over `da350688e`. One file. Zero reader-facing bytes.

ADDENDUM 3 item 10 asks for the three rituals "only where a walker or a stamped file moved". Of
the three, exactly ONE moved.

### THE LIGHTING CENSUS, BY ITS OWN RITUAL

    LIGHTING_CENSUS_REFREEZE='REWRITE car 8a-11 (Opus 5 — Fable-unvalidated)' \
    LIGHTING_CENSUS_NOTE='…' npx vitest run tests/lint/sovereigntyLightingContract.walker.test.js

    census REFROZEN at da350688e14b235967f6835d889b954af51787a6:
      files 2562 -> 2562 · parked 375 -> 375 · credited 2187 -> 2187
      titles 24158 -> 24163 · suiteTitles 6451 -> 6451

⭐ **ONLY `titles` MOVES, +5, AND THE DELTA IS THE RITUAL'S RATHER THAN A COUNT BY HAND.** The car
adds five test titles and NO test file, so `files`, `credited`, `parked` and `suiteTitles` must
not move — and they do not. The five: two arms in `proseWaveGate.walker` at 8a-11-2, one more
there at 8a-11-3, one in `composeStateProse.test` at 8a-11-4, one in `dossierProseManifest.test`
at 8a-11-5.

⚠ **AND A SIXTH ARM THAT COUNTS FOR NOTHING, WHICH IS THE MEASUREMENT WORTH KEEPING**: 8a-11-1's
new arm in `tests/domain/stateProseKernel.test.js` moved NO title. **`tests/domain` is PARKED;
`tests/lint`, `tests/property` and `tests/copy` are CREDITED.** That is why the 8a-2 receipt's
warning ("only +1 title was counted for 8 new `it()` blocks … do not assume +8") was right, and
why this delta was taken from the ritual and not counted by hand.

The ritual FAILS BY DESIGN; the plain re-run is the proof — **34 passed**.

### THE OTHER TWO, MEASURED AND NOT RUN

    node scripts/wiring-census.mjs --dry
      the committed register is CURRENT; nothing was written
      bytes committed 2,060,855 · fresh 2,060,855 · delta 0
      sections that would move: (none) · stamped shas that would move: (none)
      candidate leaves unmoved · ROWS that would move: 0

    node scripts/check-observed-shape-readers.mjs
      1,972 finding(s), exactly matching the frozen inventory        (frozenAtSha bc441dccc)
      shrink-only satisfied: 1,972 -> 1,972

No cure of this car touched a census-stamped file or an observed-shape execution input, so
neither register is stale and neither `--write` would be a lawful act. **A ritual with nothing to
record is not run**, and that refusal is a measurement here rather than an omission.

---

## CAR 8a-11 — THE CLOSE

**LANDED WHOLE.** Dock `$SC/laneREWRITE`, tip **`b005886ef`**, porcelain **0**, runners **0**.
Nine commits over `5c7eadb18`; **16 files, +911 / −180**.

| # | cure | sha |
|---|---|---|
| 8a-11-1 | a-1 (§U c-4) the `>= 0` guard's green instrument | **`f81b95c28`** |
| 8a-11-2 | a-2 (§U c-1) the gate's packet, namespaced and refusing | **`2f68fdd95`** |
| 8a-11-3 | a-3 (§U c-2) ONE `unitsOfPool` | **`1f7c8565d`** |
| 8a-11-4 | a-4 (§U c-5) ONE HOME for the connective lists | **`872497837`** |
| 8a-11-5 | a-5 (§U c-3) the false seed sentence, struck in the estate | **`73e0dd704`** |
| 8a-11-6 | a-6 + a-8 two stale sentences in the two scripts | **`320ce227a`** |
| 8a-11-7 | a-7 the rename's provenance record | **`b448d3498`** |
| 8a-11-8 | a-9 (§U c-6) the RE-INDEXED veto surface gains machine standing | **`da350688e`** |
| 8a-11-9-lighting | the rituals | **`b005886ef`** |

### ⭐⭐ THE ACCEPTANCE LINE (§U.4), EXECUTED AT THE TIP

| line | command | result |
|---|---|---|
| `tests/lint` WHOLE, green | `npx vitest run tests/lint` | **154 files passed / 0 failed · 2,593 passed / 0 failed** (`ls tests/lint/*.test.js` = 154, so the whole directory) |
| `voiceMechanics` at its inherited two files EXACTLY | `npx vitest run tests/copy/voiceMechanics.test.js` | **1 failed | 18 passed** — `labelBands.js` em 5 · `generalStateProse.js` em 3, and nothing else |
| the projection contract green | `npx vitest run tests/data/dossierStateProseProjection.contract.test.js` | **77 passed** |
| strict on its ceiling | `node scripts/check-domain-strict.mjs` | **1,120 errors, ceiling 1,120** — exit 0 |
| the typecheck ratchet | `npm run typecheck:ratchet` | **173 errors, ceiling 173** — exit 0 |
| the projector | `node scripts/generate-dossier-state-prose.mjs --check` | **exit 0** |
| ⛔ the classifier, `5c7eadb18` → the tip | `prose-manifest-cells` twice, `prose-manifest-diff` | **REPLACED 0 · RE-INDEXED 0 · ADDITIVE 0 · WORDING-ONLY 0 · ADDED 0 · REMOVED 0 · UNCHANGED 73,284 over 525 towns · index-only 0** |
| eslint over every `.js`/`.mjs` the car touched | `npx eslint <12 files>` | **exit 0, no output** |
| porcelain / runners | at every commit and at the return | **0 / 0** |

⭐⭐ **AND THE ZERO-BYTE FENCE AS ONE DIGEST.** The tip cell table's sha256 is
`dfdece7e814a2cafe3b4a3f909e00c7600c7fef429972d208d1edc14d7c2c5db` — **byte-identical to the
table recorded at `f4005cccd` (car 8a-1's tip), to a fresh recording at `5c7eadb18`, and to a
fresh recording mid-car at 8a-11-4**. Four independent recordings, one digest: not one of the
73,284 cells has moved since the index-stable draw landed.

### THE JUDGMENT CALLS, RECORDED FOR VETO

1. **The packet namespace is `<scratch>/packets/<dock>/`, not `<dock>/.packets/`.** ADDENDUM 3
   offered either. A directory inside the worktree reads as `?? .packets/` in porcelain and would
   have broken, on every dock, the check the cure exists to protect.
2. **The packet refusal allows the workflow's own progress.** Same arm at the same or a LATER
   round writes; another arm, or an EARLIER round, is refused. A gate that refused its own next
   round would be unusable, and the refusal still convicts the exact incident.
3. **The bare-spine branch is a FLAG on the lib, not a default.** The shape report's subject is
   the units a corpus LICENSES (a spine licenses none) and the gate's is the faces a wave is
   rewriting; a default would have silently widened one of them.
4. **Four fixture expectations were re-cut to the composer's real output rather than isolated
   behind an injected one-opener list.** They now read the SHIPPED leaves, which is the true
   input; the cost is that an owner copy act at the walk moves four lines, and each line says so.
5. **The `CONNECTIVES` narrowing is a typed cast, not a widened baseline and not an `any`.** The
   projector emits every leaf under one generic annotation and cannot state the nested shape.
6. **`stableVid` is exported for a test and for no product caller.** The alternative — a second
   spelling of the predicate in the test — is the two-homes defect this car cured twice elsewhere.

### WHAT THIS CAR MEASURED THAT THE FOLD DID NOT

1. **Neither register act the fold predicted is owed.** FOLD §4 items 3 and 4 expected the
   `passage-shape` and `comparator-and-band-rule` rows to move when the WITHHELD `why` and
   `prose-shape-report.mjs:205` were re-worded. Both rows' source pins name other substrings
   (`passage-shape`: the closed-set line and `SHIPPED_SHAPE`; `comparator-and-band-rule`: seven
   substrings in `composeStateProse.js`), the contract test re-reads every one from disk, and it
   is green. **The register stays at 15 mechanisms and no `--write` was run anywhere.**
2. **Of the three rituals, one was owed.** The wiring census and the OSR both read CURRENT.
3. **`tests/domain` is PARKED and `tests/lint` / `tests/property` / `tests/copy` are CREDITED**,
   measured commit by commit as the titles moved (or did not).
4. **The lexicon's closure price has grown since 8a-4** — +4 files / **167,469 B** onto a
   **78,782 B** host, against the receipt's +4 / 150,231 onto 70,252. The four files and the
   order of magnitude are the finding and both hold; the byte figures are a moment's measurement
   and the ledger should carry the ratio.


---

## CAR 8a-12 — THE NINE ANCHORS RE-SEEDED

**LANDED** as one commit `188010225` over `b005886ef`. Seat: Opus 5 — Fable-unvalidated. Dock
`laneREWRITE`. Chartered by ADDENDUM 4 (chair, 2026-09-09 09:2x) over the §919 whole-suite
proof (`whole-919.log`: 32,919 passed · 14 failed — five expected reds and NINE new ones, all
in `tests/ui/`). Porcelain 0 and runners 0 at the return.

### WHAT THE NINE ACTUALLY WERE

Every one is a LIVENESS ANCHOR: the `before` half of `expectPresentThenAbsent`, whose whole
job is that the "and it is gone on a public dossier" half cannot pass over an empty page.
Each anchor is a DRAWN member of a pool, and which member a pool draws is a function of the
fixture's `_seed` (`stateProseKernel.js` `drawVariant`, keyed `seed::blockId::poolKey`). Car
8a-1's index-stable draw (ARCH §13 row 22, SIGNED at SITTING §N.2; RE-INDEXED 43,685 of
73,284 = 59.61 %) therefore moved the drawn member **without moving one byte of the corpus,
the desk or the paid-surface gate those arms exist to prove** — the same class 8a-1 met and
cured in three desk suites, in a family neither its acceptance line nor the cure car's
reached.

⛔ **THE NINE ARMS WERE NINE, BUT THE PINS WERE SIXTEEN.** A `for` loop over pins throws on
the first, so the proof's nine failure lines named nine sentences and HID the rest: of the 23
corpus pins in `generalDeskTabFlow.test.js`, **sixteen had moved**, not eight. Measured before
any edit, by driving the desk readers at the shipped seeds (below) — a seat that had cured
only the nine printed sentences would have landed a car that reds on the next loop iteration.

### THE INSTRUMENT, CALIBRATED BEFORE IT WAS TRUSTED

The search ran on the desk readers rather than on a React render, because a render costs
~10 ms and `SPEAKING` needed six figures of candidates. That substitution is only safe if the
reader reproduces the DOM's verdict, so it was **calibrated against the proof's own readings
first** — every fixture, at its shipped seed, printed exactly what `whole-919.log` reported,
present and absent alike:

| fixture | shipped seed | at the shipped seed |
|---|---|---|
| `SPEAKING` (+ `COUNTED`) | `steinmark` | all 8 ABSENT |
| `CHRONICLED` | `steinmark` | IDENTITY, RECORD absent · MARKER, FOUNDED present |
| `UNVIABLE` | `steinmark` | FIRST_SURVEY absent · VERDICT, CONTRADICTIONS present |
| `FALLEN` | `ashfall` | REMNANT, RUIN absent · STEADING present |
| `LINKED` | `steinmark` | CONTACTS, ENGAGEMENT absent · TIE present |
| `ECO SPEAKING` | `forge_town` | FOOD absent · HEADER present |
| `FORGE` (DS-GEN-18) | `forge_town` | CRAFT present — **no act owed** |

### THE ACT, PER FIXTURE

The anchor helper's own words are the instruction — *"choose an anchor that still travels this
path — do not delete the anchor to get green"* — and 8a-1's own act is the precedent. Six
fixtures take a new `_seed` that draws EVERY member pinned off it. **No anchor deleted, no
assertion weakened to a substring that would pass vacuously, no `src/` byte moved:** the whole
diff is six seed strings plus the comments that say why (`git diff -U0` filtered to
non-comment lines shows exactly six pairs).

| file | fixture · arms | old seed → new seed | pins that had to hold together | candidates tried |
|---|---|---|---|---|
| `tests/ui/generalDeskTabFlow.test.js` | `SPEAKING` — the six-blocks loop, the ONE CALLER counts, DS-POP-3 (via `COUNTED`), the unread ring | `steinmark` → **`steinmark-16jm`** | 8: DS-GEN-12/13/17/3/2/7, DS-REL-2, DS-POP-3 | 111,965 |
| ″ | `CHRONICLED` — the history positions, the `{calamity}` doubled-article arm | `steinmark` → **`steinmark-w`** | 4: DS-GEN-9 ×2, DS-GEN-14, DS-GEN-16 | 33 |
| ″ | `UNVIABLE` — the three DS-GEN-11 lenses | `steinmark` → **`steinmark-c`** | 3 | 23 |
| ″ | `FALLEN` — DS-GEN-8's three surfaces | `ashfall` → **`ashfall-27`** | 3: remnant, ancient ruin, forced steading | 86 |
| ″ | `LINKED` — DS-REL-1's two lenses and the engagement | `steinmark` → **`steinmark-v`** | 3 + the patron-end exclusion | 121 |
| `tests/ui/economicsTabFlow.test.js` | `SPEAKING` — the public gate | `forge_town` → **`forge_town-b`** | 2: DS-ECO-1, DS-ECO-9 | 22 |

`FORGE` (DS-GEN-18), `HOOKED` (the framing arm compares render LENGTHS, not sentences), the
`living` control (asserts the empty string) and DESK-ECON2's `GROUND` (**no `_seed` and no
`id` at all — canonical-at-zero by kernel law 4, which no draw rule can move**) are LEFT
untouched, each for the reason named.

⚠ **THE SEEDS ARE COORDINATES, NOT NAMES, AND `steinmark-16jm` IS UGLY FOR A REASON.** A
fixture's seed must satisfy every pin drawn off it AT ONCE; eight independent pools is a joint
event of about 1 in 112,000, so any seed that satisfies it looks random. That is a property of
the requirement, not a choice — three alternates were recorded in case one is preferred
(`steinmark-1zk2`, `steinmark-2eef`). The reasoning is written into the file above the
fixtures so the next seat re-seeds rather than deletes.

### THE NEGATIVE CONTROL — WHY THIS GREEN IS NOT A VACUOUS ONE

Not one assertion string changed. The identical assertions, against the identical helper, RED
at the old seeds (that is `whole-919.log`, executed) and PASS at the new ones. The proof that
these anchors can still fail is the proof that already failed them.

### THE SWEEP — every test family, matched rather than eyeballed

⛔ **THE CLASS IS NARROWER THAN "A PROSE PIN".** The index-stable draw moves a read only where
a pool's members carry a `vid`; a pool with none falls back to the modulus and nothing moves.
The corpus AT RISK is therefore exactly the six STATE leaves, and the risk rides one field of
one variant: `"text"`. A pool KEY, a block id, a title, a slot name and an `angle` are all
draw-immune — that is what ADDENDUM 4 means by "anchor on the key".

    CORPUS AT RISK    6 state leaves, 2,264 variant texts
    CAUSAL REGISTER   468 variant texts, 0 carry a vid — MODULUS FALLBACK, no read can move
    SEARCHED          2,614 files under tests/ across 38 families
                      (domain 981 · components 257 · lib 169 · ui 157 · lint 156 · security 147
                       · store 141 · generators 111 · property 90 · build 54 · pdf 43
                       · edgeFunctions 38 · joins 32 · helpers 31 · data 24 · architecture 19
                       · design 20 · docs 19 · simulation 15 · fixtures 15 · ops 14
                       · soak-harness 12 · copy 10 · kernel 10 · hooks 9 · config 8 · scripts 7
                       · application 6 · foundry 5 · interior 4 · map 2 · perf 2 · utils 1
                       · mcp 1 · smoke 1 · setup 1 · dossier 1 · generation.test.js 1)
    CANDIDATES        68,065 string literals of >= 18 chars carrying a space
    PINS FOUND        65 literals in 18 files

Matched by ALIGNMENT, not by grep: each variant is split on its `{slot}`s into FIXED SEGMENTS
— the only runs a renderer cannot alter — and a literal counts when it can be aligned against
that list with every slot standing for one arbitrary fill of 1..80 characters, over a floor of
**18 characters of fixed text** (without that floor an alignment can spend the whole literal
inside fills and match nothing, which is the vacuity the sweep exists to avoid: at floor 0 it
reported 49,233 "pins"). Candidates were narrowed by the FOUR rarest indexed words rather than
the single rarest — a fragment carries filled slots, and a fill word can be rare in the corpus
for a different variant entirely, which is what made the first pass report a clean sweep over
files that do carry pins.

**THE LEDGER — 18 files, 2 moved, 16 left:**

| file | pins | act | reason |
|---|---|---|---|
| `tests/ui/generalDeskTabFlow.test.js` | 23 | **MOVED** (5 seeds) | the eight red arms |
| `tests/ui/economicsTabFlow.test.js` | 9 | **MOVED** (1 seed) | the ninth red arm; the other 7 are DESK-ECON2's canonical-at-zero fixture |
| `tests/domain/generalStateProseDesk.test.js` | 3 | LEFT | a real seeded draw — **green focused, 69 passed** |
| `tests/domain/defenseStateProseDesk.test.js` | 3 | LEFT | a real seeded draw, re-seeded already at 8a-1 — **green focused, 91 passed** |
| `tests/domain/economyStateProseDesk.test.js` | 3 | LEFT | 2 pins carry an UNRENDERED `{slot}` (a corpus read, not a draw); 1 is docblock text — **green focused, 59 passed** |
| `tests/domain/warFaithStateProseDesk.test.js` | 3 | LEFT | a real seeded draw, re-seeded already at 8a-1 (`thornwall-b`) — **green focused, 28 passed** |
| `tests/data/dossierStateProseProjection.contract.test.js` | 2 | LEFT | reads the projection, not a draw — **green, 77 passed** |
| `tests/lint/proseWaveGate.walker.test.js` | 5 | LEFT | corpus text as fixture INPUT to the gate, never drawn — green in `tests/lint` whole |
| `tests/lint/proseEntryContradiction.walker.test.js` | 3 | LEFT | same — walker input |
| `tests/lint/proseComposed.walker.test.js` | 3 | LEFT | same — walker input, pinned WITH its `{settlement}` unfilled |
| `tests/lint/dossierMountRegistry.walker.test.js` | 1 | LEFT | a hand-built rung fixture, not a draw |
| `tests/lint/envoyKindPools.walker.test.js` | 1 | LEFT | a different pool family's authored list |
| `tests/domain/settlementLifecycleFirstClass.test.js` | 1 | LEFT | the CHRONICLE event's description — generator-authored; the phrase is shared with the corpus, the code path is not |
| `tests/domain/magicRegimeLifecycle.test.js` | 1 | LEFT | `remnantReason`, a generator field — never reaches `drawVariant` |
| `tests/generators/settlementReason.test.js` | 1 | LEFT | a generator line (`lines[0]`), same |
| `tests/domain/stressorAftermath.test.js` | 1 | LEFT | a TEST TITLE — false positive of the matcher |
| `tests/domain/npc/paradigmAxisCatalog.test.js` | 1 | LEFT | a test title — false positive |
| `tests/ui/warRemembranceReader.test.jsx` | 1 | LEFT | a UI heading used as an `expectAbsentWithAnchor` anchor; not corpus prose — false positive, and green in `tests/ui` whole |

⚠ **TWO KNOWN RECALL LIMITS OF THE MATCHER, stated rather than hidden.** (1) The 18-character
fixed-text floor rejects a real pin whose fixed run is shorter — `PATRON_LINE`
(`Thornmere looks to Steinmark`, fixed run `" looks to "` = 10) is a genuine corpus pin the
sweep does NOT list; it is covered here because it sits in a file this car moved. (2) A pin
whose every content word is a slot fill cannot be narrowed to its variant. Both limits shrink
the ledger, never inflate it, and both are why the ledger is offered beside the executed
whole-suite proof rather than instead of it.

### ⛔ A CORRECTION OWED — THE COMMIT MESSAGE'S SWEEP COUNT IS WRONG

`188010225`'s message says **"56 pins in 18 files"**. The final figure is **65 pins in 18
files**; 56 was the count from the pass BEFORE the rare-word narrowing was widened from one
word to four, and the two numbers were crossed while the message was written. The FILE count
(18) and every conclusion drawn from the ledger are unaffected — the widening only ADDED nine
pins, all of them in files already listed. Recorded here rather than amended (the lane may not
amend); the chair may want it in the §919 row.

### ACCEPTANCE — every figure from a command that was run, with its exit

| gate | command | result | exit |
|---|---|---|---|
| the two cured files | `npx vitest run tests/ui/generalDeskTabFlow.test.js` | **Tests 24 passed (24)** · Test Files 1 passed | **0** |
| ″ | `npx vitest run tests/ui/economicsTabFlow.test.js` | **Tests 13 passed (13)** · Test Files 1 passed | **0** |
| **`tests/ui` WHOLE** (the car's named acceptance) | `sh scripts/gate-mutex.sh --run -- npx vitest run tests/ui` | **Test Files 157 passed (157) · Tests 989 passed (989)** | **0** |
| **`tests/lint` WHOLE** | `sh scripts/gate-mutex.sh --run -- npx vitest run tests/lint` | **Test Files 154 passed (154) · Tests 2,593 passed (2,593)** | **0** |
| the projection contract | `npx vitest run tests/data/dossierStateProseProjection.contract.test.js` | **Tests 77 passed (77)** | **0** |
| strict domain | `node scripts/check-domain-strict.mjs` | `✓ no strict-type regressions (1120 errors, ceiling 1120)` | **0** |
| typecheck ratchet | `npm run typecheck:ratchet` | `OK — no type regressions (173 error(s), ceiling 173)` | **0** |
| eslint | `npx eslint <the two touched files>` | no output | **0** |
| sweep evidence | four desk suites, focused, one at a time | 69 · 91 · 59 · 28 passed | **0** each |
| runner count | own shell, before every vitest | **0** every time (11 checks) | — |
| machine load | `ps -r` before the whole runs | one `/bin/zsh` at 0.0 % — no system process to make a run vacuous | — |

**THE ONE RED, INHERITED AND UNCHANGED.** `npx vitest run tests/copy/voiceMechanics.test.js`
exits 1 at its **inherited two files exactly**, byte-identical to the §917 tip and to
ADDENDUM 2's declaration:

    src/domain/display/labelBands.js: baseline em:0 bang:0 → current em:5 bang:0
    src/domain/display/stateProse/generalStateProse.js: baseline em:0 bang:0 → current em:3 bang:0

Tests 1 failed | 18 passed (19). Neither file is touched by this car (the whole diff is two
files under `tests/ui`), so this is the banked E2 ratchet and not this car's.

### FINDINGS FOR THE FOLD AND THE §919 ROW

1. ⚠ **THESE ANCHORS WILL RE-ROLL AGAIN, BY DESIGN, AND THAT IS THE REWRITE'S OWN DOING.**
   Under the index-stable draw, appending a wording to an n-member pool moves about `1/(n+1)`
   of its reads. NEVER TRIM means every block car of the rewrite appends. `SPEAKING` alone
   pins eight pools, so a car that adds one wording to each is expected to break roughly
   `8/(n+1)` ≈ 1–2 of its anchors — and the loop will again print ONE of them. This is not an
   argument against the draw (that is signed and correct); it is a standing cost of pinning a
   DRAWN sentence in a rendered-DOM test, and it now falls due once per block car. **Two
   structural cures are available and neither is this car's to take:** give these arms an
   anchor no draw can move (the desk's rung `provenance.poolKey` reaches the reader nowhere,
   so it would need a `data-` attribute on the rendering — a `src/` change), or teach the
   wave gate of 8a-5 to re-seed the UI fixtures as part of a block's keep-or-revert. Flagged
   for the skeptic pass and for 8b's brief.
2. ⚠ **THE ACCEPTANCE-GAP HAZARD NOW HAS ITS FOURTH FAMILY, AND A FIFTH IS PREDICTABLE.**
   8a's line reached neither `tests/ui` nor `tests/domain`; 8a-11's reached neither. The
   sweep's ledger says where the next one will land: `tests/domain`'s four desk suites carry
   nine live seeded pins and are in NO car's acceptance line — they are green today only
   because 8a-1 happened to cure three of them by hand. Naming the four desk suites plus
   `tests/ui/generalDeskTabFlow.test.js` and `tests/ui/economicsTabFlow.test.js` as a standing
   six-file gate after any draw-touching commit would close the class; recommended to the
   chair, not taken here.
3. The instruments are in this seat's scratchpad
   (`.../67af10e4-.../scratchpad/s8a12/`: `probe.mjs` the calibrated seed search,
   `sweep.mjs` the alignment matcher, `sweep.txt` the full 65-pin listing with each pin's
   corpus source printed beside it). Nothing was written into the dock, and none of it is
   committed — if the chair wants the matcher standing, it is a walker's worth of code and a
   car of its own.


---

## CAR 8a-13 — DRAW-FOLLOWING ANCHORS

**LANDED** as two commits over `188010225`: `cea20ddb3` (the car) and `cc22f1d72` (the
lighting refreeze, which the ritual refuses to run on a dirty tree). Seat: Opus 5 —
Fable-unvalidated. Dock `laneREWRITE`. Chartered by ADDENDUM 5 (chair, 2026-09-09 09:5x).
TESTS AND TEST HELPERS ONLY: `git diff --stat 188010225..HEAD -- src` prints NOTHING.
Porcelain 0 and runners 0 at the return.

### WHAT THE CLASS ACTUALLY IS, AND WHY THE THIRD FIX HAD TO BE STRUCTURAL

A liveness anchor on state prose pins a SENTENCE. It MEANS "this block draws at this
position, privately, and is silent on a free dossier"; it SAYS "this position draws THIS
WORDING". Those are different claims, and only the first is the arm's subject. Which wording
a pool draws is a function of the fixture's seed and of the draw rule, so a change to either
— or a rewrite of the wording under Shift 1, or an APPENDED wording that wins the draw under
NEVER TRIM — reds every literal pin at once while the thing it guards is perfectly well.

| car | the act | the bill |
|---|---|---|
| 8a-1 | the index-stable draw (RE-INDEXED 43,685 of 73,284 = 59.61 %) | three desk pins re-seeded by hand |
| 8a-12 | the §919 proof's nine reds | SIXTEEN pins moved; six fixtures re-seeded; **111,965 candidate seeds** for `SPEAKING` alone, because eight independent pools had to be satisfied at once |
| every block car of the REWRITE, from here on | one appended wording per pool | ≈ `8/(n+1)` of `SPEAKING`'s anchors, i.e. one or two, **for ever** |

### THE HELPER — `tests/helpers/drawnProse.js` (new, 300 lines)

    drawnMember({ leaf | corpus, blockId, poolKey, seed, audience, slots, dimensions })  -> string
    drawnMembers(specs, shared)   -> the shape it was given (array -> array, object -> object)
    variantByVid({ ...spec, vid }) -> one NAMED wording's own filled text, by its stable id
    poolMemberTexts(spec)          -> EVERY renderable member of a pool, filled
    STATE_LEAVES                   -> the six leaves by desk name (the walker reads this too)

`drawnMember` drives BOTH shipped read paths and neither is decorative: `readStateProse`
(`stateProseKernel.js:481`) for the kernel grain, `composeStateProse` (`composeStateProse.js:793`)
for the desk's own grain — every rung in the estate is built by the composer — and the composed
unit is REFUSED unless it opens on the spine the kernel drew (`arrange` puts the spine first in
both seats; the clause seat only strips its final stop, so the check survives the day a modifier
attaches). A null read is a HARD ERROR naming the four causes, never an empty string: an anchor
that silently became `''` would make every `toContain` downstream pass vacuously, which is the
exact defect `anchoredNegatives.js` exists to prevent, moved one step earlier.

⛔ **IT IS NOT "ASK THE DESK AND CHECK IT ANSWERED", and the file's own old comment demanded
that it not be.** The helper NEVER SEES THE SETTLEMENT. The test names the block, the pool, the
audience and the fills — the whole semantic claim — and computes from the CORPUS; the render
comes from the DESK; the two meet only at the assertion. A desk that stopped drawing that pool,
lost a fill, or drew a different pool still reds on the liveness half.

⚠ **THE SLOT BAG MUST BE THE DESK'S, NOT A SUPERSET — measured, not reasoned.** A bag with one
extra fill makes a variant the desk considers UNANCHORED eligible here, which moves the draw.
Caught in the act while this car was written: `DS-GEN-14 :: FOUNDED-OLD` with `timeband_age`
added to its bag drew *"Steinmark was made on purpose…"* where the desk draws *"Steinmark reads
as a place built to a plan…"*. That is also the proof the helper is not tautological — it is
sensitive to an input the desk fixes.

### THE CALIBRATION — THE INSTRUMENT WAS CHECKED BEFORE IT WAS TRUSTED

Ground truth was taken by driving the SHIPPED DESKS (`generalStateProse`, `economyStateProse`,
`warFaithStateProse`) at the shipped seeds and recovering each rendered sentence's provenance by
aligning it against its variant template. **All 34 specs the car needed then matched the helper's
output EXACTLY, byte for byte**, on the first pass but one (the `FOUNDED` bag above).

### THE ACT, PER FILE

**35 literal state-prose fragments removed. Not one anchor deleted; not one assertion weakened
to a substring; no `src/` byte moved.**

| file | literals removed | became |
|---|---|---|
| `tests/ui/generalDeskTabFlow.test.js` | **24** (the sweep's 23 + `PATRON_LINE`, which 8a-12's matcher missed) | 22 computed anchors (5 `drawnMembers` blocks + 3 `drawnMember`), and 2 replaced by WHOLE-POOL rosters |
| `tests/ui/economicsTabFlow.test.js` | **9** (2 seeded + the 7 canonical-at-zero `GROUND_LINES`) | 9 computed anchors in 2 `drawnMembers` blocks |
| `tests/domain/generalStateProseDesk.test.js` | **1** (`toContain('a supply that has failed upstream')`) | `expect(line).toBe(drawnMember(…))` — STRONGER, and it follows a rewrite |
| `tests/domain/warFaithStateProseDesk.test.js` | **1** (a two-part concatenated sentence in `toBe`) | `expect(line).toBe(drawnMember(…))`, the `toContain('Eastmarch')` / `toContain('Thornwall')` pair kept above it so the equality stays a DIRECTION claim |

**TWO EXCLUSIONS WERE WIDENED FROM ONE WORDING TO THE WHOLE POOL**, which is strictly stronger
and covers a member appended tomorrow the day it lands: the patron-end exclusion now refuses all
3 wordings of `DS-REL-1 :: patron`, and the unread-ring arm refuses both wordings of
`DS-POP-3 :: LEVEL` rather than the one it happened to name.

**AND ONE ARM GAINED ITS REAL SUBJECT.** The `{calamity}` doubled-article arm anchored on
whatever DS-GEN-16 drew — but only TWO of `ANCHORED-RECENT`'s three wordings name `{calamity}`
at all, so whether the DOM arm touched the seam was seed luck. It now fills all three from the
desk's own `calamityFill` (imported, not transcribed: `calamityFill('The Great Fire')` = `great
fire`) and checks each directly.

### THE FOR-LOOP THAT HID SEVEN FAILURES

Five bare pin loops became `collectSeedFailures` + `expectNoSeedFailures`, and three new
collected loops were added — **8 in `generalDeskTabFlow`, 1 in `economicsTabFlow`**. Proven by
plant B below, where the collected loops printed **7 of 7 · 4 of 4 · 3 of 3 · 4 of 4** instead of
the first casualty.

### THE WALKER — `tests/lint/proseDrawnAnchors.walker.test.js` (new, 503 lines)

Aligns every string literal in every `tests/**/*.test.js(x)` — outside comments, interpolating
template literals skipped — against the six leaves' 2,266 variant texts, each `{slot}` standing
for one arbitrary fill of 1..80 characters, over a floor of **18 characters of FIXED text
actually matched**. Narrowed by the four rarest indexed words (one word sends real pins to the
wrong posting list — 8a-12's own measured miss). Seven false-positive rows frozen SHRINK-ONLY
with each one's reason read at the freeze; the four fixture-input files exempt BY NAME with a
non-vacuity arm over each; the six cured files held at EXACT ZERO.

⛔ **THE CHARTERED SCOPE WAS BUILT, MEASURED AND REFUSED, WITH THE MEASUREMENT.** ADDENDUM 5
asks for a scan "inside `toContain(` / `queryByText(` / `toMatch(` or an anchor call". Built that
way and run at this tip it reports **TWO** pins in the whole corpus — and would have caught
**NONE of the sixteen that actually bit at 8a-12**, because every one of them was a
`const GROUND = '…'` at module scope that an assertion later names. A detector that misses the
shape of its own founding incident is not a detector. The scan is widened to every literal and
the extra false positives are carried in the roster with their reasons.

⚠ **AND THE MATCHER WAS WIDENED ONCE MORE, for the same reason.** Its first cut required a fixed
run reached after a slot to match in FULL, so `'What the realm has lost'` aligned on nine
characters instead of eighteen and slipped under the floor. A literal may now END part-way
through such a run. Two recall limits remain and are stated in the header: a pin whose fixed runs
total under 18 characters (`'Thornmere looks to Steinmark'`, fixed run `' looks to '` = 10) and a
pin split across `+` into under-floor pieces. Both SHRINK the ledger, never inflate it.

**THE SEVEN SURVIVORS — not one is a pin on a drawn sentence, each read at the freeze:**

| file:line | the literal | what it really is |
|---|---|---|
| `tests/domain/magicRegimeLifecycle.test.js:221` | `the building stands` | `remnantReason`, a GENERATOR field — never reaches `drawVariant` |
| `tests/domain/settlementLifecycleFirstClass.test.js:400` | `left with the wagons` | a CHRONICLE event description, same |
| `tests/domain/stressorAftermath.test.js:89` | `a settlement without a history object still gains one` | a TEST TITLE — the matcher's own false positive |
| `tests/lint/dossierMountRegistry.walker.test.js:640` | `The town does not grow what it eats.` | a hand-built rung fixture handed to the registry's reader |
| `tests/lint/economyReadModelCoverage.walker.test.js:414` | `last survey may not be fully counted` | a NEEDLE for a source scan over `src/` — the opposite direction |
| `tests/lint/envoyKindPools.walker.test.js:55` | `The messenger has no new vote…` | a different pool family's AUTHORED roster |
| `tests/ui/warRemembranceReader.test.jsx:136` | `What the realm has lost` | a UI HEADING used as an `expectAbsentWithAnchor` anchor; not corpus prose |

The last is why the EXACT-ZERO rule names SIX FILES rather than the whole of `tests/ui`: a false
positive is kept in the ledger with its reason rather than special-cased into invisibility.

### THE THREE PLANTS — each executed, each restored, each printed

**(a) DRAW-IMMUNITY — the property the whole car exists to buy.** `drawVariant`'s parent key in
`stateProseKernel.js` perturbed to `` `${seed}::${blockId}::${poolKey}::plant` ``, which re-rolls
every state pool the index-stable draw touches.

    the plant is LIVE, measured not assumed:  14 of 34 converted anchors MOVED under it
    tests/ui/generalDeskTabFlow + economicsTabFlow      Tests 37 passed (37)     exit 0
    tests/domain/generalStateProseDesk + warFaithDesk   Tests 97 passed (97)     exit 0
    restored:  git show HEAD:src/domain/display/stateProse/stateProseKernel.js > <path>
               git diff --stat HEAD -- src   EMPTY

Before this car those same 37 tests carried sixteen literal pins and would have gone red.

**(b) LIVENESS — the converted anchors can still fail, and they fail BY NAME.** The paid-surface
gate forced in `generalDeskRead.js` (`const publicDossier = true;`) and in `economyDeskRead.js`
(the SILENT desk returned unconditionally), so the private render draws nothing while the corpus
is untouched.

    Test Files  2 failed (2) · Tests  17 failed | 20 passed (37)
    every failure a LIVENESS ANCHOR naming its block and position, e.g.
      LIVENESS ANCHOR [the general desk at DS-GEN-12 the ground (overview.ground)]: the
      before-collection must already contain the member the operation is supposed to remove.
    and the COLLECTED loops printed the true counts rather than the first casualty:
      7 of 7 · 4 of 4 · 3 of 3 · 4 of 4
    restored the same way; git diff --stat HEAD -- src   EMPTY

**(c) THE WALKER'S OWN PLANT.** A literal anchor authored the old way —
`const PLANTED_ANCHOR = 'Steinmark is administered, visibly: rules here have rooms';` — appended
to `tests/ui/generalDeskTabFlow.test.js`, one of the six cured files.

    × no NEW file carries a literal state-prose anchor, and no frozen row grows
        + "tests/ui/generalDeskTabFlow.test.js: 1 (frozen none)"
    × ⛔ the six files car 8a-13 cured are held at EXACT ZERO
        A literal state-prose anchor has re-entered a cured family.
        + "tests/ui/generalDeskTabFlow.test.js"
    Tests  2 failed | 4 passed (6)
    restored by inverse copy, cmp-identical, md5 e05969dc60f8a3c612aa73bab4851368 before and after

### THE FOUR GATES THE NEW FILES TRIPPED, EACH CURED AT CAUSE

`tests/lint` whole went red in four places on the first run, all of them this car's, and none of
them the walker's own subject — which is itself the acceptance-gap hazard working correctly:

1. **`goldenFreeze.walker`** — `UPDATE_DRAWN_ANCHOR_ALLOWLIST` is a golden-adjacent env spelling
   nobody had enrolled. Written as an EXCLUSION in `tests/fixtures/.golden-freeze-register.json`
   (a shrink-only test-corpus inventory, the sibling of `UPDATE_EPISTEMIC_ALLOWLIST`; not a
   world fingerprint).
2. **`mutationCoverageManifest`** — the new walker had no entry. A `kind: "rationale"` entry
   landed carrying the three plants above verbatim, on the standing ground that
   `mutation-sweep.sh` reverts with `git checkout --`, which this program's shared tree forbids.
3. **`negativeAssertionAnchor.walker`** — the two `not.toMatch` in the new `{calamity}` arm were
   un-anchored. `// anchored:` markers added on the assertions' own lines, naming
   `poolMemberTexts`'s refusal-to-return-empty and the `CALAMITY` fill assertion as the liveness.
4. **`sovereigntyLightingContract.walker`** — the census moved. Refrozen by its own ritual in a
   SECOND commit, because the ritual refuses a dirty tree by design.

⚠ **ONE JSON HAZARD, RECORDED.** A `json.load`/`json.dumps` round-trip of either register
rewrites the whole file: `ensure_ascii=True` escapes every `—` and `§` (29 insertions / 22
deletions on a one-row append), and `ensure_ascii=False` un-escapes the ones already stored
escaped (40 / 35). Both were caught by reading the diff, reverted with
`git show HEAD:<path> > <path>`, and replaced by a surgical text insertion — final diffs
**+7 lines** and **+5 lines**, insertions only.

### THE LIGHTING REFREEZE (commit 2, `cc22f1d72`)

    census REFROZEN at cea20ddb30d9359ec72f579ccd87dd171758737e by REWRITE car 8a-13:
      files 2562 -> 2563 · parked 375 -> 375 · credited 2187 -> 2188
      titles 24163 -> 24169 · suiteTitles 6451 -> 6452
    plain re-run without LIGHTING_CENSUS_REFREEZE:  34 passed   <- the receipt

Two files land and only ONE is a test file: the walker carries six titles under one describe,
which is the whole of the title movement. `drawnProse.js` is a pure helper and is uncredited by
construction. The four converted suites gained no titles and lost none — the car replaced
literal anchors with computed ones INSIDE existing arms, which is why `files` moves by one while
`titles` moves by exactly six. Of the three rituals ONE was owed: the wiring census and the OSR
read CURRENT at this tree (no `src/` byte and no stamped file moved), and a ritual with nothing
to record is not run.

### ACCEPTANCE — every figure from a command that was run, with its exit

| gate | command | result | exit |
|---|---|---|---|
| **`tests/ui` WHOLE** | `sh scripts/gate-mutex.sh --run -- npx vitest run tests/ui` | **Test Files 157 passed (157) · Tests 989 passed (989)** | **0** |
| **`tests/lint` WHOLE** | `sh scripts/gate-mutex.sh --run -- npx vitest run tests/lint` | **Test Files 155 passed (155) · Tests 2,599 passed (2,599)** | **0** |
| the four desk suites | `npx vitest run <the four, one call>` | **Test Files 4 passed · Tests 247 passed (247)** | **0** |
| ″ focused, one at a time | defense · economy · general · warFaith | 91 · 59 · 69 · 28 passed | **0** each |
| the two cured UI files | `npx vitest run <each>` | **24 passed (24)** · **13 passed (13)** | **0** |
| the new walker | `npx vitest run tests/lint/proseDrawnAnchors.walker.test.js` | **6 passed (6)** | **0** |
| the projection contract | `npx vitest run tests/data/dossierStateProseProjection.contract.test.js` | **77 passed (77)** | **0** |
| strict domain | `node scripts/check-domain-strict.mjs` | `✓ no strict-type regressions (1120 errors, ceiling 1120)` | **0** |
| typecheck ratchet | `npm run typecheck:ratchet` | `OK — no type regressions (173 error(s), ceiling 173)` | **0** |
| the projector | `node scripts/generate-dossier-state-prose.mjs --check` | 68 state blocks / 2,266 variants verified | **0** |
| eslint | `npx eslint <the six touched/new files>` | no output | **0** |
| ⛔ ZERO `src/` BYTES | `git diff --stat 188010225..HEAD -- src` | **prints nothing** | — |
| runner count | own one-line shell, before every vitest | **0** every time | — |
| machine load | `ps -r` before each whole run | one `/bin/zsh` at 0.0 % — no system process to make a run vacuous | — |

**THE ONE RED, INHERITED AND UNCHANGED.** `npx vitest run tests/copy/voiceMechanics.test.js`
exits 1 at its inherited two files exactly, byte-identical to the §917 tip:

    src/domain/display/labelBands.js: baseline em:0 bang:0 → current em:5 bang:0
    src/domain/display/stateProse/generalStateProse.js: baseline em:0 bang:0 → current em:3 bang:0

Tests 1 failed | 18 passed (19). Neither file is touched by this car (the whole diff is nine
test-side files), so this is the banked E2 ratchet and not this car's.

### FINDINGS FOR THE FOLD AND THE §919 ROW

1. ⛔ **8a-12'S LEDGER MISDESCRIBES THE FOUR DESK SUITES, AND THE CORRECTION MATTERS FOR 8b.**
   Its rows say "a real seeded draw" for general (3 pins), defense (3) and warFaith (3) — nine
   "live seeded pins", which ADDENDUM 5 inherits. Read one by one at this tip, **only TWO of the
   twelve desk-suite pins are assertions at all**: `generalStateProseDesk:1430` and
   `warFaithStateProseDesk:421-422`. The other ten are CORPUS SENTENCES QUOTED IN COMMENTS —
   documentation of why a fill or a pool key is what it is. 8a-12's matcher scanned quoted runs
   without a comment tokenizer; this car's walker strips comments, which is why its scan of the
   same corpus is narrower and truer. **The four desk suites were never the standing risk the
   ledger implied; the two `tests/ui` flow suites were, and are now cured.**
2. ⚠ **THE STANDING SIX-FILE GATE 8a-12 RECOMMENDED IS NO LONGER OWED FOR THIS CLASS.** Its
   finding 2 proposed naming the four desk suites plus the two UI suites as a gate after any
   draw-touching commit. Plant (a) is the evidence that the class is closed instead: those same
   six files stay green under a draw rule that moves 14 of 34 anchors. A gate would still catch
   OTHER regressions in them; it is no longer the guard against re-index breakage.
3. ⚠ **THE WALKER IS A DETECTOR, NOT A PROOF OF ABSENCE.** Its two recall limits (an under-floor
   fixed run; a pin split across `+`) are real and stated in its header. `PATRON_LINE` was a
   genuine pin it cannot see, cured here only because it sat in a file this car converted whole.
   The ledger is a CEILING on what is tolerated, offered beside the executed whole-directory
   proofs rather than instead of them.
4. ⚠ **THE HELPER'S COST IS AN IMPORT OF ALL SIX LEAVES (884 KB of generated JS) IN ANY FILE
   THAT USES IT.** In `tests/lint` the walker's first cold run took ~21 s of import time against
   ~2 s warm. It is test-side only and reaches no bundle — `drawnProse.js` is a test helper and
   the walker imports `STATE_LEAVES` from it rather than re-reading the leaves — but a future car
   that spreads the helper across many small suites should expect the transform cost, not be
   surprised by it.
5. ⚠ **`variantByVid` SHIPS UNUSED BY THE PRODUCT ARMS AND THAT IS DELIBERATE, NOT DEAD CODE.**
   The two "specific variant" arms ADDENDUM 5 named were both better served by the WHOLE-POOL
   roster (`poolMemberTexts`), which is strictly stronger under NEVER TRIM: naming one vid would
   have re-introduced the brittleness one layer down. `variantByVid` is kept because the shape
   ADDENDUM 5 describes will be wanted the first time an arm is genuinely about one wording. ⚠ IT
   IS CALLED BY NOTHING IN THE TREE TODAY — stated plainly rather than dressed up: it is an
   export with no consumer, and a chair who would rather it were removed can have it removed in
   a line.


---

## CAR 8b-W — THE DEFENSE DESK'S WIRING

**STATUS: LANDED at `290f86ee0`, seven commits over `f73bdbf16`.** Seat: Opus 5 — Fable-unvalidated. Chair: Fable 5.1 (session
67af10e4). Dock `$SC/laneRW-DEFW`, base `f73bdbf16` (the §919 CAS). Chartered by ADDENDUM 4 of
`brief-REWRITE-car8b-defense.md`; the shape is SEAM car 3h's (the key table exposed, key identity
proven over the 768 RATE towns, the 1,050 DRIFT rows and an exhaustive input sweep, zero drift on
the manifest classifier, the census re-taken by the census rule). Every figure below is the tail
of a command that ran.

### 8b-W.0 ARRIVAL — executed

```
$ git -C $SC/laneRW-DEFW rev-parse HEAD
f73bdbf16d3f7a57c18d7fd57b0478b953043a73
$ git -C $SC/laneRW-DEFW status --porcelain | wc -l
       0
$ V=vit; V2=est; pgrep -fl "$V$V2" | grep -v gate-mutex | wc -l
       0
$ ps -r -o pid,pcpu,comm | head          # the machine idle: one zsh at 0.0 %
```

### 8b-W.1 THE CONSIST — SEVEN COMMITS, FOUR BLOCKS, THREE REGISTER ACTS

| # | sha | what | pools RESOLVED |
|---|---|---|---|
| 8b-W-1 | `00041fadd` | DS-DEF-1 wired — `READINESS_ROW_POOL` | **4** |
| 8b-W-2 | `ef05978ab` | DS-DEF-3 wired — `PUBLIC_ORDER_ROW_POOL` + `FIRST_SURVEY_ROW_POOL` | **7** |
| 8b-W-3 | `677e8b12a` | DS-DEF-4 wired — `CRIMINAL_CAPTURE_POOL` | **5** |
| 8b-W-4 | `41f7a5b6b` | DS-DEF-6 wired — `SUPPLY_LOGISTICS_ROW_POOL` | **5** |
| register 1 | `2bdf2eefb` | the wiring census re-taken; the two projected leaves regenerated; the walker's declared rows | 22 rows moved |
| register 2 | `c3bd63354` | the observed-shape inventory re-frozen on its drifted input (shrink-only) | — |
| register 3 | `290f86ee0` | the prose byte ratchet's declared row for the regenerated leaf | — |

### 8b-W.2 ⭐⭐ THE DEBT, ANSWERED BLOCK BY BLOCK — 21 of the 62, AND THE OTHER 41 NAMED

`node scripts/wiring-census.mjs` at the tip against `git show f73bdbf16:docs/content/wiring-census.json`:

| block | pools | RESOLVED before | after | UNRESOLVED after | why the rest stay |
|---|---|---|---|---|---|
| DS-DEF-1 | 8 | 4 | **8** | **0** | — |
| DS-DEF-3 | 7 | 0 | **7** | **0** | — |
| DS-DEF-4 | 9 | 4 | **9** | **0** | — |
| DS-DEF-6 | 21 | 3 | **8** | **13** | all thirteen are `DEF6_C3_BLOCKED_POOLS`, BLOCKED by ruling — no key function produces them, so no table can reach them |
| DS-DEF-7 | 11 | 0 | 0 | **11** | the block is UNMOUNTED (`dossierMounts.UNMOUNTED_BLOCKS`): no composer reads it, so no predicate selects any pool of it |
| DS-DEF-8 | 4 | 3 | 3 | **1** | `multiple stresses, one posture shown` is `DEF8_UNREACHABLE_POOLS` — DECLARED DARK because it asserts a ranking nothing computes |
| DS-DEF-10 | 21 | 0 | 0 | **21** | UNMOUNTED, as DS-DEF-7 |

⛔ **THE 41 THAT REMAIN ARE NOT WIRING DEBT AND A SECOND WIRING CAR WOULD NOT MOVE ONE OF THEM.**
32 of them (DS-DEF-7's eleven, DS-DEF-10's twenty-one) are in UNMOUNTED blocks: there is no
composer to expose a table FROM, so the act that lights them is the RESERVOIR act or a new
dossier surface, both of which move rendered bytes and are the chair's. 13 are C3-blocked by a
landed ruling and one is declared dark. Wiring around any of them would be answering a finding
with the wrong cure. Every one is printed above with its own `reason` from the census.

⭐ THE SIZING SEAM CAR 3h HANDED THE CHAIR HELD EXACTLY. §3h.9 warned that a per-block count
overstates reachable work and that DS-DEF-6 reaches five pools, not eighteen. Measured here: five.

### 8b-W.3 ⭐⭐ THE ACCEPTANCE — KEY IDENTITY, EXECUTED THREE WAYS

The A/B harness (`$SC/rw8bw-keyab.mjs`) and the BASE CONTROL (`$SC/rw8bw-basecontrol.mjs`, which
imports the desk AT `f73bdbf16` beside the desk at the tip and sweeps both) are lane instruments,
never committed.

```
$ node $SC/rw8bw-keyab.mjs $SC/rw8bw-before.json     # at f73bdbf16, before any edit
[key-ab] exhaustive 1915 · RATE towns 768 (threw 0) · DRIFT rows 1050 (threw 0) · 23s
$ node $SC/rw8bw-keyab.mjs $SC/rw8bw-tip.json       # at 290f86ee0
[key-ab] exhaustive 1915 · RATE towns 768 (threw 0) · DRIFT rows 1050 (threw 0) · 19s
$ node $SC/rw8bw-abdiff.mjs $SC/rw8bw-before.json $SC/rw8bw-tip.json
FINAL A/B — exhaustive rows differing 2 of 1915
FINAL A/B — RATE keys rows differing 0 of 768
FINAL A/B — RATE desk-output rows differing 0 of 768
FINAL A/B — DRIFT keys rows differing 0 of 1050
FINAL A/B — DRIFT desk-output rows differing 0 of 1050
$ node $SC/rw8bw-basecontrol.mjs
[base-control] f73bdbf16 vs the working tree — 2179 inputs swept, 8 differ
```

| corpus | rows | key tuples differing | desk-output digests differing |
|---|---|---|---|
| RATE (768 towns through `generateSettlementPipeline`) | 768 | **0** | **0** |
| DRIFT (525 configurations × 2 audiences) | **1,050** | **0** | **0** |
| EXHAUSTIVE sweep of the five key functions' own domains | 1,915 / 2,179 | **2 / 8, DECLARED** | n/a |

Four of the five digests are byte-equal across the pair (RATE keys `60a319aaae91a43a`, DRIFT keys
`4772fdd350302253`, RATE desk-output `e1ed0d7bc0cd683f`, DRIFT desk-output `f061441e0c07dda3`).
The exhaustive digest moved, `733665fb96d9d733` → `e8093d4f8d1a0594`, and the eight rows behind it
are enumerated below rather than summarised.

### 8b-W.4 ⛔⛔ THE ONE DECLARED NARROWING — EIGHT INPUTS, ALL OF THEM DS-DEF-3's, ALL UNREACHABLE

`publicOrderPoolKey`'s roster was `CORPUS['DS-DEF-3'].pools[label]`, and a plain object answers
that question for strings nobody meant it to. The table is the roster now, read as a string or
not at all, so eight inputs that returned a pool key return SILENCE:

```
BASE: publicOrder|COMPOUND override (a crisis stress has rewritten the label)|COMPOUND override (…)
 TIP: publicOrder|COMPOUND override (a crisis stress has rewritten the label)|null
BASE: publicOrder|First-Survey qualification (the reading is a first look)|First-Survey qualification (…)
 TIP: publicOrder|First-Survey qualification (the reading is a first look)|null
BASE: publicOrder|constructor|constructor          TIP: null
BASE: publicOrder|toString|toString                TIP: null
BASE: publicOrder|__proto__|__proto__              TIP: null
BASE: publicOrder|hasOwnProperty|hasOwnProperty    TIP: null
BASE: publicOrder|valueOf|valueOf                  TIP: null
BASE: publicOrder|isPrototypeOf|isPrototypeOf      TIP: null
```

⭐ **IT IS A STRICT IMPROVEMENT AND IT IS UNREACHABLE, AND BOTH HALVES ARE MEASURED.** On the
first two the shipped desk routed the public-order BANNER to a framing pool or to the compound
pool's own name; on the other six it routed it to a pool named for the inheritance chain. All
eight are nonsense output, and none can be produced: over the 768 towns of the RATE corpus
`safetyProfile.js` writes **30 distinct labels** (`Moderate` 509, `Dangerous` 24, `Dangerous —
Famine Conditions` 20, …) and not one is a member of the eight. Both corpora read 0 differing.
Pinned by an arm in the desk suite so the narrowing cannot be quietly reversed OR quietly widened.
**Veto shape:** carry all seven corpus pool keys in the table and accept a predicate that says the
banner fires when the label IS the pool's own name, if bit-identity on unreachable inputs is worth
more than a predicate that is true.

The other four key functions are IDENTICAL on every input of the sweep, `constructor` and
`__proto__` included: `posturePoolKey` and `supplyLogisticsPoolKey` guard before they look up,
and `criminalCapturePoolKey`'s old `Array.includes` roster and its new table agree everywhere.

### 8b-W.5 ⭐⭐ ZERO RENDERED BYTES — THE CLASSIFIER, END TO END

```
$ node scripts/prose-manifest-cells.mjs --out $SC/rw8bw-cells-base.json      # at f73bdbf16
  towns 525 · rows 1050 · cells 73284 · 10 s
$ node scripts/prose-manifest-cells.mjs --out $SC/rw8bw-cells-final.json    # at 290f86ee0
  towns 525 · rows 1050 · cells 73284 · 9 s
$ node scripts/prose-manifest-diff.mjs $SC/rw8bw-cells-base.json $SC/rw8bw-cells-final.json
PROSE MANIFEST DIFF · 73284 cells on the tip side
  REPLACED 0 · RE-INDEXED 0 · ADDITIVE 0 · WORDING-ONLY 0
  UNCHANGED cells 73284 · towns 525 · ADDED 0 · REMOVED 0
  (of the UNCHANGED, cells whose audience-filtered INDEX moved: 0)
```

**UNCHANGED 73,284 of 73,284, which is the acceptance figure ADDENDUM 4 names.** Not one cell of
525 towns × 2 audiences moved across seven commits.

⚠ **TWO PROJECTED LEAVES DID MOVE, AND THE DIFFERENCE IS THE POINT.** `poolMeta.readsCount` is
projected FROM the census, so re-taking the census obliges the projector to write one line per
newly RESOLVED pool — SEAM car 3h owed no such regeneration only because `poolMeta` landed after
it, at car 4. Classified line by line, every changed line of both leaves is a `readsCount` line:

```
$ git diff -U0 -- src/data/ | <strip markers, classify by JSON key> | sort | uniq -c
  23 KEY:readsCount
```

21 added in `defense.generated.js` (each newly RESOLVED pool, `readsCount: 1`) and one CHANGED in
`general.generated.js` (`DS-GEN-6 :: isolated`, 3 → 1). No `text`, no `vid`, no `angle`, no
`marks`, no `slots`.

### 8b-W.6 ⭐⭐ THE TWENTY-SECOND ROW: A FALSE ATTRIBUTION CURED, WITH ITS NEGATIVE CONTROL

The census re-take moved 22 rows and only 21 are the four blocks'. The twenty-second is
`DS-GEN-6 :: isolated`, and it is a CURE this car did not set out to make:

```
SAME-STATUS MOVE: DS-GEN-6 :: isolated | rung literal -> table
  kf supplyLogisticsPoolKey -> ORIGIN_POOL_OF_ROUTE | k 0 -> 2
  reads ["granary","port","settlement.config.tradeRouteAccess"]
     -> ["text(tradeRouteAccess) (via ORIGIN_POOL_OF_ROUTE in generalStateProse.js)"]
```

⛔ **THE MECHANISM, WHICH IS A CLASS AND NOT AN ACCIDENT.** The register's rung-1 reader takes
every STRING LITERAL in a key function's body as a candidate key, and a COMPARISON VALUE is a
string literal. The defence desk's `supplyLogisticsPoolKey` compared `access === 'isolated'`, and
`isolated` is also the NAME of a DS-GEN-6 pool — so a general-desk pool resolved against a
defence-desk function and carried THREE of that function's parameter names as its read set, at
k = 0. Tabling the function moved that comparison into a helper the reader does not scan, and the
row now resolves through its own desk's `ORIGIN_POOL_OF_ROUTE`.

**EXECUTED, WITH THE NEGATIVE CONTROL THAT MAKES IT A FINDING** (`$SC/rw8bw-crossdesk.mjs`, which
maps every key function and module table to its composer and asks which RESOLVED rows are keyed by
another desk's):

```
$ node $SC/rw8bw-crossdesk.mjs $SC/laneRW-DEFW /tmp/base-census.json   # the census AT f73bdbf16
[cross-desk] RESOLVED rows attributed to a key function of ANOTHER desk: 1
    DS-GEN-6 :: isolated — rung literal, keyed by supplyLogisticsPoolKey in defenseStateProse.js
      reads ["granary","port","settlement.config.tradeRouteAccess"]
$ node $SC/rw8bw-crossdesk.mjs $SC/laneRW-DEFW                          # the census at the tip
[cross-desk] RESOLVED rows attributed to a key function of ANOTHER desk: 0
```

⭐ **FOR THE CHAIR: THE CLASS IS EMPTY TODAY AND NOTHING PREVENTS IT REFILLING.** Any key function
whose branch compares against a bare word that some other block also uses as a pool name mints the
same false row, and it looks exactly like a resolution. The honest cure is the register's, not a
desk's: rung 1 should take a literal only where it is RETURNED, not merely present in the body.
Recorded, not cured — it is a change to the ladder and it belongs to the module's own car.

### 8b-W.7 THE DECLARED ROWS UPDATED IN THE WALKER — thirty figures, each with its ground

`tests/lint/proseWiringCensus.walker.test.js` reads **78 passed** after; the desk suite **91
passed**; the projection contract **77 passed**. No test title and no `describe` was added or
removed — proved by count rather than by the green:

```
tests/domain/defenseStateProseDesk.test.js          base=109  tip=109
tests/lint/proseWiringCensus.walker.test.js         base=95   tip=95
tests/data/dossierStateProseProjection.contract.test.js  base=88  tip=88
```

so **the lighting census does not move and no refreeze is owed** (`sovereigntyLightingContract.walker.test.js`
34 passed).

| assertion | before | after | why |
|---|---|---|---|
| `summary.resolved` / `unresolved` | 340 / 368 | **361 / 347** | the 21 |
| `resolvedWithPredicate` / `…Clean` | 207 / 207 | **229 / 229** | the 21 plus DS-GEN-6's cure |
| `syntheticTableFields`, `tableRungRowsWithoutAbsence` | 100 | **122** | the same 22 table labels |
| `census.tables` | 33 | **38** | the five new tables |
| `factIndex.length` | 63 | **68** | one synthetic label per new table |
| `branchGrainRows` / `functionGrainRows` | 309 / 399 | **330 / 378** | a table row's field IS its branch |
| `absent.measured`, and the four-label partition | 370, 451 | **367, 448** | DS-GEN-6 gave back three false measured paths |
| `attachCoverage.length` | 50 | **51** | DS-DEF-3 had no RESOLVED spine and now has seven |
| `dark.length` / `grains.function.cannotAttach` | 21 / 25 | **20 / 24** | DS-DEF-6 leaves both: a second read set on the block |
| `budget.zeroK`, `grains.branch.zeroK` / `function.zeroK` | 49, 49 / 121 | **48, 48 / 120** | DS-GEN-6 alone; all 21 new rows land at k = 2 |
| `budget.executable` / `notExecutable` / histogram sum | 340 / 368 / 340 | **361 / 347 / 361** | the 21 |
| `custom.rows.length` and `byKind` | 21; services 6, resources 6, institutions 5, tradeGoods 2 | **25**; **7, 7, 6, 3** | four newly RESOLVED predicates a custom definition can reach |
| `join.deskRoots` | 89 | **94** | five more roots no relation endpoint can meet |
| `join.leafEither` | 2 | **3** | see below |
| `draft.syntheticRootsExcluded` | 19 | **24** | the same five, excluded by name |
| holders `fields` SOURCE-UNRESOLVED, total, `rowsWithNoReading` | 415, 611, 368 | **444, 640, 347** | +31 −2: the holder reader lifts the ARGUMENT NAMES out of each rung-3 label (one each for DEF-1/-3/-4, THREE for DEF-6's three-parameter reader); DS-GEN-6 gives two back. Not one field changed STANDING |
| the projection contract's `readsCount` split | 340 / 368 | **361 / 347** | it IS the census's split |

⭐ **`leafEither` 2 → 3 IS WORTH ITS OWN LINE, BECAUSE IT SHOWS WHAT A TABLE RUNG BUYS AND WHAT IT
DOES NOT.** The third row is `signal:captureState -> cause:captured`. Rung 3's label carries the
key function's own PARAMETER NAME inside it (`text(captureState) (via …)`) and the LEAF normaliser
splits the label into segments, so the relation endpoint now touches a desk read. DS-DEF-4's
capture pools really are about that signal, so the touch is true rather than an artefact — but
`strictEither` is still **0**, because the STRICT join reads the label's ROOT, which is the label.
A wiring car buys the leaf-level reach and does not buy the strict one. **THE FINDING "NOT ONE
RELATION ROW JOINS TWO FIELDS A DESK READS" IS UNMOVED.**

### 8b-W.8 THE LICENCE CARDS — one newly resolved pool per block, and a defect in the card

Each of the four prints a `predicate` line and a `may claim` line, which is ADDENDUM 4's test:

```
$ node scripts/prose-licence-card.mjs DS-DEF-1 'readiness STRONG'
  predicate:  scoreBand(readinessScore) (via READINESS_ROW_POOL in defenseStateProse.js) === STRONG
$ node scripts/prose-licence-card.mjs DS-DEF-3 'Very Safe'
  predicate:  publicOrderSituation(safetyLabel) (via PUBLIC_ORDER_ROW_POOL in defenseStateProse.js) === Very Safe
$ node scripts/prose-licence-card.mjs DS-DEF-4 'capture equilibrium'
  predicate:  text(captureState) (via CRIMINAL_CAPTURE_POOL in defenseStateProse.js) === equilibrium
$ node scripts/prose-licence-card.mjs DS-DEF-6 'Logistics & Supply: Granary + port'
  predicate:  supplyLogisticsSituation(granary, port, access) (via SUPPLY_LOGISTICS_ROW_POOL in defenseStateProse.js) === granary, port
```

⛔⛔ **AND EVERY ONE OF THEM SAYS THIS, WHICH THE SECOND WRITING PASS WILL READ:**

```
  may claim:  that `js)` (=== STRONG) holds, as a STANDING fact of the record
```

The card's `may claim` line names the read's LAST DOT-SEGMENT, and a rung-3 label ends in
`defenseStateProse.js)`. ⭐ **INHERITED, NOT INTRODUCED — MEASURED WITH A CONTROL.** The same
command run against the census AT `f73bdbf16`, for a pool the base ALSO carried on the table rung,
prints the identical line:

```
$ node scripts/prose-licence-card.mjs DS-DEF-1 'terrain FAVOURABLE to the defender'   # tip
  may claim:  that `js)` (=== Mountain) holds, as a STANDING fact of the record
$ <the same, with docs/content/wiring-census.json restored to f73bdbf16>              # base
  may claim:  that `js)` (=== Mountain) holds, as a STANDING fact of the record
```

⚠ **WHAT THIS CAR CHANGES IS ITS BLAST RADIUS: 33 tables to 38, and the 21 pools whose writers
will read these cards next.** The cure is one expression in `scripts/lib/prose-licence-card.mjs`:
a rung-3 read is a synthetic label, so the card should print its READER (`scoreBand(readinessScore)`)
and never the last segment of a file name. NOT CURED HERE — it is the licence-card instrument,
owned by `tests/lint/proseLicenceCard.walker.test.js`, and a wiring car that quietly widened its
own scope is the harder thing to review (SEAM car 3h's own rule about `supplyLogisticsPoolKey`).
⭐ It should land BEFORE the seven blocks' second writing pass.

### 8b-W.9 THE GATES AT THE TIP — every acceptance figure ADDENDUM 4 names

```
$ sh scripts/gate-mutex.sh --run -- npx vitest run tests/lint                         ; exit=0
 Test Files  155 passed (155)          Tests  2599 passed (2599)

$ sh scripts/gate-mutex.sh --run -- npx vitest run tests/ui                           ; exit=0
 Test Files  157 passed (157)          Tests  989 passed (989)

$ npx vitest run tests/copy/voiceMechanics.test.js                                    ; exit=1
src/domain/display/labelBands.js: baseline em:0 bang:0 → current em:5 bang:0
src/domain/display/stateProse/generalStateProse.js: baseline em:0 bang:0 → current em:3 bang:0
      Tests  1 failed | 18 passed (19)      # THE INHERITED TWO FILES, and nothing added

$ npx vitest run tests/data/dossierStateProseProjection.contract.test.js              ; exit=0
      Tests  77 passed (77)
$ npx vitest run tests/lint/proseWiringCensus.walker.test.js                          ; exit=0
      Tests  78 passed (78)
$ npx vitest run tests/domain/defenseStateProseDesk.test.js                           ; exit=0
      Tests  91 passed (91)
$ npx vitest run tests/property/dossierProseManifest.test.js                           ; exit=0
      Tests  15 passed (15)

$ node scripts/check-domain-strict.mjs                                                ; exit=0
[domain-strict] ✓ no strict-type regressions (1120 errors, ceiling 1120).
$ node scripts/check-full-typecheck.mjs                                               ; exit=0
[typecheck-ratchet] OK — no type regressions (173 error(s), ceiling 173).
$ node scripts/check-observed-shape-readers.mjs                                       ; exit=0
observed-shape readers: 1972 finding(s), exactly matching the frozen inventory.
$ node scripts/wiring-census.mjs --check                                              ; exit=0
[wiring-census] verified 708 pools / 2266 variants / 165 relation rows against 7 stamped files
$ node scripts/generate-dossier-state-prose.mjs --check                               ; exit=0
[dossier-prose] verified 68 state blocks / 2266 variants across 6 desks, 78 causal families
$ npx eslint <the desk, the three test files>                                         ; exit=0
✖ 1 problem (0 errors, 1 warning)   # 'MONSTER_THREAT_TIERS' unused — pre-existing, unmoved
$ node <espree literal probe>  base vs tip
/tmp/base-desk.js  literals 240 em 0 bang 0 digit 21 digit-that-is-not-a-block-id 0
the tip           literals 268 em 0 bang 0 digit 19 digit-that-is-not-a-block-id 0
```

⭐ **THE STRICT RATCHET SITS EXACTLY ON ITS CEILING, 1120 / 1120** — five frozen tables and three
readers added ZERO strict-type errors. **THE BYTE RATCHET:** the desk is **576 effective lines
against the 800 ceiling** (headroom 224), raw 1,798 → 1,949.

### 8b-W.10 ⛔ THE FOURTH REGISTER DOOR THE CHARTER DID NOT NAME, AND WHY IT WAS OPENED

`tests/lint` red on `proseCorpusBytes.test.js` after the register commit:

```
src/data/dossierStateProse/defense.generated.js: grew to 155118 raw bytes, over the committed
154593. Append a declared row to scripts/.prose-byte-baseline.json naming the car and the delta,
and move this number onto 155118.
```

ADDENDUM 4 names three register doors (the census re-take, the lighting census, OSR shrink-only)
and the byte ratchet is not among them — but the growth is FORCED by a door that IS named, and the
ratchet's own message names the act. **+525 bytes is 21 `readsCount` lines at exactly 25 bytes
each**, which the arithmetic confirms to the byte. It was declared through the ratchet's own
GROWTH door (car, leaf, fromRaw, toRaw, gzipAfter, reason) and never by widening a ceiling: the
leaf sits at 155,118 of its 488,168, and gzip is 23,039 before and after — a metadata line
repeated twenty-one times compresses to nothing. `general.generated.js` needs no row: its one
changed line is the same length and its gzip moved 2 bytes inside the arm's own 1 % band.
**Recorded as a judgment call for veto: a chair who reads the byte ratchet as owner-gated should
strike this commit and re-cut it.**

### 8b-W.11 THE JUDGMENT CALLS, EACH RECORDED FOR VETO

1. **The DS-DEF-3 narrowing** (§8b-W.4) — eight unreachable inputs go from a nonsense pool key to
   silence. Measured, enumerated, pinned by an arm; veto shape stated.
2. **Every table is module-PRIVATE**, forced by the projection contract's exported-string-map
   guard (`tests/data/dossierStateProseProjection.contract.test.js:603`), which refuses an exported
   string map `SLOT_FILL_TABLES` does not name — SEAM car 3h's judgment 2, unchanged. The exported
   `CRIMINAL_CAPTURE_STATES` roster is an ARRAY and is derived from its table rather than spelled a
   second time, on `RECOGNISED_CRIMINAL_STRUCTURES`' precedent.
3. **The lookup is read as a STRING or not at all** (`typeof pool === 'string'`), which closes the
   `Object.prototype` half of the narrowing at cause. ⚠ `TERRAIN_DEFENCE_OF` and `TERRAIN_PRIZE_OF`
   still index a free-form producer word WITHOUT that guard and are named in the code rather than
   swept up: they are a different row of DS-DEF-1 and this car did not touch their function.
4. **The situation tokens are English phrases, not encoded triples** — SEAM car 3h's judgment 5,
   applied to `publicOrderSituation`, `firstSurveySituation` and `supplyLogisticsSituation`.
5. **The byte ratchet's declared row** (§8b-W.10).
6. **The licence card's `js)` leaf is recorded and not cured** (§8b-W.8), and it is the one item
   here that should land before the second writing pass.
7. **No new test title anywhere**, so the lighting census is untouched and no refreeze commit is
   owed. Every new assertion is folded into an arm that already existed.
8. **DS-DEF-2's exposure docblock was CORRECTED rather than left to decay**: it said
   `supplyLogisticsPoolKey` was waiting for its own car, and the car has landed.

### 8b-W.12 RETROVALIDATION ROW (for the Fable chair)

| what was judged | what the chair must re-derive | receipts | priority |
|---|---|---|---|
| The DS-DEF-3 narrowing, 8 inputs | that all eight are unreachable, and that silence beats a nonsense pool key | §8b-W.4 | ⭐⭐ the only behaviour change in the car |
| The byte ratchet's declared row | that a door forced by a named door may be opened by the lane | §8b-W.10 | ⭐⭐ a register act the charter did not name |
| The licence card's `may claim: that \`js)\`` | whether it lands before the second writing pass, and whose car it is | §8b-W.8 | ⭐⭐ every 8b writer of these 62 pools reads it |
| DS-GEN-6's false attribution cured, and the class refilling | that rung 1 taking a comparison literal as a key is the register's cure, not a desk's | §8b-W.6 | ⭐⭐ a resolution that looked exactly like evidence |
| `leafEither` 2 → 3 | that the third touch is true and that `strictEither` 0 keeps the finding | §8b-W.7 | ⭐ |
| holders `fields` 415 → 444 | that lifting parameter names out of a rung-3 label is the reader working | §8b-W.7 | ⭐ |
| The 41 pools left UNRESOLVED | that 32 UNMOUNTED + 13 C3-blocked + 1 declared dark is not wiring debt | §8b-W.2 | ⭐ sizing the second writing pass |

### 8b-W.13 THE TIP, AND THE COMMANDS THAT RECOMPUTE THIS CAR

```
node $SC/rw8bw-basecontrol.mjs                               # the base control, at any sha
node $SC/rw8bw-keyab.mjs <out.json>                          # the A/B over both corpora
node scripts/prose-manifest-cells.mjs --out <f> && node scripts/prose-manifest-diff.mjs <base> <f>
npx vitest run tests/lint                                    # 155 / 155, 2599 / 2599
npx vitest run tests/ui                                      # 157 / 157, 989 / 989
node scripts/wiring-census.mjs --check                       # the door is closed
node scripts/check-domain-strict.mjs                         # 1120 / 1120
```

```
$ git -C $SC/laneRW-DEFW log --oneline f73bdbf16..HEAD
290f86ee0 Register (REWRITE 8b-W): the prose byte ratchet's declared row for the regenerated leaf
c3bd63354 Register (REWRITE 8b-W): the observed-shape inventory re-frozen on its drifted input
2bdf2eefb Register (REWRITE 8b-W): the wiring census re-taken — 22 rows moved, RESOLVED 340 to 361
41f7a5b6b REWRITE car 8b-W-4: DS-DEF-6 wired — 5 pools RESOLVED
677e8b12a REWRITE car 8b-W-3: DS-DEF-4 wired — 5 pools RESOLVED
ef05978ab REWRITE car 8b-W-2: DS-DEF-3 wired — 7 pools RESOLVED
00041fadd REWRITE car 8b-W-1: DS-DEF-1 wired — 4 pools RESOLVED
$ git -C $SC/laneRW-DEFW status --porcelain | wc -l
       0
$ V=vit; V2=est; pgrep -fl "$V$V2" | grep -v gate-mutex | wc -l
       0
$ ls -ld node_modules/immer node_modules/seedrandom
lrwxr-xr-x  node_modules/immer -> /Users/cstokes/Desktop/settlement-engine/node_modules/immer
lrwxr-xr-x  node_modules/seedrandom -> .../node_modules/seedrandom      # symlinks, never cloned
```

**STATUS: CAR 8b-W LANDED at `290f86ee0`.** Seven commits, one product file, two register
baselines, two projected leaves and three test files; no build; porcelain 0 and runners 0.
The seven blocks' second writing pass runs on docks cut at the consist tip AFTER this car is
consisted.

---

## CAR 8b-W-5 — THE LICENCE CARD'S TABLE-RUNG LEAF

**STATUS: LANDED at `f2da5a3ee`.** (This header was written PARTIAL before the work landed, per
the lane's own rule, and updated when it did; the closing STATUS line of '8b-W-5.10 carries the
figures.)

Seat: Opus 5 (Fable-unvalidated). Lane: REWRITE-8b. Dock: `$SC/laneRW-DEFW`, base `290f86ee0`.

### 8b-W-5.1 THE DEFECT, AS THE WRITERS WERE READING IT

`scripts/lib/prose-licence-card.mjs` derived the claim subject with
`field.split('.').slice(-1)[0]` at two sites (the `may claim` line, and the echo note's root
through `rootOfPath`). That is correct for a LITERAL-rung read, whose dotted path really does end
in the field it claims. It is nonsense for a TABLE-rung read, which the census spells
`<reader> (via <TABLE> in <file>)` and which has no leaf at all: splitting it on `.` returns the
tail of the FILE NAME.

Measured over the committed census at `290f86ee0`: **122 of the 708 pools read a table-rung
reading**, and every one of them printed its licence as

```
  may claim:  that `js)` (=== STRONG) holds, as a STANDING fact of the record
```

488 occurrences of `js)` across the 708 cards, in four places per offending card: the `reads`
line, the `predicate` line, the echo note, and the claim. The first two are the census's own
recovered text printed verbatim, which is the card's whole contract; the last two were derived,
and were wrong.

### 8b-W-5.2 THE CURE

Three new exports in the lib, and one line of `licenceCardLines` re-pointed:

| export | what it does |
|---|---|
| `parseTableRungRead(read)` | recovers `{reader, args, table, file}`, or `null` for a dotted path — the `null` is every caller's signal to keep its old form byte for byte |
| `readAsField(read)` | names a read on a line that speaks of fields: a dotted path is itself, a table rung becomes ``the row of `TABLE` selected by `reader` `` |
| `echoKeyNote(field)` | the echo line's second half, with its own sentence for a table rung |

`mayClaimText` now says the ROW OF THE TABLE. `mayNotText` maps its spine reads through
`readAsField` AFTER the existing dedupe-and-sort, so a dotted set is untouched. The echo note's
call site became `echoKeyNote(field)`.

⚖ **ONE DEVIATION FROM THE CHAIR'S WORKED SENTENCE, recorded for veto.** The brief's example
cited the file in parentheses — ``of `INVASION_ROW_POOL` (defenseStateProse.js)`` — which itself
contains `js)`. The card cites it in backticks instead: ``of `INVASION_ROW_POOL` in
`defenseStateProse.js`,``. Same four parts, same order, and the claim line's `js)` count goes to
zero rather than to 122.

### 8b-W-5.3 THE THREE CARDS, BEFORE AND AFTER (verbatim claim lines)

| card | before | after |
|---|---|---|
| `DS-DEF-2 :: Invasion & War: walls AND professional garrison` | ``  may claim:  that `js)` (=== walls, professional garrison) holds, as a STANDING fact of the record`` | ``  may claim:  that the reader `invasionRowSituation(walls, garrison, militia)` selects the row `walls, professional garrison` of `INVASION_ROW_POOL` in `defenseStateProse.js`, as a STANDING fact of the record`` |
| `DS-DEF-1 :: readiness STRONG` | ``  may claim:  that `js)` (=== STRONG) holds, as a STANDING fact of the record`` | ``  may claim:  that the reader `scoreBand(readinessScore)` selects the row `STRONG` of `READINESS_ROW_POOL` in `defenseStateProse.js`, as a STANDING fact of the record`` |
| `DS-DEF-11 :: WALLED-STRAINED` (dotted) | ``  may claim:  that `military` (< 1) holds, as a STANDING fact of the record`` | **identical, byte for byte** |

The two table-rung cards moved exactly two lines each (the claim and the echo note); nothing else
on them moved. The dotted card was proved unmoved by `cmp` over the WHOLE card, not by eye:

```
$ cmp -s before-def11.txt after-def11.txt && echo "IDENTICAL: $(wc -c < before-def11.txt) bytes"
IDENTICAL:     1711 bytes
```

### 8b-W-5.4 THE PLANTS, RED THEN GREEN

Six new arms in `tests/lint/proseLicenceCard.walker.test.js`. The RED control is a single-point
mutant — `parseTableRungRead` forced to `return null`, which reinstates the pre-cure behaviour at
all three sites at once — run in the dock and then reverted, the lib restored by sha:

```
$ npx vitest run tests/lint/proseLicenceCard.walker.test.js      # MUTANT
   × the census carries BOTH read shapes, and the old idiom really did print `js)`
   × EVERY pool in the census prints a claim subject that is neither `js` nor a call tail
   × pins the three cards the chair named, line for line
   × parses every read shape the census spells, and refuses to parse a dotted path
   × a table-rung SPINE in an attach set is refused as a table row, not as a file
   × the echo note tells a table rung its key is the TABLE and a dotted read its root
   × a claim with no recovered row says so rather than inventing one
   AssertionError: expected [ …(235) ] to deeply equal []
   +   "DS-GEN-3 :: foodSecurity.label: Deficit × Active Famine -> `js)`",
   +   "DS-GEN-3 :: foodSecurity.label: Deficit × Active Famine -> the echo root names a file",
   Tests  7 failed | 12 passed (19)

$ shasum -a 256 scripts/lib/prose-licence-card.mjs   # cured lib restored, mutant gone
9e4252fb0ffcebf8da4357961c52e89ade7d344ca8a431f3ad38ac79fbafacc2
$ npx vitest run tests/lint/proseLicenceCard.walker.test.js
   Tests  19 passed (19)
```

⭐ The 12 pre-existing arms stayed GREEN under the mutant. That is the proof the cure did not buy
the table rung by moving the literal rung.

Plant (a) is over **every one of the 708 census rows**, not a sample — the defect was invisible at
the anchor pool `DS-DEF-11`, which is literal-rung and printed correctly throughout. Its
anti-vacuity guard is the table-rung count: the sweep asserts it saw all 122, so a census that
loses the shape reds rather than passing over an empty set. Plant (b) pins the claim line and the
echo note of all three named cards as literal strings.

⛔ The `may NOT` clause is reached by NO pool at this tip (zero modifiers attach to a table-rung
spine), so it is covered by a plant rather than by the sweep: the day a modifier does attach, the
clause would have named `defenseStateProse.js)` as "a field the attached spine tests".

### 8b-W-5.5 THE SWEEP, AND AN HONEST GREP

```
$ node <sweep over all 708 census rows through cardMachine>
cards built: 708   not in corpus: 0   rows: 708
sweep exit=0
```

| grep, over all 708 printed cards | before | after |
|---|---|---|
| `that \`js)\`` — the nonsense claim subject | **122** | **0** |
| `js)` on the `may claim:` line | 122 | **0** |
| `js)` on the echo note | 122 | **0** |
| `js)` on the `may NOT:` line | 0 | **0** (latent; plant-covered) |
| `js)` on `reads:` / `predicate:` | 244 | 244 |
| `js)` TOTAL | 488 | **244** |

⚖ **THE ACCEPTANCE FIGURE, AND WHY IT IS NOT ZERO — recorded for veto.** The brief asked for
"zero `js)` occurrences". Every DERIVED line is at zero. The residual 244 is the `reads:` and
`predicate:` lines printing **the census's own recovered reading verbatim** —
``invasionRowSituation(walls, garrison, militia) (via INVASION_ROW_POOL in defenseStateProse.js)``
— which is a legible, true statement of what the pool reads and is the card's constitutional
property (§8.3: those lines ARE the measurement, and arm 1 asserts the reads line contains the
row's read path verbatim). Driving them to zero means re-writing the register's own text on the
two lines whose contract is fidelity. The chair's own worked cure sentence contains `js)` for the
same reason, so a literal zero was never reachable alongside it. **The lane did not do it. If the
chair wants the two measurement lines re-rendered as well, that is a second car and a change to
the card's projection property, not a continuation of this one.**

### 8b-W-5.6 THE GATES

```
$ npx eslint scripts/lib/prose-licence-card.mjs scripts/prose-licence-card.mjs \
    tests/lint/proseLicenceCard.walker.test.js         # clean, no output
$ node scripts/check-domain-strict.mjs
[domain-strict] ✓ no strict-type regressions (1120 errors, ceiling 1120).
$ node scripts/check-full-typecheck.mjs
[typecheck-ratchet] OK — no type regressions (173 error(s), ceiling 173).
$ node scripts/generate-custom-content-manifest.mjs --check
custom-content manifest artifacts are current
```

⭐ **THE MANIFEST CLASSIFIER, PROVED BY DIGEST RATHER THAN ASSERTED.** The cells table was
measured twice in the dock — once with the cured files, once with all three restored to
`290f86ee0` by `git show HEAD:<path>` on a porcelain-0 tree — and the two outputs are the same
file:

```
dfdece7e814a2cafe3b4a3f909e00c7600c7fef429972d208d1edc14d7c2c5db  cells-base.json
dfdece7e814a2cafe3b4a3f909e00c7600c7fef429972d208d1edc14d7c2c5db  cells-tip.json
identical: true      cells base: 73284   cells tip: 73284
```

That digest is the same one `docs/content/prose-reindex-8a1.json` records for its tip table. A
card script moves no rendered byte, and this is the measurement rather than the argument.

### 8b-W-5.7 THE ONE THING THE CAR OWED THAT THE BRIEF DID NOT NAME

`tests/lint` whole came back **2 failed / 153 passed** on the first run, and BOTH failures were
this car's:

1. `negativeAssertionAnchor.walker.test.js` — three bare `not.toContain` assertions in the new
   arms, ceiling 0. Each had a real structural anchor on the line above; each now carries a
   one-line `// anchored: …` marker. (⚠ The marker is read only on the assertion's own line or
   the ONE line immediately above, never wrapped — the walker's own message says this has cost a
   lane two attempts.)
2. `sovereigntyLightingContract.walker.test.js` — the lighting census's TEST-TITLE figure moved
   `24169 -> 24176`, exactly the car's seven new `it` titles. That is a count-only drift and a
   lane's plain re-take by the register's own ritual, on the precedent of
   `cc22f1d72 REWRITE car 8a-13-lighting`. It is measured at the CAR'S OWN TIP on a clean tree,
   so it lands as a second commit and never as an amend.

### 8b-W-5.8 THE LIGHTING REFREEZE, BY ITS OWN RITUAL

```
$ LIGHTING_CENSUS_REFREEZE='REWRITE car 8b-W-5 (Opus 5 — Fable-unvalidated)' \
  LIGHTING_CENSUS_NOTE='…' npx vitest run tests/lint/sovereigntyLightingContract.walker.test.js
Error: census REFROZEN at 62ae09bbf059cac3c3e9f542fa827064f84ff8e9 by REWRITE car 8b-W-5
(Opus 5 — Fable-unvalidated): files 2563 -> 2563, parked 375 -> 375, credited 2188 -> 2188,
titles 24169 -> 24176, suiteTitles 6452 -> 6453.

$ npx vitest run tests/lint/sovereigntyLightingContract.walker.test.js     # THE PROOF
  Test Files  1 passed (1)
       Tests  34 passed (34)
```

Measured at the car's own tip on a porcelain-0 tree, and landed as a SECOND commit — the ritual
writes `measuredAtSha: HEAD`, so it cannot precede the car and must never be folded into it by an
amend.

### 8b-W-5.9 THE WHOLE LINT SUITE, AND THE TIP

```
$ V=vit; V2=est; pgrep -fl "$V$V2" | grep -v gate-mutex | wc -l
       0
$ sh scripts/gate-mutex.sh --run -- npx vitest run tests/lint
  Test Files  155 passed (155)
       Tests  2606 passed (2606)          # 2599 before the car, +7 titles
```

```
$ git -C $SC/laneRW-DEFW log --oneline 290f86ee0..HEAD
f2da5a3ee REWRITE car 8b-W-5-lighting: the lighting census re-freezes at the car's tip, by its own ritual
62ae09bbf REWRITE car 8b-W-5: the licence card names the table row, not the file — every table-rung pool's claim line cured
$ git -C $SC/laneRW-DEFW status --porcelain | wc -l
       0
```

### 8b-W-5.10 RETROVALIDATION ROW (for the Fable chair)

| what was judged | what the chair must re-derive | receipts | priority |
|---|---|---|---|
| The file is cited in **backticks**, not in the brief's parentheses | that the four parts are the same four, and that this is what takes the claim line's `js)` to zero | §8b-W-5.2 | ⭐⭐ a deliberate departure from the brief's worked sentence |
| The `reads:` and `predicate:` lines were **left verbatim**, so `js)` totals 244 and not 0 | that a measurement line's contract is fidelity, and that re-rendering it is a second car | §8b-W-5.5 | ⭐⭐ the acceptance figure the car did not meet, and why |
| The echo note's new sentence for a table rung | that "keyed on the whole reading, truncated at the file's first dot" is what `rootOf` actually does to a via-form read, and that the census's own `mountsPerFact` really holds those truncated keys | §8b-W-5.2 | ⭐ a card line rewritten, not just repaired |
| The lighting refreeze as a lane act | that a titles-only drift caused by the car's own arms is a plain re-take, on the `cc22f1d72` precedent | §8b-W-5.8 | ⭐ a register act outside the brief's fences |

**STATUS: CAR 8b-W-5 LANDED at `f2da5a3ee`** (the cure at `62ae09bbf`). Two commits, one lib, one
walker, one register baseline; no product file and no build. `tests/lint` 155/155 and 2606/2606;
check-domain-strict 1120/1120; typecheck ratchet 173/173; manifest cells identical by digest at
73,284 cells. Porcelain 0 and runners 0.
