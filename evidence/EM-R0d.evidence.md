# EM-R0d — EVIDENCE, VERSION 2 (the chair's rulings applied; re-measured at `e5bdfd031`)

**Version 2 preface.** Every D-row below was taken at `ad7ddf2c9` and is REVALIDATED at `e5bdfd031`
by E-0: `git diff --stat ad7ddf2c9 e5bdfd031 -- src/generators src/data` is EMPTY, so every producer
fact, ladder measurement, byte figure over the producers and placement figure still holds. The E-rows
that follow the D-rows carry version 2's own measurements: the re-measured placement WITHOUT the
`src/domain` re-export (E-1), the re-priced bytes with the FLAG ladder in the leaf (E-2), the
`prosperityMod` question answered (E-3), the lighting walker's own park/title verdicts (E-4), the
wiring-census stamp (E-5), the validator's `acceptanceCases` shape (E-6), and Q5's landing survey (E-7).

---

# EM-R0d — EVIDENCE. Every verified fact, its command, its output.

**Lane:** Opus COMPILE (EM-R0d), successor chair session 7d3418f8, 2026-09-19.
**Tree read:** `$SP/read-tip-ad7ddf2c9`, detached at `ad7ddf2c9`.
**Scratch (the only place written):** `$SP/lane-em-compile-EM-R0d-scratch/`.
**Nothing was edited, staged or committed anywhere. No vitest, no eslint, no npm script, no build.**
`SP=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad`

---

## D-0 — the tree, at the start and at the end

```
$ git -C "$SP/read-tip-ad7ddf2c9" rev-parse --short HEAD
ad7ddf2c9
$ git -C "$SP/read-tip-ad7ddf2c9" status --short
            <empty>
$ date
Sat Sep 19 18:56:12 EDT 2026
```
Re-run after every executed probe in this file: `git status --short` EMPTY each time (quoted at D-4, D-5).

## D-1 — the preamble hash, verified (not taken on report)

```
$ shasum -a 256 "$SP/read-tip-ad7ddf2c9/docs/implementation/preambles/EM-PREAMBLE.md"
b90a95b7af484137ecf70bd15cde5054edf66b5db0d9f6e90c974d97b7caa5e1  …/EM-PREAMBLE.md
```
CONFIRMED — byte-for-byte the hash the dispatch named.

## D-2 — the charter row and the design item, by SECTION + ITEM

`docs/DESIGN_EDIT_MODE_AND_DECREES.md` **§22.3 item 6** is NOT in the read tree (the tree's design
ends at §22.2, 425 lines). It is on the ledger:

```
$ git -C /Users/cstokes/Desktop/settlement-engine show review-fixes-2026-07-08:docs/DESIGN_EDIT_MODE_AND_DECREES.md | grep -n "^#\{2,3\} " | tail -1
427:### 22.3 ARCH-REDERIVE — the rulings the first two compiles forced (the chair, 2026-09-19 18:30 EDT; ODQ §934.47 addendum 25; vetoable)
```
Item 6, verbatim: *"Band checks read THE PRODUCER'S OWN TABLE, so three ladders get a domain-layer home
first. … RULED: a new golden-neutral member, **EM-R0d**, exports the three ladders from one domain-layer
home the generators import (the EM-P3 shape, priced against the zero-slack generation worker by
PLACEMENT), built BEFORE EM-R0b, whose second version then reads all four ladders by import and drops its
learned envelopes for them."*

`docs/implementation/charters/EDIT-MODE-TRAIN.md`, ledger, **"Amendments of 2026-09-19 18:30 EDT"**:
*"order is now **EM-R0a (v2) · EM-R0d · EM-R0b (v2) · R1–R5 · R0c · R6 · R7** … EM-R0d (NEW): the
legitimacy, readiness and food-security ladders exported from one domain-layer home, golden-neutral,
byte-priced by placement."* and *"queued behind the critical path (the family builds after train EM-T7)."*
⚠ **The charter's EM-R0d row is on the LEDGER ONLY** — the read tree's charter has no such row
(`grep -c "EM-R0d" $SP/read-tip-ad7ddf2c9/docs/implementation/charters/EDIT-MODE-TRAIN.md` → 0). The
chair's promotion carries the charter forward; this packet cites the ledger row.

## D-3 — THE THREE LADDERS, MEASURED BY EXECUTION AT EVERY BOUNDARY ±1

Script: `$SP/lane-em-compile-EM-R0d-scratch/r0d-ladders.mjs`. Method, stated so it can be audited:
* **legitimacy** — the REAL exported `legitimacyBandFor`, imported from the read tree with plain `node`.
* **readiness** — `computeDefenseReadiness` is a module-local `const`, so a VERBATIM copy of
  `defenseGenerator.js` was written to scratch with (a) its own relative import specifiers rewritten to
  absolute paths INTO the read tree and (b) ONE appended line `export { computeDefenseReadiness };`.
  Not one byte of the function's own text changed.
* **food** — the label chain is inline inside `generateFoodSecurity`; the chain's exact source SLICE was
  cut out by byte offset and executed as-is. The slice is printed below so the chair can diff it.

```
$ node "$SP/lane-em-compile-EM-R0d-scratch/r0d-ladders.mjs"

## LEGITIMACY — the REAL exported producer, src/generators/factionDynamics.js#legitimacyBandFor
  score=  0  label=Legitimacy Crisis  gov=0.6 crim=1.3 E=0 A=0 T=0 C=0 X=1 frac=1
  score= 29  label=Legitimacy Crisis  gov=0.6 crim=1.3 E=0 A=0 T=0 C=0 X=1 frac=1
  score= 30  label=Contested          gov=0.8 crim=1.15 E=0 A=0 T=0 C=1 X=0 frac=0
  score= 44  label=Contested          gov=0.8 crim=1.15 E=0 A=0 T=0 C=1 X=0 frac=0
  score= 45  label=Tolerated          gov=1 crim=1 E=0 A=0 T=1 C=0 X=0 frac=0
  score= 59  label=Tolerated          gov=1 crim=1 E=0 A=0 T=1 C=0 X=0 frac=0
  score= 60  label=Approved           gov=1.15 crim=0.9 E=0 A=1 T=0 C=0 X=0 frac=0
  score= 74  label=Approved           gov=1.15 crim=0.9 E=0 A=1 T=0 C=0 X=0 frac=0
  score= 75  label=Endorsed           gov=1.3 crim=0.75 E=1 A=1 T=0 C=0 X=0 frac=0
  score=100  label=Endorsed           gov=1.3 crim=0.75 E=1 A=1 T=0 C=0 X=0 frac=0
  SWEEP 0..100 first score of each label: Legitimacy Crisis@0 · Contested@30 · Tolerated@45 · Approved@60 · Endorsed@75

## READINESS — the REAL module-local producer, src/generators/defenseGenerator.js#computeDefenseReadiness
  readiness= 11 -> score= 11 label=Undefended        readiness= 12 -> label=Vulnerable
  readiness= 23 -> label=Vulnerable                  readiness= 24 -> label=Lightly Defended
  readiness= 37 -> label=Lightly Defended            readiness= 38 -> label=Defensible
  readiness= 54 -> label=Defensible                  readiness= 55 -> label=Well-Defended
  readiness= 75 -> label=Well-Defended               readiness= 76 -> label=Fortress
  SWEEP 0..100 first readiness of each label: Undefended@0 · Vulnerable@12 · Lightly Defended@24 · Defensible@38 · Well-Defended@55 · Fortress@76
  identity check (score echoes the input, so the sweep really walks the ladder): 0->0 50->50 100->100

## FOOD SECURITY — the inline label chain, cut VERBATIM (byte offsets 18165..18751)
  let label, color, bg;
  if (stressFamine) {            label = 'Deficit — Active Famine'; color = '#8b1a1a'; bg = '#fdf4f4';
  } else if (deficitPct > 40) {  label = 'Deficit';                 color = '#8b1a1a'; bg = '#fdf4f4';
  } else if (deficitPct > 15) {  label = 'Import-Dependent';        color = '#8a3010'; bg = '#fdf0e8';
  } else if (deficitPct > 5)  {  label = 'Pressured';               color = '#7a5010'; bg = '#faf8e8';
  } else if (surplusPct > 40) {  label = 'Surplus';                 color = '#1a5a28'; bg = '#f0faf4';
  } else {                       label = 'Secure';                  color = '#2a6a38'; bg = '#f4fbf6'; }
  famine=false deficitPct=       5 -> Secure           deficitPct=  5.0001 -> Pressured
  famine=false deficitPct=      15 -> Pressured        deficitPct= 15.0001 -> Import-Dependent
  famine=false deficitPct=      40 -> Import-Dependent deficitPct= 40.0001 -> Deficit
  famine=false surplusPct=      40 -> Secure           surplusPct= 40.0001 -> Surplus
  famine=true  deficitPct=       0 -> Deficit — Active Famine

## FOOD SECURITY — the FLAG ladder, cut VERBATIM from the SAME file (byte offsets 24849..25060)
    isDeficit:        deficitPct > 20 || stressFamine,
    isPressured:      deficitPct > 5 && deficitPct <= 20,
    isSecure:         deficitPct <= 5 && surplusPct <= 40,
    isSurplus:        surplusPct > 40,
  label vs flags (famine=false, surplus=0):
    deficitPct=  5  label=Secure             flags=isSecure
    deficitPct= 16  label=Import-Dependent   flags=isPressured      <-- THE DISAGREEMENT
    deficitPct= 20  label=Import-Dependent   flags=isPressured      <-- THE DISAGREEMENT
    deficitPct= 21  label=Import-Dependent   flags=isDeficit
    deficitPct= 41  label=Deficit            flags=isDeficit
```

