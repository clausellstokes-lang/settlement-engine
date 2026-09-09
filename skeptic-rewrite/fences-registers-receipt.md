# SKEPTIC VERDICTS — REWRITE car 8a · LENS: THE FENCES, THE REGISTERS AND THE RECEIPT (8a-8, 8a-9, 8a-10)

Seat: Opus 5 — Fable-unvalidated (the verifier). Dock: `$SC/skepRW3`, detached at `5c7eadb18`,
symlinked node_modules. Base dock used READ-ONLY for base-side figures: `$SC/laneLIGHT` at
`29ec62425` (porcelain 0 before and after every command run there).

    porcelain at open   git status --porcelain | wc -l   0
    porcelain at close  git status --porcelain | wc -l   0
    runners             own shell, before every vitest   0 (waited out two sibling runs at 10 and 4)

No plant was made in any dock. Every command below ran in this session with its exit code captured.

---

## 1 · (a) THE CONSIST IS INSIDE THE BRIEF'S ALLOWED SET — **CONFIRMED · NONE**

    git diff --name-status 29ec62425..5c7eadb18       exit 0
      49 files changed, 8785 insertions(+), 455 deletions(-)
    git log --oneline 29ec62425..5c7eadb18            exit 0 → exactly 12 commits

All twelve declared shas exist, in the declared order, with the declared subjects:
`f4005cccd 39c88b02d 83e8acf17 94c41fdb8 e26ad7838 e2ac44a9c 99e8e56e8 31faa63aa bc441dccc
fa6696860 12b240397 5c7eadb18`.

Every one of the 49 files maps to a brief item or an ADDENDUM ruling. Two are NOT named by the
brief and are named here as the lens asks:

- `scripts/mutation-sweep.sh` and `scripts/mutation-coverage-manifest.json`. **Compelled by the
  estate, not chosen by the lane**: `tests/lint/mutationCoverageManifest.test.js` requires a
  `mutation` or `rationale` entry for every `tests/lint` walker, and the train lands five. All
  five new walkers carry an entry (`prosePassageShapes` as `mutation`; `proseLicenceCard`,
  `proseWaveGate`, `proseTasteInterested`, `proseTasteCorruption` as `rationale` with executed
  evidence). In scope.

`docs/content/RECEIPT_POOLS_DOSSIER_STATE.md` IS modified, which the brief's item 3 restricts —
but the diff is **ONE hunk at line 6337**, the §7b connectives block of 8a-9, and NOT the seven
typed annex lines item 3 refuses. Corroborated by execution: the projector reads
**708 pools / 2266 variants** at the tip, identical to the base census totals, so no annex row landed.

The refusals are real on disk: `tests/lint/proseTasteAnnex.walker.test.js` **absent**,
`tests/lint/proseTasteCandidates.walker.test.js` **absent** (ADDENDUM ruling 5),
`src/components/new/generalDeskRead.js` present at base and **not in the diff** (ruling 4),
`scripts/taste-measure.mjs` **absent** with `scripts/prose-wave-gate.mjs` present — one
implementation, never two.

---

## 2 · (b) ZERO READER-FACING BYTES OVER THE WHOLE TRAIN — **CONFIRMED · NONE**

Executed by me, both sides, not read from the receipt:

    (laneLIGHT @29ec62425) node scripts/prose-manifest-cells.mjs --out cells-base.json   exit 0
      towns 525 · rows 1050 · cells 73284 · drawAgrees footprint 5966
    (skepRW3  @5c7eadb18) node scripts/prose-manifest-cells.mjs --out cells-tip.json     exit 0
      towns 525 · rows 1050 · cells 73284 · drawAgrees footprint 3914
    node scripts/prose-manifest-diff.mjs cells-base.json cells-tip.json                  exit 0

    PROSE MANIFEST DIFF · 73284 cells on the tip side
      REPLACED       cells       0 · towns     0
      RE-INDEXED     cells   43685 · towns   525
      ADDITIVE       cells       0 · towns     0
      WORDING-ONLY   cells       0 · towns     0
      UNCHANGED      cells   29599 · towns   525
      ADDED 0 · REMOVED 0 · (index-only moves inside UNCHANGED: 0)

**Every cell class is 0 except RE-INDEXED, and RE-INDEXED is EXACTLY the declared 43,685.**
The 3,914 / 5,966 recorder-footprint contrast the receipt declares at 8a-1 is reproduced exactly.

