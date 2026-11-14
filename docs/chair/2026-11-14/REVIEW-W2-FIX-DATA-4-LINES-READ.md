# REVIEW-W2-FIX-DATA-4 — step 1: every new or reworded line of a1481aaf7..994733bcd, read where it prints

Reviewer REVIEW-W2-FIX-DATA-4 (independent). The lane read: `lane/w2-fix-data-2026-11-13` **at 994733bcd** (the tip
named; the branch's newest on origin was b75f78914 when read: the twelfth seat's commits, not read). This list covers ONLY
the lines new or reworded in **a1481aaf7..994733bcd** (the eleventh seat); the part up to a1481aaf7 is the first reader's
`REVIEW-W2-FIX-DATA-3-LINES-READ.md` (6dc6d84d5), which stands. Written COLD: no hand-back, statement, docs file of the lane
or commit message of the range was opened before this file was pushed. Only the diffs were read (`git log --format='%h %p'`
for the commit list: 8 first-parent commits, no merge).

## How the lines were found
`git diff a1481aaf7 994733bcd -- src/`: two files, `src/data/institutionDescVariants.js` (+13: one sibling set per smelter
variant in `DESC_VARIANT_SIBLINGS`) and `src/data/institutionDescColour.js` (−2: the two smelter variants' COLOUR
declarations dropped). Nothing else in `src/` moved. The rest of the range: the guard `tests/data/w2FixData11Rows.test.js`
(new), a seed swap in `tests/data/w2FixData6Rows.test.js`, registers (`scripts/census/pool-dominance.register.json` three
new pool rows; `tests/lint/presumedThings*.json` rows removed; the lighting census), the declaration ledger
`docs/census/declarations/institutionDescVariants.INSTITUTION_DESC_VARIANTS.json` (colour true → false, needs still `[]`:
a step-5 item), and docs. No other sentence, label, chip or pool variant is new.

