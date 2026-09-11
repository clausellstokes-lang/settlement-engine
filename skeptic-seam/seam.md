# SKEPTIC — LANE SEAM, LENS: THE COMPOSER AND THE SEAM (cars 3a · 3b–3g · 3h)

Seat: Opus 5 — Fable-unvalidated (the verifier). Dock `$SC/skepSEAM`, HEAD
`b573bb5f4f748e07600b348b80156a8419aae98b` (SEAM car 5b-b). **Porcelain BEFORE 0 · porcelain
AFTER 0.** `node_modules` symlinks intact. `$SC/HOLD-VITEST` absent at every run.

Every figure below is the tail of a command executed in this dock (or, for base-side figures,
of `git show` piped into a probe). Nothing is reasoned.

---

## THE HEADLINE

**Every load-bearing claim of the lens reproduced.** Twelve of the fourteen claims tested are
CONFIRMED, two are PARTLY (both corrections are precision, not substance), one is UNTESTED
(a per-stage re-run the fences forbid, replaced by a STRONGER endpoint proof).

The two corrections that matter to a later car:

1. ⚠ **The receipt's census "bytes" are JS STRING LENGTHS, not bytes** — a constant 1,557-unit
   under-read on this file. §3a.8's `committed 1806768`, §3b-0's `fresh 1807516` and the
   3b–3g stage table's `1807516 / 1807516` are `String.length`; the file on disk is
   1,808,325 / 1,809,073 bytes. (§3h's `1,809,073 → 1,832,119` **are** real bytes — the same
   receipt uses two units under one word.) The equality verdicts are unaffected; a later lane
   told to "print the byte lengths" and comparing against a `wc -c` figure would see a
   spurious 1,557-byte mismatch.
2. ⚠ **§4.2's steps 5 and 6 are implemented in the order 6-then-5** — the connective is drawn
   at `composeStateProse.js:745` and a `null` phrase `continue`s at `:748`, BEFORE the piece
   draw at `:749`. No observable consequence (every key is content-addressed, so a draw not
   spent costs nothing), and unreachable today, but the receipt's "the ten steps … in order"
   is not literally true.

One structural gap found beside the lens, worth a line: **nothing asserts that
`fillSites()` returns zero UNRESOLVED sites.** A malformed composed call is caught only by the
census STAMP interlock, which fires for any desk edit and is cured by a plain re-take.

---

## THE CLAIMS, ONE BY ONE

### (a) `drawFace` — one face takes no hash, seedless is 0, four faces are uniform, suffix `::w`
**CONFIRMED**, four ways, by spying on `Math.imul` (which `fnv1a32` calls per character and
`avalanche32` twice):

```
one-face imul calls over 100 draws: 0 | four-face imul calls on 1 draw: 25
seedless: 0,0,0                      (the three spellings '', null, undefined)
10000 seeds four faces: 2486 / 2460 / 2482 / 2572 | worst deviation SE: 1.663
suffix ::w matches independent fold on 500 seeds: true | ::wording differs on 381 of 500
```

Source read: `stateProseKernel.js:357-363` — `faces === 1` returns before either half of the
pair; `!seed` returns 0; the key is `${seed}::${blockId}::${poolKey}::w`.

⚠ The receipt's own triple (`2448 / 2533 / 2500 / 2519`, worst 1.201 SE) is **not
reproducible from the receipt alone** — the distribution depends on the fixture's `blockId`
and `poolKey`, which the receipt does not name. My own keys give 1.663 SE. Both sit inside the
2 SE band; the claim holds, the figure is fixture-local.

### (b) An empty candidate list composes to the kernel, and to the manifest's base-side synthesis
**CONFIRMED twice — once by the lane's arm, once by an instrument I wrote.**

Lane's arm re-run at the tip:
```
[compose] 8496 reads over 708 pools x 2 audiences x 6 seeds · 8370 composed a unit · drift 0
[compose] base-side synthesis checked on 73284 cells of 1050 rows · mismatches 0
 Test Files  1 passed (1)      Tests  47 passed (47)
```

