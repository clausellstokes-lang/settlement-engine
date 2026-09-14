# SKEPTIC LENS — THE MANIFEST, THE CLASSIFIER AND THE CONTROLS (MEASURE car 1)

Seat: Opus 5 — Fable-unvalidated (the verifier). Dock: `$SC/skepMEASURE` pinned at
`fcd98a3dbb3178adccb37b6f3f103bb5dc03af63`. **Porcelain before 0 · porcelain after 0.**
(Transiently 1 at 08:10: an untracked `.skeptic-probe-econ.mjs` written into the dock at 08:09
by a SIBLING lane, not by me; it was gone by 08:24. My own plant — one word in
`src/data/dossierStateProse/defense.generated.js` — was backed up by `cp`, restored by `cp`,
`cmp`-identical, md5 `1454b340aea5cab4f1d17c8265859591` before and after, which is also the md5
the receipt states.)

Every figure below came from a command I ran and whose output I read. Where the receipt and I
agree I say so and move on; the weight of this file is in the four rows that do not survive.

---

## THE HEADLINE — three defects, each with its measurement

**M-1 (HIGH). THE MANIFEST IS NOT RECORDED AT TWO AUDIENCES. It is recorded at two audiences on
five desks and at the DM face twice on the sixth.** `deskReturns` routes the economy desk through
`economyDeskRead(s, opts)`, and that recipe keys on `options.playerView`, never on
`options.audience`, which is the only key the manifest passes. Executed on one golden town:

```
audience:player -> "What passes for a shadow economy here has never grown into one. …"
playerView:true -> "Minor shadow activity. Petty theft and small-scale unlicensed trade. …"
audience:dm     -> "What passes for a shadow economy here has never grown into one. …"
audience:player === audience:dm ?  true
playerView:true === audience:dm ?  false
```

Consequences, all measured on the committed cell table (`prose-manifest-cells.mjs`, 72,160 cells):

* **11,792 of 72,160 cells (16.3 %)** sit on the economy desk. On **all 5,371** positions where
  both faces exist, the two faces are identical **by construction, not by measurement**.
* **309 player cells carry `index: -1`** — the identified variant is not in the player's audible
  pool at all. Every one is `DS-ECO-6 :: TIER: minor shadow activity (≥3)` at
  `economics.shadowEconomy`, drawn at `vid` 3 (`counterforce`) or 2 (`street`), and **all three of
  those variants are marked `dm-only`**. The manifest is recording DM-only prose on the player row
  and no arm refuses it: the base-normalisation arm compares `pieces[0].index` to `cell.index`
  (both −1, so it agrees), and `run.unresolved` counts only cells that matched NO variant.
* **Only 2 of the 12 mixed pools fire at all on the DRIFT corpus** (measured):
  `DS-POW-1 :: governanceFractured true` (36 dm cells) and
  `DS-ECO-6 :: TIER: minor shadow activity (≥3)` (309 dm cells). The other ten fire on zero cells —
  three are on the economy desk, two are unmounted. So the whole non-vacuity of the mixed-pool
  control rests on ONE pool, and **the one other live mixed pool is exactly the one the recipe
  blinds**. Had the audience reached the desk, those 309 player cells would each draw the pool's
  only audible variant (`canonical`, vid 0 — executed above), so the pinned figure would be **345
  divergent positions, not 36**.