How the draw works (read whole: `src/generators/steps/institutionDescDraw.js`): the Smelter's pool `[catalogue desc,
variant 1, variant 2]` is drawn by the unchanged fnv hash of `seed:name`; a drawn text is lifted with its sibling set's
original's declaration; a refused original takes its set's `twinOf` line (no conditions: always admitted). So the
originals now print only where `institution: mine` AND `institution: smith` hold (`src/domain/facts/institutions.js ::
hasInstitution`, live roster, `mine: /\bmines?\b|\bmining\b/`, `smith: /\bsmith(y|ies|s)?\b|\bforge\b|\bblacksmith/`),
and their twins everywhere else. The catalogue's own text (`src/data/institutionalCatalog.js:822`) is not keyed.

## Births (the app's own configuration shape)
- The census's 720 (`r2r-*` every dial random; `r2s-<crisis>-*` `selectedStresses:[crisis]`, `selectedStressesRandom:false`)
  at the tip, at a1481aaf7 and at the stage's base 4114cf5a6 (`probes/REVIEW-W2-FIX-DATA-4/smelter.mjs`): 238 Smelters
  at the tip (town 32, city 88, metropolis 118; none below town: the pool is keyed town/city/metropolis only).
- 216 fresh births `rv4-any-<town|city|metropolis>-<calm|under_siege|famine|occupied|wartime|under_siege+famine>-<0..11>`
  (Random off, the ticked list; `born.mjs`): 144 Smelters.
- Every surface (the dossier tabs, Tonight, the PDF's text, the Foundry journal; the tree's own soak harness,
  `surf.mjs`) for 25 of those towns (`read-seeds.txt`, `read-seeds2.txt`). The description prints on THREE surfaces in
  every one of the 25: the Institutions tab, the PDF, the Foundry journal (`- **Smelter**: <desc>`), identical text; never
  on the Services tab or Tonight.
- The draw did not move: a1481aaf7 → tip, every one of the 238 kept its drawn slot (S1→S1 21, S1→S1t 54, S2→S2 21,
  S2→S2t 46, CAT→CAT 96); base → tip the same plus 4 towns that had no Smelter at the base (the earlier stage's move).

## The lines

| id | line (file :: set) | declared | prints (1104 births) | read in (every surface) | verdict |
|---|---|---|---|---|---|
| S1 | "Charcoal furnaces reduce raw ore to refined metal. It stands between the mine and the smithy." (`institutionDescVariants.js :: DESC_VARIANT_SIBLINGS`, the original) | needs `institution: mine`, `institution: smith` (NEW condition; text unchanged) | 34 (town 1, city 8, metropolis 25; siege 9, famine 5, occupied 2) | r2r-town-11 (the smallest, 1,790), r2r-metropolis-15, r2s-under_siege-city-0, r2s-occupied-metropolis-0, rv4-any-city-under_siege+famine-6 | **TRUE** in every town read; by script both houses stand in **34 of 34** prints (Mine + Blacksmiths) |
| S1t | "Charcoal furnaces reduce raw ore to refined metal, cast in bars for whoever will buy them." (the twin, NEW) | none (the twin; taken where S1 is refused) | 75 (town 11, city 33, metropolis 31; siege 11, famine 8, occupied 7) | r2r-town-38 (1,393: no smith), r2r-town-9 (no mine), r2r-metropolis-4, r2s-under_siege-town-1, r2s-under_siege-metropolis-0, rv4-any-town-under_siege-11 | **TRUE** (names neither house; every oreless town imports ore: 0 of 152 twin prints with neither a deposit nor an ore import) |
| S2 | "Refines crude ore into workable metal over charcoal fire. The industrial step from what the mine yields to what the smith uses." (the original) | needs `institution: mine`, `institution: smith` (NEW condition; text unchanged) | 45 (town 2, city 12, metropolis 31; siege 6, famine 6, occupied 4) | r2r-town-45 (2,341), r2r-metropolis-3, r2s-famine-city-2, rv4-any-city-under_siege-4, rv4-any-town-wartime-4 | **TRUE** on its declaration (45 of 45 both houses stand); one LOW below |
| S2t | "Refines crude ore into workable metal over charcoal fire, and sells it on by the bar." (the twin, NEW) | none | 77 (town 17, city 38, metropolis 22; siege 12, famine 12, occupied 9) | r2r-town-1 (1,590), r2r-metropolis-1, r2s-famine-town-0, r2s-famine-metropolis-3, rv4-any-metropolis-occupied-2, rv4-any-town-under_siege-6, rv4-any-town-occupied-1 | **TRUE** |

No page of the 25 denies a mine, a smith or a forge beside the line (scripted scan for "no mine / no smith / no forge /
no one here works the ore…": 0).

## What is FALSE (none of the four new or re-conditioned lines at high or medium)

- **MED, CARRIED — the sibling that lacks its siblings' condition (EXECUTED).** The Smelter's third pool text, the
  catalogue's own, "Converts raw ore to refined metal using charcoal-fueled furnaces. The industrial intermediate between
  mine and smithy." (`src/data/institutionalCatalog.js:822`, undeclared), still prints where the town lacks the mine or the
  smith: **57 of 96** census prints and **38 of 55** fresh (95 of 151). E.g. **r2s-under_siege-city-2** (city, siege): no
  Mine on the roster (Blacksmiths only), the Institutions tab, the PDF and the Foundry journal all print "between mine and
  smithy". Base prints it in the same towns (CAT→CAT 94 of 94). The stage's two siblings now carry `needs: mine, smith`;
  this one carries nothing (a source comment in the diff marks it parked). Kind (a).
- **LOW, CARRIED (the stage's declaration admits it) — S2 "what the mine yields" where the page says the mine is spent.**
  r2r-town-45: "Iron ore (local iron mines exhausted)", "Iron Deposits … Depleted", "Iron & Metalwork … Impaired" on the
  same page as "The industrial step from what the mine yields to what the smith uses." 13 of 21 census S2 prints stand in
  towns whose iron seams are exhausted; `institution: mine` reads the house, not its deposit. Printed there at the base too.
- **LOW, CARRIED — the role sentence under a cut supply.** Under a siege the twins (and every sibling) keep "reduce raw ore
  to refined metal" while the same page says "Smelting & Refining … Impaired" (r2s-under_siege-town-1) or "Supply route
  severed. Operating at minimal capacity or shut down." (r2s-under_siege-metropolis-0). The first clause is the base's;
  the twins' new clauses ("cast in bars for whoever will buy them", "sells it on by the bar") add no claim the record
  refutes.
- **LOW, CARRIED — a Mine with no deposit.** r2r-town-11 (S1) and r2s-under_siege-city-0 (S1) hold a "Mine" while the
  record lists no ore deposit (ore imported); S1's "between the mine and the smithy" is true of the houses. The mine's
  existence is the institution generator's, not this stage's.

## Also asked
- A twin that lacks a condition its siblings carry: the catalogue text above. The two twins carry no condition by design
  (they name neither house).
- A slot that prints a catalogue label or breaks agreement: none (the description has no slot).
- A line that says how the model works: none.

## The count
4 lines new or re-conditioned in a1481aaf7..994733bcd; **4 of 4 read where they print** (3 surfaces each), in 5–7 towns
each, and by script in every one of their 231 prints across 1104 births. **FALSE at high or medium: 0** of the four.
One MEDIUM CARRIED in the same pool (the untouched catalogue sibling, 95 of 151 prints false). Three LOW, carried.

Probes: `probes/REVIEW-W2-FIX-DATA-4/` (`born.mjs`, `smelter.mjs`, `orecheck.mjs`, `surf.mjs`, seed lists; outputs
`out/*.ndjson.gz`). Run from outside every repository tree: `TREE=<tree> SEEDS=<file> OUT=<file> node smelter.mjs`.