My own independent script (`p7-equality.mjs`), which never touches the lane's helpers and
compares `composeStateProse(…, {candidates: []})` against `readStateProse` field by field over
the live leaves:
```
reads 8496 | kernel non-null 8370 | composed 8370 | text/angle/key MISMATCHES 0
          | pieces not the single spine face-0 row 0
```
Same denominators, same answer. The `pieces` shape is exactly one `{role:'spine', face:0}` row
on all 8,370.

### (c) The ten steps are implemented in order, each pure; no clock, RNG, settlement, lexicon or locale
**PARTLY.**

PURITY — **CONFIRMED**. `composeStateProse.js`'s only import is `./stateProseKernel.js`
(line 54-63). A scan for `Date`/`Math.random`/`localeCompare`/`Intl`/`toLocale`/`settlement`
answers only four COMMENT lines (17, 18, 467, 653). The module takes a corpus, never a
settlement. Both bans are PLANT-CONVICTED through the live instruments, on a copy restored
by `cp` (`md5 1339e4871ad3e1f2079e3c62aad6d9eb` before and after, `cmp` identical,
porcelain 0):

* planting `a.key.localeCompare(b.key)` at the comparator →
  `expected [] / received [ "localeCompare" ]`, `1 failed | 8 passed (9)`; eslint
  `1 problem (1 error)` at `479:10`;
* planting `Math.random() > 0.5 && Date.now() > 0` → eslint `2 problems (2 errors)` at
  `540:20` and `540:43`, by name.

ORDER — **the correction**. Steps 1-4 and 7-10 are in §4.2's order; steps 5 and 6 are
transposed. `drawConnective` runs at `:745` and `if (phrase === null) continue` at `:748`
BEFORE `drawPiece` at `:749`. §4.2 puts the per-piece draw at 5 and the connective at 6.
Harmless — every key is content-addressed, so an unspent draw changes no modulus, and no
modifier can seat on the shipped corpus at all — but it is a deviation from the literal claim.

Also noted: §4.2 step 2 names "the pool RESOLVED" as a metadata filter; `admissibleCandidates`
implements the audience, the `role`, the `attach` and the block-membership filters and has no
resolved check. `PoolMeta` carries no such key. Unreachable today (0 modifier pools).

### (d) The audience filter runs at the CANDIDATE stage — a covert pool takes no seat, no budget slot, no position-budget withdrawal
**CONFIRMED, driven on a fixture, and the withdrawal limb is the strong one.**

```
seed where COVERT wins the one seat on the DM face: s0
DM    : ["SPINE","COVERT"] | The spine speaks. the covert fact
PLAYER: ["SPINE","OPEN"]   | The spine speaks. the open fact
=> the player face keeps its seat for OPEN (covert did not consume it): true

composeStateProseMount, limit 1, two rungs, rung 1 offering ONLY a covert modifier:
audience=dm    : rung2 lost its modifier in 103 of 200 mounts
audience=player: rung2 lost its modifier in   0 of 200 mounts
```
On the player face the covert pool is not a candidate at all, so it cannot be the reason
another rung lost its modifier. That is P-F3 executed, not asserted.

### (e) The clause seat is gated and no clause can seat on the shipped corpus
**PARTLY — true, and TRIPLE-locked, but not by the mechanism the claim names.**

Measured over all six shipped leaves:
```
pools 708 · variants 2266 · variants with wordings 0
poolMeta rows 708 · roles {"spine":708} · seats {"(absent)":708}
clause-seated 0 · modifier-role 0 · turn-role 0 · with relation 0 · with NON-EMPTY attach 0
```
So: (i) no pool is a modifier, so nothing reaches `seatFor` at all; (ii) no pool carries
`seat: 'clause'`; (iii) `dossierConnectives.generated.js` ships `consequence.clause: []`, so
even a licensed clause draws no phrase and `continue`s.

The CORRECTION: after car 4d **the composer does not read the relation table** — the licence is
resolved at projection and arrives as `poolMeta.seat` (`composeStateProse.js:539-546`, and the
file says so at :204-216). The relation leaf's join is nonetheless empty as claimed, from the
leaf's own header: "0 of 165 rows have BOTH endpoints resolving to a field a desk reads", and
`relations.join.strictBoth 0 / leafBoth 0` in the committed census at every sha I read.

