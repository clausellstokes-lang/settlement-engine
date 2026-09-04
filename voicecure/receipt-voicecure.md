# receipt-voicecure.md — lane VOICECURE (seat Opus 5) — **SEALED**

**Dock** `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/58f0a8e2-2c4f-4073-8635-ecc7cf5010f6/scratchpad/laneKERNELMARK-tree`
**HEAD** `c2f80ffc957a15ab18e756e0aae2b56ceb78fc9c` (unchanged; **no commit taken**)
**Porcelain at start** 0 lines · **Porcelain at end** exactly 2 modified files, both mine.

**REGISTER DOORS OPENED: NONE.** No `UPDATE_VOICE_BASELINE`, no `UPDATE_*`, no `--update`
`--write` `--genesis` `--rebank`. No baseline JSON was written. No `git stash / checkout /
reset / clean`. No `node_modules` materialisation. No subagents. Every register figure is
PREDICTED below, and the prediction was executed as a simulation over the arm's own logic
before any instrument ran on it.

---

## 1. THE CHAIR'S MEASUREMENTS — each verified, none assumed

| Chair's claim | Verdict | Evidence |
|---|---|---|
| 17 JSX files drifted | **CONFIRMED** | `npx vitest run tests/copy/voiceMechanics.test.js` → `expected [ …(17) ] to deeply equal []`, exit 1 |
| `[em] 37 > 34 (+3)`, `[files] 17 > 15 (+2)` | **CONFIRMED** | the row's own magnitude regexes (`current em:(\d+)` summed, `^\S+: baseline em:` counted) applied to the real failure text: files 17, em 37, bang 0 |
| 15 are pre-existing and sum to exactly 34 | **CONFIRMED** | 37 − Glance(3) − Tab(0) = 34 over 15 files |
| EconomicsTab 3 → 0 (a fall) | **CONFIRMED** | diff line `src/components/new/tabs/EconomicsTab.jsx: baseline em:3 bang:0 → current em:0 bang:0` |
| EconomicsGlance 0 → 3 (a rise) | **CONFIRMED** | diff line `…EconomicsGlance.jsx: baseline em:0 bang:0 → current em:3 bang:0` |
| the 3 are a delimiter literal on line 101, not prose | **CONFIRMED** | `extractJsxProseStrings` on the file returns carrier strings `[" — ", " — ", " — "]` — three copies of the delimiter, nothing else |
| the extractor counts string literals in code and NOT comments | **CONFIRMED** | EconomicsGlance carried **8 raw `—` bytes** but only **3 AST-extracted**; after the cure **5 raw bytes remain and 0 are extracted**. Mechanism: `tests/helpers/jsxLiteralWalk.js` parses with espree *without* `comment:true` and pushes only `JSXText` / string `Literal` / `TemplateElement.cooked`, so a comment is never an AST node the walk can reach; a JSX `{/* … */}` is a `JSXEmptyExpression`, also not a literal |

### The chair's reading — "the debt MOVED, it did not grow"
**CONFIRMED, with a decisive control rather than an inference.** DESK CAR 1 is
`a59e66e5a71b4aa2a28a2fb329b1919a6771c008`; its parent is `3a6f0d7613159f42efcafcfd8ddbf0a08007e97e`.
Read out of git with no checkout:

```
git show 3a6f0d761:src/components/new/tabs/EconomicsTab.jsx     -> exit 0
git show 3a6f0d761:src/components/new/tabs/EconomicsGlance.jsx  -> exit 128 (did not exist)

EconomicsTab @ pre-extraction parent   AST em = 3 | carriers = [" — "," — "," — "]
EconomicsTab @ HEAD (this tip)         AST em = 0 | carriers = []
```

