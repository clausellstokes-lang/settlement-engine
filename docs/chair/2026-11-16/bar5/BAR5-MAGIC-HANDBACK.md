# BAR5-MAGIC · hand-back (LAW 1 rule 1a: one reading of how far the town relies on magic)

**Base.** `lane/join-2026-11-14` at `600b7683a`. Both audit branches merged first (`--no-ff`, documents and helpers only):
`lane/bar5-audit-a-2026-11-16` at `c0ea05497`, then `lane/bar5-audit-b-2026-11-16` at `d40d6ab28`.
**Branch.** `lane/bar5-magic-2026-11-16`. **Brief.** BRIEF-BAR5, section BAR5-MAGIC (with BRIEF-BAR2, BRIEF-BAR3's
amendments and BRIEF-BAR4's Amendment K, measure rules and amendments, as BRIEF-BAR5 reads them).

## THE RULES

| | rule 1a · a sentence about reliance against the word the page prints |
|---|---|
| **the two readings** | the RECORD's: `src/domain/magicReliance.js :: deriveMagicReliance` (stored by `defenseGenerator.js` as `defenseProfile.magicDependency`). The PAGE's: `src/domain/display/magicProvisionShown.js :: relianceReadingShown` (via `dossierViewModel.js :: deriveMagicRelianceView`), never above what the page shows magic doing. The word and the role lines read the page's; the DS-DEF-9 desk (`defenseStateProse.js :: reliesOnMagic`, and `noMagicHere`) re-derived the record's, and the two narrative lines of `narrativeText.js :: POLITICAL_FLAVOR.magical_heavy` read only that magic works (`needs: ['magic']`). |
| **the one fact made** | `magicProvisionShown.js :: relianceShownOf(record)`: the reading the page prints, in the leaf that already held it. The desk's key reads it (`reliesOnMagic`, `noMagicHere`). A new atom beside its family, `magic reliance` (band: none · present · relied-upon · integral; home `factsOf(record).magicRelianceShown`, the same reader; layer 4). |
| **what the one change cured** | the desk's key alone: every desk instance: 22 of the 23 towns in the 720 (22 of 23 distinct lines), 8 of the 9 in the fresh 300, 3 of the 5 in the sixty. |
| **cured line by line** | (1) "The settlement relies on arcane workings it does not entirely trust …" and "… made it both more dependent on arcane resources …" declare `magic reliance: ≥ relied-upon` (1 town in the 720, 1 in the 300, 2 in the sixty). (2) THE INHERITOR READ (BRIEF-BAR2 E): the pool-mate "The magic-workers here are respected, consulted and watched …" inherited two of those towns under "Reliance on magic: None" (no practitioner): it declares `magic reliance: ≥ present` (it printed under None in no town at base). (3) THE ROLE ROW: "Economic role: integral" and "Infrastructure role: integral" printed under "Reliance on magic: Present" (r2s-religious_conversion-city-3, 1 town of 1,080, a split already on the base page; the cure replaced the line that agreed with the role by one that agrees with the word): `magicRoleBandShown` prints "common" for "integral" under a reliance word below Relied upon. |
| **instances · towns BEFORE** (600b7683a) | sixty 7 · 5 (4 distinct) · the 720 24 · 23 (23 distinct) · the fresh 300 10 · 9 (9 distinct): the audit's count to the row. |
| **instances · towns AFTER** (tip) | sixty 0 · the 720 0 · the fresh 300 0. No other count of audit A's runner moves in any population. |
| **named exclusions** | none. |
| **the detector, widened (L3)** | `tests/helpers/pageLaws/law1.mjs :: MAGIC_DEPENDS` gains the three sibling lines of the same DS-DEF-9 pool (`magicDependency true` v1–v3: "relies on help beyond ordinary work", "has come to lean on it …", "leans on the people who give it help …"), which make the same claim and were not read. Effect on the counts at base: 0 (none printed under None or Present); on the controls: every STANDS control still found (5/5), no EXPLAINED one (0/2). |
| **the guard and its positive control** | `tests/domain/bar5MagicReliance.test.js`: the audit's own `law1a` over the 720 and the sixty, each town born, its page word, its DS-DEF-9 desk (owner's and player's) and its historical character: ZERO (the totality helper). Plant (the desk back on the record's reading, not committed): red, 29 of 780. Positive controls: the read's rows C9617, C33713, C43125 (desk), C17061, C29831 (narrative) as constructed pages, each must fire; every line of the two "true" pools is read by the detector; the atom's ladder equals the reading's; the role row's clamp. Green, 75 s. |
| **LAW 5, my files** | before 0, after 0 (`law5-inventory.mjs` at base and tip: 244 rows, 207 undeclared, none in my five files or in DS-DEF-9; the inventory's three defence-annex rows are DS-DEF-1 and DS-DEF-8, BAR5-SAFETY's). |

