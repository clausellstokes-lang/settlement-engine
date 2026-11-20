# FRAME-7 · SR0 results: the stakes' reason, MEASURED (nothing changed)

Written 2026-11-20 by SR0 for FRAME-7, brief `STAKES-REASON-MEASURE.md`. Worktree: a detached checkout of **`d8c2219fc`**
(the brief says `91c6723e1`; the prompt's commit is the one measured). Scripts: `tools/SR0/dump.mjs` (births a pool, one
JSON line per place with each stake row and its facts), `analyze.mjs` (count lines), `render.mjs` (what prints, by
audience). E = executed, I = inferred from code.

**Pools (E, 0 misses).** ALL: `{ settType }`, `hxd-<size>-0..49`, 300 places, 618 stake rows. ALL-C: the same seeds
born the way SAME-1's census births them (the chair's `census.mjs` at `bca8c6fe3`: `birthConfig({ ...DEFAULT_CONFIG,
settType })` after `loadGenerationLawPayloads`), 300 places, 352 rows. CRISIS: `{ settType, stressType }`,
`b7-<kind>-<size>-0..3` (C2 used all 15 kinds of `crisisCast.js :: CRISIS_NATURE`: 24 per kind = 4 per size; 360 towns
as C2's), 2,238 rows (C2 counted 1,818 at `da8b5958f`; the base moved).

## 0. The chair's 14 / 30 / 28 / 30 / 28 / 28%: reproduced, with the cause of each difference

| size | ALL (brief's cfg) | ALL-C (census cfg) | chair | the census's own line at `bca8c6fe3` (holders, top) |
|---|---|---|---|---|
| thorp | 20% loses | 18% loses | 14 | 11 holders, top 7 → 7/50 = 14 |
| hamlet | 34% loses | 32% loses | 30 | 19, top 15 → 15/50 = 30 |
| village | 34% split | 22% split = loses | 28 | 14, top 11 → **holders** 14/50 = 28 (top is 22) |
| town | 32% untouched | 22% loses | 30 | 15, top 11 → **holders** 15/50 = 30 (top is 22) |
| city | 32% untouched | 30% loses | 28 | 14, top 14 → 28 |
| metropolis | 28% loses | 28% loses | 28 | 14, top 14 → 28 |

(E for my columns; the census line read from `git show bca8c6fe3:…/census.narrative.out.txt`.) Three causes: (1) the
brief's `{ settType }` births a different crisis set than the census's `birthConfig` (more crises, more rows); (2) the
chair's village and town figures are the share of places holding ANY stakes reason, not the commonest text (the top
text is 22% at both, which ALL-C reproduces exactly); (3) one or two more crisis places per size at `d8c2219fc` than at
`bca8c6fe3` (thorp 13 vs 11, hamlet 20 vs 19, city 15 vs 14) (I: the tree moved; the census also drops leaves under 25
characters, which cuts only "the seat bears the blame", never born). On ALL-C, where a crisis exists the commonest text
covers 64–100% of crisis places.

## 1. What a Stakes row can say (`crisisCast.js :: deriveStakes`, `raisedReasonOf`)

Branches, first match wins (I): `gainsOccupier` (occupier under occupied) · `gainsHolds` (scarce name AND a member faces
a scarce house) · `gainsRival` / `gainsClaim` (the outranking rival, social/engineered; claim when `isSeatVacant`) ·
`gainsClaim` (non-governing government, social) · `gainsCrime` · `gainsVacuum` · `gainsChurch` · `gainsMerchants`. Loss:
the first `catalogFor(kind).affectedSystems` entry whose `SYSTEM_BASE` row matches by `governing` or by archetype →
`loses`; else `losesSeat` (governing, social/engineered). gains+loss → `split`; else the K22/K24 row (`RAISED_TO_LEAD`
→ `leadsRevolt`; `raisedReasonOf` over `RAISED_BY_CRISIS` → 23 keys from `holdsFood` to `pressedToJudge`); else
`untouched`.

**Never born on any pool (E):** `losesSeat`, `gainsHolds`, `holdsDebt`, `someHoldDebt`, `warDivides`,
`pressedToJudge`. `losesSeat` is unreachable (I): every social and engineered kind lists `public_legitimacy` (a
`governing` base) in its affected systems, so the governing power always takes `loses` first.

**Rows by key** (E; the commonest three per size, share of that size's rows):

| size | ALL | CRISIS |
|---|---|---|
| thorp | loses 29, untouched 18, split 15 | loses 35, split 18, untouched 10 |
| hamlet | loses 24, untouched 18, split 16 | loses 23, split 20, untouched 18 |
| village | split 32, untouched 18, loses 17 | split 23, loses 19, untouched 17 |
| town | untouched 32, loses 24, split 9 | untouched 32, loses 24, split 11 |
| city | untouched 54, loses 27, gainsCrime 4 | untouched 48, loses 25, gainsCrime 4 |
| metropolis | untouched 44, loses 25, claimsSuccession 8 | untouched 46, loses 24, gainsCrime 4 |

Pool totals: ALL untouched 35%, loses 24%, split 11%; CRISIS untouched 34%, loses 24%, split 10%, gainsChurch 4%.

**Places holding each of the commonest five texts, CRISIS pool** (E): thorp loses 80, split 40, untouched 27, gainsRival
12, holdsFood 7 · hamlet loses 80, untouched 57, split 48, gainsVacuum 45, gainsRival 15 · village loses 82, split 77,
untouched 57, gainsVacuum 47, gainsChurch 40 · town untouched 97, loses 87, split 53, gainsChurch 45, gainsCrime 28 ·
city untouched 100, loses 98, gainsCrime 35, gainsChurch 20, split 20 · metropolis untouched 100, loses 95, gainsCrime
38, split 25, gainsChurch 23 (%). ALL pool: in `analyze` output, TOP1–5 per size (e.g. hamlet loses 34, untouched 22,
gainsVacuum 18, split 14, gainsChurch 10).

## 2. What tells two rows apart (the ceiling: the commonest value's share of a size's places)

`loses` (E). Matched system, pool-wide on CRISIS: `public_legitimacy` by governing 235, `defense_readiness` 94,
`trade_connectivity` 86, `social_trust` 64, `tax_revenue` by governing 48, `law_order` 12, `healing_capacity` 4. Plain
meanings exist already in `CAST_REASONS.bruntBase` (the blame on the house; its people on the walls; its trade cut; …).

| fact keyed on (`loses`) | ALL: max share of a size's places | CRISIS: max share |
|---|---|---|
| crisis kind | 4–10% (5–10 values a size) | 7% (structural: 4 of 60 per kind) |
| matched system (+ by) | 10–24% | 63–67% (public_legitimacy) |
| archetype | 16–34% | 42–80% (government) |
| governs / plural | 20–34% | 80–88% |
| first member's house (family) | 8–22% | 17–73% |
| first lever house | 8–32% (mostly "none") | 13–80% (mostly "none") |
| kind + matched system | 4–10% (5–17 tuples) | 7% (15–28 tuples) |
| kind + archetype + governs | 4–10% | 7% (15–45 tuples) |
| kind + archetype + house | 4–10% | 5–7% (19–66 tuples) |

`split` (E): kind alone 2–8% (ALL), 7% (CRISIS); matched system 2–22% / 10–40%; archetype up to 22% / 47% (religious,
village). `untouched` (E): kind 6–10% / 7%; archetype up to 32% (arcane, city) / 100% (arcane, city and metropolis);
plural 22–32% / up to 100%. **The fact that splits `loses` (and `split`, `untouched`) under 15% on every size is the
crisis kind; kind + matched system is the same ceiling with the system's plain meaning.** No single non-kind fact clears
15% everywhere. `losesSeat`: 0 rows (§1).

## 3. Who reads the reason's TEXT (src) — 4 text readers, 2 would break under VARIED text

1. `crisisCast.js :: bruntCandidates` — `k.reason === STAKE_REASONS.split` (the losers set). Reworded constant: safe.
   Varied split text: a split power drops out of the brunt pool (the cast moves). **Breaks.**
2. `crisisPage.js :: stakeShown` — `k.reason === STAKE_REASONS.untouched` routes to answers / at odds / no row, and
   `reason.replace(/^it\b/, 'they')` for a plural. Varied untouched text: rows print that should be silent. **Breaks.**
3. `crisisHooks.js :: loserClause` (Plot Hooks, the Tonight sheet) — `loser.reason.replace(/\bits\b/g, 'their')` for a
   plural loser. A wording whose possessive is not "its" is not folded (agreement slip, not a crash).
4. `crisisPage.js :: composeCrisisPage`'s `speak` (`speakTierNoun`) re-speaks "the town" in a reason: `creditorAgent`
   prints "the creditor the hamlet owes" (E, b7-indebted-hamlet-0). A transform, not a key.

Not text readers (I): `crisisPage.js :: creditorOf` (keys on the power's `desc` and the `RAISED_BY_CRISIS` KEY name, so a
reworded `creditorAgent` text is safe); `crisisHooks.js :: leverAndLoserOf`, `wavererCandidates`, `exploiterCandidates`,
`scapegoatCandidates`, `collaboratorCandidates`, `coherence/crisisCastFindings.js` (all read `stake`);
`factionRename.js`, `display/publicSafe.js :: dropStakes` (read `factionId`); `pdf/lib/crisisPrint.js :: stakeLines`
and `foundry/journalPages.js` (print the composed text). Fix for 1–2 if varied: key on a stored key, not the text (I).

**Tests pinning a reason's text** (E, grep): `tests/domain/crisisCast.test.js` "the losing house and the outranking
rival are told in what the reader can see" (`loses`, `gainsRival` toBe literal); `tests/domain/crisisHooks.test.js`
"the lever hook names the house the players can push, its holder, and the faction that loses with the reason" (and a
`toMatch` on `loses`); `tests/domain/tailCrisisBatch3.test.js`, `tailCrisisBatch4.test.js` (seed tables: `loses`,
`gainsVacuum`, `gainsClaim`); `tests/domain/tailCrisisBatch7.test.js`, `tailCrisisBatch8.test.js` "KEEPS the slave
revolt's leadership on its K22 row" (`leadsRevolt`, `untouched`); `tests/components/crisisTab.test.jsx` "one section per
crisis, worst first…" and `tests/domain/crisisPage.test.js` "a two-crisis town composes two sections…" (`untouched`);
registers holding literals: `tests/lint/presumedThings.widened.register.json` (gainsVacuum, gainsChurch,
gainsOccupier), `tests/lint/presumptionClasses.register.json` (warDivides).

## 4. Where it prints (E: 45 births, b7-<kind>-{hamlet,town,city}-0; audiences owner / player / gallery)

| surface | what | audiences | one real line |
|---|---|---|---|
| Crisis tab (`composeCrisisPage` + `stakeOpening`) | every stake but the untouched | all three, identical counts (loses 73 each) | b7-famine-hamlet-0: "The Elder Council loses · its own people feel the crisis first" |
| PDF chapter (`crisisPrint.js :: stakeLines`) | same rows, `subject verb · reason` | as the page (I) | as above |
| Foundry journal (`journalPages.js`) | `- **name** stake: reason.` | as the page (I) | "- **Elder Council** loses: its own people feel the crisis first." (I, template) |
| Plot Hooks + Tonight sheet (`crisisHooks.js :: loserClause`) | the FIRST `loses` row only, after "because" | owner and player (27 each) | b7-slave_revolt-hamlet-0: "…if it gives way, the Headman's Authority loses most, because its own people feel the crisis first." |

The `untouched` text is **printed nowhere** (E: 112 stored, 0 printed on any audience): the page shows "must answer for
it · it governs here", "is already at odds · in its own quarrel with X", or no row. A wording must fit after "·" on the
tab, after ":" in the journal, and after "because" in a hook.

## 5. What the share veil may hide (`display/galleryVeil.js :: CARD_KINDS`, `people/cardVeil.js`, `display/publicSafe.js`)

Never hidden (floor): the power's name (so plural), `category` (so archetype), `power`, `isGoverning`; an institution's
name and category; a person's `memberships`. Hideable: a power's `desc` / `crisisNote` (the `description` field), goals,
members; a person's `institution` (their house; stripped where `institution.veiled`), a criminal or clandestine house
whole, a hidden power whole (its stakes row dropped by `dropStakes`), the capture reading. The crisis kind and the
catalog's affected systems are not cards (I). **So `needs` may name: kind, matched system, archetype, governs, plural.
Not: a member's house, a power's `desc`** (note: `raisedReasonOf` itself keys on `desc`; the stored text is fixed at birth).

## 6. The named items

(a) `creditorAgent` (E): ALL 9 rows in 9 places (thorp 3, hamlet 2, village 1, city 1, metropolis 2); ALL-C 2; CRISIS 24
(4 per size, every indebted town). Its stake is `split`, so it prints on the tab and never in a hook.
(b) Order (I): `steps/assembleSettlement.js` writes `generationCoherenceReceipt`; `steps/resolveCrisisCast.js` (deps
`assembleSettlement`) writes `cast` after it, and rebuilds the receipt only when it mints a temporary person. No battery
reads a stake's reason directly; the receipt's `hook-truth-record` (`coherence/hookTruthRecord.js` →
`crisisHooksOf`) reads the hook text that carries the `loses` reason, but only on that rebuilt receipt.
(c) "its" after a plural power, printed rows (E): CRISIS **216** (`loses` 150, `guildsThreatened` 28,
`revoltCutsLabour` 26, `termsWithOccupier` 8, `claimantsNeedIt` 4); ALL **52** (`loses` 44, `guildsThreatened` 4,
`claimantsNeedIt` 3, `termsWithOccupier` 1). A bare "it" widens this to 400 / 116 printed rows, but most of those
"it"s are the crisis's ("gains and loses by it at once", 81 `split` rows on CRISIS) and need no fold (I); the holder's
"it" opens `holdsFood`, `courted`, `warNeedsIt`, `creditorAgent` and the other K24 rows. The hook already folds `loses`;
the tab does not.

## 7. The existing pattern

`src/domain/dossier/hookLines.js` (`HOOK_LINE_POOLS`, `createConflictHookDraw`, `foodGapHookLine`): authored rows `{ text,
needs?, excludes? }`, chosen with no rng by an fnv key over the record's own identity, resolved through
`domain/facts/drawDeclared.js :: drawDeclared` (`key`, `poolId`, `surface`, `drawKind`). Guarded by
`tests/lint/drawDeclaredKeys.walker.test.js` (every caller passes a keyed `key`), `tests/domain/dossier/hookLinePoolsDeclared.test.js`,
`tests/lint/declaredLineShape.test.js`. The cast already uses the same resolver for its siblings
(`crisisCast.js :: CAST_REASON_SIBLINGS`, `resolveSibling`). Plain keyed variants without `needs`:
`kernel/proseHash.js :: pickVariant` over `data/institutionDescVariants.js`.
