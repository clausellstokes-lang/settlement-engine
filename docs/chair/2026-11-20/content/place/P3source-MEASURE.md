# P3source MEASURE: the page census's rise from 0 banked to 3

A measurer for PLACE-2 wrote this on 2026-11-20, working from `BRIEF-MEASURE-P3source.md` at 34789ea27. It is a measurement only: nothing under `src/`, `tests/` or `scripts/` changed. The branch `place-2/p3source-measure` was cut from 34789ea27, which is 25f29b33a plus the brief and nothing else (`git diff --stat 25f29b33a 34789ea27`: the brief only).

## Verdict

- **P3source is red on the line's own tip as well.** It reads 3 at `origin/lane/join-2026-11-14` (8196e5712) and 3 at 25f29b33a. The same three seeds are flagged on the same line in both.
- **The lane does not own it.** The rise came in with **675f83875** `fix(bar8 marks-2, item 6): the Magic tab names no supplier the page marks stopped`. That commit is on lane **`lane/bar8-marks-2-2026-11-17`** and reached the line in landing merge **f9f12bef4** `landing(point 56): MARKS-2 at 85b25a99b`.
- **The rise is a collision between two rulings, not a fault in the born record.** MARKS-2 item 6 deliberately drops a supplier that the page marks stopped. P3source counts a reliance printed with no source as a fault wherever the Defense tab says there is no practitioner.

## 1. What P3source reads (CONFIRMED)

**The register row.** In `scripts/census/page-census.register.json` the row reads: label "3 reliance on magic stated with neither a practitioner nor a named source", reader CROSS, base 74, banked 0. Banked has been 0 at every commit that touched the register, up to the last one, b5195bf02 (BIRTH-2, 2026-11-17).

**The code that counts it.** The check lives in `src/domain/coherence/pageCensusFindings.js :: pageCensusFindings`, in `run('P3source', …)`. The page-law helpers carry no counter of their own. Quoted whole, with the one input it reads:

```js
const noArcane = D.some((l) => /No arcane practitioners on the rolls/.test(l));   // D = the rendered Systems/Defense lines
...
run('P3source', () => {
  // the Magic tab states a reliance; the Defense tab's rolls hold no practitioner; the reliance line names no source
  const relLine = M.find((l) => /^Reliance on magic: (?:Relied upon|Integral)/.test(l));   // M = the rendered Systems/Magic lines
  if (!relLine) return null;
  const at = relLine.indexOf(' · supplied by ');
  if (at < 0) return noArcane ? [relLine, 'No arcane practitioners on the rolls'] : null;
  // REVIEW-W2A F2: the source is named through the display seam, once, with no catalogue range or condition
  const source = relLine.slice(at + 15);
  if (/\(/.test(source)) return [relLine, 'a catalogue range or condition in the source'];
  const names = source.replace(/ and /g, ', ').split(', ').map((n) => n.trim().toLowerCase()).filter(Boolean);
  return new Set(names).size !== names.length ? [relLine, 'a house named twice in the source'] : null;
});
```

All three places trip the first arm: the reliance line has no ` · supplied by ` clause, and the Defense tab prints the no-practitioner line. The finding JSON is identical at 8196e5712 and at 25f29b33a:

| place | printed text it flags (quote) | what it found missing (detail) |
|---|---|---|
| `r2s-under_siege-hamlet-2` | `Reliance on magic: Relied upon · for food (magical provision)` | `No arcane practitioners on the rolls`: no practitioner and no ` · supplied by ` source |
| `r2s-under_siege-thorp-1` | `Reliance on magic: Relied upon · for food (magical provision)` | the same |
| `r2s-under_siege-thorp-2` | `Reliance on magic: Relied upon · for food (magical provision)` | the same |

**Why the source is gone.** The reliance line is printed by `src/components/new/tabs/MagicTab.jsx` (lines 170-175). It adds ` · supplied by {supply.supply}` only when `deriveMagicSupplyView` (`src/domain/display/dossierViewModel.js:757`) returns a supply. In all three places the record names exactly one supplier, and the page marks it stopped. I read this through the same pipeline the census births with (birth, then `withPublicProse`, then `magicSourceOf`, `rowMarkText` and `deriveMagicSupplyView`):

| at | `magicSourceOf` | that house's mark | `deriveMagicSupplyView` |
|---|---|---|---|
| 8196e5712 (line tip) | houses `["Access to parish church"]`, people `[]` | `Stopped by the siege.` | `{ supply: null, statable: true }`: the line prints with no source |
| 2bc516ffe (the parent of 675f83875) | the same | the same | `{ supply: "Access to a house of worship", statable: true }`: the line printed ` · supplied by Access to a house of worship`, and P3source passed |

The three places are identical in both rows of this table.