The same three delimiter strings that stood in the Tab stood in the Glance: a byte-for-byte
relocation, net **zero** repo-wide. And the repo-wide JSX total is unchanged across the
train — **40 before, 40 at this tip**: the banked row's own live reading at `bf902c59f` is
"JSX debt 40 against 6", and the suite at this tip printed `expected 40 to be less than or
equal to 6`. The magnitude grew **only** because the arm sums em dashes across *drifted*
files, and a relocation drifts two files that were previously undrifted (Tab, which matched
its frozen 3) or unlisted (Glance, which was silent at 0).

---

## 2. THE TRACE — who produces `granary.display`

`EconomicsGlance.jsx` ← prop `granary` ← `EconomicsTab.jsx:305 const granary = deriveGranaryOutlook(s)`
← `src/domain/display/dossierViewModel.js:324 deriveGranaryOutlook`.

`display` was composed there as a `.join('. ')` whose FIRST element carried the delimiter:

```js
`${seasonTitle} — the granary is ${band} (${level.toFixed(1)} of ${cap.toFixed(1)} months)`
```

**Consumer census of `.display` on this outlook: exactly ONE site in `src/`** —
`EconomicsGlance.jsx:101` (`grep -rn "granary\.display\|outlook\.display\|granaryOutlook\.display" src tests docs`).
The outlook object also reaches `economyStateProse(s, { …, granaryOutlook: granary })`, which
reads only `.available`, `.band`, `.season` (`economyStateProse.js:241-243, 274-287, 312`).

**The defect was already written down in the repo.** `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md:699-701`,
in the DS-ECO-2 ENTAILMENT block: the Season tile *"currently fakes two fields by splitting
`deriveGranaryOutlook`'s display string on `' — '`"*. The delimiter was a contract spelled
twice — once by the composer, once by a view that had to guess it.

---

## 3. THE CHOICE — option (a), and why the others were rejected

**TAKEN — (a) the producer exposes the PARTS.** `deriveGranaryOutlook` now returns
`seasonTitle` and `detail`, and composes `display` FROM them. The view reads two fields; no
split, no delimiter, and no `' — '` literal anywhere in the `.jsx`.

Rejected, each with the arithmetic:

- **(b) export the delimiter as a named const and import it into the view.** The literal
  leaves the `.jsx`, so `[em]` lands at 34 too — but the view still re-parses a joined
  string it should never have had to parse, and the split's *semantics* (heading = segment 0,
  sub-line = the rest re-joined) stay encoded in the consumer. It cures the ratchet and
  leaves the defect. Option (a) costs the same and removes the class.
- **(c-variant) hoist the literal to a `const` inside the `.jsx`.** ⛔ Explicitly checked, and
  the brief's arithmetic is right: three literals become one, the file **stays drifted** at
  `current em:1`, so `[files]` stays 17 and `[em]` lands at **35 — still over 34**. Verified
  as arithmetic, not run.
- **(c-variant) move the delimiter into a new `src/domain` or `src/data` literal.** ⛔ Refused
  on measurement. The Tier-2 arm at this tip stands at **exactly** its banked ceilings on all
  four measures — `files 69/69`, `em 382/382`, `bang 9/9`, `total 770/770` — **zero headroom**.
  One added em dash in a `src/data` or `src/domain` string literal breaches it instantly.
  Moving debt from Tier 3 to Tier 2 would have traded a curable red for an uncurable one.

**How option (a) stays Tier-2-neutral:** `display` is re-composed as
`` `${seasonTitle} — ${detail}` `` — it **re-uses the one em dash that was already there**
rather than adding one. `dossierViewModel.js` Tier-2 count: **6 before, 6 after**, which is
exactly its frozen baseline row, so the file is not drifted before or after and contributes
nothing to any Tier-2 magnitude. Measured, both directions.

---

## 4. BEHAVIOUR MUST NOT CHANGE — proved, not asserted

A 14-case matrix was executed against the **live module** before and after the edit
(`probe.mjs`; cases: three unavailable shapes, all four seasons, every band from
`well stocked` to `nearly empty`, drawdown / `already spent` / `beyond the year`, all three
`seasonalEvent` notes, zero capacity, and an unknown season key).

For every case, all three hold:

1. `display` is **byte-identical** before vs after;
2. `display.split(' — ')[0]` (what the tile rendered yesterday) `===` `seasonTitle` (what it renders now);
3. `display.split(' — ').slice(1).join(' — ')` `===` `detail`;
4. plus every pre-existing returned field (`available season band level capacity lastsUntil yearEvent`) unchanged.

```
BEHAVIOUR MISMATCHES: 0     (14/14 cases OK)
```

**The one deliberate divergence, and it is strictly better.** If `stockpile.season` ever held
a string containing `' — '`, the old split would have cut the heading in half; the field does
not. **Not reachable:** the season is written from the closed set
`['spring','summer','autumn','winter']` (`src/domain/worldPulse/worldState.js:57`), carried to
`foodSecurity.stockpile.season` at `foodStockpile.js:428`. **CONFIRMED** as unreachable in any
produced world; the `'monsoon'` probe case is a hand-built fixture.

---

## 5. FIGURES — before / after, every one measured

### The blocking arm — `per-file JSX debt exactly matches the baseline`

| measure | ceiling | BEFORE | AFTER | AFTER the chair banks |
|---|---|---|---|---|
| `[em]` | 34 | **37** ⛔ | **34** ✅ | **34** ✅ |
| `[bang]` | 0 | 0 ✅ | 0 ✅ | 0 ✅ |
| `[files]` | 15 | **17** ⛔ | **16** ⛔ (+1) | **15** ✅ |

### The other three arms of the same instrument — all neutral or improved

| arm | measure | ceiling | BEFORE | AFTER |
|---|---|---|---|---|
| total JSX debt | total | 40 | 40 | **37** (a 3-point SHRINK) |
| Tier-2 per-file | files / em / bang | 69 / 382 / 9 | 69 / 382 / 9 | **69 / 382 / 9** (identical) |
| Tier-2 total | total | 770 | 770 | **770** (identical) |

Suite shape unchanged: `Tests 4 failed | 15 passed (19)` before and after — the same four
banked reds, no test gained or lost.

### Line and size neutrality

| file | physical | effective (eslint `max-lines`) | layer ceiling |
|---|---|---|---|
| `EconomicsGlance.jsx` | 113 → **113** (neutral) | 50 → **50** | 600 |
| `dossierViewModel.js` | 546 → 553 | 252 → **253** (+1 statement; +6 comment lines cost 0) | 800 |
| `EconomicsTab.jsx` | untouched | 580 | 600 |

`tests/lint/.prose-numerics-baseline.json` freezes `EconomicsGlance.jsx` at **line 88** and
**line 99**. Both were re-read after the edit and are byte-identical at the same line numbers;
the edit touched only line 57 (a docblock line, in place) and line 101. `proseNumerics.test.js`
passes.

---

## 6. THE REGISTER PREDICTION — what the chair's act will do

**The documented door CANNOT be used, and this was executed rather than reasoned.**
Calling the guard's own pure functions (`totalsOf`, `growthRows` from
`tests/helpers/shrinkOnlyBaseline.js`) — **no write, `writeShrinkOnlyBaseline` never called**:

```
committed totals : {"em":6,"bang":0}
a full refreeze  : {"em":37,"bang":0}
growthRows       : ["em: 6 → 37 (+31)"]
VERDICT: writeShrinkOnlyBaseline WOULD THROW -> the documented door cannot bank this win.
```

So `UPDATE_VOICE_BASELINE=1` is unavailable: it rewrites the Tier-3 per-file baseline WHOLE
from `currentJsx`, and the guard refuses any rising total. The win must be banked by a
**hand edit**, which is the docstring's own idiom (`voiceMechanics.test.js:36` — *"a file's
count fell → lower (or delete) its baseline entry to bank the win"*).