The defect is inherited, not minted here: `tests/fixtures/composedReadingSequence.js:192` (INSTR-912
car 9's "corrected" sequence) carries the same `economyDeskRead(settlement, opts)` call, and car 0's
`deskReturns` took it from there. But car 1 is the instrument whose two-audience claim rests on it,
and the receipt asserts the two-audience recording without qualification.

**M-2 (HIGH). THE `ADDITIVE` VERDICT CANNOT FIRE ON A REAL ADDITION.** `classifyCell` reaches
ADDITIVE only when `base.textSha === tip.textSha`. A modifier added beside a spine adds WORDS, so
the cell's rendered text — and its single `textSha` — necessarily moves. Driven through the
receipt's own command:

```
$ node scripts/prose-manifest-diff.mjs add-base.json add-tip-real.json      # spine held, modifier added, text moved
  ADDITIVE       cells       0 · towns     0
  WORDING-ONLY   cells       1 · towns     1
$ node scripts/prose-manifest-diff.mjs add-base.json add-tip-fixture.json   # the suite's own shape: text HELD
  ADDITIVE       cells       1 · towns     1
```

The suite's ADDITIVE arm passes only because its fixture holds `textSha` constant across a piece
addition — a state the cell shape cannot produce. This is not cosmetic: ARCH §12 accepts the taste
(car 6) and the whole AUTHORING wave (car 9) on **"the classifier: every affected cell ADDITIVE"**,
which is unreachable as coded; and it accepts the REWRITE wave (car 8a) on "every cell
WORDING-ONLY", so a car that accidentally attaches a modifier would read WORDING-ONLY and pass.
The classifier's own docblock names exactly this failure — a car reporting that only wording moved
about a cell that now says something else — and then admits it through the ADDITIVE door.

**M-3 (HIGH). THE DRIFT MANIFEST RECORDS 39 OF THE 56 REGISTERED MOUNTS, AND AT LEAST ONE ABSENCE
IS THE RECIPE'S, NOT THE CORPUS'S.** `DOSSIER_MOUNTS` carries 56 distinct mounts; the cell table
carries 39. `economics.foodTile`, `economics.seasonTile` and `economics.tradeFlow` carry **0 cells**.
The shipped tabs pass `foodBalance`, `granaryOutlook`, `flowDrift` and `impairedInstitution` to
`economyDeskRead`; the manifest passes `{seed, audience}` only. Executed on one golden town:

```
foodTile   manifest-recipe: null || tab-recipe: "The granary doors open more often than they shut, …"
```

A mount the manifest never records is a mount whose prose can move in a signed car with the drift
arm green — the vacuity the instrument exists to prevent. (`economics.foodSecurity` DOES fire, 978
cells, so the desk is not silent as a whole; this is a per-reading hole.)

---

## THE ROW-BY-ROW

### (a) THE DRIFT CORPUS — CONFIRMED
`tests/fixtures/dossier-prose-manifest-golden.json`: **1,050 rows, 141,855 B**, one row per
`${keyOf(config)}::${audience}`, value a full 64-hex sha, 1,050 distinct. **525 configurations,
both audiences (525 dm + 525 player), four seed tokens** (`golden-master-v3` on 516 configs,
`gm-seed-a/-b/-c` on 3 each). The corpus helper is the golden master's own rows and comments,
extracted verbatim (`git diff 23ea93ab6..b74daab7a -- tests/property/generatorGoldenMaster.test.js`
shows the block moved, not rewritten). Executed:

```
$ npx vitest run tests/property/dossierProseManifest.test.js
[dossier-prose-manifest] 525 towns x 2 audiences = 72160 cells in 10 s
[dossier-prose-manifest] cells whose audible-pool recomputation would draw differently: 6275 of 72160
[dossier-prose-manifest] audience-divergent cells 36 of 36098 positions · positions on one face only 36
[dossier-prose-manifest] covert pools 4 · DM cells drawn from one 0 · player cells 0
[dossier-prose-manifest] seedless cells 1071 · … above 0 …: 202 · strictly below every one of the twelve probes …: 18
 Test Files  1 passed (1)      Tests  11 passed (11)
```

The drift arm's three `[]` and the fixture-bytes identity pass. Every printed figure in the
receipt reproduces to the digit.

### (b) THE BASE-SIDE NORMALISATION — CONFIRMED, with one refusal missing
`cellsOfTown` records `face: 0` and `pieces: [{role: 'spine', key: poolKey, vid, index, face: 0}]` —
field-for-field and in order what ARCH §3.7 specifies for car 3a's equality. `face !== 0` on **0 of
72,160**. The gap is the coordinate's DOMAIN: `index = audible.indexOf(chosen)` yields **−1 on 309
cells** (M-1) and nothing asserts `index >= 0`, so car 3a's equality target contains 309 rows whose
`index` no composer can reproduce.

### (c) THE CLASSIFIER
* **Verdict names** — the five are `REPLACED · RE-INDEXED · ADDITIVE · WORDING-ONLY · UNCHANGED`,
  tested in that order, which is §3.7's set and the strongest-first rule. CONFIRMED.
* **REPLACED / RE-INDEXED / WORDING-ONLY definitions** match §3.7 exactly (pool-or-turn; vid moved;
  same pool and vid with text moved). CONFIRMED.
* **ADDITIVE** does not. REFUTED — see M-2.
* **PLANT A, re-run on a copy.** I edited one word of the drawn `street` variant of
  `DS-DEF-11 :: UNWALLED-SMALL` in `defense.generated.js`, regenerated the 20-config cell table,
  restored, and diffed:

```
PROSE MANIFEST DIFF · 2683 cells on the tip side
  RE-INDEXED     cells       0 · towns     0
  ADDITIVE       cells       0 · towns     0
  WORDING-ONLY   cells      40 · towns    20
  UNCHANGED      cells    2643 · towns    20
  ADDED/REMOVED  0 / 0
  ── WORDING-ONLY ──  …::defense.wallRationale::0  (all 40, both faces, 20 towns)
```

  **Exactly the receipt's 40 of 2,683 on exactly its cells.** CONFIRMED. (All 40 draw vid 0, which
  is why the receipt's first cut — mutating the `visitor` variant — moved nothing: on this corpus
  516 of 525 rows share one seed, so a pool has one hash and one drawn vid.)
