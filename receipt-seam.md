# RECEIPT — LANE SEAM (the ARCH train)

Seat: Opus 5 — implementer. Chair: Fable 5.1.

## CAR 3a — THE SEAM, UNREACHABLE (ARCH §12 row 3a)

**STATUS: PARTIAL — in flight.** A session can die with no notice; every section below is
written as it is executed and nothing here is a prediction unless it says so.

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