**PREDICTED ACT (the chair's, not mine):** delete the row
`"src/components/new/tabs/EconomicsTab.jsx": { "em": 3, "bang": 0 }`
from `tests/copy/.voice-mechanics-jsx-baseline.json`.

**PREDICTED FIGURES**, executed as a simulation over the arm's own diff logic and the row's
own magnitude regexes, with nothing written:

```
CEILINGS                 em<=34  bang<=0  files<=15
AS COMMITTED NOW       em=34 bang=0 files=16  | frozen rows=3 frozen em total=6
CHAIR DELETES the row  em=34 bang=0 files=15  | frozen rows=2 frozen em total=3
CHAIR ZEROES the row   em=34 bang=0 files=15  | frozen rows=3 frozen em total=3
repo-wide currentJsx total em = 37 (total-arm magnitude ceiling 40)
```

Per file, precisely:
- **EconomicsGlance.jsx** — leaves the diff list entirely at my edit (baseline 0 = current 0);
  it never had a baseline row and must not acquire one.
- **EconomicsTab.jsx** — leaves the diff list at the chair's act. It contributed
  `current em:0`, so removing it moves `[files]` 16 → 15 and moves `[em]` **not at all**.
- The frozen Tier-3 baseline total falls **6 → 3** (SummaryTab 2 + OverviewTab 1). A shrink,
  in the honest direction.
- **ZEROING** the row instead of deleting it lands the identical three magnitudes, but leaves
  a row asserting that a clean file carries debt. **Recommend DELETE.**
- The `total JSX debt` arm is untouched by a baseline edit (it reads `currentJsx` only) and
  stays at **37 against its magnitude ceiling of 40**.
- All four Tier-2 magnitudes are untouched by everything above.

---

## 7. COMMANDS RUN — every one with its captured exit

| # | command | exit |
|---|---|---|
| 1 | `git rev-parse HEAD` / `git status --porcelain` | 0 / clean |
| 2 | `npx vitest run tests/copy/voiceMechanics.test.js` (BEFORE) | **1** (4 banked reds; `[em] 37 [files] 17`) |
| 3 | `node probe.mjs` (BEFORE capture) | 0 |
| 4 | `node probe.mjs` (AFTER capture) | 0 |
| 5 | `npx vitest run tests/copy/voiceMechanics.test.js` (AFTER) | **1** (same 4 banked reds; `[em] 34 [files] 16`) |
| 6 | `npx vitest run` dossierViewModel + economicsTabFlow + tabs.smoke + economyStateProseDesk | **0** — 4 files, **106 passed** |
| 7 | `npx vitest run` proseNumerics + sizeBaseline + economyReadModelCoverage.walker + dossierMountRegistry.walker + copyCorruption | **0** — 5 files, **69 passed** |
| 8 | `npx vitest run` proseLeak + goldenViewModel + viewModelParity + screenParitySource + sections.smoke | **0** — 5 files, **50 passed** |
| 9 | `npx vitest run` economicsTabMalformedFlows + economicsPlotHookSeam + economyFreshnessNote + magicSupplyBlue + customSupplyChainActivationPresentation + supplyChainState + saveMuseum + legacySaves.fixture + aiLayer + spellBreakCensus | **0** — 10 files, **122 passed** |
| 10 | `npx eslint src/domain/display/dossierViewModel.js src/components/new/tabs/EconomicsGlance.jsx` | **0** |
| 11 | `npm run typecheck:domain:strict` | **0** — `✓ no strict-type regressions (1121 errors, ceiling 1121)` |
| 12 | `npm run typecheck:ratchet` | **0** — `OK — no type regressions (173 error(s), ceiling 173)` |
| 13 | `node refreeze-refusal.mjs` (pure guard functions, no write) | 0 — refusal proved |
| 14 | `node predict.mjs` (simulation, no write) | 0 |
| 15 | `git show 3a6f0d761:…EconomicsTab.jsx` / `…EconomicsGlance.jsx` | 0 / **128** (absent) |

**Consumer totals: 24 test files, 347 tests, all green.** `npm run check`, `npm run build`
and the full suite were NOT run, per the lane's rules.

⚠ Both typecheck ratchets sit at **exactly** their ceilings (1121/1121, 173/173) — zero
headroom there too. My edit added zero type errors; a later car has none to spend.

---

## 8. FILES CHANGED — uncommitted, in the dock

```
 M src/components/new/tabs/EconomicsGlance.jsx     (2 lines changed, physical-line-neutral)
 M src/domain/display/dossierViewModel.js          (+13 / −6; +1 effective line)
 2 files changed, 13 insertions(+), 6 deletions(-)
```

Nothing else in the tree was touched. No baseline, no register, no doc, no test.

---

## 9. FINDING FOR THE CHAIR — a claim that decayed at my hand

`docs/content/RECEIPT_POOLS_DOSSIER_STATE.md:699-701` (DS-ECO-2 ENTAILMENT) still reads:
*"The Season tile currently fakes two fields by splitting `deriveGranaryOutlook`'s display
string on `' — '`; the point of this block is to give the section a sentence instead of a
split."* **As of this edit, the first clause is false.**

**I did not touch it, deliberately.** `docs/content/` is a corpus SOURCE: it is read by
`scripts/generate-dossier-state-prose.mjs` and by `tests/data/dossierStateProseProjection.contract.test.js`,
`tests/domain/causalDossierProse.test.js` and `tests/domain/economyStateProseDesk.test.js`,
and regenerating a dossier-prose leaf is a landing act, not a lane's (FOLD 32).

Measured before deciding: the sentence is **NOT transported** into
`src/data/dossierStateProse/economy.generated.js` (`grep -c "fakes two fields"` → **0** in the
generated leaf, **1** in the doc), so the generator carries only the block's `title` and pool
`text` entries. An edit to that paragraph therefore cannot move a shipping `src/` byte — but
it is still a corpus-source edit and belongs to whoever takes the doc's next pass.
**Deliberately deferred — documented, not a bug to re-find.**

---

## 10. RETROVALIDATION ROW

*Every claim this lane made in flight, re-tested against the tree at the end.*

| claim made in flight | re-tested how | verdict |
|---|---|---|
| "the magnitude ceiling of 34 lives in `voiceMechanics.test.js`" — my **first** reading, on seeing `EM_BUDGET_JSX = 6` | `grep -n "ceiling" tests/copy/voiceMechanics.test.js` → **no hits**; the 34/0/15 ceilings live in `scripts/.test-ratchet-baseline.json` under the row's `magnitude` block | **RETRACTED before it was reported.** The instrument's own budget is 6; the *banked-red magnitude* is 34. Two different numbers governing the same file — do not conflate them. |
| "curing EconomicsGlance alone lands `[files]` at 15" | measured: **16** | **REFUTED by measurement.** The Tab's fallen row keeps the file drifted; only the chair's bank clears it. Reported as 16, not as green. |
| "the docblock em dashes might count" | AST-extracted 3 of 8 raw before, 0 of 5 raw after | **CONFIRMED** the chair's premise; comments never reach the walk. |
| "`display` is byte-identical after the recomposition" | 14-case before/after matrix over the live module | **CONFIRMED**, 0 mismatches. |
| "moving the delimiter into `src/domain` is affordable" | Tier-2 measured at 382/382, 69/69, 9/9, 770/770 | **REFUTED.** Zero headroom; the option was struck, not deferred. |
| "the repo-wide JSX total was unchanged by the train" | `git show` at DESK CAR 1's parent: Tab had the same three `" — "`, Glance absent | **CONFIRMED** by a decisive control, not by inference from the banked row alone. |
| "no register door was opened" | `git status --porcelain` → exactly 2 modified `src/` files; no `.json` baseline in the diff | **CONFIRMED.** |

**Labels.** Everything in §1, §4, §5, §7, §8 is **CONFIRMED** — executed, with quoted output.
§6's post-bank figures are **CONFIRMED BY EXECUTED SIMULATION** of the arm's own diff logic
and the row's own magnitude regexes; the gate's real run on the banked baseline is the
chair's act and has not been taken. Nothing here is PLAUSIBLE-only.