**CONFIRMED, the three ladders, exactly:**

| ladder | producer (path#symbol) | exported? | cut points | operator | inputs |
|---|---|---|---|---|---|
| public legitimacy | `src/generators/factionDynamics.js#legitimacyBandFor` | ⭐ YES | 75 · 60 · 45 · 30 | `>=` (CLOSED below) | ONE: `score`, an integer 0..100 |
| defence readiness | `src/generators/defenseGenerator.js` — `computeDefenseReadiness`, module-local `const` | ⛔ NO | 76 · 55 · 38 · 24 · 12 | `>=` (CLOSED below) | ONE: `readiness`, an integer 0..100 |
| food security | `src/generators/foodGenerator.js` — an inline chain inside `generateFoodSecurity` | ⛔ NO | 40 · 15 · 5 (deficitPct) · 40 (surplusPct) | **`>` (OPEN below)** | **THREE: `stressFamine`, `deficitPct`, `surplusPct`** |

⭐ **THE FOOD LADDER IS NOT A ONE-INPUT LADDER, AND THIS IS LOAD-BEARING.** A `deficitPct → label`
function cannot reproduce it: `Deficit — Active Famine` comes from a boolean the deficit does not carry,
and `Surplus` is reachable only when `deficitPct <= 5`. EM-R0b's `V-BAND-FOODSEC` is written as a
`deficitPct → label` pair; made EXACT by import it must take all three. All three ARE on the record:
`hasFamine`, `deficitPct`, `surplusPct` (D-3b).

## D-3b — the three food inputs are all on the record, and two of them are ROUNDED

```
$ sed -n '404,432p' src/generators/foodGenerator.js   (the return object)
    label, color, bg,
    foodRatio:       Math.round(foodRatio * 100) / 100,
    deficitPct:      Math.round(deficitPct),
    surplusPct:      Math.round(surplusPct),
$ grep -n "hasFamine" src/generators/foodGenerator.js
480:    hasFamine:        stressFamine,
```
⛔ **THE PUBLISHED NUMBERS ARE ROUNDED; THE LABEL WAS COMPUTED FROM THE UNROUNDED ONES.** A checker that
re-runs the ladder over the record's own `deficitPct` is therefore checking a different number from the
one that produced the label — e.g. a true `15.4` labels `Import-Dependent` and publishes `15`, which
re-reads as `Pressured`. RECON-G measured the live disagreement over the whole corpus at **0 of 525 rows**
(`findings/RECON-G/RECON-G.report.md` §2 row A), and that measurement holds here because the producer is
byte-identical between the two tips (D-3c). ⚠ **Zero observed is not zero possible.** This is EM-R0b v2's
check-shape problem, named here; EM-R0d exports the ladder and rules nothing about it.

## D-3c — RECON-G's food measurements hold at MY tip (not taken on report)

```
$ git diff --stat 58fcfe614 ad7ddf2c9 -- src/generators/foodGenerator.js src/generators/factionDynamics.js src/generators/defenseGenerator.js
            <empty>
```
CONFIRMED byte-identical. All three producers are also unmoved from the compile base:
```
$ git diff --stat d31af2cee ad7ddf2c9 -- src/generators/factionDynamics.js src/generators/defenseGenerator.js src/generators/foodGenerator.js src/domain/compendium/bandLadders.js tests/build/domainGeneratorsBoundary.test.js vite.config.js
            <empty>
$ git diff --stat d31af2cee ad7ddf2c9 -- tests/build/generationWorkerLazy.test.js
 tests/build/generationWorkerLazy.test.js | 41 +++++++++++++++++++++++++++++++-
 1 file changed, 40 insertions(+), 1 deletion(-)
```
⭐ **ONE declared path moved between the compile base and the tip, and it is the ceiling file** — EM-P3's
re-mint. Because this packet carries a ceiling TEST row, the base MUST be stamped to `ad7ddf2c9` or later
or `assertAncestorAndSubstrate` throws (EM-P3's §4 refusal, reproduced).

## D-4 — ⭐ PLACEMENT, by the repo's OWN derivations, over a virtual overlay

`$SP/lane-em-compile-EM-R0d-scratch/r0d-placement.mjs` copies `vite.config.js`'s own
`computeEngineSharedDomain` and `computeEagerModuleGraph` verbatim (only the fs reads are routed through
an overlay; nothing on disk is touched) and adds a static BFS closure from
`src/workers/generation.worker.js`.

```
$ node r0d-placement.mjs base
=== BASE ===  ESD: 68  EAGER: 283  WORKER(static): 220
    src/generators/factionDynamics.js   ::  ESD false / EAGER false / WORKER true
    src/generators/defenseGenerator.js  ::  ESD false / EAGER false / WORKER true
    src/generators/foodGenerator.js     ::  ESD false / EAGER false / WORKER true

$ node r0d-placement.mjs packet        # values in src/data, generators import the src/data address
=== PACKET ===  ESD: 68  EAGER: 283  WORKER(static): 221
    src/data/bandLadders.js    ::  ESD false / EAGER false / WORKER true
    src/domain/bandLadders.js  ::  ESD false / EAGER false / WORKER false

$ node r0d-placement.mjs forbid        # generators import the src/domain address (EM-P3's P-20g shape)
=== FORBID ===  ESD: 69  EAGER: 285  WORKER(static): 222
    src/data/bandLadders.js    ::  ESD false / EAGER true  / WORKER true
    src/domain/bandLadders.js  ::  ESD true  / EAGER true  / WORKER true

$ node r0d-placement.mjs domainonly    # ONE leaf under src/domain, generators import it
=== DOMAIN-ONLY ===  ESD: 69  EAGER: 284  WORKER(static): 221
    src/domain/bandLadders.js  ::  ESD true / EAGER true / WORKER true

$ git -C "$SP/read-tip-ad7ddf2c9" status --short
            <empty>
```
⭐ BASE reproduces EM-R0b's R-14 figures exactly (ESD 68 · EAGER 283 · WORKER 220), so the instrument
agrees with the sibling lane's.

| placement | ENGINE_SHARED_DOMAIN | EAGER_FIRST_PAINT_MODULES | worker static closure |
|---|---:|---:|---:|
| BASE | 68 | 283 | 220 |
| ⭐ **values in `src/data/`, re-export in `src/domain/`, generators import `src/data/`** | **68 (+0)** | **283 (+0)** | 221 (+1) |
| ⛔ generators import the `src/domain/` address | 69 (+1) | **285 (+2)** | 222 (+2) |
| ⛔ ONE leaf under `src/domain/`, generators import it | 69 (+1) | **284 (+1)** | 221 (+1) |

**CONFIRMED: the naive reading of "one domain-layer home" — a single leaf under `src/domain/` — charges the
three owner-ratified first-paint budgets (+1 eager module). The EM-P3 split does not (byte-identical
eager set).** A second, independent instrument forces the same answer at D-7.

## D-5 — BYTE PRICING (esbuild per-file minify, the sibling lanes' estimate method)

Scripts: `r0d-bytes.mjs`, `r0d-bytes-lean.mjs`, `r0d-bytes-tuple.mjs`. Each writes faithful before/after
copies into `…/bytes/` IN SCRATCH and minifies both. esbuild's JS API is taken from the tree's
`node_modules`; nothing on disk in the tree is touched (`git status --short` empty after each run).

```
$ node r0d-bytes.mjs           # VARIANT A — the band record rides with the ladder
  src/generators/factionDynamics.js   12368 ->   12249  (-119)
  src/generators/defenseGenerator.js   8324 ->    7964  (-360)
  src/generators/foodGenerator.js      7858 ->    7659  (-199)
  src/data/bandLadders.js (NEW)         new ->    2500  (+2500)
  src/domain/bandLadders.js (NEW)       new ->     445  (NOT in the worker)
  GENERATION-WORKER estimated delta = -678 + 2500 = +1822 B

$ node -e "…A-TIGHT: freeze the container, not every entry…"
  A  (as priced)                 2500
  A-TIGHT (outer freeze only)    2335      ->  worker delta = -678 + 2335 = +1657 B

$ node r0d-bytes-lean.mjs      # VARIANT B — the leaf holds the LADDER only; presentation stays home
  src/generators/factionDynamics.js   12368 ->   12647  (+279)
  src/generators/defenseGenerator.js   8324 ->    8338  (+14)
  src/generators/foodGenerator.js      7858 ->    8008  (+150)
  src/data/bandLadders.js (NEW)         new ->    1422
  GENERATION-WORKER estimated delta = +443 + 1422 = +1865 B

$ node r0d-bytes-tuple.mjs     # positional tuple entries instead of named objects
  TUPLE leaf minified: 1709      (the producers' re-assembly cost is NOT priced; a FLOOR, not a figure)
```

| shape | worker delta (estimate) | verdict |
|---|---:|---|
| ⭐ **A-TIGHT** — named frozen band records in the leaf, one `Object.freeze` per ladder | **+1,657 B** | RECOMMENDED: cheapest fully-priced shape, one comparison chain, one home |
| A — the same with a per-entry `Object.freeze` | +1,822 B | rejected: 165 B for freezing entries already inside a frozen container |
| B — ladder-only leaf, presentation maps in the three producers | +1,865 B | rejected, MEASURED: the per-label maps cost more than the ternaries they replace |
| positional tuples | ≥ +1,031 B (floor) | ⚠ CHAIR QUESTION 2 — cheaper, but positional and against `defenseScoreBands.js`'s own stated preference for a named frozen table |

⚠ **THE ESTIMATE OVERSTATES, AND THE PRECEDENT SAYS BY HOW MUCH.** EM-P3 priced `+206 B` by this same
per-file method and its real build measured `+80 B` (`tests/build/generationWorkerLazy.test.js`'s own
dated attribution comment, quoted at D-6). The build lane's real figure governs; the packet's bound is
this estimate ×2 as the brief's rule requires.

## D-6 — THE CEILINGS, READ

```
$ grep -n 'WORKER_BUNDLE_CEILING_BYTES' tests/build/generationWorkerLazy.test.js
159:export const WORKER_BUNDLE_CEILING_BYTES = 1401208;
$ grep -n '679_000' tests/build/vendorPdfLazy.test.js
787:    expect(size).toBeLessThan(679_000);
$ grep -n 'DATA_LAZY_RAW_CEILING_BYTES' tests/build/vendorPdfLazy.test.js
1472:const DATA_LAZY_RAW_CEILING_BYTES = 3_098_110;
```
`generationWorkerLazy.test.js`'s own comment records EM-P3's landing: *"1,401,128 → 1,401,208 … +80 B
minified … exactly THREE modules whose rendered length moved ANYWHERE … the eager first-paint set is
byte-identical at 268 modules … the lazy engine SHRANK 678,131 → 677,935 B."*

⭐ **WHICH EMITTED CHUNK EACH PATH LANDS IN — from `vite.config.js`'s own `manualChunks`:**
```
$ grep -n "id.includes('/src/generators/')" -A 1 vite.config.js
862:          if (id.includes('/src/generators/'))
863:            return 'engine';
$ grep -n "id.includes('/src/data/')" vite.config.js
885:          if (id.includes('/src/data/'))          # -> the eager 'data' chunk IF an eager module
                                                     #    imports it, else 'data-lazy' (the line-413 split)
```
So, per budget:
* **generation worker** (an independent entry bundle that inlines its whole closure) — **+1,657 B
  estimated against a ZERO-SLACK ceiling of 1,401,208.** ⭐ This is the ONE obligation, and it is exactly
  the one §22.3 item 6 names.
* **lazy `engine` chunk** — the three producers are `src/generators/**` → `'engine'`; the new leaf is
  `src/data/**` → NOT `'engine'`. The engine therefore **SHRINKS by ~678 B (estimate)**. EM-P3's landing
  is the precedent for exactly this direction (engine −196 B when its values moved to `src/data/`).
  READ and quoted at the build, never edited (EM-P3's ruling Q3).
* **`data-lazy`** — +~2,335 B against `3_098_110` over EM-P3's measured ~939,520. A ~2.16 MB allowance.
* **eager first paint** — byte-identical, 283 → 283 modules, ESD 68 → 68 (D-4).

## D-7 — ⭐ THE TUNING REGISTER INDEPENDENTLY FORCES THE SAME PLACEMENT

Run with the repo's own scanner, `scripts/lib/tuning-inventory.mjs`:
```
$ node --input-type=module -e "…countBareDecimals(TREE, []) / countUnregisteredNamed(TREE, [])…"
  P3 bare-decimals   48  P2 named   0   src/generators/factionDynamics.js
  P3 bare-decimals   46  P2 named   0   src/generators/defenseGenerator.js
  P3 bare-decimals   63  P2 named   7   src/generators/foodGenerator.js
  P3 bare-decimals    0  P2 named   0   src/domain/display/defenseScoreBands.js
  P3 total: 8542  files with any: 451        P2 total: 644
  TREES_P1   = ["src"]          TREES_P2P3 = ["src/domain","src/generators"]
$ grep -n "SHRINK-ONLY" tests/lint/tuningRegister.walker.test.js
448:    expect(problems, 'P3 is SHRINK-ONLY with new files at zero. …
482:    expect(problems, 'P2 is SHRINK-ONLY with new files at zero.').toEqual([]);
```
Readings, each load-bearing:
1. **`src/data` is OUTSIDE `TREES_P2P3`.** The leaf's ten fractional legitimacy multipliers cost the
   register nothing there.
2. ⛔ **A NEW FILE UNDER `src/domain/` CARRYING THOSE TEN DECIMALS WOULD RED P3** — *"new files at zero."*
   The DOMAIN-ONLY placement D-4 already refused on first paint is refused a second time, by a second
   instrument, for a different reason.
3. ⭐ **This packet SHRINKS the register.** The ten fractional multipliers leave
   `factionDynamics.js` (`P3 48 → 38`, a shrink of 10 — derived arithmetic on the scanner's measured 48;
   the exact AFTER is PLAUSIBLE, the direction is CONFIRMED). `defenseGenerator.js` and `foodGenerator.js`
   lose no decimals — their cut points are integers, which `BARE_DECIMAL_RE` does not match (proved by
   `defenseScoreBands.js` measuring 0 with its integer `SCORE_BAND_CUTS`).
4. `src/domain/bandLadders.js` is a pure re-export with no numeric literal at all → P2 0, P3 0.
5. Neither leaf is named `*_TUNING`, so neither is a P1 table (`TREES_P1 = ["src"]`).

## D-8 — ⛔⛔ TWO EXISTING TESTS PIN THE LADDERS **BY SOURCE TEXT**, AND THIS PACKET DELETES BOTH ANCHORS

```
$ git grep -n "mustExtract" -- tests | grep -i "readiness\|food security"
tests/domain/generalStateProseDesk.test.js:203:  mustExtract(body, 'readiness >= 76 ?', 'the readiness band table in defenseGenerator.js');
tests/domain/generalStateProseDesk.test.js:216:  mustExtract(body, "label = 'Deficit — Active Famine'", 'the food security ladder in foodGenerator.js');
$ sed -n '199,221p' tests/domain/generalStateProseDesk.test.js
function readinessLabels() {
  const body = src('src/generators/defenseGenerator.js');
  mustExtract(body, 'readiness >= 76 ?', 'the readiness band table in defenseGenerator.js');
  const window = body.slice(body.indexOf('readiness >= 76 ?'));
  const found = [...window.slice(0, 900).matchAll(/label: '([^']+)'/g)].map((m) => m[1]);
  if (found.length !== 6) throw new Error(`readinessLabels extracted ${found.length}, expected 6`);
  return found;
}
function foodLabels() {
  const body = src('src/generators/foodGenerator.js');
  mustExtract(body, "label = 'Deficit — Active Famine'", 'the food security ladder in foodGenerator.js');
  const found = [...body.matchAll(/^\s*label = '([^']+)';$/gm)].map((m) => m[1]);
  …
}
$ sed -n '296,304p' tests/domain/generalStateProseDesk.test.js
  it('the source extractors reach real producers and would throw if they moved', () => {
    expect(readinessLabels()).toEqual([
      'Fortress', 'Well-Defended', 'Defensible', 'Lightly Defended', 'Vulnerable', 'Undefended', ]);
    expect(foodLabels().sort()).toEqual([
      'Deficit', 'Deficit — Active Famine', 'Import-Dependent', 'Pressured', 'Secure', 'Surplus', ]);
```
And two more, reading the producer source directly:
```
$ git grep -n "readFileSync.*foodGenerator\|readFileSync.*factionDynamics" -- tests
tests/ui/compendiumFoodSecurity.test.jsx:35:    const src = readFileSync(join(ROOT, 'src/generators/foodGenerator.js'), 'utf8');
tests/ui/compendiumPower.test.jsx:35:    const src = readFileSync(join(ROOT, 'src/generators/factionDynamics.js'), 'utf8');
       # compendiumFoodSecurity: expect(src.includes(name)) for all six rung names
       # compendiumPower:        expect(src.includes(`'${name}'`)) for all five legitimacy labels
```
CONFIRMED: **three existing test files hold FOUR source-text anchors this packet's edit destroys.** None
is an exported symbol, so `requiredSymbols`' verbatim check would NOT have caught them and the build
would have found them. They are declared TEST rows in §7, each with its one cure: read the LEAF, which is
strictly stronger (an import of the producer's own table instead of a regex over its source text).

## D-9 — every OTHER live spelling of the three ladders, measured

```
$ git grep -c "Fortress\|Well-Defended\|Defensible\|Lightly Defended\|Vulnerable\|Undefended" -- src | sort -t: -k2 -rn | head
$ git grep -c "Endorsed\|Approved\|Tolerated\|Contested\|Legitimacy Crisis" -- src | sort -t: -k2 -rn | head
$ git grep -c "Import-Dependent\|Active Famine\|Pressured\|Surplus" -- src | sort -t: -k2 -rn | head
```

| ladder | other live spelling | what it spells | this packet |
|---|---|---|---|
| legitimacy | `src/domain/rulingPower.js#rebandLegitimacy` (`:332-356`) | the WHOLE ladder again — cuts 75/60/45/30, colour, both multipliers, all six flags. Module-local, not exported. Its own comment: *"Band thresholds + multipliers mirror factionDynamics.computePublicLegitimacy and timeProgression's private reBand — the two existing writers. Keep all three in step if the bands ever move."* | ⛔ NOT TOUCHED (§2 non-goal). Priced for the chair at D-10 |
| legitimacy | `src/domain/timeProgression.js#reBand` (`:148-156`) | the ladder a THIRD time, play-time. `factionDynamics.js`'s own docblock DEFERS it by name and gives the reason: *"importing this generator export would trip the domain→generators boundary ratchet … its output feeds the parked worldPulse goldens"* | ⛔ NOT TOUCHED. ⭐ **This packet REMOVES that stated reason** (D-10) |
| legitimacy | `src/domain/compendium/bandLadders.js#LEGITIMACY_LEVELS` (`:175-181`) | the cuts in PROSE — *"At or above 75"*, *"At or above 60"*, *"At or above 45"*, *"At or above 30"*, *"Below 30"* — plus the docblock *"factionDynamics.js: Endorsed >=75, Approved >=60, Tolerated >=45, Contested >=30"* | ⛔ NOT TOUCHED. Its drift guard (`tests/ui/compendiumPower.test.jsx`) IS re-pointed by §7 |
| legitimacy | `src/domain/compendium/generated/compendiumData.generated.js:82` | the same prose, BAKED into the frozen artifact | ⛔ generated; regenerating it is a Compendium act, not this packet's |
| legitimacy | `src/data/foundingSeeds.js:54` | one authored sentence quoting a label | ⛔ not a ladder |
| food | `src/domain/compendium/bandLadders.js#FOOD_SECURITY_LEVELS` (`:159-166`) | the cuts in PROSE — *"above 40 percent"*, *"above 15 percent"*, *"above 5 percent"*, surplus *"above 40 percent"* — and it names the top rung **`Active Famine`**, not the producer's `Deficit — Active Famine` | ⛔ NOT TOUCHED. ⚠ the rung-name difference is real and is a noticed-not-touched item |
| food | `src/generators/foodGenerator.js:475-478` | **THE FLAG LADDER — the SAME quantity on DIFFERENT cuts** (`isDeficit > 20`, `isPressured > 5 && <= 20`), measured to disagree with the label on `deficitPct ∈ (15, 20]` (D-3) | ⭐ the packet re-points its two shared cuts at the table and pins its own `20` as a named local cut (§7) |
| food | `src/generators/foodGenerator.js:374-392` | a THIRD chain over `deficitPct` — the `prosperityMod` ladder, cuts **40 / 20 / 8** | ⛔ NOT a band ladder; named, not touched |
| food | `src/domain/summary/settlementQuickGuide.js:562` | a docblock naming *"THE SIX LABELS `generateFoodSecurity` CAN EMIT"* | ⛔ prose; not touched |
| readiness | `src/generators/factionDynamics.js#DEFENSE_CONTRIB` (`:51-59`) | the SIX readiness labels as keys, with a comment quoting the band interval (*"readiness 24-37"* — CONFIRMED correct: `[24, 38)` is 24..37) | ⛔ NOT TOUCHED — a `requiredSymbols` row. ⭐ the one place the two ladders MEET |
| readiness | `src/generators/power/rulingStructure.js:733-744` | FIVE of the six readiness labels assigned from INSTITUTIONS with **no score at all** (`_provDefLabel`, a provisional label used when `projection.defenseLabel` is absent) | ⛔ NOT TOUCHED. ⚠ a label-vocabulary spelling the ladder cannot reach; a real noticed-not-touched item |
| readiness | `src/domain/compendium/bandLadders.js#DEFENSE_READINESS_LEVELS` (`:203-208`) | ⚠ **NOT this ladder** — it is `display/defenseScoreBands.js#scoreBand` (Strong/Adequate/Weak/Critical at 65/40/20), the PER-ARM badge. **The Compendium documents no rungs at all for the overall readiness ladder**; its blurb only says *"from well defended down to undefended"* | ⛔ NOT TOUCHED. ⚠ a documentation gap, named |
| all three | `src/domain/display/stateProse/*.js`, `src/data/dossierStateProse/*.generated.js`, `src/data/proseNorms.generated.js` | prose POOLS KEYED BY the label — consumers of the vocabulary, not second spellings of the cuts | ⛔ not touched |

**Two NAME COLLISIONS that are not duplicates, recorded so a later ladder registry does not merge them:**
`'Vulnerable'` is both a readiness label and a `src/domain/state/bands.js` StateDimension band
(`25–49 Vulnerable`); `'Contested'` is both a legitimacy label and a
`src/domain/qualitativeBands.js` substrate display label (`strained: 'Contested'`). Different quantities,
different ladders, same word.

**Is the label computed ONCE or per surface?**
* **readiness** — ONCE, at generation. `git grep -n "readiness\.label\s*=\|readiness = {" -- src` returns
  nothing outside `defenseGenerator.js`. CONFIRMED.
* **legitimacy** — THREE times: `legitimacyBandFor` at generation, `rulingPower#rebandLegitimacy` and
  `timeProgression#reBand` at play time.
* **food** — ONCE, at generation, and **never re-graded**: RECON-G §1 measured that five tick-time writers
  spread `label`/`color`/`bg` through untouched while overwriting `deficitPct` beside them, and that no
  tick-time writer of `foodSecurity.label` and no display-side re-derivation exists.

## D-10 — the two domain-side BUY-BACKS, priced (offered, NOT taken)

```
$ node r0d-buyback.mjs
  src/domain/timeProgression.js          5015 ->    4783  (-232)
  src/domain/rulingPower.js              8978 ->    8726  (-252)
```
Re-pointing both at the leaf would delete the legitimacy ladder's 2nd and 3rd copies and save ~484 B where
they sit. ⛔ **REFUSED BY THIS PACKET, for three measured reasons:** (1) it would take the
"existing logic-bearing production files modified" count from 3 to 5, past the standard's cap of 3;
(2) `factionDynamics.js`'s own docblock records the output feeds the **parked worldPulse goldens**, so it
is not golden-neutral in this packet's sense; (3) `rulingPower.js` describes itself as having an **eager
entrance** (*"transferRulingPower (the eager entrance via events/mutateWorld)"*), so an import from it
into `src/domain/bandLadders.js` would seed the first-paint closure — the D-4 FORBID shape. It is
sequenced as its own member, not smuggled in here.

## D-11 — the domain→generators boundary ratchet: this packet adds none, removes none

```
$ sed -n '60,66p' tests/build/domainGeneratorsBoundary.test.js
const BASELINE_EDGES = Object.freeze({
  'src/domain/coherence/checkDraftEdit.js': ['../../generators/structuralValidator.js'],
  'src/domain/relationships/neighbourBackLink.js': ['../../generators/crossSettlementConflicts.js'],
  'src/domain/worldPulse/institutionLifecycle.js': ['../../generators/computeActiveChains.js'],
  'src/domain/worldPulse/resourceDynamicsKernel.js': ['../../generators/computeActiveChains.js', '../../generators/terrainHelpers.js'],
});
```
4 files / 5 edges — unchanged from EM-R0b's R-6. **This packet REMOVES none of the five** (they are about
`structuralValidator`, `crossSettlementConflicts`, `computeActiveChains`, `terrainHelpers`), and the test
has a second arm that reds on a STALE baseline entry, so removing one would owe an edit. What the packet
does is remove the NEED for a SIXTH: EM-R0b's measured refusal — *"importing `legitimacyBandFor` from
`src/domain/edit/` is a NEW `src/domain` → `src/generators` edge"* — is discharged, because the ladder
now lives under `src/data/`, which the ratchet does not police and which **96 `src/domain` files already
import directly**:
```
$ git grep -l "from '\.\./data/\|from '\.\./\.\./data/\|from '\.\./\.\./\.\./data/" -- src/domain | wc -l
      96
```
⭐ **This is the ratchet's own instruction executed**: *"If the new coupling is unavoidable, invert it
(move the shared leaf down a layer …) rather than widening the baseline."* The leaf moved down a layer.

## D-12 — REGISTRATION OBLIGATIONS, each priced

```
$ sed -n '515,518p' tests/lint/sovereigntyLightingContract.walker.test.js
const TEST_FILES = walk(join(ROOT, 'tests')).filter((p) => /\.test\.(js|jsx)$/.test(p)) …
$ sed -n '36,45p;69,73p' tests/lint/mutationCoverage.shared.mjs
export const ENFORCER_DIRS = ['tests/lint','tests/design','tests/docs','tests/data','tests/copy','tests/security','tests/edgeFunctions','tests/generators'];
export const NAME_PATTERN = /(census|scan|baseline|ratchet|walker|killlist|parity|coverage|governance|freshness|integrity|exhaustiveness|roundtrip|golden|contract|pin)/i;
  const picked = all.filter((rel) => ENFORCER_DIRS.some((d) => rel.startsWith(`${d}/`)) || NAME_PATTERN.test(basename(rel)));
$ node -e "…prose-numerics baseline…"
  factionDynamics: NO ROW   defenseGenerator: NO ROW   foodGenerator: NO ROW
  (row shape: {"path":…,"line":…,"category":…,"snippet":…} — 218 rows, addressed by file + line)
$ node -e "…observed-shape inventory…"
  src/generators/defenseGenerator.js => {"_foodSecurity on config":1,"_institutions on config":1,"magicExists on config":2,"tradeRoute on settlement":1}
  src/generators/factionDynamics.js  => {"economyOutput on inst":2,"safetyRatio on inst":1}
  src/generators/foodGenerator.js    => (no inventory row — ceiling 0)
$ node -e "…size baseline…"   factionDynamics absent  defenseGenerator absent  foodGenerator absent
$ sed -n '466,472p' docs/implementation/PACKET_STANDARD.md   # the hot-file standing list
  EconomicsTab.jsx · OutputContainer.jsx · convergence.js · peaceTerms.js · informationStatecraft.js
```
* **Lighting census — YES, a DELTA only.** `files +1 · credited +1 · parked +0 · suiteTitles +1` (one
  literal `describe` in the new test file) `· titles +8` (A1–A8). The three cured test files gain **no**
  `it(` title — every cure is inside an existing `it(` body. ⛔ No absolute tuple is quoted anywhere in
  this packet; the register is `measuredBy EM-P0` and is behind EM-B3a's and EM-P3's landings.
* **Mutation-coverage manifest — NO.** `tests/domain` is not an `ENFORCER_DIR` and `bandLadders.test.js`
  matches no `NAME_PATTERN` token. ⚠ **Both halves matter and one is a trap:** `tests/generators/` IS an
  enforcer dir, so putting the acceptance test beside the producers would silently owe a row; so would
  `bandLadders.contract.test.js` or `bandLadders.walker.test.js`. `tests/ui/` and `tests/build/` are not
  enforcer dirs and the three cured files already exist and carry no row.
* **Prose-numerics — NO, and the line-addressing hazard does not bite.** None of the three modified files
  carries a baseline row, so the packet cannot shift a baselined line (pre-proof step 13 discharged with a
  clean negative).
* **Observed-shape readers — PRICED, RED-FIRST AT THE BUILD.** The packet adds no property read of a
  settlement object anywhere: the leaf takes scalars. `foodGenerator.js` has **no inventory row, so its
  ceiling is 0** — any new heuristic finding there reds. §8 carries the before/after scan and a STOP.
* **Writer-reach — NO.** The single writer of each field is unchanged; a reader can only shrink the dark
  set and a shrink is `--write`, the chair's act, not this packet's.
* **Tuning register — SHRINKS (D-7).** No P1 table, no P2 named const, `src/data` outside the P2/P3 trees,
  ten fractional literals leaving `src/generators`.
* **Size-baseline / hot files — NONE.** No modified file has a size-baseline row or appears on the
  standing hot-file list.
* **Decision-fork / mechanism-coverage — NO.** No chooser, no pool, no new vocabulary: every label and
  every number already exists and keeps its exact value.
* **Edge-shared — NO, MEASURED.** Static closures from all five entry modules:
```
  src/domain/aiGrounding.js   74 modules      src/lib/analyticsEvents.js   2
  src/domain/aiCharter.js    105 modules      src/domain/intentAtlas.js    2
  src/domain/aiOutputSchema.js 106 modules
  none contains factionDynamics.js, defenseGenerator.js or foodGenerator.js
```
  No bundle moves, so none of the SEVEN generated paths is owed and no declared `checks` command writes
  any path (both are `npx vitest run` on files the manifest already names).

## D-13 — `requiredSymbols`, resolved VERBATIM, with the POST-EDIT simulation

```
$ for pair in …; do grep -cF "$s" "$f"; done
  1x   src/generators/factionDynamics.js        :: export function legitimacyBandFor
  1x   src/generators/factionDynamics.js        :: export const DEFENSE_CONTRIB
  1x   src/generators/defenseGenerator.js       :: const computeDefenseReadiness = (scores, threat, tier, magicExists = true) =>
  1x   src/generators/foodGenerator.js          :: export function generateFoodSecurity
  1x   tests/build/generationWorkerLazy.test.js :: export const WORKER_BUNDLE_CEILING_BYTES
  1x   tests/build/domainGeneratorsBoundary.test.js :: const BASELINE_EDGES
  1x   tests/domain/generalStateProseDesk.test.js   :: function readinessLabels()
  1x   tests/domain/generalStateProseDesk.test.js   :: function foodLabels()
  1x   tests/helpers/sourceContract.js          :: export function mustExtract
```
| row | present after this packet's own edits? |
|---|---|
| `export function legitimacyBandFor` | **YES** — the export and its signature are preserved; only the body changes |
| `export const DEFENSE_CONTRIB` | **YES** — untouched |
| `const computeDefenseReadiness = (scores, threat, tier, magicExists = true) =>` | **YES** — the declaration line is untouched; only the `band` expression inside it changes |
| `export function generateFoodSecurity` | **YES** — untouched declaration |
| `export const WORKER_BUNDLE_CEILING_BYTES` | **YES** — the re-mint changes the VALUE; the required text is the declaration |
| `const BASELINE_EDGES` | **YES** — read, never edited |
| `function readinessLabels()` · `function foodLabels()` | **YES** — the cure changes their bodies, not their names |
| `export function mustExtract` | **YES** — this packet edits two CALL SITES, not the helper |

**`retiredSymbols`: EMPTY.** The packet moves, renames and deletes no exported symbol.
⛔ **But the simulation's real finding is that `requiredSymbols` CANNOT see this packet's true retirements:
four SOURCE-TEXT anchors retire (D-8), and no verbatim symbol check would have caught them.** They are
carried as declared TEST rows instead.

Other LANDED packets' rows on the same (path, symbol) pairs, and their discharge:
```
$ node -e "…scan PACKET_MANIFEST.json (189 entries: 186 LANDED, 2 SUPERSEDED, 1 READY)…"
  GV-1  (LANDED)  tests/helpers/sourceContract.js :: export function mustExtract          -> DISCHARGED (file untouched)
  EM-P3 (LANDED)  tests/build/generationWorkerLazy.test.js :: export const WORKER_BUNDLE_CEILING_BYTES
                                                                                          -> DISCHARGED (the declaration text survives the re-mint, exactly as EM-P3's own re-mint relied on)
  retiredSymbols rows on any of this packet's paths: NONE
```
Change-path collisions across the manifest's 189 entries: **none free-standing** —
```
  src/data/bandLadders.js · src/domain/bandLadders.js · the three producers ·
  tests/domain/bandLadders.test.js · tests/domain/generalStateProseDesk.test.js ·
  tests/ui/compendiumFoodSecurity.test.jsx · tests/ui/compendiumPower.test.jsx          free
  tests/build/generationWorkerLazy.test.js                        EM-P3:LANDED (released at its landing)
```

## D-14 — precedents this packet copies, by symbol

* **Placement** — `EM-P3.md` §2 and §5.2: values in `src/data/`, the address in `src/domain/`, the
  generator importing the `src/data/` one; *"THE CURE IS THE PLACEMENT, NEVER THE CEILING"*.
* **The shape of a cut-point table** — `src/domain/display/defenseScoreBands.js#SCORE_BAND_CUTS`, whose own
  header states this packet's whole thesis for a different ladder: *"the numbers stop being literals
  anywhere … there is no longer a copy that CAN fall behind, because there is no longer a copy"*, and
  whose comment explains why it is **an object, not three named scalars** (the tuning register's P2
  population) and why it is **not** named `*_TUNING` (that suffix is P1's trigger). This packet's
  `*_CUTS` names copy it exactly.
* **The boundary re-export idiom** — `src/domain/cultureProfiles.js`'s header.
* **Test precedent (producer-derived vocabulary)** — `tests/domain/powerStateProseDesk.test.js`
  › `it('every label legitimacyBandFor can emit is a DS-POW-1 pool key, and covers the ladder')`, which
  already walks `0..100` through the real producer rather than transcribing a list: *"A hand-copied list
  would be a second spelling of the vocabulary and would agree with itself while both drifted."*
* **Test precedent (identity/golden)** — `tests/property/generatorGoldenMaster.test.js`
  › `it('every config produces byte-identical output to the golden master')`.
* **Ceiling re-mint form** — `91d5f155b`, and EM-P3's §8 step 9 (control build, per-module attribution,
  the monotone proof, `VERIFY_DIST=1`).

## D-15 — the §7 table and the JSON manifest are SET-EQUAL, and every action is in `PACKET_ACTIONS`

```
$ grep -n "const PACKET_ACTIONS" -A 3 scripts/implementation-packets.mjs
30:export const PACKET_ACTIONS = Object.freeze([
31-  'CREATE',
32-  'DOC',
33-  'MODIFY',      (…'TEST' follows)

$ node -e "…parse §7's table out of EM-R0d.md, compare with EM-R0d.manifest.json…"
§7 table rows (10):                        JSON rows (10):
   CREATE src/data/bandLadders.js             CREATE src/data/bandLadders.js
   CREATE src/domain/bandLadders.js           CREATE src/domain/bandLadders.js
   MODIFY src/generators/defenseGenerator.js  MODIFY src/generators/defenseGenerator.js
   MODIFY src/generators/factionDynamics.js   MODIFY src/generators/factionDynamics.js
   MODIFY src/generators/foodGenerator.js     MODIFY src/generators/foodGenerator.js
   TEST tests/build/generationWorkerLazy.test.js        (same)
   TEST tests/domain/bandLadders.test.js                (same)
   TEST tests/domain/generalStateProseDesk.test.js      (same)
   TEST tests/ui/compendiumFoodSecurity.test.jsx        (same)
   TEST tests/ui/compendiumPower.test.jsx               (same)
ONLY in §7: (none)          ONLY in JSON: (none)          SET-EQUAL: true
every action in PACKET_ACTIONS: true
acceptanceCases: 8 (cap 8)   requiredSymbols: 9   retiredSymbols: 0   checks arrays: 5 (one directory each)
```

## D-16 — the read tree, at the END of the lane

```
$ git -C "$SP/read-tip-ad7ddf2c9" rev-parse --short HEAD
ad7ddf2c9
$ git -C "$SP/read-tip-ad7ddf2c9" status --short
            <empty>
```
CONFIRMED — the tree is at the same commit and is clean. Nothing was edited, staged or committed
anywhere; every write went to `$SP/lane-em-compile-EM-R0d-scratch/`. No vitest, no eslint, no npm script
and no build was run; every probe was plain `node` on a scratch script, one process at a time.

---

# VERSION 2 — the chair's rulings, measured at `e5bdfd031`

## E-0 — the newer tree, and the revalidation of every D-row

```
$ git -C "$SP/read-tip-e5bdfd031" rev-parse --short HEAD
e5bdfd031
$ git -C "$SP/read-tip-e5bdfd031" status --short
            <empty>
$ git -C "$SP/read-tip-e5bdfd031" diff --stat ad7ddf2c9 e5bdfd031 -- src/generators src/data
            <empty>
$ date
Sat Sep 19 20:02:20 EDT 2026
```
CONFIRMED: **not one byte of `src/generators` or `src/data` moved between the two tips**, so every D-row
above holds unchanged. What DID move (22 files, +1,619/−34): the charter (+111), EM-B3c's packet (new),
EM-B1d's packet, `scripts/mutation-coverage-manifest.json` (+4), five `src/domain/**` leaves,
`tests/lint/statusUnionTotality.walker.test.js` (new), `tests/generators/densityLaw.test.js` (+18),
`tests/domain/espionageMission.test.js`, and the five edge-shared bundles/metas (EM-B1d's landing).
⛔ **`tests/build/generationWorkerLazy.test.js` did NOT move** — its last three touches are `f4e5b64c5`
(EM-P3), `91d5f155b`, `7a0fe5889`.

All nine `requiredSymbols` re-checked at the new tip, each `1x` verbatim:
```
  1x  src/generators/factionDynamics.js            :: export function legitimacyBandFor
  1x  src/generators/factionDynamics.js            :: export const DEFENSE_CONTRIB
  1x  src/generators/defenseGenerator.js           :: const computeDefenseReadiness = (scores, threat, tier, magicExists = true) =>
  1x  src/generators/foodGenerator.js              :: export function generateFoodSecurity
  1x  tests/build/generationWorkerLazy.test.js     :: export const WORKER_BUNDLE_CEILING_BYTES
  1x  tests/build/domainGeneratorsBoundary.test.js :: const BASELINE_EDGES
  1x  tests/domain/generalStateProseDesk.test.js   :: function readinessLabels()
  1x  tests/domain/generalStateProseDesk.test.js   :: function foodLabels()
  1x  tests/helpers/sourceContract.js              :: export function mustExtract
```

## E-1 — ⭐ Q4: THE PLACEMENT RE-MEASURED WITHOUT THE `src/domain` RE-EXPORT

`r0d-placement.v2.mjs` (the same verbatim copies of `vite.config.js`'s `computeEngineSharedDomain` and
`computeEagerModuleGraph`, re-pointed at the new tree), with a new arm that puts EM-R0b v2's
`src/domain/edit/recordInvariants.js` in the overlay importing the SAME `src/data` leaf:

```
$ node r0d-placement.v2.mjs base
=== BASE ===  ESD: 68  EAGER: 283  WORKER(static): 220
$ node r0d-placement.v2.mjs packet
=== PACKET v2 (ONE leaf in src/data; NO domain re-export) ===  ESD: 68  EAGER: 283  WORKER(static): 221
$ node r0d-placement.v2.mjs domainreader
=== PACKET v2 + EM-R0b v2 reading the SAME src/data leaf ===  ESD: 68  EAGER: 283  WORKER(static): 221
$ node r0d-placement.v2.mjs forbid
=== FORBID (generators import a src/domain address) ===  ESD: 69  EAGER: 285  WORKER(static): 222
$ git -C "$SP/read-tip-e5bdfd031" status --short
            <empty>
```

| placement | ESD | EAGER | worker closure |
|---|---:|---:|---:|
| BASE | 68 | 283 | 220 |
| ⭐ **v2 — ONE leaf, `src/data/bandLadders.js`, no re-export** | **68 (+0)** | **283 (+0)** | 221 (+1) |
| ⭐ **v2 + EM-R0b v2 importing it from `src/domain/edit/`** | **68 (+0)** | **283 (+0)** | **221 (+1)** — IDENTICAL |
| ⛔ a generator importing a `src/domain` band address | 69 (+1) | 285 (+2) | 222 (+2) |

**CONFIRMED — the chair's Q4 ruling costs nothing and proves the re-export was never load-bearing.** A
`src/domain/edit/**` reader of `src/data/bandLadders.js` moves neither budgeted graph by a single module;
`computeEngineSharedDomain()` seeds only from `src/generators` imports of `src/domain`, and there is now
no `src/domain` file in this packet at all.

## E-2 — Q2 + the FLAG ladder: the bytes RE-PRICED

`r0d-bytes.v2.mjs` — named frozen tables (Q1), no re-export (Q4), the flag ladder as a SECOND named table
plus `foodSecurityFlagsOf`, the header stating the unrounded comparison (Q3):

```
$ node r0d-bytes.v2.mjs
  src/generators/factionDynamics.js        12368 ->   12249  (-119)
  src/generators/defenseGenerator.js        8324 ->    7964  (-360)
  src/generators/foodGenerator.js           7858 ->    7621  (-237)
  src/data/bandLadders.js (NEW)              new ->    2517  (+2517)

  GENERATION-WORKER estimated delta = -716 + 2517 = +1801 B
  v1 for comparison: -678 + 2335 = +1657 B (and a 445 B src/domain re-export outside the worker)
```

| | v1 | v2 (the chair's rulings) |
|---|---:|---:|
| producers shed | −678 B | **−716 B** (the flag block leaves too) |
| the leaf | 2,335 B | **2,517 B** (+182 B: the flag table and its function) |
| `src/domain` re-export | 445 B (outside the worker) | **removed — Q4** |
| ⭐ worker delta, estimated | +1,657 B | **+1,801 B** |

⭐ **THE CHAIR'S NAMED BOUND OF 3,314 B STILL COVERS IT, with 1,513 B of room.** The brief's rule would
make the bound this estimate ×2 = 3,602 B; the packet keeps the chair's already-named 3,314 B rather than
raising a bound the chair set before the price was spent. EM-P3's precedent (estimate +206 B → real
+80 B, 0.39×) says the real figure is likely near +700 B.

⭐ **THE FLAG SPREAD PRESERVES THE RECORD'S KEY ORDER** — `...foodSecurityFlagsOf(...)` sits exactly where
the four inline keys sat, before `hasFamine`/`hasSiege`, and the function returns them in the producer's
own order:
```
$ grep -n "Stress flags" -A 4 bytes2/foodGenerator.after.js
456:    // Stress flags
457-    ...foodSecurityFlagsOf(stressFamine, deficitPct, surplusPct),
458-    hasFamine:        stressFamine,
459-    hasSiege:         stressSiege,
```

## E-3 — ⭐ `prosperityMod`: MEASURED, and the recommendation is DO NOT MOVE IT

```
$ sed -n '366,398p' src/generators/foodGenerator.js
  const _terrainStructural = (terrain === 'mountain' || terrain === 'desert' || terrain === 'hills')
    && hasTradeRouteConnection(effectiveRoute);
  if (stressFamine) {                 prosperityMod = { type: 'cap', value: 0, … };
  } else if (deficitPct > 40) {
    if (_terrainStructural)      {    prosperityMod = { type: 'penalty', value: -1, … };
    } else if (_magicFoodMitigated) { prosperityMod = { type: 'cap', value: 2, … };
    } else {                          prosperityMod = { type: 'cap', value: 1, … }; }
  } else if (deficitPct > 20) {
    if (_terrainStructural)      {    prosperityMod = null;
    } else if (_magicFoodMitigated) { prosperityMod = { type: 'penalty', value: -1, … };
    } else {                          prosperityMod = { type: 'cap', value: 1, … }; }
  } else if (deficitPct > 8) {        prosperityMod = { type: 'penalty', value: -1, … };
  } else if (surplusPct > 40 && activeChainsCount >= 3 && (hasGranary || hasCityGranary || hasStateGranary)) {
                                      prosperityMod = { type: 'bonus', value: 0.4, … }; }
```
**CONFIRMED: the same three INPUTS, a different QUANTITY, and FOUR more conditions.** Its outer chain does
cut `deficitPct` (40 / 20 / 8) and `surplusPct` (40) with the famine arm first — the same inputs the label
ladder reads — but it is **not a band ladder**: each rung's OUTCOME is chosen by `_terrainStructural`
(terrain + trade-route connection), `_magicFoodMitigated`, `activeChainsCount >= 3` and three granary
flags. The same `deficitPct` yields `penalty −1`, `cap 2`, `cap 1` or `null` depending on facts no ladder
sees, and what it returns is a prosperity modifier, not a band.
→ **RECOMMENDATION: do NOT move it.** A band-ladder leaf that held its three numbers would name no band,
would leave the chooser behind, and would put a third meaning on `40`. Its cut `8` and its cut `20` are
its own. Named in §12's noticed list; the owner's food-ladder decision point (ODQ §934.57's family) is
where all three chains meet.

## E-4 — ⭐ THE LIGHTING WALKER'S OWN VERDICT, EXECUTED (brief step 14b)

`probe2/lighting.probe.mjs` is `tests/lint/sovereigntyLightingContract.walker.test.js` copied VERBATIM
with three mechanical substitutions and nothing else: the `from 'vitest'` import replaced by local no-op
`describe`/`test`/`expect` bindings (so the module evaluates without a runner), every relative and bare
specifier rewritten to an absolute path, and `ROOT` pinned to the read tree. `parkReasonsFor` and
`classify` are then exported and called. ⚠ Method note: the bare `espree` specifier resolves through the
read tree's symlinked `node_modules`, i.e. `$SP/consist/node_modules/espree` — **read only; nothing in
`$SP/consist` was written.**

```
$ node --input-type=module -e "…import the probe, classify each file…"
TEST_FILES walked: 2650
CREDITED tests/domain/generalStateProseDesk.test.js   reasons= [] titles= 70
CREDITED tests/ui/compendiumFoodSecurity.test.jsx     reasons= [] titles= 3
CREDITED tests/ui/compendiumPower.test.jsx            reasons= [] titles= 3
CREDITED tests/domain/powerStateProseDesk.test.js     reasons= [] titles= 77
CREDITED tests/domain/defenseStateProseDesk.test.js   reasons= [] titles= 91
```
**CONFIRMED: all three cured files are CREDITED** (zero park reasons), so a title added to any of them
WOULD count — and this packet adds none, which is now a measured `titles +0`, not an assumption.

And the NEW test file's shape, classified by the same instrument before it is written:
```
$ node --input-type=module -e "…classify(the bandLadders.test.js skeleton)…"
reasons: [] => CREDITED
it titles  (census `titles`)     : 8
describe titles (`suiteTitles`)  : 1
titles: [ 'every band entry names its own cut, …', 'legitimacy: the exported ladder equals …',
          'readiness: the exported ladder equals …', 'food: the label ladder cuts OPEN below …',
          'food: the FLAG ladder is a second ladder …', 'every band function is total: NaN, …',
          'the producers spell no cut of their own …', 'no file under src/generators imports …' ]
```
**CONFIRMED: `files +1 · credited +1 · parked +0 · titles +8 · suiteTitles +1` is MEASURED, not
predicted.** The skeleton binds `it`, `test` and `describe` exactly once each (the vitest import), uses
eight straight-line literal `it`s under ONE literal `describe`, and names no variable or parameter `it`,
`test` or `describe` — the EM-B1e park cause the chair named. ⛔ No absolute census tuple is quoted
anywhere in this packet; `TEST_FILES walked: 2650` is printed here only as proof the instrument ran.

## E-5 — Q/brief step 15: THE WIRING CENSUS DOES NOT STAMP ANY OF THE THREE PRODUCERS

```
$ node -e "…read docs/content/wiring-census.json…"
stamp keys: files, candidateLeaves, producerIndexFiles
stamp.files count: 7
   src/generators/factionDynamics.js    not stamped
   src/generators/defenseGenerator.js   not stamped
   src/generators/foodGenerator.js      not stamped
  sample: src/domain/display/stateProse/generalStateProse.js | …powerStateProse.js | …economyStateProse.js
          | …defenseStateProse.js | …stressorsStateProse.js | …warFaithStateProse.js | …dossierMounts.js
candidateLeaves count 6      producerIndexFiles count 0
whole-census mentions factionDynamics: false   defenseGenerator: true   foodGenerator: false
```
**CONFIRMED: all seven `stamp.files` entries are `src/domain/display/stateProse/**`; none of the three
producers is stamped, and neither `candidateLeaves` nor `producerIndexFiles` names one.** So
`docs/content/wiring-census.json` is **NOT** a change-manifest row and no re-take is owed — EM-P3's
`stale-bytes` red cannot repeat here. ⚠ The single whole-file mention of `defenseGenerator` is in a
non-stamp field and carries no byte sha, so it does not make the file stamped; a lane that later moves a
`stateProse` leaf DOES owe the re-take.

## E-6 — brief's newest step: the validator's `acceptanceCases` SHAPE

```
$ sed -n '855,865p' scripts/implementation-packets.mjs
      const at = `${idLabel}.acceptanceCases[${index}]`;
      if (!isRecord(row)) { addError(errors, `${at} must be an object`); continue; }
      if (typeof row.id !== 'string' || row.id.length === 0) addError(…`${at}.id must be a non-empty string`);
      else if (caseIds.has(row.id)) addError(…duplicate acceptance id…);
      if (typeof row.case !== 'string' || row.case.trim().length === 0) addError(…`${at}.case must be a non-empty string`);
$ sed -n '672p' scripts/implementation-packets.mjs
    if (cases.length > 8) addError(errors, `${idLabel} has ${cases.length} acceptance cases; maximum is 8`);
```
**CONFIRMED: `acceptanceCases` must be `{ id: string, case: string }` OBJECTS with unique ids, at most 8.**
This packet's manifest already carries eight such objects — it is NOT one of the two siblings that failed
on bare strings. Re-verified after the v2 rewrite at E-8.

## E-7 — ⭐ Q5: WHICH LANDINGS BETWEEN NOW AND PROMOTION COULD TOUCH THE CEILING FILE

```
$ node -e "…scan PACKET_MANIFEST.json (190 entries)…"
manifest entries: 190      non-LANDED entries: EM-B3c:READY
  src/data/bandLadders.js · the three producers · tests/domain/bandLadders.test.js ·
  tests/domain/generalStateProseDesk.test.js · tests/ui/compendiumFoodSecurity.test.jsx ·
  tests/ui/compendiumPower.test.jsx                                                        free
  tests/build/generationWorkerLazy.test.js                        EM-P3:LANDED (released)
$ node -e "…EM-B3c's change rows…"
  CREATE tests/security/galleryScannerMirrorTotality.test.js · CREATE supabase/migrations/203_….sql ·
  MODIFY scripts/ops/migrationRehearsalCore.mjs · TEST tests/ops/migrationRehearsal.test.js ·
  REGISTER scripts/mutation-coverage-manifest.json · DOC docs/DEPLOY.md · DOC ARCHITECTURE.md ·
  DOC docs/CURRENT_STATE.md
$ for f in chair-kit/packets-waiting/*.manifest.json; do …name any of my change paths?… done
  ⚠ EM-R0d DRAFT -> (its own rows)
  (no other waiting packet reserves any of my paths)
```
**CONFIRMED: the answer to Q5 is "nothing queued."** The ONE non-LANDED manifest entry is **EM-B3c
(READY)**, whose eight rows are a security test, a migration, an ops script, a test, a register row and
three docs — none in the generation worker's closure and none of my paths. **No waiting packet in the kit
carries a `tests/build/generationWorkerLazy.test.js` row except EM-R0d itself.** So the only thing that
could move the ceiling file before promotion is **another packet's own ceiling re-mint**, and none is
queued; the chair's named exclusions (EM-P2 version 4, the tooling work) are consistent with the
measurement. If one appears, this packet's substrate check refuses rather than landing on a moved ceiling.

## E-8 — version 2's §7 table and JSON manifest, SET-EQUAL; the validator's shape arms satisfied

```
$ node -e "…parse §7's table out of EM-R0d.md, compare with EM-R0d.manifest.json…"
§7 rows (9):
   CREATE src/data/bandLadders.js
   MODIFY src/generators/defenseGenerator.js
   MODIFY src/generators/factionDynamics.js
   MODIFY src/generators/foodGenerator.js
   TEST tests/build/generationWorkerLazy.test.js
   TEST tests/domain/bandLadders.test.js
   TEST tests/domain/generalStateProseDesk.test.js
   TEST tests/ui/compendiumFoodSecurity.test.jsx
   TEST tests/ui/compendiumPower.test.jsx
ONLY §7: (none)   ONLY JSON: (none)      SET-EQUAL: true
actions in PACKET_ACTIONS: true
acceptanceCases: n=8 objects=true uniqueIds=true
requiredSymbols: 9   retiredSymbols: 0
non-vitest (generator) checks: (none — brief step 14a has nothing to order)
last checks row (the goldens): tests/property/generatorGoldenMaster.test.js tests/property/dossierProseManifest.test.js
```
CONFIRMED: nine change rows both sides, eight `{id, case}` OBJECTS with unique ids (E-6's validator arms),
nine `requiredSymbols`, an EMPTY `retiredSymbols`, **no generator among `checks`** — so step 14(a)'s
ordering rule has nothing to order — and the goldens deliberately placed LAST so a moved golden is the
last word rather than a mid-chain one.

## E-9 — the read tree at the END of version 2

```
$ git -C "$SP/read-tip-e5bdfd031" rev-parse --short HEAD
e5bdfd031
$ git -C "$SP/read-tip-e5bdfd031" status --short
            <empty>
```
Nothing edited, staged or committed anywhere. No vitest, no eslint, no npm script, no build. Every probe
was plain `node` on a scratch script, one process at a time, through absolute paths.
