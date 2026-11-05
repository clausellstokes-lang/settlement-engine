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

