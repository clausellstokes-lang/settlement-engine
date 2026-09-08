# REFUTATION SWEEP — PROBE_ALL family: the six extractors (§1) and the register roster (§2)

**Adversarial refuter · every verdict below cites a command I executed and the number it printed.**
Nothing was re-read from PROBE_ALL and repeated; every figure was re-derived.

## 0. Setup, and the one confound I had to remove first

PROBE_ALL was read at dock sha `6b80d1e8e`. The tree I was given, `scratchpad/laneOSR18`, is at
**`fd36f0298b1ead15f2a80eff83dafb92114a7ea4`** — 18 src files ahead, including one **added** src
module (`src/domain/display/warRemembrance.js`) and a modified `HeraldRemembrance.jsx`:

```sh
cd .../scratchpad/laneOSR18 && git rev-parse HEAD          # fd36f0298b1ead15f2a80eff83dafb92114a7ea4
git diff --diff-filter=A --name-only 6b80d1e8e HEAD        # src/domain/display/warRemembrance.js + 8 test files
```

Running only at HEAD would have produced a false REFUTED on every aggregate. So I farmed the read
sha into my own scratch (never writing into the dock) and ran the whole pipeline **twice**:

```sh
cd .../laneOSR18 && git archive 6b80d1e8e | tar -x -C $W/tree-6b80d1e8e
ln -sfn .../laneOSR18/node_modules $W/tree-6b80d1e8e/node_modules
```

Dock integrity after both runs: `git status --porcelain | wc -l` → **0**, `git rev-parse HEAD`
unchanged. The probe tools were **copied** to `$W` and `$W/old`; the shared
`prose-research/probe-all/` directory was not written to (it holds only `.mjs`; the original run's
`.json` artefacts are gone, so nothing could be diffed against them — everything below is a
re-execution).

### The tree-movement delta, measured rather than assumed

| figure | at 6b80d1e8e (published sha) | at HEAD fd36f0298 | delta |
|---|---:|---:|---:|
| X2 modules in scope | 1621 | 1622 | +1 (`warRemembrance.js`) |
| X2 string leaves | 45,260 | 45,371 | +111 |
| X3 files parsed / literals | 1660 / 19,329 | 1661 / 19,342 | +1 / +13 |
| X4 jsx segments | 12,809 | 12,819 | +10 |
| admitted corpus | **34,508** | 34,527 | +19 (R15 +11, R16 +3, R18 +5) |
| mechanical prose strings | 53,662 | 53,688 | +26 |
| annex rows / prose / wired | 9,327 / 9,115 / 4,289 | identical | 0 (docs/content untouched) |

Every HEAD delta lands **only** in the three heterogeneous catch-all registers. The published
figures are sha-bound and the report says so; they are not stale.

---

## 1. THE SIX EXTRACTORS — CONFIRMED, exactly, at the read sha

```sh
cd $W/old
node x1-json-leaves.mjs $W/tree-6b80d1e8e json-leaves.json
node x2-walk.mjs        $W/tree-6b80d1e8e walk.json
node x5-inline.mjs      $W/tree-6b80d1e8e inline.json
node x7-jsx.mjs         $W/tree-6b80d1e8e jsx.json
node x6-annex.mjs       $W/tree-6b80d1e8e annex.json walk.json inline.json jsx.json
```

Printed:

```
# json leaves: 2734 {"R1":2266,"R2":468}
# pools: 786  angles: {"visitor":481,"ledger":763,"street":690,"counterforce":254,
#                      "threshold":96,"unfolding":303,"elder":140,"canonical":7}
# modules in scope: 1621  import failures: 145  string leaves >=12ch: 45260
# shapes: {"object-string":15884,"fn-array":8021,"fn-template":1701,
#          "array-string":16943,"fn-plain":181,"slot-string":2530}
# files parsed: 1660  parse failures: 0  in-function literals >=12ch: 19329
# jsx files: 527  parse failures: 0  files with prose: 525  segments >=12ch: 12809
```

X1 (2,734 / 786 / all eight angle counts), X2 (45,260 / 1,621 / 145 and **all six shape tags**),
X3 (19,329 / 1,660 / 0 failures), X4 (12,809 / 525 of 527 / 0 failures) reproduce **exactly**.

