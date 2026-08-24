# TE-CH-4 RECEIPT — STOPPED AT CHECKPOINT (chair recall, 2026-08-24)

## THE TIP
**Commit `f3d02f62c4ba8f331747ad343d816e51fae6745b`** (detached, parent = slot
`c3289244d58b7259205d80594856e8e0cc520817`).
**Pinned at `refs/preserve/wip-ch4`** (WIP, not holding — the FULL gate was never run).
Two files changed, 358 insertions, 23 deletions:
`src/domain/districtProfile.js`, `tests/domain/districtProfile.test.js`.
NO new test file. NO CAS. NO push. NO pin deleted. `npcProfile.js` untouched (CH-7's).
`ARCANE_INST_KW` / divine healer untouched (CH-6's).

Worktree `.../scratchpad/laneCH4-tree` built with `npm ci` (468 pkgs, 40 deps).
`.husky/_` PRESENT ⇒ pre-commit RAN; it ran `eslint --fix` and re-staged, but
`git diff HEAD` after the commit was EMPTY, so the hook rewrote nothing and the
tip bytes are mine. Re-proved AT THE TIP (below), not at the pre-commit tree.

## VERBATIM GATE LINES (all at the committed tip unless noted)

Focused suite, at the tip:
    TRUE_EXIT=0
     Test Files  1 passed (1)
          Tests  33 passed (33)

Map golden family + category consumers (8 files), at the tip content:
    TRUE_EXIT=0
     Test Files  8 passed (8)
          Tests  138 passed (138)

The three map goldens re-proved alone, tree clean at the tip:
    TRUE_EXIT=0
     Test Files  3 passed (3)
          Tests  16 passed (16)

⛔ **`npm run check:tail` (the FULL gate) was NEVER RUN.** That is the single
outstanding proof. Do not claim this car is green.

## CENSUS DELTA (carry the DELTA, never the tuple)
    files       +0     (no new test file — deliberate, see JUDGMENT 1)
    titles     +16     (static `it(` 17 -> 33; executed 33 at the tip, they agree)
    suiteTitles +3     (`describe(` 5 -> 8)
    parked      +0    credited +0
No new test FILE ⇒ the three-ratchet trap (two censuses + mutationCoverageManifest
E-A TOTALITY) is NOT tripped. No package.json byte changed ⇒ no mint trigger.

---

# THE MEASUREMENTS — corpus 6 tiers x 84 seeds = 504 settlements, 1696 quarters, 0 gen errors

Harness (scratch, NOT committed, dies with the session — reproduce from this spec):
generate `generateSettlementPipeline({settType}, null, {seed:`ch4-${tier}-${i}`, customContent:{}})`
for tiers thorp/hamlet/village/town/city/metropolis, i in 0..83. 168 are city+metropolis.

## ⭐ ITEM 1 — THE 333 DELETIONS: MEASURED, AND THE BRIEF'S NUMBER IS WRONG

Baseline districts carrying a dominant-faction row: **1423 of 1696**.

| variant | rows | NET vs baseline |
|---|---|---|
| BASELINE (shipped) | 1423 | — |
| Shape D + **shipped** `CATEGORY_TO_ARCHETYPE` | 1136 | **−287** |
| Shape D + naive route (iii) | 1207 | −216 |
| Shape D + **my corrected canonical preference lists** | **1300** | **−123** |

**The brief estimated "up to 333 lost against 44 gained". The executed figure is
332 lost / 45 gained = NET −287** — the brief's magnitude was right, its exact
numbers were not. Losses under the shipped map: Common Residential 168→0,
Noxious Trades 164→0. Gain: Mages' Quarter 90→135.

**ROOT CAUSE (this is the finding that matters).** `CATEGORY_TO_ARCHETYPE` named
archetypes the engine NEVER PRODUCES. Over 3,038 faction instances the canonical
vocabulary yields **ZERO `craft`** and **ZERO `civic`**. So `industrial→'craft'`
and `craft→'craft'` were unconditional nulls. Declaring Noxious Trades
`industrial` would have deleted its row from 164 cards while the car advertised
additions.

**A SECOND, NEW regression that naive route (iii) introduces:** matching canonical
`government` ALONE drops the Government Quarter's row on **93 of 216**
settlements (those ruled by a noble house). Cured by the `noble` fallback.

**THE FIX SHIPPED:** `CATEGORY_TO_ARCHETYPE` becomes canonical PREFERENCE LISTS,
each ending in an archetype that actually occurs:
`craft:['craft','merchant']`, `civic:['government','civic','noble']`,
`noble:['noble','government']`, `industrial:['craft','merchant']`,
`residential:[]`, `other:[]`.
Result: **LOST 168 / GAINED 45 / KEPT-RENAMED 340 / KEPT-SAME 915.**

**The one surviving deletion class is EARNED.** All 168 are Common Residential,
whose criminal-faction row existed ONLY because the unanchored `den` matched the
substring in its own description "Dense timber tenements". That row asserted a
thieves' guild dominates every common residential district in every city — a
fabrication, not a feature. `SettlementMapCards.jsx:86` gates the row on
`dominantFaction?.name`, so it simply omits; no card breaks.

## ITEM 2 — ROUTE (iii) AND THE FOLD: CONFIRMED, FIGURES CORRECTED
`factionProfile.js:128-134` `CANONICAL_TO_PROFILE` folds `[FA.NOBLE]` and
`[FA.CIVIC]` into `'government'` — CONFIRMED at those exact lines.
Measured: canonical **government 411 + noble 359 = 770 = folded government EXACTLY**.
Canonical **noble = 359 across 348 of 504** settlements.
⚠ The brief said **396 of 3,272 across 363 of 504**; I measure **359 of 3,038
across 348 of 504**. Different corpus, identical structure — the fold is real.
Join key: profile id `faction.${snakeCase(faction.faction || faction.name)}`,
measured **3038 of 3038 profiles joined (100.000%)**.

⭐ **EXTRA DEFECT FOUND BY A PIN.** Selecting canonically but REPORTING the folded
archetype made the card select a noble house then label it `government` —
`explanation.js:1073` prints that verbatim as "<house> (government) dominates
this district." Fixed: the reported archetype is now the one matched on.

## ITEM 3 — THE FIVE §4.1 DOWNSTREAM FIGURES, RE-DERIVED
| figure | brief | **my executed value** |
|---|---|---|
| wealth bands moved | reported wrong | **515** |
| safety bands moved | reported wrong | **713** |
| map rings (CATEGORY_CENTRALITY) moved | reported wrong | **668** |
| wall-embrace (VALUED set) flag flipped | reported wrong | **332** |
| institution-class placement | claimed to move | **DOES NOT MOVE — see below** |

⚠ **wealth = 515, NOT the 629 I first estimated.** My own base-band arithmetic
said 629; executing the real module gave 515. The band CLAMP absorbs 114 moves
(e.g. merchant base 4 and noble base 5 both clamp to `opulent` under a prosperity
lift). This is why the estimate had to be executed — I nearly reported 629.

⚠ **institution-class placement does NOT move.** `townLayoutV2.js:704` builds its
haystack from the INSTITUTION's own `name/priorityCategory/category/tags`, and
line 705 gates `kind` on that plus `cityPlus`. The DISTRICT category is not read.
What moves is institution **POSITION** (buildings fan around a centroid that
shifts when the district's ring changes), never institution **CLASS**.

## ITEM 4 — THE FABRIC JOIN: LIT, AND THE DIRECTION IS **FEWER**
`urbanFabricEnabled: true` at `simulationRules.js:455`, and in the `lights` of
dramatic_campaign, living_realm, full_simulation. **The layer is LIT** — confirmed.
The join is `townLayoutV2.js:571` `fabric.stocks[src.category]`: the DEPOSIT side
is keyed by `urbanFabricKernel.districtClassOf`, the READ side by
`districtProfile.inferCategory`. CH-4 changes only the read key.

**MEASURED DIRECTION: FEWER hits. 1571 → 1276, −295.**
Deposited class keys over 504 settlements: civic 504, merchant 504, religious 496,
industrial 395, criminal 302, arcane 294, military 283, craft 79, noble 14 —
**`residential` and `foreign` are NEVER deposited.**
Losses: Common Residential 168→0 (`residential` never deposited), Wealthy
Residential 168→0 (`noble` deposited by only 14 settlements, none overlapping).
Gain: Mages' Quarter +41. Effect: `prom` becomes 0, so those districts sit at
their nominal ring instead of being pulled by fabric prominence (worth up to
−140 on a rankKey where one ring is 100).
**I did NOT change the deposit side** — that is a different car.

## ITEM 5 — THE REGISTRY IS **14**, NOT 12
14 `quarters.push` sites; 14 `name:` literals, ALL plain strings, no interpolation.
Name-block sha **`eb9662051721` byte-identical at all six commits** touching the
block: e608542bd (2026-04-13), b76848c90, 62c5e8d67, 1fd128e3a, c1ea091f7,
c3289244d. This is exactly why a DECLARED registry covers legacy saves.
⚠ Only **10 of 14** names ever appear in the corpus. **Waterfront District,
Fishing Landing, Woodcutters' Ground and Artisan Quarter are NEVER produced (0).**
The brief's worry about Artisan quarters losing rows is moot in-corpus — but the
registry rows still matter, because a shape the corpus never produces looks clean.
⚠ 5 of 12 categories are never produced today: residential, industrial, noble,
foreign, military.

## THE DEFECTS CURED (all measured, not inferred)
- `den` UNANCHORED matched "**Dense** timber tenements" ⇒ Common Residential
  classified **criminal on 168 of 168** cities/metropolises.
- Shadows District — the actual criminal quarter — classified **merchant on
  168/168** (via "hidden markets"). **The two were EXACTLY SWAPPED.**
- Noxious Trades Quarter ⇒ **merchant on 164** (via "Trades" hitting `/trade/`).
- Wealthy Residential ⇒ **merchant on 168/168** (via landmark "Merchant Estates") —
  it was never `residential`, so the ruled `noble` replaces `merchant`, not `poor`.
- Mages' Quarter ⇒ **craft on 45 of 148** (a `guild`/`smith` landmark beats
  `arcane`; craft is pattern #4, arcane #7).

## ⛔ THE INSTRUMENT FINDING — READ THIS BEFORE TRUSTING ANY GREEN
1. **CONFIRMED:** `districtProfile` appears **ZERO** times in
   `generateSettlementPipeline.js`. The settlement-record digest and
   `generator-golden-master.json` CANNOT move. Structurally blind.
2. ⭐ **NEW — THE BRIEF IS WRONG ABOUT THE MAP GOLDENS.** The brief says "what
   DOES move is the map golden family". **It does not.** All three
   (`town-map-v2-golden`, `age-overlay-golden`, `illustrated-town-golden`) stay
   GREEN at the tip, and they are **blind to the registry for the same
   structural reason**: `tests/fixtures/townMapFixtures.js` builds hand-authored
   settlements whose 12 quarter names — Arcane Enclave, Commoner Rows, Council
   Green, Foreign Quarter, Forge District, Garrison Quarter, Highmanor Hill,
   Lodging District Housing, Market Row, **Shadow Dens**, Tannery Flats, Temple
   Ward — include **NONE of the generator's 14**. `QUARTER_CATEGORY` never fires.
   Their green is NOT evidence the change is inert; the 504-settlement
   differential is the only instrument that sees it.
   (Useful corroboration: `Shadow Dens` DOES contain the word "Dens", and stays
   `criminal` under `\bdens?\b` — the anchoring correctly spares a real den.)
3. Both panel paths were one directory too shallow — real homes confirmed as
   `src/domain/townMap/townLayoutV2.js` and `src/domain/townMap/mapEdits.js`.

## THE DECLARED SHIFT — EXACT FIGURES FOR THE CHAIR TO AUTHOR
Per 504-settlement corpus / 1696 districts:
- **category** changes on **1116** districts (histogram: merchant 584→84,
  criminal 168→168 but a DIFFERENT quarter, +residential 252, +noble 168,
  +industrial 164, arcane 103→148, craft 45→0, other 84→0).
- **wealth band** moves on **515**; **safety band** moves on **713**.
- **dominant-faction row**: **168 removed, 45 added, 340 renamed, 915 unchanged**
  (net 1423→1300).
- **card prose** (`explanation.js:1073`) changes on every renamed row (340) plus
  the archetype-label correction on noble-matched rows.
- **map ring** moves on **668**; **wall-embrace** flag flips on **332**.
- **fabric join** hits fall **1571→1276 (−295)**.
- **printed dossier legend** (`TownMapPlate.jsx:121` `legendCategories`):
  **+271 rows total; 252 of 504 legends grow, 0 shrink; 397 of 504 legend SETS
  change; mean rows 2.83→3.37.** Carried by **2 of 4** PDF variants —
  `townMapPlate: true` in draft_brief and canon_dossier, `false` in
  timeline_packet and campaign_state. CONFIRMED.
- **settlement-record digest / generator-golden-master: CANNOT MOVE** (blind).
- **map golden family: DOES NOT MOVE** (blind to the registry — see above).

## ⭐ DM-ANNOTATION DRIFT — COST TO GIVE ANNOTATIONS THE PIN'S SHAPE
`src/domain/townMap/mapEdits.js`: `MapEditPin {anchor, dx, dy}` is at **line 39**,
`MapAnnotation {x, y, label, audience}` at **line 41** — **2 lines apart, not 10.**
THE DRIFT: CH-4 moves district centroids (668 ring moves), but an annotation is
stored in ABSOLUTE viewport coords (clamped 0..VIEW_MAX at `readAnnotations`,
line ~312-322). A DM marker placed over the Noxious Trades Quarter stays put
while that quarter slides from ring 2 to ring 6 — it silently de-registers from
the thing it annotated. **This is a REAL consequence of this car.**
COST TO FIX (reported, NOT built here):
- **CHEAP:** no new schema keys. `anchor`/`dx`/`dy` are ALREADY in
  `MAP_EDITS_SCHEMA_KEYS` (line ~110) for pins, so no `PRIVATE_KEY_RE` re-check
  and no naming-trap test change. Migration is free: absent `anchor` ⇒ today's
  x/y path ⇒ byte-identical dormant.
- **THE REAL COST:** `readAnnotations(edits)` is PURE over `edits` alone. Anchor
  resolution needs the map model, so it needs a second function
  (`resolveAnnotations(edits, model)`) or a threaded model at the render
  boundary — every call site changes.
- **THE TRAP:** the canonical sort is `(y, x, label)`. If a resolved position
  feeds that sort, the stringify order becomes MODEL-DEPENDENT and the
  byte-stability/dormancy law breaks. The sort must stay on the STORED fields.
- ⚠ The code at lines 93-95 calls the coordinate form **deliberate** ("a marker
  has no backing element to key on — a different concept, not a law violation").
  So this is an owner-gated design change, not a bug fix. **Do not land it
  silently.**

## THE ELEVEN CONVICTING MUTATIONS — ALL RED
M1 unanchor `den` · M2 drop a registry row · M3 orphan registry row · M4
non-canonical category · M5 interpolated generator name · M6 industrial→craft
only · M7 civic loses the noble fallback · M8 revert route (iii) to folded · M9
Wealthy Residential→residential · M10 registry ignored by inferCategory · M11
walker parser matches nothing. Each applied, run, reverted byte-identical.
⚠ **TWO WERE VACUOUS ON THE FIRST PASS and were REBUILT** — this is the finding
that justifies the discipline:
- **M1 did not red.** The `den` pin used the DECLARED name "Common Residential",
  so the registry short-circuited the very regex it meant to test. Rebuilt to use
  an UNDECLARED name carrying the same description.
- **M8 did not red.** The route-(iii) pin asserted only `not.toBeNull()`, which
  BOTH routes satisfy (the folded path falls through to `government`). Rebuilt to
  pin the faction IDENTITY against a deliberately HIGHER-POWER council, so the
  folded path returns the council and the canonical path returns the house.

## JUDGMENT CALLS (all vetoable)
1. **Walker lives in `tests/domain/districtProfile.test.js`, not a new
   `tests/lint/*.walker.test.js`.** Convention says the latter, but a NEW TEST
   FILE reds THREE ratchets (two censuses + mutationCoverageManifest E-A
   TOTALITY). Enforcement is identical either way. **Veto me and I will move it**
   — the cost is re-banking three baselines.
2. **`CATEGORY_TO_ARCHETYPE` reshaped from string to preference LIST.** Module-
   private (only lines 132/153 used it), so no consumer breaks. ⚠ There is a
   SEPARATE `CATEGORY_TO_ARCHETYPE` in `npcProfile.js:36` — **CH-7's, untouched.**
3. **The reported `dominantFaction.archetype` is now the CANONICAL one.** Beyond
   the literal brief, but leaving it prints "<noble house> (government)" to the
   user. Only consumer is `explanation.js:1073` prose; the two existing test
   assertions ('religious','merchant') are identical in both vocabularies.
4. **`residential`/`other` keep an EMPTY preference list** (no fabrication),
   accepting the 168 earned removals rather than inventing a ward's overlord.
5. **Did not touch the fabric DEPOSIT side** despite measuring a −295 join
   regression. Out of scope; disclosed instead.
6. **Pinned WIP, not holding**, because the full gate never ran.

---

# ⭐ RESUME POINT — works cold, on another machine, with no memory of this session

**STATE:** tip `f3d02f62c4ba8f331747ad343d816e51fae6745b`, pinned
`refs/preserve/wip-ch4`, parent = slot `c3289244d58b7259205d80594856e8e0cc520817`.
The CODE IS COMPLETE and the focused suite is GREEN AT THE TIP (33/33, exit 0).
The map golden family is GREEN (16/16) but is BLIND to the registry — do not
count it as evidence.

**WHAT IS DONE:** all five measurement items executed (deletions −287 shipped /
−123 fixed; the five §4.1 figures; the fabric join −295; the 14-row registry);
the edit; the walker; 11 convicting mutations all red; the declared-shift figures.

**WHAT IS NOT DONE — the ONLY outstanding item:**
`npm run check:tail` has NEVER been run. Everything else is proved.

**EXACT NEXT COMMAND** (fresh shell, BARE — never wrap check* in gate-mutex, it
self-deadlocks and exit 3 is the mutex giving up, not a red):

    cd <worktree-at-f3d02f62c> && npm run check:tail ; echo TRUE_EXIT=$?

GREEN requires ALL THREE: `TRUE_EXIT=0` AND `[gate-tail] exit: 0` AND free disk
>= 300 MB at the end. If the worktree is gone, rebuild it:

    git worktree add <dir> f3d02f62c4ba8f331747ad343d816e51fae6745b
    cd <dir> && npm ci --no-audit --no-fund      # NEVER symlink node_modules

**THEN:** carry the census delta (**files +0, titles +16, suiteTitles +3**),
re-derive the packet surface (**179**) BY EXECUTION and stamp both places, mint
the packet LAST and ALONE, and re-pin at `refs/preserve/holding-ch4` once green.
Re-read the slot at every proof boundary — it can move after a census is walked.

**IF THE GATE REDS:** the highest-risk surfaces are (a) any test asserting a
district `category` for one of the 5 corrected quarters, (b) any consumer
asserting the folded `dominantFaction.archetype`, (c) `tests/lint` naked-claim /
prose-numerics baselines if any doc claim moved (no docs were written by CH-4).

**DO NOT RE-LITIGATE (ruled, ODQ §555):** Shape D adopted · route (iii) · keep
`declared ?? inferred` · keep `Wealthy Residential → noble` · registry AFTER
line 117 · prove against the DERIVED ARTEFACT, never a settlement-record hash.