* **PLANT B (RE-INDEXED at ≈ 2/3)** — **UNTESTED, and the reason is itself a finding.** The receipt
  measured it on 8 configurations × **60 seeds**; no committed command produces that corpus.
  `prose-manifest-cells.mjs` takes `--out` and `--limit` and no seed flag, and
  `proseVarietyCorpus.varietyConfigs` is reachable only from `prose-duplicate-units.mjs`, which
  prints no cell table. So the car's second classifier plant cannot be re-run from the tree by
  anyone but its author. The arithmetic it claims (6,667 bp = 4 of 6 residues) is sound on paper and
  its measured 6,685 bp sits inside the stated Wilson interval.

### (d) THE MIXED-POOL AUDIENCE ARM — PARTLY
The count IS pinned (`toBe(36)`) and a difference on a non-mixed pool IS a failure (`leaks` must be
`[]`), so the arm's shape is what the lens asks for. Three corrections:
1. The printed label says **cells** and the number counts **positions**: 36 positions = **72 cells**
   (`DS-POW-1` fires on 36 dm + 36 player). The receipt repeats "36 audience-divergent cells".
2. The leak check runs only over positions present on BOTH faces. The 36 one-sided positions are
   skipped and merely printed. Measured: all 36 are **DM-only** (`power.criminalUnderside`,
   `DS-POW-6 :: capture pressure ADVANCING …`), player-only **0** — lawful today, unguarded
   tomorrow.
3. The arm cannot see a leak that renders IDENTICALLY on both faces, which is the shape M-1
   produces 309 times.

### (e) THE PAIRED-TOWN COVERT ARM — PARTLY (disclosed by the receipt, ratified by §O.8)
It does **not** suppress at the candidate stage and does **not** assert byte-equality. It filters the
RECORDED player cells by the census's covert set and asserts the filtered count equals the full
count — a post-draw membership test. Its "across every configuration" assertion is a coverage check
(`525 distinct config keys among player cells`), not an equality. And it is vacuous: the committed
census carries **4 covert rows, all `DS-WAR-1 :: mobilization…`, `rateBp: null` on all four**, and
the DRIFT corpus draws them on **0 dm and 0 player cells**. The receipt says all of this out loud and
drives the suppression logic on a synthetic pair instead; I confirm the vacuity rather than the
concealment.

### (f) THE SEEDLESS CONTROL — PARTLY
The ordering form reproduces exactly (1,071 cells · 202 above index 0 · 18 strictly below every
probe), and the kernel law `drawVariant(list, b, p, '') === list[0]` is driven beside it. But
`economyDeskRead` overrides the caller's seed from the settlement, so `seedOverride: ''` never
reaches that desk. Executed:

```
economy desk identical when the caller passes an EMPTY seed?  true
defense desk identical when the caller passes an EMPTY seed?  false
```

**152 of the 1,071 seedless cells (14.2 %) are economy-desk cells that were never seedless**; the
twelve probes cannot move them either, so `min(observed) === cell.index` and the arm passes over
them without testing anything.

### (g) THE GOLDEN DOOR — CONFIRMED, with the door itself inert for this surface
* The row is **ENROLLED, not excluded**: surface `dossier-prose-manifest`, path
  `tests/fixtures/dossier-prose-manifest-golden.json`, suite `tests/property/dossierProseManifest.test.js`,
  and `recordEnv · proofForm · sha256 · rows · seedSet · distinctFloor · ownerRow` all **null**
  (the register is unfrozen: `frozenAt` null, `genesis` null).
* **The chair's enroll record is quoted VERBATIM** — I compared the brief's fenced text to the
  register's `note` character-for-character: match `True`.
* **The `-golden` path claim is real**: `goldenFreeze.walker.test.js` orphan arm filters
  `tests/fixtures/**` on `/golden/i` + `.json` and demands a claiming row, so deleting this row reds.
  The content-keyed arm would NOT catch it (it walks `ENROLLED_CARRIERS` only, and this suite carries
  no capture arm), which is exactly why the rename was needed.
* `ENROLLED_ENVS` is built with `.filter(Boolean)`, so the null `recordEnv` admits no arm. Executed:
  `npx vitest run tests/lint/goldenFreeze.walker.test.js` → **90 passed**, green with the carrier
  enrolled.
* **"A re-record without `GOLDEN_SHIFT_SIGNED` must throw" is not testable for this surface**: the
  door refuses `NO_SIGNATURE` (`goldenRecordDoor.js:243-249`) but `recordGolden` is never called for
  `dossier-prose-manifest`. There is no write path, so the fixture is updated by hand-edit today and
  nothing refuses that. Disclosed in §1.5 and ratified in SITTING §O.8; recorded here so the ledger
  carries it as a live gap rather than a closed one.