X5's per-annex table reproduces exactly on 12 of 13 rows and on all four totals
(9,327 rows · 106 law · 106 short · 9,115 prose · 4,289 wired · 47.1%). The one cell that does not:

| annex | published wired | measured wired |
|---|---:|---:|
| RECEIPT_POOLS_DOSSIER_STATE.md | 2024 (99.3%) | **2030 (99.6%)** |

The published rows sum to **4,283**, not to the **4,289** the same table's TOTAL row states; my
measured rows sum to 4,289. So the row is a transcription slip and the TOTAL is the correct figure.
Identical at both shas (docs/content is byte-identical between them), so the tree cannot explain it.

---

## 2. THE REGISTER ROSTER — CONFIRMED on every n, one file-count cell REFUTED

```sh
node registers.mjs . corpus.json
# TOTAL admitted: 34508  rejected: 41369
```

All twenty column counts reproduce exactly: R1 2262 · R2 467 · R3 1212 · R4 133 · R4b 50 · R5 373 ·
R6 1659 · R7 2169 · R8 1738 · R9 619 · R10 505 · R11 216 · R12 108 · R14 561 · R15 3883 · R16 2685 ·
R17 1293 · R18 5673 · A-U 4626 · A-W 4276. Nineteen registers = 34,508 − 4,276 = **30,232** ✓.

**REFUTED — §2's `files` cell for R16.** Roster publishes **361**; measured **354**. §3's own table
in the same document also prints 354, so the document contradicts itself and the roster is wrong.
Every other file count matches (R15 233, R18 546, R3 12, R8 17, …).

**The roster's `homes` column overstates two registers** (not a numeric refutation, but a real
attribution defect):

- R3 names `warReceiptPools.js` and `sovereigntyReceiptPools.js`; **zero** corpus rows carry either
  filename. `warReceiptPools.js` yields 477 walk leaves of which 470 pass `admit()` — and all 470
  normalised keys are already in R3, credited to **`eventProse.js`**, which re-exports the pools.
  Dedup (`register + norm(text)`, first-wins) hands the credit to whichever barrel the walk reached
  first. No prose is lost; the file attribution is barrel-order-dependent.
- R9 names six `src/copy/*.js` files; only **four** carry admitted rows (`en`, `landing`,
  `pricingPage`, `deityAuthoring`). §1's X6 text says "4 files" and is right; §2's homes list is not.

---

## 3. §0's SIX-TRAPS TABLE — three receipts confirmed, three refuted

| trap | published receipt | measured | verdict |
|---|---|---|---|
| 1 sentence filter scores phrases zero | R17 = 1,293 phrases, terminal-stop 0.000 | 1,293 / 0 | CONFIRMED |
| 2 unpunctuated registers | R8 0.469 · R15 0.585 · R16 0.604 · R10 0.634 | 0.469 · **0.588** · **0.615** · 0.634 | **PARTLY** |
| 3 function variants | "**9,700** rows arrived through a function (fn-array 8,021 + fn-template 1,701)" | 8,021 + 1,701 = **9,722** raw; **2,511** admitted rows carry an `fn-*` shape | **REFUTED** |
| 4 `*News.js` is a router glob | "only `sovereigntyNews.js` is in R3"; R3 = 12 files | R3 = 12 files ✓, but **`generosityNews.js` is in R3 too** | **PARTLY** |
| 5 build artifacts double-count | excluded by path | 0 rows from `compendium/generated`, `copy/index.js`, `copy/pseudo.js`, `sampleDossier`, `supabase/`, `*.test.js` | CONFIRMED |
| 6 certification rows | excluded entirely | 0 rows matching `certification` | CONFIRMED |

Trap 2's own numbers are contradicted by §3's table in the same document (which prints 0.588 and
0.615) — the trap row is stale, §3 is right.

Trap 3's two components are exact; only their stated sum is wrong. Neither reading of "rows"
(45,260-leaf raw = 9,722; admitted corpus = 2,511) gives 9,700.

Trap 4's count is right and its qualitative claim is not: two `*News.js` files sit in R3, and §2's
own roster names both.

Commands:
```sh
node -e 'const R=require("./report.json");for(const id of["R17","R8","R15","R16","R10"])
         console.log(id,R.metrics[id].terminalStopShare,R.metrics[id].variants)'
node -e 'const C=require("./corpus.json");const by={};for(const r of C)by[r.shape]=(by[r.shape]||0)+1;console.log(by)'
```

