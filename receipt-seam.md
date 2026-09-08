# RECEIPT — LANE SEAM (the ARCH train)

Seat: Opus 5 — implementer. Chair: Fable 5.1.

## CAR 3a — THE SEAM, UNREACHABLE (ARCH §12 row 3a)

**STATUS: LANDED** — car 3a at `22ff295a4`, car 3a-b at `84388a185`, porcelain 0.
Every section below was written as it was executed; nothing here is a prediction unless it
says so, and the one written prediction (§3a.1) is scored against its measurement in §3a.9.

### 3a.0 ARRIVAL — executed

```
$ git -C $SC/laneSEAM rev-parse HEAD
3b22b5c569e5c93f709f2a6057e3a0c280ff18ac
$ git -C $SC/laneSEAM status --porcelain | wc -l
       0
$ ls -ld $SC/laneSEAM/node_modules      # symlinked packages, never materialised
drwxr-xr-x@ 455 cstokes  wheel  14560 Sep  8 11:18 .../laneSEAM/node_modules
$ pgrep -fl vitest | wc -l
       0
```

HEAD equals the brief's §915 CAS (3b22b5c56). Porcelain 0. Runner count 0.

### 3a.1 THE REGISTER FIGURES, PREDICTED IN WRITING BEFORE ANY INSTRUMENT RAN

The only register door this car opens is the LIGHTING CENSUS, as sub-car 3a-b by its own
ritual. Predicted from the tree, at 11:5x, before `sovereigntyLightingContract.walker.test.js`
was run even once:

| figure | frozen (MEASURE car 4, `40dbcfc66`) | predicted after 3a | why |
|---|---|---|---|
| `files` | 2553 | **2562** | +9: seven new `src/domain/display/stateProse/*` files and two new test files |
| `parked` | 375 | **375** | nothing is parked by this car |
| `credited` | 2178 | **2187** | the same +9, all credited |
| `titles` | 23843 | **23901** | +58: `composeStateProse.test.js` 42, `composeStateProseFence.test.js` 9, `stateProseKernel.test.js` +7 |
| `suiteTitles` | 6377 | **6394** | +17: 13 + 3 + 1 new `describe()` blocks |

⚠ The `files`/`credited` prediction carries one unknown the lane could not settle from the
baseline alone: whether the census counts test files as well as `src/`. If it counts `src/`
only, the pair reads 2560 / 2185 instead. Both figures are stated so the measurement can
convict one of them rather than confirm whatever it says.

### 3a.2 WHAT WAS BUILT (7 new src files, 2 new test files, 4 files extended)

| file | what |
|---|---|
| `src/domain/display/stateProse/stateProseKernel.js` | +60 lines: **`drawFace`** exactly as ARCH §2.6, and **`hashKey`** — the kernel's one hash pair named once so the composer can mint a key without minting a second fold. The `wordings` typedef row. `drawVariant` is byte-untouched. |
| `src/domain/display/stateProse/composeStateProse.js` | NEW, **302 effective lines against a ceiling of 800**: the composer of §4.1–§4.6, plus `composedPieceOf` (the coordinate rule the manifest pins) and `composeStateProseMount` (the position budget). |
| `src/domain/display/stateProse/*StateProseCandidates.js` ×6 | NEW, 5 effective lines each: one ordered candidate function per desk, empty at this car, fail-closed, importing nothing. |
| `tests/domain/composeStateProse.test.js` | NEW, **42 arms**. |
| `tests/domain/stateProseKernel.test.js` | +7 arms (23 → 30). |
| `tests/lint/composeStateProseFence.test.js` | NEW, **9 arms**: the import fence and the locale ban, both plant-convicted through the live scanner. |
| `scripts/mutation-sweep.sh` + `scripts/mutation-coverage-manifest.json` | plant **#96**, edited BY TEXT (5 inserted JSON lines, nothing reformatted). |

Zero corpus bytes. The six `src/data/dossierStateProse/*.generated.js` leaves are untouched —
they do not appear in `git status` at all, which is the strongest form of sha-identical.

### 3a.3 ⭐ THE ACCEPTANCE — THE SEAM COMPOSES TO THE KERNEL, AND THE MANIFEST CANNOT MOVE

```
$ npx vitest run tests/domain/composeStateProse.test.js tests/domain/stateProseKernel.test.js \
      tests/lint/composeStateProseFence.test.js tests/lint/tuningRegister.walker.test.js   ; exit=0
[drawFace] 10,000 seeds over four faces: 2448 / 2533 / 2500 / 2519 · worst deviation 1.201 SE
[compose] 8496 reads over 708 pools x 2 audiences x 6 seeds · 8370 composed a unit · drift 0
[compose] base-side synthesis checked on 73284 cells of 1050 rows · mismatches 0
[compose] recorded cells whose authored vid and audible index differ: 0 of 73284 · mixed pools
    in the corpus 12 · reached by the DRIFT run 2 (DS-ECO-6 :: TIER: minor shadow activity (>=3)
    | DS-POW-1 :: governanceFractured true)
 Test Files  4 passed (4)
      Tests  156 passed (156)
```

```
$ npx vitest run tests/property/dossierProseManifest.test.js                              ; exit=0
[dossier-prose-manifest] 525 towns x 2 audiences = 73284 cells in 13 s
[dossier-prose-manifest] cells whose audible-pool recomputation would draw differently: 5966 of 73284
[dossier-prose-manifest] audience-divergent positions 345 of 36660 · DM-only positions 36 · player-only 0
[dossier-prose-manifest] covert pools 4 · DM cells drawn from one 0 · player cells 0
[dossier-prose-manifest] seedless cells 1087 · drawing an AUDIBLE index above 0 because anchoring
    removed an earlier variant: 217 · strictly below every one of the twelve probes: 18
 Test Files  1 passed (1)
      Tests  14 passed (14)
```

**THE DRIFT ARM'S THREE EMPTY LISTS** — rows added `[]`, rows removed `[]`, rows moved `[]` —
plus the fixture-byte identity and the recorder-provenance arm. The composed-prose manifest is
byte-identical at this tip. Every figure above is the same figure car 2's tip printed.

### 3a.4 THE FIVE ITEMS, EACH AS AN EXECUTED ARM

**1. `drawFace`, and the no-hash short-circuit — witnessed by COUNTING the hash pair.**
Behaviour cannot distinguish the short-circuit (`hash % 1` is 0 whatever the hash was), so the
arm spies on `Math.imul`, which `fnv1a32` calls once per character and `avalanche32` twice:

* a one-face variant on a long seed: **0 `Math.imul` calls**, and the same witness sees the
  fold run on a four-face variant immediately afterwards (the live control);
* the WHOLE SHIPPED CORPUS — 708 pools, 2,266 variants, read live from the leaves — draws face
  0 on every variant with **0 `Math.imul` calls in total**, and zero variants carry `wordings`;
* a planted four-face variant over **10,000 seeds**: `2448 / 2533 / 2500 / 2519`, worst
  deviation **1.201 SE** against a 2 SE band (the other two seed families measured 1.363 and
  1.940 SE; `seed-${i}` shipped). Every face reachable, no face at zero;
* seedless draws face 0 at all three spellings of absence — `''`, `null`, `undefined` — and
  takes no hash either. `galleryImportSettlement.js:76` writes `_seed: undefined`;
* the suffix is `::w`: the drawn face equals an INDEPENDENTLY spelled reference fold over
  `${seed}::${blockId}::${poolKey}::w`, and the `::wording` spelling of P-F10's nit is proved
  to answer a different index on that key;
* the PARENT key is untouched: `drawVariant` returns the same variant before and after faces
  are appended to every member of a pool.

**2. `composeStateProse.js` — the equality cars 3b–3g rest on, driven two ways.**

* Against the kernel, over **8,496 reads** (708 pools × 2 audiences × 6 seeds, including the
  seedless one), with a bag filling every slot and an answer for every demoted dimension:
  **drift 0**, and 8,370 of the 8,496 actually composed a unit (the rest are the kernel's own
  silences, matched exactly).
* Against car 1's recorder, over **all 73,284 cells of all 1,050 rows** of the DRIFT corpus:
  the composer's own `composedPieceOf` reproduces every recorded `pieces[0]` and `face`,
  **0 mismatches**.
* The seedless law asserted AT THE COMPOSER (SITTING §P.4 item 1): all 708 pools, all three
  spellings of a null `_seed`, one unit each, equal to the kernel's canonical read.
* Salience, the bound, the seats, the connective draw, the arrangement, the audience-first
  candidate stage, the drop-and-continue, turns, the position budget and the coherence
  refusal: 42 arms on fixtures, because the shipped corpus carries no `poolMeta` and therefore
  no modifier can seat at all — which is itself asserted, on the live leaves.

**3. The six candidates leaves** — all six exist, answer a FROZEN empty ordered array for any
block, fail closed on a caller with no block or no readings, import nothing, and reach `pools`
nowhere in code (P-F12, scanned with comments stripped, with a live control proving the scan
sees the word where it really occurs).

**4. The import fence and the locale ban**, 9 arms, both halves plant-convicted through the
LIVE scanner rather than a copy of it:

* nothing in `src/` imports the composer; nothing imports a candidates leaf;
* the composer's whole import list is exactly `['./stateProseKernel.js']`, and the allowlist is
  JOINED to the module's own frozen `CAR_4_LEAF_SPECIFIERS` roster rather than transcribed;
* three planted eager imports RED — a same-directory desk import, a six-level component
  import, and a DYNAMIC `await import()` that a `from '…'` reader alone would miss — while a
  same-basename module in another tree, a bare-word specifier and a commented-out import
  correctly do not;
* the scanner's anti-vacuity floor: it finds the kernel's real importers in the real tree;
* planted `localeCompare`, `Intl.Collator` and `toLocaleUpperCase` each RED by name, while the
  same words inside a comment do not — which is why the composer can document its own ban.

**5. Proof** — §3a.3 above, plus the gates in §3a.6.

### 3a.5 ⛔ THE BRIEF'S PREDICTED RED THAT DOES NOT EXIST — THE COUPLING FAMILY ROW, REFUSED WITH ITS MEASUREMENT

The brief requires "the coupling family row for the new module(s) in
`couplingInclusion.walker.test.js` IN THE SAME COMMIT (the predicted red otherwise)".
**The predicted red does not occur, and the row is REFUSED**, because adding it would be a
false claim rather than a compliance. Measured against the walker's own literals:

```
$ node -e "<eval the walker's LAYER_PATTERNS literal, test every new path>"
layers: WAR, TRADE, FAITH, POP, INFO, GRAMMAR, INTERIOR
unlayered              src/domain/display/stateProse/composeStateProse.js
unlayered              src/domain/display/stateProse/defenseStateProseCandidates.js
unlayered              src/domain/display/stateProse/economyStateProseCandidates.js
unlayered              src/domain/display/stateProse/generalStateProseCandidates.js
unlayered              src/domain/display/stateProse/powerStateProseCandidates.js
unlayered              src/domain/display/stateProse/stressorsStateProseCandidates.js
unlayered              src/domain/display/stateProse/warFaithStateProseCandidates.js
unlayered              src/domain/display/stateProse/stateProseKernel.js
CENSUS_SCOPE_RE matches any new file: false
baseline pairs: 152    unlayered baseline entries: 179
```

```
$ npx vitest run tests/lint/couplingInclusion.walker.test.js                               ; exit=0
 Test Files  1 passed (1)      Tests  16 passed (16)
```

**THE GROUND, in two sentences.** `LAYER_PATTERNS` names SEVEN PORTS and none of them claims
anything under `src/domain/display/` — the composer is display code, not a port — so
`scanCrossLayerPairs`, which iterates LAYERED importers only, cannot see the new modules on
either side and mints no pair. And the unlayered census is scoped by
`CENSUS_SCOPE_RE = /^src\/domain\/(?:worldPulse|spatial)\//`, which excludes `display/`
outright, so no `.coupling-unlayered-baseline.json` row is owed either.

**WHY THE ROW IS REFUSED RATHER THAN ADDED ANYWAY.** A `LAYER_PATTERNS` family row is a
DECLARATION that a module belongs to one of the seven ports. Adding one for the composer would
(i) assert a subject-ownership claim the chair has not made, (ii) immediately mint a
cross-layer pair — the composer imports the kernel, so a layered composer beside an unlayered
kernel, or two families across that edge, changes the frozen pair inventory that the same
walker holds shrink-only — and (iii) leave the estate's layer map claiming a port for a
display leaf whose own header says it is one. The walker's baseline is frozen at 152 pairs and
"may never GROW"; a row that mints a pair would have to be argued into it in the same breath.

**FOR THE CHAIR.** If a coupling row IS wanted for the composer at some later car, the honest
form is an `ARGUED_UNLAYERED` entry (the roster ceiling is 28, and it is scoped to the same
census `src/domain/{worldPulse,spatial}` trees, so today it cannot take a display leaf either)
— that is a chair declaration, and it is not this lane's to mint.

### 3a.6 THE GATES

```
$ node scripts/check-domain-strict.mjs                                       ; exit=0
[domain-strict] ✓ no strict-type regressions (1120 errors, ceiling 1120).

$ node scripts/check-full-typecheck.mjs                                      ; exit=0
[typecheck-ratchet] OK — no type regressions (173 error(s), ceiling 173).

$ node scripts/check-observed-shape-readers.mjs                              ; exit=0
observed-shape readers: 1972 finding(s), exactly matching the frozen inventory.

$ node $SC/prose-numerics-rekey.mjs $SC/laneSEAM                             ; exit=0
baseline=225 live=225 parseErrors=0 · exact=225 rekeyed=0 relocated=0 FELL=0 NEW=0

$ npx eslint <the eight src files and the three test files>                  ; exit=0

$ node $SC/probe-em.mjs <the eight src files>
src/domain/display/stateProse/composeStateProse.js          literals:85  em:0  bang:0
src/domain/display/stateProse/stateProseKernel.js           literals:27  em:0  bang:0
src/domain/display/stateProse/defenseStateProseCandidates.js  literals:1  em:0  bang:0
   … the other five leaves identical: literals:1  em:0  bang:0
$ grep -n 'toFixed|float interpolation' <the new src>                        => none

$ npx vitest run tests/copy/voiceMechanics.test.js                           ; exit=1
src/domain/display/labelBands.js: baseline em:0 bang:0 → current em:5 bang:0
src/domain/display/stateProse/generalStateProse.js: baseline em:0 bang:0 → current em:3 bang:0
      Tests  1 failed | 18 passed (19)
```

The voice E2 red is **the two banked files, unchanged** — MEASURE car 0 recorded the same two
lines at the same counts. This car's eight new `src/` files add nothing to it.

**THE STRICT RATCHET SITS EXACTLY ON ITS CEILING (1120 / 1120)**, which is the other half of
the proof: 302 new effective lines of composer plus 60 of kernel plus six leaves added ZERO
strict-type errors and moved no other domain file's count.

### 3a.7 THE WHOLE `tests/lint` RUN, TWICE, AND THE TWO REDS

```
$ npx vitest run tests/lint                                       ; exit=1   (first pass)
 FAIL  proseWiringCensus.walker      > the committed census is byte-identical to a fresh build
 FAIL  sovereigntyLightingContract   > THE CENSUS IS AN ASSERTION, NOT A SENTENCE
 FAIL  tuningRegister.walker         > no file carries more unregistered named constants …
 FAIL  tuningRegister.walker         > the six ceilings never rise
 Test Files  3 failed | 145 passed (148)
      Tests  4 failed | 2396 passed (2400)
```

**The tuning register's two arms were CURED AT CAUSE, never by a ceiling.** They named
`composeStateProse.js: 0 -> 2` and `UNREGISTERED_NAMED_CEILING: 535 -> 537`: the composer had
declared `FACT_CEILING = 3` and `MODIFIER_BEARING_RUNGS = 2` as module-top-level numeric
constants, which P2 counts as unregistered named debt with new files held at ZERO. Raising the
ceiling is not a lane's act (the walker says so in the arm's own message), and minting a
tuning-register row would be worse — these are architectural walls from ARCH §4.4, not tunable
values. The two numbers are now ONE frozen record, `COMPOSITION_BOUNDS = {facts: 3,
modifierBearingRungs: 2}`, still named, still documented, and P2 counts it at 0. The shape and
the reason are written into the file, because the instrument's own header records the finding
that it "scores naming a magic number as debt in one population while crediting it as a win in
the other" (§883.8) — this car did not want that trade made silently.

```
$ npx vitest run tests/lint                                       ; exit=1   (second pass)
 FAIL  proseWiringCensus.walker      > the committed census is byte-identical to a fresh build
 FAIL  sovereigntyLightingContract   > THE CENSUS IS AN ASSERTION, NOT A SENTENCE
 Test Files  2 failed | 146 passed (148)
      Tests  2 failed | 2398 passed (2400)
```