### (h) THE VARIETY CORPUS AND THE DUPLICATE-UNIT BASELINE — CONFIRMED (85 s, under the cap)
```
$ node scripts/prose-duplicate-units.mjs --out <scratch>
VARIETY CORPUS · 525 configurations x 8 seeds = 4200 towns x 2 audiences
  towns 4200 · cells 532689 · 85 s · 20 ms per town
  unit instances 532689 · … seen on more than one town 520632
  DUPLICATE-UNIT RATE 9774 bp at N = 4200 towns over 8 seeds and 525 configurations
  distinct (position, text) pairs 51396 · pairs seen on more than one town 39339
  groups 632 · EXECUTABLE 347 · NOT-EXECUTABLE 285
  groups showing fewer than half the distinct texts the chance floor expects: 2
```
Every figure is the receipt's. The wall clock reads 85 s against its 74 s — a printed cost on a
machine that was also carrying a sibling lane's full suite, not a threshold.

**The repeat census's refusal is NOT ARCH §7's — PARTLY.** §7 makes the arm NOT-EXECUTABLE below a
stated **pair count** and asks for "N, expected, observed and power". The implementation refuses on
independent **DRAWS** (`MIN_DRAWS = 8`, i.e. distinct seeds) or a one-variant pool, and prints N,
expected, observed and draws — **no power figure**. The substitution is argued in the script's own
header (the draw is keyed on the seed, so 4,200 towns give 8 draws, not 4,200) and I think it is the
better criterion; but `MIN_DRAWS` equals the corpus's seed count exactly, so "EXECUTABLE" reduces to
"this group appeared under all eight seeds", and the 285 refusals are not the power refusal ARCH
specified.

### (i) THE `120_000` OVERRIDE AND THE PRINTED COST — CONFIRMED
Seven of the eleven tests carry `}, 120_000)` (the four pure-classifier tests are instant and do
not); the root `testTimeout` is 20,000 (`vite.config.js:904`); the golden master uses the same
idiom at `:800` and `:823`. `run.seconds` appears only inside a `process.stdout.write` — there is
no assertion on it anywhere in the file.

### (j) THE RECEIPT'S OTHER FIGURES
* **§1.6's pre-existing red — CONFIRMED, and not this lane's.** Executed:
  `npx vitest run tests/property/generatorGoldenMaster.test.js` →
  `AssertionError: expected [ …(525) ] to deeply equal []`, 1 failed | 2 passed.
  `git diff --stat 8522a17b2..fcd98a3db -- src/generators src/data src/store src/kernel src/components`
  is **empty**; the only `src/` movement across the whole consist is
  `src/domain/prose/wiringBranch.js` (+292) and `wiringCensus.js` (+513/−59), the fenced island.
  ⚠ Worth the chair's eye: the composed-prose fixture was therefore recorded against generator
  output that is itself in an undeclared shift against the committed generator manifest.
* Plants **#93** and **#94** are registered in `mutation-coverage-manifest.json` with `meta:` rows
  and in `mutation-sweep.sh` by text, each naming its measured reds. Not re-run (a sweep is not a
  focused file).
* The single-writer claim holds structurally: `tests/helpers/dossierManifest.js` is imported by the
  suite, by `prose-manifest-cells.mjs` and by `prose-duplicate-units.mjs`.

---

## WHAT I WOULD PUT TO THE CHAIR, IN ORDER

1. **Fix the recipe before any car reads the manifest as a two-audience instrument.**
   `deskReturns` should call `economyDeskRead(s, {playerView: opts.audience === 'player', seed, …})`
   with the readings the tabs pass, or call `economyStateProse` directly with `opts` as the other
   five desks do. Then re-record the fixture: this is a declared instrument shift (the 309 player
   cells change variant), not a prose shift, and it should be banked as such before car 3a pins
   `pieces` against it.
2. **Fix ADDITIVE** — drop the `textSha` conjunct, or record a per-piece digest so a spine's own
   text can be held while the unit's moves. Cars 6 and 9 cannot be accepted on their own stated
   criterion until one of the two lands.
3. **Give the manifest a mount-coverage arm** — assert the set of recorded mounts against
   `DOSSIER_MOUNTS`, with every absence carrying a reason. 39 of 56 with no roster is the shape a
   later car passes vacuously through.
4. Assert `index >= 0` on every cell, and add the 36 one-sided positions to the leak check with
   their direction (DM-only lawful, player-only a leak).
5. Expose a seed flag on `prose-manifest-cells.mjs` so plant B is reproducible from the tree.

Seat: Opus 5 — Fable-unvalidated · lens: THE MANIFEST, THE CLASSIFIER AND THE CONTROLS
