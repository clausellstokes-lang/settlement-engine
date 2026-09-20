# EM-R0d — v4 PRE-PROOF EVIDENCE (G-1 … G-14)

Read tip `578272a99` (detached worktree `$SP/read-tip-r0d-v4`, `node_modules` symlinked from `$SP/slot-2`).
`git status --short` EMPTY at start and at end. Stamps read from `date` in the same call as the measurement.
No vitest, no eslint, no npm script, no build: every probe below is plain `node` or `git`.
⛔ These sections are ADDITIVE — D-1…D-16, E-0…E-9 and F-1…F-18 are untouched.

---

## G-1 — the preamble hash, MEASURED at both tips (never quoted)

```
$ git show 578272a99:docs/implementation/preambles/EM-PREAMBLE.md | shasum -a 256
ce516004a5d8e680f4160b03ce660c66d78261988b78a82239664c596600af4b  -
$ git show 2dc08a595:docs/implementation/preambles/EM-PREAMBLE.md | shasum -a 256
c9f33c8d2940372bde8a6d931e3d389b79516a90ed45405cbbbf3e698cc46675  -
$ git log -1 --format='%h %s' 2dc08a595
2dc08a595 PREAMBLE: the EM preamble's fourth amendment — §P2 row 11 gains the sentence that the
generation worker's byte budget has NO placement cure …
```
**CONFIRMED.** `2dc08a595` is the CHILD of the read tip (`git merge-base --is-ancestor 578272a99 2dc08a595` → YES).
⛔ The hash the chair stamps is the one at the tip the chair PLACES at. Version 3's `16dfb96f…` is the SECOND
amendment and is stale.

## G-2 — the J-T1 window `141a1d775..578272a99`, measured PATH BY PATH

Ancestry first: `141a1d775`, `ad7ddf2c9` and `e5bdfd031` are all ancestors of HEAD; `rev-list --count
141a1d775..HEAD` = **36**.

```
UNCHANGED  src/data/bandLadders.js
UNCHANGED  src/generators/factionDynamics.js
UNCHANGED  src/generators/defenseGenerator.js
UNCHANGED  src/generators/foodGenerator.js
UNCHANGED  tests/domain/bandLadders.test.js
UNCHANGED  tests/domain/generalStateProseDesk.test.js
UNCHANGED  tests/ui/compendiumFoodSecurity.test.jsx
UNCHANGED  tests/ui/compendiumPower.test.jsx
UNCHANGED  tests/build/generationWorkerLazy.test.js
MOVED       tests/components/dossierLabelCase.test.jsx | 95 +++++-   (93 insertions, 2 deletions)
UNCHANGED  tests/copy/voiceMechanics.test.js
MOVED       src/domain/prose/holderTable.js | 2 +-                   (1 insertion, 1 deletion)
UNCHANGED  tests/helpers/sourceContract.js
MOVED       tests/build/domainGeneratorsBoundary.test.js | 4 +++-    (3 insertions, 1 deletion)
```
**CONFIRMED: exactly the three movers the chair named, and no others.** Their commits:
`7dea316c7` (FIX-P5), `ee2406191` (FIX-C2), `cbb4fc4f2` (FIX-C2b).

### G-2b — ⛔⛔ A FALSE-EMPTY WINDOW, REPRODUCED AND DIAGNOSED (a hazard for the whole lane family)

The FIRST run of this step built the fourteen paths into a shell variable and passed it unquoted:
`git -C "$RT" diff --stat 141a1d775 578272a99 -- $PATHS`. It printed **nothing** and exited **0** — which reads
as "not one byte of any declared path moved", the exact sentence version 3 was entitled to write. It is false.

```
$ echo "SHELL=$SHELL  ZSH_VERSION=$ZSH_VERSION"
SHELL=/bin/zsh  ZSH_VERSION=5.9
$ P="tests/components/dossierLabelCase.test.jsx src/domain/prose/holderTable.js"
$ set -- $P; echo "argc=$#"
argc=1
$ out=$(git diff --stat 141a1d775 578272a99 -- $P); echo "[${out:-<EMPTY>}] exit=$?"
[<EMPTY>] exit=0
$ git diff --stat 141a1d775 578272a99 -- tests/components/dossierLabelCase.test.jsx src/domain/prose/holderTable.js
 src/domain/prose/holderTable.js            |  2 +-
 tests/components/dossierLabelCase.test.jsx | 95 +++++++++++++++++++++++++++++-
 2 files changed, 94 insertions(+), 3 deletions(-)
```
**THE LAW:** zsh does NOT word-split unquoted parameter expansions. A path LIST held in a variable expands to
ONE pathspec containing spaces, which matches no file; `git diff` prints nothing and exits 0. This is the exact
twin of the chair's GREP LAW and of the `set -- $pair` false-green already in the brief's foot. **A J-T1 window
is measured one path per invocation, or with the paths written as literal arguments — never from a variable.**

