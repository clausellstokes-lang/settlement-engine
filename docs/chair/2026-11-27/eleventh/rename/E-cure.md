# (E) THE CURE'S SIZE

**The question.** For each site of (A) whose key holds a name: which key would survive every road of (B)? And how many of the 900 + 900 pages would move ONCE if that site were re-keyed?

**How it was measured.**
- Every count is a script's (CONFIRMED).
- The corpora are all 900 births of C and all 900 of V: 150 each of thorp, hamlet, village, town, city and metropolis.
- The re-key was done in a SCRATCH tree outside the working tree: `git archive cccda7569` into `/tmp/rename/rekey`. It was never committed and never pushed.
- In the scratch tree, each name site reads `globalThis.__TOWN_ID || <name>`, and the harness sets `__TOWN_ID` to the born record's `id`. The people headline reads `top.id || top.name`. The edits:
  - `dailyLife.js:427` and `:683`: A1-A10;
  - `crisisSummaryVantage.js:501`: A18;
  - `governanceAccount.js:384` and `:412`: A19/A20;
  - `hookLines.js:290`: A16;
  - `headlines.js:169`: A26, and the people headline: A28.
- Each birth's owner page was walked twice, once on the current tree and once on the scratch tree: every tab as OutputContainer renders it, plus the PDF composers and headlines, Foundry, Tonight and Session.
- The scripts: `tools/e-harness.jsx`, `tools/run-e.sh`, `tools/analyze-e.mjs` and `tools/analyze-e-groups.mjs`. The results are in `results/E-C.res.json` and `results/E-V.res.json`.

**What a "move" is.** A page counts as moved if any view's lines differ between the two walks. A site counts as moved on a page if the sequence of lines it chose differs (pick log, call site resolved through the bundle's module map).

## The key that survives every road

From (B), by execution on 10 towns:
- The town's `id` survives all six roads: save/reload, JSON import, share, gallery import, the PDF composer input, and Foundry (as the id tail).
- A person's `id` survives every road too.
- `_seed` is dropped by the JSON import, the share and the gallery import.
- Houses and powers carry no id at all.

So the cure key is the town `id` for the town-name sites, the person `id` for the person-name site, and nothing yet for the power-name sites.

## Pages moved once, by site

| site | key now -> cure key | C: pages moved (of pages that call it) | V |
|---|---|---|---|
| A1-A7, A9, A10 Daily Life slots | town name -> town id | **900 (900)** | **900 (900)** |
| A8 Daily Life, which outsider option is second | town name -> town id | 272 (900) | 397 (900) |
| A18 crisis summary vantage (`fnv % 4`) | town name -> town id | 293 (293) | 287 (287) |
| A26 overview headline (PDF / Foundry) | town name -> town id | 223 (293) | 215 (287) |
| A28 people headline (PDF / Foundry) | person name -> person id | 391 (758) | 377 (765) |
| A19 / A20 fortune lines (Power tab) | town name -> town id | 66 (93) | 56 (90) |
| A16 food-gap hook | town name -> town id | not reached: no pick with its key on 1,800 births | not reached |
| **all of the above at once** | | **900 of 900 pages; 28,031 lines** | **900 of 900; 28,670 lines** |

**By surface** (C / V):
- the owner's tabs 900 / 900;
- PDF 900 / 900;
- Foundry 539 / 532;
- Tonight 225 / 212.

**By view group** (C / V):
- Daily Life 900 / 900;
- the headlines (PDF / Foundry) 539 / 532;
- the crisis vantage (Defense, Tonight) 225 / 212;
- fortune (Power) 66 / 56.

**Every size moves:** 150 of 150 in each of the six.

**The cure is one re-deal per town, then never again.** After it, a rename of the town or the person moves none of these picks. (D) measured what a rename re-deals today: 300 / 300 pages per corpus. The cure costs that same one-time shake, once, and buys every later rename.

**A partial cure.** Leave Daily Life on the name and re-key the rest. The one-time move then falls to 577 of 900 (C) and 560 of 900 (V) pages. On the owner's tabs it falls to 290 and 267, the other moves being the PDF and Foundry headlines. But Daily Life is the site that re-deals EVERY page on a rename (D: 300 / 300), so a cure without it cures little.

## Sites that could keep the name at no visible cost

- **A11 viability and A21 arrangement** (`_seed ?? id ?? name`), **A17 cast want, A31 keeper honorific and A30's person part** (`id || name`). The name is a fallback behind an id that every born record carries and that every road keeps. The name is never reached, so leave them (PLAUSIBLE: by reading and by (B)'s id survival; not re-keyed here).
- **A32 / A33 tension cause.** No importer in src; nothing prints them. They are free to leave (or to re-key) when they are wired.
- **A16 food-gap hook.** Never reached on 1,800 births, so it costs nothing to leave on the name. If it is wired wider, it should take the id like its neighbours.
- **A15 conflict hook and A30's institution or power part.** These hold a POWER's name, and powers have no id to key on. Today a power rename re-deals them on 0 / 1 (A15) and 6 / 7 (A30) pages of 300 (D). The cure would first need an id for powers. At that measured cost I would leave them on the name.

## What the cure does NOT reach

- **The `_seed` sites.** A11-A14, A21-A25 and A29 re-deal on JSON import and gallery import, because those roads drop `_seed` (B: 10 / 10 imported copies re-dealt). Re-keying them to `id` would cure that road. It would also move, once, every page whose `_seed` differs from its `id`, which is plausibly every page (PLAUSIBLE: not run; the state-prose hash of A13 / A14 is not in the pick log).
- **The name read as a KIND.** The house and power renames moved lines on 298 / 279 and 179 / 175 of 300 pages (D), with no hash involved. No re-key touches this.
- **The stored sentences of (F).** A key change cannot rewrite them.