---

## 4. §3's TABLE and §8's CROSS-CHECK — byte-identical / exact

```sh
sed -n '214,264p' PROBE_ALL.md > published.table.md
node run.mjs . report
diff <(normalise published.table.md) <(normalise report.table.md)   # only the trailing blank line
```

**The regenerated §3 table is byte-identical to the published one** — 50 metric rows × 21 columns,
roughly 1,050 cells, zero differences.

```sh
node crosscheck.mjs
```

reproduces every §8 row: 1-seg **2030**, 2-seg **688**, 3+ **11**; R1 wps mean 16.8 sd **7.2**
p10 **7** p50 17 p90 **26** under8 **0.130**; semicolons 385 (state) / 168 (causal); causal >30w
**0.491**; R1 pools **708**, uniform 0.576 (= 408/708), repeated-2-word-opener 0.112 (= 79/708);
`already` **26**; `kind of / sort of` **29**; `nobody/no one/nothing` **512**; `quiet` **59**.

One trap in the script itself, which I checked rather than believed: `crosscheck.mjs` prints
`rather than: 294`, while §8 publishes **288**. Both are right — 294 is the **occurrence** count,
288 the **variant** count, and §8's row says "variants":

```sh
node -e '…for(const r of R1∪R2){n=(r.text.match(/rather than/g)||[]).length; occ+=n; if(n)vars++}'
# rather than — occurrences: 294  variants containing it: 288
```

Also CONFIRMED: mechanical 53,662 strings / **153** em dashes / **0** exclamations; bible 67
exemplars / 42 anti-corpus; X2's failure composition **145 failures, 133 `VITE_SUPABASE_*`, 0 inside
`data/ copy/ display/ worldPulse/ generators/`**.

---

## 5. THE HUNT — reader-facing prose the extractors miss

### 5a. Two hypotheses I tried to prove and could not (negative controls)

- **In-function string literals in `.jsx`** (X3 parses only `src/**/*.js`; X4 reads JSX prose
  segments). Parsed all 527 `.jsx` with espree, took every function-scoped `Literal`/`TemplateLiteral`,
  applied the probe's own `admit()`, subtracted the corpus: **0 rows no register holds.** The estate's
  own JSX walker already covers them.
- **`src/**/*.js` leaves whose file matches no register.** R15's file regex is literally `/./`, a true
  catch-all: **0 leaves dropped, 0 files.** Nothing inside `src/**/*.js` escapes assignment.

Both strengthen the probe.

### 5b. REFUTED — "X5 covers them anyway" (§1, X2's 145 import failures)

X2 could not import 145 modules; X3 only takes literals whose **nearest enclosing scope is a
function**. A **module-level** table inside an unimportable module is therefore seen by neither.

```sh
node failed-import-miss.mjs $W/tree-6b80d1e8e
# failed-import modules scanned: 145
# ADMITTED MODULE-LEVEL strings in them that NO register holds: 71
```

| file | rows | what they are |
|---|---:|---|
| `src/lib/emailTemplates.js` | **38** | `export const TEMPLATES = Object.freeze({…})` — subject lines and bodies of the transactional email the reader receives ("Welcome to SettlementForge", "Your SettlementForge account is live. A few orientation notes:", "Hello {displayName},") |
| `src/components/new/dailyLifeLogic.js` | **18** | module-level `TERRAIN_CONTEXT` / `ROUTE_CONTEXT` / `DEFENSE_CONTEXT` — settlement-atmosphere paragraphs in the archivist register, read by `tabs/DailyLifeTab.jsx` ("The river defines everything: the mill, the ferry crossing, the flood risk, the fish.") |
| `src/lib/foundersHall.js` | 5 | |
| `src/lib/emailPreferences.js` | 3 | |
| `useMapBridge.js`, `gallery.js`, `copyGuard.js`, `campaignEntryReporting.js`, `campaignLoadSession.js` | 7 | |

The five prose dirs the §1 claim checks (`data/ copy/ display/ worldPulse/ generators/`) are indeed
clean — but the claim that X5 catches the rest does not hold for module-level tables. **71 admitted
reader-facing sentences inside `src/` belong to no register.**

### 5c. REFUTED — the title's "every reader-facing prose home in the estate"

Scoring every non-`src` shipped surface with the probe's **own** `admit()` and `norm()`:

