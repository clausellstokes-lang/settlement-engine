# CENSUS-2 — the summary surfaces declared (lane record, 2026-11-04)

> A build seat's record for the chair. Branch `lane/census-2-2026-11-04`, cut from `lane/census-1-2026-11-04` at `ee3b9c7660a33ef8c0296630b689da7987d8e5c4`. Transport push only; no pull request.
>
> **Where this seat stopped.** Phase A (the ledger) and the Daily Life offer line are committed and pushed. **Phase B is not applied**: `lane/census-1b-2026-11-04` had not been pushed at any boundary of this lane (checked with `git ls-remote` at every unit), so the vocabulary module, the declaration schema and `drawDeclared` do not exist to apply the ledger into. The window branch `lane/window-rung2-2026-11-04` had nothing new beyond this base (an ancestor; no merge needed). The next seat starts at Phase B, item 1 below.

## Phase A — the ledger

`docs/census/declarations/` holds 52 ledger files and `RULES.md`, which fixes the row shape and the atom table. Each atom in that table is bound to its getter in `src/domain/facts/factsOf.js`.

| surface | files | pools (sub-pools as keyed) | lines read | lines declaring | colour pools | crisis-scoped pools | lines with a `stop` | twins (new) |
|---|---|---|---|---|---|---|---|---|
| DS-GEN, DS-HK, DS-STR, DS-CND | 21 | 218 | 772 | 408 | 98 | 86 | 82 | 4 |
| Overview / Tonight, off-census | 21 | 326 | 881 | 523 | 30 | 167 | 186 | 14 |
| crisis-hook pools | 4 | 31 | 175 | 81 | 9 | 5 | 56 | 12 |
| Daily Life | 3 | 104 | 209 | 110 | 8 | 16 | 133 | 7 |
| decree, causal, connectives | 3 | 116 | 576 | 114 | 52 | 10 | 69 | 1 |
| **total** | **52** | **795** | **2,613** | **1,236** | **197** | **284** | **526** | **38** |

"Declaring" means the line carries a `needs` or `excludes` atom, or a `crisis` field in an opted pool.

**Verification.** A validator imports `factsOf`, `INSTITUTION_KINDS`, `CRISIS_KINDS`, `CRISIS_FAMILIES`, `RULER_KINDS`, `WAR_STATES` and `POPULATION_BANDS`. It refuses any atom with no getter or an unknown value. For the DS blocks it also checks that every vid of the projected leaf is present with its text verbatim. **Atoms with no reader: 0.** Errors: 0. The presumptions that have no reader are recorded under `stop` and are not declared. The leading ones, by entry: season 52 · soldiers / commander 60 · food sources 43 · trade-route kind 32 · tier 21 · priest / faith 21 · war state (join-guaranteed) 20 · prosperity 19 · culture 19 · guard presence 24 · crime structure 15 · imports / exports 14 · safety label 8.

**The inventory's counts, as read.**
- **Decree pools:** 34 sub-pools and 96 variants, not 69 and 194. `DECREE_PROSE_BLOCKS` re-exports the seven named pools, so the inventory counted them twice.
- **DS desks:** 772 lines on 218 census rows, not 753 (the census rows carry 772 variants).
- **Off-census Overview:** 881 lines, because the T tables are split one pool per key.
- **Daily Life:** 209 lines. The offer line's eight subset variants are written out twice, once per wording.

### The chair's rulings this lane made (recorded, vetoable)

- **R-S1, the crisis field's semantics.** RULES.md fixes how this ledger reads the crisis field.
  - `crisis: [values]` means "presumes one of these is on". It is a disjunction over the record's active kinds and families.
  - `"any"` is sayable in every condition.
  - `"calm"`, or silence in a scoped pool, is sayable with no crisis only.
  - A line that is calm about ONE family declares `"any"` plus `excludes: ["crisis: <family>"]`.
  - The design §3.2 leaves the multi-crisis case open. A conjunctive reading would make every crisis-keyed pool undrawable under a second crisis, which is why this one was chosen. **`drawDeclared` (CENSUS-1b) must implement this reading, or the ledger's crisis column is re-cut.** This is open question 1.