---

## 3 · (b) THE SIX GENERATED LEAVES ARE BYTE-IDENTICAL — **CONFIRMED · NONE**

    git diff --stat 29ec62425..5c7eadb18 -- src/data/
      src/data/dossierConnectives.generated.js | 33 ++++++--------

Not one byte under `src/data/dossierStateProse/` moved — no sentence, not even a header count
line. The only leaf that moved is the connectives leaf (8a-9, declared). Corroborated:

    node scripts/generate-dossier-state-prose.mjs --check    exit 0
      seats: 708 sentence / 0 clause over 708 state pools (not-a-modifier 708)
      verified 68 state blocks / 2266 variants across 6 desks, 78 causal families / 468 variants

and the actual leaf bytes equal their pinned figures (`general 249940 · power 109224 ·
stressors 83961 · warFaith 160797 · defense 154593 · economy 126213`).

---

## 4 · (c) T-F12's RE-CUT: THE FIVE WAIVED REFUSALS, EACH RE-DRIVEN — **CONFIRMED · NONE**

Driven by me directly against the shipped `objectClassesOf`, not through the walker
(`node tf12.mjs`, exit 0):

| modifier | spine | modifier classes | spine classes | collides | verdict |
|---|---|---|---|---|---|
| `stores: short` | `Disasters & Famine: granary AND hospital` | `[store]` | `[care, storehouse]` | false | **LAWFUL** |
| `stores: import-fed` | `Disasters & Famine: granary AND hospital` | `[store, market]` | `[care, storehouse]` | false | **LAWFUL** |
| `country: pressed (walled)` | `WALLED-STRAINED` | `[]` | `[wall]` | false | **LAWFUL** |
| `country: pressed (unwalled)` | `UNWALLED-LARGE` | `[]` | `[wall]` | false | **LAWFUL** |
| `country: pressed (unwalled)` | `UNWALLED-SMALL` | `[]` | `[wall]` | false | **LAWFUL** |

All five print a NEW verdict and all five are LAWFUL PROJECTIONS on the ground the receipt
states. The conservative half survives execution — the split is true, not convenient:

    stores: short x Disasters & Famine: NO reserves, hospital present        collides TRUE  (still refused)
    stores: short x Disasters & Famine: NO reserves, NO medical provision    collides TRUE  (still refused)
    stores: short x GRANARY: thin                                            collides TRUE  (still refused)

`npx vitest run tests/lint/proseWiringCensus.walker.test.js` — **78 passed**, matching the receipt.

---

## 5 · (c) THE TEN MOVED ROWS, THE 12 → 17, AND THE ZERO POLARITY KEYS — **CONFIRMED · NONE**

Diffed base census against tip census row by row (`node tf12b.mjs`, exit 0): **exactly ten** rows'
`objectClasses` moved, and they are precisely the ten the receipt names (three DS-DEF-2 granary
rows, three DS-DEF-6 Logistics rows, four `DS-ECO-2 :: GRANARY: <band>` rows). Multi-class rows
**12 → 17**; ten of the seventeen carry `storehouse`. **Keys carrying a trailing polarity
parenthetical: 0 of 708** — the cure bites only where the defect was. The only other row drift is
the singular `objectClass` first-class column on five of the same rows, which is the same edit.

---

## 6 · (d) THE FOUR CONNECTIVE LISTS AT THEIR FLOORS, AND THE MANIFEST `[]` — **CONFIRMED · NONE**

The leaf and its source annex (§7b of `RECEIPT_POOLS_DOSSIER_STATE.md`) both read 3/3/3/3:

    consequence.clause  3   ", so" · ", and so" · ", leaving"
    tension.sentence    3   "Against that," · "Even so," · "At the same time,"
    contrast.sentence   3   "" (EMPTY OPENER) · "Instead," · "In its place,"
    addition.sentence   3   "" (EMPTY OPENER) · "Beside that," · "Also,"

Every floor is met. **Not one joint contains `which`**, an em dash, a digit or a percent. The
SHIFT REGISTER's `connective-list-length` pin reads
`{"consequence.clause":3,"tension.sentence":3,"contrast.sentence":3,"addition.sentence":3}`
against a base of `0/0/1/1`.

