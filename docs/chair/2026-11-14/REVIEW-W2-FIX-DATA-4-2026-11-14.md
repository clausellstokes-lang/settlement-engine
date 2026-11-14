# REVIEW-W2-FIX-DATA-4 — the data lane 4114cf5a6 → 994733bcd: VERDICT **NOT CLEAR**

Reviewer REVIEW-W2-FIX-DATA-4 (independent). The lane read: `lane/w2-fix-data-2026-11-13` **at 994733bcd**, the tip the
brief names. When read, the branch's newest on origin was b75f78914: the twelfth seat's commits, not read and not judged.
Step 1 for a1481aaf7..994733bcd is `REVIEW-W2-FIX-DATA-4-LINES-READ.md` (c2e941510, pushed cold). Step 1 up to a1481aaf7
is the first reader's `REVIEW-W2-FIX-DATA-3-LINES-READ.md` (6dc6d84d5), which stands. Every figure is EXECUTED unless
marked PLAUSIBLE. Probes: `probes/REVIEW-W2-FIX-DATA-4/`.

## THE VERDICT: NOT CLEAR, on three findings that are the stage's own

| # | rank | the stage's own / carried | finding | how measured |
|---|---|---|---|---|
| 1 | **HIGH** | **THE STAGE'S OWN** (a draw it moved) | **r2r-thorp-58, Tallpatan, a thorp of 7**, and **r2s-indebted-thorp-0, Makrokastro, a thorp of 12**. Each PDF prints under The Migration's lasting effects: "Newcomer and old-family districts remain socially distinct." A thorp has no districts (kind d). At the base 4114cf5a6 the same towns printed "Spellcasting now requires a licence…" or "Watch towers…", and in Makrokastro's Migration slot "A resettlement compact governs where new arrivals may hold property". The stage's history re-deal put the line there. Writer: `src/data/historyData.js:1373`, a lasting-effect row with no tier condition, though the stage gave its district siblings (`HISTORY_QUARTER_WORDS`, the fire texts) tier twins. The class is CARRIED and shrinking: thorps and hamlets with a district or quarter word in history fall from 91 (base) to 39 (tip). In those 39 the same line, or its slot's, printed at the base. These 2 are the only new ones. | EXECUTED: census 720 at the tip and the base, history fields diffed per town; both PDFs rendered through the soak harness |
| 2 | **MED** | **THE STAGE'S OWN** (the first reader's A01, left uncured) | **r2s-infiltrated-metropolis-3, Vatantash.** The arrival reads: "The hammering echoes through all of Vatantash, and the place plainly lives by its forges." Iron & Metalwork is 4% of income (8th source; Market Taxes first at 26%), and the same page says two or three trades are named, not one. At the base no forge line printed here. At 994733bcd it still prints: the eleventh seat measured it (HANDBACK-11 §5 item 1) and did not cure it. A second new print in my fresh births: **rv4-any-metropolis-under_siege-7** (a metropolis under siege), A04 "… lives by its forges: the clang of iron is in every lane". There Iron & Metalwork is 6th at 6% and Market Taxes first at 31%; the base printed no forge line in that town. The class (`arrivalProse.js:65` A01 and A04) is CARRIED: 54 prints at the tip (72 at the base), metal never the first source in any of them; 52 of the 54 printed a forge line at the base too. | EXECUTED: `forge.mjs` over 936 births at the tip and the base |
| 3 | **MED** | **THE STAGE'S OWN** (the eleventh seat, not named) | **`docs/content/wiring-census.json` is stale at 994733bcd.** `node scripts/wiring-census.mjs --check` exits 1 ("is stale"); it exits 0 at a1481aaf7. `tests/lint/proseWiringCensus.walker.test.js` reds 2 titles at the tip, both green at a1481aaf7: "⭐ THE DRY READ: both modes, and the one that writes is not among them" and "the committed census is byte-identical to a fresh build, and the stamp is live". The cause is the smelter's two new sibling sets (930836ac5). The door's write moves `lines` 1109 → 1115, `colour` 758 → 752, and adds `institution: mine` 6 and `institution: smith` 6. The register was not re-derived through its own door, and HANDBACK-11 names neither red. | EXECUTED at both trees; the write was made in a scratch worktree, read and restored |