### (f) The six candidates leaves are empty ordered arrays built by explicit calls
**CONFIRMED.** All six exist, each 5 effective lines, each returning `Object.freeze(fired)`
with `fired = []`, each importing nothing, each fail-closed on a missing block or readings,
and none reaching `pools`. `tests/lint/composeStateProseFence.test.js` holds all four
properties with a live control (the kernel really does contain the word `pools`).

### (g) Reachable from nothing at 3a; every desk routed after 3g; zero drift
**CONFIRMED for reachability and routing. The zero-drift endpoint is CONFIRMED and is
STRONGER than the per-stage claim; the per-stage runs themselves are UNTESTED (a checkout the
fences forbid).**

At car 3a (`22ff295a4`), `git grep` over `src/`: seven files NAME the composer (its own file
and the six leaves' docblocks) and **zero import it**. Reachable from nothing — confirmed at
the sha, not from the receipt.

At the tip: exactly the six desks import `composeStateProse` (`warFaith:112`, `economy:78`,
`power:81`, `stressors:54`, `defense:105`, `general:82`); `grep -rn readStateProse src/`
answers two lines, both inside the kernel (its definition and `stateProseSentence`). Call
sites per desk: general 11 · defense 9 · power 7 · stressors 2 · economy 1 · warFaith 1 = **31**,
which is §4.1's count.

⭐ **THE ENDPOINT PROOF THE RECEIPT DOES NOT MAKE, AND IT IS BETTER THAN THE ONE IT DOES.** The
manifest fixture blob `tests/fixtures/dossier-prose-manifest-golden.json` is
**`b6da26ce107f` at every one of the nineteen shas from the §915 base `3b22b5c56` through
HEAD** — the base, all nine 3b–3g commits, the chair's register car, 3h, and cars 4 · 4c · 4d ·
5 · 5b. The drift arm at the tip is green against that unchanged fixture:
```
[dossier-prose-manifest] 525 towns x 2 audiences = 73284 cells in 10 s
[dossier-prose-manifest] cells whose audible-pool recomputation would draw differently: 5966 of 73284
[dossier-prose-manifest] audience-divergent positions 345 of 36660 · DM-only 36 · player-only 0
[dossier-prose-manifest] covert pools 4 · DM cells drawn from one 0 · player cells 0
[dossier-prose-manifest] seedless cells 1087 · … 217 · … 18
 Test Files  1 passed (1)      Tests  14 passed (14)
```
Every printed figure is byte-equal to the receipt's. So the composed prose at the tip is
byte-identical to the PRE-SEAM baseline — which subsumes every per-stage claim. **THE PROMISE
IS INTACT ACROSS THE WHOLE TRAIN.** And `git diff --stat 3b22b5c56 c45a46a78 -- src/data/`
prints nothing: zero corpus bytes through cars 3a–3h.

`DeskLines`: keyed `${mount}::${position}` at both callers (`EconomicsGlance.jsx:173`,
`WarFaithDesk.jsx:132`) — CONFIRMED, with the collision reasoning in both files.

DM page: `DM_FIELD_FRAMED_BY_BLOCK` (`dmFieldProjection.js:85-94`) names exactly eight blocks;
`projectBesideDmField` has exactly three call sites, all in `defenseStateProse.js`. The
receipt's citations `:583 / :1154 / :1160` are the 3g offsets; at the tip they read
`:746 / :1317 / :1323`, all +163 — exactly car 3h's growth of that file. The convention-held
route I spot-checked reproduces at the tip: `economyStateProse.js:1040` returns the
`shadowEconomy` rung and `EconomicsTab.jsx:686` renders it through
`drawnAtMount('economics.shadowEconomy', …)`. The lane's withdrawal of car 3c's commit-body
citation is correct.

### (h) Car 3h — key identity, DS-DEF-2 leaving the dark set, the RESOLVED integer as a declared row
**CONFIRMED, and the key identity is confirmed INDEPENDENTLY of the lane's snapshot.**

The A/B harness re-run at the tip (copied out of `$SC` with `LANE` repointed at the read-only
dock, so `laneSEAM` was never entered) reproduces all five digests exactly:
```
[key-ab] exhaustive 4743 · RATE towns 768 (threw 0) · DRIFT rows 1050 (threw 0) · 19s
exhaustive 3cf2fb9e70894a3c · RATE keys a518931aeea73060 · DRIFT keys e357988905aeeea9
RATE desk-output cde82d7f1dc9ef03 · DRIFT desk-output c873e0194673affc
```
Row by row against the lane's stored pre-3h snapshot: **0 of 4,743 · 0 of 768 · 0 of 1,050**
key tuples differ, and **0 of 768 · 0 of 1,050** desk-output digests differ.

⭐ And independently of that snapshot, against the OLD product base `$SC/laneB6` (`3b1c0eaa5`,
before any SEAM car): the exhaustive domain sweep of the five key functions gives
**`laneB6 rows 4743 | skepSEAM rows 4743 | differing 0`**, reaching **26 distinct keys** — the
26 of 26 the receipt claims.

The census, read out of the committed JSON at four shas:

| figure | 3a `84388a185` | 3g `efb5111cd` | reg `6d94a41ad` | 3h `c45a46a78` | HEAD |
|---|---|---|---|---|---|
| resolved / unresolved | 318 / 390 | 318 / 390 | 318 / 390 | **340 / 368** | 340 / 368 |
| keyTables | 29 | 29 | 29 | **33** | 33 |
| syntheticTableFields | 78 | 78 | 78 | **100** | 100 |
| factIndex rows | 59 | 59 | 59 | **63** | 63 |
| branch / function cannotAttach | — | 22 / 26 | 22 / 26 | **21 / 25** | 21 / 25 |
| `DS-DEF-2 ∈ dark` | — | true | true | **false** | false |

Row diff `6d94a41ad → c45a46a78`: **rows whose JSON moved 22 · outside DS-DEF-2 0 · added 0 ·
removed 0.** DS-DEF-2 at 3h: **26 rows, rungs {table 22, literal 4}, k {2:22, 1:4}** — exactly
the receipt's shape, including `internalRowPoolKey` left on rung 1 at k = 1. Attach coverage
moved `{spines 4, facts 2, spinesReachedBp 0, meanReachBp 0}` →
`{spines 26, facts 6, spinesReachedBp 10000, meanReachBp 8077}`, digit for digit.

`node scripts/wiring-census.mjs --check` at the tip: `verified 708 pools / 2266 variants / 165
relation rows against 7 stamped files`, exit 0. `tests/lint/proseWiringCensus.walker.test.js`
at the tip: **69 passed (69)**.

### (i) Effective lines per desk against 800
**CONFIRMED — every figure in both of the receipt's tables reproduces exactly**, measured with
the same instrument `sizeBaseline.test.js` uses (eslint `max-lines`, skipBlankLines +
skipComments), on files extracted by `git show`:

| file | base `84388a185` | 3g `efb5111cd` | 3h `c45a46a78` | tip |
|---|---|---|---|---|
| stressors | 155 | 166 | 166 | 166 |
| economy | 334 | 338 | 338 | 338 |
| warFaith | 251 | 257 | 257 | 257 |
| power | 275 | 302 | 302 | 302 |
| defense | 454 | 500 | **541** | 541 |
| general | 699 | **721 (headroom 79)** | 721 | 721 |
| EconomicsTab.jsx | 596 | 596 | 596 | **596 / 600 — headroom 4** |

The composer at car 3a is **302** effective lines (the receipt's figure, re-measured off the
`22ff295a4` blob); at the tip it is 293 (car 4d deleted two readers). Each candidates leaf is
5. `composeStateProse.test.js` at 3a carries **42** `it/test` titles in **13** `describe`s and
`composeStateProseFence.test.js` **9** in **3** — 51 titles and 16 suites, exactly the movement
§3a.9 measured.

### (j) The fill scanner learned the composed call shape and reads the same tree
**CONFIRMED**, with one gap recorded.

`fillSites()` at the tip: **96 sites · 0 unresolved · 0 parameterised · 0 unreadable
`spineKey`**, and the per-desk block sets are character-for-character the receipt's six lines
(defense 9 blocks · economy 10 · general 18 · power 7 · stressors 3 · warFaith 6).

A malformed composed call IS reported rather than guessed. Planting the removal of
`spineKey: key,` from `stressorsStateProse.js:531` (backup, `cmp`, `md5
7db1c7f71d71f893ae2e0818623317ef` restored, porcelain 0):
```
total sites: 96 · unresolved sites: 1
$ node scripts/wiring-census.mjs --check
Error: wiring-census.json stamp is stale for src/domain/display/stateProse/stressorsStateProse.js
```

⛔ **THE GAP: no arm asserts `fillSites()` has zero unresolved sites.** The five consumers
(`proseWiringCensus`, `proseMeasures`, `proseMoveGrammar`, `proseEntryContradiction`,
`wiring-census.mjs`) all read the sites; none checks the `unresolved` list. With the plant in
place the walker reds on TWO arms and both are the census-currency interlock — which fires for
any byte of any stamped desk, malformed or not, and is discharged by a plain re-take. A lane
that broke a `spineKey` and then re-took the census would be green unless the degraded fill
happened to move a census ROW. Recorded for the chair; the honest cure is one line in the
walker.

### (k) Car 3f-0's fence, and the producer index unmoved
**CONFIRMED both halves.**

The plant: restoring `stressorsStateProseCandidates('DS-STR-1', { banner })` reds the live
fence with the receipt's own message —
```
AssertionError: stressors hands its candidates leaf a fresh object literal, which mints
producer-index keys: expected [ '{ banner }' ] to deeply equal []
 Test Files  1 failed (1)      Tests  1 failed | 8 passed (9)
```
Restored by `cp`, `cmp` identical, md5 `7db1c7f71d71f893ae2e0818623317ef`, porcelain 0.

The producer index, read out of the committed census at five shas — 3a, 3g, the register car,
3h and HEAD — is the SAME object at every one:
`{"measured":370,"default":3,"not-produced":60,"method-call":18}`. **No row was reclassified
by any of the nine routing commits.**

### (l) X-F9 — the six render-body reads memoised, `stresses` left a plain const
**CONFIRMED.** All six general-desk render sites carry a `useMemo` at the tip
(`OverviewTab:153`, `EconomicsTab:275`, `ViabilityTab:33`, `HistoryTab:39`,
`RelationshipsTab:110`, `SteadingsSection:48`); `PlotHooksTab:32` was already one.
`OverviewTab.jsx:145` `const stresses = …` is a plain const, with the measurement written
above it at `:146`. The writer-reach dry read at the tip:
`tests/lint/writerReach.walker.test.js` → **56 passed (56)**, zero drift.

### (m) The chair's register car — twelve stamped shas, no row
**CONFIRMED, exactly.** `git diff -U0 efb5111cd 6d94a41ad -- docs/content/wiring-census.json`
after dropping the headers: **24 changed lines, 0 of them outside `src/domain/display/
stateProse`** — six desk shas under `stamp.files` and six leaf shas under
`stamp.candidateLeaves`. The file is the same length on both sides (1,809,073 bytes) and no
row, fill, total, tier, grain or rate figure moved. `--check` at the tip is green.

---

## FENCE COMPLIANCE, AND ONE DISCLOSURE

Read-only on every tree. `laneSEAM` never entered — the 3h A/B harness was copied into my own
directory with its `LANE` constant repointed at `skepSEAM`. Three plants, each on a file
backed up first and restored by `cp`, each verified by `cmp` AND by md5 before/after, each
followed by `git status --porcelain` = 0. No build, no `--write`, no golden re-record, no
whole suite; six focused vitest files, one at a time.

⚠ **DISCLOSURE.** The gate check before the manifest run printed a split-pattern runner count
of **5**, not 0 — my own previous focused run's worker processes had not yet exited (the
count read 0 immediately after, and 0 before every other run). The manifest run completed and
its figures are byte-equal to the receipt's and to the two later clean runs, so no figure is
in doubt; recorded because a runner-count fence that a lane collides with itself is worth the
chair knowing.

---

## PORCELAIN

```
git -C $SC/skepSEAM status --porcelain | wc -l   BEFORE:  0
git -C $SC/skepSEAM status --porcelain | wc -l   AFTER:   0
HEAD unchanged: b573bb5f4f748e07600b348b80156a8419aae98b
```