That the growth moved no rendered byte is proven twice over: the whole-train classifier above
(WORDING-ONLY 0 / ADDITIVE 0 / the six leaves byte-identical) and the projector's own print
`0 clause seats · not-a-modifier 708`. Independently measured over the six leaves:
**pools with `role: modifier`: 0 of 708**, so no joint of any list is drawn on any town, and no
`tension` or `consequence` joint exists. Manifest `[]` for this car's half — CONFIRMED.

---

## 7 · (e) THE CENSUS RE-TAKEN AND STAMPED BY THE CENSUS RULE — **CONFIRMED · NONE**

    node scripts/wiring-census.mjs --dry     exit 0
      the committed register is CURRENT; nothing was written
      bytes committed 2060855 · fresh 2060855 · delta 0
      sections that would move: (none)
      stamped shas that would move: (none) · candidate leaves unmoved
      ROWS that would move: 0

Base-vs-tip: **0 of 7 stamped file shas moved**, `candidateLeaves` byte-identical. So the drift
across the train is ROWS (the ten, pre-ruled by brief item 8) plus new SECTIONS (`modifiers`,
`fieldSynonyms`, `fieldSynonymsRuling`, totals key `modifierRows`) from 8a-3/8a-6 — never a
stamp-only drift left unpaid, and never a row move outside the chair's pre-ruling.

---

## 8 · (e) THE LIGHTING CENSUS, BY ITS RITUAL — **CONFIRMED · NONE**

`git diff` on `tests/lint/.lighting-census-baseline.json` reads exactly the receipt's tuple:

    measuredAtSha  f4433c943… → fa66968607aefc95097ba0e2771ea91938be1218   (the 8a-10 sha)
    files      2557 → 2562        parked 375 → 375 (unmoved)
    credited   2182 → 2187        titles 24049 → 24158        suiteTitles 6422 → 6451

Titles moved by the MEASURED count (+109 over +5 credited files) and the note records the +5 as a
NET with the removed file named. `npx vitest run tests/lint/sovereigntyLightingContract.walker.test.js`
— **34 passed**, so the frozen tuple is the tree's tuple: the ritual was really run, not typed.

---

## 9 · (e) OSR SHRINK-ONLY, 1972 BEFORE AND AFTER — **CONFIRMED · NONE**

    (laneLIGHT) .observed-shape-readers-baseline.json  total 1972   frozenAtSha 455ec96a4…
    (skepRW3)   .observed-shape-readers-baseline.json  total 1972   frozenAtSha bc441dccc…
    node scripts/check-observed-shape-readers.mjs   exit 0
      observed-shape readers: 1972 finding(s), exactly matching the frozen inventory.
    npx vitest run tests/lint/observedShapeReaders.walker.test.js   44 passed

1972 → 1972 is shrink-only satisfied (it did not grow), and the freeze absorbed only the one
drifted execution input (the connectives leaf; its size row moves 1365 → 2046 in the manifest
digest). `frozenAtSha` is `bc441dccc` (HEAD at the moment of `--write`, staged into `fa6696860`),
which is the ritual's own idiom and not a discrepancy.

---

## 10 · (e) THE SHIFT REGISTER PRINTED BY THE CONTRACT TEST — **CONFIRMED · LOW**

    npx vitest run tests/data/dossierStateProseProjection.contract.test.js   77 passed
    [shift-register] 15 mechanisms, 4 named NOT mechanisms, measured at 708 pools / 2266 variants
      … face-count-per-variant  integer+integer+digest …
      … connective-list-length  map …
      … passage-shape           source+source …
      … comparator-and-band-rule source+integer+integer …

**Fifteen mechanisms** as the receipt says, with all four new/changed pin shapes visible.

⚠ **A LOW-severity PARTLY on the BRIEF, not on the receipt.** Brief item 10 asks for "the SHIFT
REGISTER … with its TWO new rows". Measured: base carries **14** mechanisms, tip **15**, and the
only NEW id is `passage-shape`. `draw-formula` was REWRITTEN in place (with a `reIndexed` declared
block) rather than added. The receipt states this plainly at 8a-1 ("Row rewritten"), so nothing in
the receipt is false — but a ledger row that repeats the brief's "two new rows" would be wrong.

`face-count-per-variant.floors` is `{}` — and that is correct by construction, not an omission:
the contract asserts `Object.keys(declared).length === 0` with the reason "no family has grown
yet", and the declared-floor loop is armed for the day one does.

---