## G-3 — the two citation movers are COMMENT-ONLY

`src/domain/prose/holderTable.js` — one line, inside a `/** … */` JSDoc block above `columnCensus`:
`` the shape follows `columnCensus` (`institutionTable.js:582`) `` → `` (`institutionTable.js:596`) ``.
`tests/build/domainGeneratorsBoundary.test.js` — three lines inside the file's top `/** … */` header:
`~22.7k LOC` → `183,678 lines across 443 files, re-measured 2026-09-20 at ee2406191`.
**CONFIRMED comment-only; admitted as expected movers.** Neither touches `HOLDER_SOURCES` or `BASELINE_EDGES`,
and neither changes any fact this packet rests on.

## G-4 — the lighting census, re-executed with the walker's OWN classifier

Method: lines **771-1670** of `tests/lint/sovereigntyLightingContract.walker.test.js` extracted VERBATIM into
`lighting-classify.mjs` (the walker's own `classify` / `parkReasonsFor` / `liveTitlesIn` / `liveSuiteTitlesIn`,
not a replica), with `espree` resolved from the read tip's `node_modules`.

```
CREDITED  tests/components/dossierLabelCase.test.jsx   titles=14 suiteTitles=6   ⛔ WAS 13 · 6 (F-12)
CREDITED  tests/domain/generalStateProseDesk.test.js   titles=70 suiteTitles=20
CREDITED  tests/ui/compendiumFoodSecurity.test.jsx     titles=3  suiteTitles=1
CREDITED  tests/ui/compendiumPower.test.jsx            titles=3  suiteTitles=1
PARKED    tests/copy/voiceMechanics.test.js            titles=0  reasons=["TEST_UNREGISTERED:it", …]
PARKED    tests/build/generationWorkerLazy.test.js     titles=0  reasons=["SUITE_NOT_RUNNING:describe.runIf()", …]
CREDITED  tests/domain/powerStateProseDesk.test.js     titles=77 suiteTitles=22
CREDITED  tests/domain/defenseStateProseDesk.test.js   titles=91 suiteTitles=18
CREDITED  tests/build/domainGeneratorsBoundary.test.js titles=3  suiteTitles=1

R0d SKELETON (8 straight-line literal `it`s under ONE literal `describe`):
  CREDITED  titles=8  suiteTitles=1
```
Committed baseline at the tip (`tests/lint/.lighting-census-baseline.json`):
`files 2664 · parked 359 · credited 2305 · titles 25501 · suiteTitles 6812` — the seventh refreeze, CONFIRMED.
**The delta is unchanged in shape (`files +1 · credited +1 · parked +0 · titles +8 · suiteTitles +1`); the one
moved absolute is `dossierLabelCase.test.jsx` 13 → 14 titles.**

### G-4b — FIX-P5's badge-capitals law against R0d's own cases

P5's new arm (`dossierLabelCase.test.jsx:334`) walks `resolve(process.cwd(), 'src/components/new')`, collects
`.jsx?` files excluding `.test.`, and convicts `JSXText` nodes matching
`/(?:^|[^A-Za-z])([A-Z]{4,}(?:[ '-][A-Z]{2,})*)(?:[^A-Za-z]|$)/`.

**R0d touches no file under `src/components/new`, and no test file is walked. The law cannot reach R0d's
cases — structurally, not by luck.** Measured anyway with P5's own detector:

```
labels+exported names convicted: ["LEGITIMACY_CUTS","LEGITIMACY_BANDS","READINESS_CUTS","READINESS_BANDS",
                                  "FOOD_SECURITY_CUTS","FOOD_SECURITY_BANDS","FOOD_FLAG_CUTS"]
control, must be true : true    (SHOUT.test('STILL RELEVANT TODAY'))
control, must be false: false   (SHOUT.test('REQ = Historically required') — the 3-letter legend code)
none of the TWELVE band labels is convicted.
```
The SCREAMING_SNAKE table names and this packet's ALL-CAPS acceptance-case texts ARE shout-shaped, but they live
in `src/data/` and `tests/domain/` — outside the walk — and they are identifiers and test titles, not dossier
content. **The three/four-letter legend-code control is unaffected by this packet.**

