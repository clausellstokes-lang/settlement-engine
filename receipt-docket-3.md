# RECEIPT — lane DOCKET-3 — **COMPLETE for this dispatch · 2 CARS LANDED · 1 MEASURED-ONLY · 0 STOPPED**
⟦Seat: Opus 5 — Fable-unvalidated · Lane: DOCKET-3 · dock `$SC/laneDOCKET2`, detached, base `a6f01d757`⟧

## ARRIVAL — verified in-shell
```
HEAD      a6f01d75777d96ce71abda9a03493edd5ec1f9a7   (matches the brief)
porcelain 0
node_modules  453 symlinks, 0 real package dirs (never materialised)
```

## ⛔ VITEST HOLD IN FORCE FOR THE WHOLE DISPATCH. Nothing vitest was run; nothing vitest is claimed.
Every proof below is `node`, `eslint`, `git` or a read-only register script, with its exit
captured in-shell. The owed vitest commands are listed at the end with their exact spellings.

| item | outcome | sha |
|---|---|---|
| 1 — the chair's six band words into `complexityBandOf` | ✅ **LANDED** | `8614adb4e` |
| 2 — the fingerprint does not move | ✅ **PROVED** (executed assertion, 0/360 moved) | — (no code act, as briefed) |
| 3 — `safetyProfile.js:218` — the ruled repair | ✅ **LANDED** (+ a regression pin, + an unpaid `tests/lint` bill found and paid) | `6097b4efd` |

**DOCK TIP `6097b4efd`** (see the final block; the tip sha is repeated there as the brief requires).

---

# ITEM 1 — the six words. THE CHAIR'S WORDS SURVIVED EVERY INSTRUMENT.

## THE GATE THE BRIEF SET — "if any label differs from the words file's key by a byte, STOP"
Not eyeballed. `words-vs-producer.mjs` exhausts `deriveEconomicComplexity` over
(tier × income 0..14 × exports 0..14 × hasMarket), parses the chair's markdown table, and
compares as **hex bytes**:

```
producer vocabulary: 11 distinct        chair table rows parsed: 6
✅ "Agricultural surplus with trade links"  (37 bytes)
✅ "Diversified market economy"            (26 bytes)
✅ "Mixed subsistence and market"          (28 bytes)
✅ "Specialized production and trade"      (32 bytes)
✅ "Subsistence with minor surplus"        (30 bytes)
✅ "Subsistence with surplus"              (24 bytes)
chair keys with no producer label : []      producer bare labels not named : []
band opens its own label : 6/6              voice (single word, no digit, no dash) : 6/6
```
⇒ **All six keys byte-identical, set-equal both ways, and the chair's own stated rule
(the band is the label's head word) holds on all six.** No STOP condition.

## THE CENSUS — 174 → 0, re-derived at my base, not inherited
| measure | before | after |
|---|---|---|
| complexity slot renders the WHOLE label | **174/360** | **0/360** |
| the rendered Economy sub-line vocabulary | 10 values, 6 of them full phrases | 7 band words: `Subsistence` 129, `Diversified` 83, `Highly diversified` 83, `Mixed` 50, `Concentrated` 12, `Specialized` 2, `Agricultural` 1 |

## ⚠ A CORRECTION TO THE FRAMING — THE 174 IS THE SLOT'S FIGURE, NOT THE READER'S
`SummaryTab:214` is `sub={ecoSub || (complexityBandOf(...) ?? eco.economicComplexity)}`.
The complexity fallback is only what the reader SEES when `ecoSub` (the food deficit /
surplus line) is empty. Measured on the same 360 worlds:
```
tile gate OPEN (ecoSub empty => complexity shows)   10/360
SLOT defect (old expression returned whole label)  174/360
READER-VISIBLE defect (slot defect AND gate open)    6/360   <- the honest reader figure
of those, now showing a band word                     6/6
```
The cure is unaffected and every one of the six is fixed. But **"the tile printed a full
phrase on 174 of 360" overstates what a player saw on this corpus by ~29×**, and the
brief, DOCKET-2's receipt and the file's own docblock all carried the slot figure as if it
were the reader figure. The docblock now says the slot; this row says the rest.
⚠ Corpus-specific: these 360 worlds all drive `culture: 'germanic'` with default configs,
so the food line's near-universal presence is a property of THIS corpus, not a law.

## THE WALKER — the totality arm moves 5 → 11 with attribution IN the arm
The arm no longer asserts six `null`s. It asserts **zero** labels lack a band, the map is
11 rows, all 11 open with their band, the six chair words read back literally through
`complexityBandOf`, and the collisions are declared (`Subsistence` × 3, `Diversified` × 2)
so a later reader does not "resolve" them by inventing a word. The attribution — the words
are the Fable 5.1 chair's, a §0c-3 act, measured but not written by this lane — is in the
comment, and the arm ends with **TO CHANGE ONE OF THESE SIX: ask the chair.**

## THE PLANTS — both red, both restored by inverse edit, both verified by `cmp`
| plant | result |
|---|---|
| a **twelfth** label added to `deriveEconomicComplexity` (a real new ternary arm, reachable) | walker **REDS**, exit 1, naming `["PLANT — a twelfth complexity label"]` |
| a **`null`** re-inserted into `COMPLEXITY_BAND_BY_LABEL` | walker **REDS**, exit 1, on **4** assertions (the no-band set, `startsWith`, the chair-word read-back, the `Subsistence` × 3 count) |
| restore, both | **INVERSE EDIT**; `cmp` exit **0** against the pre-plant copy AND against the pristine backup; md5 equal; `git status --porcelain <file>` empty |

## ⭐ A DEFECT FOUND IN THE FUNCTION I WAS SENT TO EDIT, MEASURED NOT ARGUED
`complexityBandOf` read the map with `?? null`. The map is a bare object literal, so it
inherits `Object.prototype`. Executed at the base:
```
"constructor"    -> function  function Object() { [native code] }
"toString"       -> function  function toString() { [native code] }
"valueOf"        -> function  "hasOwnProperty" -> function  "isPrototypeOf" -> function
"__proto__"      -> object
```
The declared `@returns {string|null}` was false, and `SummaryTab`'s `?? eco.economicComplexity`
hands the result straight to a React child. Unreachable from the producer; wrong all the
same. Fixed with `Object.hasOwn` (an established idiom here — 36 files in `src/` use it),
and pinned by four assertions. **This is a judgment call, J3 below — veto it and I will
split it out.**

---

# ITEM 2 — the fingerprint does not move. EXECUTED, not argued.

```
settlements                                            360
fingerprints PRESENT                                   360/360
assertPowerEconomyFreshness THREW                      0/360
persisted stamp !== fresh recompute (drift)            0/360
stamps that MOVED vs the pre-car baseline              0/360
non-vacuity control — the assertion FIRES on a planted input change: YES
```
And the whole generated surface, byte-compared against a dump taken **before any edit**:
```
✅ complexity     identical on 360/360      ✅ foodLabel   identical on 360/360
✅ safetyLabel    identical on 360/360      ✅ fp          identical on 360/360
✅ safetyProfile  identical on 360/360      ✅ stability   identical on 360/360
   (whole object, JSON-stringified)
non-vacuity control (a planted fp difference is detectable): YES
```
Run three times — after item 1, after item 3, and at the tip. Green each time.

---

# ITEM 3 — `safetyProfile.js:218`. RULED A REPAIR, AND MEASURED AS ONE BEFORE THE EDIT.

## THE BRIEF'S STOP CONDITION — "if the branch DOES fire on any of the 360, STOP"
Measured at the base, before touching anything:
```
worlds whose safetyLabel is a COMPOSITE (safetyLabels.length > 1)   0/360
worlds where the BUGGY BRANCH ACTUALLY FIRES                         0/360
worlds carrying the two-dash plague strain in FIRST position         8/360  (handled correctly)
```
⇒ **0/360. No STOP.** No generated world's text moves; this is a repair, not a declared shift.

## THE CURE IS THE HABITAT, NOT THE INSTANCE
`.pop()` instead of `[1]` would fix these strings and leave the producer still parsing its
own output — one gloss away from the same bug. The strains are now a typed local array of
`{strain, condition}` and the composite reads the condition off the entry. It is a local
`const`: nothing new is persisted, only the composed string leaves the function.

## THE EXHAUSTIVE PROOF, WITH THE PREDICTION REGISTERED BEFORE THE RUN
The prediction is written into `safety-equiv.mjs` above the driver, not added after:
*the two implementations differ on exactly the seven non-empty subsets of
{occupied, under_siege, famine} united with plague_onset, under the low-ratio variants.*
```
cases driven                     24936   (every subset of the 4 primaries, every subset of
composite labels reached         23304    the 10 secondaries, x 6 ratio-spanning configs
distinct leading strains seen       15    x 4 tiers)
OLD !== NEW on                   76/24936
differing stress subsets (7): famine+occupied+plague_onset · famine+occupied+plague_onset+
  under_siege · famine+plague_onset · famine+plague_onset+under_siege · occupied+
  plague_onset · occupied+plague_onset+under_siege · plague_onset+under_siege
PREDICTION: ✅ EXACT
appended segments that are NOT a declared condition:  OLD 76   NEW 0
```
The wrong/right pair, on a real fixture:
```
[occupied + plague_onset, town]
  OLD  "Controlled — Occupation Curfew + Plague Unrest"
  NEW  "Controlled — Occupation Curfew + Plague Conditions"
```
The OLD side is a copy of the pristine file with only its two import specifiers absolutised
into the dock — proved equivalent to the tree before the edit (`OLD === TREE: true`), and
kept in `$SC/docket3work/oldref/`, never written into the tree.

## BLAST RADIUS — by grep, not by assumption
```
files carrying a composite plague label (any golden/fixture/snapshot/test): NONE
tests setting plague_onset beside another primary stress that assert a label: NONE
consumers anywhere that split a safety label on ' + ': NONE
```
And the lifecycle: a world saved BEFORE this repair keeps its old string and is never
re-derived — DOCKET-2 measured the fingerprint write-only across the save boundary and
`regenSection` has only `npcs`/`history` branches. Lived history stays as it was lived.

## THE PIN — because a repair on an unreachable path is a repair that comes back
One arm in the existing totality walker: binds the 14-condition vocabulary to the producer,
asserts every multi-primary combination appends only declared conditions (17 segments
examined), and scans the source for **the habitat itself** — no `split(' — ')` in the
producer's code.

⚠ **THE SCAN CAUGHT ITSELF FIRST.** The naive negative matched the new docblock, which
QUOTES the retired expression in order to explain it — an anchored-negative walker
reddening on correct code because of its own documentation. The scan now strips comments,
with two controls: the stripper must leave `safetyStrains.push` standing, and the docblock
must still contain the quoted expression or the scan has gone vacuous.

```
PLANT — the re-parse restored:  the pin REDS (exit 1) on the habitat scan, the instance,
                                and 4 of the 11 combinations
restored:                       INVERSE EDIT, cmp exit 0 against the pre-plant copy
```

## ⛔⛔ THE UNPAID `tests/lint` BILL — FOUND BEFORE REPORTING DONE, AND PAID
`tests/lint/negativeAssertionAnchor.walker.test.js` walks the WHOLE `tests/` corpus for
`not.toContain|not.toMatch|not.toHaveProperty` and freezes an **EXACT** per-file count.
This file's frozen row is **1** (line 644 of that walker). The pin's
`.not.toContain('+ Plague Unrest')` made it **2** — an exact-equality red that a
single-file green on my own walker would never have shown.

Paid with the walker's own documented escape hatch: an `// anchored:` marker stating why
the assertion cannot go vacuous. **⚠ AND THE MARKER RULE HAS A SHARP EDGE:** the walker
reads the assertion line or **the ONE line immediately above it**. A wrapped `// anchored:`
whose *second* line abuts the assertion reads as UN-ANCHORED. Two attempts failed that way.
Verified by replaying the walker's own counting function, with a non-vacuity control:
```
✅ tests/lint/vocabularyTotality.walker.test.js   frozen row 1   measured 1   lines [169]
```
The intermediate car `8614adb4e` was checked too: its blob also measures **1**. **No car
in this consist is red at its own tip.**

## OTHER SCANNERS — checked statically, since vitest is held
| scanner | verdict |
|---|---|
| `contractTestAntiVacuity` Rule 2 | FILE-gated on "derives from source"; this file uses `readFileSync` 17×, so it does not fire on my `every …` title |
| `contractTestAntiVacuity` Rule 1a | item 1 **REMOVED** the file's only `continue;` skip-guard — that shape is now absent entirely |
| `controlBytes` | 0 forbidden C0/DEL bytes in all three touched files |
| `goldenFreeze` | none of the three files is in the register, and the register is unfrozen (`frozenAt: null`) |
| `couplingInclusion` | no import added to any `src/` file; `labelBands.js` still has ZERO imports |
| `sizeBaseline` | neither src file is in the map; `eslint` (which generates the `max-lines` override) exits 0 |
| **`check-writer-reach.mjs`** | **RUN, read-only: EXIT 0**, `WRWALKER HOLD — judged 6520 · LIT 550 · LIT-NAME 4644 · DARK 1326`, and porcelain was byte-identical before and after (the probe wrote nothing) |

## ⛔ A CORRECTION TO DOCKET-2's OWED LIST, WORTH MORE THAN THIS CAR
DOCKET-2's receipt lists `node scripts/check-test-ratchet.mjs` as *"read-only, no --update"*
and therefore hold-safe. **It is not.** Line 163 shells out to an **unfiltered**
`npx vitest run --exclude=… --reporter=json`. A lane told it is read-only will break the
vitest hold with it. It is owed until RESUME like any other vitest.

---

# ⭐ REGISTER PREDICTIONS — written before any instrument, no register act taken
| register | delta | how derived |
|---|---|---|
| test ratchet | `totalTests` **+1** · `totalFiles` **UNCHANGED** | `it(` count in the walker: **19 → 20**; no file added, renamed or deleted |
| lighting census | `titles` **+1** · `suiteTitles` **+0** · `files` **+0** · `credited` **+0** · `parked` **+0** | `describe(` **5 → 5**; one existing `it()` title also CHANGED TEXT (item 1's arm), which moves a title string without moving the count |
| writer-reach | **NO DELTA — MEASURED, not predicted** | `check-writer-reach.mjs` exit 0 at the tip |
| tuning inventory | **+0** | no new numeric constant; the six words are strings |
| observed-shape readers | **+0** | no field added to or removed from any returned object; `safetyStrains` is a local `const` |
| size baseline | **+0 rows** | neither file is in the map |
| first-paint built bytes | ⚠ **PREDICTED, NOT MEASURED** — code-only source delta `labelBands.js` **+96 B**, `safetyProfile.js` **+322 B** (comments excluded, pre-minification). A build is not in my brief and `npm run build` is fenced, so this is **PLAUSIBLE**, not CONFIRMED |
⚠ The ratchet and lighting baselines were measured at **other shas** (`24735fcf3`,
`ff9b7a53c`) than this dock's base, so these are **DELTAS, not absolutes**.

---

# ⏱ OWED-UNTIL-RESUME — exact commands, to run the moment the chair sends RESUME
```
sh scripts/gate-mutex.sh --run -- npx vitest run tests/lint/vocabularyTotality.walker.test.js
sh scripts/gate-mutex.sh --run -- npx vitest run tests/lint/negativeAssertionAnchor.walker.test.js
sh scripts/gate-mutex.sh --run -- npx vitest run tests/lint/contractTestAntiVacuity.walker.test.js
sh scripts/gate-mutex.sh --run -- npx vitest run tests/domain/safetySeverity.test.js
sh scripts/gate-mutex.sh --run -- npx vitest run tests/lint/
sh scripts/gate-mutex.sh --run -- npx vitest run tests/ui/
sh scripts/gate-mutex.sh --run -- npx vitest run tests/generators/ tests/property/
sh scripts/gate-mutex.sh --run -- node scripts/check-test-ratchet.mjs   # ⛔ RUNS VITEST — not hold-safe
```
⚠ In zsh an unquoted variable holding several paths is ONE word — pass these literally.
⚠ Predicted reds at the `tests/lint/` dir run: the PRE-EXISTING banked `clampPrimitiveBaseline`
row lane DOCKET measured, and DOCKET-2's `sovereigntyLightingContract` row for its one new
src file. Both are inherited from my base, not this car's.

---

# ⭐ RETROVALIDATION ROW (Opus 5 lane → Fable 5.1 chair)

## WHAT WAS JUDGED — each is a call, not a fact; veto any of them
| # | judgment | where |
|---|---|---|
| **J1** | **The safetyProfile cure is the TYPED LOCAL ARRAY, not `.pop()`.** The brief ruled "FIX IT" and named no mechanism. `.pop()` is two characters and fixes every string; I took the larger diff (16 anchored replacements) because it removes the habitat — a producer parsing its own output — rather than the instance. Cost: a 59-line diff in a generator that feeds a persisted fingerprint. Paid for with 24,936 exhaustive cases and 360/360 byte-identity. | item 3 |
| **J2** | **I added a REGRESSION PIN the brief did not ask for.** A repair on a path unreachable in the corpus (0/360) has nothing in the tree that would notice its return. Cost: `totalTests +1`, `titles +1`, and it is what exposed the frozen-row bill. If the chair wants the car word-for-word to brief, the pin is the arm to drop. | item 3 |
| **J3** | **I fixed the `Object.hasOwn` prototype leak in `complexityBandOf`,** which is not on the brief's fence list (no persisted shape, no label text, no register act) but is not on its work list either. It is a real defect in the exact function item 1 rewrites, and its declared return type was false. Split it out if you would rather it were its own car. | item 1 |
| **J4** | **The arm went into the EXISTING walker, not a new test file** — same call DOCKET-2's J4 made, same reason: no new census row, only titles move. | items 1, 3 |
| **J5** | **I amended the item-3 commit rather than adding a third car** for the anchor fix, so that no car in the consist is red at its own tip. The finding itself is preserved verbatim in the amended message and above. | item 3 |

## WHAT THE FABLE CHAIR MUST RE-DERIVE
1. ⛔⛔ **The 174/360 is the SLOT's figure; the reader saw 6/360 on this corpus.** The
   Economy tile prefers the food line, and `ecoSub` is non-empty on 350 of 360. The cure is
   right and complete either way, but the *severity* in the brief, in DOCKET-2's receipt and
   in the file's own docblock was ~29× the reader-visible number. Worth a decision: is the
   Economy tile's sub-line doing the job it was designed for, if the band shows on 10 of 360?
2. ⛔⛔ **`scripts/check-test-ratchet.mjs` IS NOT HOLD-SAFE.** It shells out to an unfiltered
   `npx vitest run` (line 163). DOCKET-2's receipt tells the next lane it is read-only.
   Correct that before another lane runs it under a hold.
3. ⛔ **The `// anchored:` marker must be the line IMMEDIATELY above the assertion.** A
   wrapped comment reads as un-anchored and moves an exact-equality frozen row. This will
   bite the next lane that adds a negative assertion; it bit me twice.
4. ⚠ **J1 and J2 are the two calls with real cost** — a 59-line generator diff and a
   +1 on two registers. Both are defensible; neither was required by the brief's letter.
5. ⚠ **The built-byte delta is UNMEASURED** (`npm run build` is fenced). Code-only source
   growth is +96 B / +322 B before minification. If the first-paint budget is tight, measure
   it at the landing.
6. ⚠ **`Subsistence` now names THREE complexity labels and `Diversified` TWO.** The chair
   declared this honest and I agree, but it is now visible to readers: a thorp with
   `Subsistence — survival economy` and a village with `Subsistence with surplus` show the
   same word on the tile. Declared in the map and pinned in the walker; not re-litigated here.
7. ⚠ **The register figures are DELTAS.** Both baselines were measured at shas that are not
   this dock's base.

## RECEIPTS BY PATH
| what | path |
|---|---|
| this receipt | `$SC/receipt-docket-3.md` |
| the chair-words byte gate | `$SC/docket3work/words-vs-producer.mjs` / `.out` |
| the pre-edit 360 baseline (dump + census) | `$SC/docket3work/corpus-baseline.mjs`, `base-360.json`, `corpus-baseline.out` |
| the byte comparator (with its non-vacuity control) | `$SC/docket3work/compare-360.mjs`, `compare-final.out` |
| the fingerprint freshness run | `$SC/docket3work/fp-freshness.mjs` / `fp-freshness-final.out` |
| the 174 → 0 render census | `$SC/docket3work/render-after.mjs` / `.out` |
| the reader-visible tile-gate correction | `$SC/docket3work/tile-gate.mjs` / `.out` |
| the band-word arms replayed in node (41 assertions) | `$SC/docket3work/arm-replay-3.mjs` / `arm-replay-3-final.out` |
| the pin replayed in node (37 assertions) | `$SC/docket3work/pin-replay.mjs` / `pin-replay.out` |
| the exhaustive safetyProfile equivalence (24,936 cases) | `$SC/docket3work/safety-equiv.mjs` / `.out` |
| the OLD reference module (imports absolutised) | `$SC/docket3work/oldref/safetyProfile.OLD.js` |
| the negative-anchor counter replay | `$SC/docket3work/neg-anchor-replay.mjs` / `.out` |
| the writer-reach read-only run | `$SC/docket3work/writer-reach.log` |
| plant outputs (A: twelfth label · B: null · C: re-parse) | `$SC/docket3work/plantA.out`, `plantB.out`, `plantC.out` |
| pre-edit backups (the `cmp` references) | `$SC/docket3work/BACKUP-labelBands.js`, `BACKUP-safetyProfile.js`, `BACKUP-prosperity.js`, `BACKUP-vocabularyTotality.walker.test.js` |
| pre-plant backups | `$SC/docket3work/PREPLANT-*.js`, `PREPLANT2-safetyProfile.js` |
| commit messages | `$SC/docket3work/msg-step1.txt`, `msg-step3.txt` |
| eslint (all exit 0, all 0 bytes) | `$SC/docket3work/eslint-final.log` |

## PRIORITY
**HIGH** — 1 (the 174-vs-6 correction, because it is the number the brief and two receipts
carry), 2 (the ratchet script is not hold-safe, because it will break another lane's hold),
J1 and J2.
**MEDIUM** — 3 (the anchor marker edge), 5 (the unmeasured built bytes), and the two
register acts, which are the chair's.
**LOW** — 6, 7, J3, J4, J5.

---

## DOCK FINAL STATE (verified in-shell at the tip)
```
HEAD      6097b4efdcb743d7b61745021095af31baa76291     <- TIP SHA
consist   a6f01d757 (DOCKET-2) -> 8614adb4e (item 1) -> 6097b4efd (item 3)
porcelain 0
node_modules  453 symlinks · 0 real package dirs — never materialised
eslint    exit 0, 0 bytes, over all three touched files
diff vs a6f01d757   3 files changed, 201 insertions(+), 59 deletions(-)
committed blobs md5-equal the working tree on all three files — no pre-commit --fix re-stage
trailers on both cars: Seat: Opus 5 — Fable-unvalidated · Lane: DOCKET-3 · Co-Authored-By
```
⚠ **THE CARS EXIST ONLY AS THIS DOCK'S HEAD.** The preamble forbids a lane writing refs, so
`6097b4efd` is one `git worktree prune` from gone. Sealing it is the chair's act and it is cheap.