## What moves

- **Pages** (base → tip, every dossier line): 5 of the sixty, 9 of the 300, 27 of the 720 (the 23, and the four Present towns whose desk asserted a dependence the audit had spared because a role row read common or integral). Only lines of the Magic tab and the historical character (Overview, History) move: 47 lines out, 47 in.
- **The record**: one field, `history.historicalCharacter`, in 2 of the sixty, 1 of the 300, 1 of the 720 (the narrative draw is resolved after the roll, so no other draw moves). No new field on the saved record; `assembleSettlement.js` untouched; the stored `defenseProfile.magicDependency` untouched.
- **The reference** (BRIEF-BAR5 amendment 3): **0 of the 525** configurations move against 600b7683a (every record hashed at base and at tip).
- **The annex**: no DS-DEF-9 line changed, so the annex and the defence leaf are untouched (nothing for BAR5-SAFETY to take turns over).

## The veto list (every new or changed line, three towns it is read in)

No line is new or reworded. What the owner may veto:

1. **The rule**: every sentence about reliance reads the word the page prints (`relianceShownOf`), not the record's reading.
2. **New vocabulary**: the `magic reliance` atom (BRIEF-BAR4 amendment 5b). Declared on three lines of `POLITICAL_FLAVOR.magical_heavy`.
3. **The role row's clamp**: "integral" prints "common" under None or Present (1 town: r2s-religious_conversion-city-3).
4. **The inheritors** (existing lines, now drawn where the old ones were):
   - "The {tier} would go on as it is if the arcane went away; nothing it lives by waits on a spell." (13 towns): bar0-village-calm-rand-130 (village), r2r-metropolis-29 (metropolis), bar0-city-wartime-rand-24 (war).
   - "Nothing structural at {settlement} depends on arcane work. What the {tier} makes it makes with hands and ground, …" (12): bar0-village-famine-rand-25 (famine), bar0-metropolis-calm-rand-102 (metropolis), r2s-monster_pressure-village-2 (Present).
   - "Whatever magic reaches {settlement}, the {tier} does not rest on it: nothing it lives by would stop without it." (12): r2r-town-14 (town), r2r-metropolis-28 (metropolis), bar0-city-wartime-rand-110 (war).
   - the narrative pool's colour lines (4 towns): bar0-thorp-calm-rand-24 and bar0-thorp-calm-rand-116 ("… treats arcane matters with more caution …"), bar0-hamlet-under_siege-rand-24 (siege; "… is still discussed here, carefully …"), r2s-religious_conversion-town-2 ("There are places … that people simply do not go …").

## The stored flag's two other readers (said, not changed)

