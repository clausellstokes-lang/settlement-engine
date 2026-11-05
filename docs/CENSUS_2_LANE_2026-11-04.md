# CENSUS-2 — the summary surfaces declared (lane record, 2026-11-04)

> A build seat's record for the chair. Branch `lane/census-2-2026-11-04`, cut from `lane/census-1-2026-11-04` at `ee3b9c7660a33ef8c0296630b689da7987d8e5c4`. Transport push only; no pull request.
>
> **Where Phase A's seat stopped.** Phase A (the ledger) and the Daily Life offer line were committed and pushed; Phase B waited on CENSUS-1b's vocabulary.
>
> **Where Phase B's seat (CENSUS-2b, 2026-11-05) stopped — at the boundary rule, clean and pushed.** Merged CENSUS-1b `358b0a8`, the window `3bc72bc` (the SOP `3b0d87b` was already in). Done: item 1 (the rename table, below), item 2 (all four DS families into the annex), item 3 (the arrival scene's perimeter claim), item 4 for the five ARRIVAL tables, item 5 for the four K-pool twins, item 6 (the 60 and the 1,000). **The next seat starts at item 4's remaining 26 off-census tables** (the list under "Phase B — what is left"), then item 5's R/T/A twins.

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
| 1,000 | 495 → **0** | identical (headline 1,676 → 1,676 findings, 0 errors, CLIMB → CLIMB; the 495 drop is in the per-line class rows of findings.jsonl) | none on either side | do not exist yet |

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

## Phase B (CENSUS-2b, 2026-11-05)

### Item 1 — the rename table, and R-S1 against `crisisAdmits`

