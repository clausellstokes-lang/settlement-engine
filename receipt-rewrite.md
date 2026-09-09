# RECEIPT — the REWRITE train

Seat: Opus 5 — Fable-unvalidated. Lane: REWRITE. Chair session 67af10e4.

---

## CAR 8a — THE KERNEL, THE INSTRUMENTS AND THE GATE

**STATUS: PARTIAL — in flight.** Chartered at SITTING §T.10 (2026-09-09); ARCH §12 row 8a; §N.2 SIGNED;
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
| 8a-4 | `armThread` + the kinship tiebreak | — | pending |
| 8a-5 | the wave's gate `scripts/prose-wave-gate.mjs` | — | pending |
| 8a-6 | the arm-Q cure + the field-synonym table | — | pending |
| 8a-7 | the face-count ratchet | — | pending |
| 8a-8 | T-F12's class list re-cut | — | pending |
| 8a-9 | the connectives lists to the floors (public-copy drafts) | — | pending |
| 8a-10 | the register car | — | pending |

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