- `src/components/new/dailyLifeLogic.js` (BAR5-WORLD's file) reads `dp.magicDependency` into `ctx.magicDep`, and **nothing reads `ctx.magicDep`**: it prints nothing. Its successor, if one is wanted, is `relianceShownOf(settlement)`.
- `src/domain/worldPulse/stressorGates.js :: magicDependenceSignals` reads the stored flag into the signal "the defenses lean on magic", which gates the deadzone stressor. That is a simulation gate, not a page line; reading the page's word there would move a simulation. Left as is.

## The books my cures move

THE NET (BRIEF-BAR4 amendment 2 and BRIEF-BAR3 amendment 2, with the four BRIEF-BAR5 adds, the three test-corpus walkers and every test that names a symbol I changed): 60 files and my guard, each run alone through `scripts/gate-tail.sh`, at 600b7683a and at the tip; then `npm run build` and `npm run verify:dist` at both (build output removed after).

**Red at both with the same failing arms and the same message, byte for byte (the base's: NAMED, not chased):**
`tests/data/tailHouses1Gaps.test.js` (1 arm), `tests/generators/generationForkCensus.test.js` (3), `tests/generators/pipelinePinnedMode.test.js` (3), `tests/generators/tieProseDeclared.test.js` (2), `tests/lint/observedShapeReaders.walker.test.js` (4), `tests/lint/presumedThings.walker.test.js` (1), `tests/lint/proseCorpusBytes.test.js` (2), `tests/lint/proseTasteCorruption.walker.test.js` (1), `tests/lint/proseWiringCensus.walker.test.js` (12), `tests/lint/tuningRegister.walker.test.js` (1), `tests/lint/writerReach.walker.test.js` (6). Every other file of the net is green at the tip.

**Red at the tip only, cured by its own form:** `tests/lint/factLayers.walker.test.js` READERS (the register banks reader lines by their text; my three declared lines of `narrativeText.js :: POLITICAL_FLAVOR.magical_heavy` changed text). The three rows are RE-KEYED BY IDENTITY (dated 2026-11-16, in this commit's message): each row's line is the same line with its declaration, its reason unchanged, the register's total unchanged (the form of cb17872ed). Green after.

**`tests/domain/defenseStateProseDesk.test.js`** (green at both): its "REACHABILITY" arm asserted the old contract (a stored flag true draws the desk's true pool). Re-aimed with a dated note: the sweep counts a world as dependent where the page's word is (`relianceShownOf`); its assertions unchanged.

**Strict dist (`verify:dist`): refused at both on the same five build files and the same rows** (`engineBundleReplay`, `engineServiceCore`, `engineServiceStoreParity`, `generationWorkerLazy`, `vendorPdfLazy`: the stale edge bundle, the size ceilings and the goods roster, all of amendment 1's list). Figures my cure moves under those same arms:

| test · arm | 600b7683a | tip | door |
|---|---|---|---|
| `engineServiceStoreParity` · fence settlements differing bundle vs in-process | 248 of 360 | 250 of 360 | the edge bundle (`npm run build:edge-shared`), the close's |
| `generationWorkerLazy` · the worker bundle | 2,356,121 B | 2,358,573 B (+2,452) | the size ceiling, the close's |
| `vendorPdfLazy` · Tier 9.7, the engine chunk | 881,330 | 881,427 (+97) | the size ceiling, the close's |
| first-paint static closure | 1,139,072 B | 1,139,225 B (+153) | the size ceiling, the close's |
| first-paint gzip | 362,611 B | 362,685 B (+74) | the same |
| first-paint Brotli | 304,357 B | 304,483 B (+126) | the same |

No other stored figure moves: no golden row (0 of 525), no register row but the three re-keyed, no census.

## Registrations owed

- None under `tests/generators` (the guard is `tests/domain/`): no mutation-manifest entry owed.
- No new goods import (no goods-roster row owed). The new import `factsOf.js → display/magicProvisionShown.js` is checked by `engineCoreLazyEdge` (see the net).

## What is left, in order

1. Nothing of rule 1a in the three populations.
2. The audit's `1a-denies/house` ("No arcane practitioners" beside an arcane house): 0 at base and at tip; the line is `defenseDisplay.js`'s (not mine).
3. If the owner wants the stored flag to be the page's word, that is a record move (the defence generator's `magicDependency`): not taken; the page reads the word, the record keeps its reading.

## How the instruments are re-made

- Render: PAGE-COPY (`lane/chair-2026-11-08 :: docs/chair/2026-11-16/probes/PAGE-COPY`), `HOLDERS=<PC>/holders.tipA.json sh <PC>/census3.sh <tree> <out> 4 --seeds <seeds> --count-only`; the sixty are the ten shapes of `seeds.bar0.txt` at rand-21..26; the 300 are `READ-ALL/packets11/seeds.fresh300.txt`; the 720 are PAGE-COPY's `seeds.txt`.
- Count: `node docs/chair/2026-11-16/bar5/AUDIT/run-a.mjs <render> <out.json> [SECOND-CHECK.final72.json SECOND-CHECK.final75.json]`.

## FOR THE OWNER, IN PLAIN WORDS

The Magic tab said "Reliance on magic: None" and then, two lines down, that the town's work "holds up only with help beyond ordinary labour". The two sentences came from two different calculations of the same thing. Now there is one: every sentence about how far a town relies on magic follows the word the page prints. Forty-one of 1,080 towns read differently: on the Magic tab, and in a few towns the one-line historical character. In all of them the old sentence claimed more than the page's own word. Nothing else on any page changed, and none of the 525 reference towns changed.