```sh
node miss-probe.mjs $W/tree-6b80d1e8e
# TOTAL admitted rows no register holds: 364 across 18 files
# em dashes among them: 7  exclamation points: 3
```

| file | rows | house-authored? |
|---|---:|---|
| `public/third-party-notices.html` | 234 | authored preamble + licence boilerplate |
| `public/map/index.html` | 43 | **vendored** Fantasy Map Generator fork |
| `mcp-server/src/tools.js` | 17 | **yes** |
| `public/landing-maps/k*-exhibit/index.html` (6 files) | 40 | shipped engineering exhibits |
| `public/status.html` | 12 | **yes** |
| `api/_galleryMeta.js` · `_metaShell.js` · `gallery-meta.js` | 8 | **yes** |
| `mcp-server/src/server.js` · `bin/cli.js` | 4 | **yes** |
| `foundry-module/scripts/build-journals.js` · `sf-world-import.js` | 4 | **yes** |
| `index.html` | 2 | **yes** |

Conservative house-authored subtotal (excluding the vendored fork, the licence page and the
exhibits): **47 admitted rows in 10 files**, none of which any register holds.

The sharpest instances, because they carry rules the instrument reports as clean:

- `index.html:80,88` — `og:title` / `twitter:title` = *"SettlementForge — Forge a settlement worth
  running a campaign in."* An **em dash** in the single most-seen string in the product (every search
  result and link preview), invisible to a mechanical audit that reports 153 em dashes corpus-wide.
- `mcp-server/src/tools.js:185` — verbatim:
  `answer: 'The realm is at peace — no public siege is recorded in the ledger.'` An em dash in a
  rendered engine answer. This is Herald subject matter in Herald voice, returned to a DM's
  assistant, and it is in no register.
- `public/status.html` — twelve archivist-voice sentences on a page written precisely so it stays
  readable when the app is not.

§0's narrower phrasing — "every reader-facing home **the inventory named**" — survives intact. The
title's stronger claim does not.

---

## 6. Summary of verdicts

| # | finding | verdict |
|---|---|---|
| 1 | X1 2,734 leaves / 786 pools / 8 angles | CONFIRMED |
| 2 | X2 45,260 leaves / 1,621 modules / 145 failures / six shape tags | CONFIRMED |
| 3 | X3 19,329 literals / 1,660 files / 0 failures | CONFIRMED |
| 4 | X4 12,809 segments / 525 of 527 / 0 failures | CONFIRMED |
| 5 | X5 9,327 → 9,115 prose, 4,289 wired, per-annex table | PARTLY (DOSSIER_STATE wired cell 2024 → 2030) |
| 6 | roster 34,508 admitted / 41,369 rejected / 30,232 + 4,276 / every column n | CONFIRMED |
| 7 | roster R16 `files` = 361 | REFUTED (354, and §3 agrees with me) |
| 8 | §0 trap 2 terminal-stop receipts | PARTLY (R15 0.588, R16 0.615) |
| 9 | §0 trap 3 "9,700 through a function" | REFUTED (9,722 raw / 2,511 admitted) |
| 10 | §0 trap 4 "only sovereigntyNews.js in R3" | PARTLY (12 files ✓, generosityNews.js also in R3) |
| 11 | §0 traps 1, 5, 6 | CONFIRMED |
| 12 | §3 table (50 × 21) | CONFIRMED byte-identical |
| 13 | §8 cross-check, every row | CONFIRMED |
| 14 | mechanical 53,662 / 153 em / 0 excl; bible 67 / 42 | CONFIRMED |
| 15 | "X5 covers [the 145 import failures] anyway" | REFUTED (71 module-level rows, incl. all transactional email copy) |
| 16 | "every reader-facing prose home in the estate" (title) | REFUTED (364 rows / 18 files; 47 house-authored) |
| 17 | .jsx in-function literals missed | REFUTED — my own hypothesis; 0 |
| 18 | src .js leaves missed by register assignment | REFUTED — my own hypothesis; 0 (R15 is `/./`) |

Artefacts: `$W/old/*.json` (read sha) and `$W/*.json` (HEAD), plus the two probes I wrote,
`$W/old/miss-probe.mjs`, `$W/old/failed-import-miss.mjs`, `$W/old/jsx-inline-miss.mjs`, where
`$W = scratchpad/prose-research/sweep/refute-extractors-work`.