## 2. Is it red on the line's own tip? (CONFIRMED)

Both commits got a full `node scripts/census/page-census.mjs` run: the 720 banked corpus with 4 workers, under `gate-mutex --run`, with every `GIT_*` variable unset.

| commit | P3source now / banked | seeds | exit |
|---|---|---|---|
| 8196e5712 `origin/lane/join-2026-11-14` | **3** / 0, ROSE | hamlet-2, thorp-1, thorp-2 | 1 (`ROSE on P3source`; the only row that rose) |
| 25f29b33a `lane/place-1-2026-11-20` | **3** / 0, ROSE | hamlet-2, thorp-1, thorp-2 | 1 (`ROSE on P3source`) |

The two counts match, so the brief's conditional run at a331a4a19 was not needed.

One note on the 25f29b33a receipt: through my own error, two census runs of that worktree were queued into one output directory, one after the other under the mutex. I killed the second mid-run. The table above comes from the first run, which had finished: the census refuses to print its table unless all 720 rows are present (`done.length !== plan.length`, exit 2), and both runs rendered the same code.

## 3. Whose is it? (CONFIRMED)

**The test.** The census's own renderer (`scripts/census/page-census.render.census.jsx`, the same birth, walk and `pageCensusFindings`) runs over the three seeds only, and counts P3source. A full 720 run takes about 17 minutes, and at the line tip the full 720 flags exactly these three, so the bisect uses the three. Package manifests are identical to the main checkout at every probe point.

**Endpoints.** b5195bf02 (the last commit that wrote the register, banked 0) reads **0**. 8196e5712 reads **3**.

**Bisect along the line** (`git bisect start --first-parent 8196e5712 b5195bf02`). It probed f71a1b04b at 0, cc11c9504 at 3, e71d7aac1 at 3, 57ba4da23 at 3, e713baeb3 at 3, f9f12bef4 at 3 and 5c09b5511 at 0. First bad: **f9f12bef4** (2026-11-18 09:22 UTC), `landing(point 56): MARKS-2 at 85b25a99b (BAR8; rulings BR16, BR31): the siege's marks on the houses whose bought material is cut, …`, merging 85b25a99b onto 5c09b5511.

**Bisect inside the lane** (`git bisect start 85b25a99b 5c09b5511`, 15 commits). It probed dfe557dc9 at 0, 08ce1f990 at 3, 2bc516ffe at 0, f7e904954 at 3 and 675f83875 at 3. First bad: **675f83875** (2026-11-18 00:46 UTC), `fix(bar8 marks-2, item 6): the Magic tab names no supplier the page marks stopped`. That commit touches one file, `src/domain/display/dossierViewModel.js`, with 21 lines added and 1 removed.

**The owning lane** is MARKS-2 (BAR8), branch **`lane/bar8-marks-2-2026-11-17`**. The landing merge's message gives "MARKS-2 at 85b25a99b", and the docs on the line name the branch. 675f83875 is on `origin/lane/join-2026-11-14` and on `origin/lane/place-1-2026-11-20`, and PLACE-1 inherited it through the line.

**What it changed.** It added `const houses = supplying.filter((name) => !stoppedOnPage(settlement, name)); if (supplying.length && !houses.length && !people.length) return { supply: null, statable: true };` with the comment "Where every house is so marked the reliance (the food ledger's) still prints, with no supplier named: the record holds one, the crisis has stopped it." In a besieged thorp or hamlet whose only magic supplier is its parish-church access, the line now prints a reliance with no source. The Defense tab's "No arcane practitioners on the rolls" sits beside it, and that is exactly the pattern P3source counts.

**PLAUSIBLE, not measured: why nobody saw it at landing.** The register's banked 0 predates the landing (b5195bf02, 2026-11-17 08:16, against the landing at 2026-11-18 09:22), and no commit has written the register since. That fits the 720 census not having been run at point 56's landing. I did not search the ledger for a run.

**The question this leaves (the chair's, not the measurer's).** Two rulings disagree. MARKS-2 item 6 (K's 12f) says a stopped supplier is not named and the reliance still prints. P3source says a printed reliance with neither a practitioner nor a named source is a fault. Settling it takes one of three things: the page says the supplier is stopped (for example, the reliance line names the stopped house as stopped); P3source learns that a stopped supplier is a stated source; or the chair rules one of the two down.

## Receipts (scratch, not committed)

The census logs and row JSONs, the bisect probe log and the two `git bisect log` files are under `/tmp/claude-0/-home-user-settlement-engine/745da387-958a-5e54-845d-1dc386327a68/scratchpad/` (`run-line*`, `run-p1*`, `bisect.log`, `bisect1.gitlog`, `bisect2.gitlog`, `sup-line.json`, `sup-2bc.json`).