- **R-S2, the opt-in test.** A pool opts in when it renders under a crisis AND one of its lines asserts calm, plenty, safety, normality or the absence of a pressure. **DS-STR: 40 of 49 pools opted in.** The 9 left out are LIFECYCLE and COUNTERFORCE, whose lines speak only of their own stressor. **DS-GEN: 35 of 140 opted in**, which is fewer than the brief expected. These went in: GEN-1 ×8, GEN-3 ×17, GEN-7 ×5, GEN-11, GEN-13 ×2, GEN-15 and GEN-16. The history, fabric, morphology, conflict and chapter-opener pools assert no calm. DS-GEN-5 never renders under a crisis, because its key function returns nothing when a crisis is on. Opting a pool that asserts no calm would only thin it.
- **R-C1, war state in the causal register.** 20 lines were moved from `war:` atoms to `stop`. The join already proves the war between the two towns. On a lone record `warStateOf` answers `peace`, so 15 lines would have been refused everywhere.
- **R-D1, no `needsAny`.** "Guards" lines (watch, garrison or militia) are a `stop`. §1's "guard presence" row has no reader, and §3.2 forbids a disjunction across dimensions. 7 lines here; the arrival seat had already filed 17 the same way.
- **R-D2, no twin for a slot that renders on no page.** `TERRAIN_CONTEXT`, `ROUTE_CONTEXT` and `DEFENSE_CONTEXT` (`dailyLifeLogic.js`), and the `culturalIdentity` text fields, have no reader in `src`. Their lines are declared and their 36 drafted twins are dropped (kept under `droppedTwins`). One further twin was dropped as below the empty-slot bar: `ARRIVAL_SENSES.bread.dominant`.
- **R-D3, the Daily Life offer line (R10).** It is a composed line; each named item carries its atom. It is landed in unit 2.

### The twins and fallbacks written (ruling 9: each is the chair's ruling, with its golden-moving share)

How a twin moves births depends on the draw kind:
- **K pools (hash argmax):** an appended twin moves about 1/(n+1) of the births where it is eligible.
- **R, T and A sites:** the twin is resolved only after the drawn line is refused. So it moves only refused births, and those births move under the gate anyway.

**None of these is applied yet (Phase B).** Two further twins in `CRISIS_CAST_REASONS` are F10's existing lines (`defenceTwinLines.js`), dissolved into the column, and move nothing.

