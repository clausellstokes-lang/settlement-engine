# BAR7-DESKS · HAND-BACK · the desks' lines declare the bands that deny them (LAW 9: 9g, 9h.entrepot, 9i; LAW 7: 7x; 5x)

The seat BAR7-DESKS of `lane/chair-2026-11-08 :: docs/chair/2026-11-14/briefs/BRIEF-BAR7.md`, 2026-11-17. BASE: the joined line at
**5e81f0622** (the tip I was given). BRANCH: `lane/bar7-desks-2026-11-17`. I merged nothing. All work was done in scratch worktrees,
and every render went outside every tree. THE SEAM'S "DS-ECO-8 v3" was the MODERATE pool's v3 ("The town pays its own way and
has a little in hand."). The seam LEFT it undeclared (its item 2 needed an atom over `guardPayOf`). My line is the COMFORTABLE pool's
v3, a different line, and the seam did not touch it. MODERATE v3 is still as the seam left it, and I did not touch it either.

## 1 · THE RULES (counted by the auditor's runner, `runI.mjs`, over the thirty / the 150 / the 720; towns · instances)

| rule | the 30 base → tip | the 150 base → tip | the 720 base → tip | the cure (one fact) |
|---|---|---|---|---|
| 9g.subsistence | 1 → **0** | 0 → 0 | 3 → ****0**** | DS-ECO-8 COMFORTABLE v3 says "plainly comfortable", not "past subsistence" |
| 9g.stores | 1 → **0** | 3 → **0** | 8 → ****0**** | v3 declares `stores: ≥ 3`; its twin v4 (`food: ≥ secure · stores: < 3`) takes exactly the towns it is refused in |
| 9g.food | 1 → **0** | 0 → 0 | 0 → ****0**** | DS-DEF-12 ample v1/v3 declare `food: ≥ secure · no crisis: hunger`; twins v5/v6 (`food: pressured`), v7/v8 (`food: ≥ secure · crisis: hunger`) |
| 9g.source | 1 → **0** | 0 → 0 | 8 → ****0**** | DS-ECO-9 "one source" is drawn only where the printed foodways line names the record's first source first (`economyStateProse.js :: oneSourceUnderFoodways`) |
| 9h.entrepot | 1 → **0** | 0 → 0 | 0 → ****0**** | DS-ECO-10's `entrepot` posture reads the printed import list (`entrepotUnderNoImport`): none printed, no trade stop → the ladder's other arms over the printed exports |
| 9i.crews | 2 → **0** | 0 → 0 | 5 → ****0**** | DS-DEF-4 semi-organized v3 declares `rival rings` (NEW ATOM) · `no crisis: occupied` · `law: ≤ adequate`; three twins, mutually exclusive with it |
| 7x.occupied-seat | 1 → **0** | 2 → **0** | 3 → ****0**** | the twelve free-seat lines declare `no crisis: occupied`; six occupation twins in the Power tab's words ("carries out what the occupiers decide") |
| 5x.slash | 1 → **0** | 3 → **0** | 38 → ****0**** | `properFill` reads a house's prose form (`src/data/houseSentenceName.js`, NEW): "Jómsmo's Weaving house can offer less the longer its supplies stay short" |

The rules apart stay apart: 9g.margin-war, 9g.margin-mild, 9g.food-soft, 9i.crews-safe, 5x.slash-list. 9g.margin itself
(1 → 1 over the thirty) belongs to BAR7-SCENES (the war's overview row, the chair's PM1). I gave the ledger line its words and
left its declaration as it was.

THE GUARD: `tests/domain/bar7DesksLines.test.js` holds 26 cases. It runs a law over the sixth read's thirty seeds and plants each
of the twelve slash labels once. At the base 5e81f0622: **26 failed of 26**. At my tip: **26 passed**.

THE STATIC HALF (`staticI.mjs`) at my tip: **7x.occupied-seat 12 lines, 0 admit** (12 at the base). **9i.crews 1 line, 0 admit**
(1). **9g.subsistence: no line** (1). **9g.food: 7 lines, 2 admit**. Every strong food line reads 0: DS-DEF-12 v1/v3,
DS-ECO-2 FOOD surplus v1 (`no hunger`), DS-ECO-8 full stores v1/v4 (`food surplus`), and DS-ECO-3 v2. That last line is
reworded to the trade it means: "A great deal of trade passes here." The two lines left are the GENERAL desk's soft "eats well"
lines (DS-GEN-3 v3 and v4). That desk is not mine, and the brief names only the strong lines. 9g.stores: 6 lines, 2 admit
(DS-DEF-2 "granary AND parish" v1 and DS-ECO-2 GRANARY well stocked v5). Neither is named in my items, and both are left by name.

## 2 · THE CONTROLS

- **C18905** (bar0-hamlet-calm-rand-43): **CHANGED**. "The hamlet is plainly comfortable. The buildings are finished rather than
  patched, though nobody here keeps more in store than the coming season needs." (the v4 twin; 1.5 months of stores).
- **C41011** (bar0-town-occupied-rand-44): **GONE**. "No dependable road, river or port reaches Castelsinum, and the town makes do
  without one: what it raises falls a little short of what it eats, and its stores make up the rest." (twin v5, Pressured).
- **C41850** (bar0-village-calm-rand-42): **GONE**. The one-source line is not drawn beside "Its own fields give it grain, …".
- **C32912** (bar0-thorp-calm-rand-44): **CHANGED**. "Shattserai sells more than one thing beyond the thorp." (no import is printed).
- **C23038** (bar0-metropolis-calm-rand-42; rings, Very Safe, law Surplus): **CHANGED**. "More than one crew works Bjornli, but the
  metropolis's law is heavier than any of them, and none of them can fight for the streets in the open."
- **C39691** (bar0-town-occupied-rand-43; a lone gambling den): **CHANGED**. "Most of the organised crime at Gangapalli runs through
  one house, and nobody is fighting it for the streets."
- **C40850** (bar0-town-occupied-rand-44): **CHANGED**. "At Castelsinum the Feudal Appointee still answers quickly, but under the
  occupation it carries out what the occupiers decide."
- **C25601** (bar0-metropolis-calm-rand-43): **CHANGED**. "Jómsmo's Weaving house can offer less the longer its supplies stay
  short, and nobody is putting it right."
- **C12371** (bar0-city-wartime-rand-42) and **C27960** (bar0-metropolis-calm-rand-43), the EXPLAINED rows: **STILL PRINT**, in
  their new words ("Plavigorod's purse closes every year ahead. The margin is not large but it is dependable, and there is money
  laid by behind it."). The runner reads both clean. C15153 (SCENES's control) prints the same new words. Its war row is SCENES's.

## 3 · THE LINES A READER CAN SEE (each with up to three towns of the three populations it prints in at my tip)

| line | towns (the 900) | three of them |
|---|---|---|
| DS-ECO-8 COMFORTABLE v1, "{settlement}'s purse closes every year ahead. The margin is not large but it is dependable, and there is money laid by behind it." | 61 | bar0-city-wartime-rand-33, bar0-city-wartime-rand-42, bar0-city-wartime-rand-43 |
| DS-ECO-8 COMFORTABLE v3, "The town is plainly comfortable. The buildings are finished rather than patched, and the stores are more than the season needs." | 23 | bar0-metropolis-calm-rand-28, bar0-metropolis-calm-rand-31, bar0-metropolis-calm-rand-40 |
| DS-ECO-8 COMFORTABLE v4 (twin), "… though nobody here keeps more in store than the coming season needs." | 10 | bar0-hamlet-calm-rand-43, bar0-thorp-calm-rand-30, r2r-hamlet-11 |
| DS-DEF-12 ample v5 (twin, Pressured), "… the town makes do without one: what it raises falls a little short of what it eats, and its stores make up the rest." | 1 | bar0-town-occupied-rand-44 |
| DS-DEF-12 ample v6 (twin, Pressured), "Traders seldom reach {settlement}, and people there seldom miss them, though the town raises a little less than it eats and draws on its stores for the rest." | 1 | r2r-town-54 |
| DS-DEF-12 ample v7 (twin, Secure under a hunger), "{settlement} had put by more than it needed, and it is living on those stores now." | 0 | — (the state is not in the three populations; held by the guard) |
| DS-DEF-12 ample v8 (twin, Secure under a hunger), "… and this year the town lives on what it had put by." | 0 | — (the state is not in the three populations; held by the guard) |
| DS-ECO-2 FOOD surplus v5 (twin, a hunger), "On the count, {settlement} raises more than it eats; with the crisis on, the excess is being kept back rather than sold." | 0 | — (the state is not in the three populations; held by the guard) |
| DS-ECO-2 FOOD surplus v6 (twin, a hunger), "What {settlement} raises still comes out ahead of what it eats, and this year every bit of the excess is wanted at home." | 0 | — (the state is not in the three populations; held by the guard) |
| DS-ECO-3 SURPLUS × not trade-dependent v2, "A great deal of trade passes here. Not much of it stops." (was "Plenty passes here.") | 0 | — (the state is not in the three populations; held by the guard) |
| DS-DEF-4 semi-organized v4 (twin, no rings), "Most of the organised crime at {settlement} runs through one house, and nobody is fighting it for the streets." | 32 | bar0-city-under_siege+famine-rand-33, bar0-city-under_siege+famine-rand-40, bar0-city-wartime-rand-27 |
| DS-DEF-4 semi-organized v5 (twin, rings under a curfew), "The crews at {settlement} that would fight over the streets keep out of sight under the occupation's curfew, and their quarrel waits." | 1 | r2s-occupied-metropolis-1 |
| DS-DEF-4 semi-organized v6 (twin, rings under a Surplus law), "More than one crew works {settlement}, but the town's law is heavier than any of them, …" | 5 | bar0-metropolis-calm-rand-42, r2r-metropolis-22, r2r-metropolis-3 |
| DS-DEF-4 semi-organized v3, "Rival crews … are fighting over who runs the streets" (unchanged words; still prints where rings stand, no occupation, law ≤ Adequate) | 36 | bar0-city-under_siege+famine-rand-29, bar0-city-under_siege+famine-rand-30, bar0-city-under_siege+famine-rand-42 |
| DS-POW-1 Approved v5 (twin), "… thinks well enough of the {seat}, not warmly, though under the occupation it carries out what the occupiers decide." | 0 | — (the state is not in the three populations; held by the guard) |
| DS-POW-2 stable v5 (twin), "Everyone at {settlement} knows that {faction} holds the hall, and that under the occupation it carries out what the occupiers decide." | 0 | — (the state is not in the three populations; held by the guard) |
| DS-POW-3 shallow v4 (twin), "Deal with {faction} at {settlement} and there is nobody else in it to be sent to, though under the occupation …" | 0 | — (the state is not in the three populations; held by the guard) |
| DS-POW-5 autocrat v6 (twin), "At {settlement} the {seat} still answers quickly, but under the occupation it carries out what the occupiers decide." | 3 | bar0-town-occupied-rand-38, bar0-town-occupied-rand-44, r2s-occupied-metropolis-1 |
| DS-POW-5 secularBrutalism v3 (twin), "… Soldiers carry out the occupiers' orders through the {seat}, and nobody of the faith stands between the town and the punishment." | 0 | — (the state is not in the three populations; held by the guard) |
| DS-POW-7 RULING bloc v4 (twin), "A working majority sits at {settlement} with the {seat} inside it, though under the occupation it carries out what the occupiers decide." | 0 | — (the state is not in the three populations; held by the guard) |
| DS-SUP-3 impaired / DS-ECO-11: "{settlement}'s Weaving house …" (was "Weavers/Textile workers") | 42 | bar0-city-wartime-rand-29, bar0-metropolis-calm-rand-35, bar0-metropolis-calm-rand-43 |
| DS-ECO-10 under no printed import: the posture of the printed exports ("Shattserai sells more than one thing beyond the thorp.") | 1 | bar0-thorp-calm-rand-44 |

The prose forms of `{institution}` (all singular, all capitalised, so the desk's own singular verbs and "its" agree):
Weavers/Textile workers → Weaving house · Palace/government complex → Palace · Small prison/stocks → Prison ·
Colosseum/arena → Arena · Docks/port facilities → Harbour · Sage/library → Library · Spa/healing house → Healing house ·
Hot Springs / Healing Waters → Healing spring · Livestock / game → Livestock · Wool / flax → Wool · Desert/Arid → Desert ·
Monster Hunters / Adventurers → Hunters' lodge. The guard plants each one. Only "Weavers/Textile workers" reaches the desk in
the three populations. THE WORDS ARE THE OWNER'S TO VETO.

## 4 · NEW VOCABULARY, FOR THE OWNER'S VETO LIST

- **`rival rings`** (item 6; the brief named it as mine). A presence atom: two criminal powers that do not govern, or the roster's
  "Multiple criminal factions". It is read over `corruption.js :: rivalRingsOf` by the leaf `src/domain/facts/rivalRings.js ::
  rivalRingsStand`, which is written beneath `organised crime`, its subject, in `factVocabulary.js`. It has one getter in
  `factsOf.js` and one row in `factLayers.js`: layer 3, reading `powerStructure` and `institutions`.
  THE LEAF IS NOT IMPORT-FREE: it imports `corruption.js`, the module that holds the one reading. That module is engine-core,
  and the eager closure already reaches it through `criminalStructureKey.js`. I chose this over a second spelling of the
  reading. EG1 is held: `tests/architecture` is green, and the one build and `bootSmoke` / `vendorPdfLazy` are green.
- **The house prose forms** (`src/data/houseSentenceName.js`). A data table, not an atom, built in the shape of
  `powerSentenceName.js`.

## 5 · DECLARED MOVES AND THE BOOKS

- **NO MOVE OF THE STORED RECORD.** The births are byte-identical between base and tip: 30 of 30, 150 of 150 and 720 of the 720.
  Every cure is read at print. The new getter is read by no draw at birth. No field was added to the saved record. Nothing in
  `assembleSettlement.js`, `vite.config.js` or `package.json` was touched.
- **THE PAGE MOVES** only in the lines above. The kernel draws by an argmax over a per-vid hash. To keep draws stable, each twin
  takes only the towns where its line is refused, so where the original still stands its town's eligible set keeps the size it
  had at the base. That is why C12371 and C27960 still print. Exceptions where the set grows: the hunger twins of DS-ECO-2 FOOD
  surplus (2) and DS-DEF-12 (2) raise thin pools under a hunger.
  R7 MEASURED over the three populations (900 towns; admitted lines by declaration and tier): no pool I touched has fewer than
  three admitted lines in a town where it had more at the base. The occupation arms lose one line each (Approved 4 → 3,
  stable 4 → 3, unclassified 7 → 6, theocracy 4 → 3, merchant_league 4 → 3, in 46 towns). DS-ECO-8 "full stores lift the town"
  drops under three for towns without a food surplus, but the pool is keyed only on a `bonus` food modifier, and no town of the
  720 holds one. So no printed town moves.
- **THE BOOKS THESE CURES MOVE (the close's; I re-took nothing stored and committed none of them):**
  (a) the wiring census `docs/content/wiring-census.json`. It is stale at the base, and the generator refuses to run against it.
  Per AX1 I re-took it in scratch only, for each regeneration, and restored it.
  (b) `src/data/proseNorms.generated.js`. The regeneration re-writes it and I did not commit it.
  (c) the prose byte baseline `scripts/.prose-byte-baseline.json`: economy +1,190 B, defense +3,000 B, power +3,209 B raw.
  (d) the two doors' stale rows. My edits made the banked rows of the lines I reworded or declared stale. I ran no `--shrink`
  and no `--bank`.
- THE TWO DOORS, last line, base → tip:
  `presumption-classes-door --check`: "hits 1795 · banked 1938 · fresh 0 · stale 143 · ceiling 1938" → "hits 1793 · banked 1938 ·
  fresh 0 · stale 145 · ceiling 1938".
  `presumed-things-door --check`: "fresh 39 · stale 72 · first-register stale 6 · banked 4688 · …" → "fresh 39 · stale 72 ·
  first-register stale 6 · banked 4688 · …". The 39 fresh rows are the base's own, compared row by row.
  **MY CURES ADD NO FRESH LINE TO EITHER.** Three of my first twins did add fresh lines: "a bad year would take", "the hunger" and
  "no temple or priest". All three were reworded before my last push.

## 6 · TESTS MY CURE MADE UNTRUE (re-keyed by identity)

- `tests/domain/tailCorpusDefGuards.test.js`, its KEEP row "DS-DEF-12::CAPACITY: ample v3 … a secure food record". It had pinned
  r2r-town-54, where the record is Secure but the page prints Pressured (`foodWordShown.js`, a daily gap). That is C41011's
  state, so the line is now refused there. I re-keyed the row to r2s-politically_fractured-town-2 (ample, Secure printed, no
  hunger), with a dated note. The assertion's form is unchanged.
- `tests/lint/dossierMountRegistry.walker.test.js` went red at my first tip. My DS-DEF-12 lines had used the kernel's `hunger`
  dimension words, which that mount does not answer. I moved them to the vocabulary's family atom (`crisis: hunger` /
  `no crisis: hunger`), and the test is green again. No test was loosened, skipped or deleted.

## 7 · THE NET (each run alone, through `sh scripts/gate-tail.sh`; base first)

| gate | base 5e81f0622 | tip |
|---|---|---|
| `npm run typecheck:domain:strict` | exit 0 | exit 0 |
| `npm run typecheck:ratchet` | exit 0 | exit 0 |
| `npx eslint` on my changed sources | — | exit 0 |
| `npx vitest run tests/architecture` | exit 0 | exit 0 |
| `npm run build`, then `tests/build/vendorPdfLazy.test.js tests/build/bootSmoke.test.js` | — | build exit 0; 49 passed, 17 skipped |
| my guard | 26 failed | 26 passed |
| the rounds before (`bar5*`, `bar6*`) | 1 red: `bar6ScenesGoods.test.js` "each good reads the page's own lists …" | the same 1 red, the same message (named, not chased) |
| the two doors | as in §5 | as in §5 |

THE NET AT MY LAST TIP (7a9e8e2ad, the final run, each alone): strict exit 0, ratchet exit 0, architecture exit 0, the rounds before 1 red (`bar6ScenesGoods`, as at the base), my guard 26 passed, `tailCorpusDefGuards` the base's 2 reds only, `dossierMountRegistry` green, door A fresh 0, door B fresh 39 (the base's own 39).

THE LINES' PRESENCE OVER THE 720 (towns, base → tip): "plainly past subsistence" 28 → 0; "comes first of all from its" 76 → 61; "Rival crews at" 58 → 27; "Weaving house" 0 → 38 (the roster label "Weavers/Textile workers" itself still prints in its 272 towns' HOUSES lists, untouched); "sells on goods it never made" 61 → 61 (every town left prints its imports).

Red at base and tip alike, named and not chased (the desk and lint files nearest my change, run at both): `tailCorpusDefGuards` DS-DEF-3
Safe v2 and v3; `composeStateProse` (4 cases); `defenseStateProseDesk` (3); `stateProseKernel` (1); `economyDeskReadsTheCards` (1);
`census2d/2e/2gTables`, `textOf`, `declarationRegisters` (the registers are the close's); `factLayers.walker` (the `legalHouse` leaf row) and
the other lint reds that match at base and tip.

## 8 · LEFT BY NAME

- **9g.margin**: BAR7-SCENES holds the war row (PM1). My ledger line keeps its declaration (`no crisis: indebted`).
- **The general desk's soft food lines** (DS-GEN-3 v3 and v4, "eats well"): not my desk, and not among the brief's strong lines.
- **9g.stores, the static half's two other lines** (DS-DEF-2 "granary AND parish" v1; DS-ECO-2 GRANARY well stocked v5): not
  named in my items. Neither printed in the counted rule at my tip.
- **9a.order** (static: 4 lines admit Collapsed): BAR7-LINES holds the siege clause. The four desk lines are not in my items.
- **"the safety word" in item 6**: there is no atom for the Safety word. The line reads the Foundations row's Law & order band
  (`law: ≤ adequate`), which is Surplus in the Very Safe metropolis of C23038. A Safe town whose law reads Adequate still admits
  the line. The auditor counts that case apart (`crews-safe`).
- **DS-ECO-9's pools of several sources** are left ungated, on purpose. A famine's failed source leaves the printed foodways line
  by design, and "Having more than its fishing to rely on has not kept the famine out" is true beside "Its own food is flour from
  the mill." (bar0-village-famine-rand-42).