## 11 · (e) STRICT ON ITS CEILING, AND THE FULL TYPECHECK AT 173 WITH 0 IN TOUCHED FILES — **CONFIRMED · NONE**

    node scripts/check-domain-strict.mjs      exit 0   ✓ no strict-type regressions (1120 errors, ceiling 1120)
    node scripts/check-full-typecheck.mjs     exit 0   OK — no type regressions (173 error(s), ceiling 173)
    npx tsc --noEmit -p tsconfig.full.json    173 "error TS" lines over 38 distinct files

Intersection of those 38 files with `git diff --name-only 29ec62425..5c7eadb18` (49 files) is
**EMPTY**. Zero errors in any file this car touched — CONFIRMED by set intersection, not by eye.

    npx eslint <every .js/.mjs the car touched>    exit 0, no output

---

## 12 · (e) THE BYTE RATCHETS' DRY READS — **CONFIRMED · NONE**

`scripts/.prose-byte-baseline.json` moves exactly one pinned row
(`dossierConnectives.generated.js` raw 1365 → 2046, gzip 795 → 1138, ceilings 2122 / 1236
untouched) plus one appended declared row naming the car, the delta and the reason. Every other
leaf's pin is unmoved and the on-disk bytes equal the pins. `npx vitest run
tests/lint/proseCorpusBytes.test.js` — **18 passed**. Leaf delta 0 on the six prose leaves.

---

## 13 · (e/f) THE NAMED ACCEPTANCE — `tests/lint` WHOLE — **CONFIRMED · NONE**

    (runners 0, load 5.87, machine otherwise quiet — ps -r showed only the shell)
    npx vitest run tests/lint
      Test Files  154 passed (154)
      Tests       2590 passed (2590)
      Duration    108.47s

**Exactly the receipt's figure: 154 files / 0 failed · 2,590 passed / 0 failed.** `ls
tests/lint/*.test.js | wc -l` = 154, so the run is the whole directory and not a subset. Both
declared reds (the lighting census carried from 8a-1, the observed-shape input carried from 8a-9)
are genuinely paid.

---

## 14 · (f) THE RE-INDEX DECLARED BLOCK, RE-DERIVED FIELD BY FIELD — **CONFIRMED · NONE**

The register's `draw-formula.reIndexed` block and the contract test's print were re-derived from
my own two cells files (`node aud.mjs`, exit 0):

| declared | measured by me |
|---|---|
| cells 73284 | 73284 |
| RE-INDEXED 43685 (59.61 %) | 43685 |
| UNCHANGED 29599 · REPLACED/WORDING-ONLY/ADDITIVE/ADDED/REMOVED 0 · indexOnly 0 | identical |
| dm 21994 of 36660 (59.99 %) | 21994 / 36660 = 59.99 % |
| player 21691 of 36624 (59.23 %) | 21691 / 36624 = 59.23 % |
| blocksTouched 40 · blocksUntouched 0 | 40 · 0 |
| deepest DS-GEN-5 and DS-STR-1, both 100.00 % | identical |
| shallowest DS-GEN-18, 0.47 % | identical |

Every figure the ledger would carry on the owner's veto surface reproduces.

---

## 15 · (f) THE PER-COMMIT TEST FIGURES — **CONFIRMED · NONE**

| receipt figure | my run |
|---|---|
| `proseWiringCensus.walker` 78 passed | **78 passed** |
| contract test 77 passed | **77 passed** |
| `sovereigntyLightingContract.walker` 34 passed | **34 passed** |
| `observedShapeReaders.walker` 44 passed | **44 passed** |
| `tests/lint` 154 / 0 · 2590 / 0 | **154 / 0 · 2590 / 0** |
| typecheck 173, ceiling 173 | **173 / 173** |
| domain-strict 1120, ceiling 1120 | **1120 / 1120** |
| eslint exit 0 | **exit 0** |
| census `--dry` delta 0, ROWS 0 | **delta 0, ROWS 0** |
| projector `--check` exit 0 | **exit 0** |

---

## 16 · (f) FIGURES I COULD NOT REPRODUCE — **UNTESTED · LOW**

Named rather than waved past:

1. **The final sweep** — `tests/domain tests/property tests/data`, receipt "1,092 files passed /
   2 failed · 17,497 passed / 3 failed". Not run: my lens does not name it and the standing
   discipline forbids a whole-suite run from a skeptic dock while siblings share the machine.
   Its THREE reds are individually accounted for below and above, which is the part that matters.
2. **8a-1's uniformity and append-safety figures** (5,470,000 and 1,094,000 reads; chi-square
   4.201; 25.01 % vs 74.99 %). The kernel is another lens's dock; not re-run here.
3. **8a-2 through 8a-7's own per-car acceptances** (the gate, the shape module, armThread, the
   arm-Q cure) — outside this lens.

---

## 17 · (g) FINDING 1 — `vid: 0` IS A REAL ID ON SEVEN POOLS — **CONFIRMED · NONE**

Measured over the six leaves directly (`node vids.mjs`, exit 0):

    pools 708
    vid histogram  0:7  1:708  2:708  3:675  4:121  5:32  6:15
    pools with vid 0: 7   (DS-ECO-3 ADEQUATE · SHORTAGE × trade-dependent · SURPLUS × trade-dependent;
                           DS-ECO-6 TIER: minor shadow activity (≥3) · TIER: significant off-book activity (≥15);
                           DS-ECO-7 CATALOG · TALLIES)
    pools whose vids are not contiguous from the first: 0

The histogram is byte-for-byte the receipt's, and the seven are exactly the seven ARCH §16 item 5
names. A `> 0` guard would indeed have split the corpus. The contract test's own arm derives the
seven from `vids.includes(0)` rather than transcribing them, and it passes.

---

## 18 · (g) FINDING 2 — `attach-set` 0 ON ALL 708 POOLS — **CONFIRMED · NONE**

    pools with a NON-EMPTY attach set: 0 of 708
    pools with role: modifier:       0 of 708
    node scripts/prose-shape-report.mjs   exit 0
      attach-bearing pools 0 · composable units 0 · units WITH a shape question 0 · draws 0
      consequence.clause joints exist: NO — shape 3 is WITHHELD

No unit has a modifier, so no unit has a shape question. The script prints the emptiness AS the
measurement and names what is owed to which car, exactly as ADDENDUM ruling 3 requires.

---

## 19 · (g) FINDING 3 — "EVERY DRIFT CONFIGURATION CARRIES THE SAME `_seed`" — **REFUTED · MEDIUM**

The receipt (8a-1, and again in the close) states: *"Every configuration of the DRIFT corpus
carries the same `_seed` (`golden-master-v3`) … so one pool has ONE drawn variant across all 525
towns"*, and concludes *"Widening it needs the recorder's `--seeds` family rather than DRIFT,
which is a car of its own"*.

**Executed over my own tip cells file, the DRIFT corpus carries FOUR seeds:**

    golden-master-v3   cells 72108   towns 516
    gm-seed-a          cells   394   towns   3
    gm-seed-b          cells   390   towns   3
    gm-seed-c          cells   392   towns   3

and it is deliberate, not accidental — `tests/helpers/goldenMasterCorpus.js:116–121`:

    for (const s of [seed, 'gm-seed-a', 'gm-seed-b', 'gm-seed-c']) { … }
    // A few extra seeds on the base config (seed sensitivity is also locked).
    for (const s of ['gm-seed-a', 'gm-seed-b', 'gm-seed-c']) rows.push({ ...base, _seed: s });

Corroborated independently: the inherited `generatorGoldenMaster` red at the base tip prints
`town|germanic|plains|road|civilized|gm-seed-b` and `…gm-seed-c` among its drifted keys.

**What survives and what does not.** The SUBSTANCE survives — 516 of 525 configurations do share
one seed, so a per-pool count is still overwhelmingly a town count wearing a draw's clothes, and
the 345 → 309 / 36 explanation is unaffected. What is REFUTED is the universal quantifier ("every
configuration", "ONE drawn variant across all 525 towns": a pool has up to FOUR) and, with it, the
remedy sentence — DRIFT already carries a small seed family, so widening the control does not
strictly need a new recorder mode, only the nine existing off-seed configurations to be read as
distinct draws. Severity MEDIUM because it is the stated ground for routing a widening to a
CAPACITY-train car (ADDENDUM ruling 8), and because the false sentence is committed (see §21).

---

## 20 · (g) FINDING 4 — THE `voiceMechanics` RED IS INHERITED AT `29ec62425` — **CONFIRMED · NONE**

Run at the BASE dock `laneLIGHT`, porcelain 0 before and after:

    npx vitest run tests/copy/voiceMechanics.test.js      1 failed | 18 passed (19)
      src/domain/display/labelBands.js: baseline em:0 bang:0 → current em:5 bang:0
      src/domain/display/stateProse/generalStateProse.js: baseline em:0 bang:0 → current em:3 bang:0

Same test at the TIP: **the identical two rows and nothing more** — so 8a-10-voice really did cure
the three literals the train added (`passageShapes.js`, `composedWalker.js`, `fieldSynonyms.js`)
and left the two §917-inherited files alone per ADDENDUM ruling 7. The red is inherited, the
figures are the receipt's, and the car neither caused it nor papered it.

---

## 21 · NEW — THE FALSE SEED SENTENCE IS COMMITTED IN THE ESTATE, NOT ONLY IN THE RECEIPT — **NEW · MEDIUM**

`tests/property/dossierProseManifest.test.js:310–312` carries, as an estate comment a future
reader will inherit:

    // ⚠ AND THE THING A READER OF THIS PIN MUST KNOW: 345, 309 and 36 ARE NOT THAT MANY
    // INDEPENDENT FACTS. Every configuration of the DRIFT corpus carries the same `_seed`
    // (`golden-master-v3`) and the draw key is `${seed}::${blockId}::${poolKey}`, so one pool
    // has ONE drawn variant across all 525 towns …

Measured false (§19): 9 of 525 configurations carry `gm-seed-a/b/c`. The receipt's own words are
*"recorded here so the next reader inherits the finding instead of re-deriving it"* — which makes
the error load-bearing: the next reader inherits a wrong corpus fact. The cure is one sentence
("516 of the 525 configurations share `golden-master-v3`; nine carry one of three other seeds")
and it does not touch a mechanism. Recorded for the fold; a chair's call whether 8b or a cure
commit carries it.

## 22 · NEW — A RATIONALE SENTENCE THAT SAYS A FILE BECAME ITSELF — **NEW · LOW**

`scripts/mutation-coverage-manifest.json`, the `tests/lint/proseWaveGate.walker.test.js`
rationale, reads:

    "… scripts/prose-wave-gate.mjs became scripts/prose-wave-gate.mjs in the same commit,
     never aliased"

The first name should be `scripts/taste-measure.mjs`. The FACT is true and I verified it
(`scripts/taste-measure.mjs` is absent at the tip, `scripts/prose-wave-gate.mjs` present — one
implementation, never two); only the sentence is broken. Cosmetic, in a committed registry a
walker reads for provenance. LOW.

## 23 · THE THIRD FINAL-SWEEP RED, VERIFIED AS INHERITED — **CONFIRMED · NONE**

The receipt's close, finding 8, claims `tests/property/generatorGoldenMaster.test.js` is RED at
the §917 product tip. Executed at `laneLIGHT` (`29ec62425`), porcelain 0 before and after:

    npx vitest run tests/property/generatorGoldenMaster.test.js   exit 1
      Test Files  1 failed (1)   ·   Tests  1 failed | 2 passed (3)
      (drift keys include town|…|gm-seed-b and town|…|gm-seed-c)

Inherited, not this lane's — CONFIRMED.

## 24 · THE TWO CHARTERED MANIFEST REDS — **CONFIRMED · NONE**

    npx vitest run tests/property/dossierProseManifest.test.js    2 failed | 12 passed (14)
      × ⭐ THE DRIFT ARM: no row added, no row removed, no row moved
      × ⭐ THE PROVENANCE REFUSES A FIXTURE ITS RECORDER DID NOT WRITE
      [dossier-prose-manifest] audience-divergent positions 309 of 36660 · DM-only 36 · player-only 0

Exactly the two reds the brief charters (the manifest fixture is NOT re-recorded by this car; the
freeze act is the REWRITE's last car), and the 309 / 36 / 0 pins read exactly as declared. The
final sweep's "2 failed / 3 failed" is therefore accounted for: these two plus the inherited
golden master.

---

## CLOSE

Twenty-two claims executed. **Nineteen CONFIRMED, one REFUTED (MEDIUM), one PARTLY-on-the-brief
(LOW), three UNTESTED and named.** Two NEW findings, both about committed SENTENCES rather than
mechanisms — no mechanism defect survived this lens.

    porcelain at close (skepRW3)    0
    porcelain at close (laneLIGHT)  0
    runners at close                0