## G-5 — ⛔⛔ A NEW GATE-WIRED CITATION WALKER (did not exist at version 3)

`tests/lint/sourceCitationIntegrity.walker.test.js` (+411) and `.shared.mjs` (+527) landed with FIX-C2/C2b.
`CODE_TREES = ['src','tests','scripts']` are **gate-wired with NO baseline**. Measured with the SHIPPED engine:

```
codeFiles=5278  docs.live=483  stats.seen=947  stats.resolvable=893
ARM 1 findings (live code, past-EOF, no baseline): 0
ARM 2 docs past-EOF: 0 ; baseline rows: 0 ; novel: 0 ; cleared: 0
16 live-code citations and 16 live-doc citations address this packet's four files.
```
Target lengths at the tip: `factionDynamics.js` 592 · `defenseGenerator.js` 653 · `foodGenerator.js` 510 ·
`holderTable.js` 878. Highest cited line per target: 466 · **639** · 357.

Simulated over this packet's measured shrinks (`factionDynamics −18`, `defenseGenerator −5`, `foodGenerator −21`):
**CODE: 0 past EOF. DOCS: 0 past EOF.**

⛔ **THE MARGIN, NAMED:** `defenseGenerator.js:639` is cited by `defenseStateProse.js:1560` and
`defenseStateProseDesk.test.js:1611` against a 653-line file — **14 lines of headroom**. A defence edit that shed
more than 13 lines would red ARM 1, which has no baseline. → §3's new row and **STOP-9**.
⚠ ARM 3 (moved symbol) and ARM 4 (bare `:NNN`) are REPORT-ONLY (`expect(Array.isArray(findings)).toBe(true)`),
so a stale-but-in-range citation does not gate. Three such are handed on in §12.

## G-6 — STOP-7 RE-SWEPT AT THE COMPOSED TIP: no seventh anchor