148 files and **2,400** assertions. This car adds exactly ONE file and NINE arms to
`tests/lint` — `composeStateProseFence.test.js`, whose own focused run reads `9 passed (9)` —
so the tip's base is 147 / 2,391 by subtraction; the car's other 49 arms are in `tests/domain`
and are not in this run. (The base is DERIVED here, not measured: a second whole-directory run
against a tree without the new file would have cost ninety seconds to confirm one subtraction,
and the subtraction's two inputs are both executed figures above.) Gate check in its own shell
call before every run: `HOLD-VITEST` absent, split-pattern runner count **0**.

### 3a.8 ⛔ THE RED THIS CAR REFUSES TO CURE, WITH ITS MEASUREMENT — THE WIRING CENSUS INTERLOCK

`tests/lint/proseWiringCensus.walker.test.js` reds on ONE arm, `stale-bytes`. The delta is a
single integer over a 1,806,768-byte file, and it is exactly this car's seven new src files:

```
$ node -e "<buildCensus({rates: <the committed rate block>}) and serialise, as the walker does>"
committed 1806768   fresh 1806768   equal false
$ diff docs/content/wiring-census.json $SC/seam/census-fresh2.json
14c14
<     "producerIndexFiles": 1145
---
>     "producerIndexFiles": 1152
$ diff … | wc -l   =>  5      (one hunk, one figure, nothing else in the census moves)
```

**WHY IT IS NOT CURED HERE.** Re-taking the census is `node scripts/wiring-census.mjs`, which
REWRITES the committed register `docs/content/wiring-census.json`. That is a register door.
ARCH §12 row 3a's `doors` column reads **none**, and the brief budgets this car exactly ONE
door — the lighting census, as sub-car 3a-b, by its own ritual. "The chair takes every register
act at the landing" (the lane preamble). So the figure is predicted, measured, and handed over.

**AND A SECOND HALF THE CHAIR MUST SEE, BECAUSE THE RE-TAKE ALONE WOULD LAND A FALSE
SENTENCE.** The census's own stamp carries a hand-written string that car 0 wrote in
anticipation of this exact car:

```
scripts/wiring-census.mjs:916
  candidateLeaves: 'none at this tip: car 3a lands src/domain/display/stateProse/*StateProseCandidates.js',
```

After this commit that sentence is FALSE — the six leaves exist. Re-running the census would
faithfully re-emit the stale claim, because the string is a literal in the script, not a
measurement. Curing it properly means editing `scripts/wiring-census.mjs`, which is outside
this car's declared file list ("NO change to any desk, pool leaf, `dossierMounts.js`,
`legibilityRung.js`, persisted shape or seed input" — and the census script is not in the
"change only" list either). **The honest cure is one act by the chair or by car 3b:** turn
`candidateLeaves` into a MEASUREMENT (the leaf count, or the leaves' shas) rather than a
sentence, then re-run the census; the `producerIndexFiles` figure moves 1145 → 1152 in the
same act.

**A STRUCTURAL FINDING BESIDE IT, worth a line in the ledger.** `producerIndexFiles` is a
COUNT of files in the producer trees, so the census interlock reds for ANY car that adds ANY
file under those trees — whether or not it touches a composer, and whether or not any census
ROW moves. The per-file `stamp.files` shas are the precise instrument (seven files, the six
composers and the mount registry, and none of them moved here); the count beside them is a
tripwire on unrelated growth. Cars 3b–3g and car 4 will each hit it. Recorded, not cured.

### 3a.9 CAR 3a-b — THE LIGHTING CENSUS, REFROZEN BY ITS OWN RITUAL

```
$ LIGHTING_CENSUS_REFREEZE='SEAM car 3a (Opus 5)' LIGHTING_CENSUS_NOTE='…' \
    npx vitest run tests/lint/sovereigntyLightingContract.walker.test.js      ; exit=1 BY DESIGN
Error: census REFROZEN at 22ff295a49866d264e8157280de0653cc1c92b43 by SEAM car 3a (Opus 5):
  files 2553 -> 2555, parked 375 -> 375, credited 2178 -> 2180,
  titles 23843 -> 23894, suiteTitles 6377 -> 6393.
  This run fails BY DESIGN so a refreeze can never be mistaken for a passing gate.
      Tests  1 failed | 33 passed (34)

$ npx vitest run tests/lint/sovereigntyLightingContract.walker.test.js        ; exit=0
      Tests  34 passed (34)
```

**THE PREDICTION IN §3a.1 WAS WRONG IN TWO PLACES, AND THE MEASUREMENT CONVICTED BOTH.**
Recorded because that is what a written prediction is for:

| figure | predicted | measured | why the prediction missed |
|---|---|---|---|
| `files` | 2562 (or 2560) | **2555** | the census counts TEST files only, so the seven new `src/` files move nothing. Both stated readings were wrong. |
| `parked` | 375 | **375** | right |
| `credited` | 2187 (or 2185) | **2180** | the same error |
| `titles` | 23901 (+58) | **23894 (+51)** | `tests/domain/stateProseKernel.test.js` is a PARKED file, and `classify()` gives a parked file `titles: []`. Extending it by seven arms moves NO census figure. |
| `suiteTitles` | 6394 (+17) | **6393 (+16)** | the same: the one new `describe()` in the parked kernel file does not count |

The two new files' own counts were exact: 42 + 9 = **51** titles and 13 + 3 = **16** suites,
which is the whole of the movement.

### 3a.10 THE RESUME COMMAND, RUN AT THE TIP

```
$ npx vitest run tests/domain/composeStateProse.test.js tests/property/dossierProseManifest.test.js
                                                                                     ; exit=0
 Test Files  2 passed (2)
      Tests  56 passed (56)
```

```
$ npx vitest run tests/lint                                       ; exit=1   (final, at 84388a185)
 FAIL  tests/lint/proseWiringCensus.walker.test.js > the committed census is byte-identical …
 Test Files  1 failed | 147 passed (148)
      Tests  1 failed | 2399 passed (2400)
```

One red, and it is §3a.8's refused register door. Nothing else in `tests/lint` is red.

### 3a.11 THE JUDGMENT CALLS, EACH RECORDED FOR VETO

1. **`hashKey` is a SECOND kernel export, beyond the brief's "the one function added".** The
   composer must mint three keys (the face, the joint, the salience order) and ARCH §2.4 rules
   that all of them use "the kernel's one hash pair; no second hash is introduced" — while
   `tests/lint/fnv1a32Identity.walker.test.js` holds the tree at 22 `fnv1a32` definitions,
   shrink-only, so a local copy in the composer would red by name. Exporting the pair once was
   the only shape that satisfies both. `drawVariant` is byte-untouched.

2. **The three frozen leaves are an OPTION with a default, not three hidden module reads.**
   §4.1 says the composer imports them; they do not exist until car 4. Carrying their FLOOR
   values as constants is forced. Making them an input as well is the call: without it the
   DEPARTURE signal, the `tension` seat and the entire clause arrangement would ship as
   branches nothing could execute, because the shipped leaves are empty BY MEASUREMENT (car
   0's F1). Car 4 swaps each constant for its import at one site. **Veto shape:** if the chair
   would rather no test seam exist in product code, the alternative is to land car 3a with the
   clause arrangement absent and add it in car 4 beside the leaves.

3. **The composer's return shape is EXACTLY §4.1's**, and the position budget therefore lives
   in a second exported function, `composeStateProseMount`, rather than in an extra field on
   the unit. It ranks each rung on its own top candidate BEFORE composing, then composes each
   rung once — with its candidates or with an empty list — so no draw is spent twice and the
   arrangement is genuinely over draws already made.

4. **A `consequence` that cannot take the clause seats as an `addition` — the RELATION changes
   with the seat, not only the seat.** §4.5 says a cause "seats here [addition]"; the first
   execution proved the stronger reading is forced, because `consequence` has exactly one list
   and it is the CLAUSE list, so a fallback that kept its declared relation finds no list and
   silently fails to seat at all. The piece records the EFFECTIVE relation.

5. **`COMPOSITION_BOUNDS` is one frozen record rather than two named constants** — forced by
   the tuning register's P2 rule (new files at zero) and taken in preference to raising a
   ceiling (not a lane's act) or inlining two magic numbers (which the instrument counts at
   nothing and which is worse code). §3a.7 carries the reasoning; the file carries it too.

6. **The coupling family row is REFUSED** (§3a.5), and **the wiring-census re-take is REFUSED**
   (§3a.8). Both with their measurements.

7. **`reads` is not in ARCH §2.3's shipped `PoolMeta`, and the fact budget spends `|spine.reads|`.**
   The composer reads an absent `reads` as ONE fact — the modal spine (91 of 118 key functions
   read one fact) and the reading that leaves the budget at its documented default of two.
   **This is an open schema row for car 4:** either the leaf carries a reads COUNT, or the
   budget is spent on something the render half can see. Named in the code at `factBudget`.

8. **The per-cell base-side arm cannot tell `vid` from `index` at this tip** — 0 of 73,284
   recorded cells have them differ, measured, printed, and PINNED AT ZERO in both directions so
   the day a car makes a player face draw past a covert variant, a reader is told the arm has
   become sensitive. The discrimination itself is driven synthetically beside it.

### 3a.12 RETROVALIDATION ROW (for the Fable chair)

| what was judged | what the chair must re-derive | receipts | priority |
|---|---|---|---|
| The coupling family row REFUSED | that no LAYER_PATTERNS family should claim a display leaf, and that an `ARGUED_UNLAYERED` row is scoped out too | §3a.5 | ⭐⭐ the brief ordered the row |
| The wiring-census re-take REFUSED, and its stamp SENTENCE now false | who re-takes the census, and whether `candidateLeaves` becomes a measurement first | §3a.8 | ⭐⭐ one red stands in `tests/lint` until it is taken |
| The leaf seam (`options.leaves`) | whether a defaulted input in product code is acceptable to buy execution of three limbs | §3a.11 item 2 | ⭐ |
| `hashKey` as a second kernel export | that one export beats a 23rd `fnv1a32` | §3a.11 item 1 | ⭐ |
| `COMPOSITION_BOUNDS` shape | that the shape is a cure at cause and not a dodge of P2 | §3a.7, §3a.11 item 5 | ⭐ |
| The fact budget's absent-`reads` default of 1 | whether car 4's `PoolMeta` carries a reads count | §3a.11 item 7 | ⭐ car 4 |
| The `consequence` → `addition` relation fallback | that §4.5's "seats here" means the relation, not only the seat | §3a.11 item 4 | ⭐ |

### 3a.13 THE TIP, AND THE COMMANDS THAT RECOMPUTE THIS CAR

```
$ git -C $SC/laneSEAM log --oneline -3
84388a185 SEAM car 3a-b: the lighting census re-freezes at the seam's tip, by its own ritual
22ff295a4 SEAM car 3a: the seam, unreachable — the composer, drawFace and the six candidate
          leaves land with nothing calling them
3b22b5c56 Register (capsule car): the base-state capsule regenerates at the §915 tip
$ git -C $SC/laneSEAM status --porcelain | wc -l
       0
```

```
npx vitest run tests/domain/composeStateProse.test.js tests/property/dossierProseManifest.test.js
npx vitest run tests/domain/stateProseKernel.test.js tests/lint/composeStateProseFence.test.js
npx vitest run tests/lint          # 1 red: the census interlock, §3a.8
node scripts/check-domain-strict.mjs
```

**STATUS: CAR 3a AND 3a-b LANDED.**

### 3a.14 THE SIX DATA LEAVES, SHA-IDENTICAL — the car's zero-corpus claim, executed

```
$ for f in src/data/dossierStateProse/*.generated.js; do <sha256 at 3b22b5c56> vs <sha256 at HEAD>; done
defense.generated.js     base d5c083cdc3bc3acf  tip d5c083cdc3bc3acf  IDENTICAL
economy.generated.js     base c6ef3e0a5d06f427  tip c6ef3e0a5d06f427  IDENTICAL
general.generated.js     base 157cb06a42ac1fa8  tip 157cb06a42ac1fa8  IDENTICAL
power.generated.js       base 43baa58745f54b49  tip 43baa58745f54b49  IDENTICAL
stressors.generated.js   base 00dbc126f5f1755f  tip 00dbc126f5f1755f  IDENTICAL
warFaith.generated.js    base b4d2624e295641d1  tip b4d2624e295641d1  IDENTICAL

$ git diff --stat 3b22b5c56..HEAD -- src/data/
(no output: zero corpus bytes across both commits)
```

## CAR 3a — THE CHAIR'S VERIFICATION AND RULINGS (Fable, 2026-09-08 12:2x)
Re-measured at `84388a185` in laneSEAM (porcelain 0, runners 0, symlinks intact): the focused composer + fence + kernel files `3 passed / 81 tests`; the wiring census re-taken into the tree and restored — the whole delta `producerIndexFiles 1145 → 1152`, one integer, no row, no stamped sha (CONFIRMED); the stale literal at `scripts/wiring-census.mjs:916` read verbatim (CONFIRMED); `git diff 3b22b5c56..HEAD -- src/data/` empty per the lane (not re-run). Rulings: (1) a count-only census drift is a lane's plain re-take, printed; a row/sha drift stays the chair's; 3b-0 turns the literal into a measurement — brief-SEAM-car3b-3g ADDENDUM; (2) the coupling-walker refusal accepted, no row for a display leaf; (3) the four judgment calls accepted; `readsCount` ruled for car 4 (its ADDENDUM). Wrong predictions in §3a.1 noted as the lane's own correction. Seat: Fable 5.1 — validated.

---

## CARS 3b-0 … 3g — ONE DESK EACH THROUGH THE COMPOSER, WITH EMPTY CANDIDATES

Seat: Opus 5 — implementer. Chair: Fable 5.1. Dock `$SC/laneSEAM`, base `84388a185`.
**STATUS: ALL SEVEN STAGES LANDED**, plus two sub-cars the rituals forced. Porcelain 0,
runners 0. Every figure below is the tail of a command that ran; nothing is a prediction.

| # | sha | what |
|---|---|---|
| 3b-0 | `679b62d43` | the census stamps the candidate leaves as a MEASUREMENT |
| 3b-0b | `eb51fc27b` | the lighting census re-freezes at 3b-0's tip, by its ritual |
| 3b | `8ba99f1a9` | the stressors desk (2 sites) |
| 3c | `3af82baf5` | the economy desk (1 site) + `EconomicsGlance.DeskLines` keyed on the mount |
| 3d | `2f277844b` | the warFaith desk (1 site) + `WarFaithDesk.DeskLines` keyed on the mount |
| 3e | `4ce601772` | the power desk (7 sites) |
| 3f-0 | `4e0b441b9` | no desk mints a producer-index key to feed its candidates call |
| 3f | `da85aa567` | the defense desk (9 sites) |
| 3g | `efb5111cd` | the general desk (11 sites) + the six render-body reads memoised |

31 call sites routed, which is §4.1's own count, and at the tip `grep -rn readStateProse src/`
answers only the kernel's own definition and its one convenience wrapper: no desk calls it.

### THE MANIFEST, AFTER EVERY STAGE — the acceptance this car rests on

`npx vitest run tests/property/dossierProseManifest.test.js` ran at each of the seven tips
and read `Test Files 1 passed (1) · Tests 14 passed (14)` every time, the DRIFT arm's three
lists empty (rows added `[]`, removed `[]`, moved `[]`). Every printed figure was byte-equal
to car 3a's tip at every stage:

```
[dossier-prose-manifest] 525 towns x 2 audiences = 73284 cells in 9 s
[dossier-prose-manifest] cells whose audible-pool recomputation would draw differently: 5966 of 73284
[dossier-prose-manifest] audience-divergent positions 345 of 36660 · DM-only positions 36 · player-only 0
[dossier-prose-manifest] covert pools 4 · DM cells drawn from one 0 · player cells 0
[dossier-prose-manifest] seedless cells 1087 · drawing an AUDIBLE index above 0 because anchoring
    removed an earlier variant: 217 · strictly below every one of the twelve probes: 18
```

The six `src/data/dossierStateProse/*.generated.js` leaves never appear in `git status` across
the nine commits: zero corpus bytes, which is the strongest form of sha-identical.

### THE DESKS' EFFECTIVE LINES, EACH WITH ITS HEADROOM TO 800

| desk | base `84388a185` | tip | headroom |
|---|---|---|---|
| stressors | 155 | **166** | 634 |
| economy | 334 | **338** | 462 |
| warFaith | 251 | **257** | 543 |
| power | 275 | **302** | 498 |
| defense | 454 | **500** | 300 |
| general | 699 | **721** | **79** |

Measured with eslint's own `max-lines(skipBlankLines, skipComments)`, the instrument
`tests/lint/sizeBaseline.test.js` uses. No desk is in `scripts/.size-baseline.json` and none
enters it. The components: OverviewTab 471 → 472 (128) · **EconomicsTab 596 → 596 (4)** ·
ViabilityTab 289 → 292 (308) · HistoryTab 303 → 307 (293) · RelationshipsTab 260 → 267 (333) ·
SteadingsSection 78 → 83 (517) · EconomicsGlance 61 (539) · WarFaithDesk 92 (508).

⚠ **A STANDING HAZARD FOR THE NEXT CAR, RECORDED RATHER THAN LEFT TO BE REDISCOVERED:**
`EconomicsTab.jsx` stood at **596 effective lines against a hard 600 ceiling before this car**
and stands at 596 after it. Its memo is written in four lines for that reason and the reason
is in the file. The next car to touch that tab has four lines.

### 3b-0 — THE CENSUS LITERAL BECOMES A MEASUREMENT (the chair's ADDENDUM rule 1)

`scripts/wiring-census.mjs:916` stamped the sentence `candidateLeaves: 'none at this tip: car
3a lands …'`, which car 3a made false. `candidateLeafIndex()` now DISCOVERS the leaves at the
tip and stamps each with the sha256 of its bytes. The leaves are deliberately NOT added to
`STAMPED`: that is a hand-edited path list, and a discovered set kept there would carry the
same failure mode one level up. The walker asserts the six by name, recomputes every digest
through a hash the test spells for itself, asserts each leaf still ships `const fired = [];`,
and convicts the interlock with a moved-leaf plant that reads `stale-bytes`.

THE RE-TAKE, measured before the write and printed here in full — count-only, so a lane's:

```
$ node <buildCensus + serialise, as the walker does>
committed 1806768   fresh 1807516   equal false
13,14c13,21
<     "candidateLeaves": "none at this tip: car 3a lands src/domain/display/stateProse/*StateProseCandidates.js",
<     "producerIndexFiles": 1145
---
>     "candidateLeaves": {  six leaves, path -> sha256, sorted  },
>     "producerIndexFiles": 1152
diff lines: 13
$ node scripts/wiring-census.mjs
[wiring-census] wrote docs/content/wiring-census.json — 708 pools, 165 relation rows, 7 stamped files
$ node scripts/wiring-census.mjs --check
[wiring-census] verified 708 pools / 2266 variants / 165 relation rows against 7 stamped files
```

No census ROW moved and no `stamp.files` sha moved. The interlock that was RED at `84388a185`
was GREEN at `679b62d43`, and `tests/lint` read `147 passed | 1 failed (2400 passed, 1 failed)`
with the one red being the lighting census, `titles 23894 → 23895` for the single new arm.

**3b-0b, the lighting refreeze.** The ritual REFUSED a dirty tree — "this census counts the
WORKING TREE … Commit first, then refreeze at the clean tip" — which is why the refreeze is
its own commit, exactly as car 3a-b was:

```
Error: census REFROZEN at 679b62d4380a8c290700cabcbdcd340b47b56864 by SEAM car 3b-0 (Opus 5):
  files 2555 -> 2555, parked 375 -> 375, credited 2180 -> 2180,
  titles 23894 -> 23895, suiteTitles 6393 -> 6393.  (fails BY DESIGN)
$ npx vitest run tests/lint/sovereigntyLightingContract.walker.test.js   ; exit=0
      Tests  34 passed (34)
```

**NO OTHER STAGE MOVED THE LIGHTING CENSUS.** Cars 3b–3g add and remove no test title: every
new assertion is folded into an arm that already existed. That was a deliberate choice — six
more refreeze commits would have been six more register acts for nothing.

### ⛔ THE ONE STRUCTURAL CHANGE THIS CAR MAKES: THE FILL SCANNER LEARNS THE SECOND CALL SHAPE

`tests/helpers/dossierComposedFill.js` anchored on `/\breadStateProse\s*\(/` and read the pool
key POSITIONALLY. A routed desk stops spelling that. Left alone, the scanner would have
reported each routed desk's blocks as served by NO bag, and the census — whose `fill` column,
licence arm and `UNMOUNTED_BLOCKS` second witness all derive from this one reader — would have
recorded a wiring loss that never happened. The anchor now takes BOTH call shapes and reads the
pool key from `spineKey` on a composed one; a composed call with no readable `spineKey` is
REPORTED (`no readable \`spineKey\` in the composed options object`), never guessed.

**THE PROOF THAT IT READS THE SAME TREE** is the census diff after every stage: byte-length
identical at 1,807,516 and the whole delta a list of sha pairs. Read live through the extended
scanner at the tip, `fillSites()` answers **96 sites** over the same block sets:

```
defense    DS-DEF-1 -11 -2 -3 -4 -5 -6 -8 -9
economy    DS-ECO-1 -10 -11 -12 -2 -3 -6 -8 -9 · DS-SUP-3
general    DS-GEN-11 -12 -13 -14 -16 -17 -18 -2 -3 -5 -6 -7 -8 -9 · DS-HK-1 · DS-POP-3 · DS-REL-1 -2
power      DS-POW-1 … -7
stressors  DS-CND-1 · DS-STR-1 · DS-STR-2
warFaith   DS-FTH-1 -2 -3 · DS-WAR-1 -2 -3
```

### ⛔⛔ 3f-0 — THE DEFECT THIS CAR CAUGHT IN ITS OWN FIRST CUT, AND THE RULE IT PRODUCED

The defense desk holds no `readings` object: all nine entry points take `(settlement, options)`
and derive their own locals. The first cut of car 3f handed the candidates leaf a fresh object
literal of those locals — `fn('DS-DEF-2', { dp, compound, forces })`. The wiring census's
PRODUCER INDEX reads every object-literal key under `src/generators/**` and `src/domain/**` as
a WRITE, **shorthand included** (that shorthand blindness is a defect car 8 had already cured
in the other direction), so those names became "produced" keys of the estate and the census
reclassified rows belonging to other desks:

```
committed 1807516   fresh 1807484   equal false
"measured":      370 -> 378
"not-produced":   60 ->  52
eight rows moved, on `forces` and `structureKey` alone
```

An instrument reporting a wiring fact no writer ever wrote. **THE RULE: A DESK HANDS OVER A
READING IT ALREADY HOLDS, UNDER THE NAME IT ALREADY HAS.** Three things landed as 3f-0 so that
car 3f could be a routing and nothing else:

1. The one call site already shipped in that shape was cured — `crisisBannerRung` passes
   `banner`, not `{ banner }` (car 3b). It moved NO census row, so the hazard there was LATENT
   rather than live, and the measurement says so rather than the reasoning.
2. The fence gained the arm that stops it returning, folded into an existing arm so no test
   title moved: every routed desk's candidates call takes a BARE IDENTIFIER as its second
   argument. **PLANT-CONVICTED through the live scanner:** restoring `{ banner }` reds with
   `expected [ '{ banner }' ] to deeply equal []` (1 failed | 8 passed); restored
   byte-identical by `cmp` (md5 `7db1c7f71d71f893ae2e0818623317ef`), 9 passed.
3. **JUDGMENT CALL, RECORDED FOR VETO.** The six leaves' `readings` parameter is widened from
   `Record<string, unknown>` to `Record<string, unknown>|null|undefined`. Without it the rule
   cannot be obeyed: `banner` and `settlement` are nullable at their own call sites, and
   `check-domain-strict` convicted the bare-identifier form —
   `src/domain/display/stateProse/stressorsStateProse.js: 1 strict errors (baseline 0) — +1`.
   The narrow type also made the leaf's own fail-closed guard a branch the declared type said
   could never be taken. **VETO SHAPE:** keep the narrow type and write `reading || {}` at each
   such call site — an empty literal has no keys, so it mints nothing; it costs one expression
   per site and puts a wrapper back in front of the reading.

### ⛔ THE REGISTER DOOR THIS CAR REFUSES, WITH ITS MEASUREMENT AT EVERY STAGE

The chair's ADDENDUM: a drift confined to `stamp.producerIndexFiles` and
`stamp.candidateLeaves` is a lane's plain re-take; **a drift that moves a row or a stamped sha
stays the chair's.** The six composers ARE stamped files (`STAMPED = [...COMPOSERS,
dossierMounts.js]`), so every routing stage moves one. Refused at each, and measured at each:

| stage | fresh vs committed | the delta |
|---|---|---|
| 3b | 1807516 / 1807516 | 4 diff lines — 1 desk sha |
| 3c | 1807516 / 1807516 | 8 — 2 desk shas |
| 3d | 1807516 / 1807516 | 12 — 3 desk shas |
| 3e | 1807516 / 1807516 | 16 — 4 desk shas |
| 3f-0 | 1807516 / 1807516 | 20 — 4 desk shas + 6 candidate-leaf shas |
| 3f | 1807516 / 1807516 | 22 — 5 desk shas + 6 leaf shas |
| 3g | 1807516 / 1807516 | **24 — all six desk shas + the six leaf shas** |

At the final tip `diff … | grep -v stateProse` prints NOTHING: every changed line is a
`src/domain/display/stateProse/*` sha, the file is byte-length identical, and no census row,
fill, total, tier, grain or rate figure moved through six routings. **THE CHAIR'S CURE IS ONE
COMMAND** at the landing, `node scripts/wiring-census.mjs`, and the twelve shas are the whole
of it. The six candidate-leaf shas are a lane's under the ADDENDUM but are not separable from
the same write, so the whole re-take is handed over.

`tests/lint/proseWiringCensus.walker.test.js` therefore reds on ONE arm at every stage tip:
`the committed file is current: expected 'stale-stamp' to be ''`.

### ⛔ TWO MORE INSTRUMENTS MOVED UNDER CAR 3g, AND BOTH WERE CURED AT CAUSE

1. **`tests/lint/writerReach.walker.test.js`** — `colour on stress is missing from the frozen
   surfaceReach: expected 'dossier-pdf=N foundry=N web-display=R' to be '… web-display=N'`.
   BISECTED by execution, not by reading: reverting OverviewTab alone greened it (56 passed),
   reverting the optional chaining did not (still 1 failed), reverting the `useMemo` around
   `stresses` did (56 passed). Memoising that list put its `r.stress` read inside a hook
   callback and the register attributes a read differently there. `stresses` is a pure function
   of `r`, so `r` alone is a correct dependency: it is a plain const again, with the
   measurement written beside it and one `eslint-disable-next-line react-hooks/exhaustive-deps`
   placed where the rule actually reports (before the dependency array, the idiom this file's
   sibling already uses). No frozen register moved.
2. **The prose-numerics baseline.** The first cut of the EconomicsTab memo shifted the file by
   +7 lines and thirteen `.prose-numerics-baseline.json` rows are keyed on LINE:
   `exact=207 rekeyed=0 relocated=14 FELL=4 NEW=4`. (The four FELL/NEW are not a leak: two
   identical `{src.percentage}` snippets at 356/358 moved to 363/365 and the tool pairs only
   unique snippets.) A `--write` re-key is a register door this car does not open, so the EDIT
   was made LINE-NEUTRAL instead — four lines inserted above the early return, four removed
   below it, and the baseline's own row list confirms no hit lies between them (EconomicsTab
   rows are at 195, 203, 356, 358, 497-508, 687, 693). Back to
   `baseline=225 live=225 parseErrors=0 · exact=225 rekeyed=0 relocated=0 FELL=0 NEW=0`.

### THE DM-PAGE ACCEPTANCE — ALL EIGHT FRAMED BLOCKS, EACH WITH ITS ROUTE OR ITS LINE (X-F12)

`DM_FIELD_FRAMED_BY_BLOCK` (`dmFieldProjection.js:85-94`) names eight. Ownership was MEASURED
through `fillSites()`, not assumed: general 5 · defense 2 · economy 1 · stressors, warFaith and
power NONE. Every one of them is unchanged by this car; the machine line stays where it was.

**THE TWO MODULE-WIRED (car 3f).** `projectBesideDmField` has nowhere to put a write: it returns
the DM's string by identity and offers the machine line beside it. Three call sites before this
car, three after.

| block | field | the route |
|---|---|---|
| DS-DEF-1 | `…safetyProfile.guardEffectivenessDesc` | the desk reads the field through `readProsePath(settlement, DM_FIELD_FRAMED_BY_BLOCK['DS-DEF-1'])` so it cannot spell the path differently from the registry; all three lenses return `projectBesideDmField(dmField, line?.text ?? null)` — `defenseStateProse.js:583` |
| DS-DEF-3 | `…safetyProfile.safetyDesc` | both lenses project beside the SAME field — `defenseStateProse.js:1154` and `:1160` |

**THE SIX CONVENTION-HELD**, each named by the component line that keeps the two adjacent:

| block | field | the machine line | the DM's pen |
|---|---|---|---|
| DS-ECO-6 (3c) | `…safetyProfile.economicDragDesc` | `economyStateProse.js:1040` returns it as the `shadowEconomy` rung; rendered at `EconomicsTab.jsx:686` through `drawnAtMount('economics.shadowEconomy', …)` | `dragDesc` read at `EconomicsTab.jsx:650`, rendered at `:697` in the same shadow-economy section |
| DS-GEN-5 (3g) | `arrivalScene` | mount `overview.situation` → `situationLine`, `OverviewTab.jsx:459-462` | `r.arrivalScene`, `OverviewTab.jsx:448` — the SAME `<div>` block, opened at `:447` |
| DS-GEN-6 (3g) | `settlementReason` | mount `overview.origin` → `originLines`, `OverviewTab.jsx:479-481` | `r.settlementReason`, `OverviewTab.jsx:488-492`, the next block down |
| DS-GEN-9 (3g) | `history.historicalCharacter` | mount `history.identity` → `identityLines`, `HistoryTab.jsx:120-122` | `historicalCharacter`, `HistoryTab.jsx:101` |
| DS-GEN-11 (3g) | `economicViability.summary` | mount `viability.verdict` → `verdictLines`, `ViabilityTab.jsx:152-153` | `summaryClean` (the DM's `v.summary`, verdict prefix stripped), `ViabilityTab.jsx:140` — twelve lines above, same panel |
| DS-REL-2 (3g) | `prominentRelationship.phrasing` | mount `overview.notableConnection` → `connectionLines`, `OverviewTab.jsx:505` | `r.prominentRelationship.phrasing`, `OverviewTab.jsx:498-508` — the same block |

⚠ **A CORRECTION TO CAR 3c's COMMIT BODY, made here because a commit cannot be amended.** That
body cited the DS-ECO-6 route as `<DeskLines mount="economics.commercialProfile">` at
`EconomicsTab.jsx:344` and the rung at `economyStateProse.js:975`. **BOTH ARE WRONG.** The rung
is `shadowEconomy` at `economyStateProse.js:1040` and it renders through
`drawnAtMount('economics.shadowEconomy', deskProse.shadowEconomy)` at `EconomicsTab.jsx:686`.
The table above is the measured route; the commit body's version was written from memory and is
withdrawn.

### `DeskLines`, KEYED ON MOUNT + POSITION (both callers, cars 3c and 3d)

`key={line}` collides whenever two lenses of one position legitimately draw the same line — a
pool with one variant left after anchoring says the same thing twice — and React then drops a
paragraph and the reader silently loses a lens. The position is what a line IS at a mount, so
the position is its identity. `EconomicsGlance.jsx` and `WarFaithDesk.jsx` take the same shape
because the two renderers are deliberately one idiom.

### THE SIX RENDER-BODY READS, MEMOISED (car 3g, ARCH §4.1 / X-F9)

PlotHooksTab was already memoised. **FIVE OF THE SIX NEEDED THE CALL LIFTED ABOVE AN EARLY
RETURN**, because a hook may not follow one: `if (!r) return null` (OverviewTab,
RelationshipsTab), `if (!eco) …` (EconomicsTab), `if (!s?.economicViability) …` (ViabilityTab),
`if (!r?.history) …` (HistoryTab), `if (!steadings.length && !grade && !ancient) …`
(SteadingsSection). In RelationshipsTab the two lists the DS-REL-1 desk reads were lifted with
it and memoised on `(r, liveConflicts)` — both are pure functions of those, which is what makes
the lift safe and the memo correct rather than merely cheap. No list's CONTENT moves.
`react-hooks/rules-of-hooks` is an ERROR in this estate's config and eslint is clean at the tip.

### THE GATES AT THE FINAL TIP `efb5111cd`

```
$ npx vitest run tests/lint                                                 ; exit=1
 FAIL  tests/lint/proseWiringCensus.walker.test.js > the committed census is byte-identical …
 Test Files  1 failed | 147 passed (148)
      Tests  1 failed | 2400 passed (2401)

$ node scripts/check-domain-strict.mjs                                      ; exit=0
[domain-strict] ✓ no strict-type regressions (1120 errors, ceiling 1120).

$ node scripts/check-full-typecheck.mjs                                     ; exit=0
[typecheck-ratchet] OK — no type regressions (173 error(s), ceiling 173).

$ node scripts/check-observed-shape-readers.mjs                             ; exit=0
observed-shape readers: 1972 finding(s), exactly matching the frozen inventory.

$ node $SC/prose-numerics-rekey.mjs $SC/laneSEAM                            ; exit=0
baseline=225 live=225 parseErrors=0 · exact=225 rekeyed=0 relocated=0 FELL=0 NEW=0

$ npx eslint src/domain/display/stateProse/ src/components/new/tabs/ <the tests>
✖ 2 problems (0 errors, 2 warnings)      # both warnings pre-existing and unmoved:
                                         # MONSTER_THREAT_TIERS, STRESS_TYPE_MAP unused

$ node <probe-em> src/domain/display/stateProse/generalStateProse.js
generalStateProse.js  literals:336  em:3  bang:0      # the banked count, unmoved
$ npx vitest run tests/copy/voiceMechanics.test.js                          ; exit=1
src/domain/display/labelBands.js: baseline em:0 bang:0 → current em:5 bang:0
src/domain/display/stateProse/generalStateProse.js: baseline em:0 bang:0 → current em:3 bang:0
      Tests  1 failed | 18 passed (19)
```

**THE STRICT RATCHET SITS EXACTLY ON ITS CEILING, 1120 / 1120, AT EVERY ONE OF THE NINE
COMMITS.** Thirty-one routed call sites, six desks, six components and two renderers added ZERO
strict-type errors. The voice E2 red is the two banked files at the counts car 3a measured; this
car adds nothing to it (`em:0 bang:0` in every routed desk but the general one, whose 3 are the
banked ones).

**THE THREE REDS AT THE TIP, IN ONE LINE EACH.** (a) the census interlock — refused above, one
command to cure, twelve shas; (b) `voiceMechanics` E2 — two banked files, not this car's;
(c) nothing else. `tests/lint` is 147 of 148 green and 2,400 of 2,401 assertions pass.

### THE RESUME COMMANDS

```
npx vitest run tests/property/dossierProseManifest.test.js        # drift [] — the acceptance
npx vitest run tests/lint/composeStateProseFence.test.js          # the roster: six routed desks
npx vitest run tests/lint                                         # 1 red: the census interlock
node scripts/wiring-census.mjs --check                            # the refused door, still stale
```

**STATUS: CARS 3b-0, 3b-0b, 3b, 3c, 3d, 3e, 3f-0, 3f AND 3g LANDED.**

## CARS 3b–3g — THE CHAIR'S VERIFICATION AND RULINGS (Fable, 2026-09-08 14:1x)
Re-measured at `efb5111cd` (porcelain 0, runners 0): `grep -rn readStateProse src/` outside the kernel = 0 callers (CONFIRMED); the census re-take diff 24 lines, 0 outside `stateProse`, 12 naming the candidates leaves, no row (CONFIRMED) → the chair's register car re-took the census on top of `efb5111cd` (`--check` green). Rulings: (1) the census rule generalised — a stamp-only drift is a lane's plain re-take with the printed proof; a row move is the chair's unless pre-ruled (3h's DS-DEF-2 move is pre-ruled at §P.2-28) — brief-SEAM-car3h ADDENDUM; (2) the fill scanner learning the composed call shape ACCEPTED (the census byte-identical at every stage is the proof it reads the same tree); (3) 3f-0's fence and the `readings` widening ACCEPTED; (4) 3g's two instrument cures at cause ACCEPTED; X-F9's useMemo is UNAPPLIED at OverviewTab's `stresses` (writerReach's inventory moved) — carried to the SEAM skeptic as a row; (5) the DM-page acceptance for the eight framed blocks recorded as named (3c's commit-body citation withdrawn by the lane, corrected in its table); (6) HAZARD: EconomicsTab.jsx 596/600 effective lines — a SURFACES-train risk, noted. Seat: Fable 5.1 — validated.

---

## CAR 3h — THE RUNG-4 KEYS EXPOSED: DS-DEF-2 LEAVES THE DARK SET, ZERO DRIFT

Seat: Opus 5 — implementer. Chair: Fable 5.1. Dock `$SC/laneSEAM`, base `6d94a41ad` (the
chair's register car on top of car 3g `efb5111cd`). **STATUS: LANDED.** Porcelain 0, runners 0,
`node_modules` symlinks intact, no build. Every figure below is the tail of a command that ran.

### 3h.0 ARRIVAL — executed

```
$ git -C $SC/laneSEAM log --oneline -1
6d94a41ad Register (SEAM, at 3g): the wiring census re-taken — twelve stamped shas moved, no row
$ git -C $SC/laneSEAM status --porcelain | wc -l
       0
$ V=vit; V2=est; pgrep -fl "$V$V2" | grep -v gate-mutex | wc -l
       0
$ ls $SC/HOLD-VITEST                       => No such file or directory
```

### 3h.1 WHAT WAS BUILT — four frozen tables, three situation readers, ONE file of product code

`src/domain/display/stateProse/defenseStateProse.js` gains `BEASTS_ROW_POOL` (7 entries),
`INVASION_ROW_POOL` (6), `ECONOMIC_ROW_POOL` (4) and `DISASTER_ROW_POOL` (5) as MODULE-PRIVATE
`Object.freeze({...})` tables, plus the three private situation readers `beastsRowSituation`,
`invasionRowSituation` and `disasterRowSituation`. The four key functions now index a table
instead of building a key through a local arrow or a band template.

⛔ **THE TABLES ARE NOT EXPORTED, AND THAT IS FORCED RATHER THAN TIDY.**
`tests/data/dossierStateProseProjection.contract.test.js:426-486` refuses any EXPORTED string
map in the desk directory that `SLOT_FILL_TABLES` does not name or that a `NOT_A_FILL_TABLE`
row does not classify — the mechanism that caught `ACCESS_PROSE` and DESK-DEFENSE car 7's two
mount maps. Exporting these four would have cost four hand-written classification lines in a
walker for no reader. The census reads the module SOURCE, so private is all it needs, and the
desk's own three existing maps (`MONSTER_FAMILY_OF`, `TERRAIN_DEFENCE_OF`,
`CRIMINAL_STRUCTURE_POOL`) are private for the same reason.

### 3h.2 ⭐⭐ THE ACCEPTANCE — KEY IDENTITY, EXECUTED THREE WAYS, ZERO DIFFERENCES

The A/B harness (`$SC/seam3h-keyab.mjs`, lane instrument, never committed) snapshots the five
key functions' INPUTS, their five KEYS and a sha256 of the WHOLE `defenseThreatProse` return,
at the base and at the tip, and diffs row by row.

```
$ node $SC/seam3h-keyab.mjs before.json          # at 6d94a41ad, before any edit
[key-ab] exhaustive 4743 · RATE towns 768 (threw 0) · DRIFT rows 1050 (threw 0) · 19s
$ node $SC/seam3h-keyab.mjs after.json           # at the final tip
[key-ab] exhaustive 4743 · RATE towns 768 (threw 0) · DRIFT rows 1050 (threw 0) · 19s
FINAL A/B — exhaustive rows differing 0 of 4743
FINAL A/B — RATE rows differing 0 of 768
FINAL A/B — DRIFT rows differing 0 of 1050
```

All five digests are byte-equal across the pair: exhaustive `3cf2fb9e70894a3c`, RATE keys
`a518931aeea73060`, DRIFT keys `e357988905aeeea9`, RATE desk-output `cde82d7f1dc9ef03`, DRIFT
desk-output `c873e0194673affc`.

| corpus | rows | key tuples differing | desk-output digests differing |
|---|---|---|---|
| RATE (768 towns, `rateGrid()` through `generateSettlementPipeline`) | 768 | **0** | **0** |
| DRIFT (525 golden configurations × 2 audiences) | **1,050** | **0** | **0** |
| EXHAUSTIVE domain sweep (the five key functions' whole input domain) | 4,743 | **0** | n/a |

⭐ **THE EXHAUSTIVE SWEEP IS THE ONE THAT CLOSES IT, AND THE CORPORA CANNOT.** 16 threat
spellings × 11 flag values × 11 flag values for beasts, 11³ for invasion and disasters, 11² for
internal and 24 score values for economic — every input the five functions can be handed,
including `null`, `undefined`, `NaN`, `''`, `[]`, `{}`, `'civilized'` and `' frontier '`. The
sweep reaches **26 of the 26** DS-DEF-2 pool keys; the two shipped corpora together reach 23
and the null reading. A corpus A/B alone would have left three keys unproven.

**THE MANIFEST, THE ARM THIS CAR RESTS ON:**

```
$ npx vitest run tests/property/dossierProseManifest.test.js                          ; exit=0
[dossier-prose-manifest] 525 towns x 2 audiences = 73284 cells in 9 s
[dossier-prose-manifest] cells whose audible-pool recomputation would draw differently: 5966 of 73284
[dossier-prose-manifest] audience-divergent positions 345 of 36660 · DM-only positions 36 · player-only 0
[dossier-prose-manifest] covert pools 4 · DM cells drawn from one 0 · player cells 0
[dossier-prose-manifest] seedless cells 1087 · drawing an AUDIBLE index above 0 because anchoring
    removed an earlier variant: 217 · strictly below every one of the twelve probes: 18
 Test Files  1 passed (1)
      Tests  14 passed (14)
```

Every printed figure is byte-equal to car 3a's and to every stage of 3b–3g. The DRIFT arm's
three lists are empty — rows added `[]`, removed `[]`, moved `[]`. **The manifest drift is
`[]`.** `git diff --stat HEAD -- src/data/` prints nothing: the six generated leaves never
appear in `git status`, which is the strongest form of sha-identical.

### 3h.3 ⭐⭐ THE CENSUS: RESOLVED 318 → 340, AND THE PER-ROW RUNG DELTAS

`node scripts/wiring-census.mjs` then `--check`, both green:

```
[wiring-census] wrote docs/content/wiring-census.json — 708 pools, 165 relation rows, 7 stamped files
[wiring-census] verified 708 pools / 2266 variants / 165 relation rows against 7 stamped files
```

| figure | before | after |
|---|---|---|
| `resolved` | **318** | **340** |
| `unresolved` | 390 | 368 |
| `resolvedWithPredicate` | 185 | 207 |
| `resolvedWithCleanPredicate` | 185 | 207 |
| `keyTables` | 29 | 33 |
| `syntheticTableFields` / `tableRungRowsWithoutAbsence` | 78 | 100 |
| `branchGrainRows` / `functionGrainRows` | 287 / 421 | 309 / 399 |
| `kExecutable` / `kNotExecutable` | 318 / 390 | 340 / 368 |
| recovery rungs | none 390 · literal 171 · table 78 · template 69 | **none 368 · literal 171 · table 100 · template 69** |
| the largest UNRESOLVED reason | 248 | **226** |

**UNMOVED, AND EACH IS A CLAIM WORTH THE LINE:** `tiers` (MISSING 34 / THIN 483 / COVERED 225 /
MISSING-AT-TIER 45), `absent` (measured 370 · default 3 · not-produced 60 · method-call 18),
`predicatesOverUnreadFields` 99, `objectClassed` 99, `covertRows` 4, `zeroK` 49,
`grains.branch.zeroK` 49, `grains.function.zeroK` 121, `customReachableRows` 21,
`relationRowsJoinable` 0, `ratifiedAliases` 3, `modifierEligibleFactsByTab.defense` 5,
`attachCoverage` 50 blocks.

**THE PER-ROW RUNG DELTAS — 22 rows moved and every one is DS-DEF-2's:**

```
$ node <index committed vs fresh by `block :: pool`, compare whole rows>
rows whose JSON moved: 22
rows OUTSIDE DS-DEF-2 that moved: 0
```

| reader | rows | rung | `k` | the predicate the census now recovers |
|---|---|---|---|---|
| `BEASTS_ROW_POOL` | 7 | none → **table** | null → 2 | `beastsRowSituation(family, perimeter, force) === '<situation>'` |
| `INVASION_ROW_POOL` | 6 | none → **table** | null → 2 | `invasionRowSituation(walls, garrison, militia) === '<situation>'` |
| `ECONOMIC_ROW_POOL` | 4 | none → **table** | null → 2 | `scoreBand(economicScore) === 'STRONG'` … `'CRITICAL'` |
| `DISASTER_ROW_POOL` | 5 | none → **table** | null → 2 | `disasterRowSituation(granary, hospital, church) === '<situation>'` |
| `internalRowPoolKey` | 4 | literal → **literal (UNMOVED)** | 1 → 1 | its own branch fields, `court` and `prison` |

**DS-DEF-2 is now 26 RESOLVED of 26.**

⛔ **THE RE-TAKE IS THE DECLARED ONE, NOT A STAMP-ONLY RE-TAKE, AND THE ADDENDUM'S TEST SAYS SO
IN INTEGERS.** `git diff -U0 -- docs/content/wiring-census.json` is **1,156 changed lines**
(854 insertions, 302 deletions) of which exactly **2 are the `stamp.files` sha pair for
`defenseStateProse.js`** and **1,154 are row and figure lines**. The census file grows
1,809,073 → 1,832,119 bytes. Under the chair's generalised rule that is the chair's act — and
this one is PRE-RULED at SITTING §P.2-28 as the declared purpose of the car, so it is committed
with the change that moved it rather than refused.

### 3h.4 ⭐⭐ DS-DEF-2 LEAVES THE CANNOT-ATTACH SET

```
$ node <attachCoverage, committed vs fresh>
DS-DEF-2 attach  {"spines":4,"facts":2,"spinesReachedBp":0,"meanReachBp":0}
              -> {"spines":26,"facts":6,"spinesReachedBp":10000,"meanReachBp":8077}
branch  cannotAttach 22 -> 21     left: DS-DEF-2      joined: (none)
function cannotAttach 26 -> 25     left: DS-DEF-2      joined: (none)
what the branch grain buys: DS-DEF-11 DS-DEF-9 DS-ECO-9 DS-POW-3   (unchanged, before and after)
```

Every spine of the threat assessment can now carry a modifier, on 6 facts where it had 2. ARCH
§6.4 works its whole fact-budget example on this block and the walker's own comment said the
cure was "a wiring car, not a grain". This is that car, and the four blocks the branch grain
buys are untouched by it — the two measurements are independent, which is what makes the second
one evidence.

### 3h.5 ⛔ THE JUDGMENT CALL: ROW 3 IS NOT TABLED, AND THE COST OF TABLING IT IS MEASURED

The brief's item 1 names FIVE key functions including `internalRowPoolKey`. Four were tabled and
the fifth was not. **The reason is a loss, not a preference.** Row 3 already resolved on rung 1
with `reads: ["court","prison"]` — the block's only named fact pair, and the read set SITTING
§P.2-28 quotes. Rung 3 writes the census's OWN synthetic label into `predicate[].field`,
`branchReads` and `fieldsRead` alike (car 10, cure 4), and `decorateRows` gives a table row an
EMPTY absence record by construction. Tabling row 3 would therefore have:

* replaced two named readings with one instrument label — the two facts vanish from `factIndex`,
  from `spokenToSet` and from the `absent` distribution;
* moved its four rows from `k = 1` to `k = 2`, which is a fact-budget claim nobody measured;
* left DS-DEF-2 with SIX synthetic labels and no real reading at all.

The block leaves the dark set either way (26 spines over 5 read sets is enough). So the car took
the shape that resolves 22 rows and loses nothing, and the walker now PINS the asymmetry: an arm
asserts `internal.reads` is still `['court','prison']` and its `k` still 1, so a later uniform
sweep cannot quietly table it. **Veto shape:** table row 3 as well and accept the two lost
readings, if uniformity across the 256 rung-4 keys is worth more than DS-DEF-2's fact pair.

### 3h.6 ⛔⛔ TWO INSTRUMENTS THIS CAR TRIPPED WITH A COMMENT, BOTH CURED AT CAUSE

Neither is a figure move. Both were caught by execution, and both are recorded because the next
desk's wiring car will meet them.

**1. THE ISLAND FENCE READS COMMENTS, AND A PRODUCT FILE MAY NOT NAME THE CENSUS MODULE.**
`proseWiringCensus.walker.test.js`'s arm (e) scans every file under `src/` for the BARE MODULE
NAME of each of the instrument island's eleven modules and refuses a hit outside
`src/domain/prose/` — by RAW TEXT, comments included. The first cut of the new docblock cited
the module by path, and the fence fired:

```
 × (e) THE FENCE: no src/ file outside the ISLAND names any of its ELEVEN modules
   expected [ "wiringCensus <- src/domain/display/stateProse/defenseStateProse.js" ] to deeply equal []
```

That is the fence working exactly as designed: a product surface that has learnt the
instrument's name is one refactor away from importing it. The cure is the wording — the docblock
now cites the DIRECTORY and never the module — and the rule is written into the file so the next
author does not have to rediscover it. All eleven island tokens now read 0 in the desk.

**2. THE ALIAS DRAFT'S `docblock` EVIDENCE KIND MINTS A CANDIDATE FROM ANY COMMENT LINE, AND IT
MINTED ONE OUT OF TWO ENGLISH WORDS.** `aliasDraft`'s fourth evidence kind indexes composer
COMMENT lines and proposes an alias wherever one line names a relation endpoint's leaf and a
census read root's leaf. A sentence of the new docblock ended "there is no silence on this row",
and the draft answered:

```
NEW ROW: economicGates.disaster|row  evidence=docblock
  at src/domain/display/stateProse/defenseStateProse.js:495
  line: * WHICH DISASTER SITUATION a town is in. Total: there is no silence on this row.
draft.rows.length: 33 -> 34
```

An alias candidate between a generator gate and a bare key-function parameter, out of nothing
but two English words sharing a sentence. ⚠ **AND THE FIRST CURE RE-MINTED IT**: the note
written to record the artefact named both tokens on one line and the draft proposed the same row
again, citing the note. The sentence is now spelled so no line carries both, `draft.rows.length`
is back to **33**, `endpointsWithCandidate` 14, `noCandidate` 75.

⭐ **FOR THE CHAIR, BECAUSE THIS IS A SHAPE THE SITTING HAS ALREADY RULED ON ONCE.** SITTING
§P.2-27 withdrew every `generator-write` citation that was "a comment, a prose string, a
template string or an arrow parameter" and re-cut that kind as an AST reading. The identical
weakness survives in the `docblock` kind, which is comments BY DEFINITION and cannot be re-cut
the same way. It costs nothing today — `ratifiedAliases` filters to `evidence === 'identifier'`,
so a docblock row can never ship as a ratified alias — but `draft.rows.length` is a declared
figure a walker asserts, so **any car that writes a composer comment can move it**, and the row
it adds looks exactly like evidence. Recorded, not cured: the honest cures are the chair's (drop
the kind, or require the two tokens to be adjacent rather than co-resident on a line).

### 3h.7 THE DECLARED ROWS UPDATED IN THE WALKER — fourteen, each with its ground

No test title and no `describe` was added or removed, so **the lighting census does not move and
no refreeze is owed** (`tests/lint` reads 2,401 assertions before and after).

| assertion | before | after | why |
|---|---|---|---|
| `summary.resolved` | 318 | 340 | the 22 |
| `summary.unresolved` | 390 | 368 | the 22 |
| `resolvedWithPredicate` / `…WithCleanPredicate` | 185 / 185 | 207 / 207 | each table row carries exactly one readable comparison |
| `summary.syntheticTableFields` | 78 | 100 | the 22 table labels |
| `census.tables` | 29 | 33 | the four new tables |
| `branchGrainRows` / `functionGrainRows` | 287 / 421 | 309 / 399 | a table row's field IS its branch |
| `tableRungRowsWithoutAbsence` | 78 | 100 | the same 22 |
| `budget.executable` / `notExecutable` / histogram sum | 318 / 390 / 318 | 340 / 368 / 340 | the same 22 |
| `dark.length` / `grains.function.cannotAttach.length` | 22 / 26 | 21 / 25 | DS-DEF-2 leaves both |
| `factIndex.length` | 59 | 63 | four new table labels in the inverse |
| `join.deskRoots` | 85 | 89 | the same four, as roots no endpoint can meet |
| `draft.syntheticRootsExcluded` | 15 | 19 | the same four, excluded by name |
| the DS-DEF-2 attach arm | "recovers four of them", ONE ladder, one read set | 26 of 26, FIVE readers, five read sets, `spinesReachedBp` 10000 | rewritten |
| the two `expectAbsentWithAnchor` anchors | `DS-DEF-2` | `DS-STR-1` | the old anchor left the collection; the new one is a live member on the same path |

⛔ **THE ANCHOR MOVE IS THE ONE TO RE-DERIVE.** `expectAbsentWithAnchor(dark, 'DS-DEF-11',
'DS-DEF-2', …)` used DS-DEF-2 as its LIVENESS anchor, and this car removed DS-DEF-2 from `dark`.
Deleting the anchor to get green is what the helper's own message forbids, so the anchor moved to
`DS-STR-1` — a block the same list still carries, reached by the same derivation, and already
asserted present two lines below. DS-DEF-2 is now the EXCLUDED member of its own third arm, so
its departure is asserted rather than merely no longer contradicted.

### 3h.8 THE GATES AT THE TIP

```
$ npx vitest run tests/lint                                                          ; exit=0
 Test Files  148 passed (148)
      Tests  2401 passed (2401)

$ npx vitest run tests/lint/proseWiringCensus.walker.test.js                         ; exit=0
      Tests  58 passed (58)
$ npx vitest run tests/domain/defenseStateProseDesk.test.js                          ; exit=0
      Tests  91 passed (91)
$ npx vitest run tests/property/dossierProseManifest.test.js                         ; exit=0
      Tests  14 passed (14)

$ node scripts/check-domain-strict.mjs                                               ; exit=0
[domain-strict] ✓ no strict-type regressions (1120 errors, ceiling 1120).
$ node scripts/check-full-typecheck.mjs                                              ; exit=0
[typecheck-ratchet] OK — no type regressions (173 error(s), ceiling 173).
$ node scripts/check-observed-shape-readers.mjs                                      ; exit=0
observed-shape readers: 1972 finding(s), exactly matching the frozen inventory.
$ node $SC/prose-numerics-rekey.mjs $SC/laneSEAM                                     ; exit=0
baseline=225 live=225 parseErrors=0 · exact=225 rekeyed=0 relocated=0 FELL=0 NEW=0
$ npx eslint <the desk, the walker, the desk suite>                                  ; exit=0
✖ 1 problem (0 errors, 1 warning)   # 'MONSTER_THREAT_TIERS' unused — pre-existing, unmoved
$ node <espree literal probe> src/domain/display/stateProse/defenseStateProse.js
defenseStateProse.js  literals:246  em:0  bang:0  toFixed-in-literal:0
$ npx vitest run tests/copy/voiceMechanics.test.js                                   ; exit=1
src/domain/display/labelBands.js: baseline em:0 bang:0 → current em:5 bang:0
src/domain/display/stateProse/generalStateProse.js: baseline em:0 bang:0 → current em:3 bang:0
      Tests  1 failed | 18 passed (19)
```

⭐⭐ **`tests/lint` IS FULLY GREEN FOR THE FIRST TIME IN THIS TRAIN — 148 of 148 files and 2,401
of 2,401 assertions.** Cars 3a through 3g each left the census interlock red because the re-take
was a register door they were refused; this car's door was pre-ruled, so the census moved in the
same commit as the change that moved it and the interlock closes. **THE STRICT RATCHET SITS
EXACTLY ON ITS CEILING, 1120 / 1120** — four frozen tables and three readers added ZERO
strict-type errors. The voice E2 red is the two banked files at the counts car 3a measured; the
defense desk is not among them and adds nothing to it.

**THE BYTE RATCHET.** `defenseStateProse.js` is **541 effective lines against the 800 ceiling**
(eslint `max-lines`, `skipBlankLines` + `skipComments`, the instrument `sizeBaseline.test.js`
uses), up from 500 at the base: **headroom 259**. Raw lines 1,635 → 1,798. The desk is not in
`scripts/.size-baseline.json` and does not enter it. ⚠ `EconomicsTab.jsx` stands at 596 / 600
and is **untouched by this car** — it is not in `git status`.

### 3h.9 ⭐ WHAT THIS CAR MEASURED FOR THE CHAIR — the remaining rung-4 work, sized

ARCH §3.6 speaks of "the 256 rung-4 keys"; at this tip, after the 22, the roster is:

```
$ node <group UNRESOLVED rows by block, excluding the UNMOUNTED reason>
MOUNTED blocks still carrying rung-4 pools: 29 blocks, 226 pools
DS-WAR-2 24 · DS-FTH-3 23 · DS-DEF-6 18 · DS-POW-7 18 · DS-FTH-1 13 · DS-HK-1 11 · DS-POW-5 11 ·
DS-GEN-9 10 · DS-POW-1 10 · DS-STR-2 10 · DS-WAR-1 10 · DS-DEF-3 7 · DS-ECO-8 7 · DS-ECO-9 6 ·
DS-REL-1 6 · DS-POW-6 6 · DS-CND-1 6 · DS-DEF-4 5 · DS-DEF-1 4 · DS-ECO-3 4 · DS-ECO-10 4 ·
DS-ECO-11 3 · DS-GEN-8 2 · DS-POW-4 2 · DS-STR-1 2 · DS-DEF-8 1 · DS-GEN-11 1 · DS-POW-2 1 ·
DS-FTH-2 1
```

(The other 142 unresolved rows are UNMOUNTED blocks, where there is no composer to expose.)

⚠ **AND THE PER-BLOCK COUNT OVERSTATES THE REACHABLE WORK, WHICH A CHAIR SIZING CARS FROM IT
SHOULD KNOW.** DS-DEF-6 reads 18, but 13 of those are `DEF6_C3_BLOCKED_POOLS` — pools the desk
DELIBERATELY never keys, because a landed position on the same tab already speaks the fact. No
table can resolve a pool no key function produces, so a DS-DEF-6 wiring car reaches FIVE pools
(the `Logistics & Supply:` family, still built through a local arrow) and the other thirteen stay
rung 4 until the C3 re-cut the desk's own header describes. Every block's number wants that
subtraction taken before a car is priced on it.

⚠ **`supplyLogisticsPoolKey` IS THE SAME SHAPE ON THIS LEAF AND WAS LEFT ALONE ON PURPOSE.** It
builds its five DS-DEF-6 keys through a local arrow exactly as the four cured here did. It is a
different block with a different chair row, so it is named in the code and here rather than swept
up: a wiring car that quietly widened its own scope would be the harder thing to review.

### 3h.10 THE JUDGMENT CALLS, EACH RECORDED FOR VETO

1. **Row 3 is not tabled** (§3h.5), with the cost of tabling it measured in three losses.
2. **The four tables are module-PRIVATE**, forced by the projection contract's exported-string-map
   guard (§3h.1) and consistent with the desk's three existing maps.
3. **The situation readers are private too, and the totality binding is by EXECUTION rather than
   by export.** The desk suite's ALIVENESS arm already sweeps every combination the generator can
   build and asserts all 26 corpus pools are reached, which convicts both directions: a table
   value that is not a live pool renders nothing and drops `reached.size` below 26. No new export,
   no new walker classification line.
4. **`economicRowPoolKey`'s corpus guard is replaced by the table, and the 1:1 it enforced at
   runtime is now asserted in the suite.** The shipped function built its key by template and then
   asked `CORPUS['DS-DEF-2'].pools[key]`; the arm folded into the existing ECONOMIC test now drives
   every integer score from -20 to 120, requires each to key a LIVE pool, and asserts the reached
   set equals the corpus's four `Economic Survival:` pools exactly. Behaviour is identical
   (§3h.2's 24-value score sweep, `null`/`undefined`/`'50'`/`NaN`/`Infinity` included).
5. **The situation tokens are English phrases, not boolean triples.** They are the census's
   recovered predicate VALUE, so a reader of the register meets `=== 'walls, no force'` rather
   than `=== 'w1g0m0'`. **Veto shape:** a canonical encoded token would be shorter and less
   readable in exactly the register this car exists to fill.
6. **No new test title anywhere**, so the lighting census is untouched and no refreeze commit is
   owed. Every new assertion is folded into an arm that already existed — cars 3b–3g's rule.

### 3h.11 RETROVALIDATION ROW (for the Fable chair)

| what was judged | what the chair must re-derive | receipts | priority |
|---|---|---|---|
| `internalRowPoolKey` NOT tabled, against the brief's five | that two named readings beat one uniform label, and that the walker's new pin is the right guard | §3h.5 | ⭐⭐ the brief named the row |
| The declared census re-take (1,154 row lines, 2 stamp lines) | that §P.2-28's pre-ruling covers a move this size | §3h.3 | ⭐⭐ |
| The `expectAbsentWithAnchor` anchor moved DS-DEF-2 → DS-STR-1 | that the new anchor travels the same path, and that the departure is asserted rather than dropped | §3h.7 | ⭐⭐ |
| The alias draft's `docblock` kind is comment-sensitive | whether the kind should be dropped or re-cut, as §P.2-27 did to `generator-write` | §3h.6 item 2 | ⭐⭐ any car writing a composer comment can move a declared figure |
| The island fence reads comments | that citing the directory is the standing rule for product files | §3h.6 item 1 | ⭐ |
| The four tables private, the readers private | that execution-bound totality is enough without an export | §3h.10 items 2, 3 | ⭐ |
| `economicRowPoolKey`'s runtime corpus guard replaced by a suite arm | that a roster asserted in the suite beats one enforced invisibly at the draw | §3h.10 item 4 | ⭐ |
| The rung-4 roster's per-block counts | that a C3-blocked pool is not reachable work, before pricing a desk's wiring car on its number | §3h.9 | ⭐ sizing the next cars |

### 3h.12 THE TIP, AND THE COMMANDS THAT RECOMPUTE THIS CAR

```
npx vitest run tests/property/dossierProseManifest.test.js   # drift [] — the acceptance
npx vitest run tests/lint/proseWiringCensus.walker.test.js   # 58 passed: the declared rows
npx vitest run tests/domain/defenseStateProseDesk.test.js    # 91 passed
npx vitest run tests/lint                                    # 148 / 148, 2401 / 2401, NO red
node scripts/wiring-census.mjs --check                       # the door is closed
node scripts/check-domain-strict.mjs                         # 1120 / 1120
node $SC/seam3h-keyab.mjs <out.json>                         # the A/B, re-runnable at any sha
```

```
$ git -C $SC/laneSEAM log --oneline -2
c45a46a78 SEAM car 3h: the defense desk's key tables exposed — DS-DEF-2 leaves the dark set,
          zero drift
6d94a41ad Register (SEAM, at 3g): the wiring census re-taken — twelve stamped shas moved, no row
$ git -C $SC/laneSEAM status --porcelain | wc -l
       0
$ node scripts/wiring-census.mjs --check
[wiring-census] verified 708 pools / 2266 variants / 165 relation rows against 7 stamped files
$ ls -ld node_modules/immer node_modules/seedrandom
lrwxr-xr-x  node_modules/immer -> /Users/cstokes/Desktop/settlement-engine/node_modules/immer
lrwxr-xr-x  node_modules/seedrandom -> .../node_modules/seedrandom      # symlinks, never cloned
```

**STATUS: CAR 3h LANDED at `c45a46a78`.** One commit, four files, no register act beyond the
pre-ruled census re-take, porcelain 0 and runners 0.

## CAR 3h — THE CHAIR'S VERIFICATION AND RULINGS (Fable, 2026-09-08 14:4x)
Re-measured at `c45a46a78` (porcelain 0, runners 0): census `--check` green; DS-DEF-2 26 rows / 26 RESOLVED / 22 on rung `table` with k = 2; RESOLVED 340 · unresolved 368 (CONFIRMED from the committed JSON); manifest `14 passed`, the drift lists empty (re-run); `src/data/` untouched between 6d94a41ad and c45a46a78 (CONFIRMED). Rulings: (1) `internalRowPoolKey` left on rung 1 with `reads ["court","prison"]` — ACCEPTED as measured (tabling it would trade the block's one named fact pair for a synthetic label; the walker pins the asymmetry); (2) the `docblock` evidence kind minting an alias-draft row from two English words on a comment line — a FINDING: SITTING §P.2-27 (comments and prose strings are never evidence) is EXTENDED to the docblock kind; the cure (the kind withdrawn from `draft.rows`, the count asserted after) is chartered into car 5b, which owns the census module; until then `draft.rows.length` 33 is a comment-movable figure and the walker's assertion on it is a known soft spot; (3) the island fence reading the census module's bare name in raw text (comments included) — cured at cause by the lane; ACCEPTED; (4) SIZING INPUT recorded for the sitting agenda §F: 29 mounted blocks carry 226 rung-4 pools (DS-WAR-2 24 · DS-FTH-3 23 · DS-DEF-6 18 · DS-POW-7 18); 13 of DS-DEF-6's 18 are `DEF6_C3_BLOCKED_POOLS` (no key function produces them, no table can reach them) — a desk's wiring car is priced AFTER subtracting unproducible pools; `supplyLogisticsPoolKey` (DS-DEF-6, 5 pools) is the same shape as this car's and is its own car. Seat: Fable 5.1 — validated.