| pool | kind | n | twin | atoms | share |
|---|---|---|---|---|---|
| DS-GEN-3 :: safetyLabel {Secure, Controlled, Quarantined} | K | 3 | Movement in {settlement} is watched and limited, and the quiet in its streets is a kept quiet rather than a natural one. | crisis [occupied, plague_onset] | ≈1/4 of eligible |
| DS-GEN-13 :: NO-MARKET | K | 2 | No market or fair stands in {settlement}: what trade the town does is done house to house and on the road. | — | ≈1/3 of eligible |
| DS-CND-1 :: ARCHETYPE: flourishing | K | 3 | The good stretch {settlement} was having has not ended, but it is being spent now on the trouble in front of it. | crisis [hunger, threat, unrest, indebted, plague_onset] | ≈1/4 of eligible |
| DS-CND-1 :: FAMILY: recovery | K | 3 | {settlement} is recovering from one trouble while it carries another, and the repair goes slower for it. | crisis [crisis] | ≈1/4 of eligible |
| DOSSIER_CAUSAL_PROSE :: JF-CPL-8a | K | 6 | {band} have walked to {settlement} {timeband_since}; the town took in what it had room for and turned the rest back at the gate, each with the reason written down and given to them. | +gate | ≈1/7 of eligible |
| PRESSURE_SENTENCES :: wartime (winning) | R | 3 | ${name} is at war and, for now, on the right side of it. Contracts are flowing and coin moves fast. The men who left to fight have not come back, and the question is whether the war ends before the accounts do. | crisis [wartime] | refused births only |
| STRESS_NARRATIVE_RENDERERS :: plague_onset | T | 1 | Something is spreading in ${name}. It is not yet a plague, but it will be if nothing changes. The sick outnumber those who can tend them. The origin is disputed. Quarantine measures are being resisted. | crisis [plague_onset] | refused births only |
| STRESS_TYPE_MAP :: plague_onset.crisisHook | T | 1 | The first person to name the outbreak has gone quiet. Their last message suggested the disease is not natural. Reaching them means crossing a quarantine that is not being enforced consistently. | crisis [plague_onset] | refused births only |
| STRESS_TYPE_MAP :: plague_onset.viabilityNote | T | 1 | Travel is being discouraged. Some supply chains are disrupted. | crisis [plague_onset] | refused births only |
| STRESS_TYPE_MAP :: religious_conversion.viabilityNote | T | 1 | Tithing income splits or redirects. Properties of the old institution are in legal ambiguity. | +institution: temple | refused births only |
| STRESSOR_SPINE_PHRASES :: under_siege.fear | T | 1 | the stores running out before any relief arrives | crisis [under_siege] | refused births only |
| STRESSOR_SPINE_PHRASES :: politically_fractured.strain | T | 1 | factions that each hold part of the place and will not yield | crisis [politically_fractured] | refused births only |
| CONDITION_ARCHETYPE_TEMPLATES :: army_deployed | T | 1 | The settlement's standing army is committed abroad, leaving the home defence thin. | — | refused births only |
| SPATIAL_TEXT :: LAYOUT_BY_TIER.city | T | 8 | City spreading out from its old core, suburbs along every road | −walls | refused births only |
| SPATIAL_TEXT :: LAYOUT_BY_TIER.village | T | 16 | Close-built stone houses below the ridge, a single path climbing in | −gate | refused births only |
| SPATIAL_TEXT :: TRADE_ACCESS_BY_ROUTE (crossroads / river / road / isolated) | T | 1 each | Major crossroads (several roads meet here) · River access (a landing on the bank) · Single main road · Isolated (a poor road in and out) | −gate (river: +river) | refused births only |
| CRISIS_CAST_REASONS :: bruntBase | T | 12 | its houses are where the crisis is felt first · the shortage falls first on its people | see ledger | refused births only |
| CRISIS_CAST_REASONS :: CAST_ABSENCES | T | 13 | no one on the roster leads the defence | — | refused births only |
| HOOK_ESCALATION (A lists, 9 lines) | A | 3–6 | Public legitimacy erodes as the seat fails to stabilize supply. · Subsidize the chain through charity or the seat's intervention. · Confront the external force directly, by arms or by talks. · Households begin pooling what food they have. · Those who hold the stores start sleeping beside them. · A crowd gathers where the food is handed out, and it turns ugly. · {controller} makes an example of one smuggler; the rest shift routes. · People grumble openly wherever they gather. · Tax collection slows; orders go unheeded. | see ledger | refused births only |
| DAILY_LIFE_TAB :: localNarrative (food ×3, order, anchors, paragraphs ×2) | T | 1–5 | food is short for most families, and prices are watched closely · the food supply holds for now, and nobody takes it for granted · stores and kitchen gardens give the place a little breathing room · people still move after dusk, though fewer of them and never alone · the wells, the lanes, and the common ground · (paragraphs [1] and [2], see ledger) | see ledger | refused births only (the local narrative prints after the DM's click) |

### Against `docs/POOL_WRITING_PROCEDURE.md` (merged at `0072e93`, the chair's 23:05 addition)

Every twin in the table above was re-read against the procedure's §3 register and its §8 checklist.
- **§3, the register.** Each twin is concrete and short, and holds nothing the record lacks.
  - The K twins write "town"; the kernel speaks the tier noun at render time.
  - No twin prints rule, validator or legend text.
  - No twin presumes a season.
- **§8, item 5.** Each twin is quoted above with its share.
- **§8, items 6–8.** These are Phase B: projection, `--check`, the census re-take, the red-first pool test on named seeds, and the 60/1,000 with `cert:false-presumption`.

**Where the procedure differs from the design or the brief (the design wins, so the ledger follows the design):**
1. **Atoms without a home.** §2 lists these as vocabulary atoms: soldiers, temple, priest, trade route kind, tier, faith presence, criminal structure, food sources, imports / exports and culture. None of them has a getter in `factsOf` at `ee3b9c7`. The brief makes a declaration against anything else a STOP, so they stay under `stop`. `temple` is declared as `institution: temple`, which `hasInstitution` reads.
2. **When to write a twin.** §3 asks for a twin "beside every line that needs a fact most places lack". The brief (item 3) and design §4.4 ask for one only where the gate would leave the slot EMPTY for most births. This lane follows the brief. A pool that keeps a drawable line for most births got no twin, because each twin moves births.
3. **The twin share.** §3 gives 1/(n+1) for every twin. Design §3.3 gives that share for K pools only; at R, H and T sites the twin resolves after the draw, so it moves refused births only. The table above follows §3.3.
4. **The crisis words.** §1.3 lists the crisis words as `threat | hunger | succession | unrest | any`. In this ledger `any` means "sayable in every condition" (design §3.2). "Any active crisis" uses F12's fifth family key, `crisis`, because `crisisOf().has('crisis')` reads it.

## Unit 2 — the Daily Life offer line (applied)

`dailyLifeOfferLine(record, enabled)` (`src/components/new/dailyLifeLogic.js`) names the market (`factsOf.market`), the tavern (`hasInstitution('tavern')`) and the watch (`defence.watch`), each only when present. With none of the three it reads "Ordinary life here in prose." With all three it is the old wording byte for byte.
- **Red-first:** `tests/components/dailyLifeOffer.test.js`, 5/5 red at `2c14281`, green at `6ec15e4`.
- **What moved:** display only, so 0 golden records. Daily Life pages moved on every birth lacking any of the three.

## Measurements (base `ee3b9c7` vs lane tip, `soak-review.mjs --workers 4`)

| run | `reader:daily-life-placeholder` | every other class | `coh:*` | `cert:false-presumption` · `declared-share` |
|---|---|---|---|---|
| 60 | 30 → **0** | identical | 0 → 0 | do not exist yet (CENSUS-1b's wave 1) |
| 1,000 | 495 → **0** | identical (1,676 → 1,181 findings; 0 errors; CLIMB → CLIMB) | none on either side | do not exist yet |

The soak harness writes no certification field, so "certification 1,000/1,000" cannot be read from it at this base (CENSUS-1 reported none either).

## Rows moved, by cause (never re-recorded)

- **Unit 1 (ledger, docs only):** 0 golden rows, 0 manifest rows, 0 census rows (`gen:dossier-prose --check` green), 0 pins.
- **Unit 2 (Daily Life):** 0 golden records, 0 manifest rows, 0 census rows (components are not stamped), 0 pins. Pages: the Daily Life offer line on each birth lacking a market, tavern or watch. `tests/domain/coherence/readerBattery.test.js` still passes: its fixture carries the full line, which stays byte-identical.

## Phase B — where the next seat starts

1. `git fetch origin lane/census-1b-2026-11-04`, then merge it once the vocabulary module is on it. Map RULES.md's atom spellings onto `factVocabulary.js`'s words (a rename table, if they differ), and confirm R-S1 against `drawDeclared`'s crisis rule.
2. Apply the DS ledgers into the annex tag slot (`[angle · atom · atom]`), the pool-level atoms on the headings, and `{crisis-scoped}` / `{colour}`. Re-take the census through `npm run gen:dossier-prose` in the same commit (ruling 10). Then the off-census tables get the sibling column, and the registries get the `tags` field.
3. Wire the twins above, one commit per surface, each counted by its share. Then run the 60 and the 1,000. The bars: `coh:crisis-blind-prose` 0, `reader:hook-pools` 0 on these pools, `cert:false-presumption` 0, and `declared-share` ≥ 0.95.

## Reds owed elsewhere (present at the base, not this lane's)

These are identical at `ee3b9c7`:
- `tests/components/tabSentencesOnce.test.jsx`
- `tests/lint/observedShapeReaders.walker.test.js` (6)
- `tests/lint/proseNumerics.test.js` (3)
- `tests/lint/styleShorthandLonghand.walker.test.js`
- `typecheck:domain`: 167 errors at the base, 167 on the lane.