The one thing the chair must rule (finding 1's cure): give the lasting effect a tier twin, as the stage did for its district
siblings, or silence it below town. Either is a declared move of `history.historicalEvents[].lastingEffects[]`.

### MEDIUM and LOW, CARRIED (false at the base too; for the builder's list, not blocking)
- **MED, CARRIED, EXECUTED: the Smelter's catalogue sibling.** "Converts raw ore to refined metal using charcoal-fueled
  furnaces. The industrial intermediate between mine and smithy." (`src/data/institutionalCatalog.js:822`, no declaration)
  prints in towns that lack the mine or the smith: 57 of 96 census prints, 38 of 55 fresh. Example: r2s-under_siege-city-2,
  no Mine, on the Institutions tab, the PDF and the journal. HANDBACK-11 parks it: a sibling keyed in the variants file
  writes a new `house: mine` literal that the walker cannot credit. **I would rule differently:** by the chair's 04:58 class
  (4), a line false somewhere is a cure now, and a parking reason that is the instrument's is not the reader's.
- **HIGH, CARRIED (the first reader's C02/C05/C08/C15):** the PDF's Architecture row prints
  `culturalIdentity.architecturalDetail` raw (`src/pdf/sections/IdentityDailyLife.jsx:303`). It is uncured at 994733bcd;
  the twelfth seat's 184c68ba0 is later and not read here.
- **MED, CARRIED (the first reader's):** A06 under a forced siege; I23; the Megaikon and Radhagrad guild lines. Radhagrad
  (r2s-slave_revolt-hamlet-1) is also the one Compact print of 29 at the tip where no guild stands (step 2).
- **LOW, CARRIED:** the smelter's S2 "what the mine yields" in towns whose page says the iron mines are exhausted (13 of
  21 census S2 prints); the smelter's role sentence under a severed supply; a Mine standing with no deposit
  (r2r-town-11); the stone quarry's "Half the region's building stone was cut here" where the record lists no stone
  resource (r2r-town-15, r2r-town-33; the statement's own PLACEMENT note).
- **LOW, THE STAGE'S OWN (guards): see step 4.**

## Step 2 — the statement (HANDBACK-10, the final statement; HANDBACK-9 and HANDBACK-11 for their seats), row by row

Births: the census 720 plus 216 fresh (`rv4-any-<town|city|metropolis>-<6 states>-<i>`), 150 fresh villages for the Brewer,
at the tip and at the base (`cures.mjs`, `brew.mjs`).

| row the stage says it cured | the old sentence at the tip | what prints in its place, read | removed lines read (30 or all) | verdict |
|---|---|---|---|---|
| ww-331: the metropolis's parish churches "Hundreds of houses of worship" (HANDBACK-9, 792b1d11f) | 0 of 128 metropolis prints (base 128) | "Scores of parishes, from fifty to a hundred and more…", "Parishes by the score…": printed beside the house's own label "(50-100+)" on the tab, the PDF and the journal (r2r-metropolis-1, -3, r2s-under_siege-metropolis-0): TRUE | 30 of 128: all false against the page's own label (50-100+) | **cured and true.** The display one-liner `institutionVocabulary.js:335` "Hundreds of houses of worship across every district…" is NAMED, outside the lane, and did not print on any harness surface of 7 metropolises |
| ww-103 / #1229: the Mine "worked by hired crews" (HANDBACK-9, 383f1d9a7) | 0 of 158 (base 157) | "A mine of shafts and adits… Where the deposits ran deep…": TRUE in every town read (physical, past tense) | **157 removed: 89 were TRUE** (a mining or iron chain running or vulnerable), 15 of the first 30 | **cured by silence.** A true claim is taken off 89 towns; no false sentence |
| the Great Harvest Compact "the merchant guilds" → "the guilds" (HANDBACK-10, 71b593200) | 0 (base 45) | "the guilds negotiated…" in 29, the twin "agreed a formal compact" in 21: **28 of 29 TRUE**; **r2s-slave_revolt-hamlet-1 prints it with no guild** (HANDBACK-10 §8 names it: the draw reads `guild` before the roster is final) | 45 at the base: 21 true (a merchant guild stood), 24 false, 17 with no guild at all; 13 of the first 30 true | **cured, one residual (carried, named)** |
| the Brewer "After the bakers, no trade eats more grain" (HANDBACK-10, 23bfefde3) | 0 (the line was born inside the stage, seat 8) | "Only bread takes more of the grain." (and its twin), read in rv4-any-village-calm-4, -wartime-21, -wartime-24: TRUE; the alehouse half holds in 15 of 15 village Brewers | the removed line had 0 prints in my births (the statement's 4 of 4 were in its own fresh set) | **cured and true** |
| #185: the smelter's two variants (HANDBACK-11, 930836ac5) | the originals print only where both houses stand: 79 of 79 (1104 births) | the two twins, 152 prints: TRUE (step 1) | the 100 census towns moved: every one lacked the mine or the smith | **cured and true for the two variants**; the catalogue sibling is still false (above) |
| (a) the coaching-inn guard re-keyed to r2s-under_siege-town-1 (8d2aa98b1) | a test, not a line | | | the guard stands (my run: green at the tip) |
| (b) presumedThings ARM 2 by `--shrink-arm2` (ddadf07c5) | two first-register rows out ("by road or harbour", "walls and churches of half the region") | | | the door at the tip: `fresh 49 · stale 0`; ARM 2 green at the tip |

**Headline counts by my run.** Presumed-things door at the tip: **fresh 49 · stale 0 · banked 4,661**. The statement gives
4,663 at 23bfefde3; the 2 are the arm-2 shrink ddadf07c5. The smelter's 102 → 0 on the 730 (HANDBACK-11) matches mine:
100 census towns moved, 0 false variants left. The census FILE rows: step 7.

**The chair's rulings the stage was built to, where I would rule differently (for the owner's veto):**
- the 04:58 class (3) "RED AND NAMED" for a line **false somewhere** (the smelter's catalogue text): I would class it (4), a cure now.
- I AGREE with the first reader: C12 "organized neighborhoods" and C04 "the civic center" belong at tier ≥ town, not ≥ village.
- I agree with the rest: classes (1) to (4) as the statement applies them; the 08:11 observed-shape ruling (the three `config`
  reads in `assembleInstitutions.js`) as a bank entry at the joined line's refreeze; #116 to this lane.

## Step 3 — the laws
- **The eleventh seat's declared move, by field diff** (census 720, a1481aaf7 against 994733bcd): exactly ONE family moved,
  `institutions[].desc`, in **100 towns**, the smelter. No copy moved (no `defenseProfile`, no receipt), no key new or
  gone. It is DECLARED (HANDBACK-11 §4). The draw did not move: every Smelter kept its hashed slot (step 1).
- **The whole stage:** the first reader's counterfactual diff (`probes/REVIEW-W2-FIX-DATA-3/out/fielddiff-line-tip.txt`,
  the line 976db5b19 against a1481aaf7) gives about 55 families, every one inside HANDBACK-10 §5's declared list
  (institutions, history, culturalIdentity, culturalNotes, arrivalScene, availableServices, economicState's
  foodways/affected services, stress(ors) hook/viability, defenseProfile mirrors, generationCoherenceReceipt). HANDBACK-10
  §5 names history by its descriptions, effects, hooks, tensions' types and factions. It does NOT name the re-dealt
  events' `name`, `templateType`, `type`, `yearsAgo`, `severity` and `eventsTimeline[]` rows (83 towns, e.g. r2r-thorp-0
  "The Economic Divide" → "The Shortage"). PLAUSIBLY the same cause (refused templates re-drawn, HANDBACK-11 §1(c) bisects
  one); **LOW: the declaration's family list is incomplete for the re-deal**, and the re-deal is where finding 1 comes from.
- **No new key in the record:** EXECUTED. Every key path at the tip (census 720) exists at the base: 0 new, 0 gone
  (`keyset.mjs`).
- **No new word in the vocabulary:** EXECUTED. `src/domain/facts/` is byte-identical between the line 976db5b19 and the tip.
- **No draw added or moved undeclared:** the eleventh seat added none. For the whole stage, the history re-deal above
  (PLAUSIBLY declared).
- **The draft shift record** (`W2-FIX-DATA-shift-record.DRAFT.json`): measured at ddadf07c5, before the smelter. [STEP 7
  AND THE RECORD'S RE-MEASURE: below, filled when run.]
- **The page shows ratings, not machinery:** no new line of the eleventh seat names machinery. The stage's earlier lines:
  the first reader's step 1.

## Step 4 — plants (each in a scratch worktree, reverted; EXECUTED)
| guard | plant | result |
|---|---|---|
| `tests/data/w2FixData11Rows.test.js` (#185) | S1 keeps only `institution: mine` | **red** (r2r-town-38, no smith) |
| the same | S1 keeps only `institution: smith` | **GREEN: blind**. 46 census towns draw S1 with a smith and no mine |
| the same | S2 keeps only `institution: smith` | **red** (r2r-town-1, no mine) |
| the same | S2 keeps only `institution: mine` | **GREEN: blind**. 2 census towns draw S2 with a mine and no smith |
| `w2FixData6Rows.test.js` ww-331 (parish) | the old texts restored (792b1d11f reversed) | red, 3 of 3 towns |
| `w2FixData6Rows.test.js` ww-103 (Mine) | the old texts restored (383f1d9a7 reversed) | red, 3 of 3 towns |
| the Compact (71b593200) | "the merchant guilds" restored | `w2FixDataHistoryItems.test.js` GREEN (33 passed). The door's count rises 49 → 51, but the only test that reads it, presumedThings ARM 1, **is already red** (the 49 carried): **no green guard reds** |
| the Brewer (23bfefde3) | "After the bakers" restored | the same: door fresh rises (`house: baker`); ARM 1 already red; **no green guard** |

**LOW, THE STAGE'S OWN: the smelter guard covers 2 of the 4 conditions; the Compact and the Brewer cures have no green
guard.** Cures with no guard at all: finding 1's class (none existed); the PDF door (the first reader's); A06's siege
exclusion (no cure was made).

## Step 5 — the merge of the line (be4306956) and the registers
- The remerge diff: 15 files, **no code file**: `docs/content/wiring-census.json`, `scripts/.prose-byte-baseline.json`,
  `scripts/census/pool-dominance.register.json`, `tests/lint/presumedThings{,.widened}.register.json`, the edge bundles
  and their meta. The six `src/data/dossierStateProse/*.generated.js` merged clean. Five are the lane's side (the line's
  copy equals the merge base) and `defense` takes both sides' hunks. `economicData.js` is the stage's own (72804c5a2).
  No cure of the line's was dropped.
- Registers, each through its own door at the tip:

| register | the door at 994733bcd | verdict |
|---|---|---|
| `docs/content/wiring-census.json` | `--check` **exit 1, stale** (green at a1481aaf7) | **finding 3** |
| `scripts/census/pool-dominance.register.json` | the three Smelter rows removed and `--bank-new` run: **byte-identical** to the committed rows ("3 new rows banked, no other row touched"). Stage-wide: 15 rows added, 0 removed, **0 changed: no ceiling raised, no row re-based** | through its door |
| `tests/lint/presumedThings{,.widened}.register.json` | `--check`: fresh 49 (named), **stale 0** | through its door |
| `scripts/.prose-byte-baseline.json` | `proseCorpusBytes.test.js` green at the tip | equal |
| `tests/lint/.lighting-census-baseline.json` | `sovereigntyLightingContract.walker.test.js` green at the tip (red at the base: the file count) | equal |
| `docs/census/declarations/…INSTITUTION_DESC_VARIANTS.json` | `institutionProseDeclared.test.js` green at the tip. The smelter rows read `colour: false, needs: []`: the ledger reads `DESC_VARIANT_DECLARATIONS`, and the sibling sets' needs are not in this column (as for every sibling set) | equal |
| `scripts/census/page-census.register.json` | NOT RE-RUN (the 720 render's cost); see "not measured" | |

## Step 6 — the gates (my run at 994733bcd, through `sh scripts/gate-tail.sh`)
- `npm run typecheck:domain:strict`: **exit 0** (1113, ceiling 1113). `npm run typecheck:ratchet`: **exit 0** (167, ceiling
  167). No ceiling file moved against the line. `npx eslint` on the stage's 347 touched JS files: **exit 0** (0 errors,
  4 warnings).
- **The governing files** (39: every `tests/{data,generators}/w2FixData*`, institutionProseDeclared,
  tensionTemplateDeclaration, hookTablesDeclared, narrativeQualityCorpus, resolveCrisisCast, crisisTripleSync,
  census2dTables, textOf, heldKeyWriterCensus, poolDominance, presumedThings, proseWiringCensus, proseCorpusBytes,
  institutionDescDraw, observedShapeReaders, writerReach, factLayers, generationForkCensus,
  sovereigntyLightingContract): tip **12 red / 523 passed**; base 5 red (two files fail to load).

| red at the tip | at the base | class |
|---|---|---|
| proseWiringCensus 2 titles | green (green at a1481aaf7 too) | **THE STAGE'S OWN, NOT NAMED (finding 3)** |
| poolDominance "every drawn pool has a row…", "no pool rises above its ceiling…" | green | the stage's own, NAMED (HANDBACK-10 §1: the history seat's STOP, the stale Elder Grove rows), no hand edit |
| poolDominance "no ceiling sits loose" | red | carried |
| presumedThings ARM 1 | red | carried (the 49, named for the declaration pass) |
| observedShapeReaders 3 | the file fails to load | the stage's own, NAMED, ruled (08:11) for the refreeze |
| writerReach 2 | fails to load | the stage's own, NAMED (waits on the refreeze) |
| generationForkCensus A1 | red | carried by the stage's base; HANDBACK-11 §1(c) reads its hash |
| (green at the tip) factLayers READERS, sovereigntyLightingContract | red | cured inside the stage |

Refs and the shared local config were compared before and after every suite: unchanged. `npm ci` wrote
`core.hooksPath=.husky/_` once at the start; it was removed at once and the config compared equal.

## Step 7 — CENSUS-2 at the tip and the base
[filled when the run ends]

## Step 8
- **Each reworded data row on every surface (EXECUTED).** In the 20 census towns rendered on every surface, 56
  institution rows differ between the base and the tip. Every one prints the tip's text on the Institutions tab, the PDF
  and the Foundry journal, and no base text survives on any surface. (The journal escapes an apostrophe as `&#39;`; the
  description is never on the Services tab or Tonight.)
- **The pool guard:** no ceiling raised, no row re-based (step 5). The three new rows came by the register's own
  `--bank-new` and re-derive byte-identical.
- **Thirty prints of the statement's RED AND NAMED literals (EXECUTED, census 720 at the tip):** 34 of the 38 literals
  print (813 prints). 30 were read against their towns: **27 TRUE**, **2 LOW** (the quarry's "Half the region's building
  stone" with no stone resource: r2r-town-15, r2r-town-33), 1 misread by my matcher (the ley-line twin in a hamlet),
  replaced by a town print (r2r-town-4), TRUE. None is high or medium. Never printing in 720: the Charcoal burner's two
  forest originals, the defense granary marks string, one quarry variant.

## Lines I would strike (for the owner's veto)
- `src/data/historyData.js:1373` "Newcomer and old-family districts remain socially distinct" below town (finding 1).
- The catalogue's smelter text's second sentence where the mine or the smith is absent (the twin's form).
- `arrivalProse.js:65`'s "and the place plainly lives by its forges" (the eleventh seat's own recommendation).

## What I did not measure
- The twelfth seat (b75f78914's commits).
- `scripts/census/page-census.register.json` re-derived on the 720 (its `--grid` arm: below if run).
- Steps 2–8 for lines the first reader read: only its own list, as it stands, with its findings re-checked where I cite
  them (Vatantash, Radhagrad).
- The display one-liner `institutionVocabulary.js:335` in a live browser (the harness did not print it).