| this ledger writes | the vocabulary (`factVocabulary.js`) | where |
|---|---|---|
| `needs: [X]` / `excludes: [X]` | tag slot `X` / `no X`; a table row's `needs` / `excludes` | every line |
| `excludes: ["crisis: <family or kind>"]` | `no crisis: <…>` (tag) · `excludes: ['crisis: <…>']` (row) | every line |
| `crisis: "any"` in a scoped pool | `crisis: any` | lines |
| `crisis: "calm"` in a scoped pool | silence | lines |
| `crisisScoped: true` (a pool not keyed on a crisis) | `{crisis-scoped}` on the pool label (a compact row: on its key) | pools |
| `colour: true` | `{colour}` | pools |
| `poolNeeds` / `poolExcludes` | the brace group (`{market}`, `{no market}`, `{coast}`, `{terrain: forest}`) | pools |
| `population: >= middling` | `population: ≥ middling` | |
| pool-level `deficit` / `no deficit` (DS-GEN-3's food rows) | `starving` / `no starving` (`deficit` is the kernel's demoted state word, not an atom; LINES keep the kernel's own `deficit` mark) | |
| `crisis: ["crisis"]` (needs some crisis) | the kernel mark `crisis` (F12's crisis dimension), plus `crisis: any` in a scoped pool | DS-CND-1's recovery twin |
| `other-npc` | `other npc` | (no DS line) |
| `guards` (R-D1's stop) | `guardPresence` now has a home (the rulings §3) — the stop lines are the next seat's to declare | |

**R-S1 is NOT what `crisisAdmits` implements.** R-S1 read `crisis: [values]` as "presumes one of these is on" (a disjunction over the active kinds). `crisisAdmits` implements the rulings' CONJUNCTION: a line is admissible only if, for EVERY active kind, the kind or its family is listed. The rulings say "R-S1 is confirmed"; it is not — the two readings differ whenever a second crisis is active. The vocabulary governs, and this lane followed it. Consequence, ruled below: a pool keyed on a crisis must not re-declare its key.

### The chair's rulings this seat made (vetoable)

- **R-B1, a keyed pool does not re-declare its key.** A pool whose key guarantees a crisis (DS-STR's banners and synergy pools, DS-GEN-7's two) carries no pool-level `crisis:` atom and is not `{crisis-scoped}`: under the conjunction a declared `crisis: under_siege` refuses the UNDER SIEGE banner whenever a famine is also on. Its lines keep their own `no crisis: <family>` denials. **41 of the ledger's 86 opt-ins were keyed and are dropped by this ruling; 45 pools are opted in** (DS-GEN 33, DS-HK 6, DS-STR 1, DS-CND 5).
- **R-B2, a narrower crisis presumption inside a keyed pool cannot be said.** DS-STR-2 ORIGIN: resistance vid 2 and 3 ("answers a foreign garrison") presume occupation inside a pool keyed insurgency-or-occupation. The tag slot routes every `crisis:` word to the disjunction; there is no tag spelling of "needs: crisis: occupied". Left undeclared (open question 2).
- **R-B3, brace groups on compact rows.** The projector read a pool brace group on a bold label only; DS-GEN-3/5/6/10's compact rows are pools of their own. The brace now rides a bulleted row's key (`- \`STRONG\` {crisis-scoped} — 1. …`) or follows a bold row's label (`**\`port\`** {coast} — 1. …`), read off before the key is formed (the key is hashed into the draw: byte-identical). **The drop guard had a hole**: it counted compact rows with the same regex the parser used, so a row neither recognised was lost from both counts and the guard passed (DS-GEN-5's 20 lines; caught only because the census fell 709 → 704). The guard now reads the braced form.
- **R-F 3 applied at the arrival scene**: "Pilgrims … queue patiently for their turn at the holy places" declares `excludes: crisis: threat, crisis: unrest` (the line widens; the ledger row carries the note). "Without being stopped, challenged or counted…" and "…how relaxed the people on it are" are DS-DEF lines (`defense.generated.js`): CENSUS-5's.

### Item 2 — the DS pools (applied; one commit per family)

| family | commit | pools | lines | lines gaining atoms | `{crisis-scoped}` | `{colour}` | pages moved (60) | records (60) |
|---|---|---|---|---|---|---|---|---|
| DS-GEN | `db3ed88` | 140 | 463 | 160 | 33 | 73 | **32**: 29 DS-GEN-13 NO-MARKET (trade "at the gate, at the inn": `gate · institution: tavern` refused), 3 DS-GEN-17 GARRISONED vid 2 ("not only in stone": `walls`) | 0 |
| DS-HK | `eb2b16a` | 11 | 45 | 24 | 6 | 4 | 0 (the framing paragraph is cut from the Plot Hooks tab) | 0 |
| DS-STR | `c37c270` | 49 | 204 | 27 | 1 | 9 | 0 | 0 |
| DS-CND | `c85d7ec` | 18 | 55 | 12 | 5 | 12 | 0 | 0 |

Every family: `node scripts/wiring-census.mjs` then `npm run gen:dossier-prose`, both `--check` green, in the same commit; the census rows did not move (709 pools / 2,323 variants) until the twins. The red-first is `tests/domain/facts/census2DeclaredPools.test.js`: the leaves held to the ledger family by family, red after each annex edit and before its projection, plus behaviour rows on the real pools (DS-GEN-13 under a siege; DS-STR-1's "carries no emergency" refused under a siege and drawn in calm; the UNDER SIEGE banner kept under siege + famine).

### Items 3 and 4 — the arrival tables (`077a292`)

`ARRIVAL_SENSES`, `ARRIVAL_PEOPLE`, `ARRIVAL_TENSIONS`, `ARRIVAL_MEMORIES` (`arrivalProse.js`) and `ARRIVAL_SCENES` (`narrativeData.js`): **102 of 240 rows** take the sibling column. Atoms: `crisis: any` 88 (rows of the ledger's scoped pools), `no crisis: <…>` 41 (the commit body's "47" is wrong; 41 is the count read off the tables), market 6, navigable 5, `no starving` 3, institution: mill 3 / temple 1 / smith 1, walls 1, `population: ≥ middling` 1. CENSUS-1c's wiring is on no remote branch (`git ls-remote` at this commit), so under R-C the consumer (`arrivalScene.js`) reads through `src/domain/facts/textOf.js` and the declarations are CARRIED, not enforced: **no birth moves** (0/525 golden records by a scratch sha-256 hasher, 0/60 soak records and pages). The ledger's scoped arrival pools (2 + 7 + 12 + 1 + 3 = 25) need the pool flag when 1c wires the site; the rows already carry `crisis: any` where they are sayable under a crisis.

### Item 5 — the twins written (`70d05b2`; each the chair's ruling, R-G)

| pool | kind | n | twin | atoms | share |
|---|---|---|---|---|---|
| DS-GEN-13 :: NO-MARKET | K | 2 | No market or fair stands in {settlement}: what trade the town does is done house to house and on the road. | — | ≈ 1/3 of eligible; on the 60 it fills exactly the 29 slots unit 2 emptied |
| DS-GEN-3 :: safetyLabel {Secure, Controlled, Quarantined} | K | 3 | Movement in {settlement} is watched and limited, and the quiet in its streets is a kept quiet rather than a natural one. | `crisis: occupied, plague_onset` | ≈ 1/4 |
| DS-CND-1 :: ARCHETYPE: flourishing | K | 3 | The good stretch {settlement} was having has not ended, but it is being spent now on the trouble in front of it. | `crisis: hunger, threat, unrest, indebted, plague_onset` | ≈ 1/4 |
| DS-CND-1 :: FAMILY: recovery | K | 3 | {settlement} is recovering from one trouble while it carries another, and the repair goes slower for it. | kernel `crisis` · `crisis: any` | ≈ 1/4 |

The R / T / A twins of Phase A's table are not written: their consumers are draw sites CENSUS-1c wires, and a twin there resolves only after the drawn line is refused.

### Item 6 — the 60 and the 1,000 (BEFORE = the merged base `d530c02`, AFTER = the tip)

| run | records moved | pages moved | every `coh:*` / `reader:*` / `A-*` class | `coh:crisis-blind-prose` | `cert:false-presumption` | `declared-share` | verdict |
|---|---|---|---|---|---|---|---|
| 60 | 0 / 60 | 32 (DS-GEN-13 → its twin 29, DS-GEN-17 3) | identical (176 findings) | 24 → 24 | 0 → 0 | `{}` → `{}` | STOP → STOP (the base's: crisis-blind in 24) |
| 1,000 | 0 / 1,000 | 27 of the 60 rendered (DS-GEN-13 → its twin 25; DS-GEN-17 2) | identical (2,596 findings; `reader:hook-pools` 113 → 113, `reader:daily-life-placeholder` 0 → 0) | 278 → 278 | 0 → 0 | `{}` → `{}` | STOP → STOP (the base's: crisis-blind 278, `A-12:self-vouch-false` 18) |

**By claim, `coh:crisis-blind-prose` at 1,000:** current stability 119 · nobody stops a stranger 43 · nothing is failing 34 · stable institutional competition 33 · food secure 32 · depends on none alone 22 · competent administration 21 · a year closed ahead 3 · pilgrims queue patiently 3 — all identical before → after. **None of these claims lives in this lane's DS pools**: they are NPC goals (CENSUS-4), DS-DEF / DS-ECO / DS-POW lines (CENSUS-5 / CENSUS-3), the food band, and one arrival line (mine, declared, waiting on 1c's enforcement). So the class did not fall here, and that is the expected reading under R-B, not a cure that failed. `declared-share` stays `{}` because the harness records no display-time K notes yet (CENSUS-1b's ⚠: the render runs in another module instance of the ledger) — the gate is live on the page (the 32 pages are its receipt) but the aggregate cannot see it.

### Rows moved, by cause (never re-recorded)

- **Golden:** 0 of 525 records (records 0/60, 0/1,000; the annex and leaves are display, the arrival rows are read byte-identically).
- **Wiring census:** 4 pool rows' variant counts +1 (the twins; 2,323 → 2,327) and the producer index (textOf.js). No other row.
- **Manifest (`dossier-prose-manifest-golden.json`):** not run by this lane; the DS-GEN-13 / DS-GEN-17 page moves and the twins are the causes it will show.
- **Test pins:** none re-keyed outside this lane's own new file; the arrival suites' renderers read through `textOf` (no expectation changed).

### Gates this lane read (not cured here)

`typecheck:ratchet` 167 / 167 green. `typecheck:domain:strict` is RED at the merged base on four CENSUS-1b files this lane does not touch: `crisisFactFindings.js` +4, `composeStateProse.js` +2, `factVocabulary.js` +42, `presumptionCheck.js` +1. `textOf.js` is strict-clean.

### Phase B — what is left (the next seat starts here)

1. **Item 4, the 26 off-census tables** not yet applied: the Overview / Tonight tables (`CONDITION_ARCHETYPE_TEMPLATES`, `CULTURE_ARCHITECTURAL_DETAILS`, `CHECK_INST_COMPAT_LANDMARKS`, `LINE_ROLE_CLAUSE`, `POLITICAL_FLAVOR`, `PRESSURE_SENTENCES`, `QUICK_GUIDE_CLAUSES`, `SETT_REASON`, `SPATIAL_TEXT`, `STRESSOR_SPINE_PHRASES`, `STRESS_DESCS`, `STRESS_NARRATIVE_RENDERERS`, `STRESS_RUMORS`, `STRESS_TYPE_MAP`, `TERRAIN_SEASON_TEXTURE`, `THORP_PRESSURES`, `ECHO_PREFIXES_DOSSIER`), the crisis-hook pools (`HOOK_ESCALATION`, `HOOK_LINE_POOLS`, `CRISIS_CAST_REASONS` with `tags`), Daily Life (`DAILY_LIFE_TAB`, `DAILY_LIFE_CONTEXT`, `CULTURE_PROFILES_DAILY`) and the kernel family (`DECREE_PROSE`, `DOSSIER_CAUSAL_PROSE`, `DOSSIER_CONNECTIVES`). The tool is this lane's: an AST splice per ledger row (`{ text, needs?, excludes?, crisis? }`), then `textOf` at each R/H/T consumer, unless 1c's wiring has landed (then merge it and let it enforce). ⚠ The causal register has no `vid`, so the kernel reads no fact atoms from it (`variantFactDeclaration`): its declarations need 1c's ruling on how a vid-less family is declared. ⚠ `STRESS_DESCS` is read by the arrival consumer's vignette filter with `line(name)` — wrap it only together with that filter.
2. **Item 5's R / T / A twins** (Phase A's table rows 6–18), after 1c's wiring.
3. **The 24 `guards` stop lines** now declarable as `guardPresence`.

### Open questions for the chair

1. The rulings §1 say R-S1 is confirmed; `crisisAdmits` implements the conjunction R-S1 rejected. Is the conjunction the intended reading (this lane followed it, and R-B1 is its consequence)?
2. Should the tag slot gain a spelling for "needs: crisis: K" (a presence reading of one kind), for DS-STR-2's two resistance lines and lines like them?
3. Should `declared-share` count display-time K draws (the harness's ledger instance), so the aggregate can read the gate this lane turned on?


## Phase B continued (CENSUS-2c, 2026-11-05)

> **Where this seat stopped: at the boundary rule, clean and pushed.** Merged CENSUS-1c `d6f8456be`, CENSUS-5 `40f0490ad` (the wiring census conflict taken from ours and re-taken through its door: 709 pools, 68 blocks / 2,328 variants) and CENSUS-1d's tip `a8a9c0d` (R-H, sites 89 and 90). Done: unit 1 (the stress narrative, three causes, three commits), unit 2 (DS-STR-2), unit 3 for HOOK_ESCALATION and HOOK_LINE_POOLS, unit 5 (the 60 and the 1,000). **CENSUS-2d starts at unit 3's remaining 24 off-census tables** (list below), then unit 4's R/T/A twins.

### Commits

| unit | commit | what |
|---|---|---|
| merges | `1507c4c`, `eda7495` | CENSUS-5; CENSUS-1d (R-H) |
| 1a | `6dda5f7` | the influx food line needs `crisis: hunger`; twin; the instrument's `food secure / migration` row retired (R-P 1) |
| 1b | `a305b0e` | plague's "Healers are overwhelmed." needs `healer`; twin |
| 1c | `501abbf` | religious conversion's two temple wordings need `institution: temple`; a refused pick resolves to wording 2 (no twin) |
| 2 | `f40e0f8`, `143b91a` | DS-STR-2 ORIGIN: resistance vid 2 and 3 `crisis: occupied` (R-I); the R-H arm after the merge |
| 3a | `38d1b4c` | HOOK_ESCALATION (kind A, enforced here): sibling sets, refused stages take their twins in place |
| 3b | `08bbe6f` | HOOK_LINE_POOLS (site 90, enforced by 1d's wiring): `guardPresence`, three siege / hunger exclusions, `market` |

### The twins written (each the chair's ruling, R-G; every one is a T or A cell, so it moves only the refused births)

| pool | twin | atom |
|---|---|---|
| STRESS_NARRATIVE · mass_migration | New arrivals come faster than housing and employment can absorb them. | `no crisis: hunger` |
| STRESS_NARRATIVE · plague_onset | The sick outnumber those who can tend them. | `no healer` |
| HOOK_ESCALATION · chain.ifIgnored | Public legitimacy erodes as the seat fails to stabilize supply. | `no ruler: council` |
| HOOK_ESCALATION · external.possibleResolutions | Confront the external force directly, by arms or by talks. | `no magic` |
| HOOK_ESCALATION · bread_riot | Households begin pooling what food they have. · Those who hold the stores start sleeping beside them. · A crowd gathers where the food is handed out, and it turns ugly. | — · — · `no market` |
| HOOK_ESCALATION · smuggling_rise | {controller} makes an example of one smuggler; the rest shift routes. | `no watch` |
| HOOK_ESCALATION · legitimacy_crisis | People grumble openly wherever they gather. · Tax collection slows; orders go unheeded. | `no market` · `no watch` |

Not written: the drafted twin of "Subsidize the chain through temple charity or council intervention." (its original presumes a temple OR a council, a disjunction no line may declare, so it stays undeclared). HOOK_LINE_POOLS' foodGap opt-in is vacuous (every line `crisis: any`): not scoped.

### The 60 and the 1,000 (BEFORE = the merged base: `1507c4c` + 1d's `a8a9c0d`, none of this lane's units; AFTER = the tip)

| run | records moved | `coh:crisis-blind-prose` (seeds) | other classes | `cert:*` | verdict |
|---|---|---|---|---|---|
| 60 | 7 (units 1a 5, 1b 2) | 19 → 18 | identical | none | STOP → STOP (the base's) |
| 1,000 | 127 (fed influx 65, plague with no healer 49, templeless conversion 15; 2 births carry two causes) | 241 → 218 | `A-12:self-vouch-false` 14 → 12; every other class identical; `reader:hook-pools` 109 → 109 (0 of the 112 lines on this lane's pools: 46 guard, 66 sea, all npcData / historyData / foodBalance); `reader:daily-life-placeholder` 0 → 0 | none | STOP → STOP (the base's: crisis-blind, A-12) |

**By claim (1,000):** food secure 32 → **0** (the retired row; R-P 1) · current stability 119 · nothing is failing 34 · stable institutional competition 33 · depends on none alone 22 · competent administration 21 · pilgrims queue patiently 3 · a year closed ahead 3 — unchanged; none of those is this lane's except **pilgrims queue patiently (3)**, whose declaration (2b's) waits on 1d wiring the arrival consumer (Appendix B row 21/22).

**`declared-share` (1,000, from the merged render ledger):** crisis 465/511 (0.91; the 46 are religious conversion's undeclared wording 2 and the stressors with no declared sentence) · tab:dossier 41,089/213,309 (0.193) · plot hooks 6/992 on each of tab / tonight, 24/3,883 pdf, 12/1,899 foundry (0.006: site 90's declared lines only; HOOK_ESCALATION's lists are not a surface the soak renders) · npcs 543/39,351 (0.014) · power, services 1.00. At the base: crisis 301/301, plot hooks 0.

### Rows moved, by cause (never re-recorded)

- **Golden:** 0 / 525 for every unit (the corpus carries no stressor that a declaration refuses; scratch sha-256 over `goldenCorpus`).
- **Soak records:** 127 / 1,000 as above (the stress summary is rendered at assembly and persisted).
- **Pages (60):** HOOK_ESCALATION 35 births (hooks and clocks); HOOK_LINE_POOLS 0; DS-STR-2 0.
- **Wiring census:** 0 rows (the annex edit moved no count). **Manifest:** not run. **Pins:** `crisisBlindWidened.test.js` soak1k-1205 (the retired row); `plotHookTruthGate.test.js` reads the food pool through `textOf`; `census2DeclaredPools.test.js`'s keyed-pool arm reads narrower crisis presumptions.
- **Correction (said out loud):** unit 2's commit body splits the base's 16 reds 7 / 2 / 7; the split is dossierStateProseProjection.contract 9, composeStateProse 5, crisisBlindDossierProse 2.

### Reds at the merged base, unchanged by this lane

dossierStateProseProjection.contract 9 · composeStateProse 5 · crisisBlindDossierProse 2 · generalStateProseDesk 8 · negativeAssertionAnchor 2 · proseCorpusBytes 2 · ruinFilterRoster 2 (factsOf.js, readerBattery.js) · proseWiringCensus 15, heldKeyWriterCensus 1 · tonightSheetOnce, hookThemeDraws (1d names them `d6f8456be`'s) · domain:strict +4 crisisFactFindings.js, +2 composeStateProse.js. typecheck:ratchet 167/167.

### Where CENSUS-2d starts

1. **Unit 3, the 24 tables left.** With declarations to carry: STRESS_DESCS (70), SPATIAL_TEXT (71), CULTURE_PROFILES_DAILY (62), DOSSIER_CAUSAL_PROSE (79 + 34 crisis; vid-less, needs 1d's ruling), PRESSURE_SENTENCES (17 + 71), DAILY_LIFE_TAB (24), DAILY_LIFE_CONTEXT (15), CULTURE_ARCHITECTURAL_DETAILS (13), POLITICAL_FLAVOR (9 + 6), CRISIS_CAST_REASONS (8 + 58, `tags`), QUICK_GUIDE_CLAUSES (7), CONDITION_ARCHETYPE_TEMPLATES (6), CHECK_INST_COMPAT_LANDMARKS (6), STRESS_TYPE_MAP (4 + 41), SETT_REASON (3), STRESSOR_SPINE_PHRASES (2 + 28), THORP_PRESSURES (1), DECREE_PROSE (1), LINE_ROLE_CLAUSE (7 crisis). Nothing to declare (read, colour): STRESS_RUMORS, TERRAIN_SEASON_TEXTURE, ECHO_PREFIXES_DOSSIER, DOSSIER_CONNECTIVES. STRESS_NARRATIVE_RENDERERS is done (unit 1). Fetch census-1b first: an R/H/T table whose site 1d has wired is declared and enforced; otherwise `textOf` at the consumer. ⚠ STRESS_DESCS' entries are template functions read as `line(name)` by `arrivalScene.js` and four test files: wrap them with the vignette filter (`textOf(line)(name)`).
2. The ledger's remaining `guard presence` stops (STRESS_DESCS 15, CULTURE_PROFILES_DAILY 5, DAILY_LIFE_TAB 2) declare `guardPresence` as each table lands.
3. Unit 4's R/T/A twins (Phase A's table rows 6–18) once their sites are wired.
4. The scratch tools this seat used (a sha-256 golden hasher, a 60/1,000 class differ, a record differ) are three short scripts; the next seat rebuilds them in its scratchpad (none is committed: they are not instruments).

### Open questions for the chair

1. wartime's loss wording says "Food prices have doubled." in places whose food record is secure (11 of 22 wartime births on a 300-birth probe); there is no prices atom. Leave it, or declare it `crisis: hunger` (which refuses it in most wartime births and needs a twin)?
2. slave_revolt's summary names "the slave market's holding facilities"; there is no slave-market atom. List it under "needs a home"?
3. plague's healer line declares `healer` alone, so a place with a hospital and no healer gets the twin (true, less specific); a disjunction is unsayable. Accept?

## Phase B continued (CENSUS-2d, 2026-11-05)

> **Where this seat stopped: at the boundary rule, clean and pushed.** Merged census-1b three times (`7dc90a6`; `633f72c` with CENSUS-4b and the R-A lookup — `crisisBlindFindings.js` conflict resolved theirs + this lane's retired-row comment; `e3e43a2` and `f2367a4` with CENSUS-1e units 1–2, 4c, 5b). Done: unit 1 (both answers), unit 3 for **14 of the 24 tables** (one ruled dead, one waiting on facts, one with nothing left under R-B1), order item 3 (the guard / soldiers stops on the landed tables), unit 4's twins **where a site is wired**, unit 5 (the 1,000). **CENSUS-2e starts at the 7 tables left** (below).

### Commits

| unit | commit | what | golden / soak-60 records / pages |
|---|---|---|---|
| merge + census | `1c0e67a`, `21ef3cd`, `08faf71`, `fb14569` | census-1b; the wiring census re-taken through its door (stamp only, 709 pools / 2,328 variants) | — |
| 1 | `6f2435f` | wartime's "Food prices have doubled." `crisis: hunger` + twin; slave-revolt summary reworded (R-U) | 0 / 5 (slave revolt 4, wartime-on-fed 2; soak1k-15 both) / 5 |
| 3 | `69e1b62` | STRESS_DESCS 70 rows (R, textOf; arrival filter `textOf(line)(name)`) | 0 / 0 / 0 |
| 3 | `3adfeb6`, `7f7454b` | SPATIAL_TEXT 47 cells (inline T, textOf at every lookup); textOf's JSDoc | 0 / 0 / 0 |
| 3 | `f15d1f2` | CULTURE_PROFILES_DAILY 62 + CULTURE_ARCHITECTURAL_DETAILS 13 (R at `choose`, textOf) | 0 / 0 / 0 |
| 3 | `8865042` | PRESSURE_SENTENCES 17 (R, textOf; `speakTierLines` keeps a declared row) | 0 / 0 / 0 |
| 3 | `7376ce0`, `40d22b7` | sibling sets: STRESS_TYPE_SIBLINGS 4, STRESSOR_SPINE_SIBLINGS 2, CONDITION_ARCHETYPE_SIBLINGS 6, QUICK_GUIDE_SIBLINGS 7; THORP miller line; slave-revolt viability note reworded (R-U) + its meta mirror | 0 / 4 (the reword) / 4 |
| 3 | `5cacc55` | CRISIS_CAST_REASONS: brunt food_security / housing_pressure (enforced: CAST_CRISIS_SIBLINGS at the wired brunt draw) + 2 twins | 0 / 0 / 0 (the 1,000 below) |
| item 3 | `f132545` | guardPresence 19, soldiers 2 (STRESS_DESCS, CULTURE defensePattern) | 0 / 0 / 0 |

Red-first throughout: `tests/domain/facts/census2dTables.test.js` (the ledger held at its path or text, verbatim, declaration by declaration; every atom declarable; the sibling sets; the crisis-cast behaviour) and `tests/generators/stressNarrativeDeclared.test.js` (unit 1). Byte method: a scratch sha-256 over `goldenCorpus()`'s 525 records and a 60-soak record/page differ, each commit against the commit (or merge) before it.

### The chair's rulings this seat made (recorded, vetoable)

- **R-B1 widened to a cell key.** An atom the cell's own key or branch already guarantees is not written: `terrain: <t>` on terrain-keyed layout cells (65 atoms), `institution: temple` on the sacred-house branches (the branch reads church / monastery / friary / minster; `institution: temple`'s pattern misses monastery and friary, so declaring it would refuse a monastery village's own line), the village `walls` branches, the mountain town's `garrison` branch, the occupied vignettes' soldiers (the occupier's), crisis-cast reasons whose rule branch already tests the crisis, `healing_capacity` (reached under plague only).
- **Sibling sets for multi-reader T tables.** STRESS_TYPE_MAP (~20 readers), the spine phrases, the condition archetypes and the quick-guide clauses keep their cells as strings and declare beside them, keyed by the original's text (CENSUS-1c's shape, R-P 3). No reader changes; the T wiring resolves through `resolveSibling`.
- **Culture "military household" lines are not `soldiers`.** Seven defence / civic tradition lines (drawn in resolveConfig before any roster exists) describe a tradition; declaring `soldiers` would mute whole defence slots once wired. Open question 2.
- **SETT_REASON is dead** (`_getSettReason` has no caller; R-S). **DECREE_PROSE vid 54** (`market`) waits on the decree site's facts: a kernel `marks` atom is enforced at once, and `decreeProse.js :: drawPart` hands no facts, so it would be refused fail-closed in every birth. **LINE_ROLE_CLAUSE** (wired by 1d, site 94): every ledger atom is the keyed role's crisis, nothing left under R-B1.

### The twins written (each the chair's ruling, R-G)

| table | twin | atom | share |
|---|---|---|---|
| STRESS_NARRATIVE · wartime (loss) | The army has the carts and the road, and the fields are short of hands. | `no crisis: hunger` | T: refused births only (wartime on a fed record: 2 of 60) |
| CRISIS_CAST · bruntBase.food_security | the strain falls first on its people | `no crisis: hunger` | T, enforced: refused births only |
| CRISIS_CAST · bruntBase.housing_pressure | its houses are where the crisis is felt first | `no migration: influx` | T, enforced: refused births only |
| STRESS_TYPE_MAP · plague_onset.crisisHook | The first person to name the outbreak has gone quiet. Their last message suggested the disease is not natural. Reaching them means crossing a quarantine that is not being enforced consistently. | `no healer` | carried (0 until wired) |
| STRESS_TYPE_MAP · plague_onset.viabilityNote | Travel is being discouraged. Some supply chains are disrupted. | `no market` | carried |
| STRESS_TYPE_MAP · religious_conversion.viabilityNote | Tithing income splits or redirects. Properties of the old institution are in legal ambiguity. | temple, `no market` | carried |
| SPINE · under_siege.fear | the stores running out before any relief arrives | `no walls` | carried |
| SPINE · politically_fractured.strain | factions that each hold part of the place and will not yield | `no ruler: council` | carried |
| CONDITION · army_deployed | The settlement's standing army is committed abroad, leaving the home defence thin. | `no garrison` | carried |

R-U rewords (counted): slave_revolt summary → "Whole work gangs have downed tools and will not take them up again."; slave_revolt viabilityNote → "Owners have pulled their work gangs off every task they cannot watch." **Needs a home: `institution: slave market` — 2 lines wanted it.**

Unit 4 otherwise: the R/T/A twins of Phase A's table rows for SPATIAL_TEXT, PRESSURE_SENTENCES (wartime winning), CRISIS_CAST_ABSENCES and DAILY_LIFE_TAB are not written — their sites are not wired (the gate empties nothing yet), and a twin there would be text with no reader. **"pilgrims queue patiently": still unenforced** — CENSUS-1e has not wired the arrival redraw at `f2367a4`; its count is in the 1,000 below.

### `{crisis-scoped}` pools carried but not yet flagged at a site (the wiring must pass `crisisScoped: true`)

SPATIAL_TEXT market / religious quarter descriptions; CONDITION_ARCHETYPE siege_lifted, occupation_lifted, boom, flourishing; QUICK_GUIDE FOOD_SECURITY_CLAUSE (surplus, secure); STRESS_TYPE_MAP and STRESS_DESCS / PRESSURE_SENTENCES / LINE_ROLE_CLAUSE / CRISIS_CAST pools are crisis-keyed and NOT scoped (R-B1).

### The 60 and the 1,000 (R-B: BEFORE = the tip `c8ab81c` with this seat's ten unit commits reverted, i.e. the merged base; AFTER = `c8ab81c`)

| run | records moved | pages moved | every `coh:*` / `reader:*` / `A-*` class | `coh:crisis-blind-prose` | `cert:*` | verdict |
|---|---|---|---|---|---|---|
| 60 (seeds 0–59 of the 1,000) | 5 | 5 | identical | 0 → 0 | none | — |
| 1,000 | **93** (slave revolt in the cell 63, wartime 35, overlapping; 2 `random` cells whose stressors the row does not name) | 5 of the 60 sampled | identical (1,679 findings both; `reader:hook-pools` 111 → 111; `reader:daily-life-placeholder` absent both) | **3 → 3**, all "pilgrims queue patiently" (2b's arrival declaration, waiting on 1e's arrival redraw) | none (`cert:false-presumption` 0 → 0) | STOP → STOP (the base's: crisis-blind in 3) |

**By claim (1,000):** pilgrims queue patiently 3 → 3 (monster pressure, occupied, siege). Food secure 0 → 0. No other claim is present at the merged base (CENSUS-4b/4c/5b cured the goal and DS claims). None rose.

**`declared-share` (1,000, the render ledger):** crisis 466/512 (0.910) → 503/549 (0.916) — the wartime and slave-revolt summaries' declared sentences. Every other surface identical (tab:dossier 0.194, npcs 0.060, plot hooks 0.002, defense / power / services / threats 1.00, tab:daily_life 0/815). The carried tables (textOf / sibling sets) add no ledger notes until their sites are wired, so the share does not see them yet: that is the R-C carry, not a missing declaration.

### Rows moved, by cause (never re-recorded)

- **Golden:** 0 / 525 at every commit (scratch sha-256 over `goldenCorpus()`; the corpus has no slave revolt and no wartime loss on a fed record).
- **Soak records (1,000):** 93 — the slave-revolt summary and viability-note rewords (R-U), the wartime-loss twin on a fed record (R-U + R-G). The crisis-cast brunt twins print on none of the 60 pages; on the 1,000 their births are inside the 93 or absent (the differ cannot separate them from the two `random` cells).
- **Wiring census:** 0 rows (stamp re-takes only). **Manifest:** not run. **Registers:** none (the tables are off the six leaves the registers read).
- **Pins re-keyed by cause:** `crisisCast.test.js` "rule 1" (the record holds the famine it casts); `stressTypesMeta.test.js` follows the reword via the meta mirror; textOf reads in `arrivalScene`, `stressTypeContentWave`, `narrativeArrival`, `defenseRosterLines`, `tierNounKeptRulings`, `dossierContent` (no expectation changed).
- **Merge defect fixed:** `fb14569` left two `factsOf` imports in `dailyLifeLogic.js` (`c8ab81c`).

### Reds at the merged base, unchanged by this seat

crisisBlindWidened 6 (CENSUS-1d's tip) · declarationRegisters 2 (R-T: the compose re-takes) · generatorGoldenMaster 1 · generationContracts 1 · dossierContent 1 · heldKeyWriterCensus 1 · proseWiringCensus 14 · espionageDormancyFence 1 · ruinFilterRoster 2 · observedShapeReaders 6 · domain:strict +4 crisisFactFindings.js, +2 composeStateProse.js. typecheck:ratchet green.

### Where CENSUS-2e starts

1. **Unit 3, the 7 tables left:** DAILY_LIFE_TAB (24, incl. 2 `guardPresence` stops; a JSX table: LOAD_MSGS, the local narrative), DAILY_LIFE_CONTEXT (15: DEFENSE_CONTEXT is now wired by 1e at `077cf9b` — declare it enforced; TERRAIN_CONTEXT / ROUTE_CONTEXT have no reader in src, R-D2 → dead under R-S unless one has appeared), POLITICAL_FLAVOR (9 + the stable pool's 6 `crisis: any`; template functions under `historyCoherence`'s pickRandom2 cascade, 1e's site: textOf), CHECK_INST_COMPAT_LANDMARKS (6; inline in `structuralValidator.js`, drawn by the arrival scene), DOSSIER_CAUSAL_PROSE (79 + 34 crisis; the causal register has no `vid`, so the kernel reads no atoms from it — needs a ruling on how a vid-less family declares), and the `{colour}` rulings (R-R) for STRESS_RUMORS, TERRAIN_SEASON_TEXTURE, ECHO_PREFIXES_DOSSIER, DOSSIER_CONNECTIVES. The tools: an espree splice by lineId path or by literal text (fuzzy over `${…}`), and the census2dTables arms (`holdsLedger`, `inlineArm`, `siblingArm`) — extend the test file, one arm per table.
2. **DECREE_PROSE vid 54** once the decree draw hands facts.
3. **Unit 4** for the carried tables once 1e wires their sites (SPATIAL_TEXT's city/village twins, PRESSURE_SENTENCES' wartime-winning twin, CAST_ABSENCES', DAILY_LIFE_TAB's), and "pilgrims queue patiently" (still 3) when the arrival redraw lands.

### Open questions for the chair

1. A causal-register line has no `vid`: how does a vid-less kernel family declare (a `marks` atom there would collide with arm names like `market`)?
2. The culture tradition lines that name military households / warrior followings / professional troops: are they roster claims (`soldiers`, muting slots once wired) or tradition colour?
3. `institution: temple`'s pattern does not match monastery / friary / minster, which the spatial sacred-house derivation treats as sacred houses: should the vocabulary gain a `sacred house` composite (two readers already want it), or should the pattern widen?
4. The crisis-scoped flags of carried pools (listed above) live only in this doc until their sites are wired: should a lane pin them in `crisisScopedPools.register.json` now (R-T says the compose pins)?

## Phase B continued (CENSUS-2e, 2026-11-05)

> **Where this seat stopped: every unit done, clean and pushed** (well inside the boundary rule). Units 1–2 landed; unit 3 had no newly wired site to twin; unit 4 measured (0 / 1,000 records moved, every class identical). 2d's two `random` cells are named (the wartime twin). **CENSUS-2f starts at** the list under "Where CENSUS-2f starts". Merged `origin/lane/census-1b-2026-11-04` at `6e2cb6d` (`761929c`; CENSUS-1e's lane record and addendum, docs only — no site newly wired since 2d). Re-fetched before each unit: unchanged. The wiring census re-taken through its door at the merge and after every unit: 709 pools / 2,328 variants, both `--check`s green, no row moved.

### Commits

| unit | commit | what | golden / soak-60 records / pages |
|---|---|---|---|
| merge | `761929c` | census-1b at `6e2cb6d` | — |
| 1 | `56803fe` | the crisis-scoped flags on the carried tables (answer 4, R-AF): 33 pools | 0 / 0 / 0 |
| 2 · Daily Life | `f3558f5` | DEFENSE_CONTEXT declared at 1e's wired site (ENFORCED, `crisisScoped: true`); 'Defensible' reworded (R-W); DAILY_LIFE_TAB's loading messages and local narrative carried (textOf); its anchors fallback reworded (R-W) | 0 / 0 / 0 (see the 60) |
| 2 · POLITICAL_FLAVOR | `a12a4b8` | ten cascade rows declare, carried through `textOf(pickRandom2(…))(events)` | 0 / 0 / 0 |
| 2 · landmarks | `91c5874` | CHECK_INST_COMPAT_LANDMARKS: six lines declare, carried (`textOf(pickRandom([...]))`) | 0 / 0 / 0 |
| 2 · colour | `b63ca6e` | the `{colour}` rulings: STRESS_RUMORS, ECHO_PREFIXES, TERRAIN_SEASON_TEXTURE (+ one "needs a field" row: season), DOSSIER_CONNECTIVES | 0 / 0 / 0 |

Red-first throughout: `tests/domain/facts/census2eTables.test.js` (each arm red against the parent file, planted and restored, then green; it imports 2d's `expectedDeclaration` / `declaredLiteralsOf`). Byte method: a scratch sha-256 over `goldenCorpus()`'s 525 records against the merged base `761929c`, per commit that touches a generator (POLITICAL_FLAVOR, the landmarks): **0 / 525** each.

### Unit 1 — the flags (the chair's answer 4, R-AF)

Each carried table that the ledger opted into the crisis dimension (and no crisis key guarantees: R-B1) carries a frozen `<…>_CRISIS_SCOPED` list of the ledger's pool names where the table lives, which the site's wiring reads: `ARRIVAL_CRISIS_SCOPED` (SENSES 12, PEOPLE 7, TENSIONS 1, MEMORIES 3), `ARRIVAL_SCENES_CRISIS_SCOPED` (2), `SPATIAL_QUARTER_CRISIS_SCOPED` (2), `CONDITION_ARCHETYPE_CRISIS_SCOPED` (4), `QUICK_GUIDE_CRISIS_SCOPED` (2) — 33 pools; unit 2 adds `DAILY_LIFE_LOCAL_CRISIS_SCOPED` (4) and `POLITICAL_FLAVOR_CRISIS_SCOPED` (1), and DEFENSE_CONTEXT's five pools are flagged AT the wired site (`crisisScoped: true`). **38 + 5 = 43 opted pools flagged; none pinned** (R-T: the compose pins `crisisScopedPools.register.json`).

A finding for the compose: in 39 of those 43 pools every line already writes `crisis: any`, so the flag changes no admission (the scoping is vacuous, as 2c found for HOOK_LINE_POOLS' foodGap). It bites only where a pool holds a calm (silent) line: ARRIVAL_SCENES `market` (1 calm) and `ordinary` (2), DAILY_LIFE_TAB `localNarrative.stress` (the no-stress sentence) and POLITICAL_FLAVOR `stable` (rows 0, 3, 7, 8) — 4 pools. Those are the pools whose wiring will move births.

### Unit 2 — the seven tables

| table | kind / site | lines read | declaring | state | notes |
|---|---|---|---|---|---|
| DAILY_LIFE_CONTEXT · DEFENSE_CONTEXT | T, wired by 1e (`077cf9b`) | 5 | 5 | **enforced** | 'Defensible' presumed a palisade AND a militia: **0 of 50** Defensible births on a 300-birth probe hold both (R-W) → "There are defenses, but nobody would call this a fortress. …" `needs: watch`. No twin: `defenseCtx` prints on no page (R-D2). Measured on the probe: Fortress 11/14 admitted, Well-Defended 22/41, Vulnerable 19/100 (watch), Undefended 33/44 |
| DAILY_LIFE_CONTEXT · TERRAIN / ROUTE | T | 13 | — | **dead** (R-S) | their ctx fields have no reader in `src` (R-D2 stands) |
| DAILY_LIFE_CONTEXT · legacy 'mixed' | T | 1 | 0 | colour | |
| DAILY_LIFE_TAB | R (LOAD_MSGS), T (local narrative) | 36 | 13 (+ the offer line's 16, unit 2 of Phase A) | carried (`textOf`) | LOAD_MSGS: tavern, market. Food / order cells per the ledger; paragraph [1] `guardPresence` (the parked guards stop); paragraph [2]'s settled-authority sentence `no crisis: succession`. The anchors fallback ("the market, shrine, workshop, and watch post") prints only when the place has NO institution in the eight listed categories, so it named what no place reaching it holds (R-W) → "the wells, the lanes, and the common ground" |
| POLITICAL_FLAVOR | R, `pickRandom2` cascade (CENSUS-1f's unit 4) | 65 | 10 rows | carried (`textOf(pickRandom2(…))(events)`) | disaster_heavy[4] granary (its walls stay with 1c's POLITICAL_FLAVOR_SIBLINGS); stable[1, 2, 4, 5] `crisis: any`, stable[6] market; magical_heavy[1, 2, 4, 6] magic |
| CHECK_INST_COMPAT_LANDMARKS | R, the arrival scene (1f's redraw) | 16 | 6 | carried (`textOf(pickRandom([...]))`) | walls ×2 (one with `no crisis: under_siege`), gate, navigable ×2, `no crisis: succession` |
| DOSSIER_CAUSAL_PROSE | K, vid-less (R-Y) | 468 | 113 (in the ledger) | **carried in the Phase A ledger only, NOT in the annex** | see "A deviation from answer 1" |
| DECREE_PROSE vid 54 | K | 96 | 1 | carried (ledger) | `decreeProse.js :: drawPart` still calls `eligibleVariants` with no facts, so a declared vid 54 would be refused fail-closed in every birth (unchanged from 2d) |
| STRESS_RUMORS | R | 4 | 0 | `{colour}` | the fixed words presume only the key's two NPCs |
| ECHO_PREFIXES (printed copy, historyGenerator.js) | R | 5 | 0 | `{colour}` | R-AD: each frames a past discovery; none asserts what the place holds now. plotHooks.js's copy is a match list, never printed |
| TERRAIN_SEASON_TEXTURE | T | 32 | 0 | `{colour}` + "needs a field" | every cell presumes its season (ruling 8): one hand-kept row in `undeclaredLines.register.json` |
| DOSSIER_CONNECTIVES | K joint | 12 | 0 | `{colour}` | pure joinery; the ruling is a paragraph in annex §7b (the projector reads no brace on §7b's lists) |

**A deviation from answer 1 (said out loud).** The chair's answer said "declare [DOSSIER_CAUSAL_PROSE] in the annex now, enforced later". This seat did not, for three measured reasons, and left the 113 declarations carried in Phase A's ledger file (`docs/census/declarations/DOSSIER_CAUSAL_PROSE.json`), where they already stand verbatim:
1. **The causal leaf's byte ceiling is a ruling.** `scripts/.prose-byte-baseline.json :: _causalLeafGround`: "THE CAUSAL LEAF TAKES NO HEADROOM, AND THAT IS A RULING" (ARCH §11; §12 car 13 is OWNER-GATED, "wire or retire"). An atom in the tag slot is projected into `marks` and grows the leaf, so the annex edit breaches an owner-gated ceiling.
2. **The arms are marks.** `readCausalDossierLine` selects a family's arm by `marks.includes(join.arm)`, and the arm vocabulary holds `market`, `occupied`, `held`, `court`: an atom `market` on a variant of the other arm would be read as that arm (R-Y's own reason).
3. **The leaf renders nowhere.** `causalDossierProse.js` has no product importer (the same baseline row measures it), so a declaration there would carry nothing a reader sees.
The vids (R-Y, 1f's item 1) settle reason 2 only; reasons 1 and 3 are the owner's "wire or retire".

**Waiting lists (this seat's).**
- **waiting on sacredHouse (R-AE):** POLITICAL_FLAVOR religious_heavy[0] ("…the institution persisted") and [2] ("…the local clergy…"): a sacred house of any kind, not a temple. (The spatial lines 2d listed are unchanged: the sacred-house branches of SPATIAL_TEXT.)
- **waiting on the closure's split (the wiring):** POLITICAL_FLAVOR catastrophic[1]'s monster-incursion branch (walls, militia) — one branch of a closure whose other branch presumes nothing; a row atom would refuse both. (Its militia would also fall under R-Q: the militia joins the roster after the power step.)
- **waiting on a faith-presence atom:** DAILY_LIFE_TAB paragraph [1]'s "priests" (`priest` reads a senior cleric among the named people, not a class of priests).
- **dead (R-S):** DAILY_LIFE_CONTEXT TERRAIN_CONTEXT / ROUTE_CONTEXT.
- **R-Q:** none of this seat's declared lines names a fact settled after its draw (the Daily Life cells read the final record at render; the history cascade and the landmarks draw after the roster, the granary and the walls are settled at institutions and defence; magic is a world law).

### The chair's rulings this seat made (recorded, vetoable)

- **R-E1, the flag lives with the table as a list of the ledger's pool names** (`<TABLE>_CRISIS_SCOPED`), not as a property on an array (a filtered copy would drop it) — the wiring reads `crisisScoped: LIST.includes(poolId)`.
- **R-E2, a never-true or never-reached presumption is reworded, both directions** (R-W): 'Defensible' (presumed palisade ∧ militia, 0/50) and the anchors fallback (named a market and a watch that no place reaching it has).
- **R-E3, the colour rulings above** (R-R), and ECHO_PREFIXES under R-AD: historical framing is colour.
- **R-E4, DOSSIER_CAUSAL_PROSE stays in the ledger** (the deviation above).

### Unit 3 — the twins where a site is wired

`origin/lane/census-1b-2026-11-04` was re-fetched before every unit and stood at `6e2cb6d` throughout: CENSUS-1f has not landed, so **no carried table's site is newly wired** and no twin is written (a twin at an unwired site is text with no reader). DEFENSE_CONTEXT is wired but prints on no page (R-D2), so its refused cells read null and take no twin. The twins still owed when 1f wires their sites (2d's list, unchanged): SPATIAL_TEXT's city / village layouts, PRESSURE_SENTENCES' wartime-winning, CAST_ABSENCES, DAILY_LIFE_TAB's food / order / anchors / paragraph twins (the ledger's `twins`), plus — new from this seat — a crisis-safe line for POLITICAL_FLAVOR `stable` (its four calm rows go mute under any crisis once scoped; R-L) and for ARRIVAL_SCENES `market` / `ordinary` (their calm lines). **"pilgrims queue patiently": 3 on the 1,000, unchanged** (soak1k-317 monster pressure, -741 siege, -815 occupied): 2b's declaration waits on the arrival redraw (1f).

### 2d's two `random` cells — the cause, named

Re-measured by birthing the 51 `random`-cell seeds of the 1,000 in two scratch trees, one process per tree: 2d's BEFORE (`c8ab81c` with its ten unit commits reverted) and 2d's tip `c7d12b3` (positive control: soak1k-15 moves, slave market and doubled prices on the BEFORE side). **Exactly two move: soak1k-141 and soak1k-956. Both rolled `wartime` (the loss wording) on a record with no hunger (food bands `secure` and `pressured`), and the one changed string is `stress[].summary` / `stressors[].summary`: "Food prices have doubled." → "The army has the carts and the road, and the fields are short of hands."** — 2d unit 1's wartime twin (`6f2435f`). Every one of 2d's 93 moved records now has a named cause; nothing is unresolved.

### The 60 and the 1,000 (R-B: BEFORE = the merged base `761929c`, AFTER = the tip)

| run | records moved | pages moved | every `coh:*` / `reader:*` / `A-*` class | `coh:crisis-blind-prose` | `cert:*` | verdict |
|---|---|---|---|---|---|---|
| 60 | 0 / 60 | 0 / 60 | identical (102 findings both) | 0 → 0 | none → none (`cert:false-presumption` 0) | CLIMB → CLIMB |
| 1,000 | **0 / 1,000** | 0 of the 60 sampled | identical (1,679 findings both; `reader:hook-pools` 111 → 111, none on this lane's pools; `reader:daily-life-placeholder` 0 → 0; `A-12:self-vouch-false` 0 → 0) | **3 → 3**, all "pilgrims queue patiently" (the base's, waiting on 1f) | none → none (`cert:false-presumption` 0 → 0) | STOP → STOP (the base's: crisis-blind in 3) |

**By claim (1,000):** pilgrims queue patiently 3 → 3. No other claim present on either side; none rose.

**`declared-share` (1,000, the render ledger):** **tab:daily_life 0 / 815 → 409 / 409 (1.000)** — DEFENSE_CONTEXT, the one enforced table: 406 readiness cells the record contradicts now resolve to nothing (unnoted; the slot prints on no page) and the 409 that stand are noted with their atoms. crisis 503 / 549 (0.916) unchanged; tab:dossier 0.194, npcs 0.060, defense / power 1.00 unchanged. The carried tables (textOf) add no ledger notes until their sites are wired: the R-C carry, not a missing declaration.

### Rows moved, by cause (never re-recorded)

- **Golden:** 0 / 525 at every generator-touching commit and at the tip (scratch sha-256 over `goldenCorpus()` against `761929c`).
- **Soak records:** 0 / 60, 0 / 1,000. **Pages:** 0 / 60 (DEFENSE_CONTEXT's text is not printed; the local Daily Life narrative and its loading messages print only in unconfigured mode, which the harness does not render).
- **Wiring census:** 0 rows (re-taken through its door: 709 pools / 2,328 variants). **Manifest:** not run (no annex variant moved). **Registers:** `undeclaredLines.register.json` +1 hand-kept `needsAField` row (TERRAIN_SEASON_TEXTURE, season); `statePools` and the crisis-scoped register untouched (R-T: the compose re-takes them; none of this seat's tables is on the six leaves).
- **Pins re-keyed by cause:** `tests/domain/facts/defenseContextWired.test.js` (CENSUS-1e's): the Undefended cell now notes its atoms (`no walls · no garrison · no watch · no gate · crisis: any`).
- **Rewords counted (R-W):** DEFENSE_CONTEXT 'Defensible' (moves nothing: unprinted); DAILY_LIFE_TAB's anchors fallback (moves the local-mode narrative only where the place has no institution in the eight categories).

### Reds at the merged base, unchanged by this seat (each re-run at `761929c` in a scratch worktree, title for title)

heldKeyWriterCensus 1 · worldGenerationClockSeam 1 · writerReach (file) · corruptionWebDormancyGolden 1 · demographicsLifecycleGolden 1 · intelTradeDormancyGolden 1 · npcLedgerDormancyGolden 1 · tabSentencesOnce 1 · observedShapeReaders 6 · proseNumerics 3 · styleShorthandLonghand 1 · dossierContent 1 · rosterFinalUnderHeldRoster 1 · proseWiringCensus 14 · espionageDormancyFence 1 · generatorGoldenMaster 1 · generalDeskTabFlow (file) · effectReachability.coverage 1 · nameHeldThroughAssembly 1 · tonightSheetOnce 1 · declarationRegisters 2 (R-T) · proseCorpusBytes 2. `typecheck:ratchet` 167 / 167 green; `typecheck:domain:strict` +4 crisisFactFindings.js, +2 composeStateProse.js (the base's; this seat's one strict error in activeConditions.js was cured before its commit). Only the suites naming a changed module were run (listed per commit); the full suite was not.

### Where CENSUS-2f starts

**CENSUS-2's Phase B tables are all read and landed or ruled.** What is left is wiring-dependent:
1. **Unit 4's twins once CENSUS-1f wires the sites** (the list under unit 3 above), each one commit with its share; then pass the `_CRISIS_SCOPED` flags at those sites (the 4 non-vacuous pools under unit 1 are the ones that move births).
2. **"pilgrims queue patiently"** reads 0 when 1f's arrival redraw lands (re-measure on the 1,000).
3. **DOSSIER_CAUSAL_PROSE**: after 1f's vids (R-Y), only if the owner wires the causal register (`_causalLeafGround`); until then its 113 declarations stay in the ledger. **DECREE vid 54** once `drawPart` hands facts.
4. **The waiting lists above** as their atoms land (sacredHouse: R-AE, 1f's item 2; a faith-presence atom).

### Open questions for the chair

1. Answer 1 said "declare DOSSIER_CAUSAL_PROSE in the annex now"; the causal leaf's byte ceiling is an owner-gated ruling, arms share the marks channel, and the leaf has no product importer — is the ledger the right home until the owner's "wire or retire" (this seat's reading), or should the ceiling move through a declared row?
2. 39 of the 43 flagged pools are vacuously scoped (every line `crisis: any`): should a lane drop `any` and the flag there (2c's reading for foodGap), or keep both as the ledger wrote them (this seat followed 2d and answer 4)?
3. DEFENSE_CONTEXT's `defenseCtx` prints on no page although CENSUS-1e wired it: wire it to a page (owner) or rule it dead with TERRAIN / ROUTE_CONTEXT (R-S)?

## Phase B continued (CENSUS-2f, 2026-11-05)

> Continues this branch from CENSUS-2e's `93ad806`. Transport push only (after every unit); no pull request; no send_message. Merged `origin/lane/census-1b-2026-11-04` at `99b0036` (`a33ce94`: CENSUS-1f's sites 19/18/15, the arrival redraw-once, the POLITICAL_FLAVOR cascade through `drawDeclared`, the outlook and timeline hooks, `sacredHouse`, the canonical tag slot, and its R-AI addendum). Clean merge, no generated-leaf conflict; re-taken through the doors: `scripts/wiring-census.mjs --check` 709 pools / 2,338 variants green, `gen:dossier-prose --check` green.

### Unit 1 — the merge; the chair's three answers

**Answer 2, the inert flags dropped (R-AH).** Measured before dropping, by the ledger AND the live tables: of 2e's 43 flagged pools, 39 hold no calm line (every line writes `crisis: any`). Dropped from the code lists (34): `ARRIVAL_CRISIS_SCOPED` (SENSES 12, PEOPLE 7, TENSIONS 1, MEMORIES 3 → every list empty; the arrival site still reads them, so a pool that gains a calm line is listed again), `SPATIAL_QUARTER_CRISIS_SCOPED` (2 → 0), `CONDITION_ARCHETYPE_CRISIS_SCOPED` (4 → 0), `QUICK_GUIDE_CRISIS_SCOPED` (2 → 0), `DAILY_LIFE_LOCAL_CRISIS_SCOPED` (food, order, paragraphs → stress only). **Kept (4):** ARRIVAL_SCENES `market` and `ordinary`, `localNarrative.stress`, POLITICAL_FLAVOR `stable`. **DEFENSE_CONTEXT's 5 (the remainder of the 39) stay in stasis at their site** — the chair's answer 3 ("its wiring and declarations left as they are") is the narrower rule for dead text, and the flag there is inert (every cell `crisis: any`). The register (`crisisScopedPools.register.json`) held none of the 39 (it pins annex braces), so no register row moves. **0 births move:** golden 0 / 525 (scratch sha-256 over `goldenCorpus()`, the merged base hashed twice, 0 / 0), soak 0 / 60 records, 0 / 60 pages, `declared-share` identical (the ledger's declared test reads atoms, and `crisis: any` is an atom). Red-first: `census2eTables.test.js` unit 1 re-stated as the rule "flagged ⇔ the ledger's opted, un-keyed pool holds a calm line" — 3 arms red at the merge, green after.

**Answer 3, DEFENSE_CONTEXT is dead text (R-AI).** Listed dead with TERRAIN_CONTEXT and ROUTE_CONTEXT: `defenseCtx` prints on no page; its wiring (CENSUS-1e's site) and its five declarations are left as they are (harmless); no lane wires it to a page.

**Answer 1, DOSSIER_CAUSAL_PROSE is dead (R-AI, R-S).** CENSUS-1f's addendum measured the importer census: nothing in `src` imports `causalDossierProse.js` (0 importers). Dead: listed, left in stasis, no vids, its Phase A ledger (`docs/census/declarations/DOSSIER_CAUSAL_PROSE.json`, 113 declarations) is the record. Not declared in the annex.

**The dead list of this lane, complete:** DAILY_LIFE_CONTEXT · TERRAIN_CONTEXT, ROUTE_CONTEXT, DEFENSE_CONTEXT; DOSSIER_CAUSAL_PROSE.

### Unit 2 — R-AP, the fish key, and the audit of the five arrival tables

**The fish key.** `chooseSense` picks a sense by catalogue NAME fragments (`fish market`, `fishmonger`, `fishing`, `fisher`), which guarantee no catch: soak1k-152 (an occupied forest village on a mountain pass, food sources `game` only) printed "A basket of fish, still flapping, is carried past at a run." The four lines under `fish.lines` now declare `fish` (the `foodSources` presence atom; the gulls line keeps its `market`, `navigable`), through the arrival tables' row channel (`{ text, needs }`), so a refused beat redraws from the admitted lines.

**The audit (every keyed pool of the five tables; measured on the 1,000 at the merged base by a scratch scanner that births each seed and reads the drawn line back out of `arrivalScene`).**

| table · key | picker | presumed fact | reachable without it? | ruling |
|---|---|---|---|---|
| SENSES `fish.lines` | name fragments | the catch (`fish`) | **yes** — 1 of 38 drawn (soak1k-152) | declare `fish` (4 lines) |
| SENSES `fish.dominant` | the exports / income (`trade: fish`) | the fish trade, which the picker read | no (soak1k-716 draws it at a port that exports fish with no food-record catch: true by the exports) | hygiene (R-B1); `navigable` kept |
| SENSES `market.lines` | name fragments, not `isMarketInstitution`'s tags | `market` | yes in principle (the two spellings differ); 0 of 3 on the 1,000 | declare `market` (4 lines) |
| SENSES `faith.lines` | fragments incl. `priest`, `chapel` | a house of worship (`sacredHouse`) for the bell, the incense, the hymn | yes in principle; 0 of 43 | declare `sacredHouse` on 3; the wayside shrine set into a wall presumes nothing |
| SENSES `livestock` | stock institutions | animals handled here (what the stockyard, drover, shepherd or dairy guarantees) | — | **not declared**: the homed `livestock` atom is the food record's source (pastoral house AND grazing land), a narrower claim than the lines make; it is false in 86 of the 87 `livestock.lines` births, so declaring it would refuse true lines (R-W's wrong-presumption test). "Sheep … from the grazing beyond the houses" presumes grazing, which a common-grazing house OR the resource provides — a disjunction a line cannot declare (R-U); left as it is |
| SENSES, the other 12 keys | name fragments | the trade the matched house practises | no | hygiene |
| SCENES `port`, `river`, `smoke`, `ordinary`, `market` | the route field (`tradeRouteAccess`), the market fragments for `market` | the route the picker read | no (port/river: `navigable` 34 of 34) | hygiene; `market` already guarded by the beat's T1-12 market agreement |
| PEOPLE (11 cultures + `mixed`) | the culture profile key | the culture | no; `mixed` is a default fallback that no profile key reaches (every key has a pool; 0 of 1,000) | hygiene; `mixed` listed as an unreachable fallback (its "three languages" presume a mixed people, a fact with no home — R-U applies if it is ever reached) |
| TENSIONS (safety label, prosperity) | the record's own safety label / prosperity | that label | no | hygiene |
| MEMORIES (event template) | the record's recent event | that event | no | hygiene |

**Births moved (the 1,000, the arrival scene read back on every seed):** **1** — soak1k-152, whose sense beat is now left out (every fish line refused; the redraw-once rule leaves an empty clean set out). `A-11:sea-words-landlocked` 1 → 0 expected on the 1,000 (read in unit 6). Golden **0 / 525**. The market and faith declarations move nothing on the 1,000.

**A-11's own condition (the instrument stood, R-AP).** A-11 reads sea words only where `waterAccessKind(terrain, route)` is `none`. On the 1,000, **417** births hold the `fish` atom, **231** of them river places, and **0** of the 417 lack water — so no birth admitted by the atom can be flagged. soak1k-170 (a river village, food record `fish`) keeps "A basket of fish, still flapping…" and its water gate is open (pinned in the new test).

**Mute slot for the compose's §10 census:** ARRIVAL_SENSES `fish.lines` under a fish house with no catch — 1 of 1,000 (soak1k-152), under the 1-in-100 bar. No twin: a line for an inland fish trade would need words A-11 reads as sea words, and nothing else on the overview speaks to the fish house, so the compose's census decides.

Red-first: `tests/generators/arrivalFishKeyDeclared.test.js` (the three table arms and soak1k-152 red at the parent; soak1k-170 the positive control, green on both). Pin re-keyed by cause: `tests/domain/facts/textOf.test.js` declared-row count 86 → 92 (fish +3, faith +3).

### Unit 3 — "pilgrims queue patiently", re-measured after the arrival redraw

**3 → 0, and the cure is CENSUS-1f's, not this lane's.** At this seat's merged base (`a33ce94`, which carries 1f's redraw-once `f6ec896`) the 1,000 already reads `coh:crisis-blind-prose` **0** (2e's base: 3, all the pilgrims' queue). On the three seeds the line no longer prints, and the beat that replaced it is the faith key's dominant[1] on all three: **"The bells of <name> answer one another across the roofs, and the streets slow for them."** — soak1k-317 (monster pressure, two gates held by two factions), soak1k-741 (siege: "Chernoko has drawn in on itself…"), soak1k-815 (occupied: "At Dzibac's gate the queue divides in two…"). The line still prints in 21 births of the 1,000 (soak1k-95, -136, -149, …), none under a threat or unrest crisis (the class reads 0). Unit 2's faith declarations do not touch dominant[1] or [2]; the tip's arrival scenes on these three are byte-identical to the base's.

### Unit 4 — the twins at the sites CENSUS-1f wired: none owed

`origin/lane/census-1b-2026-11-04` re-fetched before this unit: still `99b0036`. Read site by site (a twin only where the slot would empty for most births or thin below its ratchet, R-G / R-L):

| table | site state at `99b0036` | does the slot empty? | twin |
|---|---|---|---|
| POLITICAL_FLAVOR | **wired** (`historyCoherence.js :: flavorOf`, `b26ed12`; `stable` crisis-scoped) | **no.** `stable` keeps four `crisis: any` rows with no other atom (rows 1, 2, 4, 5) under every crisis; every other pattern holds bare (neutral) rows admitted under every fact state; and the site keeps the drawn template when nothing is admitted, so the slot cannot empty | none |
| ARRIVAL_SCENES `market` / `ordinary` (2e's list; wired by 1f's redraw, scoped) | **wired** | **no.** `market` keeps 3 `crisis: any` lines of 4, `ordinary` 4 of 6, under any crisis | none |
| CHECK_INST_COMPAT_LANDMARKS | **carried** (`structuralValidator.js :: checkInstCompat` still `textOf(pickRandom([...]))`; the arrival site applies only the T1-12 market / drying-rack agreement to `sight`, no declaration) | — | none (a twin at an unwired site is text with no reader) |
| DAILY_LIFE_TAB (loading messages, the local narrative) | **carried** (`textOf`) | — | none |

**Mute slots from these sites for the compose's §10 census: none.** 2e's remaining twin list (SPATIAL_TEXT city / village layouts, PRESSURE_SENTENCES wartime-winning, CAST_ABSENCES, DAILY_LIFE_TAB's food / order / anchors / paragraph twins) stays owed to the day their sites are wired; none of them was wired by 1f. 0 births move.

### Unit 5 — the waiting lines

**(a) POLITICAL_FLAVOR religious_heavy [0] and [2] declare `sacredHouse` (landed, `fc45cc1`).** Enforced at 1f's cascade site. R-V / R-AN measured with a scratch probe at the draw (`narrativeGenerator.js`, the `historical-character` substream): the draw-time `sacredHouse` equals the final record's on **1,000 / 1,000** births (and so do `walls` and `militia`, for (b)). **6 births move** (`history.historicalCharacter` only, own substream): soak1k-73 and -517 ([2], the local clergy) and soak1k-313, -331, -378, -642 ([0], the persisting institution), none with a sacred house; each resolves to the admitted argmax, religious_heavy[6] ("There is a wariness in how people here speak of doctrine…"). Positive controls soak1k-784 ([0]) and -866 ([2]) keep their rows. Golden **0 / 525**. Red-first: `tests/generators/politicalFlavorSacredHouse.test.js` (red at the parent, the controls green on both) and `census2eTables.test.js`'s ledger arm (the ledger's `institution: temple` written as `sacredHouse`, by cause: `WRITTEN_FOR`).

**(b) catastrophic[1]'s split — NOT landed; measured, held for the chair.** The closure's monster-incursion branch ("…why this settlement has walls where others do not, why the militia drills…") prints in **0 of 1,000** births (503 carry a catastrophic event; none prints this branch). The split the answer describes (two lines in the pool) cannot be made byte-identical: the pool is drawn by `pickRandom2`'s modulus, so a ninth row moves **166 of 1,000** births' `historicalCharacter` (measured in a scratch tree with a ninth row: 166 moved, 62 of them landing on the new row) to cure a branch that prints nowhere. And the two halves cannot be separately declared rows of the pool, because the branch condition is the drawn EVENT's type (not an atom): a row holding only the monster sentence would print it for a flood. The byte-preserving cure is a mechanism one — the closure returns its branch's declaration (`{ text, needs }`) and the site resolves or notes the RETURNED branch — which is the mechanism lane's (R-C). Left as it is, listed "waiting on the closure's split" with this measurement. Its facts are settled at the draw (above), so R-Q no longer applies to it.

**(c) DAILY_LIFE_TAB paragraph [1]'s "priests": stays "waiting on priest".** The vocabulary at 1f's tip has no faith-presence atom: `priest` reads a senior cleric among the named people (2e's reason stands), and `sacredHouse` is a building, not a class of people at work — declaring it on the whole paragraph would refuse its food and guards sentences with it. The site is carried (unwired), so nothing would move either way.

**(d) DECREE vid 54: stays carried and listed.** `decreeProse.js :: drawPart` still calls `eligibleVariants(spoken, { slots, audience })` with no facts (1f's display rows have not landed), so a declared vid 54 would be refused fail-closed in every birth.

### Unit 6 — the 60 and the 1,000 (R-B: BEFORE = the merged base `a33ce94`, run from a scratch worktree; AFTER = the tip)

| run | records moved | pages moved | every `coh:*` / `reader:*` / `A-*` class | `cert:*` | verdict |
|---|---|---|---|---|---|
| 60 | 0 / 60 | 0 / 60 | identical (101 findings both) | none → none | CLIMB → CLIMB |
| 1,000 | **7 / 1,000** — exactly the predicted seven: soak1k-152 (unit 2), soak1k-73, -313, -331, -378, -517, -642 (unit 5) | (152 and the six are outside the 60) | **`A-11:sea-words-landlocked` 1 → 0** (soak1k-152); every other class identical (1,662 → 1,661 findings): `coh:crisis-blind-prose` 0 → 0, `reader:daily-life-placeholder` 0 → 0, `reader:hook-pools` 5 → 5 (none on this lane's pools: soak1k-110, -462, -470, -571, -614, the `[sea]` class 1f named), `A-12` 0 → 0 | none → none (**`cert:false-presumption` 0 → 0**) | CLIMB → CLIMB |

**By claim (1,000):** the fish beat in a place with no catch 1 → 0; "pilgrims queue patiently" 0 → 0 (cured at the base by 1f, unit 3); the persisting-institution and local-clergy rows with no sacred house 6 → 0. None rose.

**`declared-share` (1,000, the render ledger):** overview 1,563 / 3,017 (0.518) → **1,632 / 3,016 (0.541)** (the arrival beats' new declarations noted; one beat fewer, soak1k-152's); history 1,504 / 10,396 (0.145) → **1,519 / 10,396 (0.146)** (religious_heavy [0] / [2] and their resolutions noted); crisis 503 / 549 (0.916) unchanged; tab:daily_life 409 / 409 (1.000) unchanged (DEFENSE_CONTEXT, dead text); every other surface identical. `cert:false-presumption` cannot yet rise on this lane's pools from R-AM: 1f's ledgering of kept-refused originals has not landed (listed for CENSUS-1g); where it lands, POLITICAL_FLAVOR keeps no refused original (its slot never empties) and the arrival beats leave a refused beat out rather than keep it, so no rise is expected from these pools.

**The undeclared register for this lane's surfaces:** unchanged — the arrival tables, POLITICAL_FLAVOR and the Daily Life cells are carried JS tables outside `undeclaredLines.register.json` (which counts the annex's pools; its two titles are red at the base by R-T and unchanged here). The census (`scripts/wiring-census.mjs --check`, 709 pools / 2,338 variants) and `gen:dossier-prose --check` are green at the tip; no annex row moved.

### Rows moved, by cause (never re-recorded)

- **Golden:** **0 / 525** at every code commit and at the tip (scratch sha-256 over `goldenCorpus()`, the base hashed twice, 0 / 0).
- **Soak records:** 0 / 60; **7 / 1,000** — soak1k-152 (`arrivalScene`: the sense beat left out, unit 2) and soak1k-73, -313, -331, -378, -517, -642 (`history.historicalCharacter`, unit 5). **Pages:** 0 / 60.
- **Wiring census / manifest / registers:** 0 rows (no annex variant moved; the register pins are the compose's, R-T).
- **Pins re-keyed by cause:** `tests/domain/facts/textOf.test.js` declared arrival rows 86 → 92 (unit 2); `tests/domain/facts/census2eTables.test.js` unit 1 re-stated to R-AH's rule (unit 1) and its POLITICAL_FLAVOR ledger arm writes `sacredHouse` for the ledger's temple (unit 5).
- **Twins added:** none (unit 4: no wired slot empties). **Rewords:** none.

### Reds at the merged base, unchanged by this seat (re-run at `a33ce94` in a scratch worktree, title for title: identical, 25 titles in 10 files)

tabSentencesOnce 1 · dossierContent 1 · rosterFinalUnderHeldRoster 1 · proseNumerics 3 · proseWiringCensus.walker 14 · styleShorthandLonghand 1 · espionageDormancyFence 1 · generatorGoldenMaster 1 · economicsTabFlow · generalDeskTabFlow; declarationRegisters 2 (R-T). `typecheck:ratchet` 167 / 167 green; `typecheck:domain:strict` red only on the base's +4 `crisisFactFindings.js` / +2 `composeStateProse.js`. eslint clean on every touched file. The suites run were every test file importing a touched module (45 files) plus the arrival and history suites; the full suite was not run.

### Waiting lists (this seat's, complete)

- **waiting on the closure's split (a mechanism channel):** POLITICAL_FLAVOR catastrophic[1]'s monster-incursion branch (walls, militia) — unit 5 (b).
- **waiting on priest (a faith-presence atom):** DAILY_LIFE_TAB paragraph [1]'s "priests".
- **carried, waiting on a site:** CHECK_INST_COMPAT_LANDMARKS (6 lines), DAILY_LIFE_TAB (loading messages, local narrative), DECREE vid 54 (`drawPart` hands no facts), and 2e's twins owed at unwired sites (SPATIAL_TEXT, PRESSURE_SENTENCES, CAST_ABSENCES, DAILY_LIFE_TAB).
- **needs a home / a disjunction:** ARRIVAL_SENSES `livestock.lines[0]`'s grazing (a common-grazing house OR the grazing resource); ARRIVAL_PEOPLE `mixed` (unreachable fallback; a mixed people has no atom).
- **mute slot for §10:** ARRIVAL_SENSES `fish.lines` under a fish house with no catch, 1 / 1,000 (soak1k-152).
- **dead (R-S, R-AI):** DAILY_LIFE_CONTEXT · TERRAIN_CONTEXT, ROUTE_CONTEXT, DEFENSE_CONTEXT; DOSSIER_CAUSAL_PROSE.

### The chair's rulings this seat made (recorded, vetoable)

- **R-F1, the flag on dead text stays in stasis.** DEFENSE_CONTEXT's five inert flags are part of R-AH's 39 but sit at a dead site; answer 3's "left as they are" was read as the narrower rule, so 34 were dropped in code and those 5 left.
- **R-F2, a key's picker that reads the trade, not the fact, keeps hygiene.** `fish.dominant` is reached through the exports (`trade: fish`) and its lines speak of the fish trade the picker read, so it keeps R-B1 hygiene; `fish.lines` is reached by a fish house's name and presumes the catch, so it declares `fish`.
- **R-F3, a homed atom narrower than the line's claim is not declared.** `livestock` (the food record's source) is false in 86 of 87 `livestock.lines` births whose stock houses make the lines true; declaring it would refuse true lines.
- **R-F4, catastrophic[1]'s split is held, not landed** (unit 5 (b)): the brief ordered it, but the measured cost (166 of 1,000 births moved by the modulus to cure a branch printed in 0) breaks the byte-identity law's intent, and the halves cannot be separate rows while the branch turns on an event type.

### Where CENSUS-2g starts

**Nothing of this lane remains but the compose and what waits on the mechanism lane.** If CENSUS-1g lands (a) a site for the landmarks or the Daily Life cells, the twins listed under unit 4 become owed at those sites, one commit each with its share; (b) R-AM's ledgering, re-read `cert:false-presumption` on POLITICAL_FLAVOR and the arrival pools (expected 0); (c) a declaration channel for a closure's returned branch, land catastrophic[1]'s split through it (0 births expected on the 1,000); (d) facts at `drawPart`, declare DECREE vid 54.

### Open questions for the chair

1. catastrophic[1]'s split: accept the modulus move (166 of 1,000 births' `historicalCharacter`, a branch printed in 0) as R-AA's kind of counted content move, or route it through a mechanism channel where the closure returns its branch's declaration (this seat's recommendation)?
2. DEFENSE_CONTEXT's five inert flags: dropped with the 39 (answer 2) or left in stasis with the dead text (answer 3, this seat's reading)?
3. DAILY_LIFE_TAB paragraph [1]'s "priests": a faith-presence atom (a class of clergy at work), or a reword dropping the priests from the list when the site is wired?
4. The religious_heavy refusals all resolve to the same row ([6]) because the cascade's argmax key is `pattern::length::firstName`, near-constant across births: acceptable, or should the mechanism lane widen the key (it moves only refused births)?

### Addendum — CENSUS-1g landed during unit 6; merged and re-measured

`origin/lane/census-1b-2026-11-04` moved to `d2b1ab0` while unit 6 ran (CENSUS-1g units 1–3: R-AO's `colour` mark `c000dd9`, **R-AM's kept-refused ledgering** `28c6d2a`, R-AJ's registry-aware resolution `d2b1ab0`). Merged at `f68334e` (clean; the census `--check` 709 / 2,338 and `gen:dossier-prose --check` green; this lane's suites and 1g's two new ones green, 86 / 86). Golden **0 / 525** against the base. The 1,000 re-run (AFTER-1g vs AFTER): **0 / 1,000 records moved**; the only class that moves is **`cert:false-presumption` 0 → 2,134 findings in 711 births — verdict CLIMB → STOP, caused by the merge, not by this lane** (R-AM: the instrument now sees kept-refused originals; R-B: reported by cause). By pool: `rulingStructure:FACTION_DESC_SIBLINGS` 1,884 (`garrison`, CENSUS-5c's twin-less garrison sets, already ruled for a reword under R-AN) and `foodBalance:OUTLOOK_HOOK_SIBLINGS` 250 (`food: ≤ deficit` 140, `tier: <= village` 110). **On this lane's pools (POLITICAL_FLAVOR, the arrival tables, the Daily Life cells): 0**, as unit 6 predicted. The owning lanes twin or reword those lines (R-AM); the compose reads the STOP.

### Unit 7 — the chair's messages of 06:59 and 07:25 (R-AP amended, R-AQ, R-AS; R-AO applied)

Read after unit 6 (queued while it ran). Merged `origin/lane/census-1b-2026-11-04` at `ef551fc` first (`3a9d42a`: CENSUS-1g unit 4, R-AL — on the 1,000 it alone moves 16 records, `reader:tension-memory` 60 → 61; golden 0 / 525; the merge's, not this lane's). BEFORE for this unit = `3a9d42a`, AFTER = the tip.

**R-AP amended — the fish siblings re-read ("a key guarantees exactly what its picker reads; a line that presumes more declares the rest"; this seat's reading is the ruling, R-R).** `fish.lines` is picked by a fish house's name: the stalls' morning catch `market · navigable · fish` (unchanged), the wet baskets, the drying nets and the flapping basket `fish` (unchanged from unit 2). `fish.dominant` is picked by the exports' fish trade, which guarantees the trade and no catch, so unit 2's R-F2 is **superseded**: the racks of drying fish with "the smell of salt and catch" `navigable · fish`; "half of <name> … gutting, salting or selling fish" `fish` (gutting is the catch landing); the salt barrels with their gulls `navigable` only (a salted export, A-11's licensed inland trade, beside water). **0 / 1,000 records move** (the two lines are drawn on the 1,000 only where the food record holds fish).

**R-AO applied — `colour` on the bare lines this seat READ in its mixed pools** (`{ text, colour: true }`; the draw and the ledger read it as silence): ARRIVAL_SENSES `bread.lines` [0, 1, 3] (bread and ovens — no bakery atom, and every hearth bakes), `faith.lines` [2] (the wayside shrine), `herbs.dominant` [1, 2]; POLITICAL_FLAVOR `disaster_heavy` [0, 1, 2, 3, 5], `religious_heavy` [1, 3, 4, 5, 6], `magical_heavy` [0, 3, 5] (each read by R-AD's test: the place's temper and memory, no roster claim; `magical_heavy`[3]'s "local policy on arcane practice" can be a ban, so it presumes no magic). **Not marked:** POLITICAL_FLAVOR `stable`'s bare rows and ARRIVAL_SCENES `market`[1] / `ordinary`[0, 2] — they sit in `{crisis-scoped}` pools where silence presumes CALM, which `colour` ("presumes nothing") would misstate; the pure-bare pools (every line bare, e.g. `smiths.lines`) are not mixed and carry no brace channel in a JS table, so they are left for the compose's `{colour}` reading. 0 births move (the mark is no atom). These tables sit outside `undeclaredLines.register.json`, so no register count moves.

**R-AS — POLITICAL_FLAVOR catastrophic[1]: the hold is confirmed, the split refused, the row listed "self-gated", its never-printed branch kept (R-AK).** Recorded as the chair's ruling. ⚠ **A correction to R-AS's premise, for the record (vetoable):** the closure does NOT read walls or a militia — it selects its branch by the drawn EVENT's type (`s.type === "monster_incursion"`), so the monster branch still presumes walls and a militia it never verifies. It prints in 0 of 1,000, and both facts are settled at the draw on 1,000 / 1,000 (unit 5), so nothing is false today; the honest listing is "self-gated by event type; presumes walls + militia unverified; 0 / 1,000". The byte-preserving cure, if the pulse ever prints it, is the closure returning its branch's declaration (unit 5 (b)). See open question 1.

**R-AQ — the decree family and the connectives: waiting.** No vids. CENSUS-1g's position-keyed declaration channel (its unit 7) is not on `origin/lane/census-1b-2026-11-04` at this seat's boundary (tip `1261515`, units 1–4 and 2b), so neither family is declared; DECREE vid 54 stays carried. **DOSSIER_CAUSAL_PROSE: dead** (unit 1), nothing more.

**The 1,000 (BEFORE `3a9d42a` → AFTER the tip):** records **0 / 1,000**; every class identical (7,141 findings both; verdict STOP → STOP, the STOP being R-AM's `cert:false-presumption` 2,134 in 711 births on `FACTION_DESC_SIBLINGS` 1,884 and `OUTLOOK_HOOK_SIBLINGS` 250 — **0 on this lane's pools**, so this lane has no rise to twin or reword); `declared-share` overview 1,632 → **1,661 / 3,016** (the dominant fish lines' atoms noted), every other surface identical. Golden **0 / 525**. Red-first: `tests/domain/facts/census2fColour.test.js` (three arms red at the merge, green after). Pins re-keyed by cause: `textOf.test.js` declared arrival rows 92 → 99 (fish.dominant[1] +1, six colour rows); `arrivalFishKeyDeclared.test.js` the shrine is now a colour row.

**Not merged:** CENSUS-1g's `1261515` (unit 2b, R-AM's follow-up on the governing description) landed after this unit's measurement; it touches no table of this lane. The compose merges it.

### Where CENSUS-2g starts (supersedes the list above)

Nothing of this lane remains but the compose and the mechanism lane's channels: (a) **R-AQ** — when CENSUS-1g's position-keyed channel lands (its unit 7) and its importer census names the decree family or the connectives PRINTED, declare their lines (DECREE vid 54 first); if 1g lists them dead, list them dead; (b) twins at the landmarks and Daily Life sites if those sites are ever wired (unit 4's table); (c) catastrophic[1]'s branch declaration if a closure channel lands (R-AS stands meanwhile).

### Open questions for the chair (supersede the four above)

1. R-AS's premise: catastrophic[1]'s closure reads the event's type, not walls or a militia — does "self-gated" stand as the listing (this seat recorded it with the correction), or should the row be listed "presumes walls + militia, unverified, 0 / 1,000"?
2. DEFENSE_CONTEXT's five inert flags: dropped with the 39 (answer 2) or left in stasis with the dead text (answer 3, this seat's reading)?
3. DAILY_LIFE_TAB paragraph [1]'s "priests": a faith-presence atom, or a reword dropping the priests when the site is wired?
4. The religious_heavy refusals all resolve to row [6] (the cascade's argmax key `pattern::length::firstName` is near-constant): widen the key at the mechanism lane (it moves only refused births)?

## Phase B continued (CENSUS-2g, 2026-11-05) — the lane's closing seat

> Continues this branch from CENSUS-2f's `852a588`. Transport push only (after every unit); no pull request; no send_message. Merged `origin/lane/census-1b-2026-11-04` at its tip `0c445be` (CENSUS-1h unit 7 `8c6dcab` — R-AQ's position-keyed channel, the decree draw handed the record; unit 6 `18431ae` — row 95 wired, `dropRefused`; R-AT `0c445be`). R-AU and R-AW had not landed on that lane at this seat's boundary. ⚠ The checkout was a detached HEAD whose local branch ref is a stale old commit (`78d4c0e`); every push went `HEAD:refs/heads/lane/census-2-2026-11-04` (fast-forward), and the stale local ref was left untouched.

### Commits

| unit | commit | what |
|---|---|---|
| 1 | `c7ed534` | merge `0c445be`; the census re-taken through its door (ARRIVAL_SENSES 282 → 295 and POLITICAL_FLAVOR 11 → 13 lines: 1g's `tablePools` walker counting this lane's 2f row objects; no variant moved); `gen:dossier-prose --check` green |
| 3 | `2d4608c` | DAILY_LIFE_TAB paragraph [1]'s priests declare `priest`, carried |
| 2 | `7b7230f` | the decree family and the connectives read; the measurement pinned |
| 4 | `5ba3fe4` | POLITICAL_FLAVOR catastrophic[1] listed per R-AS amended |
| 5 | — | no twin owed (measured; below) |
| 6 | this commit | the 60 and the 1,000 as a diff; this record |

(Unit 3 was committed before unit 2 because unit 2 turned out to be a reading with no code to move; the order of the brief's units is otherwise kept.)

### Unit 1 — the merged base

The 60 at the merged base `c7ed534`: 119 findings, verdict STOP (2f's tip read 101 / CLIMB before 1g/1h; the rise is the merge's — R-AT alone moves 15 of the 60 records by 1h's own count, and R-AM's ledgering carries the 250 `OUTLOOK_HOOK_SIBLINGS` findings, R-AU not yet landed).

### Unit 2 — the decree family and the connectives (R-AQ): read whole; nothing printed declares

**The decree family** (`decreeProsePools.js`, 96 variants, vids 1–96), read line by line by R-AD's claim-or-colour test:

- **DEC-EVENT (vids 52–72, vid 54 among them) and DEC-PARTY (73–96) print on no page.** They are drawn only by `eventCatalogue.js :: scheduledEventClause` / `partyDeedClause`, and `decreeLineParts` splices them only from `options.scheduledEvent` / `options.partyDeed`. Measured on this tree: **nothing in `src` imports `eventCatalogue.js`** (static or dynamic), and **no `src` caller hands either option** (the campaign chronicle hands `registry`, `facts`, `cause`, `tick`). Dead text (R-AI / R-S): listed, left in stasis. **vid 54** ("Something in the market's arrangement is already spoken for…") presumes `market` — recorded in the ledger (`DECREE_PROSE.json`, unchanged), **not** written as a kernel mark: the mark would make the Economy pool fail-closed at the walker's seedless `scheduledEventClause` calls, and dead text is never wired. If a page ever reaches DEC-EVENT, vid 54's `market` is owed with facts handed to the clause draw (pinned: `census2gDecreeConnectives.test.js`). The DEC-PARTY lines presume only the deed's own subject (a faction, a person, a stressor, the two places), which the pool key — the deed kind, the decree's own op — guarantees (R-AP); `ease_stressor`'s "the thing itself is still here" presumes the deed's stressor remains, a field the channel does not hand (R-Z) — listed **"waiting on a field"** (moot while the block is dead).
- **The printed blocks (DEC-HAND, DEC-STANDING, DEC-FORM, DEC-OVERRIDE, DEC-FOLLOWS; vids 1–51) presume nothing about the settlement** — they speak of the decree's provenance, its standing, its form and the register's warnings: colour, no declaration. vid 28's "reaches past the town's roads" (the ledger's stop "roads / road network") is read as colour: the town's own ways, which every place holds; no atom (the chair's ruling below).
- **In-play draws** (`campaignAdvanceSession.js :: decreeChronicleLine`): 0 moved — no printed variant declares.

**The connectives** (`dossierConnectives.generated.js`, 4 lists, 12 joints): pure joinery between two sentences that declare for themselves — `{colour}` (CENSUS-2e) stands, and they are never seated (no shipped pool declares `role: modifier`, so no joint is drawn on any town). The position-keyed list stays all `null`.

**Moved:** golden 0 / 525, records 0, pages 0 (display-time: nothing in the render ledger changes — `declared-share` identical on every surface).

### Unit 3 — `priest` on DAILY_LIFE_TAB paragraph [1] (the chair's answer 3)

The cell declares `needs: [guardPresence, priest]`, `crisis: any`, carried through `textOf` until the Daily Life site is wired (R-C); no reword. The ledger row now carries both atoms and its three stops are cleared (the guards stop was declared `guardPresence` by CENSUS-2e and the ledger had not said so). 0 births move (carried). Red-first: `census2gDailyLifePriest.test.js` (2 arms red at the merge; the vocabulary arm — no senior cleric refused, one admitted — the green control). Pin re-keyed by cause: `census2eTables.test.js` paragraph [1] + `priest`.

### Unit 4 — catastrophic[1] listed (the chair's answer 1, R-AS amended); DOSSIER_CAUSAL_PROSE dead

The monster-incursion branch carries a `listing` in `POLITICAL_FLAVOR.json`: **"presumes walls + militia, unverified; printed in 0 of 1,000; both facts true on the final record wherever the branch could print; waiting on a per-branch closure declaration channel"**, and the same note sits beside the closure. No split, the branch kept (R-AK), no row declaration (its other branch is colour). DOSSIER_CAUSAL_PROSE: listed dead, nothing more. 0 births move. Pinned: `census2gCatastrophicListing.test.js`.

### Unit 5 — twins at the sites CENSUS-1h wired: none owed

`origin/lane/census-1b-2026-11-04` re-fetched: tip `0c445be`. Of the sites the brief names, 1h wired only **row 95** (the quick guide's clauses, this lane's 2d/2e declarations); row 93's non-sibling tables, the landmarks and the Daily Life cells are **not wired** (1h's unit 6 message), so no twin is owed there (a twin at an unwired site is text with no reader). Row 95 measured on the 1,000 (a scratch scanner births each seed and reads the clause's declaration against `factsOf`):

| clause (row 95) | births reaching it | refused (dropped) | twin? |
|---|---|---|---|
| scope, mesoamerican (`market`) | 92 | **38** (41%; soak1k-2, -6, -12, -73, -84, -120, …) | no — under "most births" (R-G); the sentence is built without it and reads whole |
| scope, south_asian (`market` + `institution: temple`) | 95 | **44** (46%; soak1k-13, -18, -32, -50, -133, …) | no — the same |
| scope, norse / slavic / greek | — | self-gated by `scopePhrase`'s water read (R-AS amended) | — |
| food, Surplus / Secure (`no crisis: hunger`, scoped) | 596 (Secure) | **0** | no |

**Mute slots for the compose's §10 census:** the quick guide's scope clause — mesoamerican 38 / 1,000 and south_asian 44 / 1,000 births, each over the 1-in-100 bar, so §10 owes each a line (a scope phrase that presumes no market or temple, in the house voice); the arrival `fish.lines` slot (1 / 1,000, 2f). 2e's twins owed at unwired sites (SPATIAL_TEXT, PRESSURE_SENTENCES, CAST_ABSENCES, DAILY_LIFE_TAB) stay owed to the day those sites are wired.

**R-AT re-measured (the chair's answer 4).** The six religious_heavy refusals now spread over **four** admitted rows: soak1k-73 → [4], -517 → [1], -313 → [6], -331 → [3], -378 → [6], -642 → [3] (2f: all six → [6]); the positive controls soak1k-784 ([0]) and -866 ([2]) keep their rows. As the chair predicted; the move is 1h's.

### Unit 6 — the 60 and the 1,000 (R-B: BEFORE = the merged base `c7ed534`, the 1,000 run from a scratch worktree; AFTER = the tip)

| run | records moved | every `coh:*` / `reader:*` / `A-*` class | `cert:*` | verdict |
|---|---|---|---|---|
| 60 | 0 / 60 | identical (119 findings both) | identical | STOP → STOP |
| 1,000 | **0 / 1,000** | identical (1,911 findings both): `coh:crisis-blind-prose` 0 → 0, `A-11:sea-words-landlocked` 0 → 0 (2f's fish fix holds), `A-12` 0 → 0, `reader:hook-pools` 5 → 5 (none on this lane's pools), `reader:daily-life-placeholder` 0 → 0 | `cert:false-presumption` 250 → 250 (161 births), **all** `foodBalance:OUTLOOK_HOOK_SIBLINGS` (`food: ≤ deficit` 140, `tier: <= village` 110) — R-AU's, the mechanism lane's site; **0 on this lane's pools** | STOP → STOP (the STOP is R-AU's 250, not this lane's) |

**`declared-share` (1,000, the render ledger), identical base → tip:** overview 1,661 / 3,016 (0.551); crisis 503 / 549 (0.916); tab:daily_life 409 / 409 (1.000 — DEFENSE_CONTEXT, dead text; the local narrative is carried, so its cells never reach the ledger); tab:overview 105 / 105; history 1,583 / 10,499 (0.151). The decree family and the connectives have **no surface in the soak** (the decree line prints only in a campaign advance; the connectives are never seated): 0 drawn, 0 declared.

**The undeclared register for this lane's surfaces:** unchanged — the arrival tables, POLITICAL_FLAVOR, the quick guide and the Daily Life cells are carried JS tables outside `undeclaredLines.register.json`; the decree pools sit in no register. The wiring census's `tablePools` rows for ARRIVAL_SENSES (295) and POLITICAL_FLAVOR (13) read every line undeclared because its walker cannot yet read this lane's row objects (R-AW's "shapes the walker cannot read") — the compose's re-take (R-T).

### Rows moved, by cause (never re-recorded)

- **Golden:** **0 / 525** (scratch sha-256 over `goldenCorpus()`, the merged base in a scratch worktree vs the tip: 525 / 525 identical).
- **Soak records:** 0 / 60, 0 / 1,000. **Pages:** 0 (no printed text changed; the carried `priest` returns the same text).
- **Wiring census:** re-taken in the merge (unit 1) — 2 `tablePools` rows' line counts (the merge's walker × 2f's tables, no variant moved). **Manifest / registers:** 0.
- **Pins re-keyed by cause:** `census2eTables.test.js` paragraph [1] + `priest` (unit 3).
- **Twins added:** none (unit 5). **Rewords:** none. **New tests:** `census2gDailyLifePriest`, `census2gDecreeConnectives`, `census2gCatastrophicListing`.

### Reds at the merged base, unchanged by this seat

`proseNumerics` 3 (the `DailyLifeTab.jsx` storeAiProgress line reads 236 at the merged base itself, before this seat's edit), `proseWiringCensus.walker` 14, `tabSentencesOnce` 1, `dossierContent` 1 — each at 2f's recorded count. `typecheck:ratchet` 167 / 167 green; `typecheck:domain:strict` red only on the base's +4 `crisisFactFindings.js` / +2 `composeStateProse.js`. eslint clean on every touched file. Suites run: every test file importing a touched module plus the decree, quick-guide, position-channel and R-AT suites (18 files); the full suite was not run.

### The chair's rulings this seat made (recorded, vetoable)

- **R-G1, a printed family's dead block stays in stasis even when one line presumes.** vid 54's `market` is not written as a kernel mark while DEC-EVENT prints on no page (R-AI): the mark would fail-close the pool at its only callers (the walker's seedless draws) for no reader's benefit. Pinned so the day a page reaches it, the declaration is owed.
- **R-G2, "the town's roads" is colour.** vid 28's ledger stop retires: the phrase names the place's own ways, which every settlement holds; no atom, no reword.
- **R-G3, the quick guide's scope slot is listed, not twinned.** 41% / 46% of the culture's births is below R-G's "most births"; the slot's absence leaves a whole sentence; the compose's §10 census (where it is over 1 in 100) owns the line.

### Waiting lists (this lane's, complete at its close)

- **dead (R-S, R-AI):** DAILY_LIFE_CONTEXT · TERRAIN_CONTEXT, ROUTE_CONTEXT, DEFENSE_CONTEXT (flags in stasis); DOSSIER_CAUSAL_PROSE; **DEC-EVENT and DEC-PARTY** (vid 54's `market` in the ledger); the connectives are live data but never seated.
- **waiting on a closure channel:** POLITICAL_FLAVOR catastrophic[1] (listed as above).
- **waiting on a field:** DEC-PARTY `ease_stressor` (the deed's stressor remains).
- **carried, waiting on a site:** CHECK_INST_COMPAT_LANDMARKS (6 lines), DAILY_LIFE_TAB (loading messages, the local narrative incl. paragraph [1]'s `guardPresence` + `priest`), and 2e's twins owed at those sites.
- **needs a home / a disjunction:** ARRIVAL_SENSES `livestock.lines[0]`'s grazing; ARRIVAL_PEOPLE `mixed`.
- **mute slots for §10:** quick-guide scope mesoamerican 38 / 1,000, south_asian 44 / 1,000; ARRIVAL_SENSES `fish.lines` 1 / 1,000.

### Where CENSUS-2h starts

**Nothing of this lane remains but the compose.** The compose: merges this tip, re-takes the registers and the census (R-T), runs §10's mute-slot census (the quick-guide scope lines above are the two this lane measured over the bar). Only if the mechanism lane later wires the landmarks or the Daily Life site, lands a per-branch closure channel, or a page reaches DEC-EVENT, does a seat of this lane owe work (the twins of unit 5's list; catastrophic[1]'s branch declaration; vid 54's `market`).

### Open questions for the chair

1. The quick guide's scope clause drops in 41% (mesoamerican) / 46% (south_asian) of those cultures' births: write the §10 line now at the lane (this seat's reading of R-G says no), or leave it to the compose's census?
2. DEC-EVENT / DEC-PARTY are complete, walker-tested corpora with no product caller: stasis as dead text (this seat's ruling), or is wiring EM-E6's splice into the campaign chronicle an owner decision to queue?

### Addendum — the mechanism lane moved during unit 6; merged at `f1d7605` and re-measured

`origin/lane/census-1b-2026-11-04` moved `0c445be` → `f1d7605` after unit 6's runs (CENSUS-1h **R-AU** `d035cf8` — the outlook-hook site drops a refused hook with no admitted twin; **`clergy`** `712ac76` (R-AE); and CENSUS-3h's lane via `3a71731`). Merged at `2c1c2c4` (clean; `wiring-census --check` and `gen:dossier-prose --check` green; this lane's three new suites, `census2eTables`, `clergy`, `outlookHookDropRefused` and the decree walker green, 82 / 82). The 1,000 at the merged tip vs unit 6's AFTER: **179 / 1,000 records move — the merge's** (3h's units and R-AU; this lane's units move none, proven above); the only class that moves is **`cert:false-presumption` 250 → 0** (161 births → 0), **verdict STOP → CLIMB**; `declared-share` moves only on tab:dossier (49,654 → 49,970 / 213,133) and economics (549 / 1,932 → 504 / 1,887), both 3h's; **overview, crisis, tab:daily_life, history identical**. Every `coh:*` class 0; `A-11` 0; `reader:hook-pools` 5 → 5. `clergy` (priest ∨ sacredHouse) now exists: paragraph [1] keeps `priest` per the chair's answer 3 ("Priests" names the people at work, not a house); CENSUS-5d's two lines are the ones R-AX moves to `clergy`.

### Unit 7 — the chair's message of 09:29 (R-A): R-AY and row 95's twins (`4d61d3b`)

The message arrived after the record above was pushed and inside this seat's boundary, so both items were done rather than listed. The merge it asked for (`f1d7605`) was already in (the addendum).

**(1) R-AY — a self-gated line's declaration is aligned to what its closure reads.** `scopePhrase` self-gates the three waterside scopes on the record's water (`waterAccessKind(...) !== 'none'`): the Greek harbour declares **`navigable`** (was `coast`; a river keeps a harbour, chair ruling 5); the Slavic line's **`river` is dropped** (the closure does not verify a river), and with it its sibling set (a line that declares nothing keeps no set; `census2dTables`' set count 7 → 6, by cause); Norse keeps `navigable`. **0 pages move:** the waterside scopes never pass through the resolver (Greek prints on 95 of 95 as before).

**(2) Row 95's dropped scopes take one twin each, presuming nothing (recorded as the chair's ruling).** Mesoamerican: *"built around a civic-ritual plaza, on tribute and the ritual calendar"*; south-asian: *"built around the tank, in quarters by trade and kin"*. Each is reached only where its original is refused, so the share is the refused births only: **38 of 92 mesoamerican and 44 of 95 south-asian overview strips on the 1,000 now print the twin (82 pages)**; the originals stand on 54 and 51. The 1,000 (unit 7 vs the addendum's tip): records 0 / 1,000, every class identical (1,661 findings, CLIMB); `declared-share` tab:overview drawn 105 → 187, declared 105 (the twins carry no atom); golden untouched (display-only). Red-first: `census2gScopeTwins.test.js` 4 / 4 red at the parent. Pins re-keyed by cause: `census2dTables` QUICK_GUIDE_CLAUSES 7 → 6; `quickGuideDeclaredClauses` "no market drops the clause" → "prints the twin, never the market". The ledger `QUICK_GUIDE_CLAUSES.json` moves with the table (Slavic `needs: []`, Greek `navigable`, the two twins with their shares).

**This supersedes** unit 5's R-G3 and open question 1: the quick-guide scope slots are no longer mute. **Remaining mute slots seen in the same measurement, for §10:** the Norse (38 of 98) and Slavic (30 of 82) scopes print nothing inland — the self-gated drop, pre-existing, since `INLAND_SCOPE_PHRASE` holds only the Greek form; the arrival `fish.lines` slot (1 / 1,000).

**Where CENSUS-2h starts (final):** nothing of this lane remains but the compose. The §10 census owes the two inland scope lines (Norse 38, Slavic 30 of 1,000) if it rules them mute rather than absent.