Every file that reads a producer as a FILE (`readFileSync` + the producer's name), then filtered to those that
ASSERT a literal this packet removes:

- **Declared in §7 already (6):** `dossierLabelCase.test.jsx`, `generalStateProseDesk.test.js` (×2 anchors),
  `compendiumFoodSecurity.test.jsx`, `compendiumPower.test.jsx`, `voiceMechanics.test.js`.
- **Read-only / already named:** `domainGeneratorsBoundary.test.js`, `proseWiringCensus.walker.test.js`,
  `sourceCitationIntegrity.walker.test.js`, `scripts/wiring-census.mjs`.
- **Nine candidates cleared by measurement** — `ruinFilterRoster.walker.test.js`, `scripts/lib/tuning-inventory.mjs`,
  `stressTypeRegistration.test.js`, `customContentConsumerEvidence.walker.test.js`,
  `chartProportionCensus.walker.test.js`, `captureBirthScale.test.js`, `tests/helpers/dossierCorpus.js`,
  `proseEntryContradiction.walker.test.js`, `vocabularyTotality.walker.test.js`: **0 of the seventeen band-label
  literals in any of them.** `vocabularyTotality` reads `fnBody(factionDynamics.js, 'safetyContrib')` — a symbol
  this packet does not touch.
- **`tests/joins/labelJoins.test.js` — the one that looked dangerous, DISCHARGED.** It freezes per-file counts
  for `defenseGenerator.js: 2` and `foodGenerator.js: 3`, but its four `SIGNATURES` are institution-NAME joins
  (`.includes(x.slice(0,N))`, `.toLowerCase().slice(0,N)`, `instNames.some|filter|find|every(`,
  `i|inst|institution.name … .includes(`) — none matches a band label or a cut comparison. Its assertion is
  `total > allowed` (GROWTH only, a shrink passes), its `SCAN_DIRS` are `src/generators` + `src/domain` (so the
  new `src/data` leaf is unscanned), and its ghost arm only reds if a frozen file is DELETED.
- **The cut-literal class:** `git grep -E` over a quoted comparison naming any of the twelve cuts returns
  exactly `generalStateProseDesk.test.js:203` and `:204` (`'readiness >= 76 ?'`) — already declared. Every other
  `mustExtract` on a producer targets `safetyProfile.js` or `generateSettlementReason`, untouched.

**CONFIRMED: the six declared anchors are all of them at this tip. STOP-7 stands for a seventh at the build.**

## G-7 — the wiring-census CITE arm, and version 3's item 9 DISCHARGED

The three `cite:` rows, re-found at the tip: `holderTable.js:215` → `factionDynamics.js:127` (`govMultiplier`),
`:216` → `:133` (`governanceFractured`), `:217` → `:179` (`breakdown`). ⛔ FIX-C2 did NOT move them.

The `−18` is now arithmetic rather than simulation: `legitimacyBandFor` spans `:105-135` = **31 lines**; §6's
body is **12** (`fn open · destructure · return { · 7 keys · }; · }`); `31 − 12 = 19`, less the one added import
line above = **net −18**. So `127 → 109`, `133 → 115`, `179 → 161`, and `:109` is the `label, color, bg,
govMultiplier, crimMultiplier,` line and `:115` the `governanceFractured:` line — **exactly what §7 predicts.**

**Version 3's noticed item 9 ("line-sensitive in ways I could not bound without running the walker") —
DISCHARGED.** Running the walker's own `aliasDraft` over the shipped `buildCensus`/`draftSources`:

```
generator-write rows: 4  (the walker asserts 4)
  src/generators/history/historyEventStrands.js:42
  src/generators/npc/factionLeaderSecret.js:56
  src/generators/npcGenerator.js:170
  src/generators/defenseGenerator.js:552
draft.rows.length=7 (asserts 7) · docblockReports=28 (28) · endpointsWithCandidate=4 (4) · noCandidate=85 (85)
withdrawn-list check: all five ABSENT at the tip.
```
The path arm strips the line (`.replace(/:\d+$/, '')`) → **line-insensitive**. The withdrawn arm's
`.not.toContain('src/generators/defenseGenerator.js:608')` needs a real draft row ON line 608; the only
defenseGenerator row is `:552` and reaching 608 requires the file to **GROW 56 lines**. This packet shrinks it
by 5 (row lands at `:547`). **Neither arm can red on this edit.**

The census itself is green at the tip:
```
$ node scripts/wiring-census.mjs --check
[wiring-census] verified 708 pools / 2266 variants / 165 relation rows against 7 stamped files   EXIT=0
```

## G-8 — the eleven `requiredSymbols`, the CREATE targets, the homonym

Every row `grep -cF` = **1**, with its line at this tip:

| path | symbol | count | line |
|---|---|---:|---:|
| `src/generators/factionDynamics.js` | `export function legitimacyBandFor` | 1 | 105 |
| `src/generators/factionDynamics.js` | `export const DEFENSE_CONTRIB` | 1 | 51 |
| `src/generators/defenseGenerator.js` | `const computeDefenseReadiness = (scores, threat, tier, magicExists = true) =>` | 1 | 487 |
| `src/generators/foodGenerator.js` | `export function generateFoodSecurity` | 1 | 52 |
| `tests/domain/generalStateProseDesk.test.js` | `function readinessLabels()` | 1 | 201 |
| `tests/domain/generalStateProseDesk.test.js` | `function foodLabels()` | 1 | 214 |
| `tests/helpers/sourceContract.js` | `export function mustExtract` | 1 | 37 |
| `tests/build/generationWorkerLazy.test.js` | `export const WORKER_BUNDLE_CEILING_BYTES` | 1 | **159** |
| `tests/build/domainGeneratorsBoundary.test.js` | `const BASELINE_EDGES` | 1 | **62** |
| `src/domain/prose/holderTable.js` | `export const HOLDER_SOURCES` | 1 | **164** |
| `tests/copy/voiceMechanics.test.js` | `const AUTHORED_VOCABULARY_ALLOWLIST` | 1 | 309 |

(The three bolded lines are the ones the chair asked to be re-measured after their files moved.)
`WORKER_BUNDLE_CEILING_BYTES = 1401208`. `BASELINE_EDGES` = 4 files / 5 edges, unchanged.
CREATE targets `src/data/bandLadders.js`, `tests/domain/bandLadders.test.js` **ABSENT**;
`src/domain/bandLadders.js` **ABSENT**; the homonym `src/domain/compendium/bandLadders.js` **PRESENT** (20,253 B).
`retiredSymbols` stays **`[]`** — never `null`.

## G-9 — the worker bytes, a THIRD transcription; and the three producers' true line deltas

esbuild `transform(minify:true, loader:'js')` per file, before vs after, the after-files built by splicing §6's
replacement text into the tip's own source:

```
src/generators/factionDynamics.js   before=12433  after=12314  delta= -119   lines 592 -> 574  (net -18)
src/generators/defenseGenerator.js  before= 8314  after= 7954  delta= -360   lines 653 -> 648  (net  -5)
src/generators/foodGenerator.js     before= 7848  after= 7611  delta= -237   lines 510 -> 489  (net -21)
src/data/bandLadders.js (NEW, minified)                      = 2984 B
producers shed                                               = -716 B
WORKER DELTA ESTIMATE                                        = +2268 B   (bound 3314; room 1046)
```
⭐ **The `−716 B` shed reproduces E-2's figure EXACTLY** across an independent transcription — the spread between
the three lanes (+1,801 / +2,205 / +2,268) is entirely in the leaf's own minified size. Only the real build governs.
⛔ **The `foodGenerator.js` net is `−21`, which breached version 3's `≤ 20 net` bound by one line** — the bound is
raised to `≤ 25` in §7 and the arithmetic stated (label chain `:340-359` 20→1 = −19; flags `:475-478` 4→1 = −3;
import +1). Apply the LOWER edit first so the upper edit's addresses stay valid.

## G-10 — first paint, measured by IMPORTING the live set

```
EAGER_FIRST_PAINT_MODULES = 269          (version 3 measured 268 — the composition added one)
sorted-list sha16         = a9f1f4e8ec8ce31c   (version 3's f21c167bcc41b3c3 is WITHDRAWN)
eager members under /src/generators/ : 1   -> src/generators/lookups.js  (vite.config.js:636's own pin)
eager contains factionDynamics / defenseGenerator / foodGenerator / bandLadders : false / false / false / false
eager src/data members: 12 (constants, institutionalCatalog, resourceData, powerData, npcTraitWeights,
  finishedGoodsCategory, goods/identity, entityTags, institutionServiceKeys.generated, stressTypes,
  traditionProse, stressorSpinePhrases)
```
**The delta is `269 → 269`, and this is a STRUCTURAL proof rather than a replica's arithmetic:** membership is by
reachability from the eager roots, `src/data` is NOT excluded wholesale (12 of its files ARE eager), but none of
this leaf's three importers is in the set, so the leaf cannot be pulled into the eager closure at landing.
⚠ `ENGINE_SHARED_DOMAIN` is declared `const` at `vite.config.js:70` and is **not exported**, so it could not be
imported here; F-2's `51 → 51` stands as the prior lane's figure and is not re-proved at this tip.
⚠ The EM-R0b v2 reader variant (`src/domain/edit/recordInvariants.js` in the graph) was measured `+0` by the v3
lane at `141a1d775`; at this tip it is **PLAUSIBLE, not re-executed**.

## G-11 — the manifest, collisions, and a WITHDRAWN claim

```
entries: 194   by status: {"LANDED":192,"SUPERSEDED":2}
non-LANDED: IA-2 [SUPERSEDED], EM-B3 [SUPERSEDED]
EM-P2: LANDED   EM-P3: LANDED   EM-B3c: LANDED   EM-B1k: LANDED
EM-R0a: ABSENT from the manifest   EM-R0d: ABSENT from the manifest
collision on R0d's twelve paths: EM-P3 [LANDED] -> tests/build/generationWorkerLazy.test.js   (released at its landing)
scripts/mutation-coverage-manifest.json named by 31 packets, ALL LANDED -> FREE
```
⛔ **F-11's "the ONE non-LANDED entry is EM-P2 (READY)" is WITHDRAWN: EM-P2 has LANDED and there is no READY
entry in the manifest at all.** All twelve paths are free.

## G-12 — the registers that HOLD, each re-executed

| register | measured at `578272a99` | verdict |
|---|---|---|
| tuning, P3 `bareDecimals` | `factionDynamics.js` **48** · `defenseGenerator.js` **46** · `foodGenerator.js` **63** | ⭐ HOLD, identical to D-7/F-10. `TREES_P2P3 = ['src/domain','src/generators']`, so the leaf's ten decimals land OUTSIDE the register; the predicted 48 → 38 shrink is the ten fractional multipliers leaving |
| prose-numerics baseline | **218** rows (keys 0…217); **0** for any of this packet's four `src/` paths | ⭐ HOLD — the line-addressed hazard cannot bite |
| wiring census `stamp.files` | **7** entries, all `src/domain/display/stateProse/**`; none of this packet's paths, none in `candidateLeaves` | ⭐ HOLD — no `stale-bytes` re-take owed. ⚠ `stamp.producerIndexFiles` is a NUMBER, now **1172** (was 1171) |
| producer walk | `producerIndex()` walks `jsFilesUnder('src/generators')` + `jsFilesUnder('src/domain')` only (`scripts/wiring-census.mjs:224-225`) | ⭐ **`src/data` IS NOT WALKED** — preamble row 13's producer-file census row does NOT fire for this CREATE |
| observed-shape baseline | occurrences: `factionDynamics.js` 4 · `defenseGenerator.js` 4 · `foodGenerator.js` 3 · `holderTable.js` 3 · `src/data/bandLadders.js` **0**; bare `"bandLadders.js"` **0** | ⭐ F-18's no-conflation finding HOLDS. ⚠ These are raw path-occurrence counts, not finding identities: the identity claim stays §8 step 10's, at the build |
| size-baseline (hot files) | 19 keys; **none** is a path of this packet's | ⭐ HOLD |
| edge-shared metas | all five `*.meta.json` `inputs` lists: **none** names any of this packet's paths | ⭐ HOLD — none of the SEVEN generated paths is owed |

## G-13 — the two goldens and the lazy engine, at this tip

```
tests/fixtures/dossier-prose-manifest-golden.json  sha256=921c51cf6799ffdfdbffa3715fb496f7d15ce44fff508864653d8ebf3bb4db41  145773 B
tests/fixtures/generator-golden-master.json        sha256=7177cd6e89ebee404dec05d725d91e98ff59d2cfa124104a9a22515a7c8e8f1e   67779 B
prose-manifest _provenance.recordedOverSha = a62dcbb907a14daa4e2555f638ad7a7e82883d22   (OWNER ORDERS 2026-09-17)
```
⭐ **CURE-J's test change IS in the tip (`c127cdfb2` is an ancestor) but the FIXTURE still carries the OLD
provenance** — exactly as the chair said. **A6's claim is "unmoved by this packet", measured against the tip's
fixture as it stands**; when CURE-J's re-record composes, the golden moves for CURE-J's reason and not R0d's.

Lazy engine: the ceiling at the tip is unchanged at `expect(size).toBeLessThan(679_000)`
(`vendorPdfLazy.test.js:787`). ⛔ §5.2's "last measured 677,935 B, ~700 B of margin" is STALE — FIX-B2 has since
bought 35,079 B of engine headroom, so the arm is no longer knife-edge. This packet still predicts a further
`~716 B` SHRINK. The build lane READS and QUOTES the real number; it never edits this file.

## G-14 — mutation coverage and the voice-mechanics arms

```
ENFORCER_DIRS = ["tests/lint","tests/design","tests/docs","tests/data","tests/copy","tests/security",
                 "tests/edgeFunctions","tests/generators"]
NAME_PATTERN.test('bandLadders.js') = false ; ('bandLadders.test.js') = false ; ('compendiumBandLadders.test.jsx') = false
tests/domain an enforcer dir? false      src/data an enforcer dir? false
```
⭐ **HOLD — no mutation-coverage row is owed, and the manifest is free (G-11).**

**The voice-mechanics arms (F-6), re-measured structurally at this tip:**
- the allowlist entry is live at `voiceMechanics.test.js:339`, under key `'src/generators/foodGenerator.js'`:
  `'Deficit — Active Famine': { count: 1, why: 'food-security band :342 …' }` — and `:342` IS the line this
  packet deletes, so the `why` becomes false in both halves and must be rewritten with the re-key.
- Tier 2's `SCANNED_FILES = walkJs('src/data') ++ walkJs('src/domain')` — **the new leaf IS scanned.**
- the committed baseline is a flat `Record<path,{em,bang}>` of **56** keys, **every one under `src/domain/**`** —
  there is no `src/data` key, so the leaf would be a row the exact-diff ratchet has never seen.
- ⭐ **the cure is sound because `countFile` suppresses the em dash for an allowlisted (rel, text) pair**
  (`if (!isAllowedVocabulary(rel, text)) em += …`), so re-keying the entry to `'src/data/bandLadders.js'` gives
  the leaf `{em:0,bang:0}`, it never enters `current`, and the baseline stays byte-identical.
- ⭐ **the leaf's HEADER COMMENTS are not a risk**: `stringLiteralContents` walks the espree AST and pushes only
  `Literal` strings and `TemplateLiteral` quasis — comments are not in the AST, and the file's own header says
  so ("comments and template `${…}` expressions excluded"). The leaf contributes exactly ONE em-dash literal.
⛔ `tests/copy/.voice-mechanics-baseline.json` is therefore still NOT a manifest row and no refreeze is owed.
